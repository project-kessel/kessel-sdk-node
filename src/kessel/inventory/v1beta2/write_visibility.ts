/* eslint-disable */

export const protobufPackage = "kessel.inventory.v1beta2";

export enum WriteVisibility {
  /**
   * WRITE_VISIBILITY_UNSPECIFIED - WRITE_VISIBILITY_UNSPECIFIED: The default behavior of the write operation. Defaults to MINIMIZE_LATENCY
   *   strategy.
   */
  WRITE_VISIBILITY_UNSPECIFIED = 0,
  /**
   * MINIMIZE_LATENCY - MINIMIZE_LATENCY: The write operation will be performed with the goal of minimizing latency
   *  by not waiting for data consistency acknowledgment.
   */
  MINIMIZE_LATENCY = 1,
  /**
   * IMMEDIATE - IMMEDIATE: The write operation will be performed with the goal of ensuring immediate consistency
   *  by waiting for data consistency acknowledgment. Additional
   *  latency may be incurred
   */
  IMMEDIATE = 2,
  UNRECOGNIZED = -1,
}

export function writeVisibilityFromJSON(object: any): WriteVisibility {
  switch (object) {
    case 0:
    case "WRITE_VISIBILITY_UNSPECIFIED":
      return WriteVisibility.WRITE_VISIBILITY_UNSPECIFIED;
    case 1:
    case "MINIMIZE_LATENCY":
      return WriteVisibility.MINIMIZE_LATENCY;
    case 2:
    case "IMMEDIATE":
      return WriteVisibility.IMMEDIATE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return WriteVisibility.UNRECOGNIZED;
  }
}

export function writeVisibilityToJSON(object: WriteVisibility): string {
  switch (object) {
    case WriteVisibility.WRITE_VISIBILITY_UNSPECIFIED:
      return "WRITE_VISIBILITY_UNSPECIFIED";
    case WriteVisibility.MINIMIZE_LATENCY:
      return "MINIMIZE_LATENCY";
    case WriteVisibility.IMMEDIATE:
      return "IMMEDIATE";
    case WriteVisibility.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
