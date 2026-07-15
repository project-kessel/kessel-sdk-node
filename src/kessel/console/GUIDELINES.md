# Console Module Guidelines

Rules for working in `src/kessel/console/` -- Red Hat identity header parsing and principal extraction.

## Module Overview

`index.ts` is entirely hand-written. It provides two functions:

- `principalFromRHIdentity(identity, domain?)` -- extracts a `SubjectReference` from a parsed identity object
- `principalFromRHIdentityHeader(header, domain?)` -- decodes a base64-encoded `x-rh-identity` header and extracts the principal

Both return a `SubjectReference` via `principalSubject()` from the RBAC module.

## Supported Identity Types

The `IDENTITY_TYPE_FIELDS` map defines which identity types are supported and where to find the user ID:

| Identity Type    | Field             | User ID path                       |
| ---------------- | ----------------- | ---------------------------------- |
| `User`           | `user`            | `identity.user.user_id`            |
| `ServiceAccount` | `service_account` | `identity.service_account.user_id` |

Adding a new identity type requires:

1. Adding an entry to `IDENTITY_TYPE_FIELDS`
2. Adding test cases for the new type (success, missing field, missing user_id)

## Default Domain

The default domain is `"redhat"` (constant `DEFAULT_DOMAIN`). The domain is passed through to `principalSubject(userId, domain)`, which formats the resource ID as `${domain}/${userId}`.

## Header Decoding Pipeline

`principalFromRHIdentityHeader` follows this pipeline:

1. Base64-decode the header string via `Buffer.from(header, "base64").toString("utf-8")`
2. JSON-parse the decoded string
3. Extract the `identity` key from the envelope
4. Pass to `principalFromRHIdentity`

Each step has a distinct error message for debuggability.

## Error Messages

The module throws descriptive `Error` messages at each validation step:

- `"identity must be an object"` -- null, undefined, or non-object identity
- `"Unsupported identity type: \"X\" (supported: Y, Z)"` -- type not in `IDENTITY_TYPE_FIELDS`
- `"Identity type \"X\" is missing the \"Y\" field"` -- details field is null or not an object
- `"Unable to resolve user ID from X identity (tried: user_id)"` -- `user_id` is missing or empty
- `"Failed to decode identity header: ..."` -- base64 or JSON parse failure
- `"Identity header did not decode to a JSON object"` -- decoded value is not an object
- `"Identity header is missing the \"identity\" envelope key"` -- no `identity` key in decoded object

Preserve these exact messages -- tests match against them with regex patterns.

## Dependencies

This module depends on:

- `../inventory/v1beta2/subject_reference` -- for the `SubjectReference` type
- `../rbac/v2` -- for the `principalSubject()` factory function

It does not import `oauth4webapi` or `@grpc/grpc-js`.

## Testing Conventions

Tests are in `__tests__/index.ts`. Key patterns:

- Use a `encodeHeader()` helper that base64-encodes an object for header tests
- Test both `principalFromRHIdentity` and `principalFromRHIdentityHeader` separately
- Test every error path -- unsupported type, missing field, missing user_id, null identity, malformed base64
- Test realistic header payloads (with `account_number`, `org_id`, `username`, `is_internal`, etc.)
- Verify the full `SubjectReference` shape: `resource.resourceType`, `resource.resourceId`, `resource.reporter.type`, and `relation`
- Import from `".."` (parent index.ts), not from the package path

## Do Not

- Define custom error classes -- use plain `Error`
- Use `atob()` -- use `Buffer.from(header, "base64")` for Node.js compatibility
- Add authentication logic here -- this module only parses identity, it does not validate tokens
- Change error message strings without updating the corresponding test assertions
