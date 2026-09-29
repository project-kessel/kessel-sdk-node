/**
 * Boundary tests for OAuth2ClientCredentials retry logic.
 *
 * Unlike retry.ts (which uses a thin oauth4webapi mock with real fetch),
 * these tests exercise the ACTUAL oauth4webapi library against a local
 * HTTP server.  The oauth4webapi `allowInsecureRequests` symbol is
 * injected post-initialisation so that production code never weakens
 * HTTPS enforcement.
 *
 * Each test asserts both the returned token AND the server-observed
 * request count, proving retry recovery across the real OAuth library
 * boundary.
 */
import net from "net";
import http from "http";

import { OAuth2ClientCredentials } from "../index";

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

/**
 * Inject `[oauth.allowInsecureRequests]: true` into the grant-request
 * options so the real oauth4webapi library accepts `http://` endpoints.
 * This is the library's designed-for-testing transport allowance and
 * does not weaken production HTTPS enforcement.
 *
 * An optional `timeoutMs` overrides the production 30-second per-attempt
 * timeout — a test-only seam that avoids a 30-second wall-clock wait in
 * timeout recovery tests without adding a public timeout option.
 *
 * Uses dynamic `import()` because oauth4webapi is ESM-only and
 * Jest runs under CommonJS.
 */
const injectInsecureTransport = async (
  credentials: OAuth2ClientCredentials,
  timeoutMs?: number,
): Promise<void> => {
  const oauth = await import("oauth4webapi");
  await credentials.ensureIsInitialized();
  const original = (credentials as any).clientCredentialsGrantRequest;
  (credentials as any).clientCredentialsGrantRequest = (
    as: any,
    client: any,
    clientAuth: any,
    parameters: any,
    options: any,
  ) => {
    const opts: Record<string | symbol, unknown> = {
      ...options,
      [oauth.allowInsecureRequests]: true,
    };
    if (timeoutMs !== undefined) {
      opts.signal = AbortSignal.timeout(timeoutMs);
    }
    return original(as, client, clientAuth, parameters, opts);
  };
};

