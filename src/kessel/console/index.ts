import { SubjectReference } from "../inventory/v1beta2/subject_reference";
import { principalSubject } from "../rbac/v2";

const DEFAULT_DOMAIN = "redhat";

const IDENTITY_TYPE_FIELDS: Record<string, string> = {
  User: "user",
  ServiceAccount: "service_account",
};

function extractUserID(
  identity: Record<string, unknown> | null | undefined,
): string {
  if (identity == null || typeof identity !== "object") {
    throw new Error("identity must be an object");
  }

  const identityType = identity.type as string | undefined;
  const field = identityType ? IDENTITY_TYPE_FIELDS[identityType] : undefined;

  if (!field) {
    const supported = Object.keys(IDENTITY_TYPE_FIELDS).sort().join(", ");
    throw new Error(
      `Unsupported identity type: "${identityType}" (supported: ${supported})`,
    );
  }

  const details = identity[field];
  if (details == null || typeof details !== "object") {
    throw new Error(
      `Identity type "${identityType}" is missing the "${field}" field`,
    );
  }

  const userId = (details as Record<string, unknown>).user_id;
  if (!userId || typeof userId !== "string") {
    throw new Error(
      `Unable to resolve user ID from ${identityType} identity (tried: user_id)`,
    );
  }

  return userId;
}

export const principalFromRHIdentity = (
  identity: Record<string, unknown>,
  domain: string = DEFAULT_DOMAIN,
): SubjectReference => {
  const userId = extractUserID(identity);
  return principalSubject(userId, domain);
};

export const principalFromRHIdentityHeader = (
  header: string,
  domain: string = DEFAULT_DOMAIN,
): SubjectReference => {
  let decoded: Record<string, unknown>;
  try {
    const json = Buffer.from(header, "base64").toString("utf-8");
    decoded = JSON.parse(json);
  } catch (e) {
    throw new Error(
      `Failed to decode identity header: ${e instanceof Error ? e.message : e}`,
    );
  }

  if (decoded == null || typeof decoded !== "object") {
    throw new Error("Identity header did not decode to a JSON object");
  }

  const identity = decoded.identity as Record<string, unknown> | undefined;
  if (identity == null) {
    throw new Error(
      'Identity header is missing the "identity" envelope key',
    );
  }

  return principalFromRHIdentity(identity, domain);
};
