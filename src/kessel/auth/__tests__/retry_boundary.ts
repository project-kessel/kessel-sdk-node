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
 * Uses dynamic `import()` because oauth4webapi is ESM-only and
 * Jest runs under CommonJS.
 */
const injectInsecureTransport = async (
  credentials: OAuth2ClientCredentials,
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
    return original(as, client, clientAuth, parameters, {
      ...options,
      [oauth.allowInsecureRequests]: true,
    });
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
