import { principalFromRHIdentity, principalFromRHIdentityHeader } from "..";

function encodeHeader(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

describe("principalFromRHIdentity", () => {
  it("resolves User identity", () => {
    const identity = {
      type: "User",
      org_id: "1979710",
      user: { user_id: "7393748", username: "foobar" },
    };
    const ref = principalFromRHIdentity(identity);
    expect(ref.resource?.resourceType).toBe("principal");
    expect(ref.resource?.resourceId).toBe("redhat/7393748");
    expect(ref.resource?.reporter?.type).toBe("rbac");
    expect(ref.relation).toBeUndefined();
  });

  it("resolves ServiceAccount identity", () => {
    const identity = {
      type: "ServiceAccount",
      org_id: "456",
      service_account: {
        user_id: "sa-456",
        client_id: "b69eaf9e",
        username: "svc-b69eaf9e",
      },
    };
    const ref = principalFromRHIdentity(identity);
    expect(ref.resource?.resourceId).toBe("redhat/sa-456");
  });

  it("uses custom domain", () => {
    const identity = {
      type: "User",
      user: { user_id: "42" },
    };
    const ref = principalFromRHIdentity(identity, "custom");
    expect(ref.resource?.resourceId).toBe("custom/42");
  });

  it("throws for unsupported identity type", () => {
    const identity = { type: "System" };
    expect(() => principalFromRHIdentity(identity)).toThrow(
      /Unsupported identity type/,
    );
  });

  it("throws for missing type field", () => {
    const identity = { org_id: "123" } as any;
    expect(() => principalFromRHIdentity(identity)).toThrow(
      /Unsupported identity type/,
    );
  });

  it("throws for missing user details", () => {
    const identity = { type: "User" };
    expect(() => principalFromRHIdentity(identity)).toThrow(
      /missing the "user" field/,
    );
  });

  it("throws for missing service_account details", () => {
    const identity = { type: "ServiceAccount" };
    expect(() => principalFromRHIdentity(identity)).toThrow(
      /missing the "service_account" field/,
    );
  });

  it("throws for missing user_id in User", () => {
    const identity = {
      type: "User",
      user: { username: "foobar" },
    };
    expect(() => principalFromRHIdentity(identity)).toThrow(
      /Unable to resolve user ID/,
    );
  });

  it("throws for empty user_id in User", () => {
    const identity = {
      type: "User",
      user: { user_id: "" },
    };
    expect(() => principalFromRHIdentity(identity)).toThrow(
      /Unable to resolve user ID/,
    );
  });

  it("throws for missing user_id in ServiceAccount", () => {
    const identity = {
      type: "ServiceAccount",
      service_account: { client_id: "b69eaf9e" },
    };
    expect(() => principalFromRHIdentity(identity)).toThrow(
      /Unable to resolve user ID/,
    );
  });

  it("throws when user field is not a map", () => {
    const identity = { type: "User", user: "not-a-map" };
    expect(() => principalFromRHIdentity(identity)).toThrow(
      /missing the "user" field/,
    );
  });

  it("throws for null identity", () => {
    expect(() => principalFromRHIdentity(null as any)).toThrow(
      /identity must be an object/,
    );
  });

  it("throws for string identity", () => {
    expect(() => principalFromRHIdentity("not-an-object" as any)).toThrow(
      /identity must be an object/,
    );
  });
});

describe("principalFromRHIdentityHeader", () => {
  it("decodes valid User header", () => {
    const header = encodeHeader({
      identity: {
        type: "User",
        org_id: "1979710",
        user: { user_id: "7393748", username: "foobar" },
      },
    });
    const ref = principalFromRHIdentityHeader(header);
    expect(ref.resource?.resourceId).toBe("redhat/7393748");
    expect(ref.resource?.resourceType).toBe("principal");
  });

  it("decodes valid ServiceAccount header", () => {
    const header = encodeHeader({
      identity: {
        type: "ServiceAccount",
        org_id: "456",
        service_account: { user_id: "sa-789", client_id: "b69eaf9e" },
      },
    });
    const ref = principalFromRHIdentityHeader(header);
    expect(ref.resource?.resourceId).toBe("redhat/sa-789");
  });

  it("uses custom domain", () => {
    const header = encodeHeader({
      identity: { type: "User", user: { user_id: "1" } },
    });
    const ref = principalFromRHIdentityHeader(header, "acme");
    expect(ref.resource?.resourceId).toBe("acme/1");
  });

  it("throws for missing identity envelope", () => {
    const header = encodeHeader({
      type: "User",
      user: { user_id: "42" },
    });
    expect(() => principalFromRHIdentityHeader(header)).toThrow(
      /missing the "identity" envelope key/,
    );
  });

  it("throws for malformed base64", () => {
    expect(() => principalFromRHIdentityHeader("not-valid-base64!!!")).toThrow(
      /Failed to decode identity header/,
    );
  });

  it("throws for invalid JSON", () => {
    const header = Buffer.from("this is not json").toString("base64");
    expect(() => principalFromRHIdentityHeader(header)).toThrow(
      /Failed to decode identity header/,
    );
  });

  it("throws for unsupported type in header", () => {
    const header = encodeHeader({
      identity: { type: "System" },
    });
    expect(() => principalFromRHIdentityHeader(header)).toThrow(
      /Unsupported identity type/,
    );
  });

  it("decodes realistic User header", () => {
    const header = encodeHeader({
      identity: {
        account_number: "540155",
        org_id: "1979710",
        user: {
          username: "rhn-support-foobar",
          is_internal: true,
          is_org_admin: true,
          first_name: "foo",
          last_name: "bar",
          is_active: true,
          user_id: "7393748",
          email: "example@redhat.com",
        },
        type: "User",
      },
    });
    const ref = principalFromRHIdentityHeader(header);
    expect(ref.resource?.resourceId).toBe("redhat/7393748");
    expect(ref.resource?.resourceType).toBe("principal");
    expect(ref.resource?.reporter?.type).toBe("rbac");
  });

  it("decodes realistic ServiceAccount header", () => {
    const header = encodeHeader({
      identity: {
        org_id: "456",
        type: "ServiceAccount",
        service_account: {
          user_id: "sa-b69eaf9e",
          client_id: "b69eaf9e-e6a6-4f9e-805e-02987daddfbd",
          username: "service-account-b69eaf9e-e6a6-4f9e-805e-02987daddfbd",
        },
      },
    });
    const ref = principalFromRHIdentityHeader(header);
    expect(ref.resource?.resourceId).toBe("redhat/sa-b69eaf9e");
  });

  it("populates all subject fields from header", () => {
    const header = encodeHeader({
      identity: {
        type: "ServiceAccount",
        org_id: "org-1",
        service_account: {
          user_id: "sa-999",
          username: "service-account-sa-999",
        },
      },
    });
    const ref = principalFromRHIdentityHeader(header);
    expect(ref.resource?.resourceType).toBe("principal");
    expect(ref.resource?.resourceId).toBe("redhat/sa-999");
    expect(ref.resource?.reporter?.type).toBe("rbac");
    expect(ref.relation).toBeUndefined();
  });
});
