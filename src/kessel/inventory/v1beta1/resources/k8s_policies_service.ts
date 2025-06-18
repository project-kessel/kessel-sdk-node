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

export type KesselK8sPolicyServiceService =
  typeof KesselK8sPolicyServiceService;
export const KesselK8sPolicyServiceService = {
  createK8SPolicy: {
    path: "/kessel.inventory.v1beta1.resources.KesselK8sPolicyService/CreateK8sPolicy",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateK8sPolicyRequest) =>
      Buffer.from(CreateK8sPolicyRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateK8sPolicyRequest.decode(value),
    responseSerialize: (value: CreateK8sPolicyResponse) =>
      Buffer.from(CreateK8sPolicyResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CreateK8sPolicyResponse.decode(value),
  },
  updateK8SPolicy: {
    path: "/kessel.inventory.v1beta1.resources.KesselK8sPolicyService/UpdateK8sPolicy",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateK8sPolicyRequest) =>
      Buffer.from(UpdateK8sPolicyRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdateK8sPolicyRequest.decode(value),
    responseSerialize: (value: UpdateK8sPolicyResponse) =>
      Buffer.from(UpdateK8sPolicyResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      UpdateK8sPolicyResponse.decode(value),
  },
  deleteK8SPolicy: {
    path: "/kessel.inventory.v1beta1.resources.KesselK8sPolicyService/DeleteK8sPolicy",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteK8sPolicyRequest) =>
      Buffer.from(DeleteK8sPolicyRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => DeleteK8sPolicyRequest.decode(value),
    responseSerialize: (value: DeleteK8sPolicyResponse) =>
      Buffer.from(DeleteK8sPolicyResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      DeleteK8sPolicyResponse.decode(value),
  },
} as const;

export interface KesselK8sPolicyServiceServer
  extends UntypedServiceImplementation {
  createK8SPolicy: handleUnaryCall<
    CreateK8sPolicyRequest,
    CreateK8sPolicyResponse
  >;
  updateK8SPolicy: handleUnaryCall<
    UpdateK8sPolicyRequest,
    UpdateK8sPolicyResponse
  >;
  deleteK8SPolicy: handleUnaryCall<
    DeleteK8sPolicyRequest,
    DeleteK8sPolicyResponse
  >;
}

export interface KesselK8sPolicyServiceClient extends Client {
  createK8SPolicy(
    request: CreateK8sPolicyRequest,
    callback: (
      error: ServiceError | null,
      response: CreateK8sPolicyResponse,
    ) => void,
  ): ClientUnaryCall;
  createK8SPolicy(
    request: CreateK8sPolicyRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CreateK8sPolicyResponse,
    ) => void,
  ): ClientUnaryCall;
  createK8SPolicy(
    request: CreateK8sPolicyRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CreateK8sPolicyResponse,
    ) => void,
  ): ClientUnaryCall;
  updateK8SPolicy(
    request: UpdateK8sPolicyRequest,
    callback: (
      error: ServiceError | null,
      response: UpdateK8sPolicyResponse,
    ) => void,
  ): ClientUnaryCall;
  updateK8SPolicy(
    request: UpdateK8sPolicyRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: UpdateK8sPolicyResponse,
    ) => void,
  ): ClientUnaryCall;
  updateK8SPolicy(
    request: UpdateK8sPolicyRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: UpdateK8sPolicyResponse,
    ) => void,
  ): ClientUnaryCall;
  deleteK8SPolicy(
    request: DeleteK8sPolicyRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteK8sPolicyResponse,
    ) => void,
  ): ClientUnaryCall;
  deleteK8SPolicy(
    request: DeleteK8sPolicyRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteK8sPolicyResponse,
    ) => void,
  ): ClientUnaryCall;
  deleteK8SPolicy(
    request: DeleteK8sPolicyRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteK8sPolicyResponse,
    ) => void,
  ): ClientUnaryCall;
}

export const KesselK8sPolicyServiceClient = makeGenericClientConstructor(
  KesselK8sPolicyServiceService,
  "kessel.inventory.v1beta1.resources.KesselK8sPolicyService",
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>,
  ): KesselK8sPolicyServiceClient;
  service: typeof KesselK8sPolicyServiceService;
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
