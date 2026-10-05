import {
  Client,
  Metadata,
  Server,
  ServerCredentials,
  credentials,
  type ChannelCredentials,
  type ClientOptions,
} from "@grpc/grpc-js";
import { Allowed } from "../allowed";
import type { CheckRequest } from "../check_request";
import type { CheckResponse } from "../check_response";
import {
  KesselInventoryServiceService,
  type KesselInventoryServiceClient,
  type KesselInventoryServiceServer,
} from "../inventory_service";
import { clientBuilderForStub } from "../../index";
import { ClientBuilder, type KeepaliveOptions } from "../index";

interface ClientConstruction {
  target: string;
  channelCredentials: ChannelCredentials;
  options?: ClientOptions;
}

const clientConstructions: ClientConstruction[] = [];

class RecordingClient extends Client {
  public constructor(
    target: string,
    channelCredentials: ChannelCredentials,
    options?: ClientOptions,
  ) {
    super(target, channelCredentials, options);
    clientConstructions.push({ target, channelCredentials, options });
  }
}

const RecordingClientBuilder = clientBuilderForStub(RecordingClient);

const expectedDefaultOptions = {
  "grpc.keepalive_time_ms": 45_000,
  "grpc.keepalive_timeout_ms": 10_000,
  "grpc.keepalive_permit_without_calls": 1,
};

describe("keepalive channel options", () => {
  beforeEach(() => {
    clientConstructions.length = 0;
  });

  it("passes the defaults to the real client constructor with TLS", () => {
    const client = new RecordingClientBuilder("localhost:9000").build();

    try {
      expect(clientConstructions).toHaveLength(1);
      expect(clientConstructions[0]?.target).toBe("localhost:9000");
      expect(clientConstructions[0]?.channelCredentials._isSecure()).toBe(true);
      expect(clientConstructions[0]?.options).toEqual(expectedDefaultOptions);
    } finally {
      client.close();
    }
  });

  it("keeps keepalive defaults isolated per builder", () => {
    const configuredClient = new RecordingClientBuilder("localhost:9000")
      .keepalive({ interval: 12_000, permitWithoutCalls: false })
      .build();
    const defaultClient = new RecordingClientBuilder("localhost:9001").build();

    try {
      expect(
        clientConstructions.map((construction) => construction.options),
      ).toEqual([
        {
          "grpc.keepalive_time_ms": 12_000,
          "grpc.keepalive_timeout_ms": 10_000,
          "grpc.keepalive_permit_without_calls": 0,
        },
        expectedDefaultOptions,
      ]);
    } finally {
      configuredClient.close();
      defaultClient.close();
    }
  });

  it("applies typed partial updates and preserves explicit false", () => {
    const builder = new RecordingClientBuilder("localhost:9000");

    expect(
      builder.keepalive({
        interval: 12_000,
        timeout: 6_000,
        permitWithoutCalls: false,
      }),
    ).toBe(builder);
    builder
      .keepalive({ timeout: 7_000 })
      .keepalive({ interval: undefined })
      .keepalive();

    const client = builder.insecure().build();

    try {
      expect(clientConstructions[0]?.channelCredentials._isSecure()).toBe(
        false,
      );
      expect(clientConstructions[0]?.options).toEqual({
        "grpc.keepalive_time_ms": 12_000,
        "grpc.keepalive_timeout_ms": 7_000,
        "grpc.keepalive_permit_without_calls": 0,
      });
    } finally {
      client.close();
    }
  });

  it("accepts the inclusive timer duration bounds", () => {
    const builder = new RecordingClientBuilder("localhost:9000");

    expect(() => builder.keepalive({ interval: 1, timeout: 1 })).not.toThrow();
    expect(() =>
      builder.keepalive({
        interval: 2_147_483_647,
        timeout: 2_147_483_647,
      }),
    ).not.toThrow();
  });

  it("rejects invalid runtime values and invalid options objects", () => {
    const builder = new RecordingClientBuilder("localhost:9000");
    const invalidDurations: unknown[] = [
      0,
      -1,
      1.5,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      2_147_483_648,
      "1000",
      null,
    ];

    for (const value of invalidDurations) {
      expect(() =>
        builder.keepalive({ interval: value } as unknown as KeepaliveOptions),
      ).toThrow("Invalid keepalive interval");
      expect(() =>
        builder.keepalive({ timeout: value } as unknown as KeepaliveOptions),
      ).toThrow("Invalid keepalive timeout");
    }

    for (const value of [0, 1, "true", null]) {
      expect(() =>
        builder.keepalive({
          permitWithoutCalls: value,
        } as unknown as KeepaliveOptions),
      ).toThrow("Invalid keepalive permitWithoutCalls");
    }

    const invalidOptions: unknown[] = [null, true, 1, "keepalive", []];
    for (const options of invalidOptions) {
      expect(() =>
        builder.keepalive(options as unknown as KeepaliveOptions),
      ).toThrow("Invalid keepalive options");
    }

    expect(builder.keepalive(undefined)).toBe(builder);
  });

  it("keeps the previous options when a mixed update is invalid", () => {
    const builder = new RecordingClientBuilder("localhost:9000").keepalive({
      interval: 10_000,
      timeout: 9_000,
      permitWithoutCalls: false,
    });

    expect(() =>
      builder.keepalive({
        interval: 20_000,
        timeout: 0,
        permitWithoutCalls: true,
      }),
    ).toThrow("Invalid keepalive timeout");

    const client = builder.build();

    try {
      expect(clientConstructions[0]?.options).toEqual({
        "grpc.keepalive_time_ms": 10_000,
        "grpc.keepalive_timeout_ms": 9_000,
        "grpc.keepalive_permit_without_calls": 0,
      });
    } finally {
      client.close();
    }
  });

  it("preserves authenticated channel construction with keepalive options", () => {
    const callCredentials = credentials.createFromMetadataGenerator(
      (_options, callback) => callback(null, new Metadata()),
    );
    const client = new RecordingClientBuilder("localhost:9000")
      .authenticated(callCredentials)
      .keepalive({ interval: 25_000 })
      .build();

    try {
      expect(clientConstructions[0]?.channelCredentials._isSecure()).toBe(true);
      expect(clientConstructions[0]?.options).toEqual({
        "grpc.keepalive_time_ms": 25_000,
        "grpc.keepalive_timeout_ms": 10_000,
        "grpc.keepalive_permit_without_calls": 1,
      });
    } finally {
      client.close();
    }
  });
});

