/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Struct } from "../../../google/protobuf/struct";
import { RepresentationMetadata } from "./representation_metadata";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface ResourceRepresentations {
  metadata?: RepresentationMetadata | undefined;
  common?: { [key: string]: any } | undefined;
  reporter?: { [key: string]: any } | undefined;
}

function createBaseResourceRepresentations(): ResourceRepresentations {
  return { metadata: undefined, common: undefined, reporter: undefined };
}

export const ResourceRepresentations = {
  encode(
    message: ResourceRepresentations,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.metadata !== undefined) {
      RepresentationMetadata.encode(
        message.metadata,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    if (message.common !== undefined) {
      Struct.encode(
        Struct.wrap(message.common),
        writer.uint32(18).fork(),
      ).ldelim();
    }
    if (message.reporter !== undefined) {
      Struct.encode(
        Struct.wrap(message.reporter),
        writer.uint32(26).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): ResourceRepresentations {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResourceRepresentations();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.metadata = RepresentationMetadata.decode(
            reader,
            reader.uint32(),
          );
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.common = Struct.unwrap(
            Struct.decode(reader, reader.uint32()),
          );
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.reporter = Struct.unwrap(
            Struct.decode(reader, reader.uint32()),
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

  fromJSON(object: any): ResourceRepresentations {
    return {
      metadata: isSet(object.metadata)
        ? RepresentationMetadata.fromJSON(object.metadata)
        : undefined,
      common: isObject(object.common) ? object.common : undefined,
      reporter: isObject(object.reporter) ? object.reporter : undefined,
    };
  },

  toJSON(message: ResourceRepresentations): unknown {
    const obj: any = {};
    if (message.metadata !== undefined) {
      obj.metadata = RepresentationMetadata.toJSON(message.metadata);
    }
    if (message.common !== undefined) {
      obj.common = message.common;
    }
    if (message.reporter !== undefined) {
      obj.reporter = message.reporter;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ResourceRepresentations>, I>>(
    base?: I,
  ): ResourceRepresentations {
    return ResourceRepresentations.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ResourceRepresentations>, I>>(
    object: I,
  ): ResourceRepresentations {
    const message = createBaseResourceRepresentations();
    message.metadata =
      object.metadata !== undefined && object.metadata !== null
        ? RepresentationMetadata.fromPartial(object.metadata)
        : undefined;
    message.common = object.common ?? undefined;
    message.reporter = object.reporter ?? undefined;
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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
