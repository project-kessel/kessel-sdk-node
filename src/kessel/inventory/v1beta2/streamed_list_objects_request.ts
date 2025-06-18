/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Consistency } from "./consistency";
import { RepresentationType } from "./representation_type";
import { RequestPagination } from "./request_pagination";
import { SubjectReference } from "./subject_reference";

export const protobufPackage = "kessel.inventory.v1beta2";

export interface StreamedListObjectsRequest {
  objectType?: RepresentationType | undefined;
  relation?: string | undefined;
  subject?: SubjectReference | undefined;
  pagination?: RequestPagination | undefined;
  consistency?: Consistency | undefined;
}

function createBaseStreamedListObjectsRequest(): StreamedListObjectsRequest {
  return {
    objectType: undefined,
    relation: "",
    subject: undefined,
    pagination: undefined,
    consistency: undefined,
  };
}

export const StreamedListObjectsRequest = {
  encode(
    message: StreamedListObjectsRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.objectType !== undefined) {
      RepresentationType.encode(
        message.objectType,
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
    if (message.pagination !== undefined) {
      RequestPagination.encode(
        message.pagination,
        writer.uint32(34).fork(),
      ).ldelim();
    }
    if (message.consistency !== undefined) {
      Consistency.encode(
        message.consistency,
        writer.uint32(42).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): StreamedListObjectsRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamedListObjectsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.objectType = RepresentationType.decode(
            reader,
            reader.uint32(),
          );
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
        case 4:
          if (tag !== 34) {
            break;
          }

          message.pagination = RequestPagination.decode(
            reader,
            reader.uint32(),
          );
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.consistency = Consistency.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StreamedListObjectsRequest {
    return {
      objectType: isSet(object.objectType)
        ? RepresentationType.fromJSON(object.objectType)
        : undefined,
      relation: isSet(object.relation)
        ? globalThis.String(object.relation)
        : "",
      subject: isSet(object.subject)
        ? SubjectReference.fromJSON(object.subject)
        : undefined,
      pagination: isSet(object.pagination)
        ? RequestPagination.fromJSON(object.pagination)
        : undefined,
      consistency: isSet(object.consistency)
        ? Consistency.fromJSON(object.consistency)
        : undefined,
    };
  },

  toJSON(message: StreamedListObjectsRequest): unknown {
    const obj: any = {};
    if (message.objectType !== undefined) {
      obj.objectType = RepresentationType.toJSON(message.objectType);
    }
    if (message.relation !== undefined && message.relation !== "") {
      obj.relation = message.relation;
    }
    if (message.subject !== undefined) {
      obj.subject = SubjectReference.toJSON(message.subject);
    }
    if (message.pagination !== undefined) {
      obj.pagination = RequestPagination.toJSON(message.pagination);
    }
    if (message.consistency !== undefined) {
      obj.consistency = Consistency.toJSON(message.consistency);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamedListObjectsRequest>, I>>(
    base?: I,
  ): StreamedListObjectsRequest {
    return StreamedListObjectsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StreamedListObjectsRequest>, I>>(
    object: I,
  ): StreamedListObjectsRequest {
    const message = createBaseStreamedListObjectsRequest();
    message.objectType =
      object.objectType !== undefined && object.objectType !== null
        ? RepresentationType.fromPartial(object.objectType)
        : undefined;
    message.relation = object.relation ?? "";
    message.subject =
      object.subject !== undefined && object.subject !== null
        ? SubjectReference.fromPartial(object.subject)
        : undefined;
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? RequestPagination.fromPartial(object.pagination)
        : undefined;
    message.consistency =
      object.consistency !== undefined && object.consistency !== null
        ? Consistency.fromPartial(object.consistency)
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
