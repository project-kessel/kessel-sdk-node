/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface RequestPagination {
  limit?: number | undefined;
  continuationToken?: string | undefined;
}

function createBaseRequestPagination(): RequestPagination {
  return { limit: 0, continuationToken: undefined };
}

export const RequestPagination = {
  encode(
    message: RequestPagination,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.limit !== undefined && message.limit !== 0) {
      writer.uint32(8).uint32(message.limit);
    }
    if (message.continuationToken !== undefined) {
      writer.uint32(18).string(message.continuationToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestPagination {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestPagination();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.limit = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
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

  fromJSON(object: any): RequestPagination {
    return {
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      continuationToken: isSet(object.continuationToken)
        ? globalThis.String(object.continuationToken)
        : undefined,
    };
  },

  toJSON(message: RequestPagination): unknown {
    const obj: any = {};
    if (message.limit !== undefined && message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.continuationToken !== undefined) {
      obj.continuationToken = message.continuationToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RequestPagination>, I>>(
    base?: I,
  ): RequestPagination {
    return RequestPagination.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RequestPagination>, I>>(
    object: I,
  ): RequestPagination {
    const message = createBaseRequestPagination();
    message.limit = object.limit ?? 0;
    message.continuationToken = object.continuationToken ?? undefined;
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
