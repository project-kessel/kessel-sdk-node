# Performance Guidelines

Guidelines specific to `@project-kessel/kessel-sdk` for avoiding common performance pitfalls.

## 1. Reuse a Single Client Instance

`ClientBuilder.build()` / `buildAsync()` creates a new `@grpc/grpc-js` client each time, which opens a new underlying HTTP/2 channel. Create one client at startup and share it across your application.

```ts
// Good: module-level singleton
const client = new ClientBuilder(process.env.KESSEL_ENDPOINT!)
  .oauth2ClientAuthenticated(oAuth2ClientCredentials)
  .buildAsync();

export { client };
```

Calling `builder.build()` in a request handler creates a new TCP connection per request and leaks channels. Multiple `build()` calls on the same builder produce independent client instances -- they do not share a connection.

## 2. Use `buildAsync()` Over Manual Promisification

The SDK provides two client styles:

- `builder.build()` -- callback-based gRPC client
- `builder.buildAsync()` -- promise-based client via `promisifyClient()`

`buildAsync()` uses a `Proxy` that caches the promisified method wrappers per-property. This avoids allocating a new `promisify()` wrapper on every call. Prefer it over manually calling `promisify(stub.method.bind(stub))` per method.

Streaming methods (`streamedListObjects`, `streamedListSubjects`) are **not** promisified -- they already return server-streaming call objects that are `AsyncIterable`. The proxy detects `responseStream: true` in the service definition and passes them through untouched.

## 3. Token Caching Is Built In -- Do Not Bypass It

`OAuth2ClientCredentials` caches tokens automatically with a 5-minute expiration window (`EXPIRATION_WINDOW_MILLI = 300000`). When used with `oauth2CallCredentials()`, the gRPC metadata generator calls `getToken()` on every RPC, which returns the cached token if still valid.

Rules:
- Create **one** `OAuth2ClientCredentials` instance per identity. Token caching is instance-scoped (`this.tokenCache`).
- Do not call `getToken(true)` (force refresh) unless handling a 401/UNAUTHENTICATED error.
- The `oauth4webapi` dependency is lazy-loaded via `import()` on first use, so construction is cheap.

**Concurrent request hazard:** There is no deduplication of in-flight token refreshes. If the cache expires and 50 RPCs fire simultaneously, up to 50 token requests may hit the OAuth server. For high-concurrency services, consider wrapping `getToken()` or adding your own single-flight logic.

## 4. Use Bulk APIs Instead of Parallel Individual Checks

The SDK provides `checkBulk`, `checkSelfBulk`, and `checkForUpdateBulk` endpoints that batch multiple permission checks into a single RPC. These are significantly more efficient than issuing individual `check` calls in parallel.

```ts
// Good: single RPC for N checks
const response = await client.checkBulk({
  items: [item1, item2, item3],
});

// Bad: N RPCs
const results = await Promise.all([
  client.check(req1),
  client.check(req2),
  client.check(req3),
]);
```

The bulk response preserves item order and includes per-item error handling via `pair.error`, so partial failures do not abort the entire batch.

## 5. Use Streaming APIs for Large Result Sets

`streamedListObjects` and `streamedListSubjects` return server-streaming RPCs. Consume them with `for await...of` to process results incrementally without buffering the entire response in memory.

```ts
const stream = client.streamedListObjects(request);
for await (const response of stream) {
  processObject(response.object);
}
```

For paginated iteration, use the `listWorkspaces` helper from `kessel/rbac/v2` as a reference pattern. It uses `continuationToken` from each response to issue subsequent streamed requests, with a default page limit of 1000. Key points:
- Stop iterating when `continuationToken` is empty or the stream yields no responses.
- Each page is a separate gRPC stream call; the helper manages this automatically.

## 6. Choose the Right Consistency Level

Every check and list request accepts an optional `consistency` field that trades latency for freshness:

| Mode | When to use | Latency impact |
|---|---|---|
| `minimizeLatency: true` | Read-heavy dashboards, UI filtering | Lowest |
| `atLeastAsFresh: { token }` | Read-after-write with a known token | Medium |
| `atLeastAsAcknowledged: true` | Must see all acknowledged writes | Higher |
| Omitted | Server default (typically `minimizeLatency`) | Varies |

For `reportResource`, `writeVisibility` controls the write side:
- `MINIMIZE_LATENCY` (default): Returns quickly; subsequent checks may not reflect the write.
- `IMMEDIATE`: Waits for acknowledgment; use only when you need to `check` immediately after writing.

## 7. gRPC Channel Options

When constructing clients via the vanilla API (not `ClientBuilder`), you can pass `@grpc/grpc-js` `ClientOptions` as the third argument:

```ts
const stub = new KesselInventoryServiceClient(
  process.env.KESSEL_ENDPOINT!,
  ChannelCredentials.createInsecure(),
  {
    "grpc.keepalive_time_ms": 30000,
    "grpc.keepalive_timeout_ms": 10000,
  },
);
```

The `ClientBuilder` currently does not expose channel options. If you need keepalive or message size tuning, use the vanilla constructor.

## 8. Use RBAC Helper Functions for Request Construction

The `kessel/rbac/v2` module provides factory functions (`principalSubject`, `workspaceResource`, `subject`, etc.) that produce correctly-shaped protobuf request objects. Use them instead of constructing `ResourceReference` / `SubjectReference` objects manually to avoid malformed requests that waste round trips.

## 9. Client Cleanup

`@grpc/grpc-js` `Client` instances hold open HTTP/2 connections. Call `client.close()` during graceful shutdown to release resources. The SDK does not add any wrapper around this -- use the underlying gRPC method directly. Failing to close clients in short-lived processes (CLI tools, serverless functions) can cause the Node.js process to hang on exit.
