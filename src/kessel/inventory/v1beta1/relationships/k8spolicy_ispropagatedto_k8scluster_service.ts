/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import _m0 from "protobufjs/minimal";
import { K8SPolicyIsPropagatedToK8SCluster } from "./k8spolicy_ispropagatedto_k8scluster";
import { ReporterData } from "./reporter_data";

export const protobufPackage = "kessel.inventory.v1beta1.relationships";

export interface CreateK8SPolicyIsPropagatedToK8SClusterRequest {
  /** The resource relationship to create in Kessel Asset Inventory */
  k8spolicyIspropagatedtoK8scluster?:
    | K8SPolicyIsPropagatedToK8SCluster
    | undefined;
}

export interface CreateK8SPolicyIsPropagatedToK8SClusterResponse {}

export interface UpdateK8SPolicyIsPropagatedToK8SClusterRequest {
  /**
   * The resource-relationship to be updated will be defined by
   * \"<reporter_data.reporter_type>:<reporter_instance_id>:<reporter_data.subject_local_resource_id>\"
   * AND \"<reporter_data.reporter_type>:<reporter_instance_id>:<reporter_data.object_local_resource_id>\"
   * from the request body.
   */
  k8spolicyIspropagatedtoK8scluster?:
    | K8SPolicyIsPropagatedToK8SCluster
    | undefined;
}

export interface UpdateK8SPolicyIsPropagatedToK8SClusterResponse {}

export interface DeleteK8SPolicyIsPropagatedToK8SClusterRequest {
  /**
   * The resource-relationship to be deleted will be defined by
   * \"<reporter_data.reporter_type>:<reporter_instance_id>:<reporter_data.subject_local_resource_id>\"
   * AND \"<reporter_data.reporter_type>:<reporter_instance_id>:<reporter_data.object_local_resource_id>\"
   * from the request body.
   */
  reporterData?: ReporterData | undefined;
}

export interface DeleteK8SPolicyIsPropagatedToK8SClusterResponse {}

function createBaseCreateK8SPolicyIsPropagatedToK8SClusterRequest(): CreateK8SPolicyIsPropagatedToK8SClusterRequest {
  return { k8spolicyIspropagatedtoK8scluster: undefined };
}

