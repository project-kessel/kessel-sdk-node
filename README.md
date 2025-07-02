# Kessel SDK for Node.js

This is the official Node.js SDK for [Project Kessel](https://github.com/project-kessel), a system for unifying APIs and experiences with fine-grained authorization, common inventory, and CloudEvents.

This SDK provides a convenient client for interacting with the Kessel APIs from your Node.js or
TypeScript application.

## Features

- Typed API: Full TypeScript support for all API methods and data structures
- gRPC Integration: Built on top of [@grpc/grpc-js](https://github.com/grpc/grpc-node/tree/master/packages/grpc-js)
  for efficient and robust communication with the Kessel API.
- Asynchronous Operations: All API methods are asynchronous, using either callbacks, promises or async iterators.

## Prerequisites

Before you begin, you will need:

- Node.js
- Access to a running instance of the Kessel API

## Installation

Install the Kessel SDK in your project. e.g. using npm:

```bash
npm install --save kessel-sdk
```

## Usage

1. **Create a client**

First, you need to create a `KesselInventoryServiceClient` instance. This requires you to specify the host and port
of your Kessel API instance and provide channel credentials for the gRPC connection.

```typescript
import { KesselInventoryServiceClient } from "kessel-sdk";
import { credentials } from "@grpc/grpc-js";

// Create secure credentials for a TLS-enabled Kessel API instance
const creds = credentials.createSsl();

// Or, for local development, you can use insecure credentials
// const creds = credentials.createInsecure();

const client = new KesselInventoryServiceClient(
  "your-kessel-api.example.com:443",
  creds,
);
```

For more advanced configurations, you can also pass [channel options](https://www.npmjs.com/package/@grpc/grpc-js#supported-channel-options)
to the client constructor.

2. **Making API Calls**

Once you have a client, you can call its methods to interact with the Kessel API. The following is an example of how to
use the `check` method to see if a user has a specific permission for a resource.

The `check` method takes a request object and a callback function. The request object specifies the `subject`
(who is performing the action), the `relation` (the permission to check), and the `object` (the resource being accessed).

```typescript
const request = {
  object: {
    reporter: {
      type: "rbac",
    },
    resourceId: "1234",
    resourceType: "workspace",
  },
  relation: "inventory_host_view",
  subject: {
    reporter: {
      type: "rbac",
    },
    resourceType: "principal",
    resourceId: "localhost/1",
  },
};

client.check(request, (error, response) => {
  if (error) {
    console.error("Failed to perform check:", error);
    return;
  }

  if (response.allowed) {
    console.log("Access granted!");
  } else {
    console.log("Access denied.");
  }
});
```

### Using Promises

For a more modern async/await workflow, you can use Node.js's util.promisify to wrap the client methods in promises.

```typescript
import { promisify } from "util";

const checkAsync = promisify(client.check).bind(client);

async function checkPermission() {
  try {
    const response = await checkAsync(request);
    if (response.allowed) {
      console.log("Access granted!");
    } else {
      console.log("Access denied.");
    }
  } catch (error) {
    console.error("Failed to perform check:", error);
  }
}

checkPermission();
```

## Building the SDK

If you are contributing to the SDK, you will need to build it from the source. The project uses `npm` to manage dependencies.

1. **Install dependencies**

```bash
  npm install
```

2. **Build the project**

```bash
npm run build
```

Building the SDK will create three directories:

- `dist/cjs` - for CommonJS style imports (`require`)
- `dist/esm` - for ES6 style imports (`import`)
- `dist/types` - for TypeScript type definitions

## Running examples

The [./examples](./examples) directory contains several code samples demonstrating how to use the SDK.

To run the examples:

1. **Build the SDK** by following the instructions in the [Building the SDK](#building-the-sdk) section.
2. **Navigate to the examples directory**:

```bash
  cd examples
```

3. **Install the example dependencies**:

```bash
   npm install
```

4. **Run the desired example**:
   - `npm run check`: Checks a permission.
   - `npm run check_for_update`: Checks a permission for an update operation.
   - `npm run report_resource`: Reports a resource to the inventory.
   - `npm run delete_resource`: Deletes a resource from the inventory.
   - `npm run streamed_list_objects`: List objects using a streaming API call
   - `npm run promisify`: Demonstrates how to use promises with the SDK
