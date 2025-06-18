/* eslint-disable */

export const protobufPackage = "kessel.inventory.v1beta2";

export enum Allowed {
  ALLOWED_UNSPECIFIED = 0,
  ALLOWED_TRUE = 1,
  /** ALLOWED_FALSE - ALLOWED_CONDITIONAL = 3; // uncomment when used */
  ALLOWED_FALSE = 2,
  UNRECOGNIZED = -1,
}

export function allowedFromJSON(object: any): Allowed {
  switch (object) {
    case 0:
    case "ALLOWED_UNSPECIFIED":
      return Allowed.ALLOWED_UNSPECIFIED;
    case 1:
    case "ALLOWED_TRUE":
      return Allowed.ALLOWED_TRUE;
    case 2:
    case "ALLOWED_FALSE":
      return Allowed.ALLOWED_FALSE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Allowed.UNRECOGNIZED;
  }
}

export function allowedToJSON(object: Allowed): string {
  switch (object) {
    case Allowed.ALLOWED_UNSPECIFIED:
      return "ALLOWED_UNSPECIFIED";
    case Allowed.ALLOWED_TRUE:
      return "ALLOWED_TRUE";
    case Allowed.ALLOWED_FALSE:
      return "ALLOWED_FALSE";
    case Allowed.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