export const CreateK8SPolicyIsPropagatedToK8SClusterRequest = {
  encode(
    message: CreateK8SPolicyIsPropagatedToK8SClusterRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.k8spolicyIspropagatedtoK8scluster !== undefined) {
      K8SPolicyIsPropagatedToK8SCluster.encode(
        message.k8spolicyIspropagatedtoK8scluster,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): CreateK8SPolicyIsPropagatedToK8SClusterRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateK8SPolicyIsPropagatedToK8SClusterRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.k8spolicyIspropagatedtoK8scluster =
            K8SPolicyIsPropagatedToK8SCluster.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateK8SPolicyIsPropagatedToK8SClusterRequest {
    return {
      k8spolicyIspropagatedtoK8scluster: isSet(
        object["k8s-policy_is-propagated-to_k8s-cluster"],
      )
        ? K8SPolicyIsPropagatedToK8SCluster.fromJSON(
            object["k8s-policy_is-propagated-to_k8s-cluster"],
          )
        : undefined,
    };
  },

  toJSON(message: CreateK8SPolicyIsPropagatedToK8SClusterRequest): unknown {
    const obj: any = {};
    if (message.k8spolicyIspropagatedtoK8scluster !== undefined) {
      obj["k8s-policy_is-propagated-to_k8s-cluster"] =
        K8SPolicyIsPropagatedToK8SCluster.toJSON(
          message.k8spolicyIspropagatedtoK8scluster,
        );
    }
    return obj;
  },

  create<
    I extends Exact<
      DeepPartial<CreateK8SPolicyIsPropagatedToK8SClusterRequest>,
      I
    >,
  >(base?: I): CreateK8SPolicyIsPropagatedToK8SClusterRequest {
    return CreateK8SPolicyIsPropagatedToK8SClusterRequest.fromPartial(
      base ?? ({} as any),
    );
  },
  fromPartial<
    I extends Exact<
      DeepPartial<CreateK8SPolicyIsPropagatedToK8SClusterRequest>,
      I
    >,
  >(object: I): CreateK8SPolicyIsPropagatedToK8SClusterRequest {
    const message = createBaseCreateK8SPolicyIsPropagatedToK8SClusterRequest();
    message.k8spolicyIspropagatedtoK8scluster =
      object.k8spolicyIspropagatedtoK8scluster !== undefined &&
      object.k8spolicyIspropagatedtoK8scluster !== null
        ? K8SPolicyIsPropagatedToK8SCluster.fromPartial(
            object.k8spolicyIspropagatedtoK8scluster,
          )
        : undefined;
    return message;
  },
};

function createBaseCreateK8SPolicyIsPropagatedToK8SClusterResponse(): CreateK8SPolicyIsPropagatedToK8SClusterResponse {
  return {};
}

export const CreateK8SPolicyIsPropagatedToK8SClusterResponse = {
  encode(
    _: CreateK8SPolicyIsPropagatedToK8SClusterResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): CreateK8SPolicyIsPropagatedToK8SClusterResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateK8SPolicyIsPropagatedToK8SClusterResponse();
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

  fromJSON(_: any): CreateK8SPolicyIsPropagatedToK8SClusterResponse {
    return {};
  },

  toJSON(_: CreateK8SPolicyIsPropagatedToK8SClusterResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<
    I extends Exact<
      DeepPartial<CreateK8SPolicyIsPropagatedToK8SClusterResponse>,
      I
    >,
  >(base?: I): CreateK8SPolicyIsPropagatedToK8SClusterResponse {
    return CreateK8SPolicyIsPropagatedToK8SClusterResponse.fromPartial(
      base ?? ({} as any),
    );
  },
  fromPartial<
    I extends Exact<
      DeepPartial<CreateK8SPolicyIsPropagatedToK8SClusterResponse>,
      I
    >,
  >(_: I): CreateK8SPolicyIsPropagatedToK8SClusterResponse {
    const message = createBaseCreateK8SPolicyIsPropagatedToK8SClusterResponse();
    return message;
  },
};

function createBaseUpdateK8SPolicyIsPropagatedToK8SClusterRequest(): UpdateK8SPolicyIsPropagatedToK8SClusterRequest {
  return { k8spolicyIspropagatedtoK8scluster: undefined };
}

export const UpdateK8SPolicyIsPropagatedToK8SClusterRequest = {
  encode(
    message: UpdateK8SPolicyIsPropagatedToK8SClusterRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.k8spolicyIspropagatedtoK8scluster !== undefined) {
      K8SPolicyIsPropagatedToK8SCluster.encode(
        message.k8spolicyIspropagatedtoK8scluster,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): UpdateK8SPolicyIsPropagatedToK8SClusterRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateK8SPolicyIsPropagatedToK8SClusterRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.k8spolicyIspropagatedtoK8scluster =
            K8SPolicyIsPropagatedToK8SCluster.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateK8SPolicyIsPropagatedToK8SClusterRequest {
    return {
      k8spolicyIspropagatedtoK8scluster: isSet(
        object["k8s-policy_is-propagated-to_k8s-cluster"],
      )
        ? K8SPolicyIsPropagatedToK8SCluster.fromJSON(
            object["k8s-policy_is-propagated-to_k8s-cluster"],
          )
        : undefined,
    };
  },

  toJSON(message: UpdateK8SPolicyIsPropagatedToK8SClusterRequest): unknown {
    const obj: any = {};
    if (message.k8spolicyIspropagatedtoK8scluster !== undefined) {
      obj["k8s-policy_is-propagated-to_k8s-cluster"] =
        K8SPolicyIsPropagatedToK8SCluster.toJSON(
          message.k8spolicyIspropagatedtoK8scluster,
        );
    }
    return obj;
  },

  create<
    I extends Exact<
      DeepPartial<UpdateK8SPolicyIsPropagatedToK8SClusterRequest>,
      I
    >,
  >(base?: I): UpdateK8SPolicyIsPropagatedToK8SClusterRequest {
    return UpdateK8SPolicyIsPropagatedToK8SClusterRequest.fromPartial(
      base ?? ({} as any),
    );
  },
  fromPartial<
    I extends Exact<
      DeepPartial<UpdateK8SPolicyIsPropagatedToK8SClusterRequest>,
      I
    >,
  >(object: I): UpdateK8SPolicyIsPropagatedToK8SClusterRequest {
    const message = createBaseUpdateK8SPolicyIsPropagatedToK8SClusterRequest();
    message.k8spolicyIspropagatedtoK8scluster =
      object.k8spolicyIspropagatedtoK8scluster !== undefined &&
      object.k8spolicyIspropagatedtoK8scluster !== null
        ? K8SPolicyIsPropagatedToK8SCluster.fromPartial(
            object.k8spolicyIspropagatedtoK8scluster,
          )
        : undefined;
    return message;
  },
};

function createBaseUpdateK8SPolicyIsPropagatedToK8SClusterResponse(): UpdateK8SPolicyIsPropagatedToK8SClusterResponse {
  return {};
}

export const UpdateK8SPolicyIsPropagatedToK8SClusterResponse = {
  encode(
    _: UpdateK8SPolicyIsPropagatedToK8SClusterResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): UpdateK8SPolicyIsPropagatedToK8SClusterResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateK8SPolicyIsPropagatedToK8SClusterResponse();
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

  fromJSON(_: any): UpdateK8SPolicyIsPropagatedToK8SClusterResponse {
    return {};
  },

  toJSON(_: UpdateK8SPolicyIsPropagatedToK8SClusterResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<
    I extends Exact<
      DeepPartial<UpdateK8SPolicyIsPropagatedToK8SClusterResponse>,
      I
    >,
  >(base?: I): UpdateK8SPolicyIsPropagatedToK8SClusterResponse {
    return UpdateK8SPolicyIsPropagatedToK8SClusterResponse.fromPartial(
      base ?? ({} as any),
    );
  },
  fromPartial<
    I extends Exact<
      DeepPartial<UpdateK8SPolicyIsPropagatedToK8SClusterResponse>,
      I
    >,
  >(_: I): UpdateK8SPolicyIsPropagatedToK8SClusterResponse {
    const message = createBaseUpdateK8SPolicyIsPropagatedToK8SClusterResponse();
    return message;
  },
};

function createBaseDeleteK8SPolicyIsPropagatedToK8SClusterRequest(): DeleteK8SPolicyIsPropagatedToK8SClusterRequest {
  return { reporterData: undefined };
}

export const DeleteK8SPolicyIsPropagatedToK8SClusterRequest = {
  encode(
    message: DeleteK8SPolicyIsPropagatedToK8SClusterRequest,
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
  ): DeleteK8SPolicyIsPropagatedToK8SClusterRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteK8SPolicyIsPropagatedToK8SClusterRequest();
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

  fromJSON(object: any): DeleteK8SPolicyIsPropagatedToK8SClusterRequest {
    return {
      reporterData: isSet(object.reporter_data)
        ? ReporterData.fromJSON(object.reporter_data)
        : undefined,
    };
  },

  toJSON(message: DeleteK8SPolicyIsPropagatedToK8SClusterRequest): unknown {
    const obj: any = {};
    if (message.reporterData !== undefined) {
      obj.reporter_data = ReporterData.toJSON(message.reporterData);
    }
    return obj;
  },

  create<
    I extends Exact<
      DeepPartial<DeleteK8SPolicyIsPropagatedToK8SClusterRequest>,
      I
    >,
  >(base?: I): DeleteK8SPolicyIsPropagatedToK8SClusterRequest {
    return DeleteK8SPolicyIsPropagatedToK8SClusterRequest.fromPartial(
      base ?? ({} as any),
    );
  },
  fromPartial<
    I extends Exact<
      DeepPartial<DeleteK8SPolicyIsPropagatedToK8SClusterRequest>,
      I
    >,
  >(object: I): DeleteK8SPolicyIsPropagatedToK8SClusterRequest {
    const message = createBaseDeleteK8SPolicyIsPropagatedToK8SClusterRequest();
    message.reporterData =
      object.reporterData !== undefined && object.reporterData !== null
        ? ReporterData.fromPartial(object.reporterData)
        : undefined;
    return message;
  },
};

function createBaseDeleteK8SPolicyIsPropagatedToK8SClusterResponse(): DeleteK8SPolicyIsPropagatedToK8SClusterResponse {
  return {};
}

export const DeleteK8SPolicyIsPropagatedToK8SClusterResponse = {
  encode(
    _: DeleteK8SPolicyIsPropagatedToK8SClusterResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): DeleteK8SPolicyIsPropagatedToK8SClusterResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteK8SPolicyIsPropagatedToK8SClusterResponse();
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

  fromJSON(_: any): DeleteK8SPolicyIsPropagatedToK8SClusterResponse {
    return {};
  },

  toJSON(_: DeleteK8SPolicyIsPropagatedToK8SClusterResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<
    I extends Exact<
      DeepPartial<DeleteK8SPolicyIsPropagatedToK8SClusterResponse>,
      I
    >,
  >(base?: I): DeleteK8SPolicyIsPropagatedToK8SClusterResponse {
    return DeleteK8SPolicyIsPropagatedToK8SClusterResponse.fromPartial(
      base ?? ({} as any),
    );
  },
  fromPartial<
    I extends Exact<
      DeepPartial<DeleteK8SPolicyIsPropagatedToK8SClusterResponse>,
      I
    >,
  >(_: I): DeleteK8SPolicyIsPropagatedToK8SClusterResponse {
    const message = createBaseDeleteK8SPolicyIsPropagatedToK8SClusterResponse();
    return message;
  },
};

export type KesselK8SPolicyIsPropagatedToK8SClusterServiceDefinition =
  typeof KesselK8SPolicyIsPropagatedToK8SClusterServiceDefinition;
export const KesselK8SPolicyIsPropagatedToK8SClusterServiceDefinition = {
  name: "KesselK8SPolicyIsPropagatedToK8SClusterService",
  fullName:
    "kessel.inventory.v1beta1.relationships.KesselK8SPolicyIsPropagatedToK8SClusterService",
  methods: {
    createK8SPolicyIsPropagatedToK8SCluster: {
      name: "CreateK8SPolicyIsPropagatedToK8SCluster",
      requestType: CreateK8SPolicyIsPropagatedToK8SClusterRequest,
      requestStream: false,
      responseType: CreateK8SPolicyIsPropagatedToK8SClusterResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              90, 58, 1, 42, 34, 85, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 49, 47,
              114, 101, 115, 111, 117, 114, 99, 101, 45, 114, 101, 108, 97, 116,
              105, 111, 110, 115, 104, 105, 112, 115, 47, 107, 56, 115, 45, 112,
              111, 108, 105, 99, 121, 95, 105, 115, 45, 112, 114, 111, 112, 97,
              103, 97, 116, 101, 100, 45, 116, 111, 95, 107, 56, 115, 45, 99,
              108, 117, 115, 116, 101, 114,
            ]),
          ],
        },
      },
    },
    updateK8SPolicyIsPropagatedToK8SCluster: {
      name: "UpdateK8SPolicyIsPropagatedToK8SCluster",
      requestType: UpdateK8SPolicyIsPropagatedToK8SClusterRequest,
      requestStream: false,
      responseType: UpdateK8SPolicyIsPropagatedToK8SClusterResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              90, 58, 1, 42, 26, 85, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 49, 47,
              114, 101, 115, 111, 117, 114, 99, 101, 45, 114, 101, 108, 97, 116,
              105, 111, 110, 115, 104, 105, 112, 115, 47, 107, 56, 115, 45, 112,
              111, 108, 105, 99, 121, 95, 105, 115, 45, 112, 114, 111, 112, 97,
              103, 97, 116, 101, 100, 45, 116, 111, 95, 107, 56, 115, 45, 99,
              108, 117, 115, 116, 101, 114,
            ]),
          ],
        },
      },
    },
    deleteK8SPolicyIsPropagatedToK8SCluster: {
      name: "DeleteK8SPolicyIsPropagatedToK8SCluster",
      requestType: DeleteK8SPolicyIsPropagatedToK8SClusterRequest,
      requestStream: false,
      responseType: DeleteK8SPolicyIsPropagatedToK8SClusterResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              90, 58, 1, 42, 42, 85, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 49, 47,
              114, 101, 115, 111, 117, 114, 99, 101, 45, 114, 101, 108, 97, 116,
              105, 111, 110, 115, 104, 105, 112, 115, 47, 107, 56, 115, 45, 112,
              111, 108, 105, 99, 121, 95, 105, 115, 45, 112, 114, 111, 112, 97,
              103, 97, 116, 101, 100, 45, 116, 111, 95, 107, 56, 115, 45, 99,
              108, 117, 115, 116, 101, 114,
            ]),
          ],
        },
      },
    },
  },
} as const;

