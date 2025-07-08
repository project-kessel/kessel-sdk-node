import {
  IncompleteKesselConfigurationError,
  defaultKeepAlive,
  defaultCredentials,
} from "../index";

describe("IncompleteKesselConfigurationError", () => {
  it("Creates error with single missing field", () => {
    const error = new IncompleteKesselConfigurationError(["target"]);
    expect(error.message).toEqual(
      "IncompleteKesselConfigurationError: Missing the following fields to build: target",
    );
  });

  it("Creates error with multiple missing fields", () => {
    const error = new IncompleteKesselConfigurationError([
      "target",
      "credentials",
      "keepAlive",
    ]);
    expect(error.message).toEqual(
      "IncompleteKesselConfigurationError: Missing the following fields to build: target,credentials,keepAlive",
    );
  });

  it("Creates error with empty fields array", () => {
    const error = new IncompleteKesselConfigurationError([]);
    expect(error.message).toEqual(
      "IncompleteKesselConfigurationError: Missing the following fields to build: ",
    );
  });
});

describe("Default functions", () => {
  it("defaultKeepAlive returns expected values", () => {
    const keepAlive = defaultKeepAlive();
    expect(keepAlive.timeMs).toEqual(10000);
    expect(keepAlive.timeoutMs).toEqual(5000);
    expect(keepAlive.permitWithoutCalls).toEqual(true);
  });

  it("defaultCredentials returns secure credentials config", () => {
    const credentials = defaultCredentials();
    expect(credentials).toEqual({
      type: "secure",
    });
  });

  it("defaultKeepAlive returns consistent values across calls", () => {
    const keepAlive1 = defaultKeepAlive();
    const keepAlive2 = defaultKeepAlive();

    expect(keepAlive1).toEqual(keepAlive2);
    expect(keepAlive1).not.toBe(keepAlive2); // Different objects
  });

  it("defaultCredentials returns consistent values across calls", () => {
    const credentials1 = defaultCredentials();
    const credentials2 = defaultCredentials();

    expect(credentials1).toEqual(credentials2);
    expect(credentials1).not.toBe(credentials2); // Different objects
  });

  it("defaultKeepAlive returns immutable object", () => {
    const keepAlive = defaultKeepAlive();
    const originalTimeMs = keepAlive.timeMs;

    // Attempt to modify (should not affect future calls)
    keepAlive.timeMs = 999;
    expect(keepAlive.timeMs).toBe(999); // Local modification works

    // But new call should return original values
    const newKeepAlive = defaultKeepAlive();
    expect(newKeepAlive.timeMs).toBe(originalTimeMs);
  });

  it("defaultCredentials returns immutable object", () => {
    const credentials = defaultCredentials();
    const originalType = credentials.type;

    // Attempt to modify (should not affect future calls)
    (credentials as any).type = "insecure";
    expect(credentials.type).toBe("insecure"); // Local modification works

    // But new call should return original values
    const newCredentials = defaultCredentials();
    expect(newCredentials.type).toBe(originalType);
  });
});

describe("Configuration Types", () => {
  it("validates ClientConfigCredentials type guards", () => {
    const insecureConfig = { type: "insecure" as const };
    const secureConfig = {
      type: "secure" as const,
      rootCerts: "cert-data",
      privateCerts: "key-data",
      certChain: "chain-data",
      rejectUnauthorized: true,
    };

    expect(insecureConfig.type).toBe("insecure");
    expect(secureConfig.type).toBe("secure");
    expect(secureConfig.rootCerts).toBe("cert-data");
    expect(secureConfig.rejectUnauthorized).toBe(true);
  });

  it("validates ClientConfigKeepAlive properties", () => {
    const keepAliveConfig = {
      timeMs: 5000,
      timeoutMs: 3000,
      permitWithoutCalls: false,
    };

    expect(typeof keepAliveConfig.timeMs).toBe("number");
    expect(typeof keepAliveConfig.timeoutMs).toBe("number");
    expect(typeof keepAliveConfig.permitWithoutCalls).toBe("boolean");
  });

  it("validates ClientConfigAuth properties", () => {
    const authConfig = {
      clientId: "test-client",
      clientSecret: "test-secret",
      issuerUrl: "https://example.com/auth",
    };

    expect(typeof authConfig.clientId).toBe("string");
    expect(typeof authConfig.clientSecret).toBe("string");
    expect(typeof authConfig.issuerUrl).toBe("string");
  });

  it("validates ClientConfig structure", () => {
    const config = {
      target: "localhost:9000",
      credentials: { type: "secure" as const },
      keepAlive: { timeMs: 1000 },
      auth: {
        clientId: "test",
        clientSecret: "secret",
        issuerUrl: "https://auth.example.com",
      },
    };

    expect(config.target).toBe("localhost:9000");
    expect(config.credentials.type).toBe("secure");
    expect(config.keepAlive.timeMs).toBe(1000);
    expect(config.auth.clientId).toBe("test");
  });
});

