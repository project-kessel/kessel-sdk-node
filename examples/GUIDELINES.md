# Examples Guidelines

Rules for working in `examples/` -- runnable integration examples for the Kessel SDK.

## Purpose

Examples are standalone runnable scripts that demonstrate SDK usage against a live Kessel server. They are NOT automated tests -- they require infrastructure and real credentials. Do not add Jest tests here.

## Directory Layout

| Subdirectory | Purpose | Import style |
|---|---|---|
| `builder/` | `ClientBuilder` + `buildAsync()` (Promise-based) | Package subpath imports |
| `vanilla/` | Raw gRPC stubs with callbacks | Package subpath imports |
| `rbac/` | RBAC workspace REST helpers | Mixed (some use relative source imports) |
| `console/` | Console identity helpers | Package subpath imports |

## File Naming

Use `snake_case.ts` matching the API operation: `check.ts`, `report_resource.ts`, `streamed_list_objects.ts`, `console_principal.ts`.

## Script Structure Pattern

Most examples that interact with a Kessel server follow this structure:
1. Imports (package subpath imports + `"dotenv/config"`)
2. Data setup (construct request objects, references)
3. Client construction (via `ClientBuilder` or raw stub)
4. Async IIFE with try/catch wrapping the API call
5. Console output of the result

```typescript
import { ClientBuilder } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";
import "dotenv/config";

const client = new ClientBuilder(process.env.KESSEL_ENDPOINT!)
  .insecure()
  .buildAsync();

// ... setup request objects ...

(async () => {
  try {
    const response = await client.someMethod(request);
    console.log("Success:", response);
  } catch (error) {
    console.log("Error:", error);
  }
})();
```

## Import Rules

- Use **package subpath imports** for the SDK: `@project-kessel/kessel-sdk/kessel/inventory/v1beta2`
- Never use relative imports into `../src/` for new examples (some older RBAC examples use relative imports -- this is a known inconsistency that should be migrated)
- Import `"dotenv/config"` at the top for environment variable loading
- Import types from their specific generated files (e.g., `check_request`, `resource_reference`)

## Environment Variables

Most examples read configuration from `.env` (loaded via `dotenv/config`). Required variables are defined in `.env.sample`:

| Variable | Purpose | Example |
|---|---|---|
| `KESSEL_ENDPOINT` | gRPC target host:port | `localhost:9000` |
| `AUTH_CLIENT_ID` | OAuth client ID | -- |
| `AUTH_CLIENT_SECRET` | OAuth client secret | -- |
| `AUTH_DISCOVERY_ISSUER_URL` | OIDC issuer URL | `https://sso.server/auth/realms/the-realm` |

- The `postinstall` script (`setup.ts`) copies `.env.sample` to `.env` if `.env` does not exist.
- `.env` is gitignored. Never commit it.
- Use non-null assertion (`process.env.VAR!`) for required env vars in examples only.

## npm Scripts

Every example file must have a corresponding script in `examples/package.json` using the `<directory>:<operation>` naming format:

```json
"builder:check": "tsx builder/check.ts",
"vanilla:report_resource": "tsx vanilla/report_resource.ts",
"rbac:list_workspaces": "tsx rbac/list_workspaces.ts",
"console:console_principal": "tsx console/console_principal.ts"
```

All scripts use `tsx` as the runner (TypeScript execution without compilation).

## Builder vs Vanilla Examples

When an operation supports both styles, add examples to both `builder/` and `vanilla/`:

- **Builder examples** use `ClientBuilder` + `buildAsync()` for Promise-based async/await
- **Vanilla examples** use the raw generated `KesselInventoryServiceClient` with `ChannelCredentials` and callbacks
- The `vanilla/promisify.ts` example demonstrates manual promisification with `util.promisify`

## Auth Examples

`builder/auth.ts` and `vanilla/auth.ts` demonstrate the full OAuth2 flow:
1. OIDC discovery via `fetchOIDCDiscovery()`
2. `OAuth2ClientCredentials` construction
3. Client construction with OAuth credentials

Builder auth uses `.oauth2ClientAuthenticated(auth)`. Vanilla auth uses `credentials.combineChannelCredentials()` with `oauth2CallCredentials()`.

## Separate Package

Examples have their own `package.json` with:
- `@project-kessel/kessel-sdk: "file://.."` -- references the local SDK build
- `dotenv` and `tsx` as dependencies
- Private: true (not publishable)
- Own `tsconfig.json` (target ES2022, skipLibCheck: true)

After modifying SDK source, run `npm run build` in the repo root before running examples.

## When to Add or Update

- **New API operation**: Add to relevant subdirectory. If both builder and vanilla apply, add to both.
- **New module or subpath export**: Add at least one example. Create a new subdirectory for distinct concerns.
- **Changed method signatures**: Update all examples that call the changed method.
- **Removed API surface**: Remove or update affected examples and their npm scripts.

## Do Not

- Add Jest tests in this directory -- it is for integration examples only
- Use relative imports into `../src/` for new examples -- use package subpath imports
- Commit `.env` files
- Forget to register new example files as npm scripts in `package.json`
