/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Allowed, allowedFromJSON, allowedToJSON } from "./allowed";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface CheckForUpdateResponse {
  allowed?: Allowed | undefined;
}

function createBaseCheckForUpdateResponse(): CheckForUpdateResponse {
  return { allowed: 0 };
}

export const CheckForUpdateResponse = {
  encode(
    message: CheckForUpdateResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.allowed !== undefined && message.allowed !== 0) {
      writer.uint32(8).int32(message.allowed);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): CheckForUpdateResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckForUpdateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.allowed = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CheckForUpdateResponse {
    return {
      allowed: isSet(object.allowed) ? allowedFromJSON(object.allowed) : 0,
    };
  },

  toJSON(message: CheckForUpdateResponse): unknown {
    const obj: any = {};
    if (message.allowed !== undefined && message.allowed !== 0) {
      obj.allowed = allowedToJSON(message.allowed);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckForUpdateResponse>, I>>(
    base?: I,
  ): CheckForUpdateResponse {
    return CheckForUpdateResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CheckForUpdateResponse>, I>>(
    object: I,
  ): CheckForUpdateResponse {
    const message = createBaseCheckForUpdateResponse();
    message.allowed = object.allowed ?? 0;
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
