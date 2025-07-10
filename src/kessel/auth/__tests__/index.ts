import { OAuthTokenRetriever } from "../index";

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

describe("OAuthTokenRetriever", () => {
  const mockAuth = {
    clientId: "test-client-id",
    clientSecret: "test-client-secret",
    issuerUrl: "https://example.com/auth",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe("ensureIsInitialized", () => {
    it("initializes OAuth components correctly", async () => {
      const mockResponse = {};
      const mockAuthServer = {
        token_endpoint: "https://example.com/token",
      };

      mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
      mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);
      await tokenRetriever.ensureIsInitialized();

      expect(mockOAuth.discoveryRequest).toHaveBeenCalledWith(
        new URL(mockAuth.issuerUrl),
      );
      expect(mockOAuth.processDiscoveryResponse).toHaveBeenCalledWith(
        new URL(mockAuth.issuerUrl),
        mockResponse,
      );
    });

    it("throws error when token endpoint is missing", async () => {
      const mockResponse = {};
      const mockAuthServer = {}; // No token_endpoint

      mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
      mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      await expect(tokenRetriever.ensureIsInitialized()).rejects.toThrow(
        "Token endpoint could not be discovered from issuer URL.",
      );
    });

    it("only initializes once", async () => {
      const mockResponse = {};
      const mockAuthServer = {
        token_endpoint: "https://example.com/token",
      };

      mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
      mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      // Call twice
      await tokenRetriever.ensureIsInitialized();
      await tokenRetriever.ensureIsInitialized();

      // Should only call discovery once
      expect(mockOAuth.discoveryRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("isCacheValid", () => {
    it("returns falsy when no cache exists", () => {
      const tokenRetriever = new OAuthTokenRetriever(mockAuth);
      expect(tokenRetriever.isCacheValid()).toBeFalsy();
    });

    it("returns true when cache is still valid", () => {
      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      // Set up a mock cache by accessing the private property
      const futureTime = Date.now() + 600000; // 10 minutes in the future
      (tokenRetriever as any).tokenCache = {
        accessToken: "test-token",
        expiresAt: futureTime,
      };

      expect(tokenRetriever.isCacheValid()).toBe(true);
    });

    it("returns falsy when cache is expired", () => {
      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      // Set up a mock cache that's expired
      const pastTime = Date.now() - 1000; // 1 second ago
      (tokenRetriever as any).tokenCache = {
        accessToken: "test-token",
        expiresAt: pastTime,
      };

      expect(tokenRetriever.isCacheValid()).toBeFalsy();
    });
  });

  describe("getNextToken", () => {
    it("returns cached token when valid", async () => {
      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      // Set up a valid cached token
      const futureTime = Date.now() + 600000;
      (tokenRetriever as any).tokenCache = {
        accessToken: "cached-token",
        expiresAt: futureTime,
      };

      const token = await tokenRetriever.getNextToken();
      expect(token).toBe("cached-token");

      // Should not call OAuth methods
      expect(mockOAuth.clientCredentialsGrantRequest).not.toHaveBeenCalled();
    });

    it("fetches new token when cache is invalid", async () => {
      const mockResponse = {};
      const mockAuthServer = {
        token_endpoint: "https://example.com/token",
      };
      const mockTokenResponse = {};
      const mockTokenResult = {
        access_token: "new-token",
        expires_in: 3600,
      };

      mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
      mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(
        mockTokenResult,
      );

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      // Need to initialize first
      await tokenRetriever.ensureIsInitialized();

      const token = await tokenRetriever.getNextToken();
      expect(token).toBe("new-token");

      // Should have called OAuth methods
      expect(mockOAuth.clientCredentialsGrantRequest).toHaveBeenCalled();
      expect(mockOAuth.processClientCredentialsResponse).toHaveBeenCalled();
    });

    it("caches the new token correctly", async () => {
      const mockResponse = {};
      const mockAuthServer = {
        token_endpoint: "https://example.com/token",
      };
      const mockTokenResponse = {};
      const mockTokenResult = {
        access_token: "new-token",
        expires_in: 3600,
      };

      mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
      mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(
        mockTokenResult,
      );

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      const beforeTime = Date.now();
      await tokenRetriever.getNextToken();
      const afterTime = Date.now();

      const cache = (tokenRetriever as any).tokenCache;
      expect(cache.accessToken).toBe("new-token");
      expect(cache.expiresAt).toBeGreaterThanOrEqual(beforeTime + 3600000); // Should be about 1 hour from now
      expect(cache.expiresAt).toBeLessThanOrEqual(afterTime + 3600000 + 1000); // Allow some margin
    });
  });

  describe("constructor", () => {
    it("stores auth configuration", () => {
      const tokenRetriever = new OAuthTokenRetriever(mockAuth);
      expect(tokenRetriever.auth).toBe(mockAuth);
    });

    it("accepts different auth configurations", () => {
      const customAuth = {
        clientId: "custom-client",
        clientSecret: "custom-secret",
        issuerUrl: "https://custom.auth.server.com/auth",
      };

      const tokenRetriever = new OAuthTokenRetriever(customAuth);
      expect(tokenRetriever.auth).toBe(customAuth);
      expect(tokenRetriever.auth.clientId).toBe("custom-client");
      expect(tokenRetriever.auth.issuerUrl).toBe(
        "https://custom.auth.server.com/auth",
      );
    });
  });

  describe("Error Handling", () => {
    it("handles discovery request failures", async () => {
      const networkError = new Error("Network error");
      mockOAuth.discoveryRequest.mockRejectedValue(networkError);

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      await expect(tokenRetriever.ensureIsInitialized()).rejects.toThrow(
        "Network error",
      );
    });

    it("handles malformed discovery response", async () => {
      const malformedResponse: any = null;
      mockOAuth.discoveryRequest.mockResolvedValue(malformedResponse);
      mockOAuth.processDiscoveryResponse.mockRejectedValue(
        new Error("Malformed response"),
      );

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      await expect(tokenRetriever.getNextToken()).rejects.toThrow(
        "Malformed response",
      );
    });

    it("handles token request failures", async () => {
      const mockResponse = {};
      const mockAuthServer = {
        token_endpoint: "https://example.com/token",
      };
      const tokenError = new Error("Token request failed");

      mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
      mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockRejectedValue(tokenError);

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      await expect(tokenRetriever.getNextToken()).rejects.toThrow(
        "Token request failed",
      );
    });

    it("handles invalid token response", async () => {
      const mockResponse = {};
      const mockAuthServer = {
        token_endpoint: "https://example.com/token",
      };
      const mockTokenResponse = {};
      const invalidTokenError = new Error("Invalid token format");

      mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
      mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockRejectedValue(
        invalidTokenError,
      );

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      await expect(tokenRetriever.getNextToken()).rejects.toThrow(
        "Invalid token format",
      );
    });

    it("handles invalid issuer URL", async () => {
      const invalidAuth = {
        clientId: "test-client",
        clientSecret: "test-secret",
        issuerUrl: "not-a-valid-url",
      };

      const tokenRetriever = new OAuthTokenRetriever(invalidAuth);

      await expect(tokenRetriever.getNextToken()).rejects.toThrow();
    });
  });

  describe("Cache Management", () => {
    it("respects expiration window", () => {
      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      // Set up a cache that expires just within the expiration window
      const almostExpiredTime = Date.now() + 10000; // 10 seconds (less than 20 second window)
      (tokenRetriever as any).tokenCache = {
        accessToken: "almost-expired-token",
        expiresAt: almostExpiredTime,
      };

      expect(tokenRetriever.isCacheValid()).toBeFalsy();
    });

    it("handles cache with exact expiration time", () => {
      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      // Set up a cache that expires at exactly the expiration window
      const exactExpirationTime = Date.now() + 20000; // Exactly 20 seconds (the window)
      (tokenRetriever as any).tokenCache = {
        accessToken: "exact-expiration-token",
        expiresAt: exactExpirationTime,
      };

      expect(tokenRetriever.isCacheValid()).toBeFalsy();
    });

    it("handles cache with far future expiration", () => {
      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      // Set up a cache that expires far in the future
      const farFutureTime = Date.now() + 3600000; // 1 hour
      (tokenRetriever as any).tokenCache = {
        accessToken: "far-future-token",
        expiresAt: farFutureTime,
      };

      expect(tokenRetriever.isCacheValid()).toBe(true);
    });

    it("handles cache with past expiration", () => {
      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      // Set up a cache that expired in the past
      const pastTime = Date.now() - 3600000; // 1 hour ago
      (tokenRetriever as any).tokenCache = {
        accessToken: "expired-token",
        expiresAt: pastTime,
      };

      expect(tokenRetriever.isCacheValid()).toBeFalsy();
    });
  });

  describe("Token Lifecycle", () => {
    it("fetches token when not initialized", async () => {
      const mockResponse = {};
      const mockAuthServer = {
        token_endpoint: "https://example.com/token",
      };
      const mockTokenResponse = {};
      const mockTokenResult = {
        access_token: "fresh-token",
        expires_in: 3600,
      };

      mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
      mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);
      mockOAuth.ClientSecretPost = jest
        .fn()
        .mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(
        mockTokenResult,
      );

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      // Don't call ensureIsInitialized manually
      const token = await tokenRetriever.getNextToken();
      expect(token).toBe("fresh-token");
    });

    it("handles token with zero expiration", async () => {
      const mockResponse = {};
      const mockAuthServer = {
        token_endpoint: "https://example.com/token",
      };
      const mockTokenResponse = {};
      const mockTokenResult = {
        access_token: "zero-expiry-token",
        expires_in: 0,
      };

      mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
      mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(
        mockTokenResult,
      );

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      const token = await tokenRetriever.getNextToken();
      expect(token).toBe("zero-expiry-token");

      // Token should be cached but immediately invalid
      expect(tokenRetriever.isCacheValid()).toBeFalsy();
    });

    it("handles token with very long expiration", async () => {
      const mockResponse = {};
      const mockAuthServer = {
        token_endpoint: "https://example.com/token",
      };
      const mockTokenResponse = {};
      const mockTokenResult = {
        access_token: "long-lived-token",
        expires_in: 86400, // 24 hours
      };

      mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
      mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(
        mockTokenResult,
      );

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      const token = await tokenRetriever.getNextToken();
      expect(token).toBe("long-lived-token");

      // Token should be cached and valid
      expect(tokenRetriever.isCacheValid()).toBe(true);
    });

    it("handles concurrent token requests", async () => {
      const mockResponse = {};
      const mockAuthServer = {
        token_endpoint: "https://example.com/token",
      };
      const mockTokenResponse = {};
      const mockTokenResult = {
        access_token: "concurrent-token",
        expires_in: 3600,
      };

      mockOAuth.discoveryRequest.mockResolvedValue(mockResponse);
      mockOAuth.processDiscoveryResponse.mockResolvedValue(mockAuthServer);
      mockOAuth.ClientSecretPost.mockReturnValue("mock-client-auth");
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(
        mockTokenResponse,
      );
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(
        mockTokenResult,
      );

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);

      // Make multiple concurrent requests
      const promises = Array.from({ length: 5 }, () =>
        tokenRetriever.getNextToken(),
      );
      const tokens = await Promise.all(promises);

      // All should return the same token
      expect(tokens).toHaveLength(5);
      tokens.forEach((token) => expect(token).toBe("concurrent-token"));
    });
  });

  describe("Configuration Edge Cases", () => {
    it("handles empty client ID", () => {
      const authWithEmptyClientId = {
        clientId: "",
        clientSecret: "test-secret",
        issuerUrl: "https://example.com/auth",
      };

      const tokenRetriever = new OAuthTokenRetriever(authWithEmptyClientId);
      expect(tokenRetriever.auth.clientId).toBe("");
    });

    it("handles empty client secret", () => {
      const authWithEmptySecret = {
        clientId: "test-client",
        clientSecret: "",
        issuerUrl: "https://example.com/auth",
      };

      const tokenRetriever = new OAuthTokenRetriever(authWithEmptySecret);
      expect(tokenRetriever.auth.clientSecret).toBe("");
    });

    it("handles issuer URL with trailing slash", () => {
      const authWithTrailingSlash = {
        clientId: "test-client",
        clientSecret: "test-secret",
        issuerUrl: "https://example.com/auth/",
      };

      const tokenRetriever = new OAuthTokenRetriever(authWithTrailingSlash);
      expect(tokenRetriever.auth.issuerUrl).toBe("https://example.com/auth/");
    });

    it("handles issuer URL with query parameters", () => {
      const authWithQueryParams = {
        clientId: "test-client",
        clientSecret: "test-secret",
        issuerUrl: "https://example.com/auth?param=value",
      };

      const tokenRetriever = new OAuthTokenRetriever(authWithQueryParams);
      expect(tokenRetriever.auth.issuerUrl).toBe(
        "https://example.com/auth?param=value",
      );
    });

    it("handles auth config with special characters", () => {
      const authWithSpecialChars = {
        clientId: "test-client!@#$%^&*()",
        clientSecret: "test-secret-with-special-chars!@#$%^&*()",
        issuerUrl: "https://example.com/auth",
      };

      const tokenRetriever = new OAuthTokenRetriever(authWithSpecialChars);
      expect(tokenRetriever.auth.clientId).toBe("test-client!@#$%^&*()");
      expect(tokenRetriever.auth.clientSecret).toBe(
        "test-secret-with-special-chars!@#$%^&*()",
      );
    });
  });
});
