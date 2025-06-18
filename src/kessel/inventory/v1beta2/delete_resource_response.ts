/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface DeleteResourceResponse {}

function createBaseDeleteResourceResponse(): DeleteResourceResponse {
  return {};
}

export const DeleteResourceResponse = {
  encode(
    _: DeleteResourceResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): DeleteResourceResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteResourceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): DeleteResourceResponse {
    return {};
  },

  toJSON(_: DeleteResourceResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteResourceResponse>, I>>(
    base?: I,
  ): DeleteResourceResponse {
    return DeleteResourceResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeleteResourceResponse>, I>>(
    _: I,
  ): DeleteResourceResponse {
    const message = createBaseDeleteResourceResponse();
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
