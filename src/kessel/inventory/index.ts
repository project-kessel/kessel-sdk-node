import {
  CallCredentials,
  ChannelCredentials,
  Client,
  credentials,
} from "@grpc/grpc-js";
import { OAuth2ClientCredentials } from "../auth";
import { PromisifiedClient, promisifyClient } from "../../promisify";
import { oauth2CallCredentials } from "../grpc";

/**
 * gRPC keepalive channel settings. `interval` and `timeout` are milliseconds.
 */
export interface KeepaliveOptions {
  /** Ping interval in milliseconds. Defaults to 45,000. */
  interval?: number;
  /** Ping acknowledgement timeout in milliseconds. Defaults to 10,000. */
  timeout?: number;
  /** Whether to send keepalive pings without active calls. Defaults to true. */
  permitWithoutCalls?: boolean;
}

const DEFAULT_KEEPALIVE_INTERVAL_MS = 45_000;
const DEFAULT_KEEPALIVE_TIMEOUT_MS = 10_000;
const MAX_KEEPALIVE_DURATION_MS = 2_147_483_647;

function validateKeepaliveDuration(
  field: "interval" | "timeout",
  value: number | undefined,
): void {
  if (value === undefined) {
    return;
  }

  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > MAX_KEEPALIVE_DURATION_MS
  ) {
    throw new Error(
      `Invalid keepalive ${field}: expected a finite integer between 1 and ${MAX_KEEPALIVE_DURATION_MS} milliseconds`,
    );
  }
}

export abstract class ClientBuilder<T extends Client> {
  protected _target: string;
  protected _channelCredentials: ChannelCredentials | undefined;
  protected _callCredentials: CallCredentials | undefined;
  private _keepaliveOptions: Required<KeepaliveOptions> = {
    interval: DEFAULT_KEEPALIVE_INTERVAL_MS,
    timeout: DEFAULT_KEEPALIVE_TIMEOUT_MS,
    permitWithoutCalls: true,
  };

  protected abstract get stubConstructor(): new (
    ...args: ConstructorParameters<typeof Client>
  ) => T;

  public constructor(target: string) {
    this._target = target;

    if (!this._target || typeof this._target !== "string") {
      throw new Error("Invalid target type");
    }
  }

  public oauth2ClientAuthenticated(
    oauth2ClientCredentials: OAuth2ClientCredentials,
    channelCredentials?: ChannelCredentials,
  ): this {
    this._callCredentials = oauth2CallCredentials(oauth2ClientCredentials);
    this._channelCredentials = channelCredentials;
    this.validateCredentials();
    return this;
  }

  public authenticated(
    callCredentials?: CallCredentials,
    channelCredentials?: ChannelCredentials,
  ): this {
    this._callCredentials = callCredentials;
    this._channelCredentials = channelCredentials;
    this.validateCredentials();
    return this;
  }

  public unauthenticated(channelCredentials?: ChannelCredentials): this {
    this._callCredentials = undefined;
    this._channelCredentials = channelCredentials;
    this.validateCredentials();
    return this;
  }

  public insecure(): this {
    this._callCredentials = undefined;
    this._channelCredentials = credentials.createInsecure();
    this.validateCredentials();
    return this;
  }

  public keepalive(options: KeepaliveOptions = {}): this {
    if (
      options === null ||
      typeof options !== "object" ||
      Array.isArray(options)
    ) {
      throw new Error("Invalid keepalive options: expected an object");
    }

    const { interval, timeout, permitWithoutCalls } = options;

    validateKeepaliveDuration("interval", interval);
    validateKeepaliveDuration("timeout", timeout);

    if (
      permitWithoutCalls !== undefined &&
      typeof permitWithoutCalls !== "boolean"
    ) {
      throw new Error(
        "Invalid keepalive permitWithoutCalls: expected a boolean",
      );
    }

    // Validate every supplied value before changing any builder state.
    if (interval !== undefined) {
      this._keepaliveOptions.interval = interval;
    }
    if (timeout !== undefined) {
      this._keepaliveOptions.timeout = timeout;
    }
    if (permitWithoutCalls !== undefined) {
      this._keepaliveOptions.permitWithoutCalls = permitWithoutCalls;
    }

    return this;
  }

  public build(): T {
    if (!this._channelCredentials) {
      this._channelCredentials = credentials.createSsl();
    }

    let clientCredentials = this._channelCredentials;
    if (this._callCredentials) {
      clientCredentials = credentials.combineChannelCredentials(
        this._channelCredentials,
        this._callCredentials,
      );
    }

    return new this.stubConstructor(this._target, clientCredentials, {
      "grpc.keepalive_time_ms": this._keepaliveOptions.interval,
      "grpc.keepalive_timeout_ms": this._keepaliveOptions.timeout,
      "grpc.keepalive_permit_without_calls": this._keepaliveOptions
        .permitWithoutCalls
        ? 1
        : 0,
    });
  }

  public buildAsync(): PromisifiedClient<T> {
    return promisifyClient(this.build());
  }

  private validateCredentials() {
    if (
      this._channelCredentials &&
      !this._channelCredentials._isSecure() &&
      this._callCredentials
    ) {
      throw new Error(
        "Invalid credential configuration: can not authenticate with insecure channel",
      );
    }
  }
}

export const clientBuilderForStub = <T extends Client>(
  stubConstructor: new (...args: ConstructorParameters<typeof Client>) => T,
): new (target: string) => ClientBuilder<T> => {
  return class extends ClientBuilder<T> {
    protected get stubConstructor(): {
      new (...args: ConstructorParameters<typeof Client>): T;
    } {
      return stubConstructor;
    }
  };
};
