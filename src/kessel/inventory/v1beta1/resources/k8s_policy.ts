/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { K8sPolicyDetail } from "./k8s_policy_detail";
import { Metadata } from "./metadata";
import { ReporterData } from "./reporter_data";

export const protobufPackage = "kessel.inventory.v1beta1.resources";

export interface K8sPolicy {
  /** Metadata about this resource */
  metadata?: Metadata | undefined;
  /** Write only reporter specific data */
  reporterData?: ReporterData | undefined;
  resourceData?: K8sPolicyDetail | undefined;
}

function createBaseK8sPolicy(): K8sPolicy {
  return {
    metadata: undefined,
    reporterData: undefined,
    resourceData: undefined,
  };
}

export const K8sPolicy = {
  encode(
    message: K8sPolicy,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.metadata !== undefined) {
      Metadata.encode(message.metadata, writer.uint32(10).fork()).ldelim();
    }
    if (message.reporterData !== undefined) {
      ReporterData.encode(
        message.reporterData,
        writer.uint32(1962230338).fork(),
      ).ldelim();
    }
    if (message.resourceData !== undefined) {
      K8sPolicyDetail.encode(
        message.resourceData,
        writer.uint32(16981586).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): K8sPolicy {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseK8sPolicy();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.metadata = Metadata.decode(reader, reader.uint32());
          continue;
        case 245278792:
          if (tag !== 1962230338) {
            break;
          }

          message.reporterData = ReporterData.decode(reader, reader.uint32());
          continue;
        case 2122698:
          if (tag !== 16981586) {
            break;
          }

          message.resourceData = K8sPolicyDetail.decode(
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

  fromJSON(object: any): K8sPolicy {
    return {
      metadata: isSet(object.metadata)
        ? Metadata.fromJSON(object.metadata)
        : undefined,
      reporterData: isSet(object.reporter_data)
        ? ReporterData.fromJSON(object.reporter_data)
        : undefined,
      resourceData: isSet(object.resource_data)
        ? K8sPolicyDetail.fromJSON(object.resource_data)
        : undefined,
    };
  },

  toJSON(message: K8sPolicy): unknown {
    const obj: any = {};
    if (message.metadata !== undefined) {
      obj.metadata = Metadata.toJSON(message.metadata);
    }
    if (message.reporterData !== undefined) {
      obj.reporter_data = ReporterData.toJSON(message.reporterData);
    }
    if (message.resourceData !== undefined) {
      obj.resource_data = K8sPolicyDetail.toJSON(message.resourceData);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<K8sPolicy>, I>>(base?: I): K8sPolicy {
    return K8sPolicy.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<K8sPolicy>, I>>(
    object: I,
  ): K8sPolicy {
    const message = createBaseK8sPolicy();
    message.metadata =
      object.metadata !== undefined && object.metadata !== null
        ? Metadata.fromPartial(object.metadata)
        : undefined;
    message.reporterData =
      object.reporterData !== undefined && object.reporterData !== null
        ? ReporterData.fromPartial(object.reporterData)
        : undefined;
    message.resourceData =
      object.resourceData !== undefined && object.resourceData !== null
        ? K8sPolicyDetail.fromPartial(object.resourceData)
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
