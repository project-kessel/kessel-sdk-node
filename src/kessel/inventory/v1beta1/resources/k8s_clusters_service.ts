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
import { K8sCluster } from "./k8s_cluster";
import { ReporterData } from "./reporter_data";

export const protobufPackage = "kessel.inventory.v1beta1.resources";

export interface CreateK8sClusterRequest {
  /** The k8s cluster to create in Kessel Asset Inventory */
  k8sCluster?: K8sCluster | undefined;
}

export interface CreateK8sClusterResponse {}

export interface UpdateK8sClusterRequest {
  /**
   * The resource to be updated will be defined by
   * \"<reporter_data.reporter_type>:<reporter_instaance_id>:<reporter_data.local_resource_id>\"
   * from the request body.
   */
  k8sCluster?: K8sCluster | undefined;
}

export interface UpdateK8sClusterResponse {}

export interface DeleteK8sClusterRequest {
  /**
   * The resource to be deleted will be defined by
   * \"<reporter_data.reporter_type>:<reporter_instaance_id>:<reporter_data.local_resource_id>\"
   * from the request body.
   */
  reporterData?: ReporterData | undefined;
}

export interface DeleteK8sClusterResponse {}

function createBaseCreateK8sClusterRequest(): CreateK8sClusterRequest {
  return { k8sCluster: undefined };
}

