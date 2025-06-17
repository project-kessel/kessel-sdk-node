import {
  ClientBuilder,
  defaultCredentials,
  defaultKeepAlive,
  IncompleteKesselConfigurationError,
} from "../index";
import { ChannelCredentials } from "@grpc/grpc-js";

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

    it("Uses default values", () => {
      const builder = ClientBuilder.builderFromConfig({
        target: "jbond:007",
      });

      expect(builder.target).toEqual("jbond:007");
      expect(builder.credentials).toEqual(defaultCredentials());
      expect(builder.keepAlive).toEqual(defaultKeepAlive());
    });
  });
});
