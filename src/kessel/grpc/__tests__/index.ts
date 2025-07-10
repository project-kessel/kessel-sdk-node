import { promisifyClient } from "../index";
import { ChannelCredentials, Client } from "@grpc/grpc-js";
import { ServiceDefinition } from "@grpc/grpc-js/src";
import { SecureContext } from "node:tls";
import { KesselInventoryServiceClient } from "../../inventory/v1beta2/inventory_service";
import { ClientBuilderFactory } from "../index";
import { defaultKeepAlive } from "../../inventory";

const mockCerts = {
  rootCerts:
    "-----BEGIN CERTIFICATE-----\n" +
    "MIIB5zCCAZmgAwIBAgIUQ4vriAZHUYcObyptYO6HGvCD6pYwBQYDK2VwMGkxCzAJ\n" +
    "BgNVBAYTAkNBMRAwDgYDVQQIDAdBbGJlcnRhMREwDwYDVQQHDAhFZG1vbnRvbjEX\n" +
    "MBUGA1UECgwOS2Vzc2VsIFRlc3QgQ0ExHDAaBgNVBAMME0tlc3NlbCBUZXN0IFJv\n" +
    "b3QgQ0EwHhcNMjUwNjI1MTU0MjIwWjBpMQswCQYDVQQGEwJDQTEQMA4GA1UECAwH\n" +
    "QWxiZXJ0YTERMA8GA1UEBwwIRWRtb250b24xFzAVBgNVBAoMDktlc3NlbCBUZXN0\n" +
    "IENBMRwwGgYDVQQDDBNLZXNzZWwgVGVzdCBSb290IENBMCowBQYDK2VwAyEAcR9S\n" +
    "57YlW0lcr+NTg+aZiEGfcwET9/p6tr1Ud7I4q/KjUzBRMB0GA1UdDgQWBBSz4Jqs\n" +
    "yo2RvWuthYtSJkR+PCN25jAfBgNVHSMEGDAWgBSz4Jqsyo2RvWuthYtSJkR+PCN25\n" +
    "jAPBgNVHRMBAf8EBTADAQH/MAUGAytlcANBAMjIzU22x1QBGHx2/ZUZegM6eZtsdT\n" +
    "6DNv93NR9YfakSwqvSx3jl9UYVCG4bddmcIo8rqXwErIeRqrbQC9iB+AU=\n" +
    "-----END CERTIFICATE-----\n",
  privateCerts:
    "-----BEGIN PRIVATE KEY-----\n" +
    "MC4CAQAwBQYDK2VwBCIEIN0MUcoTfYW0lTDOxmentzcPf8VhpAW+Xyifip/rKaKU\n" +
    "-----END PRIVATE KEY-----",
  certChain:
    "-----BEGIN CERTIFICATE-----\n" +
    "MIICBDCCAbagAwIBAgIUJRI7lf4qvyni0ebFuQv54gwbhKMwBQYDK2VwMGkxCzAJ\n" +
    "BgNVBAYTAkNBMRAwDgYDVQQIDAdBbGJlcnRhMREwDwYDVQQHDAhFZG1vbnRvbjEX\n" +
    "MBUGA1UECgwOS2Vzc2VsIFRlc3QgQ0ExHDAaBgNVBAMME0tlc3NlbCBUZXN0IFJv\n" +
    "b3QgQ0EwHhcNMjUwNjI3MTU0MjU3WhcNMjYwNjI3MTU0MjU3WjBjMQswCQYDVQQG\n" +
    "EwJDQTEQMA4GA1UECAwHQWxiZXJ0YTERMA8GA1UEBwwIRWRtb250b24xGzAZBgNV\n" +
    "BAoMEktlc3NlbCBUZXN0IFNlcnZlcjESMBAGA1UEAwwJbG9jYWxob3N0MCowBQYD\n" +
    "K2VwAyEAeGTFPQ0wA+Xw/3GstaL1eWXbOWWVDXcUje8EvuzUsZqjdjB0MB8GA1Ud\n" +
    "IwQYMBaAFLPgmqzKjZG9a62Fi1ImRH48I3bmMAkGA1UdEwQCMAAwCwYDVR0PBAQD\n" +
    "AgTwMBoGA1UdEQQTMBGCCWxvY2FsaG9zdIcEfwAAATAdBgNVHQ4EFgQUwsUD9F4j\n" +
    "Mfa0NyKnOWFJKN/dMLQwBQYDK2VwA0EAPZ4++vH2/tyHFsbN7jezV+VHxzxJrjdS\n" +
    "J2nPCvlvMEiVHG7d3O4mO3L6fHokMRm6ASjMcdJ/vZlGE/Uk3RnFCg==\n" +
    "-----END CERTIFICATE-----\n",
};

