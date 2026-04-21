# Security Guidelines

Rules and conventions for secure development in `@project-kessel/kessel-sdk`.

## 1. OAuth 2.0 Authentication

### Use the two-step OIDC discovery pattern
Always discover the token endpoint via `fetchOIDCDiscovery` before constructing `OAuth2ClientCredentials`. Never hardcode token endpoint URLs.

```ts
const discovery = await fetchOIDCDiscovery(process.env.AUTH_DISCOVERY_ISSUER_URL!);
const auth = new OAuth2ClientCredentials({
  clientId: process.env.AUTH_CLIENT_ID!,
  clientSecret: process.env.AUTH_CLIENT_SECRET!,
  tokenEndpoint: discovery.tokenEndpoint,
});
```

### oauth4webapi is an optional dependency
The `oauth4webapi` package is listed under `optionalDependencies`. It is loaded lazily via dynamic `import("oauth4webapi")` in `src/kessel/auth/index.ts`. Code that does not need OAuth must not import from `kessel/auth` to avoid runtime failures when the package is absent.

### Token caching and expiration window
`OAuth2ClientCredentials` caches tokens internally and considers them invalid 5 minutes before actual expiry (`EXPIRATION_WINDOW_MILLI = 300000`). When `expires_in` is missing from the OAuth response, it defaults to 1 hour (`DEFAULT_EXPIRE_IN_SECONDS = 3600`). The cached token response object is frozen with `Object.freeze`. Do not attempt to mutate it.

### Force-refresh support
Call `getToken(true)` to bypass the cache and force a fresh token. Use this only for error recovery (e.g., after a 401 from the server), not routinely.

### ClientSecretPost authentication method
The SDK uses `oauth.ClientSecretPost` (sending `client_secret` in the POST body), not `ClientSecretBasic` (HTTP Basic auth header). Do not change this without coordinating with the Kessel auth infrastructure team.

## 2. gRPC Channel and Call Credentials

### SSL is the default
`ClientBuilder.build()` defaults to `credentials.createSsl()` when no channel credentials are explicitly set. This means production usage requires no extra TLS configuration.

### Never send credentials over insecure channels
`ClientBuilder.validateCredentials()` throws if call credentials (OAuth tokens) are combined with insecure channel credentials. This is enforced at build time, not at call time. The error message is: `"Invalid credential configuration: can not authenticate with insecure channel"`.

### Use `.insecure()` only for local development
The `insecure()` builder method clears both call and channel credentials. It exists solely for local development against unauthenticated services. Never use it in production or staging.

### Two auth integration paths
- **Builder pattern (preferred):** `new ClientBuilder(target).oauth2ClientAuthenticated(auth).buildAsync()`
- **Vanilla pattern:** Manually combine `credentials.createSsl()` with `oauth2CallCredentials(auth)` via `credentials.combineChannelCredentials()`. The comment in `examples/vanilla/auth.ts` ("Auth only works with secure credentials") documents this constraint.

### Bearer token in gRPC metadata
`oauth2CallCredentials` in `src/kessel/grpc/index.ts` attaches the token as `Authorization: Bearer <token>` in gRPC metadata on every call. The token is fetched via `auth.getToken()`, which handles caching transparently.

## 3. RBAC Workspace Requests

### x-rh-rbac-org-id header
All RBAC workspace fetch calls (`fetchDefaultWorkspace`, `fetchRootWorkspace`) set the `x-rh-rbac-org-id` header. This is a required organizational context header. Omitting it will cause authorization failures.

### AuthRequest abstraction for HTTP calls
The `AuthRequest` interface (`configureRequest: (request: Request) => Promise<void>`) is the SDK's pattern for attaching auth to non-gRPC (HTTP fetch) calls. Use `oauth2AuthRequest(credentials)` to create one from `OAuth2ClientCredentials`. Auth is optional on workspace fetch functions; omitting it means the call is unauthenticated.

### Principal identity format
The `principalResource` and `principalSubject` helpers format the resource ID as `${domain}/${id}` (e.g., `redhat/alice`). This convention is required by the Kessel authorization model. Do not change the separator or ordering.

