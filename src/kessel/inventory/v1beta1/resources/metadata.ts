/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Timestamp } from "../../../../google/protobuf/timestamp";
import { ResourceLabel } from "./resource_label";

export const protobufPackage = "kessel.inventory.v1beta1.resources";

export interface Metadata {
  /** Kessel Asset Inventory generated identifier. */
  id?: string | undefined;
  /** The type of the Resource */
  resourceType?: string | undefined;
  /** Date and time when the inventory item was first reported. */
  createdAt?: Date | undefined;
  /** Date and time when the inventory item was last updated. */
  updatedAt?: Date | undefined;
  /** Date and time when the inventory item was deleted. */
  deletedAt?: Date | undefined;
  /**
   * The org id in which this resource is a member for access control.  A
   * resource can only be a member of one org.
   */
  orgId?: string | undefined;
  /**
   * The workspace id in which this resource is a member for access control.  A
   * resource can only be a member of one workspace.
   */
  workspaceId?: string | undefined;
  labels?: ResourceLabel[] | undefined;
}

function createBaseMetadata(): Metadata {
  return {
    id: "",
    resourceType: "",
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
    orgId: "",
    workspaceId: "",
    labels: [],
  };
}

export const Metadata = {
  encode(
    message: Metadata,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(26842).string(message.id);
    }
    if (message.resourceType !== undefined && message.resourceType !== "") {
      writer.uint32(3542017634).string(message.resourceType);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createdAt),
        writer.uint32(27202).fork(),
      ).ldelim();
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updatedAt),
        writer.uint32(27210).fork(),
      ).ldelim();
    }
    if (message.deletedAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.deletedAt),
        writer.uint32(27218).fork(),
      ).ldelim();
    }
    if (message.orgId !== undefined && message.orgId !== "") {
      writer.uint32(28002).string(message.orgId);
    }
    if (message.workspaceId !== undefined && message.workspaceId !== "") {
      writer.uint32(28010).string(message.workspaceId);
    }
    if (message.labels !== undefined && message.labels.length !== 0) {
      for (const v of message.labels) {
        ResourceLabel.encode(v!, writer.uint32(28418250).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Metadata {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3355:
          if (tag !== 26842) {
            break;
          }

          message.id = reader.string();
          continue;
        case 442752204:
          if (tag !== 3542017634) {
            break;
          }

          message.resourceType = reader.string();
          continue;
        case 3400:
          if (tag !== 27202) {
            break;
          }

          message.createdAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32()),
          );
          continue;
        case 3401:
          if (tag !== 27210) {
            break;
          }

          message.updatedAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32()),
          );
          continue;
        case 3402:
          if (tag !== 27218) {
            break;
          }

          message.deletedAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32()),
          );
          continue;
        case 3500:
          if (tag !== 28002) {
            break;
          }

          message.orgId = reader.string();
          continue;
        case 3501:
          if (tag !== 28010) {
            break;
          }

          message.workspaceId = reader.string();
          continue;
        case 3552281:
          if (tag !== 28418250) {
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

  fromJSON(object: any): Metadata {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      resourceType: isSet(object.resource_type)
        ? globalThis.String(object.resource_type)
        : "",
      createdAt: isSet(object.created_at)
        ? fromJsonTimestamp(object.created_at)
        : undefined,
      updatedAt: isSet(object.updated_at)
        ? fromJsonTimestamp(object.updated_at)
        : undefined,
      deletedAt: isSet(object.deleted_at)
        ? fromJsonTimestamp(object.deleted_at)
        : undefined,
      orgId: isSet(object.org_id) ? globalThis.String(object.org_id) : "",
      workspaceId: isSet(object.workspace_id)
        ? globalThis.String(object.workspace_id)
        : "",
      labels: globalThis.Array.isArray(object?.labels)
        ? object.labels.map((e: any) => ResourceLabel.fromJSON(e))
        : [],
    };
  },

  toJSON(message: Metadata): unknown {
    const obj: any = {};
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.resourceType !== undefined && message.resourceType !== "") {
      obj.resource_type = message.resourceType;
    }
    if (message.createdAt !== undefined) {
      obj.created_at = message.createdAt.toISOString();
    }
    if (message.updatedAt !== undefined) {
      obj.updated_at = message.updatedAt.toISOString();
    }
    if (message.deletedAt !== undefined) {
      obj.deleted_at = message.deletedAt.toISOString();
    }
    if (message.orgId !== undefined && message.orgId !== "") {
      obj.org_id = message.orgId;
    }
    if (message.workspaceId !== undefined && message.workspaceId !== "") {
      obj.workspace_id = message.workspaceId;
    }
    if (message.labels?.length) {
      obj.labels = message.labels.map((e) => ResourceLabel.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Metadata>, I>>(base?: I): Metadata {
    return Metadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Metadata>, I>>(object: I): Metadata {
    const message = createBaseMetadata();
    message.id = object.id ?? "";
    message.resourceType = object.resourceType ?? "";
    message.createdAt = object.createdAt ?? undefined;
    message.updatedAt = object.updatedAt ?? undefined;
    message.deletedAt = object.deletedAt ?? undefined;
    message.orgId = object.orgId ?? "";
    message.workspaceId = object.workspaceId ?? "";
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

function toTimestamp(date: Date): Timestamp {
  const seconds = Math.trunc(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof globalThis.Date) {
    return o;
  } else if (typeof o === "string") {
    return new globalThis.Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