describe("OAuth2ClientCredentials retry boundary (real oauth4webapi)", () => {
  jest.setTimeout(30000);

  it("recovers when endpoint closes before sending response headers", async () => {
    let requestCount = 0;

    const server = net.createServer((socket) => {
      requestCount++;
      if (requestCount === 1) {
        // Read the full HTTP request, then destroy — simulates endpoint
        // dropping the connection before sending any response headers.
        let reqData = "";
        socket.on("data", (chunk) => {
          reqData += chunk.toString();
          if (reqData.includes("\r\n\r\n")) {
            socket.destroy();
          }
        });
        return;
      }
      let data = "";
      socket.on("data", (chunk) => {
        data += chunk.toString();
        if (data.includes("\r\n\r\n")) {
          const body = tokenResponseBody("boundary-recovered-token");
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
      await injectInsecureTransport(credentials);

      const token = await credentials.getToken();

      // Observable outcomes: correct token + exact request count
      expect(token.accessToken).toBe("boundary-recovered-token");
      expect(requestCount).toBe(2);
    } finally {
      await closeServer(server);
    }
  });

  it("recovers from mid-body socket reset via wrapped transport cause", async () => {
    let requestCount = 0;

    const server = net.createServer((socket) => {
      let data = "";
      socket.on("data", (chunk) => {
        data += chunk.toString();
        if (data.includes("\r\n\r\n")) {
          requestCount++;
          if (requestCount === 1) {
            // Send response headers and partial body, then destroy socket.
            // This causes a mid-body transport failure that oauth4webapi
            // wraps as OperationProcessingError with a nested TypeError cause.
            const body = tokenResponseBody("partial-token");
            const headers = [
              "HTTP/1.1 200 OK",
              "Content-Type: application/json",
              `Content-Length: ${Buffer.byteLength(body)}`,
              "Connection: close",
              "",
            ].join("\r\n");
            socket.write(headers + "\r\n");
            socket.write(body.slice(0, 5));
            setTimeout(() => socket.destroy(), 10);
            return;
          }
          writeHttpResponse(
            socket,
            200,
            tokenResponseBody("mid-body-recovered"),
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
        { maxRetries: 3, baseDelay: 0.05, maxDelay: 0.1, jitter: "none" },
      );
      await injectInsecureTransport(credentials);

      const token = await credentials.getToken();

      expect(token.accessToken).toBe("mid-body-recovered");
      expect(requestCount).toBe(2);
    } finally {
      await closeServer(server);
    }
  });

  it("recovers from per-attempt timeout followed by success", async () => {
    let requestCount = 0;

    const server = net.createServer((socket) => {
      let data = "";
      socket.on("data", (chunk) => {
        data += chunk.toString();
        if (data.includes("\r\n\r\n")) {
          requestCount++;
          if (requestCount === 1) {
            // Don't respond — let the 200ms test timeout fire.
            // Clean up the socket after a delay to prevent resource leak.
            setTimeout(() => socket.destroy(), 1000);
            return;
          }
          writeHttpResponse(
            socket,
            200,
            tokenResponseBody("after-timeout-token"),
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
        { maxRetries: 3, baseDelay: 0.05, maxDelay: 0.1, jitter: "none" },
      );
      // 200ms test-only timeout seam — avoids 30s wall-clock wait
      await injectInsecureTransport(credentials, 200);

      const token = await credentials.getToken();

      expect(token.accessToken).toBe("after-timeout-token");
      expect(requestCount).toBe(2);
    } finally {
      await closeServer(server);
    }
  });

  it("does not retry malformed JSON body — propagates immediately", async () => {
    let requestCount = 0;

    const server = net.createServer((socket) => {
      let data = "";
      socket.on("data", (chunk) => {
        data += chunk.toString();
        if (data.includes("\r\n\r\n")) {
          requestCount++;
          // Respond with invalid JSON — permanent error, not transient
          const body = "<html>Not JSON</html>";
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
      await injectInsecureTransport(credentials);

      await expect(credentials.getToken()).rejects.toThrow();
      // Single attempt — malformed JSON is not retryable
      expect(requestCount).toBe(1);
    } finally {
      await closeServer(server);
    }
  });

  it("forced-refresh cohort all reject when refresh returns 401 with valid cache", async () => {
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
              200,
              tokenResponseBody("initial-token", 3600),
            );
          } else {
            writeHttpResponse(
              socket,
              401,
              JSON.stringify({ error: "invalid_client" }),
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
        { maxRetries: 0, baseDelay: 0.05, maxDelay: 0.1, jitter: "none" },
      );
      await injectInsecureTransport(credentials);

      // Build cache with valid token
      const first = await credentials.getToken();
      expect(first.accessToken).toBe("initial-token");
      expect(requestCount).toBe(1);

      // Concurrent forced-refresh calls — all must reject, none should
      // fall back to the old cached token
      const promises = Array.from({ length: 5 }, () =>
        credentials.getToken(true),
      );
      const results = await Promise.allSettled(promises);

      const rejected = results.filter((r) => r.status === "rejected");
      expect(rejected).toHaveLength(5);
      // Coalesced: 1 initial success + 1 failed refresh = 2 total
      expect(requestCount).toBe(2);
    } finally {
      await closeServer(server);
    }
  });

  it("later caller recovers after forced-refresh cohort failure", async () => {
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
              200,
              tokenResponseBody("initial-token", 3600),
            );
          } else if (requestCount === 2) {
            writeHttpResponse(
              socket,
              401,
              JSON.stringify({ error: "invalid_client" }),
            );
          } else {
            writeHttpResponse(
              socket,
              200,
              tokenResponseBody("recovered-token", 3600),
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
        { maxRetries: 0 },
      );
      await injectInsecureTransport(credentials);

      // Build cache
      await credentials.getToken();
      expect(requestCount).toBe(1);

      // Forced refresh fails (401)
      await expect(credentials.getToken(true)).rejects.toThrow();
      expect(requestCount).toBe(2);

      // Later caller: new generation, server now returns 200
      const recovered = await credentials.getToken(true);
      expect(recovered.accessToken).toBe("recovered-token");
      expect(requestCount).toBe(3);
    } finally {
      await closeServer(server);
    }
  });

  it("returns correct token via the real library path on first success", async () => {
    let requestCount = 0;

    const server = net.createServer((socket) => {
      let data = "";
      socket.on("data", (chunk) => {
        data += chunk.toString();
        if (data.includes("\r\n\r\n")) {
          requestCount++;
          writeHttpResponse(
            socket,
            200,
            tokenResponseBody("real-lib-token", 7200),
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
        { maxRetries: 3, baseDelay: 0.05, maxDelay: 0.1, jitter: "none" },
      );
      await injectInsecureTransport(credentials);

      const token = await credentials.getToken();

      expect(token.accessToken).toBe("real-lib-token");
      expect(token.expiresAt.getTime()).toBeGreaterThan(Date.now());
      expect(requestCount).toBe(1);
    } finally {
      await closeServer(server);
    }
  });
});
