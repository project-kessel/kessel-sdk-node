import { KesselInventoryServiceClient } from "./inventory_service";
import {
  ChannelCredentials,
  ChannelOptions,
  Client,
  type ClientUnaryCall,
  type ServiceError,
  VerifyOptions,
} from "@grpc/grpc-js";
import { promisify } from "util";
import { ServiceDefinition } from "@grpc/grpc-js/src/make-client";
import { recognizedOptions } from "@grpc/grpc-js/src/channel-options";
import { SecureContext } from "node:tls";

interface CallbackClientMethod<
  TRequest = unknown,
  TResponse = unknown,
  TMetadata = unknown,
  TOptions = unknown,
> {
  (
    request: TRequest,
    callback: (error: ServiceError | null, response: TResponse) => void,
  ): ClientUnaryCall;
  (
    request: TRequest,
    metadata: TMetadata,
    callback: (error: ServiceError | null, response: TResponse) => void,
  ): ClientUnaryCall;
  (
    request: TRequest,
    metadata: TMetadata,
    options: TOptions,
    callback: (error: ServiceError | null, response: TResponse) => void,
  ): ClientUnaryCall;
}

interface PromisifiedClientMethod<
  TRequest = unknown,
  TResponse = unknown,
  TMetadata = unknown,
  TOptions = unknown,
> {
  (request: TRequest): Promise<TResponse>;
  (request: TRequest, metadata: TMetadata): Promise<TResponse>;
  (
    request: TRequest,
    metadata: TMetadata,
    options: TOptions,
  ): Promise<TResponse>;
}

type PromisifyClientMethod<T> =
  T extends CallbackClientMethod<
    infer TRequest,
    infer TResponse,
    infer TMetadata,
    infer TOptions
  >
    ? PromisifiedClientMethod<TRequest, TResponse, TMetadata, TOptions>
    : T;

// Loops every method of the client and runs PromisifyMethod on it
type PromisifiedClient<T = Client> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown
    ? PromisifyClientMethod<T[K]>
    : T[K];
};

const optionalBuffer = (content: string | undefined): Buffer | undefined => {
  if (content) {
    return Buffer.from(content, "utf-8");
  }

  return undefined;
};

/**
 * Converts a callback-based gRPC client to a Promise-based client.
 *
 * @template T - The client type to promisify
 * @param client - The gRPC client instance to promisify
 * @param serviceDefinition - Optional service definition. If not provided, will attempt to extract from client constructor
 * @returns A promisified version of the client where all unary methods return Promises instead of using callbacks
 * @throws {Error} When the client doesn't have a ServiceDefinition and one wasn't provided
 *
 * @example
 * ```typescript
 * import { KesselInventoryServiceClient } from "kessel-sdk/kessel/inventory/v1beta2/inventory_service";
 * import { credentials } from "@grpc/grpc-js";
 *
 * const client = new KesselInventoryServiceClient("localhost:9000", credentials.createInsecure());
 * const promisifiedClient = promisifyClient(client);
 *
 * // Now you can use async/await
 * const response = await promisifiedClient.check(request);
 * ```
 */
export const promisifyClient = <T extends Client>(
  client: T,
  serviceDefinition?: ServiceDefinition,
): PromisifiedClient<T> => {
  serviceDefinition =
    serviceDefinition ??
    ("service" in client.constructor
      ? (client.constructor.service as ServiceDefinition)
      : undefined);

  if (!serviceDefinition) {
    throw new Error(
      "Client does not have a ServiceDefinition and one was not provided",
    );
  }

  const promisifiedMethods: Partial<
    Record<keyof T, PromisifiedClientMethod<unknown, unknown, unknown, unknown>>
  > = {};

  const handler: ProxyHandler<T> = {
    get(target, prop, receiver) {
      if (typeof prop === "string" && prop in serviceDefinition) {
        const propT = prop as keyof T;
        // Streamed response are already async iterators
        if (!serviceDefinition[prop].responseStream) {
          if (!promisifiedMethods[propT]) {
            promisifiedMethods[propT] = promisify(
              (target[propT] as CallbackClientMethod).bind(target),
            ) as PromisifiedClientMethod;
          }

          return promisifiedMethods[propT];
        }
      }

      return Reflect.get(target, prop, receiver);
    },
  };

  return new Proxy(client, handler) as PromisifiedClient<T>;
};

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

