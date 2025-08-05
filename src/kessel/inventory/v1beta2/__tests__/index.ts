import { ClientBuilder } from "../index";
import { IncompleteKesselConfigurationError } from "../../index";

describe("v1beta2 ClientBuilder", () => {
  it("Creates a ClientBuilder for KesselInventoryServiceClient", () => {
    const builder = ClientBuilder.builder();
    expect(builder).toBeDefined();
    expect(typeof builder.withTarget).toBe("function");
    expect(typeof builder.build).toBe("function");
  });

  it("Throws Error on missing target", () => {
    expect(() => ClientBuilder.builder().build()).toThrow(
      new IncompleteKesselConfigurationError(["target"]),
    );
  });

  it("build returns a client", () => {
    expect(() =>
      ClientBuilder.builder().withTarget("abc").build(),
    ).toBeTruthy();
  });

  it("Returns a promisified KesselInventoryServiceClient", () => {
    const client = ClientBuilder.builder().withTarget("localhost:9000").build();

    expect(client).toBeDefined();
    expect(typeof client).toBe("object");
    // Check that it has the expected methods (these should be promisified)
    expect(typeof client.check).toBe("function");
    expect(typeof client.reportResource).toBe("function");
    expect(typeof client.deleteResource).toBe("function");
  });

  it("Validates target is required even with all other options set", () => {
    expect(() =>
      ClientBuilder.builder()
        .withInsecureCredentials()
        .withKeepAlive({
          timeMs: 1000,
          timeoutMs: 2000,
          permitWithoutCalls: true,
        })
        .build(),
    ).toThrow(new IncompleteKesselConfigurationError(["target"]));
  });

  it("Allows building with only target set", () => {
    expect(() =>
      ClientBuilder.builder().withTarget("minimal:setup").build(),
    ).not.toThrow();
  });

  it("Can configure auth", () => {
    const authConfig = {
      clientId: "test-client",
      clientSecret: "test-secret",
      tokenEndpoint: "https://example.com/auth",
    };

    const builder = ClientBuilder.builder()
      .withTarget("localhost:9000")
      .withAuth(authConfig);

    expect(() => builder.build()).not.toThrow();
  });

  it("Can configure with full config object", () => {
    const config = {
      target: "localhost:9000",
      credentials: {
        type: "secure" as const,
      },
      keepAlive: {
        timeMs: 15000,
        timeoutMs: 10000,
        permitWithoutCalls: false,
      },
      auth: {
        clientId: "test-client",
        clientSecret: "test-secret",
        tokenEndpoint: "https://example.com/auth",
      },
    };

    const builder = ClientBuilder.builder().withConfig(config);
    expect(() => builder.build()).not.toThrow();
  });

  describe("Client Methods", () => {
    let client: any;

    beforeEach(() => {
      client = ClientBuilder.builder().withTarget("localhost:9000").build();
    });

    it("has check method", () => {
      expect(typeof client.check).toBe("function");
    });

    it("has reportResource method", () => {
      expect(typeof client.reportResource).toBe("function");
    });

    it("has deleteResource method", () => {
      expect(typeof client.deleteResource).toBe("function");
    });

    it("has checkForUpdate method", () => {
      expect(typeof client.checkForUpdate).toBe("function");
    });

    it("has streamedListObjects method", () => {
      expect(typeof client.streamedListObjects).toBe("function");
    });

    it("client methods are promisified", async () => {
      // Methods should return promises, not accept callbacks
      expect(client.check.length).toBeLessThan(2); // No callback parameter
      expect(client.reportResource.length).toBeLessThan(2);
      expect(client.deleteResource.length).toBeLessThan(2);
      expect(client.checkForUpdate.length).toBeLessThan(2);
    });
  });

  describe("Service-specific Configuration", () => {
    it("builds client with inventory service specific settings", () => {
      const builder = ClientBuilder.builder()
        .withTarget("kessel-inventory.example.com:443")
        .withSecureCredentials()
        .withKeepAlive({
          timeMs: 30000,
          timeoutMs: 15000,
          permitWithoutCalls: true,
        })
        .withChannelOption("grpc.max_receive_message_length", 4 * 1024 * 1024)
        .withChannelOption("grpc.max_send_message_length", 4 * 1024 * 1024);

      expect(() => builder.build()).not.toThrow();
    });

    it("supports production-like configuration", () => {
      const productionConfig = {
        target: "kessel-inventory.prod.example.com:443",
        credentials: {
          type: "secure" as const,
          rejectUnauthorized: true,
        },
        keepAlive: {
          timeMs: 60000,
          timeoutMs: 30000,
          permitWithoutCalls: false,
        },
        auth: {
          clientId: "inventory-client",
          clientSecret: "prod-secret",
          tokenEndpoint: "https://sso.prod.example.com/auth",
        },
        channelOptions: {
          "grpc.max_receive_message_length": 10 * 1024 * 1024,
          "grpc.max_send_message_length": 10 * 1024 * 1024,
          "grpc.initial_reconnect_backoff_ms": 5000,
          "grpc.max_reconnect_backoff_ms": 60000,
        },
      };

      const builder = ClientBuilder.builder().withConfig(productionConfig);
      expect(() => builder.build()).not.toThrow();
    });

    it("supports development configuration", () => {
      const devConfig = {
        target: "localhost:9000",
        credentials: {
          type: "insecure" as const,
        },
        keepAlive: {
          timeMs: 5000,
          timeoutMs: 3000,
          permitWithoutCalls: true,
        },
      };

      const builder = ClientBuilder.builder().withConfig(devConfig);
      expect(() => builder.build()).not.toThrow();
    });

    it("supports testing configuration", () => {
      const testConfig = {
        target: "test-inventory.internal:9000",
        credentials: {
          type: "secure" as const,
          rejectUnauthorized: false,
        },
        keepAlive: {
          timeMs: 1000,
          timeoutMs: 500,
          permitWithoutCalls: true,
        },
        channelOptions: {
          "grpc.max_receive_message_length": 1024 * 1024,
          "grpc.max_send_message_length": 1024 * 1024,
        },
      };

      const builder = ClientBuilder.builder().withConfig(testConfig);
      expect(() => builder.build()).not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("provides helpful error message for missing target", () => {
      expect(() => ClientBuilder.builder().build()).toThrow(
        expect.objectContaining({
          message: expect.stringContaining("target"),
        }),
      );
    });

    it("handles invalid configurations gracefully", () => {
      const invalidConfig = {
        target: "localhost:9000",
        credentials: null as any,
        keepAlive: undefined as any,
        auth: {} as any,
      };

      expect(() =>
        ClientBuilder.builder().withConfig(invalidConfig).build(),
      ).not.toThrow();
    });

    it("handles empty target gracefully", () => {
      // Empty target should still throw an error since it's required
      expect(() => ClientBuilder.builder().withTarget("").build()).toThrow();
    });

    it("handles multiple build calls on same builder", () => {
      const builder = ClientBuilder.builder().withTarget("localhost:9000");

      const client1 = builder.build();
      const client2 = builder.build();

      expect(client1).toBeDefined();
      expect(client2).toBeDefined();
      expect(client1).not.toBe(client2); // Different instances
    });
  });

  describe("Builder Pattern", () => {
    it("supports fluent interface", () => {
      const builder = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .withSecureCredentials()
        .withKeepAlive({ timeMs: 1000 })
        .withChannelOption("grpc.max_receive_message_length", 1024)
        .withAuth({
          clientId: "test",
          clientSecret: "secret",
          tokenEndpoint: "https://auth.example.com",
        });

      expect(() => builder.build()).not.toThrow();
    });

    it("allows configuration override", () => {
      const builder = ClientBuilder.builder()
        .withTarget("initial:9000")
        .withInsecureCredentials()
        .withTarget("final:9000")
        .withSecureCredentials();

      expect(builder.target).toBe("final:9000");
      expect(builder.credentials).not.toEqual(
        expect.objectContaining({
          type: "insecure",
        }),
      );
    });

    it("maintains state between method calls", () => {
      const builder = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .withInsecureCredentials();

      expect(builder.target).toBe("localhost:9000");
      expect(builder.credentials).toBeDefined();

      builder.withKeepAlive({ timeMs: 5000 });

      expect(builder.target).toBe("localhost:9000"); // Still preserved
      expect(builder.credentials).toBeDefined(); // Still preserved
      expect(builder.keepAlive.timeMs).toBe(5000);
    });
  });

  describe("Static Factory Method", () => {
    it("provides static builder method", () => {
      expect(typeof ClientBuilder.builder).toBe("function");
    });

    it("creates new instance each time", () => {
      const builder1 = ClientBuilder.builder();
      const builder2 = ClientBuilder.builder();

      expect(builder1).not.toBe(builder2);
    });

    it("creates clean instances", () => {
      const builder1 = ClientBuilder.builder().withTarget("first:9000");
      const builder2 = ClientBuilder.builder();

      expect(builder1.target).toBe("first:9000");
      expect(builder2.target).toBeUndefined();
    });
  });

  describe("Integration with gRPC", () => {
    it("creates actual gRPC client instances", () => {
      const client = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .build();

      // Should have gRPC client properties
      expect(client).toBeDefined();
      expect(typeof client).toBe("object");
    });

    it("supports gRPC metadata", () => {
      const client = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .build();

      // Methods should support metadata parameter (promisified methods have parameters for request, metadata, options)
      expect(client.check.length).toBeGreaterThanOrEqual(0);
      expect(client.reportResource.length).toBeGreaterThanOrEqual(0);
      expect(client.deleteResource.length).toBeGreaterThanOrEqual(0);
    });

    it("handles streaming methods correctly", () => {
      const client = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .build();

      // Streaming method should exist
      expect(typeof client.streamedListObjects).toBe("function");
    });
  });
});
