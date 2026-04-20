# Error Handling Guidelines

Guidelines for error handling in the kessel-sdk-node codebase.

## Error Sources

This SDK has four distinct error surfaces. Each has different conventions.

### 1. gRPC ServiceError (unary calls)

All generated gRPC client methods use the `ServiceError | null` callback pattern from `@grpc/grpc-js`. When using `buildAsync()`, the promisify layer converts these to rejected promises. `ServiceError` has `code` (gRPC status code number), `details` (string message), and `metadata`.

Rules:
- When using `buildAsync()`, catch rejected promises. When using `build()`, check the callback `error` parameter.
- Type errors caught from promisified calls as `ServiceError` (import from `@grpc/grpc-js`).
- Do not confuse `ServiceError.code` (gRPC status enum, e.g. 5 = NOT_FOUND) with HTTP status codes.

### 2. gRPC stream errors

Streaming methods (`streamedListObjects`, `streamedListSubjects`) return `ClientReadableStream` and are NOT promisified -- they remain as async iterables. Errors surface as thrown exceptions during `for await` iteration.

Rules:
- Wrap `for await (const response of stream)` in try/catch.
- The `listWorkspaces` helper propagates stream errors to its caller; callers must catch them.

```ts
try {
  for await (const response of listWorkspaces(client, subject, "view_document")) {
    // process response
  }
} catch (e) {
  console.error("Stream error:", e);
}
```

### 3. RBAC HTTP errors (fetch-based)

The `fetchWorkspace` / `fetchDefaultWorkspace` / `fetchRootWorkspace` functions use the native `fetch` API and throw plain `Error` objects. Two distinct failure modes:

- **Non-200 status**: Throws `"Error while fetching the workspace of type ${workspaceType}. Call returned status code ${response.status}"`.
- **Unexpected result count**: Throws `"unexpected number of ${workspaceType} workspaces: ${body?.data?.length}"` when `body.data.length !== 1`.

Rules:
- These functions throw `Error`, not `ServiceError`. Do not check for gRPC status codes.
- Network-level fetch failures (DNS, connection refused) propagate the native error message.
- Auth errors from `AuthRequest.configureRequest()` propagate before `fetch` is called; if auth fails, `fetch` is never invoked.

### 4. OAuth / Authentication errors

Rules:
- `fetchOIDCDiscovery` throws `Error("Token endpoint could not be discovered from issuer URL.")` when the OIDC response lacks a `token_endpoint`. It also propagates `oauth4webapi` errors for network failures or malformed responses.
- `OAuth2ClientCredentials.getToken()` throws `Error("No access token received from OAuth server")` when the token response lacks `access_token`.
- Invalid issuer URLs throw the native `URL` constructor error (via `new URL()`).
- Token errors are deferred -- `oauth2CallCredentials()` creates the credential object successfully; errors only surface when the credential is used during a gRPC call.

## Bulk Check Response Errors

Bulk endpoints (`checkBulk`, `checkSelfBulk`, `checkForUpdateBulk`) use a **per-item error model** instead of failing the entire request. Each response pair has an optional `error` field of type `google.rpc.Status`.

Rules:
- A successful bulk RPC does NOT mean every item succeeded. Always check `pair.error` on each `CheckBulkResponsePair`.
- The `Status` type has `code` (google.rpc.Code integer), `message` (string), and `details` (Any[]).
- `pair.item` and `pair.error` are mutually exclusive -- when `error` is present, `item` is undefined.

```ts
const response = await client.checkBulk(request);
for (const pair of response.pairs ?? []) {
  if (pair.error) {
    console.error(`Check failed for ${pair.request?.resource?.resourceId}: ${pair.error.message}`);
    continue;
  }
  // pair.item.allowed is Allowed enum
}
```

## Allowed Enum: Not an Error

`ALLOWED_FALSE` is a valid response, not an error. `ALLOWED_UNSPECIFIED` (0) is the protobuf default and typically means the field was not set. `UNRECOGNIZED` (-1) indicates a value the client does not understand.

Rules:
- Never treat `ALLOWED_FALSE` as an error condition.
- Handle `ALLOWED_UNSPECIFIED` defensively -- it may indicate a server-side issue.

## ClientBuilder Validation Errors

The `ClientBuilder` throws synchronous `Error` for configuration problems:

- `"Invalid target type"` -- empty or non-string target.
- `"Invalid credential configuration: can not authenticate with insecure channel"` -- combining call credentials with `credentials.createInsecure()`.
- `"Client does not have a ServiceDefinition and one was not provided"` -- calling `promisifyClient` on a client without a service definition.

Rules:
- These are programming errors. Catch them during initialization, not at call time.
- `insecure()` and `authenticated()` are mutually exclusive in practice. Calling `authenticated()` then `insecure()` resets to insecure (last call wins).

## Test Conventions

- Use `rejects.toThrow("exact message substring")` for async error assertions.
- Use `expect(() => ...).toThrow("message")` for sync validation errors.
- Test both the error path and the non-error path for every function that can throw.
- For auth errors, mock `oauth4webapi` methods with `mockRejectedValue(new Error(...))`.
- For HTTP errors, mock `global.fetch` with `mockResolvedValue({ status: 404 })` (or other specific status codes) or `mockRejectedValue(new Error("Network..."))`.
- Auth configuration errors (empty clientId, etc.) do not throw at construction time -- they throw at `getToken()` time.

## Example Error Handling Pattern

Most examples use a top-level try/catch with `console.log` for errors:

```ts
(async () => {
  try {
    // all SDK calls here
  } catch (error) {
    console.log("gRPC error occurred during Check:");
    console.log(`Exception:`, error);
  }
})();
```

Some examples (particularly RBAC examples) use `console.error`:

```ts
} catch (e) {
  console.error(`Error received when fetching workspace`, e);
}
```

Rules:
- Always wrap SDK entry points in try/catch.
- Log the full error object (not just `e.message`) to preserve stack traces and gRPC metadata.
- Use the non-null assertion `process.env.VAR!` for required env vars in examples only -- production code should validate config before constructing clients.

## Do Not

- Do not define custom error classes. The SDK uses plain `Error` and `@grpc/grpc-js` `ServiceError`.
- Do not catch errors inside SDK source to suppress them. Let them propagate to the caller.
- Do not modify generated protobuf files (`DO NOT EDIT` header). Error types like `Status` come from generated code.
- Do not conflate gRPC `ServiceError.code` with `google.rpc.Status.code` with HTTP status codes. They are three different code spaces.