async function closeServer(server: Server): Promise<void> {
  await new Promise<void>((resolve) => {
    let settled = false;
    const forceTimer = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      server.forceShutdown();
      resolve();
    }, 1_000);

    server.tryShutdown((error) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(forceTimer);
      if (error) {
        server.forceShutdown();
      }
      resolve();
    });
  });
}

function checkWithCallback(
  client: KesselInventoryServiceClient,
  request: CheckRequest,
): Promise<CheckResponse> {
  return new Promise((resolve, reject) => {
    client.check(
      request,
      new Metadata(),
      { deadline: Date.now() + 3_000 },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      },
    );
  });
}

describe("keepalive clients over a local gRPC server", () => {
  it("makes callback and promisified RPCs with the same builder settings", async () => {
    const receivedRequests: CheckRequest[] = [];
    let callCount = 0;
    const server = new Server();
    let serverBound = false;
    const unexpectedHandler = (): never => {
      throw new Error("Unexpected inventory RPC");
    };
    const implementation: KesselInventoryServiceServer = {
      check: (call, callback) => {
        callCount += 1;
        receivedRequests.push(call.request);
        callback(null, { allowed: Allowed.ALLOWED_TRUE });
      },
      checkSelf: unexpectedHandler,
      checkForUpdate: unexpectedHandler,
      checkForUpdateBulk: unexpectedHandler,
      checkBulk: unexpectedHandler,
      checkSelfBulk: unexpectedHandler,
      reportResource: unexpectedHandler,
      deleteResource: unexpectedHandler,
      streamedListObjects: unexpectedHandler,
      streamedListSubjects: unexpectedHandler,
    };

    server.addService(KesselInventoryServiceService, implementation);

    try {
      const port = await new Promise<number>((resolve, reject) => {
        server.bindAsync(
          "127.0.0.1:0",
          ServerCredentials.createInsecure(),
          (error, boundPort) => {
            if (error) {
              reject(error);
            } else {
              resolve(boundPort);
            }
          },
        );
      });
      serverBound = true;

      const request: CheckRequest = {
        object: { resourceType: "workspace", resourceId: "workspace-1" },
        relation: "viewer",
        subject: {
          resource: { resourceType: "principal", resourceId: "alice" },
        },
      };
      const target = `127.0.0.1:${port}`;
      const callbackClient = new ClientBuilder(target)
        .insecure()
        .keepalive({ interval: 45_000 })
        .build();

      try {
        const response = await checkWithCallback(callbackClient, request);
        expect(response.allowed).toBe(Allowed.ALLOWED_TRUE);
      } finally {
        callbackClient.close();
      }

      const promiseClient = new ClientBuilder(target)
        .insecure()
        .keepalive({ interval: 45_000, permitWithoutCalls: false })
        .buildAsync();

      try {
        const response = await promiseClient.check(request, new Metadata(), {
          deadline: Date.now() + 3_000,
        });
        expect(response.allowed).toBe(Allowed.ALLOWED_TRUE);
      } finally {
        promiseClient.close();
      }

      expect(callCount).toBe(2);
      expect(receivedRequests).toHaveLength(2);
      expect(
        receivedRequests.map((received) => ({
          relation: received.relation,
          objectId: received.object?.resourceId,
          subjectId: received.subject?.resource?.resourceId,
        })),
      ).toEqual([
        {
          relation: "viewer",
          objectId: "workspace-1",
          subjectId: "alice",
        },
        {
          relation: "viewer",
          objectId: "workspace-1",
          subjectId: "alice",
        },
      ]);
    } finally {
      if (serverBound) {
        await closeServer(server);
      } else {
        server.forceShutdown();
      }
    }
  }, 10_000);
});