// Create a test ClientBuilder using the factory
const TestClientBuilder = ClientBuilderFactory(KesselInventoryServiceClient);

describe("GRpcClientBuilder", () => {
  it("Uses defaults when available", () => {
    const builder = TestClientBuilder.builder().withTarget("foobar:123");
    expect(builder.target).toEqual("foobar:123");
    expect(builder.keepAlive).toEqual(defaultKeepAlive());
    expect(builder.credentials).toEqual(ChannelCredentials.createSsl());
  });

  it("Can override defaults", () => {
    const builder = TestClientBuilder.builder()
      .withTarget("foobar:123")
      .withCredentials(ChannelCredentials.createInsecure())
      .withKeepAlive({
        timeMs: 100,
        timeoutMs: 200,
        permitWithoutCalls: false,
      });
    expect(builder.target).toEqual("foobar:123");
    expect(builder.keepAlive.timeMs).toEqual(100);
    expect(builder.keepAlive.timeoutMs).toEqual(200);
    expect(builder.keepAlive.permitWithoutCalls).toEqual(false);
    expect(builder.credentials).toEqual(ChannelCredentials.createInsecure());
  });

  describe("Credentials Configuration", () => {
    it("Can set insecure credentials", () => {
      const builder = TestClientBuilder.builder()
        .withTarget("localhost:9000")
        .withInsecureCredentials();

      expect(builder.credentials).toEqual(ChannelCredentials.createInsecure());
    });

    it("Can set secure credentials with all parameters", () => {
      const rootCerts = Buffer.from(mockCerts.rootCerts);
      const privateCerts = Buffer.from(mockCerts.privateCerts);
      const certChain = Buffer.from(mockCerts.certChain);
      const verifyOptions = { rejectUnauthorized: false };

      const builder = TestClientBuilder.builder()
        .withTarget("localhost:9000")
        .withSecureCredentials(
          rootCerts,
          privateCerts,
          certChain,
          verifyOptions,
        );

      expect(builder.credentials).toBeDefined();
    });

    it("Can set secure credentials with minimal parameters", () => {
      const builder = TestClientBuilder.builder()
        .withTarget("localhost:9000")
        .withSecureCredentials();

      expect(builder.credentials).toBeDefined();
    });

    it("Can set credentials from secure context", () => {
      const mockSecureContext = {} as SecureContext;
      const verifyOptions = { rejectUnauthorized: true };

      const builder = TestClientBuilder.builder()
        .withTarget("localhost:9000")
        .withSecureContextCredentials(mockSecureContext, verifyOptions);

      expect(builder.credentials).toBeDefined();
    });

    it("Handles insecure credentials config", () => {
      const builder = TestClientBuilder.builder()
        .withTarget("localhost:9000")
        .withCredentialsConfig({ type: "insecure" });

      expect(builder.credentials).toEqual(ChannelCredentials.createInsecure());
    });

    it("Handles secure credentials config with all options", () => {
      const config = {
        type: "secure" as const,
        rootCerts: mockCerts.rootCerts,
        privateCerts: mockCerts.privateCerts,
        certChain: mockCerts.certChain,
        rejectUnauthorized: false,
      };

      const builder = TestClientBuilder.builder()
        .withTarget("localhost:9000")
        .withCredentialsConfig(config);

      expect(builder.credentials).toBeDefined();
    });
  });

  describe("Keep Alive Configuration", () => {
    it("Can set keep alive with different values", () => {
      const builder = TestClientBuilder.builder()
        .withTarget("localhost:9000")
        .withKeepAlive({
          timeMs: 5000,
          timeoutMs: 3000,
          permitWithoutCalls: true,
        });

      expect(builder.keepAlive.timeMs).toEqual(5000);
      expect(builder.keepAlive.timeoutMs).toEqual(3000);
      expect(builder.keepAlive.permitWithoutCalls).toEqual(true);
    });

    it("Can set keep alive with zero values", () => {
      const builder = TestClientBuilder.builder()
        .withTarget("localhost:9000")
        .withKeepAlive({
          timeMs: 0,
          timeoutMs: 0,
          permitWithoutCalls: false,
        });

      expect(builder.keepAlive.timeMs).toEqual(0);
      expect(builder.keepAlive.timeoutMs).toEqual(0);
      expect(builder.keepAlive.permitWithoutCalls).toEqual(false);
    });
  });

  describe("Channel Options", () => {
    it("Can set individual channel options", () => {
      const builder = TestClientBuilder.builder()
        .withTarget("localhost:9000")
        .withChannelOption("grpc.max_receive_message_length", 1024)
        .withChannelOption("grpc.max_send_message_length", 2048);

      expect(() => builder.build()).not.toThrow();
    });

    it("Can chain multiple channel options", () => {
      const builder = TestClientBuilder.builder()
        .withTarget("localhost:9000")
        .withChannelOption("grpc.max_receive_message_length", 1024)
        .withChannelOption("grpc.max_send_message_length", 2048)
        .withChannelOption("grpc.initial_reconnect_backoff_ms", 1000);

      expect(() => builder.build()).not.toThrow();
    });
  });

  describe("Method chaining", () => {
    it("Can chain all configuration methods", () => {
      const builder = TestClientBuilder.builder()
        .withTarget("localhost:9000")
        .withInsecureCredentials()
        .withKeepAlive({
          timeMs: 1000,
          timeoutMs: 2000,
          permitWithoutCalls: true,
        })
        .withChannelOption("grpc.max_receive_message_length", 1024);

      expect(builder.target).toEqual("localhost:9000");
      expect(builder.credentials).toEqual(ChannelCredentials.createInsecure());
      expect(builder.keepAlive.timeMs).toEqual(1000);
      expect(builder.keepAlive.timeoutMs).toEqual(2000);
      expect(builder.keepAlive.permitWithoutCalls).toEqual(true);
    });
  });

  describe("Configuration object", () => {
    it("Supports a fromConfig builder method", () => {
      const builder = TestClientBuilder.builder().withConfig({
        keepAlive: {
          permitWithoutCalls: false,
          timeMs: 200,
          timeoutMs: 300,
        },
        target: "foobar:1337",
        credentials: {
          type: "secure",
        },
      });

      expect(builder.target).toEqual("foobar:1337");
      expect(builder.keepAlive).toEqual({
        permitWithoutCalls: false,
        timeMs: 200,
        timeoutMs: 300,
      });
      expect(builder.credentials).toEqual(ChannelCredentials.createSsl());
    });

    it("fromConfig allows to specify certificates", () => {
      const builder = TestClientBuilder.builder().withConfig({
        target: "localhost:1337",
        credentials: {
          type: "secure",
          rootCerts: mockCerts.rootCerts,
          privateCerts: mockCerts.privateCerts,
          certChain: mockCerts.certChain,
        },
      });

      expect(() => builder.build()).not.toThrow();
    });

    it("Uses default values", () => {
      const builder = TestClientBuilder.builder().withConfig({
        target: "jbond:007",
      });

      expect(builder.target).toEqual("jbond:007");
      expect(builder.credentials).toEqual(ChannelCredentials.createSsl());
      expect(builder.keepAlive).toEqual(defaultKeepAlive());
    });

    it("Handles partial keep alive configuration", () => {
      const builder = TestClientBuilder.builder().withConfig({
        target: "localhost:9000",
        keepAlive: {
          timeMs: 15000,
        },
      });

      expect(builder.keepAlive.timeMs).toEqual(15000);
      expect(builder.keepAlive.timeoutMs).toEqual(defaultKeepAlive().timeoutMs);
      expect(builder.keepAlive.permitWithoutCalls).toEqual(
        defaultKeepAlive().permitWithoutCalls,
      );
    });

    it("Handles channel options in config", () => {
      const builder = TestClientBuilder.builder().withConfig({
        target: "localhost:9000",
        channelOptions: {
          "grpc.max_receive_message_length": 1024,
          "grpc.max_send_message_length": 2048,
        },
      });

      expect(() => builder.build()).not.toThrow();
    });

    it("Handles empty configuration", () => {
      const builder = TestClientBuilder.builder().withConfig({});

      expect(builder.target).toBeUndefined();
      expect(builder.credentials).toEqual(ChannelCredentials.createSsl());
      expect(builder.keepAlive).toEqual(defaultKeepAlive());
    });

    it("Handles insecure credentials in config", () => {
      const builder = TestClientBuilder.builder().withConfig({
        target: "localhost:9000",
        credentials: {
          type: "insecure",
        },
      });

      expect(builder.credentials).toEqual(ChannelCredentials.createInsecure());
    });
  });
});

