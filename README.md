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

## Examples

Check out the [examples directory](./examples) for working code samples:

- **[Builder examples](./examples/builder/)** -- Modern async/await patterns with `ClientBuilder` (check, check_bulk, report, delete, streaming)
- **[Vanilla examples](./examples/vanilla/)** -- Traditional callback patterns using raw gRPC stubs
- **[RBAC examples](./examples/rbac/)** -- Workspace operations via REST API

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

This section provides step-by-step instructions for maintainers to release a new version of the Kessel SDK for Node.js.

### Version Management

This project follows [Semantic Versioning 2.0.0](https://semver.org/). Version numbers use the format `MAJOR.MINOR.PATCH`:

- **MAJOR**: Increment for incompatible API changes
- **MINOR**: Increment for backward-compatible functionality additions
- **PATCH**: Increment for backward-compatible bug fixes

**Note**: SDK versions across different languages (Ruby, Python, Go, etc.) do not need to be synchronized. Each language SDK can evolve independently based on its specific requirements and release schedule.

### Prerequisites for Release

- Write access to the GitHub repository
- npm account with publish access to the `@project-kessel/kessel-sdk` package
- Ensure CI/CD tests are passing
- Review and update CHANGELOG or release notes as needed
- Node 20 or higher
- [buf](https://github.com/bufbuild/buf) for protobuf/gRPC code generation:

  ```bash
  # On macOS
  brew install bufbuild/buf/buf

  # On Linux
  curl -sSL "https://github.com/bufbuild/buf/releases/latest/download/buf-$(uname -s)-$(uname -m)" -o "/usr/local/bin/buf" && chmod +x "/usr/local/bin/buf"
  ```

### Release Process

1. **Update the Version**

Edit the `version` field in `package.json` to the new version number, following [Semantic Versioning](https://semver.org/) (see [Version Management](#version-management) above).

Then set the `VERSION` env var from `package.json` for use in subsequent steps:

```bash
export VERSION=$(cat package.json | jq .version -r)
echo "Releasing version: v${VERSION}"
```

2. **Update Dependencies**

```bash
# Update package-lock.json with any dependency changes
npm install
```

3. **Run Quality Checks**

```bash
# Run the full test suite
npm test

# Run linting
npm run lint


# Build the project
npm run build
```

4. **Commit and Push Changes**

```bash
# Commit the version bump and any related changes
export VERSION=$(cat package.json | jq .version -r)
git add package.json package-lock.json
git commit -m "chore: bump version to ${VERSION}"
git push origin main # or git push upstream main
```

5. **Build and Publish the Package**

```bash
# Build the package
npm run build

# Publish to npm (requires npm account and package access)
npm publish
```

6. **Tag the Release**

```bash
# Create and push a git tag
git tag -a v${VERSION} -m "Release version ${VERSION}"
git push origin v${VERSION} # or git push upstream v${VERSION}
```

7. **Create GitHub Release**

```bash
gh release create v${VERSION} --title "v${VERSION}" --generate-notes
```

Or manually:

- Go to the [GitHub Releases page](https://github.com/project-kessel/kessel-sdk-node/releases)
- Click "Create a new release"
- Select the tag you just created
- Add release notes describing the changes
- Publish the release

## Need Help?

- Check the [GitHub Issues](https://github.com/project-kessel/kessel-sdk-node/issues)
- Look at the [examples](./examples) directory

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