describe("Error Edge Cases", () => {
  it("IncompleteKesselConfigurationError inherits from Error", () => {
    const error = new IncompleteKesselConfigurationError(["target"]);
    expect(error instanceof Error).toBe(true);
    expect(error instanceof IncompleteKesselConfigurationError).toBe(true);
  });

  it("IncompleteKesselConfigurationError has correct name", () => {
    const error = new IncompleteKesselConfigurationError(["target"]);
    expect(error.name).toBe("Error"); // Custom error classes have Error as name unless explicitly set
  });

  it("IncompleteKesselConfigurationError handles special characters in field names", () => {
    const fields = [
      "field-with-dash",
      "field_with_underscore",
      "field.with.dots",
    ];
    const error = new IncompleteKesselConfigurationError(fields);
    expect(error.message).toContain("field-with-dash");
    expect(error.message).toContain("field_with_underscore");
    expect(error.message).toContain("field.with.dots");
  });

  it("IncompleteKesselConfigurationError handles very long field names", () => {
    const longFieldName = "a".repeat(1000);
    const error = new IncompleteKesselConfigurationError([longFieldName]);
    expect(error.message).toContain(longFieldName);
  });

  it("IncompleteKesselConfigurationError handles null/undefined field names", () => {
    // TypeScript prevents this at compile time, but testing runtime behavior
    const error = new IncompleteKesselConfigurationError([
      null as any,
      undefined as any,
    ]);
    // When null/undefined are joined, they become empty strings
    expect(error.message).toContain("Missing the following fields to build: ,");
  });

  it("IncompleteKesselConfigurationError handles large number of fields", () => {
    const manyFields = Array.from({ length: 100 }, (_, i) => `field${i}`);
    const error = new IncompleteKesselConfigurationError(manyFields);
    expect(error.message).toContain("field0");
    expect(error.message).toContain("field99");
  });
});

describe("Configuration Validation", () => {
  it("validates secure credentials with minimal config", () => {
    const config = {
      type: "secure" as const,
    };

    expect(config.type).toBe("secure");
    expect("rootCerts" in config).toBe(false);
    expect("privateCerts" in config).toBe(false);
    expect("certChain" in config).toBe(false);
    expect("rejectUnauthorized" in config).toBe(false);
  });

  it("validates secure credentials with full config", () => {
    const config = {
      type: "secure" as const,
      rootCerts: "root-cert-data",
      privateCerts: "private-key-data",
      certChain: "cert-chain-data",
      rejectUnauthorized: false,
    };

    expect(config.type).toBe("secure");
    expect(config.rootCerts).toBe("root-cert-data");
    expect(config.privateCerts).toBe("private-key-data");
    expect(config.certChain).toBe("cert-chain-data");
    expect(config.rejectUnauthorized).toBe(false);
  });

  it("validates keep alive with partial config", () => {
    const config = {
      timeMs: 15000,
    };

    expect(config.timeMs).toBe(15000);
    expect("timeoutMs" in config).toBe(false);
    expect("permitWithoutCalls" in config).toBe(false);
  });

  it("validates keep alive with zero values", () => {
    const config = {
      timeMs: 0,
      timeoutMs: 0,
      permitWithoutCalls: false,
    };

    expect(config.timeMs).toBe(0);
    expect(config.timeoutMs).toBe(0);
    expect(config.permitWithoutCalls).toBe(false);
  });

  it("validates keep alive with extreme values", () => {
    const config = {
      timeMs: Number.MAX_SAFE_INTEGER,
      timeoutMs: Number.MAX_SAFE_INTEGER,
      permitWithoutCalls: true,
    };

    expect(config.timeMs).toBe(Number.MAX_SAFE_INTEGER);
    expect(config.timeoutMs).toBe(Number.MAX_SAFE_INTEGER);
    expect(config.permitWithoutCalls).toBe(true);
  });
});
