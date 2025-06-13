/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import _m0 from "protobufjs/minimal";
import { K8sPolicy } from "./k8s_policy";
import { ReporterData } from "./reporter_data";

export const protobufPackage = "kessel.inventory.v1beta1.resources";

export interface CreateK8sPolicyRequest {
  /** The policy to create in Kessel Asset Inventory */
  k8sPolicy?: K8sPolicy | undefined;
}

export interface CreateK8sPolicyResponse {}

export interface UpdateK8sPolicyRequest {
  /**
   * The resource to be updated will be defined by
   * \"<reporter_data.reporter_type>:<reporter_instaance_id>:<reporter_data.local_resource_id>\"
   * from the request body.
   */
  k8sPolicy?: K8sPolicy | undefined;
}

export interface UpdateK8sPolicyResponse {}

export interface DeleteK8sPolicyRequest {
  /**
   * The resource to be deleted will be defined by
   * \"<reporter_data.reporter_type>:<reporter_instaance_id>:<reporter_data.local_resource_id>\"
   * from the request body.
   */
  reporterData?: ReporterData | undefined;
}

export interface DeleteK8sPolicyResponse {}

function createBaseCreateK8sPolicyRequest(): CreateK8sPolicyRequest {
  return { k8sPolicy: undefined };
}