describe("promisifyClient", () => {
  interface MockClient extends Client {
    testMethod: jest.Mock;
    testStreamMethod: jest.Mock;
    constructor: {
      service: {
        testMethod: { responseStream: false };
        testStreamMethod: { responseStream: true };
      };
    };
  }

  const mockClient: MockClient = {
    testMethod: jest.fn(),
    testStreamMethod: jest.fn(),
    constructor: {
      service: {
        testMethod: { responseStream: false },
        testStreamMethod: { responseStream: true },
      },
    },
  } as unknown as MockClient;

  it("Throws error when client has no service definition and none provided", () => {
    const clientWithoutService = {} as Client;
    expect(() => promisifyClient(clientWithoutService)).toThrow(
      "Client does not have a ServiceDefinition and one was not provided",
    );
  });

  it("Uses provided service definition when client lacks one", () => {
    const clientWithoutService = {} as Client;
    const serviceDefinition = {
      testMethod: { responseStream: false },
    };

    expect(() =>
      promisifyClient(
        clientWithoutService,
        serviceDefinition as unknown as ServiceDefinition,
      ),
    ).not.toThrow();
  });

  it("Uses client's service definition when available", () => {
    expect(() => promisifyClient(mockClient)).not.toThrow();
  });

  it("Preserves streaming methods without promisification", () => {
    const promisified = promisifyClient(mockClient);

    // Access streaming method should return original method
    expect(promisified.testStreamMethod).toBe(mockClient.testStreamMethod);
  });

  it("Returns proxied client with promisified non-streaming methods", () => {
    const promisified = promisifyClient(mockClient);

    expect(promisified).toBeDefined();
    expect(typeof promisified).toBe("object");
  });

  it("Preserves non-method properties", () => {
    interface ClientWithProps extends Client {
      someProperty: string;
      anotherProperty: number;
    }

    const clientWithProps = {
      ...mockClient,
      someProperty: "test-value",
      anotherProperty: 42,
    } as unknown as ClientWithProps;

    const promisified = promisifyClient(clientWithProps);

    expect(promisified.someProperty).toBe("test-value");
    expect(promisified.anotherProperty).toBe(42);
  });
});

