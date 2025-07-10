import type * as oauth from "oauth4webapi";
import { ClientConfigAuth } from "../inventory";

const EXPIRATION_WINDOW = 20000; // 20 seconds in milliseconds

interface TokenData {
  accessToken: string;
  expiresAt: number;
}

/**
 * Handles OAuth 2.0 Client Credentials flow for authentication.
 *
 * This class manages token retrieval, caching, and automatic refresh for OAuth authentication.
 * It performs OAuth discovery to find the token endpoint and caches tokens until near expiration.
 *
 * @example
 * ```typescript
 * const tokenRetriever = new OAuthTokenRetriever({
 *   clientId: "my-client-id",
 *   clientSecret: "my-client-secret",
 *   issuerUrl: "https://auth.example.com"
 * });
 *
 * const token = await tokenRetriever.getNextToken();
 * ```
 */
export class OAuthTokenRetriever {
  private tokenCache?: TokenData;
  private authServer: oauth.AuthorizationServer;
  private initialized: boolean = false;
  private ClientSecretPost: typeof oauth.ClientSecretPost;
  private clientCredentialsGrantRequest: typeof oauth.clientCredentialsGrantRequest;
  private processClientCredentialsResponse: typeof oauth.processClientCredentialsResponse;

  /**
   * Creates a new OAuthTokenRetriever instance.
   *
   * @param auth - The OAuth configuration object
   */
  constructor(readonly auth: ClientConfigAuth) {}

  /**
   * Ensures the OAuth client is initialized by performing discovery.
   * This method is called automatically by getNextToken() and is idempotent.
   *
   * @throws {Error} If the token endpoint cannot be discovered from the issuer URL
   */
  public async ensureIsInitialized() {
    if (!this.initialized) {
      const oauth = await import("oauth4webapi");
      const issueUrl = new URL(this.auth.issuerUrl);

      const response = await oauth.discoveryRequest(issueUrl);
      this.authServer = await oauth.processDiscoveryResponse(
        issueUrl,
        response,
      );
      if (!this.authServer.token_endpoint) {
        throw new Error(
          "Token endpoint could not be discovered from issuer URL.",
        );
      }

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
  }

  /**
   * Gets a valid access token, fetching a new one if necessary.
   *
   * This method will:
   * 1. Initialize the OAuth client if not already done
   * 2. Return the cached token if it's still valid
   * 3. Fetch a new token from the OAuth server if needed
   * 4. Cache the new token for future use
   *
   * @returns A promise that resolves to a valid access token
   * @throws {Error} If token retrieval fails
   */
  async getNextToken(): Promise<string> {
    await this.ensureIsInitialized();

    if (this.isCacheValid()) {
      return this.tokenCache.accessToken;
    }

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

    this.tokenCache = {
      accessToken: result.access_token,
      expiresAt: Date.now() + result.expires_in * 1000,
    };

    return this.tokenCache.accessToken;
  }
}