type ValidChannelOption = keyof typeof recognizedOptions;
type ValidChannelOptionValue<T extends ValidChannelOption> = ChannelOptions[T];

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

  /**
   * Additional gRPC channel options supported by @grpc/grpc-js.
   *
   * @see {@link https://www.npmjs.com/package/@grpc/grpc-js#supported-channel-options}
   * @see {@link https://grpc.github.io/grpc/core/group__grpc__arg__keys.html}
   */
  channelOptions?: Partial<{
    [Key in ValidChannelOption]: ValidChannelOptionValue<Key>;
  }>;
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
export const defaultCredentials = (): ChannelCredentials => {
  return ChannelCredentials.createSsl();
};

/**
 * Builder class for creating configured Kessel Inventory Service clients.
 * Provides a fluent API for setting up gRPC client configuration and returns
 * a fully promisified client instance.
 *
 * @example
 * ```typescript
 * // Basic usage with insecure connection
 * const client = ClientBuilder.builder()
 *   .withTarget("localhost:9000")
 *   .withInsecureCredentials()
 *   .build();
 *
 * // Advanced usage with custom configuration
 * const client = ClientBuilder.builder()
 *   .withTarget("kessel-api.example.com:443")
 *   .withSecureCredentials()
 *   .withKeepAlive(15000, 10000, false)
 *   .withChannelOption('grpc.primary_user_agent', 'my-app/1.0.0')
 *   .build();
 *
 * // Using configuration object
 * const config: ClientConfig = {
 *   target: "localhost:9000",
 *   credentials: { type: "insecure" }
 * };
 * const client = ClientBuilder.builderFromConfig(config).build();
 * ```
 */
export class ClientBuilder {
  private _target: string | undefined;
  private _credentials: ChannelCredentials | undefined;
  private readonly _channelOptions: ChannelOptions;

  /**
   * Gets the currently configured target server address.
   *
   * @returns The target server address or undefined if not set
   */
  get target() {
    return this._target;
  }

  /**
   * Gets the currently configured channel credentials.
   *
   * @returns The configured credentials (readonly)
   */
  get credentials(): Readonly<ChannelCredentials> {
    return this._credentials;
  }

  /**
   * Gets the currently configured keep-alive settings.
   *
   * @returns The configured keep-alive options (readonly)
   */
  get keepAlive(): Readonly<ClientConfigKeepAlive> {
    return {
      timeMs: this._channelOptions["grpc.keepalive_time_ms"],
      timeoutMs: this._channelOptions["grpc.keepalive_timeout_ms"],
      permitWithoutCalls:
        this._channelOptions["grpc.keepalive_permit_without_calls"] !== 0,
    };
  }

  private constructor() {
    const _defaultKeepAlive = defaultKeepAlive();
    this._channelOptions = {
      "grpc.keepalive_time_ms": _defaultKeepAlive.timeMs,
      "grpc.keepalive_timeout_ms": _defaultKeepAlive.timeoutMs,
      "grpc.keepalive_permit_without_calls":
        _defaultKeepAlive.permitWithoutCalls ? 1 : 0,
    };
    this._credentials = defaultCredentials();
  }

  private validate() {
    const missingFields: Array<string> = [];

    if (!this._target) {
      missingFields.push("target");
    }

    if (missingFields.length > 0) {
      throw new IncompleteKesselConfigurationError(missingFields);
    }
  }

  /**
   * Creates a new ClientBuilder instance with default configuration.
   *
   * @returns A new ClientBuilder instance
   */
  public static builder(): ClientBuilder {
    return new ClientBuilder();
  }

