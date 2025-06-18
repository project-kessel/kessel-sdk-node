/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ConsistencyToken } from "./consistency_token";

export const protobufPackage = "kessel.inventory.v1beta2";

/** Defines how a request is handled by the service. */
export interface Consistency {
  /**
   * The service selects the fastest snapshot available.
   * *Must* be set true if used.
   */
  minimizeLatency?: boolean | undefined;
  /**
   * All data used in the API call must be *at least as fresh*
   * as found in the ConsistencyToken. More recent data might be used
   * if available or faster.
   */
  atLeastAsFresh?: ConsistencyToken | undefined;
}

function createBaseConsistency(): Consistency {
  return { minimizeLatency: undefined, atLeastAsFresh: undefined };
}

export const Consistency = {
  encode(
    message: Consistency,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.minimizeLatency !== undefined) {
      writer.uint32(8).bool(message.minimizeLatency);
    }
    if (message.atLeastAsFresh !== undefined) {
      ConsistencyToken.encode(
        message.atLeastAsFresh,
        writer.uint32(18).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Consistency {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsistency();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.minimizeLatency = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.atLeastAsFresh = ConsistencyToken.decode(
            reader,
            reader.uint32(),
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

  fromJSON(object: any): Consistency {
    return {
      minimizeLatency: isSet(object.minimizeLatency)
        ? globalThis.Boolean(object.minimizeLatency)
        : undefined,
      atLeastAsFresh: isSet(object.atLeastAsFresh)
        ? ConsistencyToken.fromJSON(object.atLeastAsFresh)
        : undefined,
    };
  },

  toJSON(message: Consistency): unknown {
    const obj: any = {};
    if (message.minimizeLatency !== undefined) {
      obj.minimizeLatency = message.minimizeLatency;
    }
    if (message.atLeastAsFresh !== undefined) {
      obj.atLeastAsFresh = ConsistencyToken.toJSON(message.atLeastAsFresh);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Consistency>, I>>(base?: I): Consistency {
    return Consistency.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Consistency>, I>>(
    object: I,
  ): Consistency {
    const message = createBaseConsistency();
    message.minimizeLatency = object.minimizeLatency ?? undefined;
    message.atLeastAsFresh =
      object.atLeastAsFresh !== undefined && object.atLeastAsFresh !== null
        ? ConsistencyToken.fromPartial(object.atLeastAsFresh)
        : undefined;
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
