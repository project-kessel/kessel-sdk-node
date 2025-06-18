/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Timestamp } from "../../../../google/protobuf/timestamp";

export const protobufPackage = "kessel.inventory.v1beta1.relationships";

export interface ReporterData {
  reporterType?: ReporterData_ReporterType | undefined;
  /**
   * The ID of the instance of the reporter. This is derived from the
   * authentication mechanism, i.e. authentication token.
   */
  reporterInstanceId?: string | undefined;
  /** version of the reporter */
  reporterVersion?: string | undefined;
  /** Date and time when the inventory item was first reported by this reporter */
  firstReported?: Date | undefined;
  /** Date and time when the inventory item was last updated by this reporter */
  lastReported?: Date | undefined;
  /**
   * The ID assigned by the reporter to resource which is the subject of the relationship. For example
   * OCM cluster ID, HBI's host id, or ACM managed cluster name etc.
   */
  subjectLocalResourceId?: string | undefined;
  /**
   * The ID assigned by the reporter to resource which is the object of the relationship. For example
   * OCM cluster ID, HBI's host id, or ACM managed cluster name etc.
   */
  objectLocalResourceId?: string | undefined;
}

export enum ReporterData_ReporterType {
  REPORTER_TYPE_UNSPECIFIED = 0,
  REPORTER_TYPE_OTHER = 1,
  ACM = 2,
  HBI = 3,
  OCM = 4,
  NOTIFICATIONS = 5,
  UNRECOGNIZED = -1,
}

export function reporterData_ReporterTypeFromJSON(
  object: any,
): ReporterData_ReporterType {
  switch (object) {
    case 0:
    case "REPORTER_TYPE_UNSPECIFIED":
      return ReporterData_ReporterType.REPORTER_TYPE_UNSPECIFIED;
    case 1:
    case "REPORTER_TYPE_OTHER":
      return ReporterData_ReporterType.REPORTER_TYPE_OTHER;
    case 2:
    case "ACM":
      return ReporterData_ReporterType.ACM;
    case 3:
    case "HBI":
      return ReporterData_ReporterType.HBI;
    case 4:
    case "OCM":
      return ReporterData_ReporterType.OCM;
    case 5:
    case "NOTIFICATIONS":
      return ReporterData_ReporterType.NOTIFICATIONS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ReporterData_ReporterType.UNRECOGNIZED;
  }
}

