/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "kessel.inventory.v1beta1.authz";

/**
 * A _Relationship_ is the realization of a _Relation_ (a string)
 * between a _Resource_ and a _Subject_ or a _Subject Set_ (known as a Userset in Zanzibar).
 *
 * All Relationships are object-object relations.
 * "Resource" and "Subject" are relative terms which define the direction of a Relation.
 * That is, Relations are unidirectional.
 * If you reverse the Subject and Resource, it is a different Relation and a different Relationship.
 * Conventionally, we generally refer to the Resource first, then Subject,
 * following the direction of typical graph traversal (Resource to Subject).
 */
export interface Relationship {
  resource?: ObjectReference | undefined;
  relation?: string | undefined;
  subject?: SubjectReference | undefined;
}

/** A reference to a Subject or, if a `relation` is provided, a Subject Set. */
export interface SubjectReference {
  /**
   * An optional relation which points to a set of Subjects instead of the single Subject.
   * e.g. "members" or "owners" of a group identified in `subject`.
   */
  relation?: string | undefined;
  subject?: ObjectReference | undefined;
}

export interface RequestPagination {
  limit?: number | undefined;
  continuationToken?: string | undefined;
}

export interface ResponsePagination {
  continuationToken?: string | undefined;
}

export interface ObjectReference {
  type?: ObjectType | undefined;
  id?: string | undefined;
}

export interface ObjectType {
  namespace?: string | undefined;
  name?: string | undefined;
}

/** Defines how a request is handled by the service. */
export interface Consistency {
  /**
   * The service selects the fastest snapshot available.
   * *Must* be set true if used.
   */
  minimizeLatency?: boolean | undefined;
  /**
   * All data used in the API call must be *at least as fresh*
   * as found in the ConsistencyToken. More recent data might be used
   * if available or faster.
   */
  atLeastAsFresh?: ConsistencyToken | undefined;
}

/** The ConsistencyToken is used to provide consistency between write and read requests. */
export interface ConsistencyToken {
  token?: string | undefined;
}

function createBaseRelationship(): Relationship {
  return { resource: undefined, relation: "", subject: undefined };
}

