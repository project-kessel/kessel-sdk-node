/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ConsistencyToken } from "./consistency_token";
import { ResourceReference } from "./resource_reference";
import { ResponsePagination } from "./response_pagination";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface StreamedListObjectsResponse {
  object?: ResourceReference | undefined;
  pagination?: ResponsePagination | undefined;
  consistencyToken?: ConsistencyToken | undefined;
}

function createBaseStreamedListObjectsResponse(): StreamedListObjectsResponse {
  return {
    object: undefined,
    pagination: undefined,
    consistencyToken: undefined,
  };
}

export const StreamedListObjectsResponse = {
  encode(
    message: StreamedListObjectsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.object !== undefined) {
      ResourceReference.encode(
        message.object,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    if (message.pagination !== undefined) {
      ResponsePagination.encode(
        message.pagination,
        writer.uint32(18).fork(),
      ).ldelim();
    }
    if (message.consistencyToken !== undefined) {
      ConsistencyToken.encode(
        message.consistencyToken,
        writer.uint32(26).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): StreamedListObjectsResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamedListObjectsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.object = ResourceReference.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.pagination = ResponsePagination.decode(
            reader,
            reader.uint32(),
          );
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.consistencyToken = ConsistencyToken.decode(
            reader,
            reader.uint32(),
          );
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StreamedListObjectsResponse {
    return {
      object: isSet(object.object)
        ? ResourceReference.fromJSON(object.object)
        : undefined,
      pagination: isSet(object.pagination)
        ? ResponsePagination.fromJSON(object.pagination)
        : undefined,
      consistencyToken: isSet(object.consistencyToken)
        ? ConsistencyToken.fromJSON(object.consistencyToken)
        : undefined,
    };
  },

  toJSON(message: StreamedListObjectsResponse): unknown {
    const obj: any = {};
    if (message.object !== undefined) {
      obj.object = ResourceReference.toJSON(message.object);
    }
    if (message.pagination !== undefined) {
      obj.pagination = ResponsePagination.toJSON(message.pagination);
    }
    if (message.consistencyToken !== undefined) {
      obj.consistencyToken = ConsistencyToken.toJSON(message.consistencyToken);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamedListObjectsResponse>, I>>(
    base?: I,
  ): StreamedListObjectsResponse {
    return StreamedListObjectsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StreamedListObjectsResponse>, I>>(
    object: I,
  ): StreamedListObjectsResponse {
    const message = createBaseStreamedListObjectsResponse();
    message.object =
      object.object !== undefined && object.object !== null
        ? ResourceReference.fromPartial(object.object)
        : undefined;
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? ResponsePagination.fromPartial(object.pagination)
        : undefined;
    message.consistencyToken =
      object.consistencyToken !== undefined && object.consistencyToken !== null
        ? ConsistencyToken.fromPartial(object.consistencyToken)
        : undefined;
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