export function reporterData_ReporterTypeToJSON(
  object: ReporterData_ReporterType,
): string {
  switch (object) {
    case ReporterData_ReporterType.REPORTER_TYPE_UNSPECIFIED:
      return "REPORTER_TYPE_UNSPECIFIED";
    case ReporterData_ReporterType.REPORTER_TYPE_OTHER:
      return "REPORTER_TYPE_OTHER";
    case ReporterData_ReporterType.ACM:
      return "ACM";
    case ReporterData_ReporterType.HBI:
      return "HBI";
    case ReporterData_ReporterType.OCM:
      return "OCM";
    case ReporterData_ReporterType.NOTIFICATIONS:
      return "NOTIFICATIONS";
    case ReporterData_ReporterType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseReporterData(): ReporterData {
  return {
    reporterType: 0,
    reporterInstanceId: "",
    reporterVersion: "",
    firstReported: undefined,
    lastReported: undefined,
    subjectLocalResourceId: "",
    objectLocalResourceId: "",
  };
}

export const ReporterData = {
  encode(
    message: ReporterData,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.reporterType !== undefined && message.reporterType !== 0) {
      writer.uint32(1966227144).int32(message.reporterType);
    }
    if (
      message.reporterInstanceId !== undefined &&
      message.reporterInstanceId !== ""
    ) {
      writer.uint32(1928680914).string(message.reporterInstanceId);
    }
    if (
      message.reporterVersion !== undefined &&
      message.reporterVersion !== ""
    ) {
      writer.uint32(2157034458).string(message.reporterVersion);
    }
    if (message.firstReported !== undefined) {
      Timestamp.encode(
        toTimestamp(message.firstReported),
        writer.uint32(110998538).fork(),
      ).ldelim();
    }
    if (message.lastReported !== undefined) {
      Timestamp.encode(
        toTimestamp(message.lastReported),
        writer.uint32(3491787874).fork(),
      ).ldelim();
    }
    if (
      message.subjectLocalResourceId !== undefined &&
      message.subjectLocalResourceId !== ""
    ) {
      writer.uint32(4071809522).string(message.subjectLocalResourceId);
    }
    if (
      message.objectLocalResourceId !== undefined &&
      message.objectLocalResourceId !== ""
    ) {
      writer.uint32(4071809530).string(message.objectLocalResourceId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReporterData {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReporterData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 245778393:
          if (tag !== 1966227144) {
            break;
          }

          message.reporterType = reader.int32() as any;
          continue;
        case 241085114:
          if (tag !== 1928680914) {
            break;
          }

          message.reporterInstanceId = reader.string();
          continue;
        case 269629307:
          if (tag !== 2157034458) {
            break;
          }

          message.reporterVersion = reader.string();
          continue;
        case 13874817:
          if (tag !== 110998538) {
            break;
          }

          message.firstReported = fromTimestamp(
            Timestamp.decode(reader, reader.uint32()),
          );
          continue;
        case 436473484:
          if (tag !== 3491787874) {
            break;
          }

          message.lastReported = fromTimestamp(
            Timestamp.decode(reader, reader.uint32()),
          );
          continue;
        case 508976190:
          if (tag !== 4071809522) {
            break;
          }

          message.subjectLocalResourceId = reader.string();
          continue;
        case 508976191:
          if (tag !== 4071809530) {
            break;
          }

          message.objectLocalResourceId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReporterData {
    return {
      reporterType: isSet(object.reporter_type)
        ? reporterData_ReporterTypeFromJSON(object.reporter_type)
        : 0,
      reporterInstanceId: isSet(object.reporter_instance_id)
        ? globalThis.String(object.reporter_instance_id)
        : "",
      reporterVersion: isSet(object.reporter_version)
        ? globalThis.String(object.reporter_version)
        : "",
      firstReported: isSet(object.first_reported)
        ? fromJsonTimestamp(object.first_reported)
        : undefined,
      lastReported: isSet(object.last_reported)
        ? fromJsonTimestamp(object.last_reported)
        : undefined,
      subjectLocalResourceId: isSet(object.subject_local_resource_id)
        ? globalThis.String(object.subject_local_resource_id)
        : "",
      objectLocalResourceId: isSet(object.object_local_resource_id)
        ? globalThis.String(object.object_local_resource_id)
        : "",
    };
  },

  toJSON(message: ReporterData): unknown {
    const obj: any = {};
    if (message.reporterType !== undefined && message.reporterType !== 0) {
      obj.reporter_type = reporterData_ReporterTypeToJSON(message.reporterType);
    }
    if (
      message.reporterInstanceId !== undefined &&
      message.reporterInstanceId !== ""
    ) {
      obj.reporter_instance_id = message.reporterInstanceId;
    }
    if (
      message.reporterVersion !== undefined &&
      message.reporterVersion !== ""
    ) {
      obj.reporter_version = message.reporterVersion;
    }
    if (message.firstReported !== undefined) {
      obj.first_reported = message.firstReported.toISOString();
    }
    if (message.lastReported !== undefined) {
      obj.last_reported = message.lastReported.toISOString();
    }
    if (
      message.subjectLocalResourceId !== undefined &&
      message.subjectLocalResourceId !== ""
    ) {
      obj.subject_local_resource_id = message.subjectLocalResourceId;
    }
    if (
      message.objectLocalResourceId !== undefined &&
      message.objectLocalResourceId !== ""
    ) {
      obj.object_local_resource_id = message.objectLocalResourceId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ReporterData>, I>>(
    base?: I,
  ): ReporterData {
    return ReporterData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ReporterData>, I>>(
    object: I,
  ): ReporterData {
    const message = createBaseReporterData();
    message.reporterType = object.reporterType ?? 0;
    message.reporterInstanceId = object.reporterInstanceId ?? "";
    message.reporterVersion = object.reporterVersion ?? "";
    message.firstReported = object.firstReported ?? undefined;
    message.lastReported = object.lastReported ?? undefined;
    message.subjectLocalResourceId = object.subjectLocalResourceId ?? "";
    message.objectLocalResourceId = object.objectLocalResourceId ?? "";
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
