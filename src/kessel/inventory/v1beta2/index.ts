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

export class IncompleteKesselConfigurationError extends Error {
  public constructor(fields: Array<string>) {
    super(
      `IncompleteKesselConfigurationError: Missing the following fields to build: ${fields.join(",")}`,
    );
  }
}

type ValidChannelOption = keyof typeof recognizedOptions;
type ValidChannelOptionValue<T extends ValidChannelOption> = ChannelOptions[T];

/**
 * Keep alive configuration
 */
export interface ClientConfigKeepAlive {
  /**
   * Time in milliseconds before pinging the server to check if it's alive - grpc.keepalive_time_ms.
   */
  timeMs: number | undefined;
  /**
   * Time in milliseconds before closing the connection - grpc.keepalive_timeout_ms.
   */
  timeoutMs: number | undefined;
  /**
   * Is it possible to send pings without any outstanding stream? - grpc.keepalive_permit_without_calls.
   */
  permitWithoutCalls: boolean | undefined;
}

/**
 * Credentials configuration.
 */
export type ClientConfigCredentials =
  | {
      /**
       * Does not use credentials.
       */
      type: "insecure";
    }
  | {
      /**
       * Uses SSL credentials.
       */
      type: "secure";
      /**
       * Contents of the root certificate.
       */
      rootCerts?: string;
      /**
       * Contents of the private certificate.
       */
      privateCerts?: string;
      /**
       * Contents of the Certificate chain.
       */
      certChain?: string;
      /**
       * If not false, the server certificate is verified against the list of supplied CAs. An 'error' event is emitted if verification fails. Default: true.
       */
      rejectUnauthorized?: boolean;
    };

/**
 * Convenience client configuration.
 */
export interface ClientConfig {
  /**
   * Specifies the host and port in the format `host:port` where the inventory gRPC service is running. e.g. localhost:9000.
   */
  target?: string;
  /**
   * Configures the credentials to communicate over the channel.
   */
  credentials?: ClientConfigCredentials;
  /**
   * Configures the keep-alive parameters
   */
  keepAlive?: Partial<ClientConfigKeepAlive>;
  /**
   * Additional channel options accepted by the underlying @grpc/grpc-js library
   */
  channelOptions?: Partial<{
    [Key in ValidChannelOption]: ValidChannelOptionValue<Key>;
  }>;
}

export const defaultKeepAlive = (): ClientConfigKeepAlive => {
  return {
    timeMs: 10000,
    timeoutMs: 5000,
    permitWithoutCalls: true,
  };
};

export const defaultCredentials = (): ChannelCredentials => {
  return ChannelCredentials.createSsl();
};

export class ClientBuilder {
  private _target: string | undefined;
  private _credentials: ChannelCredentials | undefined;
  private readonly _channelOptions: ChannelOptions;

  get target() {
    return this._target;
  }

  get credentials(): Readonly<ChannelCredentials> {
    return this._credentials;
  }

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

  public static builder(): ClientBuilder {
    return new ClientBuilder();
  }

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

  public withTarget(target: string): ClientBuilder {
    this._target = target;
    return this;
  }

  /**
   * @see ChannelCredentials.createSsl(), ChannelCredentials.createFromSecureContext() and ChannelCredentials.createInsecure()
   * @param credentials
   */
  public withCredentials(credentials: ChannelCredentials): ClientBuilder {
    this._credentials = credentials;
    return this;
  }

  public withInsecureCredentials(): ClientBuilder {
    this._credentials = ChannelCredentials.createInsecure();
    return this;
  }

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

  public withChannelOption<T extends ValidChannelOption>(
    option: T,
    value: ValidChannelOptionValue<T>,
  ) {
    this._channelOptions[option] = value;
    return this;
  }

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
