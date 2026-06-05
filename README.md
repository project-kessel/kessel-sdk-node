# Kessel SDK for Node.js

A TypeScript/JavaScript SDK for connecting to Kessel services using gRPC with a fluent client builder API.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Examples](#examples)
- [Project Structure](#project-structure)
- [Development](#development)
- [Release Instructions](#release-instructions)
- [License](#license)

## Installation

```bash
npm install @project-kessel/kessel-sdk
```

If you need OAuth 2.0 authentication (recommended for production), also install the optional peer dependency:

```bash
npm install oauth4webapi
```

## Quick Start

```typescript
import { ClientBuilder } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";
import { CheckRequest } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/check_request";
import { SubjectReference } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/subject_reference";
import { ResourceReference } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/resource_reference";

// 1. Create a client using the builder
const client = new ClientBuilder("localhost:9000")
  .insecure() // for local development only
  .buildAsync(); // returns a promisified client (use .build() for callback-style)

// 2. Build your request
const request: CheckRequest = {
  subject: {
    resource: {
      reporter: { type: "rbac" },
      resourceId: "foobar",
      resourceType: "principal",
    },
  },
  object: {
    reporter: { type: "rbac" },
    resourceId: "1234",
    resourceType: "workspace",
  },
  relation: "inventory_host_view",
};

// 3. Make the call
const response = await client.check(request);
console.log(response);
```

## Authentication

The SDK supports multiple authentication modes via the `ClientBuilder` fluent API:

### Insecure (local development only)

```typescript
const client = new ClientBuilder(target).insecure().buildAsync();
```

No TLS, no auth. Cannot be combined with call credentials.

### OAuth 2.0 Client Credentials (production)

```typescript
import {
  fetchOIDCDiscovery,
  OAuth2ClientCredentials,
} from "@project-kessel/kessel-sdk/kessel/auth";
import { ClientBuilder } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";

// Discover the token endpoint via OIDC
const discovery = await fetchOIDCDiscovery(
  "https://sso.example.com/auth/realms/my-realm",
);

// Create OAuth credentials (tokens are cached and auto-refreshed)
const auth = new OAuth2ClientCredentials({
  clientId: "my-client-id",
  clientSecret: "my-client-secret",
  tokenEndpoint: discovery.tokenEndpoint,
});

// Build the client
const client = new ClientBuilder("kessel.example.com:443")
  .oauth2ClientAuthenticated(auth)
  .buildAsync();
```

Requires the `oauth4webapi` optional dependency. See [docs/security-guidelines.md](./docs/security-guidelines.md) for details on credential handling and TLS.

### Custom / Unauthenticated

```typescript
// TLS without auth
new ClientBuilder(target).unauthenticated().buildAsync();

// Custom call credentials
new ClientBuilder(target)
  .authenticated(callCredentials, channelCredentials)
  .buildAsync();
```

## Listing Workspaces

The `listWorkspaces` helper automatically paginates through all workspaces
a subject can access. Continuation tokens are handled internally.

```typescript
import {
  listWorkspaces,
  principalSubject,
} from "@project-kessel/kessel-sdk/kessel/rbac/v2";
import type { StreamedListObjectsResponse } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/streamed_list_objects_response";

// Lazy iteration (constant memory)
for await (const response of listWorkspaces(
  client,
  principalSubject("alice", "redhat"),
  "viewer",
)) {
  console.log(response.object?.resourceId);
}

// Materialise into an array
const all: StreamedListObjectsResponse[] = [];
for await (const response of listWorkspaces(
  client,
  principalSubject("alice", "redhat"),
  "viewer",
)) {
  all.push(response);
}
```

See [`examples/rbac/list_workspaces.ts`](./examples/rbac/list_workspaces.ts) for a complete working example.

## Examples

Check out the [examples directory](./examples) for working code samples. Scripts are defined in [`examples/package.json`](./examples/package.json).

- **[Builder examples](./examples/builder/)**: Modern async/await patterns with the client builder API
- **[Vanilla examples](./examples/vanilla/)**: Traditional callback-style patterns
- **[Authentication examples](./examples/builder/auth.ts)**: OAuth 2.0 client credentials setup and usage
- **[Streaming examples](./examples/builder/streamed_list_objects.ts)**: Working with streaming APIs
- **[RBAC examples](./examples/rbac/)**: Workspace listing and fetching
- **[Console examples](./examples/console/)**: Red Hat identity principal helpers

### Setup

```bash
cd examples
npm install
```

### Running Examples

```bash
# Builder-style examples (async/await)
npm run builder:check
npm run builder:check_bulk
npm run builder:check_for_update
npm run builder:report_resource
npm run builder:delete_resource
npm run builder:streamed_list_objects
npm run builder:auth

# Vanilla examples (callback-style)
npm run vanilla:check
npm run vanilla:check_bulk
npm run vanilla:check_for_update
npm run vanilla:report_resource
npm run vanilla:delete_resource
npm run vanilla:streamed_list_objects
npm run vanilla:promisify
npm run vanilla:auth

# RBAC examples
npm run rbac:list_workspaces
npm run rbac:fetch_workspace

# Console examples
npm run console:console_principal
```

> **Note:** If you've made changes to the SDK source, run `npm run build` in the root directory before running examples, as the examples reference the local build.

## Project Structure

```
src/
  kessel/
    auth/           # OAuth2 client credentials, OIDC discovery
    grpc/           # gRPC call credentials helper
    inventory/      # ClientBuilder base + per-version wiring
      v1/           # Health service
      v1beta2/      # Primary inventory API (generated stubs + hand-written index)
    rbac/           # REST workspace helpers, resource/subject factories
  promisify.ts      # Proxy-based gRPC client promisification
examples/           # Integration examples (require a live server)
docs/               # Domain-specific guideline files
```

Most `.ts` files in the inventory directories are **auto-generated** from upstream protobuf definitions and should not be hand-edited. See [AGENTS.md](./AGENTS.md) for the full project structure and the distinction between generated and hand-written code.

## Development

### Commands

| Command                  | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `npm run build`          | Build CJS, ESM, and type declarations (parallel) |
| `npm test`               | Run tests with Jest                              |
| `npm run lint`           | Lint with ESLint (auto-fix)                      |
| `npm run lint:check`     | Lint without auto-fix (CI)                       |
| `npm run prettier`       | Format with Prettier (auto-fix)                  |
| `npm run prettier:check` | Format check without auto-fix (CI)               |

### CI

CI runs on every push/PR to `main`, testing Node 20, 22, and 24. All checks must pass: lint, prettier, build, test.

## Release Instructions

Releases are fully automated using [semantic-release](https://semantic-release.gitbook.io/). Every push to `main` triggers a workflow that analyzes commit messages, generates a changelog, and publishes to npm if warranted.

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) to automatically trigger releases:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types and version bumps:**
- `feat:` → minor version (new feature)
- `fix:` → patch version (bug fix)
- `perf:` / `docs:` / `refactor:` → patch version
- `BREAKING CHANGE:` in footer → major version

**Examples:**

```bash
# Patch: 3.7.1 → 3.7.2
git commit -m "fix: handle expired tokens in OAuth2 refresh flow"

# Minor: 3.7.1 → 3.8.0
git commit -m "feat: add support for bulk relationship queries"

# Major: 3.7.1 → 4.0.0
git commit -m "feat!: remove deprecated v1beta1 API

BREAKING CHANGE: The v1beta1 API has been removed. Migrate to v1beta2."
```

When you merge a PR with conventional commits to `main`, the release workflow:
1. Runs quality checks (lint, test, build on Node 20/22/24)
2. Determines the next version from commits
3. Generates `CHANGELOG.md`
4. Publishes to npm with provenance attestation
5. Creates a GitHub release

See [docs/RELEASE.md](./docs/RELEASE.md) for detailed setup instructions and troubleshooting.

## Need Help?

- Check the [GitHub Issues](https://github.com/project-kessel/kessel-sdk-node/issues)
- Look at the [examples](./examples) directory

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