export const CreateK8sPolicyRequest = {
  encode(
    message: CreateK8sPolicyRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.k8sPolicy !== undefined) {
      K8sPolicy.encode(message.k8sPolicy, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): CreateK8sPolicyRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateK8sPolicyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.k8sPolicy = K8sPolicy.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateK8sPolicyRequest {
    return {
      k8sPolicy: isSet(object.k8s_policy)
        ? K8sPolicy.fromJSON(object.k8s_policy)
        : undefined,
    };
  },

  toJSON(message: CreateK8sPolicyRequest): unknown {
    const obj: any = {};
    if (message.k8sPolicy !== undefined) {
      obj.k8s_policy = K8sPolicy.toJSON(message.k8sPolicy);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateK8sPolicyRequest>, I>>(
    base?: I,
  ): CreateK8sPolicyRequest {
    return CreateK8sPolicyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateK8sPolicyRequest>, I>>(
    object: I,
  ): CreateK8sPolicyRequest {
    const message = createBaseCreateK8sPolicyRequest();
    message.k8sPolicy =
      object.k8sPolicy !== undefined && object.k8sPolicy !== null
        ? K8sPolicy.fromPartial(object.k8sPolicy)
        : undefined;
    return message;
  },
};

function createBaseCreateK8sPolicyResponse(): CreateK8sPolicyResponse {
  return {};
}

export const CreateK8sPolicyResponse = {
  encode(
    _: CreateK8sPolicyResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): CreateK8sPolicyResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateK8sPolicyResponse();
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

  fromJSON(_: any): CreateK8sPolicyResponse {
    return {};
  },

  toJSON(_: CreateK8sPolicyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateK8sPolicyResponse>, I>>(
    base?: I,
  ): CreateK8sPolicyResponse {
    return CreateK8sPolicyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateK8sPolicyResponse>, I>>(
    _: I,
  ): CreateK8sPolicyResponse {
    const message = createBaseCreateK8sPolicyResponse();
    return message;
  },
};

function createBaseUpdateK8sPolicyRequest(): UpdateK8sPolicyRequest {
  return { k8sPolicy: undefined };
}

export const UpdateK8sPolicyRequest = {
  encode(
    message: UpdateK8sPolicyRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.k8sPolicy !== undefined) {
      K8sPolicy.encode(message.k8sPolicy, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): UpdateK8sPolicyRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateK8sPolicyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.k8sPolicy = K8sPolicy.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateK8sPolicyRequest {
    return {
      k8sPolicy: isSet(object.k8s_policy)
        ? K8sPolicy.fromJSON(object.k8s_policy)
        : undefined,
    };
  },

  toJSON(message: UpdateK8sPolicyRequest): unknown {
    const obj: any = {};
    if (message.k8sPolicy !== undefined) {
      obj.k8s_policy = K8sPolicy.toJSON(message.k8sPolicy);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateK8sPolicyRequest>, I>>(
    base?: I,
  ): UpdateK8sPolicyRequest {
    return UpdateK8sPolicyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateK8sPolicyRequest>, I>>(
    object: I,
  ): UpdateK8sPolicyRequest {
    const message = createBaseUpdateK8sPolicyRequest();
    message.k8sPolicy =
      object.k8sPolicy !== undefined && object.k8sPolicy !== null
        ? K8sPolicy.fromPartial(object.k8sPolicy)
        : undefined;
    return message;
  },
};

function createBaseUpdateK8sPolicyResponse(): UpdateK8sPolicyResponse {
  return {};
}

export const UpdateK8sPolicyResponse = {
  encode(
    _: UpdateK8sPolicyResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): UpdateK8sPolicyResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateK8sPolicyResponse();
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

  fromJSON(_: any): UpdateK8sPolicyResponse {
    return {};
  },

  toJSON(_: UpdateK8sPolicyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateK8sPolicyResponse>, I>>(
    base?: I,
  ): UpdateK8sPolicyResponse {
    return UpdateK8sPolicyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateK8sPolicyResponse>, I>>(
    _: I,
  ): UpdateK8sPolicyResponse {
    const message = createBaseUpdateK8sPolicyResponse();
    return message;
  },
};

function createBaseDeleteK8sPolicyRequest(): DeleteK8sPolicyRequest {
  return { reporterData: undefined };
}

export const DeleteK8sPolicyRequest = {
  encode(
    message: DeleteK8sPolicyRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.reporterData !== undefined) {
      ReporterData.encode(
        message.reporterData,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): DeleteK8sPolicyRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteK8sPolicyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.reporterData = ReporterData.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeleteK8sPolicyRequest {
    return {
      reporterData: isSet(object.reporter_data)
        ? ReporterData.fromJSON(object.reporter_data)
        : undefined,
    };
  },

  toJSON(message: DeleteK8sPolicyRequest): unknown {
    const obj: any = {};
    if (message.reporterData !== undefined) {
      obj.reporter_data = ReporterData.toJSON(message.reporterData);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteK8sPolicyRequest>, I>>(
    base?: I,
  ): DeleteK8sPolicyRequest {
    return DeleteK8sPolicyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeleteK8sPolicyRequest>, I>>(
    object: I,
  ): DeleteK8sPolicyRequest {
    const message = createBaseDeleteK8sPolicyRequest();
    message.reporterData =
      object.reporterData !== undefined && object.reporterData !== null
        ? ReporterData.fromPartial(object.reporterData)
        : undefined;
    return message;
  },
};

function createBaseDeleteK8sPolicyResponse(): DeleteK8sPolicyResponse {
  return {};
}

export const DeleteK8sPolicyResponse = {
  encode(
    _: DeleteK8sPolicyResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): DeleteK8sPolicyResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteK8sPolicyResponse();
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

  fromJSON(_: any): DeleteK8sPolicyResponse {
    return {};
  },

  toJSON(_: DeleteK8sPolicyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteK8sPolicyResponse>, I>>(
    base?: I,
  ): DeleteK8sPolicyResponse {
    return DeleteK8sPolicyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeleteK8sPolicyResponse>, I>>(
    _: I,
  ): DeleteK8sPolicyResponse {
    const message = createBaseDeleteK8sPolicyResponse();
    return message;
  },
};

export type KesselK8sPolicyServiceDefinition =
  typeof KesselK8sPolicyServiceDefinition;
export const KesselK8sPolicyServiceDefinition = {
  name: "KesselK8sPolicyService",
  fullName: "kessel.inventory.v1beta1.resources.KesselK8sPolicyService",
  methods: {
    createK8sPolicy: {
      name: "CreateK8sPolicy",
      requestType: CreateK8sPolicyRequest,
      requestStream: false,
      responseType: CreateK8sPolicyResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              50, 58, 1, 42, 34, 45, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 49, 47,
              114, 101, 115, 111, 117, 114, 99, 101, 115, 47, 107, 56, 115, 45,
              112, 111, 108, 105, 99, 105, 101, 115,
            ]),
          ],
        },
      },
    },
    updateK8sPolicy: {
      name: "UpdateK8sPolicy",
      requestType: UpdateK8sPolicyRequest,
      requestStream: false,
      responseType: UpdateK8sPolicyResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              50, 58, 1, 42, 26, 45, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 49, 47,
              114, 101, 115, 111, 117, 114, 99, 101, 115, 47, 107, 56, 115, 45,
              112, 111, 108, 105, 99, 105, 101, 115,
            ]),
          ],
        },
      },
    },
    deleteK8sPolicy: {
      name: "DeleteK8sPolicy",
      requestType: DeleteK8sPolicyRequest,
      requestStream: false,
      responseType: DeleteK8sPolicyResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              50, 58, 1, 42, 42, 45, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 49, 47,
              114, 101, 115, 111, 117, 114, 99, 101, 115, 47, 107, 56, 115, 45,
              112, 111, 108, 105, 99, 105, 101, 115,
            ]),
          ],
        },
      },
    },
  },
} as const;

export interface KesselK8sPolicyServiceImplementation<CallContextExt = {}> {
  createK8sPolicy(
    request: CreateK8sPolicyRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<CreateK8sPolicyResponse>>;
  updateK8sPolicy(
    request: UpdateK8sPolicyRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<UpdateK8sPolicyResponse>>;
  deleteK8sPolicy(
    request: DeleteK8sPolicyRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<DeleteK8sPolicyResponse>>;
}

export interface KesselK8sPolicyServiceClient<CallOptionsExt = {}> {
  createK8sPolicy(
    request: DeepPartial<CreateK8sPolicyRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<CreateK8sPolicyResponse>;
  updateK8sPolicy(
    request: DeepPartial<UpdateK8sPolicyRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<UpdateK8sPolicyResponse>;
  deleteK8sPolicy(
    request: DeepPartial<DeleteK8sPolicyRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<DeleteK8sPolicyResponse>;
}

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
