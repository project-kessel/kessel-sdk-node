import { inspect } from "util";

import {
  OAuth2ClientCredentials,
  DEFAULT_RETRY_OPTIONS,
  fetchOIDCDiscovery,
  oauth2AuthRequest,
} from "../index";
import type { RetryOptions } from "../index";

/** Create a TypeError with a `cause` property (simulates Node.js fetch errors). */
const fetchTypeError = (message: string, cause?: Error): TypeError =>
  Object.assign(new TypeError(message), {
    cause: cause ?? new Error("ECONNREFUSED"),
  });

// Mock oauth4webapi module
const mockOAuth = {
  discoveryRequest: jest.fn(),
  processDiscoveryResponse: jest.fn(),
  ClientSecretPost: jest.fn(),
  clientCredentialsGrantRequest: jest.fn(),
  processClientCredentialsResponse: jest.fn(),
};

// Mock the oauth4webapi module
jest.mock("oauth4webapi", () => mockOAuth);

describe("fetchOIDCDiscovery", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it("successfully discovers token endpoint", async () => {
    const mockResponse = {};
    const mockAuthServer = {
      token_endpoint: "https://example.com/token",
    };

    mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
    mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);

    const result = await fetchOIDCDiscovery("https://example.com/auth");

    expect(result.tokenEndpoint).toBe("https://example.com/token");
    expect(mockOAuth.discoveryRequest).toHaveBeenCalledWith(
      new URL("https://example.com/auth"),
    );
    expect(mockOAuth.processDiscoveryResponse).toHaveBeenCalledWith(
      new URL("https://example.com/auth"),
      mockResponse,
    );
  });

  it("throws error when token endpoint is missing", async () => {
    const mockResponse = {};
    const mockAuthServer = {}; // No token_endpoint

    mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
    mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);

    await expect(
      fetchOIDCDiscovery("https://example.com/auth"),
    ).rejects.toThrow(
      "Token endpoint could not be discovered from issuer URL.",
    );
  });

  it("handles discovery request failures", async () => {
    const networkError = new Error("Network error");
    mockOAuth.discoveryRequest.mockRejectedValue(networkError);

    await expect(
      fetchOIDCDiscovery("https://example.com/auth"),
    ).rejects.toThrow("Network error");
  });

  it("handles malformed discovery response", async () => {
    const malformedResponse: any = null;
    mockOAuth.discoveryRequest.mockResolvedValue(malformedResponse);
    mockOAuth.processDiscoveryResponse.mockRejectedValue(
      new Error("Malformed response"),
    );

    await expect(
      fetchOIDCDiscovery("https://example.com/auth"),
    ).rejects.toThrow("Malformed response");
  });

  it("handles invalid issuer URL", async () => {
    await expect(fetchOIDCDiscovery("not-a-valid-url")).rejects.toThrow();
  });
});

