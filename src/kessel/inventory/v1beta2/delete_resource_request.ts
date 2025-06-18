/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ResourceReference } from "./resource_reference";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface DeleteResourceRequest {
  reference?: ResourceReference | undefined;
}

function createBaseDeleteResourceRequest(): DeleteResourceRequest {
  return { reference: undefined };
}

export const DeleteResourceRequest = {
  encode(
    message: DeleteResourceRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.reference !== undefined) {
      ResourceReference.encode(
        message.reference,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): DeleteResourceRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteResourceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.reference = ResourceReference.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeleteResourceRequest {
    return {
      reference: isSet(object.reference)
        ? ResourceReference.fromJSON(object.reference)
        : undefined,
    };
  },

  toJSON(message: DeleteResourceRequest): unknown {
    const obj: any = {};
    if (message.reference !== undefined) {
      obj.reference = ResourceReference.toJSON(message.reference);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteResourceRequest>, I>>(
    base?: I,
  ): DeleteResourceRequest {
    return DeleteResourceRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeleteResourceRequest>, I>>(
    object: I,
  ): DeleteResourceRequest {
    const message = createBaseDeleteResourceRequest();
    message.reference =
      object.reference !== undefined && object.reference !== null
        ? ResourceReference.fromPartial(object.reference)
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