  /**
   * Creates a new ClientBuilder instance from a configuration object.
   *
   * @param config - The client configuration object
   * @returns A new ClientBuilder instance configured with the provided settings
   *
   * @example
   * ```typescript
   * const config: ClientConfig = {
   *   target: "localhost:9000",
   *   credentials: { type: "insecure" },
   *   keepAlive: { timeMs: 15000, timeoutMs: 10000 }
   * };
   * const client = ClientBuilder.builderFromConfig(config).build();
   * ```
   */
  public static builderFromConfig(config: ClientConfig): ClientBuilder {
    const keepAlive = { ...defaultKeepAlive(), ...config.keepAlive };

    const builder = ClientBuilder.builder()
      .withTarget(config.target)
      .withKeepAlive(
        keepAlive.timeMs,
        keepAlive.timeoutMs,
        keepAlive.permitWithoutCalls,
      );

    if (config.credentials) {
      builder.withCredentialsConfig(config.credentials);
    } else {
      builder.withCredentials(defaultCredentials());
    }

    if (config.channelOptions) {
      (Object.keys(config.channelOptions) as ValidChannelOption[]).forEach(
        (name) => {
          builder.withChannelOption(name, config.channelOptions[name]);
        },
      );
    }

    return builder;
  }

  /**
   * Sets the target server address.
   *
   * @param target - The server address in `host:port` format
   * @returns The ClientBuilder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.withTarget("localhost:9000")
   * builder.withTarget("kessel-api.example.com:443")
   * ```
   */
  public withTarget(target: string): ClientBuilder {
    this._target = target;
    return this;
  }

  /**
   * Sets custom channel credentials.
   *
   * @param credentials - The ChannelCredentials instance
   * @returns The ClientBuilder instance for method chaining
   *
   * @see {@link https://grpc.github.io/grpc/node/grpc.ChannelCredentials.html}
   *
   * @example
   * ```typescript
   * import { ChannelCredentials } from "@grpc/grpc-js";
   *
   * builder.withCredentials(ChannelCredentials.createSsl())
   * builder.withCredentials(ChannelCredentials.createInsecure())
   * ```
   */
  public withCredentials(credentials: ChannelCredentials): ClientBuilder {
    this._credentials = credentials;
    return this;
  }

  /**
   * Configures the client to use insecure credentials (no TLS).
   * Use this for local development or when TLS is handled elsewhere.
   *
   * @returns The ClientBuilder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.withInsecureCredentials()
   * ```
   */
  public withInsecureCredentials(): ClientBuilder {
    this._credentials = ChannelCredentials.createInsecure();
    return this;
  }

  /**
   * Configures the client to use SSL/TLS credentials.
   *
   * @param rootCerts - Buffer containing PEM-encoded root certificates. If null, uses system defaults
   * @param privateCerts - Buffer containing PEM-encoded private key for client authentication
   * @param certChain - Buffer containing PEM-encoded certificate chain for client authentication
   * @param verifyOptions - Additional options for certificate verification
   * @returns The ClientBuilder instance for method chaining
   *
   * @example
   * ```typescript
   * // Use system default root certificates
   * builder.withSecureCredentials()
   *
   * // Use custom root certificate
   * const rootCert = Buffer.from(certPemString, 'utf8');
   * builder.withSecureCredentials(rootCert)
   *
   * // Client certificate authentication
   * const rootCert = Buffer.from(rootCertPem, 'utf8');
   * const privateKey = Buffer.from(privateKeyPem, 'utf8');
   * const certChain = Buffer.from(certChainPem, 'utf8');
   * builder.withSecureCredentials(rootCert, privateKey, certChain)
   * ```
   */
  public withSecureCredentials(
    rootCerts?: Buffer | null,
    privateCerts?: Buffer | null,
    certChain?: Buffer | null,
    verifyOptions?: VerifyOptions,
  ): ClientBuilder {
    this._credentials = ChannelCredentials.createSsl(
      rootCerts,
      privateCerts,
      certChain,
      verifyOptions,
    );
    return this;
  }

  /**
   * Configures the client to use credentials from a SecureContext.
   *
   * @param secureContext - The TLS SecureContext to use
   * @param verifyOptions - Additional options for certificate verification
   * @returns The ClientBuilder instance for method chaining
   *
   * @example
   * ```typescript
   * import { createSecureContext } from 'tls';
   *
   * const secureContext = createSecureContext({
   *   cert: certPemString,
   *   key: keyPemString,
   *   ca: caPemString
   * });
   * builder.withSecureContextCredentials(secureContext)
   * ```
   */
  public withSecureContextCredentials(
    secureContext: SecureContext,
    verifyOptions?: VerifyOptions,
  ): ClientBuilder {
    this._credentials = ChannelCredentials.createFromSecureContext(
      secureContext,
      verifyOptions,
    );
    return this;
  }

