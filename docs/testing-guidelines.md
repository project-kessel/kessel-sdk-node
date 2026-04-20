# Testing Guidelines

## Running Tests

```bash
npm test          # Run all tests (calls jest)
```

Tests run in CI on Node.js 20, 22, and 24 via GitHub Actions (`.github/workflows/build.yml`). CI runs lint, prettier, build, and test sequentially -- all must pass.

## Configuration

### Jest

- Config: `jest.config.js` (ESM format, `export default`)
- Uses `ts-jest` via `createDefaultPreset()` for TypeScript transform
- Test environment: `node`
- No custom coverage thresholds are configured
- No `testMatch` override -- Jest uses its defaults, which discovers `__tests__/` directories

### TypeScript

- `tsconfig.json` **excludes** test files from compilation: `"exclude": ["node_modules", "src/**/__tests__/**"]`
- Tests still run through ts-jest's own transform, so they do not need to be in the TS build output
- `strictNullChecks` is **off** in the project tsconfig; tests may rely on this

### ESLint

- `eslint-plugin-jest` applies to `**/*.test.ts` and `**/__tests__/**/*.ts`
- `@typescript-eslint/no-explicit-any` is **off** in test files -- use `any` freely for mocks and private access

## Test File Location and Naming

Tests live in `__tests__/` directories **colocated** with the source module they test:

```
src/kessel/auth/__tests__/index.ts         # tests auth/index.ts
src/kessel/grpc/__tests__/index.ts         # tests grpc/index.ts
src/kessel/inventory/v1beta2/__tests__/index.ts  # tests inventory builder
src/kessel/rbac/__tests__/v2.ts            # tests rbac/v2.ts
```

**Conventions:**
- Test file name matches the source file name (e.g., `v2.ts` tests `../v2.ts`)
- Files use `.ts` extension (not `.test.ts`) when inside `__tests__/`
- No snapshot tests exist in the project

## Imports

Tests import from the **source module using relative paths**, not from the package exports:

```typescript
// Correct - relative import from source
import { OAuth2ClientCredentials } from "../index";
import { ClientBuilder } from "../index";

// Wrong - package import (used only in examples/)
import { ClientBuilder } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";
```

## Test Structure

### Organization Pattern

Tests use nested `describe` blocks organized by class/function, then by behavior category:

```typescript
describe("OAuth2ClientCredentials", () => {
  describe("getToken", () => { ... });
  describe("Cache Management", () => { ... });
  describe("Error Handling", () => { ... });
  describe("Configuration Edge Cases", () => { ... });
});
```

### Setup/Teardown

Some test files that use mocks include cleanup in `beforeEach`:

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});
```

This pattern appears in `auth/__tests__/index.ts` and `rbac/__tests__/v2.ts`. Other test files may use `beforeEach` for setup without mock cleanup, or may not use `beforeEach` at all. Use this pattern when your tests involve module-level mocks or when you need clean state between tests.

## Mocking Patterns

### Mocking `oauth4webapi` (optional dependency)

The auth module dynamically imports `oauth4webapi`. Tests mock it at the module level with a plain object of `jest.fn()` calls:

```typescript
const mockOAuth = {
  discoveryRequest: jest.fn(),
  processDiscoveryResponse: jest.fn(),
  ClientSecretPost: jest.fn(),
  clientCredentialsGrantRequest: jest.fn(),
  processClientCredentialsResponse: jest.fn(),
};

jest.mock("oauth4webapi", () => mockOAuth);
```

Then configure per-test with `mockResolvedValue` / `mockRejectedValue` / `mockReturnValue`.

### Mocking `global.fetch`

For HTTP-based modules (RBAC v2), mock `global.fetch` directly:

```typescript
const mockFetch = jest.fn();
global.fetch = mockFetch;
```

Mock responses use objects with `status` and `json` (as `jest.fn().mockResolvedValue(...)`), not actual `Response` instances:

```typescript
const mockResponse = {
  status: 200,
  json: jest.fn().mockResolvedValue({ data: [mockWorkspace] }),
};
mockFetch.mockResolvedValue(mockResponse);
```

### Mocking the `AuthRequest` interface

Create inline implementations of the `AuthRequest` interface:

```typescript
const mockAuth: AuthRequest = {
  configureRequest: jest.fn().mockImplementation(async (request) => {
    request.headers.set("authorization", "Bearer test-token");
  }),
};
```

### Spying on class methods

Use `jest.spyOn` when you need to mock a single method on a real instance (e.g., `getToken`):

```typescript
jest.spyOn(oauth2Creds, "getToken").mockResolvedValue(mockToken);
```

### Accessing private state

Cast to `any` to access private properties for test setup. This is the accepted pattern:

```typescript
(tokenRetriever as any).tokenCache = {
  accessToken: "cached-token",
  expiresAt: new Date(Date.now() + 600000),
};
```

## Assertion Patterns

- Use `toBe` for primitives and identity checks
- Use `toEqual` for deep object comparison
- Use `toBeFalsy()` (not `toBe(false)`) for cache validity checks that may return `undefined` or `false`
- Use `toBeDefined()` for existence checks on constructed objects
- Use `rejects.toThrow("message")` for async error assertions:

```typescript
await expect(fetchOIDCDiscovery("invalid")).rejects.toThrow();
await expect(fn()).rejects.toThrow("specific message");
```

- Use `expect(() => { ... }).toThrow("message")` for sync error assertions
- Verify mock call counts explicitly: `expect(mock).toHaveBeenCalledTimes(1)`
- Verify mock call arguments: `expect(mock).toHaveBeenCalledWith(expected)`
- Verify mocks were **not** called: `expect(mock).not.toHaveBeenCalled()`

## Testing gRPC ClientBuilder

ClientBuilder tests do **not** start a real gRPC server. They verify:
- Builder construction and method presence (`typeof client.method === "function"`)
- Fluent API chaining returns without throwing
- Credential validation throws on invalid combinations (e.g., auth + insecure channel)
- `build()` vs `buildAsync()` return different objects
- Promisified methods have fewer parameters than callback versions

## Testing Async Generators (Streaming)

For `listWorkspaces` and similar streaming functions, create a mock client factory:

```typescript
const createMockInventoryClient = (
  responseGenerator?: (req: StreamedListObjectsRequest) => AsyncGenerator<StreamedListObjectsResponse>,
) => {
  const mock = {
    streamedListObjects: jest.fn(),
    requests: [] as StreamedListObjectsRequest[],
  };
  mock.streamedListObjects.mockImplementation((request) => {
    mock.requests.push(request);
    return responseGenerator ? responseGenerator(request) : (async function* () {})();
  });
  return mock;
};
```

Consume the async generator in tests with `for await`:

```typescript
const results: StreamedListObjectsResponse[] = [];
for await (const response of listWorkspaces(client, subject, "member")) {
  results.push(response);
}
```

Test pagination by using a closure counter to return different responses on successive calls.

## Examples (Not Unit Tests)

Files under `examples/` are **integration examples**, not automated tests. They require a running Kessel server and real credentials (`.env` file). They are run manually via `npm run` scripts in `examples/package.json` (e.g., `npm run builder:check`). Do not add Jest tests there.

## What Not to Test

- Generated protobuf types in `src/kessel/inventory/v1beta2/*.ts` (auto-generated by `buf generate`)
- The `promisify.ts` utility internals (tested indirectly through ClientBuilder tests)
- The `dist/` output (tested through CI build step)
