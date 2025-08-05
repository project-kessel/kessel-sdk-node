import {
  ChannelCredentials,
  ChannelOptions,
  Client,
  ClientUnaryCall,
  credentials,
  Metadata,
  ServiceError,
  VerifyOptions,
} from "@grpc/grpc-js";
import { ServiceDefinition } from "@grpc/grpc-js/src/make-client";
import { promisify } from "util";
import { recognizedOptions } from "@grpc/grpc-js/src/channel-options";
import {
  ClientConfig,
  ClientConfigAuth,
  ClientConfigCredentials,
  ClientConfigKeepAlive,
  defaultCredentials,
  defaultKeepAlive,
  IncompleteKesselConfigurationError,
} from "../inventory";
import { SecureContext } from "node:tls";
import { OAuth2ClientCredentials } from "../auth";

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

/**
 * Type that represents a promisified version of a gRPC client.
 * Transforms callback-based methods into promise-based methods while preserving other properties.
 *
 * @template T - The original client type, defaults to Client
 */
export type PromisifiedClient<T = Client> = {
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
 * Type representing valid gRPC channel option keys.
 */
export type ValidChannelOption = keyof typeof recognizedOptions;

type ValidChannelOptionValue<T extends ValidChannelOption> = ChannelOptions[T];

export interface GRpcClientConfig extends ClientConfig {
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

export const oauth2CallCredentials = (auth: OAuth2ClientCredentials) => {
  return credentials.createFromMetadataGenerator(async (options, callback) => {
    const [token, ..._rest] = await auth.getToken();
    const metadata = new Metadata();
    metadata.add("Authorization", `Bearer ${token}`);
    callback(null, metadata);
  });
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
export abstract class GRpcClientBuilder<T> {
  protected _target: string | undefined;
  protected _credentials: ChannelCredentials | undefined;
  protected _auth?: ClientConfigAuth;
  protected readonly _channelOptions: ChannelOptions = {};

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

  /**
   * Protected constructor that initializes the builder with default configuration.
   * Can only be called by subclasses.
   */
  protected constructor() {
    this.withKeepAlive(defaultKeepAlive());
    this.withCredentialsConfig(defaultCredentials());
  }

  /**
   * Validates the current configuration and throws an error if required fields are missing.
   *
   * @throws {IncompleteKesselConfigurationError} If required configuration fields are missing
   */
  protected validate() {
    const missingFields: Array<string> = [];

    if (!this._target) {
      missingFields.push("target");
    }

    if (missingFields.length > 0) {
      throw new IncompleteKesselConfigurationError(missingFields);
    }
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
  public withTarget(target: string): this {
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
  public withCredentials(credentials: ChannelCredentials): this {
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
  public withInsecureCredentials(): this {
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
  ): this {
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
  ): this {
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
  public withCredentialsConfig(credentials: ClientConfigCredentials): this {
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
   * Configures OAuth 2.0 authentication for the client.
   *
   * @param auth - The OAuth configuration object
   * @returns The ClientBuilder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.withAuth({
   *   clientId: "your-client-id",
   *   clientSecret: "your-client-secret",
   *   issuerUrl: "https://auth.example.com/oauth2"
   * })
   * ```
   */
  public withAuth(auth: ClientConfigAuth): this {
    this._auth = auth;
    return this;
  }

  /**
   * Configures keep-alive settings for the gRPC connection.
   *
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
   * @param keepAliveConfig
   */
  public withKeepAlive(keepAliveConfig: Partial<ClientConfigKeepAlive>): this {
    const defaultKeepAliveConfig = defaultKeepAlive();
    keepAliveConfig = { ...defaultKeepAliveConfig, ...keepAliveConfig };
    this._channelOptions["grpc.keepalive_time_ms"] = keepAliveConfig.timeMs;
    this._channelOptions["grpc.keepalive_timeout_ms"] =
      keepAliveConfig.timeoutMs;
    this._channelOptions["grpc.keepalive_permit_without_calls"] =
      keepAliveConfig.permitWithoutCalls ? 1 : 0;
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
   * Configures the client builder using a configuration object.
   *
   * @param config - The configuration object containing all settings
   * @returns The ClientBuilder instance for method chaining
   *
   * @example
   * ```typescript
   * const config = {
   *   target: "localhost:9000",
   *   credentials: { type: "insecure" },
   *   keepAlive: { timeMs: 5000, timeoutMs: 2000 },
   *   channelOptions: {
   *     "grpc.max_receive_message_length": 4 * 1024 * 1024
   *   }
   * };
   * builder.withConfig(config)
   * ```
   */
  public withConfig(config: GRpcClientConfig): this {
    this.withTarget(config.target)
      .withKeepAlive(config.keepAlive)
      .withCredentialsConfig(config.credentials ?? defaultCredentials())
      .withAuth(config.auth);

    if (config.channelOptions) {
      (Object.keys(config.channelOptions) as ValidChannelOption[]).forEach(
        (name) => {
          this.withChannelOption(name, config.channelOptions[name]);
        },
      );
    }

    return this;
  }

  /**
   * Builds and returns a configured client instance.
   * This method must be implemented by concrete builder classes.
   *
   * @returns A configured client instance
   * @throws {IncompleteKesselConfigurationError} If required configuration is missing
   *
   * @example
   * ```typescript
   * const client = builder
   *   .withTarget("localhost:9000")
   *   .withInsecureCredentials()
   *   .build();
   * ```
   */
  public abstract build(): T;
}

/**
 * Interface for client builder classes that provide a static builder() method.
 *
 * @template T - The builder type
 */
export interface ClientBuilderInterface<T> {
  /**
   * Creates a new instance of the builder.
   *
   * @returns A new builder instance
   */
  builder(): T;
}

/**
 * Factory function that creates a client builder class for a specific gRPC service.
 *
 * @template T - The gRPC client type that extends Client
 * @param ctor - The constructor function for the gRPC client
 * @returns A class that extends GRpcClientBuilder with static builder() method
 *
 * @example
 * ```typescript
 * import { KesselInventoryServiceClient } from "./inventory_service";
 *
 * const ClientBuilder = ClientBuilderFactory(KesselInventoryServiceClient);
 * const client = ClientBuilder.builder()
 *   .withTarget("localhost:9000")
 *   .build();
 * ```
 */
export const ClientBuilderFactory = <T extends Client>(
  ctor: new (...args: ConstructorParameters<typeof Client>) => T,
): typeof GRpcClientBuilder<PromisifiedClient<T>> &
  ClientBuilderInterface<GRpcClientBuilder<PromisifiedClient<T>>> => {
  class ClientBuilder extends GRpcClientBuilder<PromisifiedClient<T>> {
    /**
     * Creates a new ClientBuilder instance with default configuration.
     * @returns A new ClientBuilder instance
     */
    public static builder() {
      return new this();
    }

    /**
     * Builds and returns a configured, promisified client.
     * @returns A promisified client instance ready for use with async/await
     */
    public build(): PromisifiedClient<T> {
      this.validate();

      let channelCredentials = this._credentials;

      if (this._auth) {
        channelCredentials = credentials.combineChannelCredentials(
          channelCredentials,
          oauth2CallCredentials(new OAuth2ClientCredentials(this._auth)),
        );
      }

      return promisifyClient(
        new ctor(this._target, channelCredentials, {
          ...this._channelOptions,
        }),
      );
    }
  }

  return ClientBuilder;
};
