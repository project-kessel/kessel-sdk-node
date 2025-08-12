import {
  CallCredentials,
  ChannelCredentials,
  Client,
  credentials,
} from "@grpc/grpc-js";
import { OAuth2ClientCredentials } from "../auth";
import { PromisifiedClient, promisifyClient } from "../../promisify";
import { oauth2CallCredentials } from "../grpc";

export abstract class ClientBuilder<T extends Client> {
  protected _target: string;
  protected _channelCredentials: ChannelCredentials | undefined;
  protected _callCredentials: CallCredentials | undefined;

  protected abstract get serviceConstructor(): new (
    ...args: ConstructorParameters<typeof Client>
  ) => T;

  public constructor(target: string) {
    this._target = target;
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

    return new this.serviceConstructor(this._target, clientCredentials);
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

export const ClientBuilderFactory = <T extends Client>(
  ctor: new (...args: ConstructorParameters<typeof Client>) => T,
): new (target: string) => ClientBuilder<T> => {
  return class extends ClientBuilder<T> {
    protected get serviceConstructor(): {
      new (...args: ConstructorParameters<typeof Client>): T;
    } {
      return ctor;
    }
  };
};
