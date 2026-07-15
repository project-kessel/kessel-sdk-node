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
