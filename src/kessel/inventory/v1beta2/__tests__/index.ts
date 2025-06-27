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

    it("fromConfig allows to specify certificates", () => {
      const certs = {
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

      const builder = ClientBuilder.builderFromConfig({
        target: "localhost:1337",
        credentials: {
          type: "secure",
          rootCerts: certs.rootCerts,
          privateCerts: certs.privateCerts,
          certChain: certs.certChain,
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
  });
});
