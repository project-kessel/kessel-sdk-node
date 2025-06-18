/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "kessel.inventory.v1beta1.resources";

export interface ReporterData {
  reporterType?: ReporterData_ReporterType | undefined;
  /**
   * The ID of the instance of the reporter. This is derived from the
   * authentication mechanism, i.e. authentication token.
   */
  reporterInstanceId?: string | undefined;
  /**
   * The URL for this resource in the reporter's management UI console. For
   * example this would be the cluster URL in the HCC Console for an OCM
   * reported cluster.
   */
  consoleHref?: string | undefined;
  /** Reporter specific API link to the resource. */
  apiHref?: string | undefined;
  /**
   * The ID assigned to this resource by the reporter, for example OCM cluster
   * ID, HBI's host id, or ACM managed cluster name etc.
   */
  localResourceId?: string | undefined;
  /** version of the reporter */
  reporterVersion?: string | undefined;
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
    consoleHref: "",
    apiHref: "",
    localResourceId: "",
    reporterVersion: "",
  };
}

export const ReporterData = {
  encode(
    message: ReporterData,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.reporterType !== undefined && message.reporterType !== 0) {
      writer.uint32(1966227136).int32(message.reporterType);
    }
    if (
      message.reporterInstanceId !== undefined &&
      message.reporterInstanceId !== ""
    ) {
      writer.uint32(1928680898).string(message.reporterInstanceId);
    }
    if (message.consoleHref !== undefined && message.consoleHref !== "") {
      writer.uint32(1166837922).string(message.consoleHref);
    }
    if (message.apiHref !== undefined && message.apiHref !== "") {
      writer.uint32(3441684874).string(message.apiHref);
    }
    if (
      message.localResourceId !== undefined &&
      message.localResourceId !== ""
    ) {
      writer.uint32(4071809514).string(message.localResourceId);
    }
    if (
      message.reporterVersion !== undefined &&
      message.reporterVersion !== ""
    ) {
      writer.uint32(2157034450).string(message.reporterVersion);
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
        case 245778392:
          if (tag !== 1966227136) {
            break;
          }

          message.reporterType = reader.int32() as any;
          continue;
        case 241085112:
          if (tag !== 1928680898) {
            break;
          }

          message.reporterInstanceId = reader.string();
          continue;
        case 145854740:
          if (tag !== 1166837922) {
            break;
          }

          message.consoleHref = reader.string();
          continue;
        case 430210609:
          if (tag !== 3441684874) {
            break;
          }

          message.apiHref = reader.string();
          continue;
        case 508976189:
          if (tag !== 4071809514) {
            break;
          }

          message.localResourceId = reader.string();
          continue;
        case 269629306:
          if (tag !== 2157034450) {
            break;
          }

          message.reporterVersion = reader.string();
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
      consoleHref: isSet(object.console_href)
        ? globalThis.String(object.console_href)
        : "",
      apiHref: isSet(object.api_href) ? globalThis.String(object.api_href) : "",
      localResourceId: isSet(object.local_resource_id)
        ? globalThis.String(object.local_resource_id)
        : "",
      reporterVersion: isSet(object.reporter_version)
        ? globalThis.String(object.reporter_version)
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
    if (message.consoleHref !== undefined && message.consoleHref !== "") {
      obj.console_href = message.consoleHref;
    }
    if (message.apiHref !== undefined && message.apiHref !== "") {
      obj.api_href = message.apiHref;
    }
    if (
      message.localResourceId !== undefined &&
      message.localResourceId !== ""
    ) {
      obj.local_resource_id = message.localResourceId;
    }
    if (
      message.reporterVersion !== undefined &&
      message.reporterVersion !== ""
    ) {
      obj.reporter_version = message.reporterVersion;
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
    message.consoleHref = object.consoleHref ?? "";
    message.apiHref = object.apiHref ?? "";
    message.localResourceId = object.localResourceId ?? "";
    message.reporterVersion = object.reporterVersion ?? "";
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