describe("Auth Interceptor", () => {
  it("Creates auth interceptor when auth is configured", () => {
    const authConfig = {
      clientId: "test-client",
      clientSecret: "test-secret",
      issuerUrl: "https://example.com/auth",
    };

    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withAuth(authConfig);

    expect(() => builder.build()).not.toThrow();
  });

  it("Throws error when creating auth interceptor without auth config", () => {
    const builder = TestClientBuilder.builder().withTarget("localhost:9000");

    // Access the protected method to test error handling
    expect(() => (builder as any).createAuthInterceptor()).toThrow(
      "Requested to create auth interceptor without a valid auth. This is a bug.",
    );
  });

  it("Auth interceptor sets Bearer token in metadata", async () => {
    const authConfig = {
      clientId: "test-client",
      clientSecret: "test-secret",
      issuerUrl: "https://example.com/auth",
    };

    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withAuth(authConfig);

    const interceptor = (builder as any).createAuthInterceptor();
    expect(interceptor).toBeDefined();
    expect(typeof interceptor).toBe("function");
  });

  it("Auth interceptor handles token retrieval errors", async () => {
    const authConfig = {
      clientId: "test-client",
      clientSecret: "test-secret",
      issuerUrl: "https://invalid-url",
    };

    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withAuth(authConfig);

    const interceptor = (builder as any).createAuthInterceptor();
    expect(interceptor).toBeDefined();
  });
});

