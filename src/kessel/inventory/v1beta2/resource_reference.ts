/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ReporterReference } from "./reporter_reference";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface ResourceReference {
  resourceType?: string | undefined;
  resourceId?: string | undefined;
  reporter?: ReporterReference | undefined;
}

function createBaseResourceReference(): ResourceReference {
  return { resourceType: "", resourceId: "", reporter: undefined };
}

export const ResourceReference = {
  encode(
    message: ResourceReference,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.resourceType !== undefined && message.resourceType !== "") {
      writer.uint32(10).string(message.resourceType);
    }
    if (message.resourceId !== undefined && message.resourceId !== "") {
      writer.uint32(18).string(message.resourceId);
    }
    if (message.reporter !== undefined) {
      ReporterReference.encode(
        message.reporter,
        writer.uint32(26).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResourceReference {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResourceReference();
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

          message.resourceId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.reporter = ReporterReference.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ResourceReference {
    return {
      resourceType: isSet(object.resourceType)
        ? globalThis.String(object.resourceType)
        : "",
      resourceId: isSet(object.resourceId)
        ? globalThis.String(object.resourceId)
        : "",
      reporter: isSet(object.reporter)
        ? ReporterReference.fromJSON(object.reporter)
        : undefined,
    };
  },

  toJSON(message: ResourceReference): unknown {
    const obj: any = {};
    if (message.resourceType !== undefined && message.resourceType !== "") {
      obj.resourceType = message.resourceType;
    }
    if (message.resourceId !== undefined && message.resourceId !== "") {
      obj.resourceId = message.resourceId;
    }
    if (message.reporter !== undefined) {
      obj.reporter = ReporterReference.toJSON(message.reporter);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ResourceReference>, I>>(
    base?: I,
  ): ResourceReference {
    return ResourceReference.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ResourceReference>, I>>(
    object: I,
  ): ResourceReference {
    const message = createBaseResourceReference();
    message.resourceType = object.resourceType ?? "";
    message.resourceId = object.resourceId ?? "";
    message.reporter =
      object.reporter !== undefined && object.reporter !== null
        ? ReporterReference.fromPartial(object.reporter)
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
