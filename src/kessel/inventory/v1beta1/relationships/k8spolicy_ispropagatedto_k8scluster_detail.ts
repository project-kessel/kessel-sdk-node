/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "kessel.inventory.v1beta1.relationships";

export interface K8SPolicyIsPropagatedToK8SClusterDetail {
  /** The resource ID assigned to the resource by Kessel Asset Inventory. */
  k8sPolicyId?: string | undefined;
  /** The resource ID assigned to the resource by Kessel Asset Inventory. */
  k8sClusterId?: string | undefined;
  status?: K8SPolicyIsPropagatedToK8SClusterDetail_Status | undefined;
}

/** the aggregate status of the cluster */
export enum K8SPolicyIsPropagatedToK8SClusterDetail_Status {
  STATUS_UNSPECIFIED = 0,
  STATUS_OTHER = 1,
  VIOLATIONS = 2,
  NO_VIOLATIONS = 3,
  UNRECOGNIZED = -1,
}

export function k8SPolicyIsPropagatedToK8SClusterDetail_StatusFromJSON(
  object: any,
): K8SPolicyIsPropagatedToK8SClusterDetail_Status {
  switch (object) {
    case 0:
    case "STATUS_UNSPECIFIED":
      return K8SPolicyIsPropagatedToK8SClusterDetail_Status.STATUS_UNSPECIFIED;
    case 1:
    case "STATUS_OTHER":
      return K8SPolicyIsPropagatedToK8SClusterDetail_Status.STATUS_OTHER;
    case 2:
    case "VIOLATIONS":
      return K8SPolicyIsPropagatedToK8SClusterDetail_Status.VIOLATIONS;
    case 3:
    case "NO_VIOLATIONS":
      return K8SPolicyIsPropagatedToK8SClusterDetail_Status.NO_VIOLATIONS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return K8SPolicyIsPropagatedToK8SClusterDetail_Status.UNRECOGNIZED;
  }
}

export function k8SPolicyIsPropagatedToK8SClusterDetail_StatusToJSON(
  object: K8SPolicyIsPropagatedToK8SClusterDetail_Status,
): string {
  switch (object) {
    case K8SPolicyIsPropagatedToK8SClusterDetail_Status.STATUS_UNSPECIFIED:
      return "STATUS_UNSPECIFIED";
    case K8SPolicyIsPropagatedToK8SClusterDetail_Status.STATUS_OTHER:
      return "STATUS_OTHER";
    case K8SPolicyIsPropagatedToK8SClusterDetail_Status.VIOLATIONS:
      return "VIOLATIONS";
    case K8SPolicyIsPropagatedToK8SClusterDetail_Status.NO_VIOLATIONS:
      return "NO_VIOLATIONS";
    case K8SPolicyIsPropagatedToK8SClusterDetail_Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseK8SPolicyIsPropagatedToK8SClusterDetail(): K8SPolicyIsPropagatedToK8SClusterDetail {
  return { k8sPolicyId: "", k8sClusterId: "", status: 0 };
}

export const K8SPolicyIsPropagatedToK8SClusterDetail = {
  encode(
    message: K8SPolicyIsPropagatedToK8SClusterDetail,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.k8sPolicyId !== undefined && message.k8sPolicyId !== "") {
      writer.uint32(1805436354).string(message.k8sPolicyId);
    }
    if (message.k8sClusterId !== undefined && message.k8sClusterId !== "") {
      writer.uint32(1922247682).string(message.k8sClusterId);
    }
    if (message.status !== undefined && message.status !== 0) {
      writer.uint32(2844885112).int32(message.status);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): K8SPolicyIsPropagatedToK8SClusterDetail {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseK8SPolicyIsPropagatedToK8SClusterDetail();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 225679544:
          if (tag !== 1805436354) {
            break;
          }

          message.k8sPolicyId = reader.string();
          continue;
        case 240280960:
          if (tag !== 1922247682) {
            break;
          }

          message.k8sClusterId = reader.string();
          continue;
        case 355610639:
          if (tag !== 2844885112) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): K8SPolicyIsPropagatedToK8SClusterDetail {
    return {
      k8sPolicyId: isSet(object.k8s_policy_id)
        ? globalThis.String(object.k8s_policy_id)
        : "",
      k8sClusterId: isSet(object.k8s_cluster_id)
        ? globalThis.String(object.k8s_cluster_id)
        : "",
      status: isSet(object.status)
        ? k8SPolicyIsPropagatedToK8SClusterDetail_StatusFromJSON(object.status)
        : 0,
    };
  },

  toJSON(message: K8SPolicyIsPropagatedToK8SClusterDetail): unknown {
    const obj: any = {};
    if (message.k8sPolicyId !== undefined && message.k8sPolicyId !== "") {
      obj.k8s_policy_id = message.k8sPolicyId;
    }
    if (message.k8sClusterId !== undefined && message.k8sClusterId !== "") {
      obj.k8s_cluster_id = message.k8sClusterId;
    }
    if (message.status !== undefined && message.status !== 0) {
      obj.status = k8SPolicyIsPropagatedToK8SClusterDetail_StatusToJSON(
        message.status,
      );
    }
    return obj;
  },

  create<
    I extends Exact<DeepPartial<K8SPolicyIsPropagatedToK8SClusterDetail>, I>,
  >(base?: I): K8SPolicyIsPropagatedToK8SClusterDetail {
    return K8SPolicyIsPropagatedToK8SClusterDetail.fromPartial(
      base ?? ({} as any),
    );
  },
  fromPartial<
    I extends Exact<DeepPartial<K8SPolicyIsPropagatedToK8SClusterDetail>, I>,
  >(object: I): K8SPolicyIsPropagatedToK8SClusterDetail {
    const message = createBaseK8SPolicyIsPropagatedToK8SClusterDetail();
    message.k8sPolicyId = object.k8sPolicyId ?? "";
    message.k8sClusterId = object.k8sClusterId ?? "";
    message.status = object.status ?? 0;
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
