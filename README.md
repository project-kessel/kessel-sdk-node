# Kessel SDK for Node.js

A TypeScript/JavaScript SDK for connecting to Kessel services using gRPC with a fluent client builder API.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Client Builder](#client-builder)
- [Configuration](#configuration)
- [Authentication](#authentication)
- [Examples](#examples)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Development](#development)

## Installation

```bash
npm install @project-kessel/kessel-sdk
```

## Quick Start

```typescript
import { ClientBuilder } from "@project-kessel/kessel-sdk/inventory/v1beta2";

// Create a client with minimal configuration
const client = ClientBuilder.builder()
  .withTarget("localhost:9000")
  .withInsecureCredentials()
  .build();

// Use the client with async/await
const response = await client.check({
  subject: { id: "user123", type: "user" },
  resource: { id: "resource456", type: "document" },
  action: "read",
});
```

## Client Builder

The Kessel SDK uses a fluent builder pattern to create and configure gRPC clients. The builder provides type-safe
configuration options and returns fully promisified clients for use with modern async/await syntax.

Client builder provides:

- **Fluent API**: Method chaining for easy configuration
- **Type Safety**: Full TypeScript support with compile-time validation
- **Promisification**: Automatic conversion of callback-based gRPC methods to promises
- **Validation**: Configuration validation before client creation
- **Extensibility**: Support for custom interceptors and channel options

## Configuration

### Target Server

The target server address is the only required configuration parameter:

```typescript
// Basic target configuration
.withTarget("localhost:9000")
.withTarget("kessel.example.com:443")
.withTarget("[::1]:9000")  // IPv6 address
```

### Credentials

#### Insecure Credentials (Development)

```typescript
// No TLS encryption - use only for local development
.withInsecureCredentials()
```

#### Secure Credentials (Production)

```typescript
// Use system default root certificates
.withSecureCredentials()

// Custom root certificate
const rootCert = Buffer.from(rootCertPem, 'utf8');
.withSecureCredentials(rootCert)

// Client certificate authentication
const rootCert = Buffer.from(rootCertPem, 'utf8');
const privateKey = Buffer.from(privateKeyPem, 'utf8');
const certChain = Buffer.from(certChainPem, 'utf8');
.withSecureCredentials(rootCert, privateKey, certChain)

// Custom verification options
.withSecureCredentials(rootCert, null, null, {
  rejectUnauthorized: false,
  checkServerIdentity: (hostname, cert) => {
    // Custom certificate validation logic
  }
})
```

#### Credentials from SecureContext

```typescript
import { createSecureContext } from 'tls';

const secureContext = createSecureContext({
  cert: certPemString,
  key: keyPemString,
  ca: caPemString
});

.withSecureContextCredentials(secureContext)
```

#### Configuration Object

```typescript
// Insecure configuration
.withCredentialsConfig({ type: "insecure" })

// Secure configuration
.withCredentialsConfig({
  type: "secure",
  rootCerts: rootCertPemString,
  privateCerts: privateKeyPemString,
  certChain: certChainPemString,
  rejectUnauthorized: true
})
```

### Keep-Alive Settings

Configure connection keep-alive behavior:

```typescript
.withKeepAlive({
  timeMs: 30000,              // Ping interval (30 seconds)
  timeoutMs: 10000,           // Ping timeout (10 seconds)
  permitWithoutCalls: false   // Don't ping when idle
})
```

**Default Values:**

- `timeMs`: 10000 (10 seconds)
- `timeoutMs`: 5000 (5 seconds)
- `permitWithoutCalls`: true

### Channel Options

Configure low-level gRPC channel options:

```typescript
// Set custom user agent
.withChannelOption('grpc.primary_user_agent', 'my-app/1.0.0')

// Configure message size limits
.withChannelOption('grpc.max_receive_message_length', 4 * 1024 * 1024)
.withChannelOption('grpc.max_send_message_length', 4 * 1024 * 1024)

// Configure reconnection behavior
.withChannelOption('grpc.initial_reconnect_backoff_ms', 1000)
.withChannelOption('grpc.max_reconnect_backoff_ms', 30000)
```

### Complete Configuration Object

Use a configuration object for complex setups:

```typescript
import { ClientConfig } from "@project-kessel/kessel-sdk/inventory";

const config: ClientConfig = {
  target: "kessel-api.example.com:443",
  credentials: {
    type: "secure",
    rootCerts: rootCertPem,
    rejectUnauthorized: true,
  },
  keepAlive: {
    timeMs: 30000,
    timeoutMs: 15000,
    permitWithoutCalls: false,
  },
  auth: {
    clientId: "my-service",
    clientSecret: "my-secret",
    tokenEndpoint: "https://auth.example.com/token",
  },
  channelOptions: {
    "grpc.max_receive_message_length": 4 * 1024 * 1024,
    "grpc.primary_user_agent": "my-app/1.0.0",
  },
};

const client = ClientBuilder.builder().withConfig(config).build();
```

## Authentication

The SDK supports OAuth 2.0 Client Credentials flow for authentication:

### Basic OAuth Configuration

First, discover the token endpoint using the issuer URL:

```typescript
import { fetchOIDCDiscovery } from "@project-kessel/kessel-sdk/kessel/auth";

// Discover the token endpoint from the issuer URL
const discovery = await fetchOIDCDiscovery("https://auth.example.com");

// Configure the client with the discovered token endpoint
.withAuth({
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  tokenEndpoint: discovery.tokenEndpoint
})
```

### OAuth Features

- **Automatic Token Management**: Tokens are automatically fetched and refreshed
- **Token Caching**: Tokens are cached and reused until near expiration
- **Expiration Window**: Tokens are refreshed 20 seconds before expiration
- **OIDC Discovery**: Automatic discovery of OAuth endpoints from issuer URLs

### OAuth Example

```typescript
import { fetchOIDCDiscovery } from "@project-kessel/kessel-sdk/kessel/auth";

// Discover the token endpoint
const discovery = await fetchOIDCDiscovery(
  "https://sso.server/auth/realms/my-realm",
);

const client = ClientBuilder.builder()
  .withTarget("kessel-api.example.com:443")
  .withSecureCredentials()
  .withAuth({
    clientId: "inventory-client",
    clientSecret: process.env.CLIENT_SECRET,
    tokenEndpoint: discovery.tokenEndpoint,
  })
  .build();

// The client automatically handles authentication
const response = await client.check(request);
```

### Manual Token Management

If you need direct access to tokens:

```typescript
import {
  OAuth2ClientCredentials,
  fetchOIDCDiscovery,
} from "@project-kessel/kessel-sdk/kessel/auth";

// Discover the token endpoint
const discovery = await fetchOIDCDiscovery("https://auth.example.com");

// Create an OAuth client
const authClient = new OAuth2ClientCredentials({
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  tokenEndpoint: discovery.tokenEndpoint,
});

// Get a token (returns RefreshTokenResponse object)
const tokenResponse = await authClient.getToken();
console.log(
  `Token: ${tokenResponse.accessToken}, expires at: ${tokenResponse.expiresAt}`,
);

// Force refresh a token
const newTokenResponse = await authClient.getToken(true);
```

## Examples

### Development Setup

```typescript
import { ClientBuilder } from "@project-kessel/kessel-sdk/inventory/v1beta2";

const client = ClientBuilder.builder()
  .withTarget("localhost:9000")
  .withInsecureCredentials()
  .withKeepAlive({
    timeMs: 5000,
    timeoutMs: 2000,
    permitWithoutCalls: true,
  })
  .build();
```

### Production Setup

```typescript
import { ClientBuilder } from "@project-kessel/kessel-sdk/inventory/v1beta2";

const client = ClientBuilder.builder()
  .withTarget("kessel-inventory.prod.example.com:443")
  .withSecureCredentials()
  .withKeepAlive({
    timeMs: 60000,
    timeoutMs: 30000,
    permitWithoutCalls: false,
  })
  .withAuth({
    clientId: process.env.KESSEL_CLIENT_ID,
    clientSecret: process.env.KESSEL_CLIENT_SECRET,
    tokenEndpoint: process.env.KESSEL_TOKEN_ENDPOINT,
  })
  .withChannelOption("grpc.max_receive_message_length", 10 * 1024 * 1024)
  .build();
```

## API Reference

| Method                              | Parameters                               | Returns                | Description                        |
| ----------------------------------- | ---------------------------------------- | ---------------------- | ---------------------------------- |
| `withTarget(target)`                | `target: string`                         | `this`                 | Set the target server address      |
| `withCredentials(creds)`            | `creds: ChannelCredentials`              | `this`                 | Set custom credentials             |
| `withInsecureCredentials()`         | -                                        | `this`                 | Use insecure credentials           |
| `withSecureCredentials(...)`        | Optional cert parameters                 | `this`                 | Use secure SSL credentials         |
| `withSecureContextCredentials(...)` | `context: SecureContext`                 | `this`                 | Use credentials from SecureContext |
| `withCredentialsConfig(config)`     | `config: ClientConfigCredentials`        | `this`                 | Configure credentials from object  |
| `withAuth(auth)`                    | `auth: ClientConfigAuth`                 | `this`                 | Configure OAuth authentication     |
| `withKeepAlive(config)`             | `config: Partial<ClientConfigKeepAlive>` | `this`                 | Configure keep-alive settings      |
| `withChannelOption(option, value)`  | gRPC channel option                      | `this`                 | Set custom channel option          |
| `withConfig(config)`                | `config: GRpcClientConfig`               | `this`                 | Configure from object              |
| `build()`                           | -                                        | `PromisifiedClient<T>` | Build and return the client        |

### Configuration Types

#### ClientConfig

```typescript
interface ClientConfig {
  target?: string;
  credentials?: ClientConfigCredentials;
  keepAlive?: Partial<ClientConfigKeepAlive>;
  auth?: ClientConfigAuth;
}
```

#### ClientConfigCredentials

```typescript
type ClientConfigCredentials =
  | { type: "insecure" }
  | {
      type: "secure";
      rootCerts?: string;
      privateCerts?: string;
      certChain?: string;
      rejectUnauthorized?: boolean;
    };
```

#### ClientConfigKeepAlive

```typescript
interface ClientConfigKeepAlive {
  timeMs: number; // Ping interval in milliseconds
  timeoutMs: number; // Ping timeout in milliseconds
  permitWithoutCalls: boolean; // Allow pings when idle
}
```

#### ClientConfigAuth

```typescript
interface ClientConfigAuth {
  clientId: string; // OAuth client ID
  clientSecret: string; // OAuth client secret
  tokenEndpoint: string; // OAuth token endpoint URL
}
```

## Error Handling

### IncompleteKesselConfigurationError

Thrown when required configuration is missing:

```typescript
try {
  const client = ClientBuilder.builder().build(); // Missing target
} catch (error) {
  if (error instanceof IncompleteKesselConfigurationError) {
    console.log("Missing configuration:", error.message);
  }
}
```

### gRPC Status Codes

The SDK uses standard gRPC status codes:

```typescript
import { status } from "@grpc/grpc-js";

try {
  const response = await client.check(request);
} catch (error) {
  switch (error.code) {
    case status.UNAUTHENTICATED:
      // Handle authentication error
      break;
    case status.PERMISSION_DENIED:
      // Handle authorization error
      break;
    case status.UNAVAILABLE:
      // Handle service unavailable
      break;
    default:
      // Handle other errors
      break;
  }
}
```

### Authentication Errors

OAuth authentication errors are automatically handled and retried.
If authentication fails permanently, the client will throw an `UNAUTHENTICATED` error.

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

### Prerequisites for Release

- Write access to the GitHub repository
- npm account with publish access to the `@project-kessel/kessel-sdk` package
- Ensure CI/CD tests are passing
- Review and update CHANGELOG or release notes as needed

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
