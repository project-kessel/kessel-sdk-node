# RBAC Module Guidelines

Rules for working in `src/kessel/rbac/` -- REST workspace helpers, resource/subject factories, and paginated streaming.

## Module Overview

`v2.ts` is entirely hand-written. It provides:
- `fetchDefaultWorkspace()` / `fetchRootWorkspace()` -- REST calls to the RBAC v2 API
- Resource/subject factory functions for the Kessel authorization model
- `listWorkspaces()` -- async generator for paginated workspace listing via gRPC streaming

This module bridges two protocols: HTTP REST (workspace fetching) and gRPC streaming (workspace listing).

## REST Workspace Helpers

### Endpoint and headers

- Base path: `/api/rbac/v2/workspaces/` (constant `WORKSPACE_ENDPOINT`)
- Workspace type passed as query parameter: `?type=default` or `?type=root`
- Required header: `x-rh-rbac-org-id` -- organizational context; omitting it causes auth failures
- Trailing slashes on `rbacBaseEndpoint` are stripped before constructing the URL

### Auth is optional

The `auth?: AuthRequest` parameter is optional. When provided, `auth.configureRequest(request)` is called before `fetch()`. If auth fails, `fetch()` is never invoked.

### Error semantics

- Non-200 status: throws `Error` with the status code in the message
- Wrong number of workspaces (not exactly 1): throws `Error` with the count
- These are plain `Error`, not gRPC `ServiceError` -- do not check for gRPC status codes

## Resource and Subject Factory Functions

All RBAC resources use `reporter.type: "rbac"`. The factories enforce this:

| Function | Returns | Resource ID format |
|---|---|---|
| `principalResource(id, domain)` | `ResourceReference` | `${domain}/${id}` |
| `principalSubject(id, domain)` | `SubjectReference` | wraps `principalResource` |
| `workspaceResource(id)` | `ResourceReference` | plain `id` |
| `roleResource(id)` | `ResourceReference` | plain `id` |
| `subject(resource, relation?)` | `SubjectReference` | from any `ResourceReference` |
| `workspaceType()` | `RepresentationType` | -- |
| `roleType()` | `RepresentationType` | -- |

The `principalResource` ID format `${domain}/${id}` is required by the Kessel authorization model. Do not change the separator or ordering.

## listWorkspaces Async Generator

### Pagination pattern

`listWorkspaces()` wraps `streamedListObjects` and handles continuation-token pagination:
1. Sends a request with `pagination.limit = DEFAULT_PAGE_LIMIT` (1000)
2. Yields each `StreamedListObjectsResponse` from the stream
3. Captures `continuationToken` from each response's pagination field
4. When the stream ends, starts a new request with the last token
5. Stops when: no responses received, or token is empty/missing

### Fourth parameter overloading

The fourth parameter accepts either:
- A plain `string` (continuation token) -- for backward compatibility
- A `ListWorkspacesOptions` object with `continuationToken` and/or `consistency`

The function normalizes both forms internally. Do not break backward compatibility by removing the string overload.

### Consistency propagation

When `consistency` is provided via options, it is passed on every paginated request (not just the first). This is intentional -- consistency must be preserved across all pages.

### Typed client interface

`listWorkspaces` accepts a minimal interface, not a full client:
```typescript
inventory: {
  streamedListObjects: (request: StreamedListObjectsRequest) => AsyncIterable<StreamedListObjectsResponse>;
}
```
This makes it testable with mock objects.

## Imports

This module imports generated types from `../inventory/v1beta2/` using relative paths. It imports `AuthRequest` from `../auth`. Tests import from `../v2` (the source module).

## Testing Conventions

Tests are in `__tests__/v2.ts`. Key patterns:

- Mock `global.fetch` directly: `const mockFetch = jest.fn(); global.fetch = mockFetch;`
- Mock responses use `{ status: 200, json: jest.fn().mockResolvedValue({...}) }`, not real `Response` objects
- Mock `AuthRequest` with inline implementations that set headers
- Test async generators with `createMockInventoryClient()` factory using closure counters for pagination
- Consume generators with `for await` and collect results into arrays
- Verify captured requests via `mock.requests` array

## Do Not

- Define custom error classes -- use plain `Error`
- Use gRPC-style error handling for REST calls
- Change the `${domain}/${id}` format for principal resource IDs
- Remove the string overload of `listWorkspaces`' fourth parameter
- Assume `listWorkspaces` will be called with a full gRPC client -- it uses a minimal interface
