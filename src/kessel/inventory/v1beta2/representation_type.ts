/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface RepresentationType {
  resourceType?: string | undefined;
  reporterType?: string | undefined;
}

function createBaseRepresentationType(): RepresentationType {
  return { resourceType: "", reporterType: undefined };
}

export const RepresentationType = {
  encode(
    message: RepresentationType,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.resourceType !== undefined && message.resourceType !== "") {
      writer.uint32(10).string(message.resourceType);
    }
    if (message.reporterType !== undefined) {
      writer.uint32(18).string(message.reporterType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RepresentationType {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRepresentationType();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.resourceType = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.reporterType = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RepresentationType {
    return {
      resourceType: isSet(object.resourceType)
        ? globalThis.String(object.resourceType)
        : "",
      reporterType: isSet(object.reporterType)
        ? globalThis.String(object.reporterType)
        : undefined,
    };
  },

  toJSON(message: RepresentationType): unknown {
    const obj: any = {};
    if (message.resourceType !== undefined && message.resourceType !== "") {
      obj.resourceType = message.resourceType;
    }
    if (message.reporterType !== undefined) {
      obj.reporterType = message.reporterType;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RepresentationType>, I>>(
    base?: I,
  ): RepresentationType {
    return RepresentationType.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RepresentationType>, I>>(
    object: I,
  ): RepresentationType {
    const message = createBaseRepresentationType();
    message.resourceType = object.resourceType ?? "";
    message.reporterType = object.reporterType ?? undefined;
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
