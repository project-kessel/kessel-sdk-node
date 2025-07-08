import type * as oauth from "oauth4webapi";
import { ClientConfigAuth } from "../inventory";

const EXPIRATION_WINDOW = 20000; // 20 seconds in milliseconds

interface TokenData {
  accessToken: string;
  expiresAt: number;
}

export class OAuthTokenRetriever {
  private tokenCache?: TokenData;
  private authServer: oauth.AuthorizationServer;
  private initialized: boolean = false;
  private ClientSecretPost: typeof oauth.ClientSecretPost;
  private clientCredentialsGrantRequest: typeof oauth.clientCredentialsGrantRequest;
  private processClientCredentialsResponse: typeof oauth.processClientCredentialsResponse;

  constructor(readonly auth: ClientConfigAuth) {}

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

  isCacheValid(): boolean {
    if (
      this.tokenCache &&
      this.tokenCache.expiresAt > Date.now() + EXPIRATION_WINDOW
    ) {
      return true;
    }
  }

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
