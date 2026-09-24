# Auth Module Guidelines

Rules for working in `src/kessel/auth/` -- OAuth2 client credentials, OIDC discovery, and the `AuthRequest` abstraction.

## Module Overview

This module provides:

- `fetchOIDCDiscovery()` -- OIDC well-known endpoint discovery
- `OAuth2ClientCredentials` -- token retrieval, caching, and auto-refresh
- `oauth2AuthRequest()` -- wraps OAuth credentials for HTTP `fetch()` calls
- `AuthRequest` interface -- generic request auth adapter used by the RBAC module

All code is hand-written (not generated). The single source file is `index.ts`.

## oauth4webapi Is an Optional Dependency

`oauth4webapi` is loaded lazily via dynamic `import("oauth4webapi")`. This is intentional -- consumers who do not use OAuth should not need the package installed.

- Never add a static `import` of `oauth4webapi` at the module top level.
- All `oauth4webapi` functions are accessed through `importOAuth4WebApi()` or stored on the class instance after `ensureIsInitialized()`.
- The `import type * as oauth from "oauth4webapi"` at the top is a type-only import and is safe.

## Token Caching Internals

- `EXPIRATION_WINDOW_MILLI` (300000ms / 5 minutes) -- tokens are refreshed this far before actual expiry.
- `DEFAULT_EXPIRE_IN_SECONDS` (3600 / 1 hour) -- fallback when `expires_in` is missing from the OAuth response.
- `expires_in: 0` is valid and means "immediately expired" -- do not treat it as missing.
- The cached `RefreshTokenResponse` is frozen via `Object.freeze()`. Never mutate returned token objects.

## Thundering Herd / Promise Coalescing

`getToken()` uses `this.pendingRefresh` to deduplicate concurrent token requests. If N callers hit `getToken()` while the cache is stale:

- The first caller starts the refresh and stores its Promise in `pendingRefresh`.
- Subsequent callers loop on `pendingRefresh`, awaiting the in-flight result.
- On success, all callers get the same cached token.
- On failure, the next waiter retries (cascading retry), not all at once.

Do not remove or simplify the `while (this.pendingRefresh)` loop -- it handles the cascading-retry-after-failure case.

## AuthRequest Interface

`AuthRequest` is the SDK pattern for attaching auth to non-gRPC HTTP calls (used by `rbac/v2.ts`):

```typescript
interface AuthRequest {
  configureRequest: (request: Request) => Promise<void>;
}
```

- `oauth2AuthRequest()` creates one from `OAuth2ClientCredentials`.
- The `configureRequest` method mutates the `Request` headers in place (`request.headers.set(...)`).
- Auth is optional on RBAC workspace fetch functions. When omitted, the request is unauthenticated.

## Token Endpoint Retry

Token endpoint requests retry transient failures with bounded exponential backoff and jitter. Retry behavior is applied only while obtaining a token, not to arbitrary API calls or OIDC discovery.

### Configuration

Pass an optional `RetryOptions` object as the second constructor argument:

```typescript
const credentials = new OAuth2ClientCredentials(auth, {
  maxRetries: 5, // default: 3 (0 disables retries)
  baseDelay: 1.0, // default: 0.5 seconds
  maxDelay: 10.0, // default: 2.0 seconds
  jitter: "none", // default: "full"
});
```

With defaults, the delay sequence caps at 0.5, 1, and 2 seconds (exponential from `baseDelay` of 0.5, doubling each retry, capped at `maxDelay` of 2.0). When jitter is `"full"`, the actual delay is randomized between 0 and the computed cap.

### Retryable Failures

- **Connection/network errors** — `TypeError` from `fetch` (connection refused, DNS failure, socket closed before response headers)
- **HTTP 429** — Too Many Requests
- **HTTP 5xx** — Server errors (500–599)

### Non-Retryable Failures

- **HTTP 400/401/403** — Client errors are returned without retrying
- **AbortError** — Caller cancellation is never mistaken for a retryable transport failure
- **Missing access_token** — Malformed success responses are not retried

### How Retry Interacts with Thundering Herd Prevention

Retry runs inside the existing promise coalescing (`pendingRefresh`). When N callers observe a stale token and one starts a refresh:

- The refresh may internally retry several times on transient failures
- All N callers see the same final outcome (success or failure)
- At most one concurrent retry loop runs at a time

### HTTP Status Checked Before oauth4webapi

The HTTP response status is checked before calling `processClientCredentialsResponse`. This prevents oauth4webapi from converting 5xx responses into opaque exceptions that lose the original status code — the same pattern used by the Go SDK (`statusCapturingTransport`) and Python SDK (response hook).

## ClientSecretPost Authentication

The SDK uses `oauth.ClientSecretPost` (secret in POST body), not `ClientSecretBasic` (HTTP Basic). Do not change this without coordinating with the Kessel auth infrastructure team.

## Testing Conventions

Tests are in `__tests__/index.ts`. Key patterns:

- Mock `oauth4webapi` at the module level with a plain object of `jest.fn()` calls:
  ```typescript
  const mockOAuth = { discoveryRequest: jest.fn() /* ... */ };
  jest.mock("oauth4webapi", () => mockOAuth);
  ```
- Access private state via `(instance as any).tokenCache = { ... }` for cache setup.
- Test concurrent refresh behavior with `Promise.all` and `Promise.allSettled`.
- Use `jest.clearAllMocks()` and `jest.resetModules()` in `beforeEach`.
- Verify SSO call counts with `expect(mock).toHaveBeenCalledTimes(n)` -- coalescing tests assert exactly 1 call for N concurrent requests.

## Exports

This module is a public subpath: `@project-kessel/kessel-sdk/kessel/auth`. If you add new exports, they are immediately available to consumers. Keep the export surface minimal.

## Do Not

- Add synchronous validation in the constructor -- auth config errors surface at `getToken()` time.
- Import from `oauth4webapi` statically -- it must remain an optional dependency.
- Define custom error classes -- use plain `Error`.
- Hardcode token endpoint URLs -- always use `fetchOIDCDiscovery()` first.
