/* eslint-disable */
import {
  ChannelCredentials,
  Client,
  makeGenericClientConstructor,
  Metadata,
} from "@grpc/grpc-js";
import type {
  CallOptions,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { ObjectReference, SubjectReference } from "./common";

export const protobufPackage = "kessel.inventory.v1beta1.authz";

export interface CheckRequest {
  /**
   * Required parameters (from an authz perspective)
   * - resource type and id
   * - permission (cannot be derived from the type as a type may have multiple 'read' permissions. Ex: https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/notifications.ksl#L31)
   * - user (possibly derived from an identity token)
   */
  parent?: ObjectReference | undefined;
  relation?: string | undefined;
  /** Consistency consistency = 4; */
  subject?: SubjectReference | undefined;
}

export interface CheckResponse {
  allowed?: CheckResponse_Allowed | undefined;
}

export enum CheckResponse_Allowed {
  ALLOWED_UNSPECIFIED = 0,
  ALLOWED_TRUE = 1,
  /** ALLOWED_FALSE - e.g.  ALLOWED_CONDITIONAL = 3; */
  ALLOWED_FALSE = 2,
  UNRECOGNIZED = -1,
}

export function checkResponse_AllowedFromJSON(
  object: any,
): CheckResponse_Allowed {
  switch (object) {
    case 0:
    case "ALLOWED_UNSPECIFIED":
      return CheckResponse_Allowed.ALLOWED_UNSPECIFIED;
    case 1:
    case "ALLOWED_TRUE":
      return CheckResponse_Allowed.ALLOWED_TRUE;
    case 2:
    case "ALLOWED_FALSE":
      return CheckResponse_Allowed.ALLOWED_FALSE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return CheckResponse_Allowed.UNRECOGNIZED;
  }
}

export function checkResponse_AllowedToJSON(
  object: CheckResponse_Allowed,
): string {
  switch (object) {
    case CheckResponse_Allowed.ALLOWED_UNSPECIFIED:
      return "ALLOWED_UNSPECIFIED";
    case CheckResponse_Allowed.ALLOWED_TRUE:
      return "ALLOWED_TRUE";
    case CheckResponse_Allowed.ALLOWED_FALSE:
      return "ALLOWED_FALSE";
    case CheckResponse_Allowed.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** fully consistent */
export interface CheckForUpdateRequest {
  /**
   * Required parameters (from an authz perspective)
   * - resource type and id
   * - permission (cannot be derived from type as types may have multiple edit permissions Ex: https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/notifications.ksl#L37)
   * - user (possibly derived from an identity token)
   */
  parent?: ObjectReference | undefined;
  relation?: string | undefined;
  subject?: SubjectReference | undefined;
}

export interface CheckForUpdateResponse {
  allowed?: CheckForUpdateResponse_Allowed | undefined;
}

export enum CheckForUpdateResponse_Allowed {
  ALLOWED_UNSPECIFIED = 0,
  ALLOWED_TRUE = 1,
  /** ALLOWED_FALSE - e.g.  ALLOWED_CONDITIONAL = 3; */
  ALLOWED_FALSE = 2,
  UNRECOGNIZED = -1,
}

export function checkForUpdateResponse_AllowedFromJSON(
  object: any,
): CheckForUpdateResponse_Allowed {
  switch (object) {
    case 0:
    case "ALLOWED_UNSPECIFIED":
      return CheckForUpdateResponse_Allowed.ALLOWED_UNSPECIFIED;
    case 1:
    case "ALLOWED_TRUE":
      return CheckForUpdateResponse_Allowed.ALLOWED_TRUE;
    case 2:
    case "ALLOWED_FALSE":
      return CheckForUpdateResponse_Allowed.ALLOWED_FALSE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return CheckForUpdateResponse_Allowed.UNRECOGNIZED;
  }
}

export function checkForUpdateResponse_AllowedToJSON(
  object: CheckForUpdateResponse_Allowed,
): string {
  switch (object) {
    case CheckForUpdateResponse_Allowed.ALLOWED_UNSPECIFIED:
      return "ALLOWED_UNSPECIFIED";
    case CheckForUpdateResponse_Allowed.ALLOWED_TRUE:
      return "ALLOWED_TRUE";
    case CheckForUpdateResponse_Allowed.ALLOWED_FALSE:
      return "ALLOWED_FALSE";
    case CheckForUpdateResponse_Allowed.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseCheckRequest(): CheckRequest {
  return { parent: undefined, relation: "", subject: undefined };
}

export const CheckRequest = {
  encode(
    message: CheckRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.parent !== undefined) {
      ObjectReference.encode(message.parent, writer.uint32(10).fork()).ldelim();
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

          message.parent = ObjectReference.decode(reader, reader.uint32());
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
      parent: isSet(object.parent)
        ? ObjectReference.fromJSON(object.parent)
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
    if (message.parent !== undefined) {
      obj.parent = ObjectReference.toJSON(message.parent);
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
    message.parent =
      object.parent !== undefined && object.parent !== null
        ? ObjectReference.fromPartial(object.parent)
        : undefined;
    message.relation = object.relation ?? "";
    message.subject =
      object.subject !== undefined && object.subject !== null
        ? SubjectReference.fromPartial(object.subject)
        : undefined;
    return message;
  },
};

function createBaseCheckResponse(): CheckResponse {
  return { allowed: 0 };
}

export const CheckResponse = {
  encode(
    message: CheckResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.allowed !== undefined && message.allowed !== 0) {
      writer.uint32(8).int32(message.allowed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.allowed = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CheckResponse {
    return {
      allowed: isSet(object.allowed)
        ? checkResponse_AllowedFromJSON(object.allowed)
        : 0,
    };
  },

  toJSON(message: CheckResponse): unknown {
    const obj: any = {};
    if (message.allowed !== undefined && message.allowed !== 0) {
      obj.allowed = checkResponse_AllowedToJSON(message.allowed);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckResponse>, I>>(
    base?: I,
  ): CheckResponse {
    return CheckResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CheckResponse>, I>>(
    object: I,
  ): CheckResponse {
    const message = createBaseCheckResponse();
    message.allowed = object.allowed ?? 0;
    return message;
  },
};

function createBaseCheckForUpdateRequest(): CheckForUpdateRequest {
  return { parent: undefined, relation: "", subject: undefined };
}

export const CheckForUpdateRequest = {
  encode(
    message: CheckForUpdateRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.parent !== undefined) {
      ObjectReference.encode(message.parent, writer.uint32(10).fork()).ldelim();
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

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): CheckForUpdateRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckForUpdateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.parent = ObjectReference.decode(reader, reader.uint32());
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

  fromJSON(object: any): CheckForUpdateRequest {
    return {
      parent: isSet(object.parent)
        ? ObjectReference.fromJSON(object.parent)
        : undefined,
      relation: isSet(object.relation)
        ? globalThis.String(object.relation)
        : "",
      subject: isSet(object.subject)
        ? SubjectReference.fromJSON(object.subject)
        : undefined,
    };
  },

  toJSON(message: CheckForUpdateRequest): unknown {
    const obj: any = {};
    if (message.parent !== undefined) {
      obj.parent = ObjectReference.toJSON(message.parent);
    }
    if (message.relation !== undefined && message.relation !== "") {
      obj.relation = message.relation;
    }
    if (message.subject !== undefined) {
      obj.subject = SubjectReference.toJSON(message.subject);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckForUpdateRequest>, I>>(
    base?: I,
  ): CheckForUpdateRequest {
    return CheckForUpdateRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CheckForUpdateRequest>, I>>(
    object: I,
  ): CheckForUpdateRequest {
    const message = createBaseCheckForUpdateRequest();
    message.parent =
      object.parent !== undefined && object.parent !== null
        ? ObjectReference.fromPartial(object.parent)
        : undefined;
    message.relation = object.relation ?? "";
    message.subject =
      object.subject !== undefined && object.subject !== null
        ? SubjectReference.fromPartial(object.subject)
        : undefined;
    return message;
  },
};

function createBaseCheckForUpdateResponse(): CheckForUpdateResponse {
  return { allowed: 0 };
}

export const CheckForUpdateResponse = {
  encode(
    message: CheckForUpdateResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.allowed !== undefined && message.allowed !== 0) {
      writer.uint32(8).int32(message.allowed);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): CheckForUpdateResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckForUpdateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.allowed = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CheckForUpdateResponse {
    return {
      allowed: isSet(object.allowed)
        ? checkForUpdateResponse_AllowedFromJSON(object.allowed)
        : 0,
    };
  },

  toJSON(message: CheckForUpdateResponse): unknown {
    const obj: any = {};
    if (message.allowed !== undefined && message.allowed !== 0) {
      obj.allowed = checkForUpdateResponse_AllowedToJSON(message.allowed);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckForUpdateResponse>, I>>(
    base?: I,
  ): CheckForUpdateResponse {
    return CheckForUpdateResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CheckForUpdateResponse>, I>>(
    object: I,
  ): CheckForUpdateResponse {
    const message = createBaseCheckForUpdateResponse();
    message.allowed = object.allowed ?? 0;
    return message;
  },
};

export type KesselCheckServiceDefinition = typeof KesselCheckServiceDefinition;
export const KesselCheckServiceDefinition = {
  name: "KesselCheckService",
  fullName: "kessel.inventory.v1beta1.authz.KesselCheckService",
  methods: {
    /**
     * Checks for the existence of a single Relationship
     * (a Relation between a Resource and a Subject or Subject Set).
     */
    check: {
      name: "Check",
      requestType: CheckRequest,
      requestStream: false,
      responseType: CheckResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              39, 58, 1, 42, 34, 34, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 49, 47,
              97, 117, 116, 104, 122, 47, 99, 104, 101, 99, 107,
            ]),
          ],
        },
      },
    },
    checkForUpdate: {
      name: "CheckForUpdate",
      requestType: CheckForUpdateRequest,
      requestStream: false,
      responseType: CheckForUpdateResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              48, 58, 1, 42, 34, 43, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 49, 47,
              97, 117, 116, 104, 122, 47, 99, 104, 101, 99, 107, 102, 111, 114,
              117, 112, 100, 97, 116, 101,
            ]),
          ],
        },
      },
    },
  },
} as const;

export type KesselCheckServiceService = typeof KesselCheckServiceService;
export const KesselCheckServiceService = {
  /**
   * Checks for the existence of a single Relationship
   * (a Relation between a Resource and a Subject or Subject Set).
   */
  check: {
    path: "/kessel.inventory.v1beta1.authz.KesselCheckService/Check",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CheckRequest) =>
      Buffer.from(CheckRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CheckRequest.decode(value),
    responseSerialize: (value: CheckResponse) =>
      Buffer.from(CheckResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CheckResponse.decode(value),
  },
  checkForUpdate: {
    path: "/kessel.inventory.v1beta1.authz.KesselCheckService/CheckForUpdate",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CheckForUpdateRequest) =>
      Buffer.from(CheckForUpdateRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CheckForUpdateRequest.decode(value),
    responseSerialize: (value: CheckForUpdateResponse) =>
      Buffer.from(CheckForUpdateResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CheckForUpdateResponse.decode(value),
  },
} as const;

export interface KesselCheckServiceServer extends UntypedServiceImplementation {
  /**
   * Checks for the existence of a single Relationship
   * (a Relation between a Resource and a Subject or Subject Set).
   */
  check: handleUnaryCall<CheckRequest, CheckResponse>;
  checkForUpdate: handleUnaryCall<
    CheckForUpdateRequest,
    CheckForUpdateResponse
  >;
}

export interface KesselCheckServiceClient extends Client {
  /**
   * Checks for the existence of a single Relationship
   * (a Relation between a Resource and a Subject or Subject Set).
   */
  check(
    request: CheckRequest,
    callback: (error: ServiceError | null, response: CheckResponse) => void,
  ): ClientUnaryCall;
  check(
    request: CheckRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CheckResponse) => void,
  ): ClientUnaryCall;
  check(
    request: CheckRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CheckResponse) => void,
  ): ClientUnaryCall;
  checkForUpdate(
    request: CheckForUpdateRequest,
    callback: (
      error: ServiceError | null,
      response: CheckForUpdateResponse,
    ) => void,
  ): ClientUnaryCall;
  checkForUpdate(
    request: CheckForUpdateRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CheckForUpdateResponse,
    ) => void,
  ): ClientUnaryCall;
  checkForUpdate(
    request: CheckForUpdateRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CheckForUpdateResponse,
    ) => void,
  ): ClientUnaryCall;
}

export const KesselCheckServiceClient = makeGenericClientConstructor(
  KesselCheckServiceService,
  "kessel.inventory.v1beta1.authz.KesselCheckService",
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>,
  ): KesselCheckServiceClient;
  service: typeof KesselCheckServiceService;
  serviceName: string;
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