export const Relationship = {
  encode(
    message: Relationship,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.resource !== undefined) {
      ObjectReference.encode(
        message.resource,
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

  decode(input: _m0.Reader | Uint8Array, length?: number): Relationship {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRelationship();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.resource = ObjectReference.decode(reader, reader.uint32());
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

  fromJSON(object: any): Relationship {
    return {
      resource: isSet(object.resource)
        ? ObjectReference.fromJSON(object.resource)
        : undefined,
      relation: isSet(object.relation)
        ? globalThis.String(object.relation)
        : "",
      subject: isSet(object.subject)
        ? SubjectReference.fromJSON(object.subject)
        : undefined,
    };
  },

  toJSON(message: Relationship): unknown {
    const obj: any = {};
    if (message.resource !== undefined) {
      obj.resource = ObjectReference.toJSON(message.resource);
    }
    if (message.relation !== undefined && message.relation !== "") {
      obj.relation = message.relation;
    }
    if (message.subject !== undefined) {
      obj.subject = SubjectReference.toJSON(message.subject);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Relationship>, I>>(
    base?: I,
  ): Relationship {
    return Relationship.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Relationship>, I>>(
    object: I,
  ): Relationship {
    const message = createBaseRelationship();
    message.resource =
      object.resource !== undefined && object.resource !== null
        ? ObjectReference.fromPartial(object.resource)
        : undefined;
    message.relation = object.relation ?? "";
    message.subject =
      object.subject !== undefined && object.subject !== null
        ? SubjectReference.fromPartial(object.subject)
        : undefined;
    return message;
  },
};

function createBaseSubjectReference(): SubjectReference {
  return { relation: undefined, subject: undefined };
}

export const SubjectReference = {
  encode(
    message: SubjectReference,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.relation !== undefined) {
      writer.uint32(10).string(message.relation);
    }
    if (message.subject !== undefined) {
      ObjectReference.encode(
        message.subject,
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

          message.subject = ObjectReference.decode(reader, reader.uint32());
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
      subject: isSet(object.subject)
        ? ObjectReference.fromJSON(object.subject)
        : undefined,
    };
  },

  toJSON(message: SubjectReference): unknown {
    const obj: any = {};
    if (message.relation !== undefined) {
      obj.relation = message.relation;
    }
    if (message.subject !== undefined) {
      obj.subject = ObjectReference.toJSON(message.subject);
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
    message.subject =
      object.subject !== undefined && object.subject !== null
        ? ObjectReference.fromPartial(object.subject)
        : undefined;
    return message;
  },
};

function createBaseRequestPagination(): RequestPagination {
  return { limit: 0, continuationToken: undefined };
}

export const RequestPagination = {
  encode(
    message: RequestPagination,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.limit !== undefined && message.limit !== 0) {
      writer.uint32(8).uint32(message.limit);
    }
    if (message.continuationToken !== undefined) {
      writer.uint32(18).string(message.continuationToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestPagination {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestPagination();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.limit = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.continuationToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RequestPagination {
    return {
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      continuationToken: isSet(object.continuationToken)
        ? globalThis.String(object.continuationToken)
        : undefined,
    };
  },

  toJSON(message: RequestPagination): unknown {
    const obj: any = {};
    if (message.limit !== undefined && message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.continuationToken !== undefined) {
      obj.continuationToken = message.continuationToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RequestPagination>, I>>(
    base?: I,
  ): RequestPagination {
    return RequestPagination.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RequestPagination>, I>>(
    object: I,
  ): RequestPagination {
    const message = createBaseRequestPagination();
    message.limit = object.limit ?? 0;
    message.continuationToken = object.continuationToken ?? undefined;
    return message;
  },
};

function createBaseResponsePagination(): ResponsePagination {
  return { continuationToken: "" };
}

export const ResponsePagination = {
  encode(
    message: ResponsePagination,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (
      message.continuationToken !== undefined &&
      message.continuationToken !== ""
    ) {
      writer.uint32(10).string(message.continuationToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResponsePagination {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResponsePagination();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.continuationToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ResponsePagination {
    return {
      continuationToken: isSet(object.continuationToken)
        ? globalThis.String(object.continuationToken)
        : "",
    };
  },

  toJSON(message: ResponsePagination): unknown {
    const obj: any = {};
    if (
      message.continuationToken !== undefined &&
      message.continuationToken !== ""
    ) {
      obj.continuationToken = message.continuationToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ResponsePagination>, I>>(
    base?: I,
  ): ResponsePagination {
    return ResponsePagination.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ResponsePagination>, I>>(
    object: I,
  ): ResponsePagination {
    const message = createBaseResponsePagination();
    message.continuationToken = object.continuationToken ?? "";
    return message;
  },
};

function createBaseObjectReference(): ObjectReference {
  return { type: undefined, id: "" };
}

export const ObjectReference = {
  encode(
    message: ObjectReference,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== undefined) {
      ObjectType.encode(message.type, writer.uint32(10).fork()).ldelim();
    }
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(18).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ObjectReference {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseObjectReference();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.type = ObjectType.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ObjectReference {
    return {
      type: isSet(object.type) ? ObjectType.fromJSON(object.type) : undefined,
      id: isSet(object.id) ? globalThis.String(object.id) : "",
    };
  },

  toJSON(message: ObjectReference): unknown {
    const obj: any = {};
    if (message.type !== undefined) {
      obj.type = ObjectType.toJSON(message.type);
    }
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ObjectReference>, I>>(
    base?: I,
  ): ObjectReference {
    return ObjectReference.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ObjectReference>, I>>(
    object: I,
  ): ObjectReference {
    const message = createBaseObjectReference();
    message.type =
      object.type !== undefined && object.type !== null
        ? ObjectType.fromPartial(object.type)
        : undefined;
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseObjectType(): ObjectType {
  return { namespace: "", name: "" };
}

export const ObjectType = {
  encode(
    message: ObjectType,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.namespace !== undefined && message.namespace !== "") {
      writer.uint32(10).string(message.namespace);
    }
    if (message.name !== undefined && message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ObjectType {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseObjectType();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.namespace = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ObjectType {
    return {
      namespace: isSet(object.namespace)
        ? globalThis.String(object.namespace)
        : "",
      name: isSet(object.name) ? globalThis.String(object.name) : "",
    };
  },

  toJSON(message: ObjectType): unknown {
    const obj: any = {};
    if (message.namespace !== undefined && message.namespace !== "") {
      obj.namespace = message.namespace;
    }
    if (message.name !== undefined && message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ObjectType>, I>>(base?: I): ObjectType {
    return ObjectType.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ObjectType>, I>>(
    object: I,
  ): ObjectType {
    const message = createBaseObjectType();
    message.namespace = object.namespace ?? "";
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseConsistency(): Consistency {
  return { minimizeLatency: undefined, atLeastAsFresh: undefined };
}

export const Consistency = {
  encode(
    message: Consistency,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.minimizeLatency !== undefined) {
      writer.uint32(8).bool(message.minimizeLatency);
    }
    if (message.atLeastAsFresh !== undefined) {
      ConsistencyToken.encode(
        message.atLeastAsFresh,
        writer.uint32(18).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Consistency {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsistency();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.minimizeLatency = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.atLeastAsFresh = ConsistencyToken.decode(
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

  fromJSON(object: any): Consistency {
    return {
      minimizeLatency: isSet(object.minimizeLatency)
        ? globalThis.Boolean(object.minimizeLatency)
        : undefined,
      atLeastAsFresh: isSet(object.atLeastAsFresh)
        ? ConsistencyToken.fromJSON(object.atLeastAsFresh)
        : undefined,
    };
  },

  toJSON(message: Consistency): unknown {
    const obj: any = {};
    if (message.minimizeLatency !== undefined) {
      obj.minimizeLatency = message.minimizeLatency;
    }
    if (message.atLeastAsFresh !== undefined) {
      obj.atLeastAsFresh = ConsistencyToken.toJSON(message.atLeastAsFresh);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Consistency>, I>>(base?: I): Consistency {
    return Consistency.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Consistency>, I>>(
    object: I,
  ): Consistency {
    const message = createBaseConsistency();
    message.minimizeLatency = object.minimizeLatency ?? undefined;
    message.atLeastAsFresh =
      object.atLeastAsFresh !== undefined && object.atLeastAsFresh !== null
        ? ConsistencyToken.fromPartial(object.atLeastAsFresh)
        : undefined;
    return message;
  },
};

function createBaseConsistencyToken(): ConsistencyToken {
  return { token: "" };
}

export const ConsistencyToken = {
  encode(
    message: ConsistencyToken,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.token !== undefined && message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConsistencyToken {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsistencyToken();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.token = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConsistencyToken {
    return {
      token: isSet(object.token) ? globalThis.String(object.token) : "",
    };
  },

  toJSON(message: ConsistencyToken): unknown {
    const obj: any = {};
    if (message.token !== undefined && message.token !== "") {
      obj.token = message.token;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsistencyToken>, I>>(
    base?: I,
  ): ConsistencyToken {
    return ConsistencyToken.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConsistencyToken>, I>>(
    object: I,
  ): ConsistencyToken {
    const message = createBaseConsistencyToken();
    message.token = object.token ?? "";
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
