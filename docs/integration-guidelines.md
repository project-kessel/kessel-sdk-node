# Integration Guidelines

## Module Import Paths

All imports use deep subpath exports defined in `package.json`. Never import from the package root.

```typescript
// Correct
import { ClientBuilder } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";
import { CheckRequest } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/check_request";
import { fetchOIDCDiscovery, OAuth2ClientCredentials } from "@project-kessel/kessel-sdk/kessel/auth";
import { oauth2CallCredentials } from "@project-kessel/kessel-sdk/kessel/grpc";
import { fetchDefaultWorkspace, principalSubject } from "@project-kessel/kessel-sdk/kessel/rbac/v2";

// Wrong - no root export exists
import { ClientBuilder } from "@project-kessel/kessel-sdk";
```

Available export paths:
- `kessel/inventory/v1beta2` -- Main inventory service (check, report, delete, streaming)
- `kessel/inventory/v1beta2/*` -- Individual request/response types by filename
- `kessel/inventory/v1` -- Health service only
- `kessel/auth` -- OAuth2 client credentials, OIDC discovery
- `kessel/grpc` -- gRPC call credentials helper
- `kessel/rbac/v2` -- RBAC workspace REST API, resource/subject helpers
- `promisify` -- Generic gRPC client promisification utility

## Client Construction

### Builder API (preferred)

Use `ClientBuilder` from the versioned index. It wraps the raw gRPC stub with a fluent configuration API.

- `build()` returns a callback-style gRPC client
- `buildAsync()` returns a promisified client where unary methods return `Promise` instead of accepting callbacks
- Streaming methods (e.g. `streamedListObjects`) are already `AsyncIterable` in both modes

```typescript
const client = new ClientBuilder("host:port")
  .insecure()       // local dev
  .buildAsync();

const response = await client.check(request);
```

### Vanilla (raw stub) API

Instantiate the generated gRPC client directly with `@grpc/grpc-js` credentials. Use `promisify` from Node's `util` module to convert individual methods, or use `promisifyClient` from `@project-kessel/kessel-sdk/promisify` to wrap the entire client.

```typescript
import { KesselInventoryServiceClient } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/inventory_service";
const stub = new KesselInventoryServiceClient(target, ChannelCredentials.createInsecure());
```

## Authentication Modes

### Insecure (local development only)

```typescript
new ClientBuilder(target).insecure().buildAsync();
```
No TLS, no auth. Cannot combine with call credentials -- the builder throws `"Invalid credential configuration: can not authenticate with insecure channel"`.

### Unauthenticated secure

```typescript
new ClientBuilder(target).unauthenticated().buildAsync();
```
Uses TLS (`credentials.createSsl()`) by default. Pass custom `ChannelCredentials` as an argument to override.

### OAuth2 Client Credentials (production)

Two-step process:

1. **Discover the token endpoint** via OIDC:
   ```typescript
   const discovery = await fetchOIDCDiscovery(issuerUrl);
   ```
   This calls `/.well-known/openid-configuration` on the issuer URL and extracts `token_endpoint`.

2. **Create credentials and attach to builder**:
   ```typescript
   const auth = new OAuth2ClientCredentials({
     clientId: "...",
     clientSecret: "...",
     tokenEndpoint: discovery.tokenEndpoint,
   });
   const client = new ClientBuilder(target)
     .oauth2ClientAuthenticated(auth)
     .buildAsync();
   ```

`oauth4webapi` is an **optional dependency**. It is lazy-loaded on first use of `fetchOIDCDiscovery` or `OAuth2ClientCredentials.getToken()`. Install it explicitly if using OAuth.

### Token caching

`OAuth2ClientCredentials` caches tokens internally. Tokens are refreshed automatically when within 5 minutes (`EXPIRATION_WINDOW_MILLI = 300000`) of expiration. Default TTL when server omits `expires_in` is 1 hour. Call `getToken(true)` to force refresh.

### Custom call credentials

```typescript
new ClientBuilder(target).authenticated(callCredentials, channelCredentials).buildAsync();
```

## RBAC REST API Integration

The RBAC module (`kessel/rbac/v2`) provides REST helpers for workspace management. These use the **Fetch API** (not gRPC).

### Workspace fetching

```typescript
const workspace = await fetchDefaultWorkspace(rbacBaseUrl, orgId, auth);
const root = await fetchRootWorkspace(rbacBaseUrl, orgId, auth);
```

- Calls `GET /api/rbac/v2/workspaces/?type=default|root`
- Sets header `x-rh-rbac-org-id` with the org ID
- `auth` is optional `AuthRequest` -- create one via `oauth2AuthRequest(oAuth2ClientCredentials)`
- Throws if response is not 200 or if exactly 1 workspace is not returned

### Resource and subject helpers

Use these factory functions instead of manually constructing references:

| Function | Returns | Usage |
|---|---|---|
| `principalSubject(id, domain)` | `SubjectReference` | Subject with principal resource `{resourceId: "domain/id"}` |
| `principalResource(id, domain)` | `ResourceReference` | Resource for a principal |
| `workspaceResource(id)` | `ResourceReference` | Resource for a workspace |
| `roleResource(id)` | `ResourceReference` | Resource for a role |
| `subject(resource, relation?)` | `SubjectReference` | Generic subject from any resource |
| `workspaceType()` | `RepresentationType` | `{resourceType: "workspace", reporterType: "rbac"}` |
| `roleType()` | `RepresentationType` | `{resourceType: "role", reporterType: "rbac"}` |

All RBAC resources use `reporter.type: "rbac"`.

### Listing workspaces (paginated streaming)

`listWorkspaces` is an async generator that handles pagination automatically:

```typescript
for await (const response of listWorkspaces(client, principalSubject("alice", "redhat"), "view_document")) {
  console.log(response.object?.resourceId);
}
```

It uses `streamedListObjects` internally with page size 1000 and follows `continuationToken` until exhausted. Accepts an optional initial continuation token for resumption.

## Streaming Responses

Streaming RPCs (e.g. `streamedListObjects`, `streamedListSubjects`) return `AsyncIterable` and are **not** promisified by `buildAsync()` -- they are already async iterators in both `build()` and `buildAsync()` modes.

```typescript
for await (const response of client.streamedListObjects(request)) {
  // process each response
}
```

## Credential Security Rules

- Call credentials (OAuth tokens) require a secure channel. The builder validates this at configuration time.
- `insecure()` clears both call and channel credentials.
- The last authentication method called on the builder wins (methods are not additive).
- Default `build()` behavior (no auth method called) uses SSL channel credentials.

## Environment Variables

Examples use these env vars (see `examples/.env.sample`):

| Variable | Purpose |
|---|---|
| `KESSEL_ENDPOINT` | gRPC target (e.g. `localhost:9000`) |
| `AUTH_CLIENT_ID` | OAuth client ID |
| `AUTH_CLIENT_SECRET` | OAuth client secret |
| `AUTH_DISCOVERY_ISSUER_URL` | OIDC issuer (e.g. `https://sso.server/auth/realms/the-realm`) |

## Protobuf Code Generation

TypeScript types in `src/kessel/inventory/`, `src/google/`, and `src/buf/` are auto-generated by `protoc-gen-ts_proto`. Do not edit these files. Regenerate using `buf` (see `buf.gen.yaml`).

## Build System

- Dual CJS/ESM output: `dist/cjs/` and `dist/esm/` with separate `package.json` type markers
- Type declarations: `dist/types/`
- Build command: `npm run build` (runs all three in parallel via `npm-run-all`)
- Tests use `jest` with `ts-jest` transform
- Node >= 20 required