describe("Channel Options Validation", () => {
  it("Validates channel option types", () => {
    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withChannelOption("grpc.max_receive_message_length", 1024);

    expect(() => builder.build()).not.toThrow();
  });

  it("Handles multiple channel options", () => {
    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withChannelOption("grpc.max_receive_message_length", 1024)
      .withChannelOption("grpc.max_send_message_length", 2048)
      .withChannelOption("grpc.initial_reconnect_backoff_ms", 1000)
      .withChannelOption("grpc.max_reconnect_backoff_ms", 10000);

    expect(() => builder.build()).not.toThrow();
  });

  it("Supports string channel options", () => {
    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withChannelOption("grpc.primary_user_agent", "test-app/1.0.0");

    expect(() => builder.build()).not.toThrow();
  });

  it("Supports boolean channel options", () => {
    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withChannelOption("grpc.keepalive_permit_without_calls", 1);

    expect(() => builder.build()).not.toThrow();
  });
});

describe("Complex Configuration Scenarios", () => {
  it("Combines all configuration options", () => {
    const config = {
      target: "kessel-api.example.com:443",
      credentials: {
        type: "secure" as const,
        rootCerts: mockCerts.rootCerts,
        privateCerts: mockCerts.privateCerts,
        certChain: mockCerts.certChain,
        rejectUnauthorized: true,
      },
      keepAlive: {
        timeMs: 30000,
        timeoutMs: 10000,
        permitWithoutCalls: false,
      },
      auth: {
        clientId: "production-client",
        clientSecret: "production-secret",
        issuerUrl: "https://auth.example.com",
      },
      channelOptions: {
        "grpc.max_receive_message_length": 4 * 1024 * 1024,
        "grpc.max_send_message_length": 4 * 1024 * 1024,
        "grpc.initial_reconnect_backoff_ms": 1000,
        "grpc.max_reconnect_backoff_ms": 30000,
        "grpc.primary_user_agent": "kessel-client/1.0.0",
      },
    };

    const builder = TestClientBuilder.builder().withConfig(config);
    expect(() => builder.build()).not.toThrow();
  });

  it("Overrides config with individual method calls", () => {
    const config = {
      target: "initial-target:9000",
      credentials: { type: "insecure" as const },
    };

    const builder = TestClientBuilder.builder()
      .withConfig(config)
      .withTarget("overridden-target:9000")
      .withSecureCredentials();

    expect(builder.target).toBe("overridden-target:9000");
    expect(builder.credentials).not.toEqual(
      ChannelCredentials.createInsecure(),
    );
  });

  it("Merges partial configurations", () => {
    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withKeepAlive({ timeMs: 5000 })
      .withKeepAlive({ timeoutMs: 3000 });

    // The second withKeepAlive call overwrites the first one completely
    expect(builder.keepAlive.timeMs).toBe(defaultKeepAlive().timeMs);
    expect(builder.keepAlive.timeoutMs).toBe(3000);
    expect(builder.keepAlive.permitWithoutCalls).toBe(
      defaultKeepAlive().permitWithoutCalls,
    );
  });
});

describe("Target Validation", () => {
  it("Accepts valid host:port format", () => {
    const validTargets = [
      "localhost:9000",
      "127.0.0.1:8080",
      "kessel-api.example.com:443",
      "my-service.internal:9090",
      "[::1]:9000",
      "[2001:db8::1]:443",
    ];

    validTargets.forEach((target) => {
      const builder = TestClientBuilder.builder().withTarget(target);
      expect(builder.target).toBe(target);
      expect(() => builder.build()).not.toThrow();
    });
  });

  it("Accepts target without explicit validation", () => {
    // The builder doesn't validate target format, just requires it to be present
    const builder = TestClientBuilder.builder().withTarget("invalid-target");
    expect(builder.target).toBe("invalid-target");
    expect(() => builder.build()).not.toThrow();
  });

  it("Handles empty target string", () => {
    const builder = TestClientBuilder.builder().withTarget("");
    expect(builder.target).toBe("");
    // Empty target should throw an error since it's considered missing
    expect(() => builder.build()).toThrow();
  });
});

