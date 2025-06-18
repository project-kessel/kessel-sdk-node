/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface ResponsePagination {
  continuationToken?: string | undefined;
}

function createBaseResponsePagination(): ResponsePagination {
  return { continuationToken: "" };
}

export const ResponsePagination = {
  encode(
    message: ResponsePagination,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (
      message.continuationToken !== undefined &&
      message.continuationToken !== ""
    ) {
      writer.uint32(10).string(message.continuationToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResponsePagination {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResponsePagination();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.continuationToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ResponsePagination {
    return {
      continuationToken: isSet(object.continuationToken)
        ? globalThis.String(object.continuationToken)
        : "",
    };
  },

  toJSON(message: ResponsePagination): unknown {
    const obj: any = {};
    if (
      message.continuationToken !== undefined &&
      message.continuationToken !== ""
    ) {
      obj.continuationToken = message.continuationToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ResponsePagination>, I>>(
    base?: I,
  ): ResponsePagination {
    return ResponsePagination.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ResponsePagination>, I>>(
    object: I,
  ): ResponsePagination {
    const message = createBaseResponsePagination();
    message.continuationToken = object.continuationToken ?? "";
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
