/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { K8sClusterDetailNodesInner } from "./k8s_cluster_detail_nodes_inner";

export const protobufPackage = "kessel.inventory.v1beta1.resources";

export interface K8sClusterDetail {
  /** The OCP cluster ID or ARN etc for *KS */
  externalClusterId?: string | undefined;
  clusterStatus?: K8sClusterDetail_ClusterStatus | undefined;
  clusterReason?: string | undefined;
  /** The version of kubernetes */
  kubeVersion?: string | undefined;
  kubeVendor?: K8sClusterDetail_KubeVendor | undefined;
  /** The version of the productized kubernetes distribution */
  vendorVersion?: string | undefined;
  cloudPlatform?: K8sClusterDetail_CloudPlatform | undefined;
  nodes?: K8sClusterDetailNodesInner[] | undefined;
}

/** the aggregate status of the cluster */
export enum K8sClusterDetail_ClusterStatus {
  CLUSTER_STATUS_UNSPECIFIED = 0,
  CLUSTER_STATUS_OTHER = 1,
  READY = 2,
  FAILED = 3,
  OFFLINE = 4,
  UNRECOGNIZED = -1,
}

export function k8sClusterDetail_ClusterStatusFromJSON(
  object: any,
): K8sClusterDetail_ClusterStatus {
  switch (object) {
    case 0:
    case "CLUSTER_STATUS_UNSPECIFIED":
      return K8sClusterDetail_ClusterStatus.CLUSTER_STATUS_UNSPECIFIED;
    case 1:
    case "CLUSTER_STATUS_OTHER":
      return K8sClusterDetail_ClusterStatus.CLUSTER_STATUS_OTHER;
    case 2:
    case "READY":
      return K8sClusterDetail_ClusterStatus.READY;
    case 3:
    case "FAILED":
      return K8sClusterDetail_ClusterStatus.FAILED;
    case 4:
    case "OFFLINE":
      return K8sClusterDetail_ClusterStatus.OFFLINE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return K8sClusterDetail_ClusterStatus.UNRECOGNIZED;
  }
}

