import type * as oauth from "oauth4webapi";
import { ClientConfigAuth } from "../inventory";

const EXPIRATION_WINDOW = 300000; // 5 minutes in milliseconds

interface TokenData {
  accessToken: string;
  expiresAt: number;
  expiresIn: number;
}

interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface OIDCDiscoveryMetadata {
  tokenEndpoint: string;
}

const importOAuth4WebApi = async (): Promise<typeof oauth> => {
  return await import("oauth4webapi");
};

export const fetchOIDCDiscovery = async (
  issueUrl: string,
): Promise<OIDCDiscoveryMetadata> => {
  const oauth = await importOAuth4WebApi();
  const issuerUrlObject = new URL(issueUrl);
  const response = await oauth.discoveryRequest(issuerUrlObject);
  const authServer = await oauth.processDiscoveryResponse(
    issuerUrlObject,
    response,
  );

  if (!authServer.token_endpoint) {
    throw new Error("Token endpoint could not be discovered from issuer URL.");
  }

  return {
    tokenEndpoint: authServer.token_endpoint,
  };
};

/**
 * Handles OAuth 2.0 Client Credentials flow for authentication.
 *
 * This class manages token retrieval, caching, and automatic refresh for OAuth authentication.
 * It requires a token endpoint URL (which can be discovered using fetchOIDCDiscovery) and caches tokens until near expiration.
 *
 * @example
 * ```typescript
 * import { fetchOIDCDiscovery, OAuth2ClientCredentials } from "@project-kessel/kessel-sdk/kessel/auth";
 *
 * // First, discover the token endpoint
 * const discovery = await fetchOIDCDiscovery("https://auth.example.com");
 *
 * // Create the OAuth client with the discovered endpoint
 * const authClient = new OAuth2ClientCredentials({
 *   clientId: "my-client-id",
 *   clientSecret: "my-client-secret",
 *   tokenEndpoint: discovery.tokenEndpoint
 * });
 *
 * // Get a token (returns [token, expiresInSeconds])
 * const [token, expiresIn] = await authClient.getToken();
 * ```
 */
export class OAuth2ClientCredentials {
  private tokenCache?: TokenData;
  private authServer: oauth.AuthorizationServer;
  private initialized: boolean = false;
  private ClientSecretPost: typeof oauth.ClientSecretPost;
  private clientCredentialsGrantRequest: typeof oauth.clientCredentialsGrantRequest;
  private processClientCredentialsResponse: typeof oauth.processClientCredentialsResponse;

  /**
   * Creates a new OAuth2ClientCredentials instance.
   *
   * @param auth - The OAuth configuration object containing clientId, clientSecret, and tokenEndpoint
   */
  constructor(readonly auth: ClientConfigAuth) {
    this.authServer = {
      issuer: auth.tokenEndpoint,
      token_endpoint: auth.tokenEndpoint,
    };
  }

  /**
   * Ensures the OAuth client is initialized.
   * This method is called automatically by getToken() and is idempotent.
   *
   * @throws {Error} If initialization fails
   */
  async ensureIsInitialized() {
    if (!this.initialized) {
      const oauth = await importOAuth4WebApi();

      this.ClientSecretPost = oauth.ClientSecretPost;
      this.clientCredentialsGrantRequest = oauth.clientCredentialsGrantRequest;
      this.processClientCredentialsResponse =
        oauth.processClientCredentialsResponse;

      this.initialized = true;
    }
  }

  /**
   * Checks if the current cached token is valid and not near expiration.
   *
   * @returns true if the cached token is valid and not near expiration, false otherwise
   */
  isCacheValid(): boolean {
    if (
      this.tokenCache &&
      this.tokenCache.expiresAt > Date.now() + EXPIRATION_WINDOW
    ) {
      return true;
    }
    return false;
  }

  /**
   * Gets a valid access token, fetching a new one if necessary.
   *
   * This method will:
   * 1. Initialize the OAuth client if not already done
   * 2. Return the cached token if it's still valid (unless forceRefresh is true)
   * 3. Fetch a new token from the OAuth server if needed
   * 4. Cache the new token for future use
   *
   * @param forceRefresh - If true, bypasses cache and forces a new token request
   * @returns A promise that resolves to a tuple containing [accessToken, expiresInSeconds]
   * @throws {Error} If token retrieval fails
   */
  async getToken(forceRefresh: boolean = false): Promise<[string, number]> {
    await this.ensureIsInitialized();

    if (!forceRefresh && this.isCacheValid()) {
      // Calculate accurate remaining time
      const remainingTime = Math.max(
        0,
        Math.floor((this.tokenCache.expiresAt - Date.now()) / 1000),
      );
      return [this.tokenCache.accessToken, remainingTime];
    }

    const refreshResponse = await this.refresh();

    this.tokenCache = {
      accessToken: refreshResponse.accessToken,
      expiresIn: refreshResponse.expiresIn,
      expiresAt: Date.now() + refreshResponse.expiresIn * 1000,
    };

    return [this.tokenCache.accessToken, this.tokenCache.expiresIn];
  }

  private async refresh(): Promise<RefreshTokenResponse> {
    const client: oauth.Client = { client_id: this.auth.clientId };
    const clientAuth = this.ClientSecretPost(this.auth.clientSecret);
    const parameters = new URLSearchParams();

    const response = await this.clientCredentialsGrantRequest(
      this.authServer,
      client,
      clientAuth,
      parameters,
    );
    const result = await this.processClientCredentialsResponse(
      this.authServer,
      client,
      response,
    );

    if (!result.access_token) {
      throw new Error("No access token received from OAuth server");
    }

    // Handle missing or invalid expires_in - default to 1 hour if not provided
    // Note: expires_in of 0 is valid and means "immediately expired"
    const expiresIn =
      typeof result.expires_in === "number" && result.expires_in >= 0
        ? result.expires_in
        : 3600; // Default to 1 hour

    return {
      expiresIn,
      accessToken: result.access_token,
    };
  }
}