export const CreateK8sClusterRequest = {
  encode(
    message: CreateK8sClusterRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.k8sCluster !== undefined) {
      K8sCluster.encode(message.k8sCluster, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): CreateK8sClusterRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateK8sClusterRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.k8sCluster = K8sCluster.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateK8sClusterRequest {
    return {
      k8sCluster: isSet(object.k8s_cluster)
        ? K8sCluster.fromJSON(object.k8s_cluster)
        : undefined,
    };
  },

  toJSON(message: CreateK8sClusterRequest): unknown {
    const obj: any = {};
    if (message.k8sCluster !== undefined) {
      obj.k8s_cluster = K8sCluster.toJSON(message.k8sCluster);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateK8sClusterRequest>, I>>(
    base?: I,
  ): CreateK8sClusterRequest {
    return CreateK8sClusterRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateK8sClusterRequest>, I>>(
    object: I,
  ): CreateK8sClusterRequest {
    const message = createBaseCreateK8sClusterRequest();
    message.k8sCluster =
      object.k8sCluster !== undefined && object.k8sCluster !== null
        ? K8sCluster.fromPartial(object.k8sCluster)
        : undefined;
    return message;
  },
};

function createBaseCreateK8sClusterResponse(): CreateK8sClusterResponse {
  return {};
}

export const CreateK8sClusterResponse = {
  encode(
    _: CreateK8sClusterResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): CreateK8sClusterResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateK8sClusterResponse();
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

  fromJSON(_: any): CreateK8sClusterResponse {
    return {};
  },

  toJSON(_: CreateK8sClusterResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateK8sClusterResponse>, I>>(
    base?: I,
  ): CreateK8sClusterResponse {
    return CreateK8sClusterResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateK8sClusterResponse>, I>>(
    _: I,
  ): CreateK8sClusterResponse {
    const message = createBaseCreateK8sClusterResponse();
    return message;
  },
};

function createBaseUpdateK8sClusterRequest(): UpdateK8sClusterRequest {
  return { k8sCluster: undefined };
}

export const UpdateK8sClusterRequest = {
  encode(
    message: UpdateK8sClusterRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.k8sCluster !== undefined) {
      K8sCluster.encode(message.k8sCluster, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): UpdateK8sClusterRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateK8sClusterRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.k8sCluster = K8sCluster.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateK8sClusterRequest {
    return {
      k8sCluster: isSet(object.k8s_cluster)
        ? K8sCluster.fromJSON(object.k8s_cluster)
        : undefined,
    };
  },

  toJSON(message: UpdateK8sClusterRequest): unknown {
    const obj: any = {};
    if (message.k8sCluster !== undefined) {
      obj.k8s_cluster = K8sCluster.toJSON(message.k8sCluster);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateK8sClusterRequest>, I>>(
    base?: I,
  ): UpdateK8sClusterRequest {
    return UpdateK8sClusterRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateK8sClusterRequest>, I>>(
    object: I,
  ): UpdateK8sClusterRequest {
    const message = createBaseUpdateK8sClusterRequest();
    message.k8sCluster =
      object.k8sCluster !== undefined && object.k8sCluster !== null
        ? K8sCluster.fromPartial(object.k8sCluster)
        : undefined;
    return message;
  },
};

function createBaseUpdateK8sClusterResponse(): UpdateK8sClusterResponse {
  return {};
}

export const UpdateK8sClusterResponse = {
  encode(
    _: UpdateK8sClusterResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): UpdateK8sClusterResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateK8sClusterResponse();
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

  fromJSON(_: any): UpdateK8sClusterResponse {
    return {};
  },

  toJSON(_: UpdateK8sClusterResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateK8sClusterResponse>, I>>(
    base?: I,
  ): UpdateK8sClusterResponse {
    return UpdateK8sClusterResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateK8sClusterResponse>, I>>(
    _: I,
  ): UpdateK8sClusterResponse {
    const message = createBaseUpdateK8sClusterResponse();
    return message;
  },
};

function createBaseDeleteK8sClusterRequest(): DeleteK8sClusterRequest {
  return { reporterData: undefined };
}

export const DeleteK8sClusterRequest = {
  encode(
    message: DeleteK8sClusterRequest,
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
  ): DeleteK8sClusterRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteK8sClusterRequest();
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

  fromJSON(object: any): DeleteK8sClusterRequest {
    return {
      reporterData: isSet(object.reporter_data)
        ? ReporterData.fromJSON(object.reporter_data)
        : undefined,
    };
  },

  toJSON(message: DeleteK8sClusterRequest): unknown {
    const obj: any = {};
    if (message.reporterData !== undefined) {
      obj.reporter_data = ReporterData.toJSON(message.reporterData);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteK8sClusterRequest>, I>>(
    base?: I,
  ): DeleteK8sClusterRequest {
    return DeleteK8sClusterRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeleteK8sClusterRequest>, I>>(
    object: I,
  ): DeleteK8sClusterRequest {
    const message = createBaseDeleteK8sClusterRequest();
    message.reporterData =
      object.reporterData !== undefined && object.reporterData !== null
        ? ReporterData.fromPartial(object.reporterData)
        : undefined;
    return message;
  },
};

function createBaseDeleteK8sClusterResponse(): DeleteK8sClusterResponse {
  return {};
}

export const DeleteK8sClusterResponse = {
  encode(
    _: DeleteK8sClusterResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): DeleteK8sClusterResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteK8sClusterResponse();
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

  fromJSON(_: any): DeleteK8sClusterResponse {
    return {};
  },

  toJSON(_: DeleteK8sClusterResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteK8sClusterResponse>, I>>(
    base?: I,
  ): DeleteK8sClusterResponse {
    return DeleteK8sClusterResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeleteK8sClusterResponse>, I>>(
    _: I,
  ): DeleteK8sClusterResponse {
    const message = createBaseDeleteK8sClusterResponse();
    return message;
  },
};

export type KesselK8sClusterServiceDefinition =
  typeof KesselK8sClusterServiceDefinition;
export const KesselK8sClusterServiceDefinition = {
  name: "KesselK8sClusterService",
  fullName: "kessel.inventory.v1beta1.resources.KesselK8sClusterService",
  methods: {
    createK8sCluster: {
      name: "CreateK8sCluster",
      requestType: CreateK8sClusterRequest,
      requestStream: false,
      responseType: CreateK8sClusterResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              50, 58, 1, 42, 34, 45, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 49, 47,
              114, 101, 115, 111, 117, 114, 99, 101, 115, 47, 107, 56, 115, 45,
              99, 108, 117, 115, 116, 101, 114, 115,
            ]),
          ],
        },
      },
    },
    updateK8sCluster: {
      name: "UpdateK8sCluster",
      requestType: UpdateK8sClusterRequest,
      requestStream: false,
      responseType: UpdateK8sClusterResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              50, 58, 1, 42, 26, 45, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 49, 47,
              114, 101, 115, 111, 117, 114, 99, 101, 115, 47, 107, 56, 115, 45,
              99, 108, 117, 115, 116, 101, 114, 115,
            ]),
          ],
        },
      },
    },
    deleteK8sCluster: {
      name: "DeleteK8sCluster",
      requestType: DeleteK8sClusterRequest,
      requestStream: false,
      responseType: DeleteK8sClusterResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              50, 58, 1, 42, 42, 45, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 49, 47,
              114, 101, 115, 111, 117, 114, 99, 101, 115, 47, 107, 56, 115, 45,
              99, 108, 117, 115, 116, 101, 114, 115,
            ]),
          ],
        },
      },
    },
  },
} as const;

export type KesselK8sClusterServiceService =
  typeof KesselK8sClusterServiceService;
export const KesselK8sClusterServiceService = {
  createK8SCluster: {
    path: "/kessel.inventory.v1beta1.resources.KesselK8sClusterService/CreateK8sCluster",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateK8sClusterRequest) =>
      Buffer.from(CreateK8sClusterRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      CreateK8sClusterRequest.decode(value),
    responseSerialize: (value: CreateK8sClusterResponse) =>
      Buffer.from(CreateK8sClusterResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CreateK8sClusterResponse.decode(value),
  },
  updateK8SCluster: {
    path: "/kessel.inventory.v1beta1.resources.KesselK8sClusterService/UpdateK8sCluster",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateK8sClusterRequest) =>
      Buffer.from(UpdateK8sClusterRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      UpdateK8sClusterRequest.decode(value),
    responseSerialize: (value: UpdateK8sClusterResponse) =>
      Buffer.from(UpdateK8sClusterResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      UpdateK8sClusterResponse.decode(value),
  },
  deleteK8SCluster: {
    path: "/kessel.inventory.v1beta1.resources.KesselK8sClusterService/DeleteK8sCluster",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteK8sClusterRequest) =>
      Buffer.from(DeleteK8sClusterRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      DeleteK8sClusterRequest.decode(value),
    responseSerialize: (value: DeleteK8sClusterResponse) =>
      Buffer.from(DeleteK8sClusterResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      DeleteK8sClusterResponse.decode(value),
  },
} as const;

export interface KesselK8sClusterServiceServer
  extends UntypedServiceImplementation {
  createK8SCluster: handleUnaryCall<
    CreateK8sClusterRequest,
    CreateK8sClusterResponse
  >;
  updateK8SCluster: handleUnaryCall<
    UpdateK8sClusterRequest,
    UpdateK8sClusterResponse
  >;
  deleteK8SCluster: handleUnaryCall<
    DeleteK8sClusterRequest,
    DeleteK8sClusterResponse
  >;
}

export interface KesselK8sClusterServiceClient extends Client {
  createK8SCluster(
    request: CreateK8sClusterRequest,
    callback: (
      error: ServiceError | null,
      response: CreateK8sClusterResponse,
    ) => void,
  ): ClientUnaryCall;
  createK8SCluster(
    request: CreateK8sClusterRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CreateK8sClusterResponse,
    ) => void,
  ): ClientUnaryCall;
  createK8SCluster(
    request: CreateK8sClusterRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CreateK8sClusterResponse,
    ) => void,
  ): ClientUnaryCall;
  updateK8SCluster(
    request: UpdateK8sClusterRequest,
    callback: (
      error: ServiceError | null,
      response: UpdateK8sClusterResponse,
    ) => void,
  ): ClientUnaryCall;
  updateK8SCluster(
    request: UpdateK8sClusterRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: UpdateK8sClusterResponse,
    ) => void,
  ): ClientUnaryCall;
  updateK8SCluster(
    request: UpdateK8sClusterRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: UpdateK8sClusterResponse,
    ) => void,
  ): ClientUnaryCall;
  deleteK8SCluster(
    request: DeleteK8sClusterRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteK8sClusterResponse,
    ) => void,
  ): ClientUnaryCall;
  deleteK8SCluster(
    request: DeleteK8sClusterRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteK8sClusterResponse,
    ) => void,
  ): ClientUnaryCall;
  deleteK8SCluster(
    request: DeleteK8sClusterRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteK8sClusterResponse,
    ) => void,
  ): ClientUnaryCall;
}

export const KesselK8sClusterServiceClient = makeGenericClientConstructor(
  KesselK8sClusterServiceService,
  "kessel.inventory.v1beta1.resources.KesselK8sClusterService",
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>,
  ): KesselK8sClusterServiceClient;
  service: typeof KesselK8sClusterServiceService;
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
