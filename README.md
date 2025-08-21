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

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
