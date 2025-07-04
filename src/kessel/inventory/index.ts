/**
 * Error thrown when required configuration fields are missing during client building.
 */
export class IncompleteKesselConfigurationError extends Error {
  /**
   * Creates a new IncompleteKesselConfigurationError.
   *
   * @param fields - Array of missing field names
   */
  public constructor(fields: Array<string>) {
    super(
      `IncompleteKesselConfigurationError: Missing the following fields to build: ${fields.join(",")}`,
    );
  }
}

/**
 * Configuration options for gRPC keep-alive behavior.
 */
export interface ClientConfigKeepAlive {
  /**
   * Time in milliseconds before pinging the server to check if it's alive.
   * Corresponds to the gRPC option `grpc.keepalive_time_ms`.
   *
   * @default 10000
   */
  timeMs: number | undefined;

  /**
   * Time in milliseconds to wait for a keepalive ping response before closing the connection.
   * Corresponds to the gRPC option `grpc.keepalive_timeout_ms`.
   *
   * @default 5000
   */
  timeoutMs: number | undefined;

  /**
   * Whether to send keepalive pings even when there are no outstanding streams.
   * Corresponds to the gRPC option `grpc.keepalive_permit_without_calls`.
   *
   * @default true
   */
  permitWithoutCalls: boolean | undefined;
}

/**
 * Configuration for gRPC channel credentials.
 */
export type ClientConfigCredentials =
  | {
      /**
       * Use insecure credentials (no TLS).
       */
      type: "insecure";
    }
  | {
      /**
       * Use secure SSL/TLS credentials.
       */
      type: "secure";

      /**
       * PEM-encoded root certificate(s) for verifying the server.
       * If not provided, uses system default root certificates.
       */
      rootCerts?: string;

      /**
       * PEM-encoded private key for client certificate authentication.
       */
      privateCerts?: string;

      /**
       * PEM-encoded certificate chain for client certificate authentication.
       */
      certChain?: string;

      /**
       * Whether to verify the server certificate against the list of supplied CAs.
       *
       * @default true
       */
      rejectUnauthorized?: boolean;
    };

/**
 * Complete configuration object for creating a Kessel Inventory Service client.
 */
export interface ClientConfig {
  /**
   * The server address in the format `host:port`.
   *
   * @example "localhost:9000"
   * @example "kessel-api.example.com:443"
   */
  target?: string;

  /**
   * Credentials configuration for the gRPC channel.
   * If not specified, defaults to secure SSL credentials.
   */
  credentials?: ClientConfigCredentials;

  /**
   * Keep-alive configuration options.
   * If not specified, uses default keep-alive settings.
   */
  keepAlive?: Partial<ClientConfigKeepAlive>;
}

/**
 * Returns the default keep-alive configuration.
 *
 * @returns Default keep-alive settings with 10s ping interval, 5s timeout, and permits without calls
 */
export const defaultKeepAlive = (): ClientConfigKeepAlive => {
  return {
    timeMs: 10000,
    timeoutMs: 5000,
    permitWithoutCalls: true,
  };
};

/**
 * Returns the default channel credentials (secure SSL).
 *
 * @returns SSL credentials using system default root certificates
 */
export const defaultCredentials = (): ClientConfigCredentials => {
  return {
    type: "secure",
  };
};
