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

export const protobufPackage = "kessel.inventory.v1";

export interface GetLivezRequest {}

export interface GetLivezResponse {
  status?: string | undefined;
  code?: number | undefined;
}

export interface GetReadyzRequest {}

export interface GetReadyzResponse {
  status?: string | undefined;
  code?: number | undefined;
}

function createBaseGetLivezRequest(): GetLivezRequest {
  return {};
}

export const GetLivezRequest = {
  encode(
    _: GetLivezRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLivezRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLivezRequest();
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

  fromJSON(_: any): GetLivezRequest {
    return {};
  },

  toJSON(_: GetLivezRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetLivezRequest>, I>>(
    base?: I,
  ): GetLivezRequest {
    return GetLivezRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetLivezRequest>, I>>(
    _: I,
  ): GetLivezRequest {
    const message = createBaseGetLivezRequest();
    return message;
  },
};

function createBaseGetLivezResponse(): GetLivezResponse {
  return { status: "", code: 0 };
}

export const GetLivezResponse = {
  encode(
    message: GetLivezResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.status !== undefined && message.status !== "") {
      writer.uint32(10).string(message.status);
    }
    if (message.code !== undefined && message.code !== 0) {
      writer.uint32(16).uint32(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLivezResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLivezResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.status = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.code = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetLivezResponse {
    return {
      status: isSet(object.status) ? globalThis.String(object.status) : "",
      code: isSet(object.code) ? globalThis.Number(object.code) : 0,
    };
  },

  toJSON(message: GetLivezResponse): unknown {
    const obj: any = {};
    if (message.status !== undefined && message.status !== "") {
      obj.status = message.status;
    }
    if (message.code !== undefined && message.code !== 0) {
      obj.code = Math.round(message.code);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetLivezResponse>, I>>(
    base?: I,
  ): GetLivezResponse {
    return GetLivezResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetLivezResponse>, I>>(
    object: I,
  ): GetLivezResponse {
    const message = createBaseGetLivezResponse();
    message.status = object.status ?? "";
    message.code = object.code ?? 0;
    return message;
  },
};

function createBaseGetReadyzRequest(): GetReadyzRequest {
  return {};
}

export const GetReadyzRequest = {
  encode(
    _: GetReadyzRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetReadyzRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetReadyzRequest();
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

  fromJSON(_: any): GetReadyzRequest {
    return {};
  },

  toJSON(_: GetReadyzRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetReadyzRequest>, I>>(
    base?: I,
  ): GetReadyzRequest {
    return GetReadyzRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetReadyzRequest>, I>>(
    _: I,
  ): GetReadyzRequest {
    const message = createBaseGetReadyzRequest();
    return message;
  },
};

function createBaseGetReadyzResponse(): GetReadyzResponse {
  return { status: "", code: 0 };
}

export const GetReadyzResponse = {
  encode(
    message: GetReadyzResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.status !== undefined && message.status !== "") {
      writer.uint32(10).string(message.status);
    }
    if (message.code !== undefined && message.code !== 0) {
      writer.uint32(16).uint32(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetReadyzResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetReadyzResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.status = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.code = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetReadyzResponse {
    return {
      status: isSet(object.status) ? globalThis.String(object.status) : "",
      code: isSet(object.code) ? globalThis.Number(object.code) : 0,
    };
  },

  toJSON(message: GetReadyzResponse): unknown {
    const obj: any = {};
    if (message.status !== undefined && message.status !== "") {
      obj.status = message.status;
    }
    if (message.code !== undefined && message.code !== 0) {
      obj.code = Math.round(message.code);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetReadyzResponse>, I>>(
    base?: I,
  ): GetReadyzResponse {
    return GetReadyzResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetReadyzResponse>, I>>(
    object: I,
  ): GetReadyzResponse {
    const message = createBaseGetReadyzResponse();
    message.status = object.status ?? "";
    message.code = object.code ?? 0;
    return message;
  },
};

export type KesselInventoryHealthServiceDefinition =
  typeof KesselInventoryHealthServiceDefinition;
export const KesselInventoryHealthServiceDefinition = {
  name: "KesselInventoryHealthService",
  fullName: "kessel.inventory.v1.KesselInventoryHealthService",
  methods: {
    getLivez: {
      name: "GetLivez",
      requestType: GetLivezRequest,
      requestStream: false,
      responseType: GetLivezResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              25, 18, 23, 47, 97, 112, 105, 47, 105, 110, 118, 101, 110, 116,
              111, 114, 121, 47, 118, 49, 47, 108, 105, 118, 101, 122,
            ]),
          ],
        },
      },
    },
    getReadyz: {
      name: "GetReadyz",
      requestType: GetReadyzRequest,
      requestStream: false,
      responseType: GetReadyzResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              26, 18, 24, 47, 97, 112, 105, 47, 105, 110, 118, 101, 110, 116,
              111, 114, 121, 47, 118, 49, 47, 114, 101, 97, 100, 121, 122,
            ]),
          ],
        },
      },
    },
  },
} as const;

export type KesselInventoryHealthServiceService =
  typeof KesselInventoryHealthServiceService;
export const KesselInventoryHealthServiceService = {
  getLivez: {
    path: "/kessel.inventory.v1.KesselInventoryHealthService/GetLivez",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetLivezRequest) =>
      Buffer.from(GetLivezRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetLivezRequest.decode(value),
    responseSerialize: (value: GetLivezResponse) =>
      Buffer.from(GetLivezResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetLivezResponse.decode(value),
  },
  getReadyz: {
    path: "/kessel.inventory.v1.KesselInventoryHealthService/GetReadyz",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetReadyzRequest) =>
      Buffer.from(GetReadyzRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetReadyzRequest.decode(value),
    responseSerialize: (value: GetReadyzResponse) =>
      Buffer.from(GetReadyzResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetReadyzResponse.decode(value),
  },
} as const;

export interface KesselInventoryHealthServiceServer
  extends UntypedServiceImplementation {
  getLivez: handleUnaryCall<GetLivezRequest, GetLivezResponse>;
  getReadyz: handleUnaryCall<GetReadyzRequest, GetReadyzResponse>;
}

export interface KesselInventoryHealthServiceClient extends Client {
  getLivez(
    request: GetLivezRequest,
    callback: (error: ServiceError | null, response: GetLivezResponse) => void,
  ): ClientUnaryCall;
  getLivez(
    request: GetLivezRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetLivezResponse) => void,
  ): ClientUnaryCall;
  getLivez(
    request: GetLivezRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetLivezResponse) => void,
  ): ClientUnaryCall;
  getReadyz(
    request: GetReadyzRequest,
    callback: (error: ServiceError | null, response: GetReadyzResponse) => void,
  ): ClientUnaryCall;
  getReadyz(
    request: GetReadyzRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetReadyzResponse) => void,
  ): ClientUnaryCall;
  getReadyz(
    request: GetReadyzRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetReadyzResponse) => void,
  ): ClientUnaryCall;
}

export const KesselInventoryHealthServiceClient = makeGenericClientConstructor(
  KesselInventoryHealthServiceService,
  "kessel.inventory.v1.KesselInventoryHealthService",
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>,
  ): KesselInventoryHealthServiceClient;
  service: typeof KesselInventoryHealthServiceService;
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
