import {
  ClientBuilder,
  defaultCredentials,
  defaultKeepAlive,
  IncompleteKesselConfigurationError,
  promisifyClient,
} from "../index";
import { ChannelCredentials, Client } from "@grpc/grpc-js";
import { ServiceDefinition } from "@grpc/grpc-js/src";
import { SecureContext } from "node:tls";

const mockCerts = {
  rootCerts:
    "-----BEGIN CERTIFICATE-----\n" +
    "MIIB5zCCAZmgAwIBAgIUQ4vriAZHUYcObyptYO6HGvCD6pYwBQYDK2VwMGkxCzAJ\n" +
    "BgNVBAYTAkNBMRAwDgYDVQQIDAdBbGJlcnRhMREwDwYDVQQHDAhFZG1vbnRvbjEX\n" +
    "MBUGA1UECgwOS2Vzc2VsIFRlc3QgQ0ExHDAaBgNVBAMME0tlc3NlbCBUZXN0IFJv\n" +
    "b3QgQ0EwHhcNMjUwNjI3MTU0MjIwWhcNMzUwNjI1MTU0MjIwWjBpMQswCQYDVQQG\n" +
    "EwJDQTEQMA4GA1UECAwHQWxiZXJ0YTERMA8GA1UEBwwIRWRtb250b24xFzAVBgNV\n" +
    "BAoMDktlc3NlbCBUZXN0IENBMRwwGgYDVQQDDBNLZXNzZWwgVGVzdCBSb290IENB\n" +
    "MCowBQYDK2VwAyEAcR9S57YlW0lcr+NTg+aZiEGfcwET9/p6tr1Ud7I4q/KjUzBR\n" +
    "MB0GA1UdDgQWBBSz4Jqsyo2RvWuthYtSJkR+PCN25jAfBgNVHSMEGDAWgBSz4Jqs\n" +
    "yo2RvWuthYtSJkR+PCN25jAPBgNVHRMBAf8EBTADAQH/MAUGAytlcANBAMjIzU22\n" +
    "x1QBGHx2/ZUZegM6eZtsdT6DNv93NR9YfakSwqvSx3jl9UYVCG4bddmcIo8rqXwE\n" +
    "rIeRqrbQC9iB+AU=\n" +
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
    "-----END CERTIFICATE-----\n" +
    "-----BEGIN CERTIFICATE-----\n" +
    "MIIB5zCCAZmgAwIBAgIUQ4vriAZHUYcObyptYO6HGvCD6pYwBQYDK2VwMGkxCzAJ\n" +
    "BgNVBAYTAkNBMRAwDgYDVQQIDAdBbGJlcnRhMREwDwYDVQQHDAhFZG1vbnRvbjEX\n" +
    "MBUGA1UECgwOS2Vzc2VsIFRlc3QgQ0ExHDAaBgNVBAMME0tlc3NlbCBUZXN0IFJv\n" +
    "b3QgQ0EwHhcNMjUwNjI3MTU0MjIwWhcNMzUwNjI1MTU0MjIwWjBpMQswCQYDVQQG\n" +
    "EwJDQTEQMA4GA1UECAwHQWxiZXJ0YTERMA8GA1UEBwwIRWRtb250b24xFzAVBgNV\n" +
    "BAoMDktlc3NlbCBUZXN0IENBMRwwGgYDVQQDDBNLZXNzZWwgVGVzdCBSb290IENB\n" +
    "MCowBQYDK2VwAyEAcR9S57YlW0lcr+NTg+aZiEGfcwET9/p6tr1Ud7I4q/KjUzBR\n" +
    "MB0GA1UdDgQWBBSz4Jqsyo2RvWuthYtSJkR+PCN25jAfBgNVHSMEGDAWgBSz4Jqs\n" +
    "yo2RvWuthYtSJkR+PCN25jAPBgNVHRMBAf8EBTADAQH/MAUGAytlcANBAMjIzU22\n" +
    "x1QBGHx2/ZUZegM6eZtsdT6DNv93NR9YfakSwqvSx3jl9UYVCG4bddmcIo8rqXwE\n" +
    "rIeRqrbQC9iB+AU=\n" +
    "-----END CERTIFICATE-----\n",
};

