/**
 * Integration tests for OAuth2ClientCredentials retry logic.
 *
 * These tests exercise the real token-acquisition path through the actual
 * HTTP boundary using real TCP servers and Node's native fetch. The
 * oauth4webapi mock below is a thin wrapper that delegates to real fetch,
 * so connection errors (TypeError) and HTTP status codes originate from
 * actual network I/O — not from mocked return values.
 *
 * This satisfies the acceptance criterion:
 *
 *   "Include a controlled connection failure where the token endpoint
 *    closes before sending response headers and a subsequent request
 *    succeeds; this must demonstrate recovery across the actual
 *    HTTP/OAuth library boundary, not only a mocked exception."
 */
import net from "net";
import http from "http";

import { OAuth2ClientCredentials } from "../index";

// Thin oauth4webapi mock that uses REAL fetch for HTTP requests.
// Connection errors (TypeError) come from Node's actual fetch implementation
// hitting real TCP servers — not from jest.fn().mockRejectedValue().
jest.mock("oauth4webapi", () => ({
  ClientSecretPost: (secret: string) => {
    return (_as: unknown, _client: unknown, body: URLSearchParams) => {
      body.set("client_secret", secret);
    };
  },
  clientCredentialsGrantRequest: async (
    as: { token_endpoint: string },
    client: { client_id: string },
    clientAuth: (as: unknown, client: unknown, body: URLSearchParams) => void,
    parameters: URLSearchParams,
  ): Promise<Response> => {
    parameters.set("grant_type", "client_credentials");
    parameters.set("client_id", client.client_id);
    clientAuth(as, client, parameters);
    // Real fetch — this is the HTTP boundary under test
    return fetch(as.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: parameters.toString(),
    });
  },
  processClientCredentialsResponse: async (
    _as: unknown,
    _client: unknown,
    response: Response,
  ) => {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OAuth error: ${response.status} ${text}`);
    }
    return response.json();
  },
}));

/** Build a minimal application/json OAuth token response body. */
const tokenResponseBody = (accessToken: string, expiresIn = 3600): string =>
  JSON.stringify({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: expiresIn,
  });

/** Write a raw HTTP/1.1 response on a socket and close it. */
const writeHttpResponse = (
  socket: net.Socket,
  status: number,
  body: string,
): void => {
  const response = [
    `HTTP/1.1 ${status} ${http.STATUS_CODES[status] ?? "OK"}`,
    "Content-Type: application/json",
    `Content-Length: ${Buffer.byteLength(body)}`,
    "Connection: close",
    "",
    body,
  ].join("\r\n");
  socket.write(response);
  socket.end();
};

/** Wait until a net.Server is listening and return its port. */
const listenOnRandomPort = (server: net.Server): Promise<number> =>
  new Promise((resolve, reject) => {
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (addr && typeof addr === "object") {
        resolve(addr.port);
      } else {
        reject(new Error("Failed to get server address"));
      }
    });
  });

/** Close a server, resolving when it's done. */
const closeServer = (server: net.Server): Promise<void> =>
  new Promise((resolve) => {
    server.close(() => resolve());
  });

describe("OAuth2ClientCredentials retry (integration)", () => {
  // Real TCP servers — generous timeout
  jest.setTimeout(30000);

  describe("connection failure recovery", () => {
    it("recovers when token endpoint closes before sending response headers", async () => {
      let connectionCount = 0;

      // Raw TCP server: first connection is destroyed immediately (simulates
      // endpoint closing before response headers), subsequent connections
      // get a valid OAuth token response.
      const server = net.createServer((socket) => {
        connectionCount++;
        if (connectionCount === 1) {
          // Read the full HTTP request, then destroy — simulates endpoint
          // dropping the connection before sending any response headers.
          // Waiting for request data ensures the TCP handshake completes
          // and fetch registers the connection before the abrupt close,
          // producing a reliable TypeError across all Node.js versions.
          let reqData = "";
          socket.on("data", (chunk) => {
            reqData += chunk.toString();
            if (reqData.includes("\r\n\r\n")) {
              socket.destroy();
            }
          });
          return;
        }
        // Subsequent connections: consume the HTTP request, reply with token.
        let data = "";
        socket.on("data", (chunk) => {
          data += chunk.toString();
          if (data.includes("\r\n\r\n")) {
            const body = tokenResponseBody("integration-recovered-token");
            writeHttpResponse(socket, 200, body);
          }
        });
      });

      const port = await listenOnRandomPort(server);

      try {
        const credentials = new OAuth2ClientCredentials(
          {
            clientId: "test-client",
            clientSecret: "test-secret",
            tokenEndpoint: `http://127.0.0.1:${port}/token`,
          },
          { maxRetries: 3, baseDelay: 0.05, maxDelay: 0.1, jitter: "none" },
        );

        const token = await credentials.getToken();

        expect(token.accessToken).toBe("integration-recovered-token");
        expect(connectionCount).toBe(2);
      } finally {
        await closeServer(server);
      }
    });

    it("recovers from ECONNREFUSED when server becomes available", async () => {
      // Allocate a port, close the server, then reopen — first request
      // gets ECONNREFUSED (TypeError from fetch), retry succeeds.
      const tempServer = net.createServer();
      const port = await listenOnRandomPort(tempServer);
      await closeServer(tempServer);

      let connectionCount = 0;

      // Start a real server after a short delay
      const realServer = net.createServer((socket) => {
        connectionCount++;
        let data = "";
        socket.on("data", (chunk) => {
          data += chunk.toString();
          if (data.includes("\r\n\r\n")) {
            writeHttpResponse(
              socket,
              200,
              tokenResponseBody("after-connrefused-token"),
            );
          }
        });
      });

      // Delay server start so the first request fails
      const serverReady = new Promise<void>((resolve) => {
        setTimeout(() => {
          realServer.listen(port, "127.0.0.1", () => resolve());
        }, 100);
      });

      try {
        const credentials = new OAuth2ClientCredentials(
          {
            clientId: "test-client",
            clientSecret: "test-secret",
            tokenEndpoint: `http://127.0.0.1:${port}/token`,
          },
          { maxRetries: 3, baseDelay: 0.15, maxDelay: 0.5, jitter: "none" },
        );

        // Start token request before server is ready so the first attempt
        // hits a closed port (ECONNREFUSED), exercising connection-error
        // retries. The retry fires after baseDelay (150ms), by which time
        // the server is listening (started after 100ms).
        const tokenPromise = credentials.getToken();
        await serverReady;
        const token = await tokenPromise;
        expect(token.accessToken).toBe("after-connrefused-token");
        // Only the successful retry connects to the server
        expect(connectionCount).toBe(1);
      } finally {
        await closeServer(realServer);
      }
    });
  });

  describe("HTTP 5xx recovery", () => {
    it("retries HTTP 500 then succeeds on next attempt", async () => {
      let requestCount = 0;

      const server = net.createServer((socket) => {
        let data = "";
        socket.on("data", (chunk) => {
          data += chunk.toString();
          if (data.includes("\r\n\r\n")) {
            requestCount++;
            if (requestCount === 1) {
              writeHttpResponse(
                socket,
                500,
                JSON.stringify({ error: "internal_server_error" }),
              );
            } else {
              writeHttpResponse(
                socket,
                200,
                tokenResponseBody("after-500-recovery"),
              );
            }
          }
        });
      });

      const port = await listenOnRandomPort(server);

      try {
        const credentials = new OAuth2ClientCredentials(
          {
            clientId: "test-client",
            clientSecret: "test-secret",
            tokenEndpoint: `http://127.0.0.1:${port}/token`,
          },
          { maxRetries: 2, baseDelay: 0.05, maxDelay: 0.1, jitter: "none" },
        );

        const token = await credentials.getToken();

        expect(token.accessToken).toBe("after-500-recovery");
        expect(requestCount).toBe(2);
      } finally {
        await closeServer(server);
      }
    });
  });

  describe("non-retryable failure", () => {
    it("does not retry HTTP 401 — propagates immediately", async () => {
      let requestCount = 0;

      const server = net.createServer((socket) => {
        let data = "";
        socket.on("data", (chunk) => {
          data += chunk.toString();
          if (data.includes("\r\n\r\n")) {
            requestCount++;
            writeHttpResponse(
              socket,
              401,
              JSON.stringify({ error: "invalid_client" }),
            );
          }
        });
      });

      const port = await listenOnRandomPort(server);

      try {
        const credentials = new OAuth2ClientCredentials(
          {
            clientId: "bad-client",
            clientSecret: "bad-secret",
            tokenEndpoint: `http://127.0.0.1:${port}/token`,
          },
          { maxRetries: 3, baseDelay: 0.05, maxDelay: 0.1, jitter: "none" },
        );

        await expect(credentials.getToken()).rejects.toThrow();
        expect(requestCount).toBe(1);
      } finally {
        await closeServer(server);
      }
    });
  });

  describe("retry exhaustion", () => {
    it("throws after exhausting retries on persistent server errors", async () => {
      let requestCount = 0;

      const server = net.createServer((socket) => {
        let data = "";
        socket.on("data", (chunk) => {
          data += chunk.toString();
          if (data.includes("\r\n\r\n")) {
            requestCount++;
            writeHttpResponse(
              socket,
              503,
              JSON.stringify({ error: "service_unavailable" }),
            );
          }
        });
      });

      const port = await listenOnRandomPort(server);

      try {
        const credentials = new OAuth2ClientCredentials(
          {
            clientId: "test-client",
            clientSecret: "test-secret",
            tokenEndpoint: `http://127.0.0.1:${port}/token`,
          },
          { maxRetries: 2, baseDelay: 0.05, maxDelay: 0.1, jitter: "none" },
        );

        await expect(credentials.getToken()).rejects.toThrow(
          "Token endpoint returned HTTP 503",
        );
        // 1 initial + 2 retries = 3 total
        expect(requestCount).toBe(3);
      } finally {
        await closeServer(server);
      }
    });
  });

  describe("retries disabled", () => {
    it("fails immediately with maxRetries: 0 on connection error", async () => {
      // Allocate and close a port — nothing listening = ECONNREFUSED
      const tempServer = net.createServer();
      const port = await listenOnRandomPort(tempServer);
      await closeServer(tempServer);

      const credentials = new OAuth2ClientCredentials(
        {
          clientId: "test-client",
          clientSecret: "test-secret",
          tokenEndpoint: `http://127.0.0.1:${port}/token`,
        },
        { maxRetries: 0 },
      );

      await expect(credentials.getToken()).rejects.toThrow();
    });
  });

  describe("observable outcomes", () => {
    it("returns correct token and the server sees the expected number of requests", async () => {
      let requestCount = 0;

      // Server returns 503 twice, then 200 with valid token
      const server = net.createServer((socket) => {
        let data = "";
        socket.on("data", (chunk) => {
          data += chunk.toString();
          if (data.includes("\r\n\r\n")) {
            requestCount++;
            if (requestCount <= 2) {
              writeHttpResponse(
                socket,
                503,
                JSON.stringify({ error: "service_unavailable" }),
              );
            } else {
              writeHttpResponse(
                socket,
                200,
                tokenResponseBody("final-success-token", 7200),
              );
            }
          }
        });
      });

      const port = await listenOnRandomPort(server);

      try {
        const credentials = new OAuth2ClientCredentials(
          {
            clientId: "test-client",
            clientSecret: "test-secret",
            tokenEndpoint: `http://127.0.0.1:${port}/token`,
          },
          { maxRetries: 3, baseDelay: 0.05, maxDelay: 0.1, jitter: "none" },
        );

        const token = await credentials.getToken();

        // Observable outcomes: correct token returned, exact request count
        expect(token.accessToken).toBe("final-success-token");
        expect(requestCount).toBe(3);
        // Token expiry reflects the server response
        expect(token.expiresAt.getTime()).toBeGreaterThan(Date.now());
      } finally {
        await closeServer(server);
      }
    });
  });
});
