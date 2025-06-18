/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface RepresentationMetadata {
  localResourceId?: string | undefined;
  apiHref?: string | undefined;
  consoleHref?: string | undefined;
  reporterVersion?: string | undefined;
}

function createBaseRepresentationMetadata(): RepresentationMetadata {
  return {
    localResourceId: "",
    apiHref: "",
    consoleHref: undefined,
    reporterVersion: undefined,
  };
}

export const RepresentationMetadata = {
  encode(
    message: RepresentationMetadata,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (
      message.localResourceId !== undefined &&
      message.localResourceId !== ""
    ) {
      writer.uint32(10).string(message.localResourceId);
    }
    if (message.apiHref !== undefined && message.apiHref !== "") {
      writer.uint32(18).string(message.apiHref);
    }
    if (message.consoleHref !== undefined) {
      writer.uint32(26).string(message.consoleHref);
    }
    if (message.reporterVersion !== undefined) {
      writer.uint32(34).string(message.reporterVersion);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): RepresentationMetadata {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRepresentationMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.localResourceId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.apiHref = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.consoleHref = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.reporterVersion = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RepresentationMetadata {
    return {
      localResourceId: isSet(object.localResourceId)
        ? globalThis.String(object.localResourceId)
        : "",
      apiHref: isSet(object.apiHref) ? globalThis.String(object.apiHref) : "",
      consoleHref: isSet(object.consoleHref)
        ? globalThis.String(object.consoleHref)
        : undefined,
      reporterVersion: isSet(object.reporterVersion)
        ? globalThis.String(object.reporterVersion)
        : undefined,
    };
  },

  toJSON(message: RepresentationMetadata): unknown {
    const obj: any = {};
    if (
      message.localResourceId !== undefined &&
      message.localResourceId !== ""
    ) {
      obj.localResourceId = message.localResourceId;
    }
    if (message.apiHref !== undefined && message.apiHref !== "") {
      obj.apiHref = message.apiHref;
    }
    if (message.consoleHref !== undefined) {
      obj.consoleHref = message.consoleHref;
    }
    if (message.reporterVersion !== undefined) {
      obj.reporterVersion = message.reporterVersion;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RepresentationMetadata>, I>>(
    base?: I,
  ): RepresentationMetadata {
    return RepresentationMetadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RepresentationMetadata>, I>>(
    object: I,
  ): RepresentationMetadata {
    const message = createBaseRepresentationMetadata();
    message.localResourceId = object.localResourceId ?? "";
    message.apiHref = object.apiHref ?? "";
    message.consoleHref = object.consoleHref ?? undefined;
    message.reporterVersion = object.reporterVersion ?? undefined;
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends globalThis.Array<infer U>
    ? globalThis.Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends {}
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
