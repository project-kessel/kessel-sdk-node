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

Check out the [examples directory](./examples) for working code samples:

- **Builder examples**: Modern async/await patterns with client builder
- **Vanilla examples**: Traditional callback patterns
- **Authentication examples**: OAuth setup and usage
- **Streaming examples**: Working with streaming APIs

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
- Required tools installed:
  ```bash
  pip install build twine
  pip install "kessel-sdk[dev]"
  ```
- [buf](https://github.com/bufbuild/buf) for protobuf/gRPC code generation:

  ```bash
  # On macOS
  brew install bufbuild/buf/buf

  # On Linux
  curl -sSL "https://github.com/bufbuild/buf/releases/latest/download/buf-$(uname -s)-$(uname -m)" -o "/usr/local/bin/buf" && chmod +x "/usr/local/bin/buf"
  ```

### Release Process

1. **Update the Version**

```bash
# Edit package.json
# Update the version field to the new version number
vim package.json
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
git add package.json package-lock.json
git commit -m "chore: bump version to X.Y.Z"
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
git tag -a vX.Y.Z -m "Release version X.Y.Z"
git push origin vX.Y.Z
```

7. **Create GitHub Release**

- Go to the [GitHub Releases page](https://github.com/project-kessel/kessel-sdk-node/releases)
- Click "Create a new release"
- Select the tag you just created
- Add release notes describing the changes
- Publish the release

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
