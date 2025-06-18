/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "kessel.inventory.v1beta1.resources";

export interface K8sPolicyDetail {
  /** Defines if the policy is currently enabled or disabled across all targets */
  disabled?: boolean | undefined;
  severity?: K8sPolicyDetail_Severity | undefined;
}

/** The kind of policy */
export enum K8sPolicyDetail_Severity {
  SEVERITY_UNSPECIFIED = 0,
  SEVERITY_OTHER = 1,
  LOW = 2,
  MEDIUM = 3,
  HIGH = 4,
  CRITICAL = 5,
  UNRECOGNIZED = -1,
}

export function k8sPolicyDetail_SeverityFromJSON(
  object: any,
): K8sPolicyDetail_Severity {
  switch (object) {
    case 0:
    case "SEVERITY_UNSPECIFIED":
      return K8sPolicyDetail_Severity.SEVERITY_UNSPECIFIED;
    case 1:
    case "SEVERITY_OTHER":
      return K8sPolicyDetail_Severity.SEVERITY_OTHER;
    case 2:
    case "LOW":
      return K8sPolicyDetail_Severity.LOW;
    case 3:
    case "MEDIUM":
      return K8sPolicyDetail_Severity.MEDIUM;
    case 4:
    case "HIGH":
      return K8sPolicyDetail_Severity.HIGH;
    case 5:
    case "CRITICAL":
      return K8sPolicyDetail_Severity.CRITICAL;
    case -1:
    case "UNRECOGNIZED":
    default:
      return K8sPolicyDetail_Severity.UNRECOGNIZED;
  }
}

export function k8sPolicyDetail_SeverityToJSON(
  object: K8sPolicyDetail_Severity,
): string {
  switch (object) {
    case K8sPolicyDetail_Severity.SEVERITY_UNSPECIFIED:
      return "SEVERITY_UNSPECIFIED";
    case K8sPolicyDetail_Severity.SEVERITY_OTHER:
      return "SEVERITY_OTHER";
    case K8sPolicyDetail_Severity.LOW:
      return "LOW";
    case K8sPolicyDetail_Severity.MEDIUM:
      return "MEDIUM";
    case K8sPolicyDetail_Severity.HIGH:
      return "HIGH";
    case K8sPolicyDetail_Severity.CRITICAL:
      return "CRITICAL";
    case K8sPolicyDetail_Severity.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseK8sPolicyDetail(): K8sPolicyDetail {
  return { disabled: false, severity: 0 };
}

export const K8sPolicyDetail = {
  encode(
    message: K8sPolicyDetail,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.disabled === true) {
      writer.uint32(2167526376).bool(message.disabled);
    }
    if (message.severity !== undefined && message.severity !== 0) {
      writer.uint32(3236468736).int32(message.severity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): K8sPolicyDetail {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseK8sPolicyDetail();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 270940797:
          if (tag !== 2167526376) {
            break;
          }

          message.disabled = reader.bool();
          continue;
        case 404558592:
          if (tag !== 3236468736) {
            break;
          }

          message.severity = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): K8sPolicyDetail {
    return {
      disabled: isSet(object.disabled)
        ? globalThis.Boolean(object.disabled)
        : false,
      severity: isSet(object.severity)
        ? k8sPolicyDetail_SeverityFromJSON(object.severity)
        : 0,
    };
  },

  toJSON(message: K8sPolicyDetail): unknown {
    const obj: any = {};
    if (message.disabled === true) {
      obj.disabled = message.disabled;
    }
    if (message.severity !== undefined && message.severity !== 0) {
      obj.severity = k8sPolicyDetail_SeverityToJSON(message.severity);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<K8sPolicyDetail>, I>>(
    base?: I,
  ): K8sPolicyDetail {
    return K8sPolicyDetail.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<K8sPolicyDetail>, I>>(
    object: I,
  ): K8sPolicyDetail {
    const message = createBaseK8sPolicyDetail();
    message.disabled = object.disabled ?? false;
    message.severity = object.severity ?? 0;
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
