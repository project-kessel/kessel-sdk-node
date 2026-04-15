# Kessel SDK for Node.js

A TypeScript/JavaScript SDK for connecting to Kessel services using gRPC with a fluent client builder API.

## Table of Contents

- [Installation](#installation)
- [Examples](#examples)
- [Development](#development)

## Installation

```bash
npm install @project-kessel/kessel-sdk
```

## Authentication

The SDK supports OAuth 2.0 Client Credentials flow for authentication:

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

## Need Help?

- Check the [GitHub Issues](https://github.com/project-kessel/kessel-sdk-node/issues)
- Look at the [examples](./examples) directory

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
# Check formatting
npm run prettier:check

# Auto-fix formatting
npm run prettier
```

### Type Checking

```bash
npm run type-check
```

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

# Check formatting
npm run prettier:check

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

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
