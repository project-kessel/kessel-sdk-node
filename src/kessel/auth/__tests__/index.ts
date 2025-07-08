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
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(mockTokenResponse);
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(mockTokenResult);

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
      mockOAuth.clientCredentialsGrantRequest.mockResolvedValue(mockTokenResponse);
      mockOAuth.processClientCredentialsResponse.mockResolvedValue(mockTokenResult);

      const tokenRetriever = new OAuthTokenRetriever(mockAuth);
      
      // Need to initialize first
      await tokenRetriever.ensureIsInitialized();
      
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
  });
}); 