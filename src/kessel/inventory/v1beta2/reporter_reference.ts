/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface ReporterReference {
  type?: string | undefined;
  instanceId?: string | undefined;
}

function createBaseReporterReference(): ReporterReference {
  return { type: "", instanceId: undefined };
}

export const ReporterReference = {
  encode(
    message: ReporterReference,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== undefined && message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.instanceId !== undefined) {
      writer.uint32(18).string(message.instanceId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReporterReference {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReporterReference();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.type = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.instanceId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReporterReference {
    return {
      type: isSet(object.type) ? globalThis.String(object.type) : "",
      instanceId: isSet(object.instanceId)
        ? globalThis.String(object.instanceId)
        : undefined,
    };
  },

  toJSON(message: ReporterReference): unknown {
    const obj: any = {};
    if (message.type !== undefined && message.type !== "") {
      obj.type = message.type;
    }
    if (message.instanceId !== undefined) {
      obj.instanceId = message.instanceId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ReporterReference>, I>>(
    base?: I,
  ): ReporterReference {
    return ReporterReference.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ReporterReference>, I>>(
    object: I,
  ): ReporterReference {
    const message = createBaseReporterReference();
    message.type = object.type ?? "";
    message.instanceId = object.instanceId ?? undefined;
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
