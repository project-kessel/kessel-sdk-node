/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ResourceRepresentations } from "./resource_representations";
import {
  WriteVisibility,
  writeVisibilityFromJSON,
  writeVisibilityToJSON,
} from "./write_visibility";

export const protobufPackage = "kessel.inventory.v1beta2";

/** Request to register or update a *Reporter*'s *Representation* of a *Resource* in Kessel Inventory. */
export interface ReportResourceRequest {
  /**
   * The Kessel Inventory-assigned ID of the *Resource*.
   *
   * Usually not required during reporting; populated internally during correlation.
   */
  inventoryId?: string | undefined;
  /**
   * The canonical type of the *Resource* (e.g., "k8s_cluster", "host", "integration").
   *
   * Must be a previously agreed-upon value between the *Reporter* and Kessel Inventory.
   * Must be consistent across all *Reporter Representations* of a given Type reported by a given *Reporter*.
   * Used to:
   * - Select the appropriate schema to validate the *Reporter Representation*
   * - Identify a *Reporter's Representation* uniquely in Kessel Inventory
   */
  type?: string | undefined;
  /**
   * The type of the *Reporter* (e.g., "hbi", "acm", "acs", "notifications").
   *
   * Must be a previously agreed-upon value between the *Reporter* and Kessel Inventory.
   * Must be consistent across all *Reporter Representations* reported by a given *Reporter*.
   * Used to:
   * - Select the appropriate schema to validate the *Reporter Representation*
   * - Identify a *Reporter's Representation* uniquely in Kessel Inventory
   */
  reporterType?: string | undefined;
  /**
   * Identifier for the specific instance of the *Reporter*.
   * This may not be applicable to all Reporters
   *
   * Used to distinguish between multiple instances of the same `reporter_type`.
   * Does not require prior coordination with Kessel Inventory.
   */
  reporterInstanceId?: string | undefined;
  representations?: ResourceRepresentations | undefined;
  /**
   * Controls the visibility guarantees of the write operation in Kessel Inventory.
   *
   * - `MINIMIZE_LATENCY` (default): Optimizes for throughput; may delay visibility in `Check` results.
   * - `IMMEDIATE`: Ensures read-your-writes consistency; higher latency due to synchronization.
   *
   * Use `IMMEDIATE` only if your use case requires strong consistency guarantees
   * (e.g., writing and immediately checking access to the resource).
   */
  writeVisibility?: WriteVisibility | undefined;
}

function createBaseReportResourceRequest(): ReportResourceRequest {
  return {
    inventoryId: undefined,
    type: "",
    reporterType: "",
    reporterInstanceId: "",
    representations: undefined,
    writeVisibility: 0,
  };
}

export const ReportResourceRequest = {
  encode(
    message: ReportResourceRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.inventoryId !== undefined) {
      writer.uint32(10).string(message.inventoryId);
    }
    if (message.type !== undefined && message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.reporterType !== undefined && message.reporterType !== "") {
      writer.uint32(26).string(message.reporterType);
    }
    if (
      message.reporterInstanceId !== undefined &&
      message.reporterInstanceId !== ""
    ) {
      writer.uint32(34).string(message.reporterInstanceId);
    }
    if (message.representations !== undefined) {
      ResourceRepresentations.encode(
        message.representations,
        writer.uint32(42).fork(),
      ).ldelim();
    }
    if (
      message.writeVisibility !== undefined &&
      message.writeVisibility !== 0
    ) {
      writer.uint32(48).int32(message.writeVisibility);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): ReportResourceRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReportResourceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.inventoryId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.type = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.reporterType = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.reporterInstanceId = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.representations = ResourceRepresentations.decode(
            reader,
            reader.uint32(),
          );
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.writeVisibility = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReportResourceRequest {
    return {
      inventoryId: isSet(object.inventoryId)
        ? globalThis.String(object.inventoryId)
        : undefined,
      type: isSet(object.type) ? globalThis.String(object.type) : "",
      reporterType: isSet(object.reporterType)
        ? globalThis.String(object.reporterType)
        : "",
      reporterInstanceId: isSet(object.reporterInstanceId)
        ? globalThis.String(object.reporterInstanceId)
        : "",
      representations: isSet(object.representations)
        ? ResourceRepresentations.fromJSON(object.representations)
        : undefined,
      writeVisibility: isSet(object.writeVisibility)
        ? writeVisibilityFromJSON(object.writeVisibility)
        : 0,
    };
  },

  toJSON(message: ReportResourceRequest): unknown {
    const obj: any = {};
    if (message.inventoryId !== undefined) {
      obj.inventoryId = message.inventoryId;
    }
    if (message.type !== undefined && message.type !== "") {
      obj.type = message.type;
    }
    if (message.reporterType !== undefined && message.reporterType !== "") {
      obj.reporterType = message.reporterType;
    }
    if (
      message.reporterInstanceId !== undefined &&
      message.reporterInstanceId !== ""
    ) {
      obj.reporterInstanceId = message.reporterInstanceId;
    }
    if (message.representations !== undefined) {
      obj.representations = ResourceRepresentations.toJSON(
        message.representations,
      );
    }
    if (
      message.writeVisibility !== undefined &&
      message.writeVisibility !== 0
    ) {
      obj.writeVisibility = writeVisibilityToJSON(message.writeVisibility);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ReportResourceRequest>, I>>(
    base?: I,
  ): ReportResourceRequest {
    return ReportResourceRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ReportResourceRequest>, I>>(
    object: I,
  ): ReportResourceRequest {
    const message = createBaseReportResourceRequest();
    message.inventoryId = object.inventoryId ?? undefined;
    message.type = object.type ?? "";
    message.reporterType = object.reporterType ?? "";
    message.reporterInstanceId = object.reporterInstanceId ?? "";
    message.representations =
      object.representations !== undefined && object.representations !== null
        ? ResourceRepresentations.fromPartial(object.representations)
        : undefined;
    message.writeVisibility = object.writeVisibility ?? 0;
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