## 4. Secret and Credential Handling

### Environment variables for secrets
All examples load credentials from environment variables via `dotenv/config`. The expected variables are defined in `examples/.env.sample`:
- `KESSEL_ENDPOINT`
- `AUTH_CLIENT_ID`
- `AUTH_CLIENT_SECRET`
- `AUTH_DISCOVERY_ISSUER_URL`

### .env is gitignored at two levels
Both the root `.gitignore` and `examples/.gitignore` exclude `.env` files. The `setup.ts` postinstall script copies `.env.sample` to `.env` only if `.env` does not already exist. Never commit `.env` files.

### No secrets in test code
Test files use placeholder values like `test-client-id`, `test-secret`, and mock all OAuth calls via `jest.mock("oauth4webapi")`. Never use real credentials in tests. The test pattern mocks the entire `oauth4webapi` module at the top of the test file.

### The auth config object stores secrets in memory
`OAuth2ClientCredentials.auth` is a `readonly` property but exposes `clientId` and `clientSecret` as plain strings. Be cautious about logging or serializing `OAuth2ClientCredentials` instances.

## 5. Authorization Check Patterns (ReBAC)

### CheckRequest requires all three fields
Every authorization check needs `object` (resource), `relation` (permission), and `subject` (who). These map to the Zanzibar-style tuple `(subject, relation, object)`.

### Consistency modes affect security guarantees
`CheckRequest` accepts an optional `consistency` field with three modes:
- `minimizeLatency` (default): fastest, may use stale data
- `atLeastAsFresh`: uses a `ConsistencyToken` from a prior write
- `atLeastAsAcknowledged`: guarantees data includes latest acknowledged write

For security-critical checks (e.g., immediately after permission changes), use `atLeastAsAcknowledged` or `atLeastAsFresh` with a token from the write response.

### Bulk checks share the same gRPC call
`checkBulk` sends multiple authorization checks in one request. Each item can independently succeed or fail (check `pair.item` vs `pair.error`). A gRPC-level error fails the entire batch.

## 6. Protobuf Code Generation

### Generated code is not hand-edited
All files under `src/kessel/inventory/v1/`, `src/kessel/inventory/v1beta1/`, and `src/kessel/inventory/v1beta2/` (except `index.ts`) are generated by `protoc-gen-ts_proto` via `buf generate`. They contain `DO NOT EDIT` headers. Security fixes to message types must be made in the upstream `.proto` definitions in `buf.build/project-kessel/inventory-api`, not in this repository.

### Automated regeneration via CI
The `buf-generate.yml` workflow regenerates protobuf files every 6 hours and opens a PR. Review these PRs for unexpected changes to security-sensitive message types (`CheckRequest`, `Consistency`, `SubjectReference`, etc.).

## 7. Dependency Security

### Minimal runtime dependencies
The SDK has exactly one required runtime dependency (`@grpc/grpc-js`) and one optional dependency (`oauth4webapi`). Keep this surface area small.

### Dependabot is configured for daily updates
Both npm and GitHub Actions dependencies are checked daily via `.github/dependabot.yml`. Review and merge security updates promptly.

### Node.js version requirement
The SDK requires Node.js >= 20 (`engines` in `package.json`). This ensures access to modern TLS defaults and security patches. Do not lower this requirement.

## 8. Testing Security-Sensitive Code

### Mock oauth4webapi completely
Auth tests mock the entire `oauth4webapi` module with `jest.mock("oauth4webapi")`. Each test function (`discoveryRequest`, `processDiscoveryResponse`, `ClientSecretPost`, etc.) is individually mockable. Follow this pattern for any new auth tests.

### Test credential validation at the builder level
Tests in `src/kessel/inventory/v1beta2/__tests__/index.ts` verify that the builder throws when combining call credentials with insecure channels. Any new credential configuration path must have equivalent validation tests.

### RBAC tests mock global fetch
Tests in `src/kessel/rbac/__tests__/v2.ts` replace `global.fetch` with `jest.fn()`. They verify that auth headers and org-id headers are set correctly on outgoing requests. Follow this pattern for any new HTTP-based API integration.
