/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Allowed, allowedFromJSON, allowedToJSON } from "./allowed";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface CheckResponse {
  allowed?: Allowed | undefined;
}

function createBaseCheckResponse(): CheckResponse {
  return { allowed: 0 };
}

export const CheckResponse = {
  encode(
    message: CheckResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.allowed !== undefined && message.allowed !== 0) {
      writer.uint32(8).int32(message.allowed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckResponse();
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

  fromJSON(object: any): CheckResponse {
    return {
      allowed: isSet(object.allowed) ? allowedFromJSON(object.allowed) : 0,
    };
  },

  toJSON(message: CheckResponse): unknown {
    const obj: any = {};
    if (message.allowed !== undefined && message.allowed !== 0) {
      obj.allowed = allowedToJSON(message.allowed);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckResponse>, I>>(
    base?: I,
  ): CheckResponse {
    return CheckResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CheckResponse>, I>>(
    object: I,
  ): CheckResponse {
    const message = createBaseCheckResponse();
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