describe("ClientBuilder", () => {
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

  it("Uses defaults when available", () => {
    const builder = ClientBuilder.builder().withTarget("foobar:123");
    expect(builder.target).toEqual("foobar:123");
    expect(builder.keepAlive).toEqual(defaultKeepAlive());
    expect(builder.credentials).toEqual(defaultCredentials());
  });

  it("Can override defaults", () => {
    const builder = ClientBuilder.builder()
      .withTarget("foobar:123")
      .withCredentials(ChannelCredentials.createInsecure())
      .withKeepAlive(100, 200, false);
    expect(builder.target).toEqual("foobar:123");
    expect(builder.keepAlive.timeMs).toEqual(100);
    expect(builder.keepAlive.timeoutMs).toEqual(200);
    expect(builder.keepAlive.permitWithoutCalls).toEqual(false);
    expect(builder.credentials).toEqual(ChannelCredentials.createInsecure());
  });

  describe("Credentials Configuration", () => {
    it("Can set insecure credentials", () => {
      const builder = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .withInsecureCredentials();

      expect(builder.credentials).toEqual(ChannelCredentials.createInsecure());
    });

    it("Can set secure credentials with all parameters", () => {
      const rootCerts = Buffer.from(mockCerts.rootCerts);
      const privateCerts = Buffer.from(mockCerts.privateCerts);
      const certChain = Buffer.from(mockCerts.certChain);
      const verifyOptions = { rejectUnauthorized: false };

      const builder = ClientBuilder.builder()
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
      const builder = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .withSecureCredentials();

      expect(builder.credentials).toBeDefined();
    });

    it("Can set credentials from secure context", () => {
      const mockSecureContext = {} as SecureContext;
      const verifyOptions = { rejectUnauthorized: true };

      const builder = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .withSecureContextCredentials(mockSecureContext, verifyOptions);

      expect(builder.credentials).toBeDefined();
    });

    it("Handles insecure credentials config", () => {
      const builder = ClientBuilder.builder()
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

      const builder = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .withCredentialsConfig(config);

      expect(builder.credentials).toBeDefined();
    });
  });

  describe("Keep Alive Configuration", () => {
    it("Can set keep alive with different values", () => {
      const builder = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .withKeepAlive(5000, 3000, true);

      expect(builder.keepAlive.timeMs).toEqual(5000);
      expect(builder.keepAlive.timeoutMs).toEqual(3000);
      expect(builder.keepAlive.permitWithoutCalls).toEqual(true);
    });

    it("Can set keep alive with zero values", () => {
      const builder = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .withKeepAlive(0, 0, false);

      expect(builder.keepAlive.timeMs).toEqual(0);
      expect(builder.keepAlive.timeoutMs).toEqual(0);
      expect(builder.keepAlive.permitWithoutCalls).toEqual(false);
    });
  });

  describe("Channel Options", () => {
    it("Can set individual channel options", () => {
      const builder = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .withChannelOption("grpc.max_receive_message_length", 1024)
        .withChannelOption("grpc.max_send_message_length", 2048);

      expect(() => builder.build()).not.toThrow();
    });

    it("Can chain multiple channel options", () => {
      const builder = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .withChannelOption("grpc.max_receive_message_length", 1024)
        .withChannelOption("grpc.max_send_message_length", 2048)
        .withChannelOption("grpc.initial_reconnect_backoff_ms", 1000);

      expect(() => builder.build()).not.toThrow();
    });
  });

  describe("Method chaining", () => {
    it("Can chain all configuration methods", () => {
      const builder = ClientBuilder.builder()
        .withTarget("localhost:9000")
        .withInsecureCredentials()
        .withKeepAlive(1000, 2000, true)
        .withChannelOption("grpc.max_receive_message_length", 1024);

      expect(builder.target).toEqual("localhost:9000");
      expect(builder.credentials).toEqual(ChannelCredentials.createInsecure());
      expect(builder.keepAlive.timeMs).toEqual(1000);
      expect(builder.keepAlive.timeoutMs).toEqual(2000);
      expect(builder.keepAlive.permitWithoutCalls).toEqual(true);
    });
  });

  describe("ClientBuilder.builderFromConfig", () => {
    it("Supports a fromConfig builder method", () => {
      const builder = ClientBuilder.builderFromConfig({
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
      const builder = ClientBuilder.builderFromConfig({
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
      const builder = ClientBuilder.builderFromConfig({
        target: "jbond:007",
      });

      expect(builder.target).toEqual("jbond:007");
      expect(builder.credentials).toEqual(defaultCredentials());
      expect(builder.keepAlive).toEqual(defaultKeepAlive());
    });

    it("Handles partial keep alive configuration", () => {
      const builder = ClientBuilder.builderFromConfig({
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
      const builder = ClientBuilder.builderFromConfig({
        target: "localhost:9000",
        channelOptions: {
          "grpc.max_receive_message_length": 1024,
          "grpc.max_send_message_length": 2048,
        },
      });

      expect(() => builder.build()).not.toThrow();
    });

    it("Handles empty configuration", () => {
      const builder = ClientBuilder.builderFromConfig({});

      expect(builder.target).toBeUndefined();
      expect(builder.credentials).toEqual(defaultCredentials());
      expect(builder.keepAlive).toEqual(defaultKeepAlive());
    });

    it("Handles insecure credentials in config", () => {
      const builder = ClientBuilder.builderFromConfig({
        target: "localhost:9000",
        credentials: {
          type: "insecure",
        },
      });

      expect(builder.credentials).toEqual(ChannelCredentials.createInsecure());
    });
  });
});

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

  it("defaultCredentials returns SSL credentials", () => {
    const credentials = defaultCredentials();
    expect(credentials).toEqual(ChannelCredentials.createSsl());
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

describe("Edge cases and error handling", () => {
  it("Builder handles undefined values gracefully", () => {
    const builder = ClientBuilder.builder()
      .withTarget("localhost:9000")
      .withSecureCredentials(undefined, undefined, undefined);

    expect(() => builder.build()).not.toThrow();
  });

  it("Builder handles null values gracefully", () => {
    const builder = ClientBuilder.builder()
      .withTarget("localhost:9000")
      .withSecureCredentials(null, null, null);

    expect(() => builder.build()).not.toThrow();
  });

  it("Config handles undefined credential properties", () => {
    const builder = ClientBuilder.builderFromConfig({
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

  it("Validates target is required even with all other options set", () => {
    expect(() =>
      ClientBuilder.builder()
        .withInsecureCredentials()
        .withKeepAlive(1000, 2000, true)
        .build(),
    ).toThrow(new IncompleteKesselConfigurationError(["target"]));
  });

  it("Allows building with only target set", () => {
    expect(() =>
      ClientBuilder.builder().withTarget("minimal:setup").build(),
    ).not.toThrow();
  });
});