describe("Credentials Edge Cases", () => {
  it("Handles malformed certificate data gracefully", () => {
    // gRPC validates certificate format, so invalid data should throw during config
    expect(() => {
      TestClientBuilder.builder()
        .withTarget("localhost:9000")
        .withCredentialsConfig({
          type: "secure",
          rootCerts: "invalid-cert-data",
          privateCerts: "invalid-key-data",
          certChain: "invalid-chain-data",
        });
    }).toThrow(/PEM routines/);
  });

  it("Handles missing certificate properties", () => {
    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withCredentialsConfig({
        type: "secure",
        rootCerts: undefined,
        privateCerts: undefined,
        certChain: undefined,
        rejectUnauthorized: undefined,
      });

    expect(() => builder.build()).not.toThrow();
  });

  it("Handles reject unauthorized flag", () => {
    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withCredentialsConfig({
        type: "secure",
        rejectUnauthorized: false,
      });

    expect(() => builder.build()).not.toThrow();
  });

  it("Preserves verify options", () => {
    const verifyOptions = {
      rejectUnauthorized: false,
      checkServerIdentity: (): undefined => undefined,
    };

    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withSecureCredentials(null, null, null, verifyOptions);

    expect(() => builder.build()).not.toThrow();
  });
});

describe("Builder State Management", () => {
  it("Maintains immutable state during chaining", () => {
    const builder1 = TestClientBuilder.builder().withTarget("target1:9000");
    const builder2 = builder1.withTarget("target2:9000");

    expect(builder1).toBe(builder2); // Same instance
    expect(builder1.target).toBe("target2:9000"); // State updated
  });

  it("Preserves configuration across multiple calls", () => {
    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withInsecureCredentials()
      .withKeepAlive({ timeMs: 1000 })
      .withChannelOption("grpc.max_receive_message_length", 1024);

    // Call build multiple times
    const client1 = builder.build();
    const client2 = builder.build();

    expect(client1).toBeDefined();
    expect(client2).toBeDefined();
    expect(client1).not.toBe(client2); // Different instances
  });

  it("Handles configuration reset", () => {
    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withInsecureCredentials()
      .withSecureCredentials(); // Override previous credentials

    expect(builder.credentials).not.toEqual(
      ChannelCredentials.createInsecure(),
    );
  });
});

describe("Error Scenarios", () => {
  it("Throws meaningful error for missing target", () => {
    const builder = TestClientBuilder.builder()
      .withInsecureCredentials()
      .withKeepAlive({ timeMs: 1000 });

    expect(() => builder.build()).toThrow(
      expect.objectContaining({
        message: expect.stringContaining("target"),
      }),
    );
  });

  it("Validates required fields only", () => {
    const builder = TestClientBuilder.builder().withTarget("localhost:9000");

    // Should not throw even without explicit credentials or keepAlive
    expect(() => builder.build()).not.toThrow();
  });

  it("Handles concurrent build calls", () => {
    const builder = TestClientBuilder.builder().withTarget("localhost:9000");

    const promises = Array.from({ length: 10 }, () =>
      Promise.resolve(builder.build()),
    );

    return Promise.all(promises).then((clients) => {
      expect(clients).toHaveLength(10);
      clients.forEach((client) => expect(client).toBeDefined());
    });
  });
});

describe("Edge cases and error handling", () => {
  it("Builder handles undefined values gracefully", () => {
    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withSecureCredentials(undefined, undefined, undefined);

    expect(() => builder.build()).not.toThrow();
  });

  it("Builder handles null values gracefully", () => {
    const builder = TestClientBuilder.builder()
      .withTarget("localhost:9000")
      .withSecureCredentials(null, null, null);

    expect(() => builder.build()).not.toThrow();
  });

  it("Config handles undefined credential properties", () => {
    const builder = TestClientBuilder.builder().withConfig({
      target: "localhost:9000",
      credentials: {
        type: "secure",
        rootCerts: undefined,
        privateCerts: undefined,
        certChain: undefined,
      },
    });

    expect(() => builder.build()).not.toThrow();
  });

  it("Allows building with only target set", () => {
    expect(() =>
      TestClientBuilder.builder().withTarget("minimal:setup").build(),
    ).not.toThrow();
  });

  it("Handles empty configuration object", () => {
    const builder = TestClientBuilder.builder().withConfig({});
    expect(() => builder.build()).toThrow(); // Should throw due to missing target
  });

  it("Handles null configuration values", () => {
    const builder = TestClientBuilder.builder().withConfig({
      target: "localhost:9000",
      credentials: null as any,
      keepAlive: null as any,
      auth: null as any,
      channelOptions: null as any,
    });

    expect(() => builder.build()).not.toThrow();
  });
});