export interface KesselK8SPolicyIsPropagatedToK8SClusterServiceImplementation<
  CallContextExt = {},
> {
  createK8SPolicyIsPropagatedToK8SCluster(
    request: CreateK8SPolicyIsPropagatedToK8SClusterRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<CreateK8SPolicyIsPropagatedToK8SClusterResponse>>;
  updateK8SPolicyIsPropagatedToK8SCluster(
    request: UpdateK8SPolicyIsPropagatedToK8SClusterRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<UpdateK8SPolicyIsPropagatedToK8SClusterResponse>>;
  deleteK8SPolicyIsPropagatedToK8SCluster(
    request: DeleteK8SPolicyIsPropagatedToK8SClusterRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<DeleteK8SPolicyIsPropagatedToK8SClusterResponse>>;
}

export interface KesselK8SPolicyIsPropagatedToK8SClusterServiceClient<
  CallOptionsExt = {},
> {
  createK8SPolicyIsPropagatedToK8SCluster(
    request: DeepPartial<CreateK8SPolicyIsPropagatedToK8SClusterRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<CreateK8SPolicyIsPropagatedToK8SClusterResponse>;
  updateK8SPolicyIsPropagatedToK8SCluster(
    request: DeepPartial<UpdateK8SPolicyIsPropagatedToK8SClusterRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<UpdateK8SPolicyIsPropagatedToK8SClusterResponse>;
  deleteK8SPolicyIsPropagatedToK8SCluster(
    request: DeepPartial<DeleteK8SPolicyIsPropagatedToK8SClusterRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<DeleteK8SPolicyIsPropagatedToK8SClusterResponse>;
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