export function k8sClusterDetail_ClusterStatusToJSON(
  object: K8sClusterDetail_ClusterStatus,
): string {
  switch (object) {
    case K8sClusterDetail_ClusterStatus.CLUSTER_STATUS_UNSPECIFIED:
      return "CLUSTER_STATUS_UNSPECIFIED";
    case K8sClusterDetail_ClusterStatus.CLUSTER_STATUS_OTHER:
      return "CLUSTER_STATUS_OTHER";
    case K8sClusterDetail_ClusterStatus.READY:
      return "READY";
    case K8sClusterDetail_ClusterStatus.FAILED:
      return "FAILED";
    case K8sClusterDetail_ClusterStatus.OFFLINE:
      return "OFFLINE";
    case K8sClusterDetail_ClusterStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** The kubernetes vendor */
export enum K8sClusterDetail_KubeVendor {
  KUBE_VENDOR_UNSPECIFIED = 0,
  KUBE_VENDOR_OTHER = 1,
  AKS = 2,
  EKS = 3,
  IKS = 4,
  OPENSHIFT = 5,
  GKE = 6,
  UNRECOGNIZED = -1,
}

export function k8sClusterDetail_KubeVendorFromJSON(
  object: any,
): K8sClusterDetail_KubeVendor {
  switch (object) {
    case 0:
    case "KUBE_VENDOR_UNSPECIFIED":
      return K8sClusterDetail_KubeVendor.KUBE_VENDOR_UNSPECIFIED;
    case 1:
    case "KUBE_VENDOR_OTHER":
      return K8sClusterDetail_KubeVendor.KUBE_VENDOR_OTHER;
    case 2:
    case "AKS":
      return K8sClusterDetail_KubeVendor.AKS;
    case 3:
    case "EKS":
      return K8sClusterDetail_KubeVendor.EKS;
    case 4:
    case "IKS":
      return K8sClusterDetail_KubeVendor.IKS;
    case 5:
    case "OPENSHIFT":
      return K8sClusterDetail_KubeVendor.OPENSHIFT;
    case 6:
    case "GKE":
      return K8sClusterDetail_KubeVendor.GKE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return K8sClusterDetail_KubeVendor.UNRECOGNIZED;
  }
}

export function k8sClusterDetail_KubeVendorToJSON(
  object: K8sClusterDetail_KubeVendor,
): string {
  switch (object) {
    case K8sClusterDetail_KubeVendor.KUBE_VENDOR_UNSPECIFIED:
      return "KUBE_VENDOR_UNSPECIFIED";
    case K8sClusterDetail_KubeVendor.KUBE_VENDOR_OTHER:
      return "KUBE_VENDOR_OTHER";
    case K8sClusterDetail_KubeVendor.AKS:
      return "AKS";
    case K8sClusterDetail_KubeVendor.EKS:
      return "EKS";
    case K8sClusterDetail_KubeVendor.IKS:
      return "IKS";
    case K8sClusterDetail_KubeVendor.OPENSHIFT:
      return "OPENSHIFT";
    case K8sClusterDetail_KubeVendor.GKE:
      return "GKE";
    case K8sClusterDetail_KubeVendor.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** The platform on which this cluster is hosted */
export enum K8sClusterDetail_CloudPlatform {
  CLOUD_PLATFORM_UNSPECIFIED = 0,
  CLOUD_PLATFORM_OTHER = 1,
  NONE_UPI = 2,
  BAREMETAL_IPI = 3,
  BAREMETAL_UPI = 4,
  AWS_IPI = 5,
  AWS_UPI = 6,
  AZURE_IPI = 7,
  AZURE_UPI = 8,
  IBMCLOUD_IPI = 9,
  IBMCLOUD_UPI = 10,
  KUBEVIRT_IPI = 11,
  OPENSTACK_IPI = 12,
  OPENSTACK_UPI = 13,
  GCP_IPI = 14,
  GCP_UPI = 15,
  NUTANIX_IPI = 16,
  NUTANIX_UPI = 17,
  VSPHERE_IPI = 18,
  VSPHERE_UPI = 19,
  OVIRT_IPI = 20,
  UNRECOGNIZED = -1,
}

export function k8sClusterDetail_CloudPlatformFromJSON(
  object: any,
): K8sClusterDetail_CloudPlatform {
  switch (object) {
    case 0:
    case "CLOUD_PLATFORM_UNSPECIFIED":
      return K8sClusterDetail_CloudPlatform.CLOUD_PLATFORM_UNSPECIFIED;
    case 1:
    case "CLOUD_PLATFORM_OTHER":
      return K8sClusterDetail_CloudPlatform.CLOUD_PLATFORM_OTHER;
    case 2:
    case "NONE_UPI":
      return K8sClusterDetail_CloudPlatform.NONE_UPI;
    case 3:
    case "BAREMETAL_IPI":
      return K8sClusterDetail_CloudPlatform.BAREMETAL_IPI;
    case 4:
    case "BAREMETAL_UPI":
      return K8sClusterDetail_CloudPlatform.BAREMETAL_UPI;
    case 5:
    case "AWS_IPI":
      return K8sClusterDetail_CloudPlatform.AWS_IPI;
    case 6:
    case "AWS_UPI":
      return K8sClusterDetail_CloudPlatform.AWS_UPI;
    case 7:
    case "AZURE_IPI":
      return K8sClusterDetail_CloudPlatform.AZURE_IPI;
    case 8:
    case "AZURE_UPI":
      return K8sClusterDetail_CloudPlatform.AZURE_UPI;
    case 9:
    case "IBMCLOUD_IPI":
      return K8sClusterDetail_CloudPlatform.IBMCLOUD_IPI;
    case 10:
    case "IBMCLOUD_UPI":
      return K8sClusterDetail_CloudPlatform.IBMCLOUD_UPI;
    case 11:
    case "KUBEVIRT_IPI":
      return K8sClusterDetail_CloudPlatform.KUBEVIRT_IPI;
    case 12:
    case "OPENSTACK_IPI":
      return K8sClusterDetail_CloudPlatform.OPENSTACK_IPI;
    case 13:
    case "OPENSTACK_UPI":
      return K8sClusterDetail_CloudPlatform.OPENSTACK_UPI;
    case 14:
    case "GCP_IPI":
      return K8sClusterDetail_CloudPlatform.GCP_IPI;
    case 15:
    case "GCP_UPI":
      return K8sClusterDetail_CloudPlatform.GCP_UPI;
    case 16:
    case "NUTANIX_IPI":
      return K8sClusterDetail_CloudPlatform.NUTANIX_IPI;
    case 17:
    case "NUTANIX_UPI":
      return K8sClusterDetail_CloudPlatform.NUTANIX_UPI;
    case 18:
    case "VSPHERE_IPI":
      return K8sClusterDetail_CloudPlatform.VSPHERE_IPI;
    case 19:
    case "VSPHERE_UPI":
      return K8sClusterDetail_CloudPlatform.VSPHERE_UPI;
    case 20:
    case "OVIRT_IPI":
      return K8sClusterDetail_CloudPlatform.OVIRT_IPI;
    case -1:
    case "UNRECOGNIZED":
    default:
      return K8sClusterDetail_CloudPlatform.UNRECOGNIZED;
  }
}

export function k8sClusterDetail_CloudPlatformToJSON(
  object: K8sClusterDetail_CloudPlatform,
): string {
  switch (object) {
    case K8sClusterDetail_CloudPlatform.CLOUD_PLATFORM_UNSPECIFIED:
      return "CLOUD_PLATFORM_UNSPECIFIED";
    case K8sClusterDetail_CloudPlatform.CLOUD_PLATFORM_OTHER:
      return "CLOUD_PLATFORM_OTHER";
    case K8sClusterDetail_CloudPlatform.NONE_UPI:
      return "NONE_UPI";
    case K8sClusterDetail_CloudPlatform.BAREMETAL_IPI:
      return "BAREMETAL_IPI";
    case K8sClusterDetail_CloudPlatform.BAREMETAL_UPI:
      return "BAREMETAL_UPI";
    case K8sClusterDetail_CloudPlatform.AWS_IPI:
      return "AWS_IPI";
    case K8sClusterDetail_CloudPlatform.AWS_UPI:
      return "AWS_UPI";
    case K8sClusterDetail_CloudPlatform.AZURE_IPI:
      return "AZURE_IPI";
    case K8sClusterDetail_CloudPlatform.AZURE_UPI:
      return "AZURE_UPI";
    case K8sClusterDetail_CloudPlatform.IBMCLOUD_IPI:
      return "IBMCLOUD_IPI";
    case K8sClusterDetail_CloudPlatform.IBMCLOUD_UPI:
      return "IBMCLOUD_UPI";
    case K8sClusterDetail_CloudPlatform.KUBEVIRT_IPI:
      return "KUBEVIRT_IPI";
    case K8sClusterDetail_CloudPlatform.OPENSTACK_IPI:
      return "OPENSTACK_IPI";
    case K8sClusterDetail_CloudPlatform.OPENSTACK_UPI:
      return "OPENSTACK_UPI";
    case K8sClusterDetail_CloudPlatform.GCP_IPI:
      return "GCP_IPI";
    case K8sClusterDetail_CloudPlatform.GCP_UPI:
      return "GCP_UPI";
    case K8sClusterDetail_CloudPlatform.NUTANIX_IPI:
      return "NUTANIX_IPI";
    case K8sClusterDetail_CloudPlatform.NUTANIX_UPI:
      return "NUTANIX_UPI";
    case K8sClusterDetail_CloudPlatform.VSPHERE_IPI:
      return "VSPHERE_IPI";
    case K8sClusterDetail_CloudPlatform.VSPHERE_UPI:
      return "VSPHERE_UPI";
    case K8sClusterDetail_CloudPlatform.OVIRT_IPI:
      return "OVIRT_IPI";
    case K8sClusterDetail_CloudPlatform.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseK8sClusterDetail(): K8sClusterDetail {
  return {
    externalClusterId: "",
    clusterStatus: 0,
    clusterReason: undefined,
    kubeVersion: "",
    kubeVendor: 0,
    vendorVersion: "",
    cloudPlatform: 0,
    nodes: [],
  };
}

export const K8sClusterDetail = {
  encode(
    message: K8sClusterDetail,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (
      message.externalClusterId !== undefined &&
      message.externalClusterId !== ""
    ) {
      writer.uint32(1756572778).string(message.externalClusterId);
    }
    if (message.clusterStatus !== undefined && message.clusterStatus !== 0) {
      writer.uint32(3994775232).int32(message.clusterStatus);
    }
    if (message.clusterReason !== undefined) {
      writer.uint32(3994775242).string(message.clusterReason);
    }
    if (message.kubeVersion !== undefined && message.kubeVersion !== "") {
      writer.uint32(3166867922).string(message.kubeVersion);
    }
    if (message.kubeVendor !== undefined && message.kubeVendor !== 0) {
      writer.uint32(2113533136).int32(message.kubeVendor);
    }
    if (message.vendorVersion !== undefined && message.vendorVersion !== "") {
      writer.uint32(191694618).string(message.vendorVersion);
    }
    if (message.cloudPlatform !== undefined && message.cloudPlatform !== 0) {
      writer.uint32(3814144496).int32(message.cloudPlatform);
    }
    if (message.nodes !== undefined && message.nodes.length !== 0) {
      for (const v of message.nodes) {
        K8sClusterDetailNodesInner.encode(
          v!,
          writer.uint32(603526282).fork(),
        ).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): K8sClusterDetail {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseK8sClusterDetail();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 219571597:
          if (tag !== 1756572778) {
            break;
          }

          message.externalClusterId = reader.string();
          continue;
        case 499346904:
          if (tag !== 3994775232) {
            break;
          }

          message.clusterStatus = reader.int32() as any;
          continue;
        case 499346905:
          if (tag !== 3994775242) {
            break;
          }

          message.clusterReason = reader.string();
          continue;
        case 395858490:
          if (tag !== 3166867922) {
            break;
          }

          message.kubeVersion = reader.string();
          continue;
        case 264191642:
          if (tag !== 2113533136) {
            break;
          }

          message.kubeVendor = reader.int32() as any;
          continue;
        case 23961827:
          if (tag !== 191694618) {
            break;
          }

          message.vendorVersion = reader.string();
          continue;
        case 476768062:
          if (tag !== 3814144496) {
            break;
          }

          message.cloudPlatform = reader.int32() as any;
          continue;
        case 75440785:
          if (tag !== 603526282) {
            break;
          }

          message.nodes!.push(
            K8sClusterDetailNodesInner.decode(reader, reader.uint32()),
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

  fromJSON(object: any): K8sClusterDetail {
    return {
      externalClusterId: isSet(object.external_cluster_id)
        ? globalThis.String(object.external_cluster_id)
        : "",
      clusterStatus: isSet(object.cluster_status)
        ? k8sClusterDetail_ClusterStatusFromJSON(object.cluster_status)
        : 0,
      clusterReason: isSet(object.cluster_reason)
        ? globalThis.String(object.cluster_reason)
        : undefined,
      kubeVersion: isSet(object.kube_version)
        ? globalThis.String(object.kube_version)
        : "",
      kubeVendor: isSet(object.kube_vendor)
        ? k8sClusterDetail_KubeVendorFromJSON(object.kube_vendor)
        : 0,
      vendorVersion: isSet(object.vendor_version)
        ? globalThis.String(object.vendor_version)
        : "",
      cloudPlatform: isSet(object.cloud_platform)
        ? k8sClusterDetail_CloudPlatformFromJSON(object.cloud_platform)
        : 0,
      nodes: globalThis.Array.isArray(object?.nodes)
        ? object.nodes.map((e: any) => K8sClusterDetailNodesInner.fromJSON(e))
        : [],
    };
  },

  toJSON(message: K8sClusterDetail): unknown {
    const obj: any = {};
    if (
      message.externalClusterId !== undefined &&
      message.externalClusterId !== ""
    ) {
      obj.external_cluster_id = message.externalClusterId;
    }
    if (message.clusterStatus !== undefined && message.clusterStatus !== 0) {
      obj.cluster_status = k8sClusterDetail_ClusterStatusToJSON(
        message.clusterStatus,
      );
    }
    if (message.clusterReason !== undefined) {
      obj.cluster_reason = message.clusterReason;
    }
    if (message.kubeVersion !== undefined && message.kubeVersion !== "") {
      obj.kube_version = message.kubeVersion;
    }
    if (message.kubeVendor !== undefined && message.kubeVendor !== 0) {
      obj.kube_vendor = k8sClusterDetail_KubeVendorToJSON(message.kubeVendor);
    }
    if (message.vendorVersion !== undefined && message.vendorVersion !== "") {
      obj.vendor_version = message.vendorVersion;
    }
    if (message.cloudPlatform !== undefined && message.cloudPlatform !== 0) {
      obj.cloud_platform = k8sClusterDetail_CloudPlatformToJSON(
        message.cloudPlatform,
      );
    }
    if (message.nodes?.length) {
      obj.nodes = message.nodes.map((e) =>
        K8sClusterDetailNodesInner.toJSON(e),
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<K8sClusterDetail>, I>>(
    base?: I,
  ): K8sClusterDetail {
    return K8sClusterDetail.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<K8sClusterDetail>, I>>(
    object: I,
  ): K8sClusterDetail {
    const message = createBaseK8sClusterDetail();
    message.externalClusterId = object.externalClusterId ?? "";
    message.clusterStatus = object.clusterStatus ?? 0;
    message.clusterReason = object.clusterReason ?? undefined;
    message.kubeVersion = object.kubeVersion ?? "";
    message.kubeVendor = object.kubeVendor ?? 0;
    message.vendorVersion = object.vendorVersion ?? "";
    message.cloudPlatform = object.cloudPlatform ?? 0;
    message.nodes =
      object.nodes?.map((e) => K8sClusterDetailNodesInner.fromPartial(e)) || [];
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