describe("OAuth2ClientCredentials", () => {
  const mockAuth = {
    clientId: "test-client-id",
    clientSecret: "test-client-secret",
    tokenEndpoint: "https://example.com/token",
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe("ensureIsInitialized", () => {
    it("initializes OAuth components correctly", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);
      await tokenRetriever.ensureIsInitialized();

      // Should not call discovery methods since we're using tokenEndpoint directly
      expect(mockOAuth.discoveryRequest).not.toHaveBeenCalled();
      expect(mockOAuth.processDiscoveryResponse).not.toHaveBeenCalled();
    });

    it("only initializes once", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      // Call twice
      await tokenRetriever.ensureIsInitialized();
      await tokenRetriever.ensureIsInitialized();

      // Should not call discovery methods
      expect(mockOAuth.discoveryRequest).not.toHaveBeenCalled();
    });
  });

  describe("isCacheValid", () => {
    it("returns falsy when no cache exists", () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);
      expect(tokenRetriever.isCacheValid()).toBeFalsy();
    });

    it("returns true when cache is still valid", () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      // Set up a mock cache by accessing the private property
      const futureTime = new Date(Date.now() + 600000); // 10 minutes in the future
      (tokenRetriever as any).tokenCache = {
        accessToken: "test-token",
        expiresAt: futureTime,
      };

      expect(tokenRetriever.isCacheValid()).toBe(true);
    });

    it("returns falsy when cache is expired", () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      // Set up a mock cache that's expired
      const pastTime = new Date(Date.now() - 1000); // 1 second ago
      (tokenRetriever as any).tokenCache = {
        accessToken: "test-token",
        expiresAt: pastTime,
      };

      expect(tokenRetriever.isCacheValid()).toBeFalsy();
    });
  });

  describe("getToken", () => {
    it("returns cached token when valid", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      // Set up a valid cached token
      const futureTime = new Date(Date.now() + 600000);
      (tokenRetriever as any).tokenCache = {
        accessToken: "cached-token",
        expiresAt: futureTime,
      };

      const token = (await tokenRetriever.getToken()).accessToken;
      expect(token).toBe("cached-token");

      // Should not call OAuth methods
      expect(mockOAuth.clientCredentialsGrantRequest).not.toHaveBeenCalled();
    });

    it("fetches new token when cache is invalid", async () => {
      const mockTokenResponse = {};
      const mockTokenResult = {
        access_token: "new-token",
        expires_in: 3600,
      };

      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(
        mockTokenResult,
      );

      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      const token = (await tokenRetriever.getToken()).accessToken;
      expect(token).toBe("new-token");

      // Should have called OAuth methods
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalled();
      expect(mockOAuth.processClientCredentialsResponse).toHaveBeenCalled();
    });

    it("caches the new token correctly", async () => {
      const mockTokenResponse = {};
      const mockTokenResult = {
        access_token: "new-token",
        expires_in: 3600,
      };

      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(
        mockTokenResult,
      );

      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      const beforeTime = Date.now();
      await tokenRetriever.getToken();
      const afterTime = Date.now();

      const cache = (tokenRetriever as any).tokenCache;
      expect(cache.accessToken).toBe("new-token");
      expect(cache.expiresAt.getTime()).toBeGreaterThanOrEqual(
        beforeTime + 3600000,
      ); // Should be about 1 hour from now
      expect(cache.expiresAt.getTime()).toBeLessThanOrEqual(
        afterTime + 3600000 + 1000,
      ); // Allow some margin
    });
  });

  describe("constructor", () => {
    it("stores auth configuration", () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);
      expect(tokenRetriever.auth).toBe(mockAuth);
    });

    it("accepts different auth configurations", () => {
      const customAuth = {
        clientId: "custom-client",
        clientSecret: "custom-secret",
        tokenEndpoint: "https://custom.auth.server.com/token",
      };

      const tokenRetriever = new OAuth2ClientCredentials(customAuth);
      expect(tokenRetriever.auth).toBe(customAuth);
      expect(tokenRetriever.auth.clientId).toBe("custom-client");
      expect(tokenRetriever.auth.tokenEndpoint).toBe(
        "https://custom.auth.server.com/token",
      );
    });
  });

  describe("Error Handling", () => {
    it("handles token request failures", async () => {
      const tokenError = new Error("Token request failed");

      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockRejectedValue(tokenError);

      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      await expect(tokenRetriever.getToken()).rejects.toThrow(
        "Token request failed",
      );
    });

    it("handles invalid token response", async () => {
      const mockTokenResponse = {};
      const invalidTokenError = new Error("Invalid token format");

      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockRejectedValue(
        invalidTokenError,
      );

      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      await expect(tokenRetriever.getToken()).rejects.toThrow(
        "Invalid token format",
      );
    });
  });

  describe("Cache Management", () => {
    it("respects expiration window", () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      // Set up a cache that expires just within the expiration window
      const almostExpiredTime = new Date(Date.now() + 200000); // 200 seconds (less than 300 second window)
      (tokenRetriever as any).tokenCache = {
        accessToken: "almost-expired-token",
        expiresAt: almostExpiredTime,
      };

      expect(tokenRetriever.isCacheValid()).toBeFalsy();
    });

    it("handles cache with exact expiration time", () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      // Set up a cache that expires at exactly the expiration window
      const exactExpirationTime = new Date(Date.now() + 300000); // Exactly 300 seconds (5 minutes)
      (tokenRetriever as any).tokenCache = {
        accessToken: "exact-expiration-token",
        expiresAt: exactExpirationTime,
      };

      expect(tokenRetriever.isCacheValid()).toBeFalsy();
    });

    it("handles cache with far future expiration", () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      // Set up a cache that expires far in the future
      const farFutureTime = new Date(Date.now() + 3600000); // 1 hour
      (tokenRetriever as any).tokenCache = {
        accessToken: "far-future-token",
        expiresAt: farFutureTime,
      };

      expect(tokenRetriever.isCacheValid()).toBe(true);
    });

    it("handles cache with past expiration", () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      // Set up a cache that expired in the past
      const pastTime = new Date(Date.now() - 3600000); // 1 hour ago
      (tokenRetriever as any).tokenCache = {
        accessToken: "expired-token",
        expiresAt: pastTime,
      };

      expect(tokenRetriever.isCacheValid()).toBeFalsy();
    });
  });

  describe("Token Lifecycle", () => {
    it("fetches token when not initialized", async () => {
      const mockTokenResponse = {};
      const mockTokenResult = {
        access_token: "fresh-token",
        expires_in: 3600,
      };

      mockOAuth.ClientSecretPost = jest
        .fn()
        .mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(
        mockTokenResult,
      );

      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      // Don't call ensureIsInitialized manually
      const token = (await tokenRetriever.getToken()).accessToken;
      expect(token).toBe("fresh-token");
    });

    it("handles token with zero expiration", async () => {
      const mockTokenResponse = {};
      const mockTokenResult = {
        access_token: "zero-expiry-token",
        expires_in: 0,
      };

      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(
        mockTokenResult,
      );

      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      const token = (await tokenRetriever.getToken()).accessToken;
      expect(token).toBe("zero-expiry-token");

      // Token should be cached but immediately invalid
      expect(tokenRetriever.isCacheValid()).toBeFalsy();
    });

    it("handles token with very long expiration", async () => {
      const mockTokenResponse = {};
      const mockTokenResult = {
        access_token: "long-lived-token",
        expires_in: 86400, // 24 hours
      };

      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(
        mockTokenResult,
      );

      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      const token = (await tokenRetriever.getToken()).accessToken;
      expect(token).toBe("long-lived-token");

      // Token should be cached and valid
      expect(tokenRetriever.isCacheValid()).toBe(true);
    });

    it("handles concurrent token requests", async () => {
      const mockTokenResponse = {};
      const mockTokenResult = {
        access_token: "concurrent-token",
        expires_in: 3600,
      };

      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(
        mockTokenResult,
      );

      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      // Make multiple concurrent requests
      const promises = Array.from({ length: 5 }, () =>
        tokenRetriever.getToken(),
      );
      const tokens = await Promise.all(promises);

      // All should return the same token
      expect(tokens).toHaveLength(5);
      tokens.forEach((token) =>
        expect(token.accessToken).toBe("concurrent-token"),
      );
    });
  });

  describe("Thundering Herd", () => {
    it("concurrent stale-token refreshes result in exactly 1 SSO call", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      // Pre-seed a token inside the 300s early-refresh window
      (tokenRetriever as any).tokenCache = {
        accessToken: "stale-token",
        expiresAt: new Date(Date.now() + 60000), // 60s remaining
      };

      let callCount = 0;
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockImplementation(async () => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return {};
      });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "refreshed-token",
        expires_in: 3600,
      });

      const promises = Array.from({ length: 20 }, () =>
        tokenRetriever.getToken(),
      );
      const tokens = await Promise.all(promises);

      tokens.forEach((token) =>
        expect(token.accessToken).toBe("refreshed-token"),
      );
      expect(callCount).toBe(1);
    });

    it("concurrent force-refresh calls result in exactly 1 SSO call", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      // Pre-seed a valid token so force-refresh is the only trigger
      (tokenRetriever as any).tokenCache = {
        accessToken: "valid-token",
        expiresAt: new Date(Date.now() + 3600000),
      };

      let callCount = 0;
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockImplementation(async () => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return {};
      });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "force-refreshed-token",
        expires_in: 3600,
      });

      const promises = Array.from({ length: 20 }, () =>
        tokenRetriever.getToken(true),
      );
      const tokens = await Promise.all(promises);

      tokens.forEach((token) =>
        expect(token.accessToken).toBe("force-refreshed-token"),
      );
      expect(callCount).toBe(1);
    });

    it("waiters share terminal failure instead of each retrying independently", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        throw new Error("SSO unavailable");
      });

      const promises = Array.from({ length: 5 }, () =>
        tokenRetriever.getToken(),
      );
      const results = await Promise.allSettled(promises);

      const rejected = results.filter(
        (r): r is PromiseRejectedResult => r.status === "rejected",
      );
      expect(rejected).toHaveLength(5);
      rejected.forEach((r) => expect(r.reason.message).toBe("SSO unavailable"));

      // All 5 callers share the same generation — only 1 refresh runs
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(1);
    });

    it("all concurrent waiters share terminal failure from the same generation", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        throw new Error("SSO unavailable");
      });

      // All 5 callers arrive in the same generation
      const promises = Array.from({ length: 5 }, () =>
        tokenRetriever.getToken(),
      );
      const results = await Promise.allSettled(promises);

      // All share the terminal failure — no independent retry cascades
      const rejected = results.filter((r) => r.status === "rejected");
      expect(rejected).toHaveLength(5);
      rejected.forEach((r) =>
        expect((r as PromiseRejectedResult).reason.message).toBe(
          "SSO unavailable",
        ),
      );
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(1);
    });

    it("allows retry after a failed coalesced refresh", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest
        .mockRejectedValueOnce(new Error("SSO unavailable"))
        .mockResolvedValueOnce({});
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "retry-token",
        expires_in: 3600,
      });

      await expect(tokenRetriever.getToken()).rejects.toThrow(
        "SSO unavailable",
      );

      const token = await tokenRetriever.getToken();
      expect(token.accessToken).toBe("retry-token");
    });

    it("refreshes again after a previous coalesced refresh expires", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      let callCount = 0;
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockImplementation(async () => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return {};
      });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "first-token",
        expires_in: 3600,
      });

      // First batch: cold start, should make 1 SSO call
      const batch1 = Array.from({ length: 5 }, () => tokenRetriever.getToken());
      await Promise.all(batch1);
      expect(callCount).toBe(1);

      // Expire the token
      (tokenRetriever as any).tokenCache = {
        accessToken: "first-token",
        expiresAt: new Date(Date.now() - 1000),
      };

      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "second-token",
        expires_in: 3600,
      });

      // Second batch: expired token, should make exactly 1 more SSO call
      const batch2 = Array.from({ length: 5 }, () => tokenRetriever.getToken());
      const tokens = await Promise.all(batch2);

      tokens.forEach((t) => expect(t.accessToken).toBe("second-token"));
      expect(callCount).toBe(2);
    });

    it("cold-start with short-lived token triggers exactly 1 SSO call", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      let callCount = 0;
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockImplementation(async () => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return {};
      });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "short-lived-token",
        expires_in: 60,
      });

      const promises = Array.from({ length: 20 }, () =>
        tokenRetriever.getToken(),
      );
      const tokens = await Promise.all(promises);

      tokens.forEach((token) =>
        expect(token.accessToken).toBe("short-lived-token"),
      );
      expect(callCount).toBe(1);
    });
  });

  describe("Concurrent Failure Sharing (Generation Tracking)", () => {
    it("later caller can retry after concurrent cohort fails", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      let callCount = 0;
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockImplementation(async () => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 20));
        if (callCount === 1) throw new Error("SSO unavailable");
        return {};
      });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "recovered-token",
        expires_in: 3600,
      });

      // First batch: all 3 callers arrive in generation 0. Refresh fails → all share failure.
      const batch1 = Array.from({ length: 3 }, () => tokenRetriever.getToken());
      const results1 = await Promise.allSettled(batch1);
      expect(results1.every((r) => r.status === "rejected")).toBe(true);
      expect(callCount).toBe(1);

      // Second call: arrives in generation 1. Starts fresh refresh → succeeds.
      const token = await tokenRetriever.getToken();
      expect(token.accessToken).toBe("recovered-token");
      expect(callCount).toBe(2);
    });

    it("shares failure with exact token-request count", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockRejectedValue(
        fetchTypeError("fetch failed"),
      );

      // 10 concurrent callers — all in generation 0
      const promises = Array.from({ length: 10 }, () =>
        tokenRetriever.getToken(),
      );
      const results = await Promise.allSettled(promises);

      // All 10 share the failure
      expect(results.filter((r) => r.status === "rejected")).toHaveLength(10);
      // Only 1 refresh ran (with default 3 retries = 4 total attempts)
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(4);
    });

    it("recovery after shared failure — later generation uses new cache", async () => {
      const tokenRetriever = new OAuth2ClientCredentials(mockAuth);

      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest
        .mockRejectedValueOnce(new Error("SSO unavailable"))
        .mockImplementation(async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return {};
        });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "recovered-token",
        expires_in: 3600,
      });

      // First call: fails (generation 0)
      await expect(tokenRetriever.getToken()).rejects.toThrow(
        "SSO unavailable",
      );

      // Sequential second call: new generation, starts fresh, succeeds
      const token = await tokenRetriever.getToken();
      expect(token.accessToken).toBe("recovered-token");

      // Third call: uses cache
      const cached = await tokenRetriever.getToken();
      expect(cached.accessToken).toBe("recovered-token");
      // Total: 1 failed + 1 succeeded = 2 SSO calls
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe("Configuration Edge Cases", () => {
    it("handles empty client ID", () => {
      const authWithEmptyClientId = {
        clientId: "",
        clientSecret: "test-secret",
        tokenEndpoint: "https://example.com/token",
      };

      const tokenRetriever = new OAuth2ClientCredentials(authWithEmptyClientId);
      expect(tokenRetriever.auth.clientId).toBe("");
    });

    it("handles empty client secret", () => {
      const authWithEmptySecret = {
        clientId: "test-client",
        clientSecret: "",
        tokenEndpoint: "https://example.com/token",
      };

      const tokenRetriever = new OAuth2ClientCredentials(authWithEmptySecret);
      expect(tokenRetriever.auth.clientSecret).toBe("");
    });

    it("handles token endpoint with trailing slash", () => {
      const authWithTrailingSlash = {
        clientId: "test-client",
        clientSecret: "test-secret",
        tokenEndpoint: "https://example.com/token/",
      };

      const tokenRetriever = new OAuth2ClientCredentials(authWithTrailingSlash);
      expect(tokenRetriever.auth.tokenEndpoint).toBe(
        "https://example.com/token/",
      );
    });

    it("handles token endpoint with query parameters", () => {
      const authWithQueryParams = {
        clientId: "test-client",
        clientSecret: "test-secret",
        tokenEndpoint: "https://example.com/token?param=value",
      };

      const tokenRetriever = new OAuth2ClientCredentials(authWithQueryParams);
      expect(tokenRetriever.auth.tokenEndpoint).toBe(
        "https://example.com/token?param=value",
      );
    });

    it("handles auth config with special characters", () => {
      const authWithSpecialChars = {
        clientId: "test-client!@#$%^&*()",
        clientSecret: "test-secret-with-special-chars!@#$%^&*()",
        tokenEndpoint: "https://example.com/token",
      };

      const tokenRetriever = new OAuth2ClientCredentials(authWithSpecialChars);
      expect(tokenRetriever.auth.clientId).toBe("test-client!@#$%^&*()");
      expect(tokenRetriever.auth.clientSecret).toBe(
        "test-secret-with-special-chars!@#$%^&*()",
      );
    });
  });
  describe("Secret Redaction", () => {
    const secretAuth = {
      clientId: "redact-client",
      clientSecret: "super-secret-value",
      tokenEndpoint: "https://example.com/token",
    };

    it("auth getter returns the live config with real secret", () => {
      const credentials = new OAuth2ClientCredentials(secretAuth);

      expect(credentials.auth).toBe(secretAuth);
      expect(credentials.auth.clientId).toBe("redact-client");
      expect(credentials.auth.clientSecret).toBe("super-secret-value");
      expect(credentials.auth.tokenEndpoint).toBe("https://example.com/token");
    });

    it("JSON.stringify redacts clientSecret", () => {
      const credentials = new OAuth2ClientCredentials(secretAuth);
      const json = JSON.stringify(credentials);
      const parsed = JSON.parse(json);

      expect(parsed.auth.clientId).toBe("redact-client");
      expect(parsed.auth.clientSecret).toBe("[REDACTED]");
      expect(parsed.auth.tokenEndpoint).toBe("https://example.com/token");
      expect(json).not.toContain("super-secret-value");
    });

    it("toString() redacts clientSecret", () => {
      const credentials = new OAuth2ClientCredentials(secretAuth);
      const str = credentials.toString();

      expect(str).toContain("redact-client");
      expect(str).toContain("[REDACTED]");
      expect(str).not.toContain("super-secret-value");
    });

    it("String() coercion redacts clientSecret", () => {
      const credentials = new OAuth2ClientCredentials(secretAuth);
      const str = String(credentials);

      expect(str).toContain("[REDACTED]");
      expect(str).not.toContain("super-secret-value");
    });

    it("util.inspect redacts clientSecret", () => {
      const credentials = new OAuth2ClientCredentials(secretAuth);
      const inspected = inspect(credentials);

      expect(inspected).toContain("redact-client");
      expect(inspected).toContain("[REDACTED]");
      expect(inspected).not.toContain("super-secret-value");
    });

    it("object spread does not include auth", () => {
      const credentials = new OAuth2ClientCredentials(secretAuth);
      const spread = { ...credentials };

      expect(spread).not.toHaveProperty("auth");
      expect(Object.keys(spread)).not.toContain("auth");
    });

    it("Object.keys does not include auth", () => {
      const credentials = new OAuth2ClientCredentials(secretAuth);
      const keys = Object.keys(credentials);

      expect(keys).not.toContain("auth");
    });

    it("toJSON preserves clientId and tokenEndpoint", () => {
      const credentials = new OAuth2ClientCredentials(secretAuth);
      const json = credentials.toJSON();

      expect(json).toEqual({
        auth: {
          clientId: "redact-client",
          clientSecret: "[REDACTED]",
          tokenEndpoint: "https://example.com/token",
        },
      });
    });

    it("redaction works with empty clientSecret", () => {
      const emptySecretAuth = {
        clientId: "test-client",
        clientSecret: "",
        tokenEndpoint: "https://example.com/token",
      };
      const credentials = new OAuth2ClientCredentials(emptySecretAuth);

      // Accessor returns real (empty) value
      expect(credentials.auth.clientSecret).toBe("");

      // Serialization still redacts
      const parsed = JSON.parse(JSON.stringify(credentials));
      expect(parsed.auth.clientSecret).toBe("[REDACTED]");
    });

    it("redaction works with special characters in secret", () => {
      const specialAuth = {
        clientId: "test-client",
        clientSecret: 'secret-with-"quotes"-and-\\backslash',
        tokenEndpoint: "https://example.com/token",
      };
      const credentials = new OAuth2ClientCredentials(specialAuth);

      // Accessor returns real value
      expect(credentials.auth.clientSecret).toBe(
        'secret-with-"quotes"-and-\\backslash',
      );

      // Serialization redacts
      const json = JSON.stringify(credentials);
      expect(json).not.toContain("quotes");
      expect(json).toContain("[REDACTED]");
    });
  });

  describe("Retry Configuration", () => {
    it("uses default retry options when none provided", () => {
      const credentials = new OAuth2ClientCredentials(mockAuth);
      // Verify defaults by checking retry behavior: 3 retries = 4 total attempts
      expect(DEFAULT_RETRY_OPTIONS).toEqual({
        maxRetries: 3,
        baseDelay: 0.5,
        maxDelay: 2.0,
        jitter: "full",
      });
      // Constructor accepts without retry param (backward compatible)
      expect(credentials.auth).toBe(mockAuth);
    });

    it("accepts custom retry options", () => {
      const retry: RetryOptions = {
        maxRetries: 5,
        baseDelay: 1.0,
        maxDelay: 10.0,
        jitter: "none",
      };
      const credentials = new OAuth2ClientCredentials(mockAuth, retry);
      expect(credentials.auth).toBe(mockAuth);
    });

    it("accepts partial retry options and fills defaults", () => {
      const credentials = new OAuth2ClientCredentials(mockAuth, {
        maxRetries: 1,
      });
      expect(credentials.auth).toBe(mockAuth);
    });

    it("disables retries with maxRetries: 0", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue({
        status: 500,
      });

      const credentials = new OAuth2ClientCredentials(mockAuth, {
        maxRetries: 0,
      });

      await expect(credentials.getToken()).rejects.toThrow(
        "Token endpoint returned HTTP 500",
      );
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(1);
    });

    it("rejects negative maxRetries", () => {
      expect(
        () => new OAuth2ClientCredentials(mockAuth, { maxRetries: -1 }),
      ).toThrow(RangeError);
    });

    it("rejects non-integer maxRetries", () => {
      expect(
        () => new OAuth2ClientCredentials(mockAuth, { maxRetries: 1.5 }),
      ).toThrow(RangeError);
    });

    it("rejects NaN maxRetries", () => {
      expect(
        () => new OAuth2ClientCredentials(mockAuth, { maxRetries: NaN }),
      ).toThrow(RangeError);
    });

    it("rejects Infinity baseDelay", () => {
      expect(
        () => new OAuth2ClientCredentials(mockAuth, { baseDelay: Infinity }),
      ).toThrow(RangeError);
    });

    it("rejects negative baseDelay", () => {
      expect(
        () => new OAuth2ClientCredentials(mockAuth, { baseDelay: -0.5 }),
      ).toThrow(RangeError);
    });

    it("rejects NaN maxDelay", () => {
      expect(
        () => new OAuth2ClientCredentials(mockAuth, { maxDelay: NaN }),
      ).toThrow(RangeError);
    });

    it("rejects -Infinity maxDelay", () => {
      expect(
        () => new OAuth2ClientCredentials(mockAuth, { maxDelay: -Infinity }),
      ).toThrow(RangeError);
    });

    it("preserves per-field undefined defaults", () => {
      // Only maxRetries set — baseDelay, maxDelay, jitter should use defaults
      const credentials = new OAuth2ClientCredentials(mockAuth, {
        maxRetries: 0,
      });
      expect(credentials.auth).toBe(mockAuth);
    });

    it("accepts maxRetries: 0 and jitter 'none'", () => {
      expect(
        () =>
          new OAuth2ClientCredentials(mockAuth, {
            maxRetries: 0,
            jitter: "none",
          }),
      ).not.toThrow();
    });
  });

  describe("Retry on Transient Failures", () => {
    it("retries on connection error (TypeError) and succeeds", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest
        .mockRejectedValueOnce(fetchTypeError("fetch failed"))
        .mockResolvedValueOnce({ status: 200 });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "recovered-token",
        expires_in: 3600,
      });

      const credentials = new OAuth2ClientCredentials(mockAuth);
      const token = await credentials.getToken();

      expect(token.accessToken).toBe("recovered-token");
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(2);
    });

    it("retries on HTTP 429 and succeeds", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest
        .mockResolvedValueOnce({ status: 429 })
        .mockResolvedValueOnce({ status: 200 });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "after-429-token",
        expires_in: 3600,
      });

      const credentials = new OAuth2ClientCredentials(mockAuth);
      const token = await credentials.getToken();

      expect(token.accessToken).toBe("after-429-token");
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(2);
    });

    it("retries on HTTP 500 and succeeds", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest
        .mockResolvedValueOnce({ status: 500 })
        .mockResolvedValueOnce({ status: 200 });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "after-500-token",
        expires_in: 3600,
      });

      const credentials = new OAuth2ClientCredentials(mockAuth);
      const token = await credentials.getToken();

      expect(token.accessToken).toBe("after-500-token");
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(2);
    });

    it("retries on HTTP 502 and succeeds", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest
        .mockResolvedValueOnce({ status: 502 })
        .mockResolvedValueOnce({ status: 200 });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "after-502-token",
        expires_in: 3600,
      });

      const credentials = new OAuth2ClientCredentials(mockAuth);
      const token = await credentials.getToken();

      expect(token.accessToken).toBe("after-502-token");
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(2);
    });

    it("retries on HTTP 503 and succeeds", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest
        .mockResolvedValueOnce({ status: 503 })
        .mockResolvedValueOnce({ status: 200 });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "after-503-token",
        expires_in: 3600,
      });

      const credentials = new OAuth2ClientCredentials(mockAuth);
      const token = await credentials.getToken();

      expect(token.accessToken).toBe("after-503-token");
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(2);
    });

    it("retries on HTTP 599 (upper 5xx boundary)", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest
        .mockResolvedValueOnce({ status: 599 })
        .mockResolvedValueOnce({ status: 200 });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "after-599-token",
        expires_in: 3600,
      });

      const credentials = new OAuth2ClientCredentials(mockAuth);
      const token = await credentials.getToken();

      expect(token.accessToken).toBe("after-599-token");
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(2);
    });

    it("retries multiple times before success", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest
        .mockRejectedValueOnce(fetchTypeError("fetch failed"))
        .mockResolvedValueOnce({ status: 503 })
        .mockResolvedValueOnce({ status: 429 })
        .mockResolvedValueOnce({ status: 200 });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "after-three-retries",
        expires_in: 3600,
      });

      const credentials = new OAuth2ClientCredentials(mockAuth);
      const token = await credentials.getToken();

      expect(token.accessToken).toBe("after-three-retries");
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(4);
    });

    it("throws after exhausting all retries on connection errors", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockRejectedValue(
        fetchTypeError("fetch failed"),
      );

      const credentials = new OAuth2ClientCredentials(mockAuth, {
        maxRetries: 2,
      });

      await expect(credentials.getToken()).rejects.toThrow("fetch failed");
      // 1 initial + 2 retries = 3 total
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(3);
    });

    it("throws after exhausting all retries on HTTP 500", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue({
        status: 500,
      });

      const credentials = new OAuth2ClientCredentials(mockAuth, {
        maxRetries: 2,
      });

      await expect(credentials.getToken()).rejects.toThrow(
        "Token endpoint returned HTTP 500",
      );
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(3);
    });
  });

  describe("Non-Retryable Failures", () => {
    it("does not retry on HTTP 400", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue({
        status: 400,
      });
      mockOAuth.processClientCredentialsResponse.mockRejectedValue(
        new Error("invalid_request"),
      );

      const credentials = new OAuth2ClientCredentials(mockAuth);

      await expect(credentials.getToken()).rejects.toThrow("invalid_request");
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(1);
    });

    it("does not retry on HTTP 401", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue({
        status: 401,
      });
      mockOAuth.processClientCredentialsResponse.mockRejectedValue(
        new Error("invalid_client"),
      );

      const credentials = new OAuth2ClientCredentials(mockAuth);

      await expect(credentials.getToken()).rejects.toThrow("invalid_client");
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(1);
    });

    it("does not retry on HTTP 403", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue({
        status: 403,
      });
      mockOAuth.processClientCredentialsResponse.mockRejectedValue(
        new Error("access_denied"),
      );

      const credentials = new OAuth2ClientCredentials(mockAuth);

      await expect(credentials.getToken()).rejects.toThrow("access_denied");
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(1);
    });

    it("does not retry on AbortError (caller cancellation)", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockRejectedValue(
        new DOMException("The operation was aborted", "AbortError"),
      );

      const credentials = new OAuth2ClientCredentials(mockAuth);

      await expect(credentials.getToken()).rejects.toThrow(
        "The operation was aborted",
      );
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(1);
    });

    it("does not retry missing access_token in response", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue({
        status: 200,
      });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({});

      const credentials = new OAuth2ClientCredentials(mockAuth);

      await expect(credentials.getToken()).rejects.toThrow(
        "No access token received from OAuth server",
      );
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(1);
    });

    it("does not retry TypeError without cause (validation/construction error)", async () => {
      // TypeErrors without a cause are permanent — e.g., invalid URL or missing
      // argument that fails before an HTTP request is ever sent.
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockRejectedValue(
        new TypeError("Invalid URL"),
      );

      const credentials = new OAuth2ClientCredentials(mockAuth, {
        maxRetries: 3,
      });

      await expect(credentials.getToken()).rejects.toThrow("Invalid URL");
      // Permanent error — no retries, single attempt
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(1);
    });

    it("does not retry malformed JSON during response processing", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue({
        status: 200,
      });
      mockOAuth.processClientCredentialsResponse.mockRejectedValue(
        new SyntaxError("Unexpected token < in JSON at position 0"),
      );

      const credentials = new OAuth2ClientCredentials(mockAuth, {
        maxRetries: 3,
      });

      await expect(credentials.getToken()).rejects.toThrow("Unexpected token");
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("Response-Body Failure Retry", () => {
    it("retries transport error during response body read", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue({
        status: 200,
      });
      // First call: body read fails with transport TypeError (has cause)
      // Second call: succeeds
      mockOAuth.processClientCredentialsResponse
        .mockRejectedValueOnce(
          fetchTypeError("terminated", new Error("other side closed")),
        )
        .mockResolvedValueOnce({
          access_token: "body-retry-token",
          expires_in: 3600,
        });

      const credentials = new OAuth2ClientCredentials(mockAuth, {
        maxRetries: 2,
      });
      const token = await credentials.getToken();

      expect(token.accessToken).toBe("body-retry-token");
      // 2 grant requests (both succeed at HTTP level), 2 process calls
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(2);
      expect(mockOAuth.processClientCredentialsResponse).toHaveBeenCalledTimes(
        2,
      );
    });

    it("does not retry AbortError during response body read", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue({
        status: 200,
      });
      mockOAuth.processClientCredentialsResponse.mockRejectedValue(
        new DOMException("The operation was aborted", "AbortError"),
      );

      const credentials = new OAuth2ClientCredentials(mockAuth, {
        maxRetries: 3,
      });

      await expect(credentials.getToken()).rejects.toThrow(
        "The operation was aborted",
      );
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("Retry with Thundering Herd", () => {
    it("retries inside coalesced refresh — concurrent callers see retried result", async () => {
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest
        .mockResolvedValueOnce({ status: 503 })
        .mockImplementation(async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          return { status: 200 };
        });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "retried-coalesced-token",
        expires_in: 3600,
      });

      const credentials = new OAuth2ClientCredentials(mockAuth);
      const promises = Array.from({ length: 10 }, () => credentials.getToken());
      const tokens = await Promise.all(promises);

      tokens.forEach((token) =>
        expect(token.accessToken).toBe("retried-coalesced-token"),
      );
      // Only one refresh path runs (coalesced): 1 × 503 + 1 × 200 = 2
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe("Retry Backoff", () => {
    it("applies delay between retries", async () => {
      const start = Date.now();
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest
        .mockResolvedValueOnce({ status: 500 })
        .mockResolvedValueOnce({ status: 200 });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "delayed-token",
        expires_in: 3600,
      });

      // Use "none" jitter for deterministic delay
      const credentials = new OAuth2ClientCredentials(mockAuth, {
        maxRetries: 1,
        baseDelay: 0.1,
        maxDelay: 1.0,
        jitter: "none",
      });
      await credentials.getToken();
      const elapsed = Date.now() - start;

      // baseDelay = 0.1s = 100ms. Allow margin for timing.
      expect(elapsed).toBeGreaterThanOrEqual(80);
    });

    it("caps delay at maxDelay", async () => {
      const start = Date.now();
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest
        .mockResolvedValueOnce({ status: 500 })
        .mockResolvedValueOnce({ status: 500 })
        .mockResolvedValueOnce({ status: 200 });
      mockOAuth.processClientCredentialsResponse.mockResolvedValue({
        access_token: "capped-token",
        expires_in: 3600,
      });

      // baseDelay=0.1, maxDelay=0.15, no jitter
      // retry 0: min(0.15, 0.1 * 2^0) = min(0.15, 0.1) = 0.1
      // retry 1: min(0.15, 0.1 * 2^1) = min(0.15, 0.2) = 0.15
      // total: 0.25s = 250ms
      const credentials = new OAuth2ClientCredentials(mockAuth, {
        maxRetries: 2,
        baseDelay: 0.1,
        maxDelay: 0.15,
        jitter: "none",
      });
      await credentials.getToken();
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(200);
      // Should not exceed expected total + generous margin
      expect(elapsed).toBeLessThan(600);
    });
  });
});