  /**
   * Configures credentials using a configuration object.
   *
   * @param credentials - The credentials configuration
   * @returns The ClientBuilder instance for method chaining
   *
   * @example
   * ```typescript
   * // Insecure credentials
   * builder.withCredentialsConfig({ type: "insecure" })
   *
   * // Secure credentials with custom certificates
   * builder.withCredentialsConfig({
   *   type: "secure",
   *   rootCerts: rootCertPemString,
   *   privateCerts: privateKeyPemString,
   *   certChain: certChainPemString,
   *   rejectUnauthorized: true
   * })
   * ```
   */
  public withCredentialsConfig(
    credentials: ClientConfigCredentials,
  ): ClientBuilder {
    switch (credentials.type) {
      case "insecure":
        this.withInsecureCredentials();
        break;
      case "secure":
        {
          const rootCerts = optionalBuffer(credentials.rootCerts);
          const privateCerts = optionalBuffer(credentials.privateCerts);
          const certChain = optionalBuffer(credentials.certChain);
          this.withSecureCredentials(rootCerts, privateCerts, certChain, {
            rejectUnauthorized: credentials.rejectUnauthorized,
          });
        }
        break;
    }

    return this;
  }

  /**
   * Configures keep-alive settings for the gRPC connection.
   *
   * @param timeMs - Time in milliseconds before sending keepalive pings
   * @param timeoutMs - Time in milliseconds to wait for keepalive ping response
   * @param permitWithoutCalls - Whether to send pings even when there are no active calls
   * @returns The ClientBuilder instance for method chaining
   *
   * @example
   * ```typescript
   * // Custom keep-alive settings
   * builder.withKeepAlive(15000, 10000, false)
   *
   * // More aggressive keep-alive for unreliable networks
   * builder.withKeepAlive(5000, 2000, true)
   * ```
   */
  public withKeepAlive(
    timeMs: number,
    timeoutMs: number,
    permitWithoutCalls: boolean,
  ): ClientBuilder {
    this._channelOptions["grpc.keepalive_time_ms"] = timeMs;
    this._channelOptions["grpc.keepalive_timeout_ms"] = timeoutMs;
    this._channelOptions["grpc.keepalive_permit_without_calls"] =
      permitWithoutCalls ? 1 : 0;
    return this;
  }

  /**
   * Sets a custom gRPC channel option.
   *
   * @template T - The channel option key type
   * @param option - The channel option name
   * @param value - The channel option value
   * @returns The ClientBuilder instance for method chaining
   *
   * @see {@link https://grpc.github.io/grpc/core/group__grpc__arg__keys.html}
   *
   * @example
   * ```typescript
   * // Set custom user agent
   * builder.withChannelOption('grpc.primary_user_agent', 'my-app/1.0.0')
   *
   * // Set maximum message size
   * builder.withChannelOption('grpc.max_receive_message_length', 4 * 1024 * 1024)
   * ```
   */
  public withChannelOption<T extends ValidChannelOption>(
    option: T,
    value: ValidChannelOptionValue<T>,
  ) {
    this._channelOptions[option] = value;
    return this;
  }

  /**
   * Builds and returns a configured, promisified Kessel Inventory Service client.
   *
   * @returns A promisified client instance ready for use with async/await
   * @throws {IncompleteKesselConfigurationError} When required configuration is missing (e.g., target)
   *
   * @example
   * ```typescript
   * const client = ClientBuilder.builder()
   *   .withTarget("localhost:9000")
   *   .withInsecureCredentials()
   *   .build();
   *
   * // All methods return promises
   * const response = await client.check(request);
   * ```
   */
  public build(): PromisifiedClient<KesselInventoryServiceClient> {
    this.validate();

    return promisifyClient(
      new KesselInventoryServiceClient(
        this._target,
        this._credentials,
        this._channelOptions,
      ),
    );
  }
}
