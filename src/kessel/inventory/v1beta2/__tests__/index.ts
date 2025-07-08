import { ClientBuilder } from "../index";
import { KesselInventoryServiceClient } from "../inventory_service";
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
      issuerUrl: "https://example.com/auth",
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
        issuerUrl: "https://example.com/auth",
      },
    };

    const builder = ClientBuilder.builder().withConfig(config);
    expect(() => builder.build()).not.toThrow();
  });
}); 