describe("oauth2AuthRequest", () => {
  const mockAuth = {
    clientId: "test-client-id",
    clientSecret: "test-client-secret",
    tokenEndpoint: "https://example.com/token",
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it("creates an AuthRequest that configures request with Bearer token", async () => {
    const mockTokenResponse = {};
    const mockTokenResult = {
      access_token: "test-access-token",
      expires_in: 3600,
    };

    mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
    mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
      mockTokenResponse,
    );
    mockOAuth.processClientCredentialsResponse.mockResolvedValue(
      mockTokenResult,
    );

    const credentials = new OAuth2ClientCredentials(mockAuth);
    const authRequest = oauth2AuthRequest(credentials);

    const mockRequest = new Request("https://api.example.com/test");
    await authRequest.configureRequest(mockRequest);

    expect(mockRequest.headers.get("authorization")).toBe(
      "Bearer test-access-token",
    );
  });

  it("uses cached token when available", async () => {
    const credentials = new OAuth2ClientCredentials(mockAuth);

    // Set up a valid cached token
    const futureTime = new Date(Date.now() + 600000);
    (credentials as any).tokenCache = {
      accessToken: "cached-token",
      expiresAt: futureTime,
    };

    const authRequest = oauth2AuthRequest(credentials);
    const mockRequest = new Request("https://api.example.com/test");
    await authRequest.configureRequest(mockRequest);

    expect(mockRequest.headers.get("authorization")).toBe(
      "Bearer cached-token",
    );

    // Should not have called OAuth methods since using cache
    expect(mockOAuth.clientCredentialsGrantRequest).not.toHaveBeenCalled();
  });

  it("fetches new token when cache is expired", async () => {
    const mockTokenResponse = {};
    const mockTokenResult = {
      access_token: "fresh-token",
      expires_in: 3600,
    };

    mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
    mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
      mockTokenResponse,
    );
    mockOAuth.processClientCredentialsResponse.mockResolvedValue(
      mockTokenResult,
    );

    const credentials = new OAuth2ClientCredentials(mockAuth);

    // Set up an expired cache
    const pastTime = new Date(Date.now() - 1000);
    (credentials as any).tokenCache = {
      accessToken: "expired-token",
      expiresAt: pastTime,
    };

    const authRequest = oauth2AuthRequest(credentials);
    const mockRequest = new Request("https://api.example.com/test");
    await authRequest.configureRequest(mockRequest);

    expect(mockRequest.headers.get("authorization")).toBe("Bearer fresh-token");

    // Should have called OAuth methods to get new token
    expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalled();
    expect(mockOAuth.processClientCredentialsResponse).toHaveBeenCalled();
  });

  it("configures multiple requests with the same token", async () => {
    const credentials = new OAuth2ClientCredentials(mockAuth);

    // Set up a valid cached token
    const futureTime = new Date(Date.now() + 600000);
    (credentials as any).tokenCache = {
      accessToken: "shared-token",
      expiresAt: futureTime,
    };

    const authRequest = oauth2AuthRequest(credentials);

    const request1 = new Request("https://api.example.com/test1");
    const request2 = new Request("https://api.example.com/test2");

    await authRequest.configureRequest(request1);
    await authRequest.configureRequest(request2);

    expect(request1.headers.get("authorization")).toBe("Bearer shared-token");
    expect(request2.headers.get("authorization")).toBe("Bearer shared-token");
  });

  it("handles token retrieval errors gracefully", async () => {
    const tokenError = new Error("Failed to get token");

    mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
    mockOAuth.clientCredentialsGrantRequest.mockRejectedValue(tokenError);

    const credentials = new OAuth2ClientCredentials(mockAuth);
    const authRequest = oauth2AuthRequest(credentials);
    const mockRequest = new Request("https://api.example.com/test");

    await expect(authRequest.configureRequest(mockRequest)).rejects.toThrow(
      "Failed to get token",
    );
  });

  it("overwrites existing authorization header", async () => {
    const credentials = new OAuth2ClientCredentials(mockAuth);

    // Set up a valid cached token
    const futureTime = new Date(Date.now() + 600000);
    (credentials as any).tokenCache = {
      accessToken: "new-token",
      expiresAt: futureTime,
    };

    const authRequest = oauth2AuthRequest(credentials);
    const mockRequest = new Request("https://api.example.com/test", {
      headers: {
        authorization: "Bearer old-token",
      },
    });

    await authRequest.configureRequest(mockRequest);

    expect(mockRequest.headers.get("authorization")).toBe("Bearer new-token");
  });

  it("preserves other headers while setting authorization", async () => {
    const credentials = new OAuth2ClientCredentials(mockAuth);

    // Set up a valid cached token
    const futureTime = new Date(Date.now() + 600000);
    (credentials as any).tokenCache = {
      accessToken: "auth-token",
      expiresAt: futureTime,
    };

    const authRequest = oauth2AuthRequest(credentials);
    const mockRequest = new Request("https://api.example.com/test", {
      headers: {
        "content-type": "application/json",
        "user-agent": "test-agent",
      },
    });

    await authRequest.configureRequest(mockRequest);

    expect(mockRequest.headers.get("authorization")).toBe("Bearer auth-token");
    expect(mockRequest.headers.get("content-type")).toBe("application/json");
    expect(mockRequest.headers.get("user-agent")).toBe("test-agent");
  });
});
