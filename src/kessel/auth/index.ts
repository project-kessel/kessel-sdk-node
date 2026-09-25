import { inspect } from "util";

import type * as oauth from "oauth4webapi";

const EXPIRATION_WINDOW_MILLI = 300000; // 5 minutes in milliseconds
const DEFAULT_EXPIRE_IN_SECONDS = 3600; // 1 hour in seconds
const REQUEST_TIMEOUT_MS = 30_000; // 30 seconds per-attempt timeout

// Node.js setTimeout fires immediately for values > 2^31-1 ms ≈ 2,147,483,647 ms.
// Clamp retry delays to this safe maximum to prevent silent misbehavior.
const MAX_SAFE_DELAY_SECONDS = 2_147_483;

interface RefreshTokenResponse {
  accessToken: string;
  expiresAt: Date;
}

/**
 * Configuration for bounded retries on transient OAuth token endpoint failures.
 *
 * Retry behavior is applied only while obtaining a token, not to arbitrary API
 * calls or OIDC discovery. Implementations preserve thread-safe token caching
 * and coalesce concurrent refresh attempts.
 */
export interface RetryOptions {
  /** Maximum number of retries after the initial request (default: 3; 0 disables retries). */
  maxRetries?: number;
  /** Initial exponential backoff delay in seconds (default: 0.5). */
  baseDelay?: number;
  /** Maximum exponential backoff delay in seconds (default: 2.0). */
  maxDelay?: number;
  /** Jitter mode: `"full"` randomizes delay between 0 and the computed cap; `"none"` uses the cap as-is (default: `"full"`). */
  jitter?: "full" | "none";
}

/**
 * Default retry options applied when no explicit configuration is provided.
 * 3 retries with full-jitter exponential backoff capped at 0.5, 1, and 2 seconds.
 */
export const DEFAULT_RETRY_OPTIONS: Readonly<Required<RetryOptions>> =
  Object.freeze({
    maxRetries: 3,
    baseDelay: 0.5,
    maxDelay: 2.0,
    jitter: "full" as const,
  });

// Use constructor-name checks rather than instanceof — Node's fetch (undici)
// may construct errors in a different V8 context, causing instanceof to
// return false even for standard built-in types like TypeError and DOMException.
const errorName = (error: unknown): string | undefined =>
  error != null && typeof error === "object" && "constructor" in error
    ? (error as { constructor: { name: string } }).constructor.name
    : undefined;

const isAbortError = (error: unknown): boolean =>
  errorName(error) === "DOMException" &&
  (error as { name?: string }).name === "AbortError";

const isTimeoutError = (error: unknown): boolean =>
  errorName(error) === "DOMException" &&
  (error as { name?: string }).name === "TimeoutError";

const isRetryableConnectionError = (error: unknown): boolean => {
  if (errorName(error) !== "TypeError") return false;
  if (error == null || typeof error !== "object") return false;
  // Only TypeErrors with a defined `cause` are transport/network errors from
  // fetch (e.g., TypeError: fetch failed { cause: Error: ECONNREFUSED }).
  // `"cause" in error` alone is insufficient: oauth4webapi may set `cause`
  // to undefined on argument/configuration TypeErrors (e.g., empty client ID).
  // Those must not be retried — they consume the budget without sending a
  // request.  Require the cause to be actually defined.
  return "cause" in error && (error as { cause: unknown }).cause !== undefined;
};

const isRetryableStatus = (status: number): boolean =>
  status === 429 || (status >= 500 && status <= 599);

/**
 * Check whether an error wraps a retryable transport or timeout failure
 * in its cause chain.  oauth4webapi wraps mid-body transport failures as
 * OperationProcessingError (OAUTH_PARSE_ERROR) with a nested TypeError
 * (UND_ERR_SOCKET) or TimeoutError cause.  Malformed JSON, OAuth validation
 * errors, missing tokens, and caller cancellation are NOT retryable.
 */
const hasRetryableTransportCause = (error: unknown): boolean => {
  if (error == null || typeof error !== "object") return false;
  const cause = (error as { cause?: unknown }).cause;
  if (cause === undefined) return false;
  return isRetryableConnectionError(cause) || isTimeoutError(cause);
};

const retryDelay = (
  retryIndex: number,
  options: Readonly<Required<RetryOptions>>,
): number => {
  // Cap exponent at 30 to prevent overflow with large retryIndex values
  const cap = Math.min(
    options.maxDelay,
    options.baseDelay * Math.pow(2, Math.min(retryIndex, 30)),
  );
  const delay = options.jitter === "full" ? Math.random() * cap : cap;
  // Clamp to MAX_SAFE_DELAY_SECONDS — values above Node's 2^31-1 ms timer
  // limit would cause setTimeout to fire almost immediately.
  return Math.min(delay, MAX_SAFE_DELAY_SECONDS);
};

export interface ClientConfigAuth {
  /**
   * The OAuth client identifier.
   */
  clientId: string;

