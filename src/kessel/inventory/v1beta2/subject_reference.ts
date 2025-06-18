/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ResourceReference } from "./resource_reference";

export const protobufPackage = "kessel.inventory.v1beta2";

/** A reference to a Subject or, if a `relation` is provided, a Subject Set. */
export interface SubjectReference {
  /**
   * An optional relation which points to a set of Subjects instead of the single Subject.
   * e.g. "members" or "owners" of a group identified in `subject`.
   */
  relation?: string | undefined;
  resource?: ResourceReference | undefined;
}

function createBaseSubjectReference(): SubjectReference {
  return { relation: undefined, resource: undefined };
}

export const SubjectReference = {
  encode(
    message: SubjectReference,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.relation !== undefined) {
      writer.uint32(10).string(message.relation);
    }
    if (message.resource !== undefined) {
      ResourceReference.encode(
        message.resource,
        writer.uint32(18).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubjectReference {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubjectReference();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.relation = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.resource = ResourceReference.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SubjectReference {
    return {
      relation: isSet(object.relation)
        ? globalThis.String(object.relation)
        : undefined,
      resource: isSet(object.resource)
        ? ResourceReference.fromJSON(object.resource)
        : undefined,
    };
  },

  toJSON(message: SubjectReference): unknown {
    const obj: any = {};
    if (message.relation !== undefined) {
      obj.relation = message.relation;
    }
    if (message.resource !== undefined) {
      obj.resource = ResourceReference.toJSON(message.resource);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SubjectReference>, I>>(
    base?: I,
  ): SubjectReference {
    return SubjectReference.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SubjectReference>, I>>(
    object: I,
  ): SubjectReference {
    const message = createBaseSubjectReference();
    message.relation = object.relation ?? undefined;
    message.resource =
      object.resource !== undefined && object.resource !== null
        ? ResourceReference.fromPartial(object.resource)
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
