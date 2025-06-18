/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { K8SPolicyIsPropagatedToK8SClusterDetail } from "./k8spolicy_ispropagatedto_k8scluster_detail";
import { Metadata } from "./metadata";
import { ReporterData } from "./reporter_data";

export const protobufPackage = "kessel.inventory.v1beta1.relationships";

export interface K8SPolicyIsPropagatedToK8SCluster {
  /** Metadata about this resource */
  metadata?: Metadata | undefined;
  /** Write only reporter specific data */
  reporterData?: ReporterData | undefined;
  relationshipData?: K8SPolicyIsPropagatedToK8SClusterDetail | undefined;
}

function createBaseK8SPolicyIsPropagatedToK8SCluster(): K8SPolicyIsPropagatedToK8SCluster {
  return {
    metadata: undefined,
    reporterData: undefined,
    relationshipData: undefined,
  };
}

export const K8SPolicyIsPropagatedToK8SCluster = {
  encode(
    message: K8SPolicyIsPropagatedToK8SCluster,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.metadata !== undefined) {
      Metadata.encode(message.metadata, writer.uint32(10).fork()).ldelim();
    }
    if (message.reporterData !== undefined) {
      ReporterData.encode(
        message.reporterData,
        writer.uint32(1962230346).fork(),
      ).ldelim();
    }
    if (message.relationshipData !== undefined) {
      K8SPolicyIsPropagatedToK8SClusterDetail.encode(
        message.relationshipData,
        writer.uint32(16981594).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): K8SPolicyIsPropagatedToK8SCluster {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseK8SPolicyIsPropagatedToK8SCluster();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.metadata = Metadata.decode(reader, reader.uint32());
          continue;
        case 245278793:
          if (tag !== 1962230346) {
            break;
          }

          message.reporterData = ReporterData.decode(reader, reader.uint32());
          continue;
        case 2122699:
          if (tag !== 16981594) {
            break;
          }

          message.relationshipData =
            K8SPolicyIsPropagatedToK8SClusterDetail.decode(
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

  fromJSON(object: any): K8SPolicyIsPropagatedToK8SCluster {
    return {
      metadata: isSet(object.metadata)
        ? Metadata.fromJSON(object.metadata)
        : undefined,
      reporterData: isSet(object.reporter_data)
        ? ReporterData.fromJSON(object.reporter_data)
        : undefined,
      relationshipData: isSet(object.relationship_data)
        ? K8SPolicyIsPropagatedToK8SClusterDetail.fromJSON(
            object.relationship_data,
          )
        : undefined,
    };
  },

  toJSON(message: K8SPolicyIsPropagatedToK8SCluster): unknown {
    const obj: any = {};
    if (message.metadata !== undefined) {
      obj.metadata = Metadata.toJSON(message.metadata);
    }
    if (message.reporterData !== undefined) {
      obj.reporter_data = ReporterData.toJSON(message.reporterData);
    }
    if (message.relationshipData !== undefined) {
      obj.relationship_data = K8SPolicyIsPropagatedToK8SClusterDetail.toJSON(
        message.relationshipData,
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<K8SPolicyIsPropagatedToK8SCluster>, I>>(
    base?: I,
  ): K8SPolicyIsPropagatedToK8SCluster {
    return K8SPolicyIsPropagatedToK8SCluster.fromPartial(base ?? ({} as any));
  },
  fromPartial<
    I extends Exact<DeepPartial<K8SPolicyIsPropagatedToK8SCluster>, I>,
  >(object: I): K8SPolicyIsPropagatedToK8SCluster {
    const message = createBaseK8SPolicyIsPropagatedToK8SCluster();
    message.metadata =
      object.metadata !== undefined && object.metadata !== null
        ? Metadata.fromPartial(object.metadata)
        : undefined;
    message.reporterData =
      object.reporterData !== undefined && object.reporterData !== null
        ? ReporterData.fromPartial(object.reporterData)
        : undefined;
    message.relationshipData =
      object.relationshipData !== undefined && object.relationshipData !== null
        ? K8SPolicyIsPropagatedToK8SClusterDetail.fromPartial(
            object.relationshipData,
          )
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
