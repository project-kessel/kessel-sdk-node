/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ResourceReference } from "./resource_reference";
import { SubjectReference } from "./subject_reference";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface CheckRequest {
  /**
   * Required parameters (from an authz perspective)
   * - resource type and id
   * - permission (cannot be derived from the type as a type may have multiple 'read' permissions. Ex: https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/notifications.ksl#L31)
   * - user (possibly derived from an identity token)
   */
  object?: ResourceReference | undefined;
  relation?: string | undefined;
  subject?: SubjectReference | undefined;
}

function createBaseCheckRequest(): CheckRequest {
  return { object: undefined, relation: "", subject: undefined };
}

export const CheckRequest = {
  encode(
    message: CheckRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.object !== undefined) {
      ResourceReference.encode(
        message.object,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    if (message.relation !== undefined && message.relation !== "") {
      writer.uint32(18).string(message.relation);
    }
    if (message.subject !== undefined) {
      SubjectReference.encode(
        message.subject,
        writer.uint32(26).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckRequest();
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

          message.relation = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.subject = SubjectReference.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CheckRequest {
    return {
      object: isSet(object.object)
        ? ResourceReference.fromJSON(object.object)
        : undefined,
      relation: isSet(object.relation)
        ? globalThis.String(object.relation)
        : "",
      subject: isSet(object.subject)
        ? SubjectReference.fromJSON(object.subject)
        : undefined,
    };
  },

  toJSON(message: CheckRequest): unknown {
    const obj: any = {};
    if (message.object !== undefined) {
      obj.object = ResourceReference.toJSON(message.object);
    }
    if (message.relation !== undefined && message.relation !== "") {
      obj.relation = message.relation;
    }
    if (message.subject !== undefined) {
      obj.subject = SubjectReference.toJSON(message.subject);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckRequest>, I>>(
    base?: I,
  ): CheckRequest {
    return CheckRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CheckRequest>, I>>(
    object: I,
  ): CheckRequest {
    const message = createBaseCheckRequest();
    message.object =
      object.object !== undefined && object.object !== null
        ? ResourceReference.fromPartial(object.object)
        : undefined;
    message.relation = object.relation ?? "";
    message.subject =
      object.subject !== undefined && object.subject !== null
        ? SubjectReference.fromPartial(object.subject)
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
