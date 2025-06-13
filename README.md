# kessel-sdk-node

Kessel SDK for Node.js

## Building

Kessel SDK for Node.js uses `npm` to manage its dependencies and as such is required for building.

First install the dependencies then build the project.

1. `npm install`
2. `npm run build`

Building the SDK will create three directories:

- cjs - for CommonJS style imports
- esm - for ES6 style imports
- types - for TypeScript type definitions

## Running examples

The [./examples](./examples) directory demonstrates how to use this library.
You must [build](#building) the SDK before running any examples.

1. `cd examples`
2. `npm install`
3. Run the desired example:
   1. `npm run check`
   2. `npm run check_for_update`
   3. `npm run report_resource`
   4. `npm run delete_resource`
   5. `npm run streamed_list_objects`
