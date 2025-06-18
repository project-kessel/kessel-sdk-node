/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ResourceLabel } from "./resource_label";

export const protobufPackage = "kessel.inventory.v1beta1.resources";

export interface K8sClusterDetailNodesInner {
  /** The name of the node (this can contain private info) */
  name?: string | undefined;
  /** CPU Capacity of the node defined in CPU units, e.g. \"0.5\" */
  cpu?: string | undefined;
  /** Memory Capacity of the node defined as MiB, e.g. \"50Mi\" */
  memory?: string | undefined;
  /**
   * Map of string keys and string values that can be used to organize and
   * categorize (scope and select) resources
   * Todo: Do we require at least 1 label?
   */
  labels?: ResourceLabel[] | undefined;
}

function createBaseK8sClusterDetailNodesInner(): K8sClusterDetailNodesInner {
  return { name: "", cpu: "", memory: "", labels: [] };
}

export const K8sClusterDetailNodesInner = {
  encode(
    message: K8sClusterDetailNodesInner,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.name !== undefined && message.name !== "") {
      writer.uint32(26989658).string(message.name);
    }
    if (message.cpu !== undefined && message.cpu !== "") {
      writer.uint32(789826).string(message.cpu);
    }
    if (message.memory !== undefined && message.memory !== "") {
      writer.uint32(32118794).string(message.memory);
    }
    if (message.labels !== undefined && message.labels.length !== 0) {
      for (const v of message.labels) {
        ResourceLabel.encode(v!, writer.uint32(293404698).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): K8sClusterDetailNodesInner {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseK8sClusterDetailNodesInner();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3373707:
          if (tag !== 26989658) {
            break;
          }

          message.name = reader.string();
          continue;
        case 98728:
          if (tag !== 789826) {
            break;
          }

          message.cpu = reader.string();
          continue;
        case 4014849:
          if (tag !== 32118794) {
            break;
          }

          message.memory = reader.string();
          continue;
        case 36675587:
          if (tag !== 293404698) {
            break;
          }

          message.labels!.push(ResourceLabel.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): K8sClusterDetailNodesInner {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      cpu: isSet(object.cpu) ? globalThis.String(object.cpu) : "",
      memory: isSet(object.memory) ? globalThis.String(object.memory) : "",
      labels: globalThis.Array.isArray(object?.labels)
        ? object.labels.map((e: any) => ResourceLabel.fromJSON(e))
        : [],
    };
  },

  toJSON(message: K8sClusterDetailNodesInner): unknown {
    const obj: any = {};
    if (message.name !== undefined && message.name !== "") {
      obj.name = message.name;
    }
    if (message.cpu !== undefined && message.cpu !== "") {
      obj.cpu = message.cpu;
    }
    if (message.memory !== undefined && message.memory !== "") {
      obj.memory = message.memory;
    }
    if (message.labels?.length) {
      obj.labels = message.labels.map((e) => ResourceLabel.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<K8sClusterDetailNodesInner>, I>>(
    base?: I,
  ): K8sClusterDetailNodesInner {
    return K8sClusterDetailNodesInner.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<K8sClusterDetailNodesInner>, I>>(
    object: I,
  ): K8sClusterDetailNodesInner {
    const message = createBaseK8sClusterDetailNodesInner();
    message.name = object.name ?? "";
    message.cpu = object.cpu ?? "";
    message.memory = object.memory ?? "";
    message.labels =
      object.labels?.map((e) => ResourceLabel.fromPartial(e)) || [];
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