  /**
   * The OAuth client secret.
   */
  clientSecret: string;

  /**
   * The OAuth issuer URL for discovery.
   * Should be the base URL of the OAuth provider.
   *
   * @example "https://auth.example.com"
   * @example "https://sso.server/auth/realms/my-realm"
   */
  tokenEndpoint: string;
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
 * // Get a token (returns RefreshTokenResponse object)
 * const tokenResponse = await authClient.getToken();
 * console.log(`Token: ${tokenResponse.accessToken}, expires at: ${tokenResponse.expiresAt}`);
 * ```
 */
export class OAuth2ClientCredentials {
  readonly #auth: ClientConfigAuth;
  readonly #retry: Readonly<Required<RetryOptions>>;
  private tokenCache?: RefreshTokenResponse;
  private pendingRefresh: Promise<Readonly<RefreshTokenResponse>> | null = null;
  private refreshGeneration = 0;
  private lastRefreshError: { generation: number; error: unknown } | null =
    null;
  private authServer: oauth.AuthorizationServer;
  private initialized: boolean = false;
  private ClientSecretPost: typeof oauth.ClientSecretPost;
  private clientCredentialsGrantRequest: typeof oauth.clientCredentialsGrantRequest;
  private processClientCredentialsResponse: typeof oauth.processClientCredentialsResponse;

  /**
   * The OAuth configuration.
   *
   * The accessor returns the live config object so callers can read
   * `clientId`, `clientSecret`, and `tokenEndpoint` directly.
   * Because `auth` is a prototype getter (not an own enumerable property),
   * it is excluded from object spread (`{...credentials}`) and
   * `Object.keys()`.
   */
  get auth(): ClientConfigAuth {
    return this.#auth;
  }

  /**
   * Creates a new OAuth2ClientCredentials instance.
   *
   * Token endpoint requests retry transient connection and timeout errors,
   * HTTP 429 responses, and HTTP 5xx responses with bounded exponential
   * backoff and jitter. Other errors are returned without retrying.
   *
   * @param auth - The OAuth configuration object containing clientId, clientSecret, and tokenEndpoint
   * @param retry - Optional retry policy for token endpoint requests. Defaults to 3 retries with full-jitter exponential backoff capped at 0.5, 1, and 2 seconds. Set `maxRetries` to 0 to disable retries.
   */
  constructor(auth: ClientConfigAuth, retry?: RetryOptions) {
    this.#auth = auth;

    const maxRetries = retry?.maxRetries ?? DEFAULT_RETRY_OPTIONS.maxRetries;
    const baseDelay = retry?.baseDelay ?? DEFAULT_RETRY_OPTIONS.baseDelay;
    const maxDelay = retry?.maxDelay ?? DEFAULT_RETRY_OPTIONS.maxDelay;
    const jitter = retry?.jitter ?? DEFAULT_RETRY_OPTIONS.jitter;

    if (!Number.isInteger(maxRetries) || maxRetries < 0) {
      throw new RangeError("maxRetries must be a non-negative integer");
    }
    if (!Number.isFinite(baseDelay) || baseDelay < 0) {
      throw new RangeError("baseDelay must be a finite non-negative number");
    }
    if (!Number.isFinite(maxDelay) || maxDelay < 0) {
      throw new RangeError("maxDelay must be a finite non-negative number");
    }

    this.#retry = Object.freeze({ maxRetries, baseDelay, maxDelay, jitter });
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
      this.tokenCache.expiresAt.getTime() > Date.now() + EXPIRATION_WINDOW_MILLI
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
   * Uses Promise coalescing to ensure concurrent callers that all observe a
   * stale token coalesce into a single OAuth token request, preventing
   * thundering herd floods against the SSO server.
   *
   * When a coalesced refresh fails terminally (after exhausting retries), all
   * callers that were waiting on that refresh share the same failure — they do
   * not each start an independent retry cycle. A genuinely later caller (one
   * that arrives after the failure) can start a fresh refresh attempt. This
   * mirrors the Ruby SDK's generation-tracking approach and bounds total token
   * requests to at most one full retry cycle per failure event.
   *
   * @param forceRefresh - If true, bypasses cache and forces a new token request
   * @returns A promise that resolves to a RefreshTokenResponse object containing accessToken and expiresAt
   * @throws {Error} If token retrieval fails
   */
  async getToken(forceRefresh: boolean = false): Promise<RefreshTokenResponse> {
    await this.ensureIsInitialized();

    if (!forceRefresh && this.isCacheValid()) {
      return this.tokenCache;
    }

    // Record the generation when this caller observed a stale/missing token.
    // All callers with the same generation share one terminal outcome.
    const callerGeneration = this.refreshGeneration;

    while (this.pendingRefresh) {
      try {
        await this.pendingRefresh;
        return this.tokenCache;
      } catch {
        // If our generation recorded a terminal failure, share it with the
        // cohort rather than letting each waiter start an independent retry
        // cycle. A later generation can start a fresh refresh attempt.
        if (this.lastRefreshError?.generation === callerGeneration) {
          throw this.lastRefreshError.error;
        }
        // Generation advanced without a failure for our cohort, or a new
        // refresh is already in flight — loop to coalesce onto it.
      }
    }

    this.pendingRefresh = this.refresh();
    try {
      this.tokenCache = await this.pendingRefresh;
      this.lastRefreshError = null;
      this.refreshGeneration++;
      return this.tokenCache;
    } catch (error) {
      this.lastRefreshError = { generation: callerGeneration, error };
      this.refreshGeneration++;
      throw error;
    } finally {
      this.pendingRefresh = null;
    }
  }

  /**
   * Returns a JSON-safe representation with `clientSecret` redacted.
   *
   * Called automatically by `JSON.stringify()`.
   */
  toJSON(): Record<string, unknown> {
    return {
      auth: {
        clientId: this.#auth.clientId,
        clientSecret: "[REDACTED]",
        tokenEndpoint: this.#auth.tokenEndpoint,
      },
    };
  }

  /**
   * Returns a string representation with `clientSecret` redacted.
   *
   * Called automatically by `String()` and string interpolation.
   */
  toString(): string {
    return JSON.stringify(this.toJSON());
  }

  /**
   * Custom inspect for `console.log()` and `util.inspect()`.
   *
   * Redacts `clientSecret` so secrets are not leaked in logs.
   */
  [inspect.custom](): Record<string, unknown> {
    return this.toJSON();
  }

  private async refresh(): Promise<Readonly<RefreshTokenResponse>> {
    const client: oauth.Client = { client_id: this.auth.clientId };
    const clientAuth = this.ClientSecretPost(this.auth.clientSecret);
    const parameters = new URLSearchParams();

    for (let attempt = 0; attempt <= this.#retry.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = retryDelay(attempt - 1, this.#retry);
        await new Promise<void>((resolve) => setTimeout(resolve, delay * 1000));
      }

      const canRetry = attempt < this.#retry.maxRetries;
      let response: Response;

      try {
        response = await this.clientCredentialsGrantRequest(
          this.authServer,
          client,
          clientAuth,
          parameters,
          { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
        );
      } catch (error) {
        // Caller cancellation (AbortError) is never retried
        if (isAbortError(error)) throw error;
        // Per-attempt timeout (TimeoutError) is retryable
        if (isTimeoutError(error)) {
          if (canRetry) continue;
          throw error;
        }
        // Connection/network errors (TypeError from fetch) are retryable
        if (canRetry && isRetryableConnectionError(error)) continue;
        throw error;
      }

      // Check HTTP status before processing — oauth4webapi may convert
      // server errors into opaque exceptions that lose the status code
      if (isRetryableStatus(response.status)) {
        await response.body?.cancel().catch(() => {});
        if (canRetry) continue;
        throw new Error(`Token endpoint returned HTTP ${response.status}`);
      }

      // Non-retryable status (2xx, 4xx) — process normally.
      // Wrap response processing so that genuine transport/timeout errors
      // during body reads are retried, while permanent failures (malformed
      // JSON, missing tokens, caller cancellation) propagate immediately.
      let result: Awaited<
        ReturnType<typeof this.processClientCredentialsResponse>
      >;
      try {
        result = await this.processClientCredentialsResponse(
          this.authServer,
          client,
          response,
        );
      } catch (error) {
        if (isAbortError(error)) throw error;
        if (isTimeoutError(error)) {
          if (canRetry) continue;
          throw error;
        }
        if (canRetry && isRetryableConnectionError(error)) continue;
        // Wrapped transport/timeout errors: oauth4webapi wraps mid-body
        // failures as OperationProcessingError with a nested TypeError or
        // TimeoutError cause.  Retry genuine transport failures; let
        // malformed JSON, OAuth validation, and cancellation propagate.
        if (canRetry && hasRetryableTransportCause(error)) continue;
        throw error;
      }

      if (!result.access_token) {
        throw new Error("No access token received from OAuth server");
      }

      // Handle missing or invalid expires_in - default to 1 hour if not provided
      // Note: expires_in of 0 is valid and means "immediately expired"
      const expiresIn =
        typeof result.expires_in === "number" && result.expires_in >= 0
          ? result.expires_in
          : DEFAULT_EXPIRE_IN_SECONDS;

      return Object.freeze({
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        accessToken: result.access_token,
      });
    }

    // Unreachable with maxRetries >= 0, but satisfies TypeScript
    throw new Error("Token request failed");
  }
}

export interface AuthRequest {
  configureRequest: (request: Request) => Promise<void>;
}

export const oauth2AuthRequest = (
  credentials: OAuth2ClientCredentials,
): AuthRequest => {
  return {
    configureRequest: async (request) => {
      const token = await credentials.getToken();
      request.headers.set("authorization", `Bearer ${token.accessToken}`);
    },
  };
};
