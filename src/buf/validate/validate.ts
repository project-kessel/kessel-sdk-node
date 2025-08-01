/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  FieldDescriptorProto_Type,
  fieldDescriptorProto_TypeFromJSON,
  fieldDescriptorProto_TypeToJSON,
} from "../../google/protobuf/descriptor";
import { Duration } from "../../google/protobuf/duration";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "buf.validate";

/**
 * Specifies how FieldRules.ignore behaves. See the documentation for
 * FieldRules.required for definitions of "populated" and "nullable".
 */
export enum Ignore {
  /**
   * IGNORE_UNSPECIFIED - Validation is only skipped if it's an unpopulated nullable field.
   *
   * ```proto
   * syntax="proto3";
   *
   * message Request {
   *   // The uri rule applies to any value, including the empty string.
   *   string foo = 1 [
   *     (buf.validate.field).string.uri = true
   *   ];
   *
   *   // The uri rule only applies if the field is set, including if it's
   *   // set to the empty string.
   *   optional string bar = 2 [
   *     (buf.validate.field).string.uri = true
   *   ];
   *
   *   // The min_items rule always applies, even if the list is empty.
   *   repeated string baz = 3 [
   *     (buf.validate.field).repeated.min_items = 3
   *   ];
   *
   *   // The custom CEL rule applies only if the field is set, including if
   *   // it's the "zero" value of that message.
   *   SomeMessage quux = 4 [
   *     (buf.validate.field).cel = {/* ... * /}
   *   ];
   * }
   * ```
   */
  IGNORE_UNSPECIFIED = 0,
  /**
   * IGNORE_IF_UNPOPULATED - Validation is skipped if the field is unpopulated. This rule is redundant
   * if the field is already nullable.
   *
   * ```proto
   * syntax="proto3
   *
   * message Request {
   *   // The uri rule applies only if the value is not the empty string.
   *   string foo = 1 [
   *     (buf.validate.field).string.uri = true,
   *     (buf.validate.field).ignore = IGNORE_IF_UNPOPULATED
   *   ];
   *
   *   // IGNORE_IF_UNPOPULATED is equivalent to IGNORE_UNSPECIFIED in this
   *   // case: the uri rule only applies if the field is set, including if
   *   // it's set to the empty string.
   *   optional string bar = 2 [
   *     (buf.validate.field).string.uri = true,
   *     (buf.validate.field).ignore = IGNORE_IF_UNPOPULATED
   *   ];
   *
   *   // The min_items rule only applies if the list has at least one item.
   *   repeated string baz = 3 [
   *     (buf.validate.field).repeated.min_items = 3,
   *     (buf.validate.field).ignore = IGNORE_IF_UNPOPULATED
   *   ];
   *
   *   // IGNORE_IF_UNPOPULATED is equivalent to IGNORE_UNSPECIFIED in this
   *   // case: the custom CEL rule applies only if the field is set, including
   *   // if it's the "zero" value of that message.
   *   SomeMessage quux = 4 [
   *     (buf.validate.field).cel = {/* ... * /},
   *     (buf.validate.field).ignore = IGNORE_IF_UNPOPULATED
   *   ];
   * }
   * ```
   */
  IGNORE_IF_UNPOPULATED = 1,
  /**
   * IGNORE_IF_DEFAULT_VALUE - Validation is skipped if the field is unpopulated or if it is a nullable
   * field populated with its default value. This is typically the zero or
   * empty value, but proto2 scalars support custom defaults. For messages, the
   * default is a non-null message with all its fields unpopulated.
   *
   * ```proto
   * syntax="proto3
   *
   * message Request {
   *   // IGNORE_IF_DEFAULT_VALUE is equivalent to IGNORE_IF_UNPOPULATED in
   *   // this case; the uri rule applies only if the value is not the empty
   *   // string.
   *   string foo = 1 [
   *     (buf.validate.field).string.uri = true,
   *     (buf.validate.field).ignore = IGNORE_IF_DEFAULT_VALUE
   *   ];
   *
   *   // The uri rule only applies if the field is set to a value other than
   *   // the empty string.
   *   optional string bar = 2 [
   *     (buf.validate.field).string.uri = true,
   *     (buf.validate.field).ignore = IGNORE_IF_DEFAULT_VALUE
   *   ];
   *
   *   // IGNORE_IF_DEFAULT_VALUE is equivalent to IGNORE_IF_UNPOPULATED in
   *   // this case; the min_items rule only applies if the list has at least
   *   // one item.
   *   repeated string baz = 3 [
   *     (buf.validate.field).repeated.min_items = 3,
   *     (buf.validate.field).ignore = IGNORE_IF_DEFAULT_VALUE
   *   ];
   *
   *   // The custom CEL rule only applies if the field is set to a value other
   *   // than an empty message (i.e., fields are unpopulated).
   *   SomeMessage quux = 4 [
   *     (buf.validate.field).cel = {/* ... * /},
   *     (buf.validate.field).ignore = IGNORE_IF_DEFAULT_VALUE
   *   ];
   * }
   * ```
   *
   * This rule is affected by proto2 custom default values:
   *
   * ```proto
   * syntax="proto2";
   *
   * message Request {
   *   // The gt rule only applies if the field is set and it's value is not
   *   the default (i.e., not -42). The rule even applies if the field is set
   *   to zero since the default value differs.
   *   optional int32 value = 1 [
   *     default = -42,
   *     (buf.validate.field).int32.gt = 0,
   *     (buf.validate.field).ignore = IGNORE_IF_DEFAULT_VALUE
   *   ];
   * }
   */
  IGNORE_IF_DEFAULT_VALUE = 2,
  /**
   * IGNORE_ALWAYS - The validation rules of this field will be skipped and not evaluated. This
   * is useful for situations that necessitate turning off the rules of a field
   * containing a message that may not make sense in the current context, or to
   * temporarily disable rules during development.
   *
   * ```proto
   * message MyMessage {
   *   // The field's rules will always be ignored, including any validation's
   *   // on value's fields.
   *   MyOtherMessage value = 1 [
   *     (buf.validate.field).ignore = IGNORE_ALWAYS];
   * }
   * ```
   */
  IGNORE_ALWAYS = 3,
  UNRECOGNIZED = -1,
}

export function ignoreFromJSON(object: any): Ignore {
  switch (object) {
    case 0:
    case "IGNORE_UNSPECIFIED":
      return Ignore.IGNORE_UNSPECIFIED;
    case 1:
    case "IGNORE_IF_UNPOPULATED":
      return Ignore.IGNORE_IF_UNPOPULATED;
    case 2:
    case "IGNORE_IF_DEFAULT_VALUE":
      return Ignore.IGNORE_IF_DEFAULT_VALUE;
    case 3:
    case "IGNORE_ALWAYS":
      return Ignore.IGNORE_ALWAYS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Ignore.UNRECOGNIZED;
  }
}

export function ignoreToJSON(object: Ignore): string {
  switch (object) {
    case Ignore.IGNORE_UNSPECIFIED:
      return "IGNORE_UNSPECIFIED";
    case Ignore.IGNORE_IF_UNPOPULATED:
      return "IGNORE_IF_UNPOPULATED";
    case Ignore.IGNORE_IF_DEFAULT_VALUE:
      return "IGNORE_IF_DEFAULT_VALUE";
    case Ignore.IGNORE_ALWAYS:
      return "IGNORE_ALWAYS";
    case Ignore.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** KnownRegex contains some well-known patterns. */
export enum KnownRegex {
  KNOWN_REGEX_UNSPECIFIED = 0,
  /** KNOWN_REGEX_HTTP_HEADER_NAME - HTTP header name as defined by [RFC 7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3.2). */
  KNOWN_REGEX_HTTP_HEADER_NAME = 1,
  /** KNOWN_REGEX_HTTP_HEADER_VALUE - HTTP header value as defined by [RFC 7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.4). */
  KNOWN_REGEX_HTTP_HEADER_VALUE = 2,
  UNRECOGNIZED = -1,
}

export function knownRegexFromJSON(object: any): KnownRegex {
  switch (object) {
    case 0:
    case "KNOWN_REGEX_UNSPECIFIED":
      return KnownRegex.KNOWN_REGEX_UNSPECIFIED;
    case 1:
    case "KNOWN_REGEX_HTTP_HEADER_NAME":
      return KnownRegex.KNOWN_REGEX_HTTP_HEADER_NAME;
    case 2:
    case "KNOWN_REGEX_HTTP_HEADER_VALUE":
      return KnownRegex.KNOWN_REGEX_HTTP_HEADER_VALUE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return KnownRegex.UNRECOGNIZED;
  }
}

export function knownRegexToJSON(object: KnownRegex): string {
  switch (object) {
    case KnownRegex.KNOWN_REGEX_UNSPECIFIED:
      return "KNOWN_REGEX_UNSPECIFIED";
    case KnownRegex.KNOWN_REGEX_HTTP_HEADER_NAME:
      return "KNOWN_REGEX_HTTP_HEADER_NAME";
    case KnownRegex.KNOWN_REGEX_HTTP_HEADER_VALUE:
      return "KNOWN_REGEX_HTTP_HEADER_VALUE";
    case KnownRegex.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * `Rule` represents a validation rule written in the Common Expression
 * Language (CEL) syntax. Each Rule includes a unique identifier, an
 * optional error message, and the CEL expression to evaluate. For more
 * information, [see our documentation](https://buf.build/docs/protovalidate/schemas/custom-rules/).
 *
 * ```proto
 * message Foo {
 *   option (buf.validate.message).cel = {
 *     id: "foo.bar"
 *     message: "bar must be greater than 0"
 *     expression: "this.bar > 0"
 *   };
 *   int32 bar = 1;
 * }
 * ```
 */
export interface Rule {
  /**
   * `id` is a string that serves as a machine-readable name for this Rule.
   * It should be unique within its scope, which could be either a message or a field.
   */
  id?: string | undefined;
  /**
   * `message` is an optional field that provides a human-readable error message
   * for this Rule when the CEL expression evaluates to false. If a
   * non-empty message is provided, any strings resulting from the CEL
   * expression evaluation are ignored.
   */
  message?: string | undefined;
  /**
   * `expression` is the actual CEL expression that will be evaluated for
   * validation. This string must resolve to either a boolean or a string
   * value. If the expression evaluates to false or a non-empty string, the
   * validation is considered failed, and the message is rejected.
   */
  expression?: string | undefined;
}

/**
 * MessageRules represents validation rules that are applied to the entire message.
 * It includes disabling options and a list of Rule messages representing Common Expression Language (CEL) validation rules.
 */
export interface MessageRules {
  /**
   * `disabled` is a boolean flag that, when set to true, nullifies any validation rules for this message.
   * This includes any fields within the message that would otherwise support validation.
   *
   * ```proto
   * message MyMessage {
   *   // validation will be bypassed for this message
   *   option (buf.validate.message).disabled = true;
   * }
   * ```
   */
  disabled?: boolean | undefined;
  /**
   * `cel` is a repeated field of type Rule. Each Rule specifies a validation rule to be applied to this message.
   * These rules are written in Common Expression Language (CEL) syntax. For more information,
   * [see our documentation](https://buf.build/docs/protovalidate/schemas/custom-rules/).
   *
   * ```proto
   * message MyMessage {
   *   // The field `foo` must be greater than 42.
   *   option (buf.validate.message).cel = {
   *     id: "my_message.value",
   *     message: "value must be greater than 42",
   *     expression: "this.foo > 42",
   *   };
   *   optional int32 foo = 1;
   * }
   * ```
   */
  cel?: Rule[] | undefined;
  /**
   * `oneof` is a repeated field of type MessageOneofRule that specifies a list of fields
   * of which at most one can be present. If `required` is also specified, then exactly one
   * of the specified fields _must_ be present.
   *
   * This will enforce oneof-like constraints with a few features not provided by
   * actual Protobuf oneof declarations:
   *   1. Repeated and map fields are allowed in this validation. In a Protobuf oneof,
   *      only scalar fields are allowed.
   *   2. Fields with implicit presence are allowed. In a Protobuf oneof, all member
   *      fields have explicit presence. This means that, for the purpose of determining
   *      how many fields are set, explicitly setting such a field to its zero value is
   *      effectively the same as not setting it at all.
   *   3. This will always generate validation errors for a message unmarshalled from
   *      serialized data that sets more than one field. With a Protobuf oneof, when
   *      multiple fields are present in the serialized form, earlier values are usually
   *      silently ignored when unmarshalling, with only the last field being set when
   *      unmarshalling completes.
   *
   * Note that adding a field to a `oneof` will also set the IGNORE_IF_UNPOPULATED on the fields. This means
   * only the field that is set will be validated and the unset fields are not validated according to the field rules.
   * This behavior can be overridden by setting `ignore` against a field.
   *
   * ```proto
   * message MyMessage {
   *   // Only one of `field1` or `field2` _can_ be present in this message.
   *   option (buf.validate.message).oneof = { fields: ["field1", "field2"] };
   *   // Exactly one of `field3` or `field4` _must_ be present in this message.
   *   option (buf.validate.message).oneof = { fields: ["field3", "field4"], required: true };
   *   string field1 = 1;
   *   bytes field2 = 2;
   *   bool field3 = 3;
   *   int32 field4 = 4;
   * }
   * ```
   */
  oneof?: MessageOneofRule[] | undefined;
}

export interface MessageOneofRule {
  /**
   * A list of field names to include in the oneof. All field names must be
   * defined in the message. At least one field must be specified, and
   * duplicates are not permitted.
   */
  fields?: string[] | undefined;
  /** If true, one of the fields specified _must_ be set. */
  required?: boolean | undefined;
}

/**
 * The `OneofRules` message type enables you to manage rules for
 * oneof fields in your protobuf messages.
 */
export interface OneofRules {
  /**
   * If `required` is true, exactly one field of the oneof must be present. A
   * validation error is returned if no fields in the oneof are present. The
   * field itself may still be a default value; further rules
   * should be placed on the fields themselves to ensure they are valid values,
   * such as `min_len` or `gt`.
   *
   * ```proto
   * message MyMessage {
   *   oneof value {
   *     // Either `a` or `b` must be set. If `a` is set, it must also be
   *     // non-empty; whereas if `b` is set, it can still be an empty string.
   *     option (buf.validate.oneof).required = true;
   *     string a = 1 [(buf.validate.field).string.min_len = 1];
   *     string b = 2;
   *   }
   * }
   * ```
   */
  required?: boolean | undefined;
}

/**
 * FieldRules encapsulates the rules for each type of field. Depending on
 * the field, the correct set should be used to ensure proper validations.
 */
export interface FieldRules {
  /**
   * `cel` is a repeated field used to represent a textual expression
   * in the Common Expression Language (CEL) syntax. For more information,
   * [see our documentation](https://buf.build/docs/protovalidate/schemas/custom-rules/).
   *
   * ```proto
   * message MyMessage {
   *   // The field `value` must be greater than 42.
   *   optional int32 value = 1 [(buf.validate.field).cel = {
   *     id: "my_message.value",
   *     message: "value must be greater than 42",
   *     expression: "this > 42",
   *   }];
   * }
   * ```
   */
  cel?: Rule[] | undefined;
  /**
   * If `required` is true, the field must be populated. A populated field can be
   * described as "serialized in the wire format," which includes:
   *
   * - the following "nullable" fields must be explicitly set to be considered populated:
   *   - singular message fields (whose fields may be unpopulated/default values)
   *   - member fields of a oneof (may be their default value)
   *   - proto3 optional fields (may be their default value)
   *   - proto2 scalar fields (both optional and required)
   * - proto3 scalar fields must be non-zero to be considered populated
   * - repeated and map fields must be non-empty to be considered populated
   * - map keys/values and repeated items are always considered populated
   *
   * ```proto
   * message MyMessage {
   *   // The field `value` must be set to a non-null value.
   *   optional MyOtherMessage value = 1 [(buf.validate.field).required = true];
   * }
   * ```
   */
  required?: boolean | undefined;
  /**
   * Skip validation on the field if its value matches the specified criteria.
   * See Ignore enum for details.
   *
   * ```proto
   * message UpdateRequest {
   *   // The uri rule only applies if the field is populated and not an empty
   *   // string.
   *   optional string url = 1 [
   *     (buf.validate.field).ignore = IGNORE_IF_DEFAULT_VALUE,
   *     (buf.validate.field).string.uri = true,
   *   ];
   * }
   * ```
   */
  ignore?: Ignore | undefined;
  /** Scalar Field Types */
  float?: FloatRules | undefined;
  double?: DoubleRules | undefined;
  int32?: Int32Rules | undefined;
  int64?: Int64Rules | undefined;
  uint32?: UInt32Rules | undefined;
  uint64?: UInt64Rules | undefined;
  sint32?: SInt32Rules | undefined;
  sint64?: SInt64Rules | undefined;
  fixed32?: Fixed32Rules | undefined;
  fixed64?: Fixed64Rules | undefined;
  sfixed32?: SFixed32Rules | undefined;
  sfixed64?: SFixed64Rules | undefined;
  bool?: BoolRules | undefined;
  string?: StringRules | undefined;
  bytes?: BytesRules | undefined;
  /** Complex Field Types */
  enum?: EnumRules | undefined;
  repeated?: RepeatedRules | undefined;
  map?: MapRules | undefined;
  /** Well-Known Field Types */
  any?: AnyRules | undefined;
  duration?: DurationRules | undefined;
  timestamp?: TimestampRules | undefined;
}

/**
 * PredefinedRules are custom rules that can be re-used with
 * multiple fields.
 */
export interface PredefinedRules {
  /**
   * `cel` is a repeated field used to represent a textual expression
   * in the Common Expression Language (CEL) syntax. For more information,
   * [see our documentation](https://buf.build/docs/protovalidate/schemas/predefined-rules/).
   *
   * ```proto
   * message MyMessage {
   *   // The field `value` must be greater than 42.
   *   optional int32 value = 1 [(buf.validate.predefined).cel = {
   *     id: "my_message.value",
   *     message: "value must be greater than 42",
   *     expression: "this > 42",
   *   }];
   * }
   * ```
   */
  cel?: Rule[] | undefined;
}

/**
 * FloatRules describes the rules applied to `float` values. These
 * rules may also be applied to the `google.protobuf.FloatValue` Well-Known-Type.
 */
export interface FloatRules {
  /**
   * `const` requires the field value to exactly match the specified value. If
   * the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MyFloat {
   *   // value must equal 42.0
   *   float value = 1 [(buf.validate.field).float.const = 42.0];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `lt` requires the field value to be less than the specified value (field <
   * value). If the field value is equal to or greater than the specified value,
   * an error message is generated.
   *
   * ```proto
   * message MyFloat {
   *   // value must be less than 10.0
   *   float value = 1 [(buf.validate.field).float.lt = 10.0];
   * }
   * ```
   */
  lt?: number | undefined;
  /**
   * `lte` requires the field value to be less than or equal to the specified
   * value (field <= value). If the field value is greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MyFloat {
   *   // value must be less than or equal to 10.0
   *   float value = 1 [(buf.validate.field).float.lte = 10.0];
   * }
   * ```
   */
  lte?: number | undefined;
  /**
   * `gt` requires the field value to be greater than the specified value
   * (exclusive). If the value of `gt` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyFloat {
   *   // value must be greater than 5.0 [float.gt]
   *   float value = 1 [(buf.validate.field).float.gt = 5.0];
   *
   *   // value must be greater than 5 and less than 10.0 [float.gt_lt]
   *   float other_value = 2 [(buf.validate.field).float = { gt: 5.0, lt: 10.0 }];
   *
   *   // value must be greater than 10 or less than 5.0 [float.gt_lt_exclusive]
   *   float another_value = 3 [(buf.validate.field).float = { gt: 10.0, lt: 5.0 }];
   * }
   * ```
   */
  gt?: number | undefined;
  /**
   * `gte` requires the field value to be greater than or equal to the specified
   * value (exclusive). If the value of `gte` is larger than a specified `lt`
   * or `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyFloat {
   *   // value must be greater than or equal to 5.0 [float.gte]
   *   float value = 1 [(buf.validate.field).float.gte = 5.0];
   *
   *   // value must be greater than or equal to 5.0 and less than 10.0 [float.gte_lt]
   *   float other_value = 2 [(buf.validate.field).float = { gte: 5.0, lt: 10.0 }];
   *
   *   // value must be greater than or equal to 10.0 or less than 5.0 [float.gte_lt_exclusive]
   *   float another_value = 3 [(buf.validate.field).float = { gte: 10.0, lt: 5.0 }];
   * }
   * ```
   */
  gte?: number | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified values.
   * If the field value isn't one of the specified values, an error message
   * is generated.
   *
   * ```proto
   * message MyFloat {
   *   // value must be in list [1.0, 2.0, 3.0]
   *   float value = 1 [(buf.validate.field).float = { in: [1.0, 2.0, 3.0] }];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `in` requires the field value to not be equal to any of the specified
   * values. If the field value is one of the specified values, an error
   * message is generated.
   *
   * ```proto
   * message MyFloat {
   *   // value must not be in list [1.0, 2.0, 3.0]
   *   float value = 1 [(buf.validate.field).float = { not_in: [1.0, 2.0, 3.0] }];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `finite` requires the field value to be finite. If the field value is
   * infinite or NaN, an error message is generated.
   */
  finite?: boolean | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyFloat {
   *   float value = 1 [
   *     (buf.validate.field).float.example = 1.0,
   *     (buf.validate.field).float.example = inf
   *   ];
   * }
   * ```
   */
  example?: number[] | undefined;
}

/**
 * DoubleRules describes the rules applied to `double` values. These
 * rules may also be applied to the `google.protobuf.DoubleValue` Well-Known-Type.
 */
export interface DoubleRules {
  /**
   * `const` requires the field value to exactly match the specified value. If
   * the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MyDouble {
   *   // value must equal 42.0
   *   double value = 1 [(buf.validate.field).double.const = 42.0];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `lt` requires the field value to be less than the specified value (field <
   * value). If the field value is equal to or greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MyDouble {
   *   // value must be less than 10.0
   *   double value = 1 [(buf.validate.field).double.lt = 10.0];
   * }
   * ```
   */
  lt?: number | undefined;
  /**
   * `lte` requires the field value to be less than or equal to the specified value
   * (field <= value). If the field value is greater than the specified value,
   * an error message is generated.
   *
   * ```proto
   * message MyDouble {
   *   // value must be less than or equal to 10.0
   *   double value = 1 [(buf.validate.field).double.lte = 10.0];
   * }
   * ```
   */
  lte?: number | undefined;
  /**
   * `gt` requires the field value to be greater than the specified value
   * (exclusive). If the value of `gt` is larger than a specified `lt` or `lte`,
   * the range is reversed, and the field value must be outside the specified
   * range. If the field value doesn't meet the required conditions, an error
   * message is generated.
   *
   * ```proto
   * message MyDouble {
   *   // value must be greater than 5.0 [double.gt]
   *   double value = 1 [(buf.validate.field).double.gt = 5.0];
   *
   *   // value must be greater than 5 and less than 10.0 [double.gt_lt]
   *   double other_value = 2 [(buf.validate.field).double = { gt: 5.0, lt: 10.0 }];
   *
   *   // value must be greater than 10 or less than 5.0 [double.gt_lt_exclusive]
   *   double another_value = 3 [(buf.validate.field).double = { gt: 10.0, lt: 5.0 }];
   * }
   * ```
   */
  gt?: number | undefined;
  /**
   * `gte` requires the field value to be greater than or equal to the specified
   * value (exclusive). If the value of `gte` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyDouble {
   *   // value must be greater than or equal to 5.0 [double.gte]
   *   double value = 1 [(buf.validate.field).double.gte = 5.0];
   *
   *   // value must be greater than or equal to 5.0 and less than 10.0 [double.gte_lt]
   *   double other_value = 2 [(buf.validate.field).double = { gte: 5.0, lt: 10.0 }];
   *
   *   // value must be greater than or equal to 10.0 or less than 5.0 [double.gte_lt_exclusive]
   *   double another_value = 3 [(buf.validate.field).double = { gte: 10.0, lt: 5.0 }];
   * }
   * ```
   */
  gte?: number | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified values.
   * If the field value isn't one of the specified values, an error message is
   * generated.
   *
   * ```proto
   * message MyDouble {
   *   // value must be in list [1.0, 2.0, 3.0]
   *   double value = 1 [(buf.validate.field).double = { in: [1.0, 2.0, 3.0] }];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `not_in` requires the field value to not be equal to any of the specified
   * values. If the field value is one of the specified values, an error
   * message is generated.
   *
   * ```proto
   * message MyDouble {
   *   // value must not be in list [1.0, 2.0, 3.0]
   *   double value = 1 [(buf.validate.field).double = { not_in: [1.0, 2.0, 3.0] }];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `finite` requires the field value to be finite. If the field value is
   * infinite or NaN, an error message is generated.
   */
  finite?: boolean | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyDouble {
   *   double value = 1 [
   *     (buf.validate.field).double.example = 1.0,
   *     (buf.validate.field).double.example = inf
   *   ];
   * }
   * ```
   */
  example?: number[] | undefined;
}

/**
 * Int32Rules describes the rules applied to `int32` values. These
 * rules may also be applied to the `google.protobuf.Int32Value` Well-Known-Type.
 */
export interface Int32Rules {
  /**
   * `const` requires the field value to exactly match the specified value. If
   * the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MyInt32 {
   *   // value must equal 42
   *   int32 value = 1 [(buf.validate.field).int32.const = 42];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `lt` requires the field value to be less than the specified value (field
   * < value). If the field value is equal to or greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MyInt32 {
   *   // value must be less than 10
   *   int32 value = 1 [(buf.validate.field).int32.lt = 10];
   * }
   * ```
   */
  lt?: number | undefined;
  /**
   * `lte` requires the field value to be less than or equal to the specified
   * value (field <= value). If the field value is greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MyInt32 {
   *   // value must be less than or equal to 10
   *   int32 value = 1 [(buf.validate.field).int32.lte = 10];
   * }
   * ```
   */
  lte?: number | undefined;
  /**
   * `gt` requires the field value to be greater than the specified value
   * (exclusive). If the value of `gt` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyInt32 {
   *   // value must be greater than 5 [int32.gt]
   *   int32 value = 1 [(buf.validate.field).int32.gt = 5];
   *
   *   // value must be greater than 5 and less than 10 [int32.gt_lt]
   *   int32 other_value = 2 [(buf.validate.field).int32 = { gt: 5, lt: 10 }];
   *
   *   // value must be greater than 10 or less than 5 [int32.gt_lt_exclusive]
   *   int32 another_value = 3 [(buf.validate.field).int32 = { gt: 10, lt: 5 }];
   * }
   * ```
   */
  gt?: number | undefined;
  /**
   * `gte` requires the field value to be greater than or equal to the specified value
   * (exclusive). If the value of `gte` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyInt32 {
   *   // value must be greater than or equal to 5 [int32.gte]
   *   int32 value = 1 [(buf.validate.field).int32.gte = 5];
   *
   *   // value must be greater than or equal to 5 and less than 10 [int32.gte_lt]
   *   int32 other_value = 2 [(buf.validate.field).int32 = { gte: 5, lt: 10 }];
   *
   *   // value must be greater than or equal to 10 or less than 5 [int32.gte_lt_exclusive]
   *   int32 another_value = 3 [(buf.validate.field).int32 = { gte: 10, lt: 5 }];
   * }
   * ```
   */
  gte?: number | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified values.
   * If the field value isn't one of the specified values, an error message is
   * generated.
   *
   * ```proto
   * message MyInt32 {
   *   // value must be in list [1, 2, 3]
   *   int32 value = 1 [(buf.validate.field).int32 = { in: [1, 2, 3] }];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `not_in` requires the field value to not be equal to any of the specified
   * values. If the field value is one of the specified values, an error message
   * is generated.
   *
   * ```proto
   * message MyInt32 {
   *   // value must not be in list [1, 2, 3]
   *   int32 value = 1 [(buf.validate.field).int32 = { not_in: [1, 2, 3] }];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyInt32 {
   *   int32 value = 1 [
   *     (buf.validate.field).int32.example = 1,
   *     (buf.validate.field).int32.example = -10
   *   ];
   * }
   * ```
   */
  example?: number[] | undefined;
}

/**
 * Int64Rules describes the rules applied to `int64` values. These
 * rules may also be applied to the `google.protobuf.Int64Value` Well-Known-Type.
 */
export interface Int64Rules {
  /**
   * `const` requires the field value to exactly match the specified value. If
   * the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MyInt64 {
   *   // value must equal 42
   *   int64 value = 1 [(buf.validate.field).int64.const = 42];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `lt` requires the field value to be less than the specified value (field <
   * value). If the field value is equal to or greater than the specified value,
   * an error message is generated.
   *
   * ```proto
   * message MyInt64 {
   *   // value must be less than 10
   *   int64 value = 1 [(buf.validate.field).int64.lt = 10];
   * }
   * ```
   */
  lt?: number | undefined;
  /**
   * `lte` requires the field value to be less than or equal to the specified
   * value (field <= value). If the field value is greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MyInt64 {
   *   // value must be less than or equal to 10
   *   int64 value = 1 [(buf.validate.field).int64.lte = 10];
   * }
   * ```
   */
  lte?: number | undefined;
  /**
   * `gt` requires the field value to be greater than the specified value
   * (exclusive). If the value of `gt` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyInt64 {
   *   // value must be greater than 5 [int64.gt]
   *   int64 value = 1 [(buf.validate.field).int64.gt = 5];
   *
   *   // value must be greater than 5 and less than 10 [int64.gt_lt]
   *   int64 other_value = 2 [(buf.validate.field).int64 = { gt: 5, lt: 10 }];
   *
   *   // value must be greater than 10 or less than 5 [int64.gt_lt_exclusive]
   *   int64 another_value = 3 [(buf.validate.field).int64 = { gt: 10, lt: 5 }];
   * }
   * ```
   */
  gt?: number | undefined;
  /**
   * `gte` requires the field value to be greater than or equal to the specified
   * value (exclusive). If the value of `gte` is larger than a specified `lt`
   * or `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyInt64 {
   *   // value must be greater than or equal to 5 [int64.gte]
   *   int64 value = 1 [(buf.validate.field).int64.gte = 5];
   *
   *   // value must be greater than or equal to 5 and less than 10 [int64.gte_lt]
   *   int64 other_value = 2 [(buf.validate.field).int64 = { gte: 5, lt: 10 }];
   *
   *   // value must be greater than or equal to 10 or less than 5 [int64.gte_lt_exclusive]
   *   int64 another_value = 3 [(buf.validate.field).int64 = { gte: 10, lt: 5 }];
   * }
   * ```
   */
  gte?: number | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified values.
   * If the field value isn't one of the specified values, an error message is
   * generated.
   *
   * ```proto
   * message MyInt64 {
   *   // value must be in list [1, 2, 3]
   *   int64 value = 1 [(buf.validate.field).int64 = { in: [1, 2, 3] }];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `not_in` requires the field value to not be equal to any of the specified
   * values. If the field value is one of the specified values, an error
   * message is generated.
   *
   * ```proto
   * message MyInt64 {
   *   // value must not be in list [1, 2, 3]
   *   int64 value = 1 [(buf.validate.field).int64 = { not_in: [1, 2, 3] }];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyInt64 {
   *   int64 value = 1 [
   *     (buf.validate.field).int64.example = 1,
   *     (buf.validate.field).int64.example = -10
   *   ];
   * }
   * ```
   */
  example?: number[] | undefined;
}

/**
 * UInt32Rules describes the rules applied to `uint32` values. These
 * rules may also be applied to the `google.protobuf.UInt32Value` Well-Known-Type.
 */
export interface UInt32Rules {
  /**
   * `const` requires the field value to exactly match the specified value. If
   * the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MyUInt32 {
   *   // value must equal 42
   *   uint32 value = 1 [(buf.validate.field).uint32.const = 42];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `lt` requires the field value to be less than the specified value (field <
   * value). If the field value is equal to or greater than the specified value,
   * an error message is generated.
   *
   * ```proto
   * message MyUInt32 {
   *   // value must be less than 10
   *   uint32 value = 1 [(buf.validate.field).uint32.lt = 10];
   * }
   * ```
   */
  lt?: number | undefined;
  /**
   * `lte` requires the field value to be less than or equal to the specified
   * value (field <= value). If the field value is greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MyUInt32 {
   *   // value must be less than or equal to 10
   *   uint32 value = 1 [(buf.validate.field).uint32.lte = 10];
   * }
   * ```
   */
  lte?: number | undefined;
  /**
   * `gt` requires the field value to be greater than the specified value
   * (exclusive). If the value of `gt` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyUInt32 {
   *   // value must be greater than 5 [uint32.gt]
   *   uint32 value = 1 [(buf.validate.field).uint32.gt = 5];
   *
   *   // value must be greater than 5 and less than 10 [uint32.gt_lt]
   *   uint32 other_value = 2 [(buf.validate.field).uint32 = { gt: 5, lt: 10 }];
   *
   *   // value must be greater than 10 or less than 5 [uint32.gt_lt_exclusive]
   *   uint32 another_value = 3 [(buf.validate.field).uint32 = { gt: 10, lt: 5 }];
   * }
   * ```
   */
  gt?: number | undefined;
  /**
   * `gte` requires the field value to be greater than or equal to the specified
   * value (exclusive). If the value of `gte` is larger than a specified `lt`
   * or `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyUInt32 {
   *   // value must be greater than or equal to 5 [uint32.gte]
   *   uint32 value = 1 [(buf.validate.field).uint32.gte = 5];
   *
   *   // value must be greater than or equal to 5 and less than 10 [uint32.gte_lt]
   *   uint32 other_value = 2 [(buf.validate.field).uint32 = { gte: 5, lt: 10 }];
   *
   *   // value must be greater than or equal to 10 or less than 5 [uint32.gte_lt_exclusive]
   *   uint32 another_value = 3 [(buf.validate.field).uint32 = { gte: 10, lt: 5 }];
   * }
   * ```
   */
  gte?: number | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified values.
   * If the field value isn't one of the specified values, an error message is
   * generated.
   *
   * ```proto
   * message MyUInt32 {
   *   // value must be in list [1, 2, 3]
   *   uint32 value = 1 [(buf.validate.field).uint32 = { in: [1, 2, 3] }];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `not_in` requires the field value to not be equal to any of the specified
   * values. If the field value is one of the specified values, an error
   * message is generated.
   *
   * ```proto
   * message MyUInt32 {
   *   // value must not be in list [1, 2, 3]
   *   uint32 value = 1 [(buf.validate.field).uint32 = { not_in: [1, 2, 3] }];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyUInt32 {
   *   uint32 value = 1 [
   *     (buf.validate.field).uint32.example = 1,
   *     (buf.validate.field).uint32.example = 10
   *   ];
   * }
   * ```
   */
  example?: number[] | undefined;
}

/**
 * UInt64Rules describes the rules applied to `uint64` values. These
 * rules may also be applied to the `google.protobuf.UInt64Value` Well-Known-Type.
 */
export interface UInt64Rules {
  /**
   * `const` requires the field value to exactly match the specified value. If
   * the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MyUInt64 {
   *   // value must equal 42
   *   uint64 value = 1 [(buf.validate.field).uint64.const = 42];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `lt` requires the field value to be less than the specified value (field <
   * value). If the field value is equal to or greater than the specified value,
   * an error message is generated.
   *
   * ```proto
   * message MyUInt64 {
   *   // value must be less than 10
   *   uint64 value = 1 [(buf.validate.field).uint64.lt = 10];
   * }
   * ```
   */
  lt?: number | undefined;
  /**
   * `lte` requires the field value to be less than or equal to the specified
   * value (field <= value). If the field value is greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MyUInt64 {
   *   // value must be less than or equal to 10
   *   uint64 value = 1 [(buf.validate.field).uint64.lte = 10];
   * }
   * ```
   */
  lte?: number | undefined;
  /**
   * `gt` requires the field value to be greater than the specified value
   * (exclusive). If the value of `gt` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyUInt64 {
   *   // value must be greater than 5 [uint64.gt]
   *   uint64 value = 1 [(buf.validate.field).uint64.gt = 5];
   *
   *   // value must be greater than 5 and less than 10 [uint64.gt_lt]
   *   uint64 other_value = 2 [(buf.validate.field).uint64 = { gt: 5, lt: 10 }];
   *
   *   // value must be greater than 10 or less than 5 [uint64.gt_lt_exclusive]
   *   uint64 another_value = 3 [(buf.validate.field).uint64 = { gt: 10, lt: 5 }];
   * }
   * ```
   */
  gt?: number | undefined;
  /**
   * `gte` requires the field value to be greater than or equal to the specified
   * value (exclusive). If the value of `gte` is larger than a specified `lt`
   * or `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyUInt64 {
   *   // value must be greater than or equal to 5 [uint64.gte]
   *   uint64 value = 1 [(buf.validate.field).uint64.gte = 5];
   *
   *   // value must be greater than or equal to 5 and less than 10 [uint64.gte_lt]
   *   uint64 other_value = 2 [(buf.validate.field).uint64 = { gte: 5, lt: 10 }];
   *
   *   // value must be greater than or equal to 10 or less than 5 [uint64.gte_lt_exclusive]
   *   uint64 another_value = 3 [(buf.validate.field).uint64 = { gte: 10, lt: 5 }];
   * }
   * ```
   */
  gte?: number | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified values.
   * If the field value isn't one of the specified values, an error message is
   * generated.
   *
   * ```proto
   * message MyUInt64 {
   *   // value must be in list [1, 2, 3]
   *   uint64 value = 1 [(buf.validate.field).uint64 = { in: [1, 2, 3] }];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `not_in` requires the field value to not be equal to any of the specified
   * values. If the field value is one of the specified values, an error
   * message is generated.
   *
   * ```proto
   * message MyUInt64 {
   *   // value must not be in list [1, 2, 3]
   *   uint64 value = 1 [(buf.validate.field).uint64 = { not_in: [1, 2, 3] }];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyUInt64 {
   *   uint64 value = 1 [
   *     (buf.validate.field).uint64.example = 1,
   *     (buf.validate.field).uint64.example = -10
   *   ];
   * }
   * ```
   */
  example?: number[] | undefined;
}

/** SInt32Rules describes the rules applied to `sint32` values. */
export interface SInt32Rules {
  /**
   * `const` requires the field value to exactly match the specified value. If
   * the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MySInt32 {
   *   // value must equal 42
   *   sint32 value = 1 [(buf.validate.field).sint32.const = 42];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `lt` requires the field value to be less than the specified value (field
   * < value). If the field value is equal to or greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MySInt32 {
   *   // value must be less than 10
   *   sint32 value = 1 [(buf.validate.field).sint32.lt = 10];
   * }
   * ```
   */
  lt?: number | undefined;
  /**
   * `lte` requires the field value to be less than or equal to the specified
   * value (field <= value). If the field value is greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MySInt32 {
   *   // value must be less than or equal to 10
   *   sint32 value = 1 [(buf.validate.field).sint32.lte = 10];
   * }
   * ```
   */
  lte?: number | undefined;
  /**
   * `gt` requires the field value to be greater than the specified value
   * (exclusive). If the value of `gt` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MySInt32 {
   *   // value must be greater than 5 [sint32.gt]
   *   sint32 value = 1 [(buf.validate.field).sint32.gt = 5];
   *
   *   // value must be greater than 5 and less than 10 [sint32.gt_lt]
   *   sint32 other_value = 2 [(buf.validate.field).sint32 = { gt: 5, lt: 10 }];
   *
   *   // value must be greater than 10 or less than 5 [sint32.gt_lt_exclusive]
   *   sint32 another_value = 3 [(buf.validate.field).sint32 = { gt: 10, lt: 5 }];
   * }
   * ```
   */
  gt?: number | undefined;
  /**
   * `gte` requires the field value to be greater than or equal to the specified
   * value (exclusive). If the value of `gte` is larger than a specified `lt`
   * or `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MySInt32 {
   *  // value must be greater than or equal to 5 [sint32.gte]
   *  sint32 value = 1 [(buf.validate.field).sint32.gte = 5];
   *
   *  // value must be greater than or equal to 5 and less than 10 [sint32.gte_lt]
   *  sint32 other_value = 2 [(buf.validate.field).sint32 = { gte: 5, lt: 10 }];
   *
   *  // value must be greater than or equal to 10 or less than 5 [sint32.gte_lt_exclusive]
   *  sint32 another_value = 3 [(buf.validate.field).sint32 = { gte: 10, lt: 5 }];
   * }
   * ```
   */
  gte?: number | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified values.
   * If the field value isn't one of the specified values, an error message is
   * generated.
   *
   * ```proto
   * message MySInt32 {
   *   // value must be in list [1, 2, 3]
   *   sint32 value = 1 [(buf.validate.field).sint32 = { in: [1, 2, 3] }];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `not_in` requires the field value to not be equal to any of the specified
   * values. If the field value is one of the specified values, an error
   * message is generated.
   *
   * ```proto
   * message MySInt32 {
   *   // value must not be in list [1, 2, 3]
   *   sint32 value = 1 [(buf.validate.field).sint32 = { not_in: [1, 2, 3] }];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MySInt32 {
   *   sint32 value = 1 [
   *     (buf.validate.field).sint32.example = 1,
   *     (buf.validate.field).sint32.example = -10
   *   ];
   * }
   * ```
   */
  example?: number[] | undefined;
}

/** SInt64Rules describes the rules applied to `sint64` values. */
export interface SInt64Rules {
  /**
   * `const` requires the field value to exactly match the specified value. If
   * the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MySInt64 {
   *   // value must equal 42
   *   sint64 value = 1 [(buf.validate.field).sint64.const = 42];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `lt` requires the field value to be less than the specified value (field
   * < value). If the field value is equal to or greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MySInt64 {
   *   // value must be less than 10
   *   sint64 value = 1 [(buf.validate.field).sint64.lt = 10];
   * }
   * ```
   */
  lt?: number | undefined;
  /**
   * `lte` requires the field value to be less than or equal to the specified
   * value (field <= value). If the field value is greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MySInt64 {
   *   // value must be less than or equal to 10
   *   sint64 value = 1 [(buf.validate.field).sint64.lte = 10];
   * }
   * ```
   */
  lte?: number | undefined;
  /**
   * `gt` requires the field value to be greater than the specified value
   * (exclusive). If the value of `gt` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MySInt64 {
   *   // value must be greater than 5 [sint64.gt]
   *   sint64 value = 1 [(buf.validate.field).sint64.gt = 5];
   *
   *   // value must be greater than 5 and less than 10 [sint64.gt_lt]
   *   sint64 other_value = 2 [(buf.validate.field).sint64 = { gt: 5, lt: 10 }];
   *
   *   // value must be greater than 10 or less than 5 [sint64.gt_lt_exclusive]
   *   sint64 another_value = 3 [(buf.validate.field).sint64 = { gt: 10, lt: 5 }];
   * }
   * ```
   */
  gt?: number | undefined;
  /**
   * `gte` requires the field value to be greater than or equal to the specified
   * value (exclusive). If the value of `gte` is larger than a specified `lt`
   * or `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MySInt64 {
   *   // value must be greater than or equal to 5 [sint64.gte]
   *   sint64 value = 1 [(buf.validate.field).sint64.gte = 5];
   *
   *   // value must be greater than or equal to 5 and less than 10 [sint64.gte_lt]
   *   sint64 other_value = 2 [(buf.validate.field).sint64 = { gte: 5, lt: 10 }];
   *
   *   // value must be greater than or equal to 10 or less than 5 [sint64.gte_lt_exclusive]
   *   sint64 another_value = 3 [(buf.validate.field).sint64 = { gte: 10, lt: 5 }];
   * }
   * ```
   */
  gte?: number | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified values.
   * If the field value isn't one of the specified values, an error message
   * is generated.
   *
   * ```proto
   * message MySInt64 {
   *   // value must be in list [1, 2, 3]
   *   sint64 value = 1 [(buf.validate.field).sint64 = { in: [1, 2, 3] }];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `not_in` requires the field value to not be equal to any of the specified
   * values. If the field value is one of the specified values, an error
   * message is generated.
   *
   * ```proto
   * message MySInt64 {
   *   // value must not be in list [1, 2, 3]
   *   sint64 value = 1 [(buf.validate.field).sint64 = { not_in: [1, 2, 3] }];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MySInt64 {
   *   sint64 value = 1 [
   *     (buf.validate.field).sint64.example = 1,
   *     (buf.validate.field).sint64.example = -10
   *   ];
   * }
   * ```
   */
  example?: number[] | undefined;
}

/** Fixed32Rules describes the rules applied to `fixed32` values. */
export interface Fixed32Rules {
  /**
   * `const` requires the field value to exactly match the specified value.
   * If the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MyFixed32 {
   *   // value must equal 42
   *   fixed32 value = 1 [(buf.validate.field).fixed32.const = 42];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `lt` requires the field value to be less than the specified value (field <
   * value). If the field value is equal to or greater than the specified value,
   * an error message is generated.
   *
   * ```proto
   * message MyFixed32 {
   *   // value must be less than 10
   *   fixed32 value = 1 [(buf.validate.field).fixed32.lt = 10];
   * }
   * ```
   */
  lt?: number | undefined;
  /**
   * `lte` requires the field value to be less than or equal to the specified
   * value (field <= value). If the field value is greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MyFixed32 {
   *   // value must be less than or equal to 10
   *   fixed32 value = 1 [(buf.validate.field).fixed32.lte = 10];
   * }
   * ```
   */
  lte?: number | undefined;
  /**
   * `gt` requires the field value to be greater than the specified value
   * (exclusive). If the value of `gt` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyFixed32 {
   *   // value must be greater than 5 [fixed32.gt]
   *   fixed32 value = 1 [(buf.validate.field).fixed32.gt = 5];
   *
   *   // value must be greater than 5 and less than 10 [fixed32.gt_lt]
   *   fixed32 other_value = 2 [(buf.validate.field).fixed32 = { gt: 5, lt: 10 }];
   *
   *   // value must be greater than 10 or less than 5 [fixed32.gt_lt_exclusive]
   *   fixed32 another_value = 3 [(buf.validate.field).fixed32 = { gt: 10, lt: 5 }];
   * }
   * ```
   */
  gt?: number | undefined;
  /**
   * `gte` requires the field value to be greater than or equal to the specified
   * value (exclusive). If the value of `gte` is larger than a specified `lt`
   * or `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyFixed32 {
   *   // value must be greater than or equal to 5 [fixed32.gte]
   *   fixed32 value = 1 [(buf.validate.field).fixed32.gte = 5];
   *
   *   // value must be greater than or equal to 5 and less than 10 [fixed32.gte_lt]
   *   fixed32 other_value = 2 [(buf.validate.field).fixed32 = { gte: 5, lt: 10 }];
   *
   *   // value must be greater than or equal to 10 or less than 5 [fixed32.gte_lt_exclusive]
   *   fixed32 another_value = 3 [(buf.validate.field).fixed32 = { gte: 10, lt: 5 }];
   * }
   * ```
   */
  gte?: number | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified values.
   * If the field value isn't one of the specified values, an error message
   * is generated.
   *
   * ```proto
   * message MyFixed32 {
   *   // value must be in list [1, 2, 3]
   *   fixed32 value = 1 [(buf.validate.field).fixed32 = { in: [1, 2, 3] }];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `not_in` requires the field value to not be equal to any of the specified
   * values. If the field value is one of the specified values, an error
   * message is generated.
   *
   * ```proto
   * message MyFixed32 {
   *   // value must not be in list [1, 2, 3]
   *   fixed32 value = 1 [(buf.validate.field).fixed32 = { not_in: [1, 2, 3] }];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyFixed32 {
   *   fixed32 value = 1 [
   *     (buf.validate.field).fixed32.example = 1,
   *     (buf.validate.field).fixed32.example = 2
   *   ];
   * }
   * ```
   */
  example?: number[] | undefined;
}

/** Fixed64Rules describes the rules applied to `fixed64` values. */
export interface Fixed64Rules {
  /**
   * `const` requires the field value to exactly match the specified value. If
   * the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MyFixed64 {
   *   // value must equal 42
   *   fixed64 value = 1 [(buf.validate.field).fixed64.const = 42];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `lt` requires the field value to be less than the specified value (field <
   * value). If the field value is equal to or greater than the specified value,
   * an error message is generated.
   *
   * ```proto
   * message MyFixed64 {
   *   // value must be less than 10
   *   fixed64 value = 1 [(buf.validate.field).fixed64.lt = 10];
   * }
   * ```
   */
  lt?: number | undefined;
  /**
   * `lte` requires the field value to be less than or equal to the specified
   * value (field <= value). If the field value is greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MyFixed64 {
   *   // value must be less than or equal to 10
   *   fixed64 value = 1 [(buf.validate.field).fixed64.lte = 10];
   * }
   * ```
   */
  lte?: number | undefined;
  /**
   * `gt` requires the field value to be greater than the specified value
   * (exclusive). If the value of `gt` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyFixed64 {
   *   // value must be greater than 5 [fixed64.gt]
   *   fixed64 value = 1 [(buf.validate.field).fixed64.gt = 5];
   *
   *   // value must be greater than 5 and less than 10 [fixed64.gt_lt]
   *   fixed64 other_value = 2 [(buf.validate.field).fixed64 = { gt: 5, lt: 10 }];
   *
   *   // value must be greater than 10 or less than 5 [fixed64.gt_lt_exclusive]
   *   fixed64 another_value = 3 [(buf.validate.field).fixed64 = { gt: 10, lt: 5 }];
   * }
   * ```
   */
  gt?: number | undefined;
  /**
   * `gte` requires the field value to be greater than or equal to the specified
   * value (exclusive). If the value of `gte` is larger than a specified `lt`
   * or `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyFixed64 {
   *   // value must be greater than or equal to 5 [fixed64.gte]
   *   fixed64 value = 1 [(buf.validate.field).fixed64.gte = 5];
   *
   *   // value must be greater than or equal to 5 and less than 10 [fixed64.gte_lt]
   *   fixed64 other_value = 2 [(buf.validate.field).fixed64 = { gte: 5, lt: 10 }];
   *
   *   // value must be greater than or equal to 10 or less than 5 [fixed64.gte_lt_exclusive]
   *   fixed64 another_value = 3 [(buf.validate.field).fixed64 = { gte: 10, lt: 5 }];
   * }
   * ```
   */
  gte?: number | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified values.
   * If the field value isn't one of the specified values, an error message is
   * generated.
   *
   * ```proto
   * message MyFixed64 {
   *   // value must be in list [1, 2, 3]
   *   fixed64 value = 1 [(buf.validate.field).fixed64 = { in: [1, 2, 3] }];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `not_in` requires the field value to not be equal to any of the specified
   * values. If the field value is one of the specified values, an error
   * message is generated.
   *
   * ```proto
   * message MyFixed64 {
   *   // value must not be in list [1, 2, 3]
   *   fixed64 value = 1 [(buf.validate.field).fixed64 = { not_in: [1, 2, 3] }];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyFixed64 {
   *   fixed64 value = 1 [
   *     (buf.validate.field).fixed64.example = 1,
   *     (buf.validate.field).fixed64.example = 2
   *   ];
   * }
   * ```
   */
  example?: number[] | undefined;
}

/** SFixed32Rules describes the rules applied to `fixed32` values. */
export interface SFixed32Rules {
  /**
   * `const` requires the field value to exactly match the specified value. If
   * the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MySFixed32 {
   *   // value must equal 42
   *   sfixed32 value = 1 [(buf.validate.field).sfixed32.const = 42];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `lt` requires the field value to be less than the specified value (field <
   * value). If the field value is equal to or greater than the specified value,
   * an error message is generated.
   *
   * ```proto
   * message MySFixed32 {
   *   // value must be less than 10
   *   sfixed32 value = 1 [(buf.validate.field).sfixed32.lt = 10];
   * }
   * ```
   */
  lt?: number | undefined;
  /**
   * `lte` requires the field value to be less than or equal to the specified
   * value (field <= value). If the field value is greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MySFixed32 {
   *   // value must be less than or equal to 10
   *   sfixed32 value = 1 [(buf.validate.field).sfixed32.lte = 10];
   * }
   * ```
   */
  lte?: number | undefined;
  /**
   * `gt` requires the field value to be greater than the specified value
   * (exclusive). If the value of `gt` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MySFixed32 {
   *   // value must be greater than 5 [sfixed32.gt]
   *   sfixed32 value = 1 [(buf.validate.field).sfixed32.gt = 5];
   *
   *   // value must be greater than 5 and less than 10 [sfixed32.gt_lt]
   *   sfixed32 other_value = 2 [(buf.validate.field).sfixed32 = { gt: 5, lt: 10 }];
   *
   *   // value must be greater than 10 or less than 5 [sfixed32.gt_lt_exclusive]
   *   sfixed32 another_value = 3 [(buf.validate.field).sfixed32 = { gt: 10, lt: 5 }];
   * }
   * ```
   */
  gt?: number | undefined;
  /**
   * `gte` requires the field value to be greater than or equal to the specified
   * value (exclusive). If the value of `gte` is larger than a specified `lt`
   * or `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MySFixed32 {
   *   // value must be greater than or equal to 5 [sfixed32.gte]
   *   sfixed32 value = 1 [(buf.validate.field).sfixed32.gte = 5];
   *
   *   // value must be greater than or equal to 5 and less than 10 [sfixed32.gte_lt]
   *   sfixed32 other_value = 2 [(buf.validate.field).sfixed32 = { gte: 5, lt: 10 }];
   *
   *   // value must be greater than or equal to 10 or less than 5 [sfixed32.gte_lt_exclusive]
   *   sfixed32 another_value = 3 [(buf.validate.field).sfixed32 = { gte: 10, lt: 5 }];
   * }
   * ```
   */
  gte?: number | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified values.
   * If the field value isn't one of the specified values, an error message is
   * generated.
   *
   * ```proto
   * message MySFixed32 {
   *   // value must be in list [1, 2, 3]
   *   sfixed32 value = 1 [(buf.validate.field).sfixed32 = { in: [1, 2, 3] }];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `not_in` requires the field value to not be equal to any of the specified
   * values. If the field value is one of the specified values, an error
   * message is generated.
   *
   * ```proto
   * message MySFixed32 {
   *   // value must not be in list [1, 2, 3]
   *   sfixed32 value = 1 [(buf.validate.field).sfixed32 = { not_in: [1, 2, 3] }];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MySFixed32 {
   *   sfixed32 value = 1 [
   *     (buf.validate.field).sfixed32.example = 1,
   *     (buf.validate.field).sfixed32.example = 2
   *   ];
   * }
   * ```
   */
  example?: number[] | undefined;
}

/** SFixed64Rules describes the rules applied to `fixed64` values. */
export interface SFixed64Rules {
  /**
   * `const` requires the field value to exactly match the specified value. If
   * the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MySFixed64 {
   *   // value must equal 42
   *   sfixed64 value = 1 [(buf.validate.field).sfixed64.const = 42];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `lt` requires the field value to be less than the specified value (field <
   * value). If the field value is equal to or greater than the specified value,
   * an error message is generated.
   *
   * ```proto
   * message MySFixed64 {
   *   // value must be less than 10
   *   sfixed64 value = 1 [(buf.validate.field).sfixed64.lt = 10];
   * }
   * ```
   */
  lt?: number | undefined;
  /**
   * `lte` requires the field value to be less than or equal to the specified
   * value (field <= value). If the field value is greater than the specified
   * value, an error message is generated.
   *
   * ```proto
   * message MySFixed64 {
   *   // value must be less than or equal to 10
   *   sfixed64 value = 1 [(buf.validate.field).sfixed64.lte = 10];
   * }
   * ```
   */
  lte?: number | undefined;
  /**
   * `gt` requires the field value to be greater than the specified value
   * (exclusive). If the value of `gt` is larger than a specified `lt` or
   * `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MySFixed64 {
   *   // value must be greater than 5 [sfixed64.gt]
   *   sfixed64 value = 1 [(buf.validate.field).sfixed64.gt = 5];
   *
   *   // value must be greater than 5 and less than 10 [sfixed64.gt_lt]
   *   sfixed64 other_value = 2 [(buf.validate.field).sfixed64 = { gt: 5, lt: 10 }];
   *
   *   // value must be greater than 10 or less than 5 [sfixed64.gt_lt_exclusive]
   *   sfixed64 another_value = 3 [(buf.validate.field).sfixed64 = { gt: 10, lt: 5 }];
   * }
   * ```
   */
  gt?: number | undefined;
  /**
   * `gte` requires the field value to be greater than or equal to the specified
   * value (exclusive). If the value of `gte` is larger than a specified `lt`
   * or `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MySFixed64 {
   *   // value must be greater than or equal to 5 [sfixed64.gte]
   *   sfixed64 value = 1 [(buf.validate.field).sfixed64.gte = 5];
   *
   *   // value must be greater than or equal to 5 and less than 10 [sfixed64.gte_lt]
   *   sfixed64 other_value = 2 [(buf.validate.field).sfixed64 = { gte: 5, lt: 10 }];
   *
   *   // value must be greater than or equal to 10 or less than 5 [sfixed64.gte_lt_exclusive]
   *   sfixed64 another_value = 3 [(buf.validate.field).sfixed64 = { gte: 10, lt: 5 }];
   * }
   * ```
   */
  gte?: number | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified values.
   * If the field value isn't one of the specified values, an error message is
   * generated.
   *
   * ```proto
   * message MySFixed64 {
   *   // value must be in list [1, 2, 3]
   *   sfixed64 value = 1 [(buf.validate.field).sfixed64 = { in: [1, 2, 3] }];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `not_in` requires the field value to not be equal to any of the specified
   * values. If the field value is one of the specified values, an error
   * message is generated.
   *
   * ```proto
   * message MySFixed64 {
   *   // value must not be in list [1, 2, 3]
   *   sfixed64 value = 1 [(buf.validate.field).sfixed64 = { not_in: [1, 2, 3] }];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MySFixed64 {
   *   sfixed64 value = 1 [
   *     (buf.validate.field).sfixed64.example = 1,
   *     (buf.validate.field).sfixed64.example = 2
   *   ];
   * }
   * ```
   */
  example?: number[] | undefined;
}

/**
 * BoolRules describes the rules applied to `bool` values. These rules
 * may also be applied to the `google.protobuf.BoolValue` Well-Known-Type.
 */
export interface BoolRules {
  /**
   * `const` requires the field value to exactly match the specified boolean value.
   * If the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MyBool {
   *   // value must equal true
   *   bool value = 1 [(buf.validate.field).bool.const = true];
   * }
   * ```
   */
  const?: boolean | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyBool {
   *   bool value = 1 [
   *     (buf.validate.field).bool.example = 1,
   *     (buf.validate.field).bool.example = 2
   *   ];
   * }
   * ```
   */
  example?: boolean[] | undefined;
}

/**
 * StringRules describes the rules applied to `string` values These
 * rules may also be applied to the `google.protobuf.StringValue` Well-Known-Type.
 */
export interface StringRules {
  /**
   * `const` requires the field value to exactly match the specified value. If
   * the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MyString {
   *   // value must equal `hello`
   *   string value = 1 [(buf.validate.field).string.const = "hello"];
   * }
   * ```
   */
  const?: string | undefined;
  /**
   * `len` dictates that the field value must have the specified
   * number of characters (Unicode code points), which may differ from the number
   * of bytes in the string. If the field value does not meet the specified
   * length, an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value length must be 5 characters
   *   string value = 1 [(buf.validate.field).string.len = 5];
   * }
   * ```
   */
  len?: number | undefined;
  /**
   * `min_len` specifies that the field value must have at least the specified
   * number of characters (Unicode code points), which may differ from the number
   * of bytes in the string. If the field value contains fewer characters, an error
   * message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value length must be at least 3 characters
   *   string value = 1 [(buf.validate.field).string.min_len = 3];
   * }
   * ```
   */
  minLen?: number | undefined;
  /**
   * `max_len` specifies that the field value must have no more than the specified
   * number of characters (Unicode code points), which may differ from the
   * number of bytes in the string. If the field value contains more characters,
   * an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value length must be at most 10 characters
   *   string value = 1 [(buf.validate.field).string.max_len = 10];
   * }
   * ```
   */
  maxLen?: number | undefined;
  /**
   * `len_bytes` dictates that the field value must have the specified number of
   * bytes. If the field value does not match the specified length in bytes,
   * an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value length must be 6 bytes
   *   string value = 1 [(buf.validate.field).string.len_bytes = 6];
   * }
   * ```
   */
  lenBytes?: number | undefined;
  /**
   * `min_bytes` specifies that the field value must have at least the specified
   * number of bytes. If the field value contains fewer bytes, an error message
   * will be generated.
   *
   * ```proto
   * message MyString {
   *   // value length must be at least 4 bytes
   *   string value = 1 [(buf.validate.field).string.min_bytes = 4];
   * }
   *
   * ```
   */
  minBytes?: number | undefined;
  /**
   * `max_bytes` specifies that the field value must have no more than the
   * specified number of bytes. If the field value contains more bytes, an
   * error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value length must be at most 8 bytes
   *   string value = 1 [(buf.validate.field).string.max_bytes = 8];
   * }
   * ```
   */
  maxBytes?: number | undefined;
  /**
   * `pattern` specifies that the field value must match the specified
   * regular expression (RE2 syntax), with the expression provided without any
   * delimiters. If the field value doesn't match the regular expression, an
   * error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value does not match regex pattern `^[a-zA-Z]//$`
   *   string value = 1 [(buf.validate.field).string.pattern = "^[a-zA-Z]//$"];
   * }
   * ```
   */
  pattern?: string | undefined;
  /**
   * `prefix` specifies that the field value must have the
   * specified substring at the beginning of the string. If the field value
   * doesn't start with the specified prefix, an error message will be
   * generated.
   *
   * ```proto
   * message MyString {
   *   // value does not have prefix `pre`
   *   string value = 1 [(buf.validate.field).string.prefix = "pre"];
   * }
   * ```
   */
  prefix?: string | undefined;
  /**
   * `suffix` specifies that the field value must have the
   * specified substring at the end of the string. If the field value doesn't
   * end with the specified suffix, an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value does not have suffix `post`
   *   string value = 1 [(buf.validate.field).string.suffix = "post"];
   * }
   * ```
   */
  suffix?: string | undefined;
  /**
   * `contains` specifies that the field value must have the
   * specified substring anywhere in the string. If the field value doesn't
   * contain the specified substring, an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value does not contain substring `inside`.
   *   string value = 1 [(buf.validate.field).string.contains = "inside"];
   * }
   * ```
   */
  contains?: string | undefined;
  /**
   * `not_contains` specifies that the field value must not have the
   * specified substring anywhere in the string. If the field value contains
   * the specified substring, an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value contains substring `inside`.
   *   string value = 1 [(buf.validate.field).string.not_contains = "inside"];
   * }
   * ```
   */
  notContains?: string | undefined;
  /**
   * `in` specifies that the field value must be equal to one of the specified
   * values. If the field value isn't one of the specified values, an error
   * message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be in list ["apple", "banana"]
   *   string value = 1 [(buf.validate.field).string.in = "apple", (buf.validate.field).string.in = "banana"];
   * }
   * ```
   */
  in?: string[] | undefined;
  /**
   * `not_in` specifies that the field value cannot be equal to any
   * of the specified values. If the field value is one of the specified values,
   * an error message will be generated.
   * ```proto
   * message MyString {
   *   // value must not be in list ["orange", "grape"]
   *   string value = 1 [(buf.validate.field).string.not_in = "orange", (buf.validate.field).string.not_in = "grape"];
   * }
   * ```
   */
  notIn?: string[] | undefined;
  /**
   * `email` specifies that the field value must be a valid email address, for
   * example "foo@example.com".
   *
   * Conforms to the definition for a valid email address from the [HTML standard](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address).
   * Note that this standard willfully deviates from [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322),
   * which allows many unexpected forms of email addresses and will easily match
   * a typographical error.
   *
   * If the field value isn't a valid email address, an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid email address
   *   string value = 1 [(buf.validate.field).string.email = true];
   * }
   * ```
   */
  email?: boolean | undefined;
  /**
   * `hostname` specifies that the field value must be a valid hostname, for
   * example "foo.example.com".
   *
   * A valid hostname follows the rules below:
   * - The name consists of one or more labels, separated by a dot (".").
   * - Each label can be 1 to 63 alphanumeric characters.
   * - A label can contain hyphens ("-"), but must not start or end with a hyphen.
   * - The right-most label must not be digits only.
   * - The name can have a trailing dot—for example, "foo.example.com.".
   * - The name can be 253 characters at most, excluding the optional trailing dot.
   *
   * If the field value isn't a valid hostname, an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid hostname
   *   string value = 1 [(buf.validate.field).string.hostname = true];
   * }
   * ```
   */
  hostname?: boolean | undefined;
  /**
   * `ip` specifies that the field value must be a valid IP (v4 or v6) address.
   *
   * IPv4 addresses are expected in the dotted decimal format—for example, "192.168.5.21".
   * IPv6 addresses are expected in their text representation—for example, "::1",
   * or "2001:0DB8:ABCD:0012::0".
   *
   * Both formats are well-defined in the internet standard [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986).
   * Zone identifiers for IPv6 addresses (for example, "fe80::a%en1") are supported.
   *
   * If the field value isn't a valid IP address, an error message will be
   * generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid IP address
   *   string value = 1 [(buf.validate.field).string.ip = true];
   * }
   * ```
   */
  ip?: boolean | undefined;
  /**
   * `ipv4` specifies that the field value must be a valid IPv4 address—for
   * example "192.168.5.21". If the field value isn't a valid IPv4 address, an
   * error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid IPv4 address
   *   string value = 1 [(buf.validate.field).string.ipv4 = true];
   * }
   * ```
   */
  ipv4?: boolean | undefined;
  /**
   * `ipv6` specifies that the field value must be a valid IPv6 address—for
   * example "::1", or "d7a:115c:a1e0:ab12:4843:cd96:626b:430b". If the field
   * value is not a valid IPv6 address, an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid IPv6 address
   *   string value = 1 [(buf.validate.field).string.ipv6 = true];
   * }
   * ```
   */
  ipv6?: boolean | undefined;
  /**
   * `uri` specifies that the field value must be a valid URI, for example
   * "https://example.com/foo/bar?baz=quux#frag".
   *
   * URI is defined in the internet standard [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986).
   * Zone Identifiers in IPv6 address literals are supported ([RFC 6874](https://datatracker.ietf.org/doc/html/rfc6874)).
   *
   * If the field value isn't a valid URI, an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid URI
   *   string value = 1 [(buf.validate.field).string.uri = true];
   * }
   * ```
   */
  uri?: boolean | undefined;
  /**
   * `uri_ref` specifies that the field value must be a valid URI Reference—either
   * a URI such as "https://example.com/foo/bar?baz=quux#frag", or a Relative
   * Reference such as "./foo/bar?query".
   *
   * URI, URI Reference, and Relative Reference are defined in the internet
   * standard [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986). Zone
   * Identifiers in IPv6 address literals are supported ([RFC 6874](https://datatracker.ietf.org/doc/html/rfc6874)).
   *
   * If the field value isn't a valid URI Reference, an error message will be
   * generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid URI Reference
   *   string value = 1 [(buf.validate.field).string.uri_ref = true];
   * }
   * ```
   */
  uriRef?: boolean | undefined;
  /**
   * `address` specifies that the field value must be either a valid hostname
   * (for example, "example.com"), or a valid IP (v4 or v6) address (for example,
   * "192.168.0.1", or "::1"). If the field value isn't a valid hostname or IP,
   * an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid hostname, or ip address
   *   string value = 1 [(buf.validate.field).string.address = true];
   * }
   * ```
   */
  address?: boolean | undefined;
  /**
   * `uuid` specifies that the field value must be a valid UUID as defined by
   * [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.2). If the
   * field value isn't a valid UUID, an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid UUID
   *   string value = 1 [(buf.validate.field).string.uuid = true];
   * }
   * ```
   */
  uuid?: boolean | undefined;
  /**
   * `tuuid` (trimmed UUID) specifies that the field value must be a valid UUID as
   * defined by [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.2) with all dashes
   * omitted. If the field value isn't a valid UUID without dashes, an error message
   * will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid trimmed UUID
   *   string value = 1 [(buf.validate.field).string.tuuid = true];
   * }
   * ```
   */
  tuuid?: boolean | undefined;
  /**
   * `ip_with_prefixlen` specifies that the field value must be a valid IP
   * (v4 or v6) address with prefix length—for example, "192.168.5.21/16" or
   * "2001:0DB8:ABCD:0012::F1/64". If the field value isn't a valid IP with
   * prefix length, an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid IP with prefix length
   *    string value = 1 [(buf.validate.field).string.ip_with_prefixlen = true];
   * }
   * ```
   */
  ipWithPrefixlen?: boolean | undefined;
  /**
   * `ipv4_with_prefixlen` specifies that the field value must be a valid
   * IPv4 address with prefix length—for example, "192.168.5.21/16". If the
   * field value isn't a valid IPv4 address with prefix length, an error
   * message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid IPv4 address with prefix length
   *    string value = 1 [(buf.validate.field).string.ipv4_with_prefixlen = true];
   * }
   * ```
   */
  ipv4WithPrefixlen?: boolean | undefined;
  /**
   * `ipv6_with_prefixlen` specifies that the field value must be a valid
   * IPv6 address with prefix length—for example, "2001:0DB8:ABCD:0012::F1/64".
   * If the field value is not a valid IPv6 address with prefix length,
   * an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid IPv6 address prefix length
   *    string value = 1 [(buf.validate.field).string.ipv6_with_prefixlen = true];
   * }
   * ```
   */
  ipv6WithPrefixlen?: boolean | undefined;
  /**
   * `ip_prefix` specifies that the field value must be a valid IP (v4 or v6)
   * prefix—for example, "192.168.0.0/16" or "2001:0DB8:ABCD:0012::0/64".
   *
   * The prefix must have all zeros for the unmasked bits. For example,
   * "2001:0DB8:ABCD:0012::0/64" designates the left-most 64 bits for the
   * prefix, and the remaining 64 bits must be zero.
   *
   * If the field value isn't a valid IP prefix, an error message will be
   * generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid IP prefix
   *    string value = 1 [(buf.validate.field).string.ip_prefix = true];
   * }
   * ```
   */
  ipPrefix?: boolean | undefined;
  /**
   * `ipv4_prefix` specifies that the field value must be a valid IPv4
   * prefix, for example "192.168.0.0/16".
   *
   * The prefix must have all zeros for the unmasked bits. For example,
   * "192.168.0.0/16" designates the left-most 16 bits for the prefix,
   * and the remaining 16 bits must be zero.
   *
   * If the field value isn't a valid IPv4 prefix, an error message
   * will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid IPv4 prefix
   *    string value = 1 [(buf.validate.field).string.ipv4_prefix = true];
   * }
   * ```
   */
  ipv4Prefix?: boolean | undefined;
  /**
   * `ipv6_prefix` specifies that the field value must be a valid IPv6 prefix—for
   * example, "2001:0DB8:ABCD:0012::0/64".
   *
   * The prefix must have all zeros for the unmasked bits. For example,
   * "2001:0DB8:ABCD:0012::0/64" designates the left-most 64 bits for the
   * prefix, and the remaining 64 bits must be zero.
   *
   * If the field value is not a valid IPv6 prefix, an error message will be
   * generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid IPv6 prefix
   *    string value = 1 [(buf.validate.field).string.ipv6_prefix = true];
   * }
   * ```
   */
  ipv6Prefix?: boolean | undefined;
  /**
   * `host_and_port` specifies that the field value must be valid host/port
   * pair—for example, "example.com:8080".
   *
   * The host can be one of:
   * - An IPv4 address in dotted decimal format—for example, "192.168.5.21".
   * - An IPv6 address enclosed in square brackets—for example, "[2001:0DB8:ABCD:0012::F1]".
   * - A hostname—for example, "example.com".
   *
   * The port is separated by a colon. It must be non-empty, with a decimal number
   * in the range of 0-65535, inclusive.
   */
  hostAndPort?: boolean | undefined;
  /**
   * `well_known_regex` specifies a common well-known pattern
   * defined as a regex. If the field value doesn't match the well-known
   * regex, an error message will be generated.
   *
   * ```proto
   * message MyString {
   *   // value must be a valid HTTP header value
   *   string value = 1 [(buf.validate.field).string.well_known_regex = KNOWN_REGEX_HTTP_HEADER_VALUE];
   * }
   * ```
   *
   * #### KnownRegex
   *
   * `well_known_regex` contains some well-known patterns.
   *
   * | Name                          | Number | Description                               |
   * |-------------------------------|--------|-------------------------------------------|
   * | KNOWN_REGEX_UNSPECIFIED       | 0      |                                           |
   * | KNOWN_REGEX_HTTP_HEADER_NAME  | 1      | HTTP header name as defined by [RFC 7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3.2)  |
   * | KNOWN_REGEX_HTTP_HEADER_VALUE | 2      | HTTP header value as defined by [RFC 7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.4) |
   */
  wellKnownRegex?: KnownRegex | undefined;
  /**
   * This applies to regexes `HTTP_HEADER_NAME` and `HTTP_HEADER_VALUE` to
   * enable strict header validation. By default, this is true, and HTTP header
   * validations are [RFC-compliant](https://datatracker.ietf.org/doc/html/rfc7230#section-3). Setting to false will enable looser
   * validations that only disallow `\r\n\0` characters, which can be used to
   * bypass header matching rules.
   *
   * ```proto
   * message MyString {
   *   // The field `value` must have be a valid HTTP headers, but not enforced with strict rules.
   *   string value = 1 [(buf.validate.field).string.strict = false];
   * }
   * ```
   */
  strict?: boolean | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyString {
   *   string value = 1 [
   *     (buf.validate.field).string.example = "hello",
   *     (buf.validate.field).string.example = "world"
   *   ];
   * }
   * ```
   */
  example?: string[] | undefined;
}

/**
 * BytesRules describe the rules applied to `bytes` values. These rules
 * may also be applied to the `google.protobuf.BytesValue` Well-Known-Type.
 */
export interface BytesRules {
  /**
   * `const` requires the field value to exactly match the specified bytes
   * value. If the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MyBytes {
   *   // value must be "\x01\x02\x03\x04"
   *   bytes value = 1 [(buf.validate.field).bytes.const = "\x01\x02\x03\x04"];
   * }
   * ```
   */
  const?: Buffer | undefined;
  /**
   * `len` requires the field value to have the specified length in bytes.
   * If the field value doesn't match, an error message is generated.
   *
   * ```proto
   * message MyBytes {
   *   // value length must be 4 bytes.
   *   optional bytes value = 1 [(buf.validate.field).bytes.len = 4];
   * }
   * ```
   */
  len?: number | undefined;
  /**
   * `min_len` requires the field value to have at least the specified minimum
   * length in bytes.
   * If the field value doesn't meet the requirement, an error message is generated.
   *
   * ```proto
   * message MyBytes {
   *   // value length must be at least 2 bytes.
   *   optional bytes value = 1 [(buf.validate.field).bytes.min_len = 2];
   * }
   * ```
   */
  minLen?: number | undefined;
  /**
   * `max_len` requires the field value to have at most the specified maximum
   * length in bytes.
   * If the field value exceeds the requirement, an error message is generated.
   *
   * ```proto
   * message MyBytes {
   *   // value must be at most 6 bytes.
   *   optional bytes value = 1 [(buf.validate.field).bytes.max_len = 6];
   * }
   * ```
   */
  maxLen?: number | undefined;
  /**
   * `pattern` requires the field value to match the specified regular
   * expression ([RE2 syntax](https://github.com/google/re2/wiki/Syntax)).
   * The value of the field must be valid UTF-8 or validation will fail with a
   * runtime error.
   * If the field value doesn't match the pattern, an error message is generated.
   *
   * ```proto
   * message MyBytes {
   *   // value must match regex pattern "^[a-zA-Z0-9]+$".
   *   optional bytes value = 1 [(buf.validate.field).bytes.pattern = "^[a-zA-Z0-9]+$"];
   * }
   * ```
   */
  pattern?: string | undefined;
  /**
   * `prefix` requires the field value to have the specified bytes at the
   * beginning of the string.
   * If the field value doesn't meet the requirement, an error message is generated.
   *
   * ```proto
   * message MyBytes {
   *   // value does not have prefix \x01\x02
   *   optional bytes value = 1 [(buf.validate.field).bytes.prefix = "\x01\x02"];
   * }
   * ```
   */
  prefix?: Buffer | undefined;
  /**
   * `suffix` requires the field value to have the specified bytes at the end
   * of the string.
   * If the field value doesn't meet the requirement, an error message is generated.
   *
   * ```proto
   * message MyBytes {
   *   // value does not have suffix \x03\x04
   *   optional bytes value = 1 [(buf.validate.field).bytes.suffix = "\x03\x04"];
   * }
   * ```
   */
  suffix?: Buffer | undefined;
  /**
   * `contains` requires the field value to have the specified bytes anywhere in
   * the string.
   * If the field value doesn't meet the requirement, an error message is generated.
   *
   * ```protobuf
   * message MyBytes {
   *   // value does not contain \x02\x03
   *   optional bytes value = 1 [(buf.validate.field).bytes.contains = "\x02\x03"];
   * }
   * ```
   */
  contains?: Buffer | undefined;
  /**
   * `in` requires the field value to be equal to one of the specified
   * values. If the field value doesn't match any of the specified values, an
   * error message is generated.
   *
   * ```protobuf
   * message MyBytes {
   *   // value must in ["\x01\x02", "\x02\x03", "\x03\x04"]
   *   optional bytes value = 1 [(buf.validate.field).bytes.in = {"\x01\x02", "\x02\x03", "\x03\x04"}];
   * }
   * ```
   */
  in?: Buffer[] | undefined;
  /**
   * `not_in` requires the field value to be not equal to any of the specified
   * values.
   * If the field value matches any of the specified values, an error message is
   * generated.
   *
   * ```proto
   * message MyBytes {
   *   // value must not in ["\x01\x02", "\x02\x03", "\x03\x04"]
   *   optional bytes value = 1 [(buf.validate.field).bytes.not_in = {"\x01\x02", "\x02\x03", "\x03\x04"}];
   * }
   * ```
   */
  notIn?: Buffer[] | undefined;
  /**
   * `ip` ensures that the field `value` is a valid IP address (v4 or v6) in byte format.
   * If the field value doesn't meet this rule, an error message is generated.
   *
   * ```proto
   * message MyBytes {
   *   // value must be a valid IP address
   *   optional bytes value = 1 [(buf.validate.field).bytes.ip = true];
   * }
   * ```
   */
  ip?: boolean | undefined;
  /**
   * `ipv4` ensures that the field `value` is a valid IPv4 address in byte format.
   * If the field value doesn't meet this rule, an error message is generated.
   *
   * ```proto
   * message MyBytes {
   *   // value must be a valid IPv4 address
   *   optional bytes value = 1 [(buf.validate.field).bytes.ipv4 = true];
   * }
   * ```
   */
  ipv4?: boolean | undefined;
  /**
   * `ipv6` ensures that the field `value` is a valid IPv6 address in byte format.
   * If the field value doesn't meet this rule, an error message is generated.
   * ```proto
   * message MyBytes {
   *   // value must be a valid IPv6 address
   *   optional bytes value = 1 [(buf.validate.field).bytes.ipv6 = true];
   * }
   * ```
   */
  ipv6?: boolean | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyBytes {
   *   bytes value = 1 [
   *     (buf.validate.field).bytes.example = "\x01\x02",
   *     (buf.validate.field).bytes.example = "\x02\x03"
   *   ];
   * }
   * ```
   */
  example?: Buffer[] | undefined;
}

/** EnumRules describe the rules applied to `enum` values. */
export interface EnumRules {
  /**
   * `const` requires the field value to exactly match the specified enum value.
   * If the field value doesn't match, an error message is generated.
   *
   * ```proto
   * enum MyEnum {
   *   MY_ENUM_UNSPECIFIED = 0;
   *   MY_ENUM_VALUE1 = 1;
   *   MY_ENUM_VALUE2 = 2;
   * }
   *
   * message MyMessage {
   *   // The field `value` must be exactly MY_ENUM_VALUE1.
   *   MyEnum value = 1 [(buf.validate.field).enum.const = 1];
   * }
   * ```
   */
  const?: number | undefined;
  /**
   * `defined_only` requires the field value to be one of the defined values for
   * this enum, failing on any undefined value.
   *
   * ```proto
   * enum MyEnum {
   *   MY_ENUM_UNSPECIFIED = 0;
   *   MY_ENUM_VALUE1 = 1;
   *   MY_ENUM_VALUE2 = 2;
   * }
   *
   * message MyMessage {
   *   // The field `value` must be a defined value of MyEnum.
   *   MyEnum value = 1 [(buf.validate.field).enum.defined_only = true];
   * }
   * ```
   */
  definedOnly?: boolean | undefined;
  /**
   * `in` requires the field value to be equal to one of the
   * specified enum values. If the field value doesn't match any of the
   * specified values, an error message is generated.
   *
   * ```proto
   * enum MyEnum {
   *   MY_ENUM_UNSPECIFIED = 0;
   *   MY_ENUM_VALUE1 = 1;
   *   MY_ENUM_VALUE2 = 2;
   * }
   *
   * message MyMessage {
   *   // The field `value` must be equal to one of the specified values.
   *   MyEnum value = 1 [(buf.validate.field).enum = { in: [1, 2]}];
   * }
   * ```
   */
  in?: number[] | undefined;
  /**
   * `not_in` requires the field value to be not equal to any of the
   * specified enum values. If the field value matches one of the specified
   * values, an error message is generated.
   *
   * ```proto
   * enum MyEnum {
   *   MY_ENUM_UNSPECIFIED = 0;
   *   MY_ENUM_VALUE1 = 1;
   *   MY_ENUM_VALUE2 = 2;
   * }
   *
   * message MyMessage {
   *   // The field `value` must not be equal to any of the specified values.
   *   MyEnum value = 1 [(buf.validate.field).enum = { not_in: [1, 2]}];
   * }
   * ```
   */
  notIn?: number[] | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * enum MyEnum {
   *   MY_ENUM_UNSPECIFIED = 0;
   *   MY_ENUM_VALUE1 = 1;
   *   MY_ENUM_VALUE2 = 2;
   * }
   *
   * message MyMessage {
   *     (buf.validate.field).enum.example = 1,
   *     (buf.validate.field).enum.example = 2
   * }
   * ```
   */
  example?: number[] | undefined;
}

/** RepeatedRules describe the rules applied to `repeated` values. */
export interface RepeatedRules {
  /**
   * `min_items` requires that this field must contain at least the specified
   * minimum number of items.
   *
   * Note that `min_items = 1` is equivalent to setting a field as `required`.
   *
   * ```proto
   * message MyRepeated {
   *   // value must contain at least  2 items
   *   repeated string value = 1 [(buf.validate.field).repeated.min_items = 2];
   * }
   * ```
   */
  minItems?: number | undefined;
  /**
   * `max_items` denotes that this field must not exceed a
   * certain number of items as the upper limit. If the field contains more
   * items than specified, an error message will be generated, requiring the
   * field to maintain no more than the specified number of items.
   *
   * ```proto
   * message MyRepeated {
   *   // value must contain no more than 3 item(s)
   *   repeated string value = 1 [(buf.validate.field).repeated.max_items = 3];
   * }
   * ```
   */
  maxItems?: number | undefined;
  /**
   * `unique` indicates that all elements in this field must
   * be unique. This rule is strictly applicable to scalar and enum
   * types, with message types not being supported.
   *
   * ```proto
   * message MyRepeated {
   *   // repeated value must contain unique items
   *   repeated string value = 1 [(buf.validate.field).repeated.unique = true];
   * }
   * ```
   */
  unique?: boolean | undefined;
  /**
   * `items` details the rules to be applied to each item
   * in the field. Even for repeated message fields, validation is executed
   * against each item unless skip is explicitly specified.
   *
   * Note that repeated items are always considered populated. The `required`
   * rule does not apply.
   *
   * ```proto
   * message MyRepeated {
   *   // The items in the field `value` must follow the specified rules.
   *   repeated string value = 1 [(buf.validate.field).repeated.items = {
   *     string: {
   *       min_len: 3
   *       max_len: 10
   *     }
   *   }];
   * }
   * ```
   */
  items?: FieldRules | undefined;
}

/** MapRules describe the rules applied to `map` values. */
export interface MapRules {
  /**
   * Specifies the minimum number of key-value pairs allowed. If the field has
   * fewer key-value pairs than specified, an error message is generated.
   *
   * ```proto
   * message MyMap {
   *   // The field `value` must have at least 2 key-value pairs.
   *   map<string, string> value = 1 [(buf.validate.field).map.min_pairs = 2];
   * }
   * ```
   */
  minPairs?: number | undefined;
  /**
   * Specifies the maximum number of key-value pairs allowed. If the field has
   * more key-value pairs than specified, an error message is generated.
   *
   * ```proto
   * message MyMap {
   *   // The field `value` must have at most 3 key-value pairs.
   *   map<string, string> value = 1 [(buf.validate.field).map.max_pairs = 3];
   * }
   * ```
   */
  maxPairs?: number | undefined;
  /**
   * Specifies the rules to be applied to each key in the field.
   *
   * Note that map keys are always considered populated. The `required`
   * rule does not apply.
   *
   * ```proto
   * message MyMap {
   *   // The keys in the field `value` must follow the specified rules.
   *   map<string, string> value = 1 [(buf.validate.field).map.keys = {
   *     string: {
   *       min_len: 3
   *       max_len: 10
   *     }
   *   }];
   * }
   * ```
   */
  keys?: FieldRules | undefined;
  /**
   * Specifies the rules to be applied to the value of each key in the
   * field. Message values will still have their validations evaluated unless
   * skip is specified here.
   *
   * Note that map values are always considered populated. The `required`
   * rule does not apply.
   *
   * ```proto
   * message MyMap {
   *   // The values in the field `value` must follow the specified rules.
   *   map<string, string> value = 1 [(buf.validate.field).map.values = {
   *     string: {
   *       min_len: 5
   *       max_len: 20
   *     }
   *   }];
   * }
   * ```
   */
  values?: FieldRules | undefined;
}

/** AnyRules describe rules applied exclusively to the `google.protobuf.Any` well-known type. */
export interface AnyRules {
  /**
   * `in` requires the field's `type_url` to be equal to one of the
   * specified values. If it doesn't match any of the specified values, an error
   * message is generated.
   *
   * ```proto
   * message MyAny {
   *   //  The `value` field must have a `type_url` equal to one of the specified values.
   *   google.protobuf.Any value = 1 [(buf.validate.field).any = {
   *       in: ["type.googleapis.com/MyType1", "type.googleapis.com/MyType2"]
   *   }];
   * }
   * ```
   */
  in?: string[] | undefined;
  /**
   * requires the field's type_url to be not equal to any of the specified values. If it matches any of the specified values, an error message is generated.
   *
   * ```proto
   * message MyAny {
   *   //  The `value` field must not have a `type_url` equal to any of the specified values.
   *   google.protobuf.Any value = 1 [(buf.validate.field).any = {
   *       not_in: ["type.googleapis.com/ForbiddenType1", "type.googleapis.com/ForbiddenType2"]
   *   }];
   * }
   * ```
   */
  notIn?: string[] | undefined;
}

/** DurationRules describe the rules applied exclusively to the `google.protobuf.Duration` well-known type. */
export interface DurationRules {
  /**
   * `const` dictates that the field must match the specified value of the `google.protobuf.Duration` type exactly.
   * If the field's value deviates from the specified value, an error message
   * will be generated.
   *
   * ```proto
   * message MyDuration {
   *   // value must equal 5s
   *   google.protobuf.Duration value = 1 [(buf.validate.field).duration.const = "5s"];
   * }
   * ```
   */
  const?: Duration | undefined;
  /**
   * `lt` stipulates that the field must be less than the specified value of the `google.protobuf.Duration` type,
   * exclusive. If the field's value is greater than or equal to the specified
   * value, an error message will be generated.
   *
   * ```proto
   * message MyDuration {
   *   // value must be less than 5s
   *   google.protobuf.Duration value = 1 [(buf.validate.field).duration.lt = "5s"];
   * }
   * ```
   */
  lt?: Duration | undefined;
  /**
   * `lte` indicates that the field must be less than or equal to the specified
   * value of the `google.protobuf.Duration` type, inclusive. If the field's value is greater than the specified value,
   * an error message will be generated.
   *
   * ```proto
   * message MyDuration {
   *   // value must be less than or equal to 10s
   *   google.protobuf.Duration value = 1 [(buf.validate.field).duration.lte = "10s"];
   * }
   * ```
   */
  lte?: Duration | undefined;
  /**
   * `gt` requires the duration field value to be greater than the specified
   * value (exclusive). If the value of `gt` is larger than a specified `lt`
   * or `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyDuration {
   *   // duration must be greater than 5s [duration.gt]
   *   google.protobuf.Duration value = 1 [(buf.validate.field).duration.gt = { seconds: 5 }];
   *
   *   // duration must be greater than 5s and less than 10s [duration.gt_lt]
   *   google.protobuf.Duration another_value = 2 [(buf.validate.field).duration = { gt: { seconds: 5 }, lt: { seconds: 10 } }];
   *
   *   // duration must be greater than 10s or less than 5s [duration.gt_lt_exclusive]
   *   google.protobuf.Duration other_value = 3 [(buf.validate.field).duration = { gt: { seconds: 10 }, lt: { seconds: 5 } }];
   * }
   * ```
   */
  gt?: Duration | undefined;
  /**
   * `gte` requires the duration field value to be greater than or equal to the
   * specified value (exclusive). If the value of `gte` is larger than a
   * specified `lt` or `lte`, the range is reversed, and the field value must
   * be outside the specified range. If the field value doesn't meet the
   * required conditions, an error message is generated.
   *
   * ```proto
   * message MyDuration {
   *  // duration must be greater than or equal to 5s [duration.gte]
   *  google.protobuf.Duration value = 1 [(buf.validate.field).duration.gte = { seconds: 5 }];
   *
   *  // duration must be greater than or equal to 5s and less than 10s [duration.gte_lt]
   *  google.protobuf.Duration another_value = 2 [(buf.validate.field).duration = { gte: { seconds: 5 }, lt: { seconds: 10 } }];
   *
   *  // duration must be greater than or equal to 10s or less than 5s [duration.gte_lt_exclusive]
   *  google.protobuf.Duration other_value = 3 [(buf.validate.field).duration = { gte: { seconds: 10 }, lt: { seconds: 5 } }];
   * }
   * ```
   */
  gte?: Duration | undefined;
  /**
   * `in` asserts that the field must be equal to one of the specified values of the `google.protobuf.Duration` type.
   * If the field's value doesn't correspond to any of the specified values,
   * an error message will be generated.
   *
   * ```proto
   * message MyDuration {
   *   // value must be in list [1s, 2s, 3s]
   *   google.protobuf.Duration value = 1 [(buf.validate.field).duration.in = ["1s", "2s", "3s"]];
   * }
   * ```
   */
  in?: Duration[] | undefined;
  /**
   * `not_in` denotes that the field must not be equal to
   * any of the specified values of the `google.protobuf.Duration` type.
   * If the field's value matches any of these values, an error message will be
   * generated.
   *
   * ```proto
   * message MyDuration {
   *   // value must not be in list [1s, 2s, 3s]
   *   google.protobuf.Duration value = 1 [(buf.validate.field).duration.not_in = ["1s", "2s", "3s"]];
   * }
   * ```
   */
  notIn?: Duration[] | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyDuration {
   *   google.protobuf.Duration value = 1 [
   *     (buf.validate.field).duration.example = { seconds: 1 },
   *     (buf.validate.field).duration.example = { seconds: 2 },
   *   ];
   * }
   * ```
   */
  example?: Duration[] | undefined;
}

/** TimestampRules describe the rules applied exclusively to the `google.protobuf.Timestamp` well-known type. */
export interface TimestampRules {
  /**
   * `const` dictates that this field, of the `google.protobuf.Timestamp` type, must exactly match the specified value. If the field value doesn't correspond to the specified timestamp, an error message will be generated.
   *
   * ```proto
   * message MyTimestamp {
   *   // value must equal 2023-05-03T10:00:00Z
   *   google.protobuf.Timestamp created_at = 1 [(buf.validate.field).timestamp.const = {seconds: 1727998800}];
   * }
   * ```
   */
  const?: Date | undefined;
  /**
   * requires the duration field value to be less than the specified value (field < value). If the field value doesn't meet the required conditions, an error message is generated.
   *
   * ```proto
   * message MyDuration {
   *   // duration must be less than 'P3D' [duration.lt]
   *   google.protobuf.Duration value = 1 [(buf.validate.field).duration.lt = { seconds: 259200 }];
   * }
   * ```
   */
  lt?: Date | undefined;
  /**
   * requires the timestamp field value to be less than or equal to the specified value (field <= value). If the field value doesn't meet the required conditions, an error message is generated.
   *
   * ```proto
   * message MyTimestamp {
   *   // timestamp must be less than or equal to '2023-05-14T00:00:00Z' [timestamp.lte]
   *   google.protobuf.Timestamp value = 1 [(buf.validate.field).timestamp.lte = { seconds: 1678867200 }];
   * }
   * ```
   */
  lte?: Date | undefined;
  /**
   * `lt_now` specifies that this field, of the `google.protobuf.Timestamp` type, must be less than the current time. `lt_now` can only be used with the `within` rule.
   *
   * ```proto
   * message MyTimestamp {
   *  // value must be less than now
   *   google.protobuf.Timestamp created_at = 1 [(buf.validate.field).timestamp.lt_now = true];
   * }
   * ```
   */
  ltNow?: boolean | undefined;
  /**
   * `gt` requires the timestamp field value to be greater than the specified
   * value (exclusive). If the value of `gt` is larger than a specified `lt`
   * or `lte`, the range is reversed, and the field value must be outside the
   * specified range. If the field value doesn't meet the required conditions,
   * an error message is generated.
   *
   * ```proto
   * message MyTimestamp {
   *   // timestamp must be greater than '2023-01-01T00:00:00Z' [timestamp.gt]
   *   google.protobuf.Timestamp value = 1 [(buf.validate.field).timestamp.gt = { seconds: 1672444800 }];
   *
   *   // timestamp must be greater than '2023-01-01T00:00:00Z' and less than '2023-01-02T00:00:00Z' [timestamp.gt_lt]
   *   google.protobuf.Timestamp another_value = 2 [(buf.validate.field).timestamp = { gt: { seconds: 1672444800 }, lt: { seconds: 1672531200 } }];
   *
   *   // timestamp must be greater than '2023-01-02T00:00:00Z' or less than '2023-01-01T00:00:00Z' [timestamp.gt_lt_exclusive]
   *   google.protobuf.Timestamp other_value = 3 [(buf.validate.field).timestamp = { gt: { seconds: 1672531200 }, lt: { seconds: 1672444800 } }];
   * }
   * ```
   */
  gt?: Date | undefined;
  /**
   * `gte` requires the timestamp field value to be greater than or equal to the
   * specified value (exclusive). If the value of `gte` is larger than a
   * specified `lt` or `lte`, the range is reversed, and the field value
   * must be outside the specified range. If the field value doesn't meet
   * the required conditions, an error message is generated.
   *
   * ```proto
   * message MyTimestamp {
   *   // timestamp must be greater than or equal to '2023-01-01T00:00:00Z' [timestamp.gte]
   *   google.protobuf.Timestamp value = 1 [(buf.validate.field).timestamp.gte = { seconds: 1672444800 }];
   *
   *   // timestamp must be greater than or equal to '2023-01-01T00:00:00Z' and less than '2023-01-02T00:00:00Z' [timestamp.gte_lt]
   *   google.protobuf.Timestamp another_value = 2 [(buf.validate.field).timestamp = { gte: { seconds: 1672444800 }, lt: { seconds: 1672531200 } }];
   *
   *   // timestamp must be greater than or equal to '2023-01-02T00:00:00Z' or less than '2023-01-01T00:00:00Z' [timestamp.gte_lt_exclusive]
   *   google.protobuf.Timestamp other_value = 3 [(buf.validate.field).timestamp = { gte: { seconds: 1672531200 }, lt: { seconds: 1672444800 } }];
   * }
   * ```
   */
  gte?: Date | undefined;
  /**
   * `gt_now` specifies that this field, of the `google.protobuf.Timestamp` type, must be greater than the current time. `gt_now` can only be used with the `within` rule.
   *
   * ```proto
   * message MyTimestamp {
   *   // value must be greater than now
   *   google.protobuf.Timestamp created_at = 1 [(buf.validate.field).timestamp.gt_now = true];
   * }
   * ```
   */
  gtNow?: boolean | undefined;
  /**
   * `within` specifies that this field, of the `google.protobuf.Timestamp` type, must be within the specified duration of the current time. If the field value isn't within the duration, an error message is generated.
   *
   * ```proto
   * message MyTimestamp {
   *   // value must be within 1 hour of now
   *   google.protobuf.Timestamp created_at = 1 [(buf.validate.field).timestamp.within = {seconds: 3600}];
   * }
   * ```
   */
  within?: Duration | undefined;
  /**
   * `example` specifies values that the field may have. These values SHOULD
   * conform to other rules. `example` values will not impact validation
   * but may be used as helpful guidance on how to populate the given field.
   *
   * ```proto
   * message MyTimestamp {
   *   google.protobuf.Timestamp value = 1 [
   *     (buf.validate.field).timestamp.example = { seconds: 1672444800 },
   *     (buf.validate.field).timestamp.example = { seconds: 1672531200 },
   *   ];
   * }
   * ```
   */
  example?: Date[] | undefined;
}

/**
 * `Violations` is a collection of `Violation` messages. This message type is returned by
 * Protovalidate when a proto message fails to meet the requirements set by the `Rule` validation rules.
 * Each individual violation is represented by a `Violation` message.
 */
export interface Violations {
  /** `violations` is a repeated field that contains all the `Violation` messages corresponding to the violations detected. */
  violations?: Violation[] | undefined;
}

/**
 * `Violation` represents a single instance where a validation rule, expressed
 * as a `Rule`, was not met. It provides information about the field that
 * caused the violation, the specific rule that wasn't fulfilled, and a
 * human-readable error message.
 *
 * For example, consider the following message:
 *
 * ```proto
 * message User {
 *     int32 age = 1 [(buf.validate.field).cel = {
 *         id: "user.age",
 *         expression: "this < 18 ? 'User must be at least 18 years old' : ''",
 *     }];
 * }
 * ```
 *
 * It could produce the following violation:
 *
 * ```json
 * {
 *   "ruleId": "user.age",
 *   "message": "User must be at least 18 years old",
 *   "field": {
 *     "elements": [
 *       {
 *         "fieldNumber": 1,
 *         "fieldName": "age",
 *         "fieldType": "TYPE_INT32"
 *       }
 *     ]
 *   },
 *   "rule": {
 *     "elements": [
 *       {
 *         "fieldNumber": 23,
 *         "fieldName": "cel",
 *         "fieldType": "TYPE_MESSAGE",
 *         "index": "0"
 *       }
 *     ]
 *   }
 * }
 * ```
 */
export interface Violation {
  /**
   * `field` is a machine-readable path to the field that failed validation.
   * This could be a nested field, in which case the path will include all the parent fields leading to the actual field that caused the violation.
   *
   * For example, consider the following message:
   *
   * ```proto
   * message Message {
   *   bool a = 1 [(buf.validate.field).required = true];
   * }
   * ```
   *
   * It could produce the following violation:
   *
   * ```textproto
   * violation {
   *   field { element { field_number: 1, field_name: "a", field_type: 8 } }
   *   ...
   * }
   * ```
   */
  field?: FieldPath | undefined;
  /**
   * `rule` is a machine-readable path that points to the specific rule that failed validation.
   * This will be a nested field starting from the FieldRules of the field that failed validation.
   * For custom rules, this will provide the path of the rule, e.g. `cel[0]`.
   *
   * For example, consider the following message:
   *
   * ```proto
   * message Message {
   *   bool a = 1 [(buf.validate.field).required = true];
   *   bool b = 2 [(buf.validate.field).cel = {
   *     id: "custom_rule",
   *     expression: "!this ? 'b must be true': ''"
   *   }]
   * }
   * ```
   *
   * It could produce the following violations:
   *
   * ```textproto
   * violation {
   *   rule { element { field_number: 25, field_name: "required", field_type: 8 } }
   *   ...
   * }
   * violation {
   *   rule { element { field_number: 23, field_name: "cel", field_type: 11, index: 0 } }
   *   ...
   * }
   * ```
   */
  rule?: FieldPath | undefined;
  /**
   * `rule_id` is the unique identifier of the `Rule` that was not fulfilled.
   * This is the same `id` that was specified in the `Rule` message, allowing easy tracing of which rule was violated.
   */
  ruleId?: string | undefined;
  /**
   * `message` is a human-readable error message that describes the nature of the violation.
   * This can be the default error message from the violated `Rule`, or it can be a custom message that gives more context about the violation.
   */
  message?: string | undefined;
  /** `for_key` indicates whether the violation was caused by a map key, rather than a value. */
  forKey?: boolean | undefined;
}

/**
 * `FieldPath` provides a path to a nested protobuf field.
 *
 * This message provides enough information to render a dotted field path even without protobuf descriptors.
 * It also provides enough information to resolve a nested field through unknown wire data.
 */
export interface FieldPath {
  /** `elements` contains each element of the path, starting from the root and recursing downward. */
  elements?: FieldPathElement[] | undefined;
}

/**
 * `FieldPathElement` provides enough information to nest through a single protobuf field.
 *
 * If the selected field is a map or repeated field, the `subscript` value selects a specific element from it.
 * A path that refers to a value nested under a map key or repeated field index will have a `subscript` value.
 * The `field_type` field allows unambiguous resolution of a field even if descriptors are not available.
 */
export interface FieldPathElement {
  /** `field_number` is the field number this path element refers to. */
  fieldNumber?: number | undefined;
  /**
   * `field_name` contains the field name this path element refers to.
   * This can be used to display a human-readable path even if the field number is unknown.
   */
  fieldName?: string | undefined;
  /**
   * `field_type` specifies the type of this field. When using reflection, this value is not needed.
   *
   * This value is provided to make it possible to traverse unknown fields through wire data.
   * When traversing wire data, be mindful of both packed[1] and delimited[2] encoding schemes.
   *
   * [1]: https://protobuf.dev/programming-guides/encoding/#packed
   * [2]: https://protobuf.dev/programming-guides/encoding/#groups
   *
   * N.B.: Although groups are deprecated, the corresponding delimited encoding scheme is not, and
   * can be explicitly used in Protocol Buffers 2023 Edition.
   */
  fieldType?: FieldDescriptorProto_Type | undefined;
  /**
   * `key_type` specifies the map key type of this field. This value is useful when traversing
   * unknown fields through wire data: specifically, it allows handling the differences between
   * different integer encodings.
   */
  keyType?: FieldDescriptorProto_Type | undefined;
  /**
   * `value_type` specifies map value type of this field. This is useful if you want to display a
   * value inside unknown fields through wire data.
   */
  valueType?: FieldDescriptorProto_Type | undefined;
  /** `index` specifies a 0-based index into a repeated field. */
  index?: number | undefined;
  /** `bool_key` specifies a map key of type bool. */
  boolKey?: boolean | undefined;
  /** `int_key` specifies a map key of type int32, int64, sint32, sint64, sfixed32 or sfixed64. */
  intKey?: number | undefined;
  /** `uint_key` specifies a map key of type uint32, uint64, fixed32 or fixed64. */
  uintKey?: number | undefined;
  /** `string_key` specifies a map key of type string. */
  stringKey?: string | undefined;
}

function createBaseRule(): Rule {
  return { id: "", message: "", expression: "" };
}

export const Rule = {
  encode(message: Rule, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.message !== undefined && message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    if (message.expression !== undefined && message.expression !== "") {
      writer.uint32(26).string(message.expression);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Rule {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRule();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.message = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.expression = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Rule {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      message: isSet(object.message) ? globalThis.String(object.message) : "",
      expression: isSet(object.expression)
        ? globalThis.String(object.expression)
        : "",
    };
  },

  toJSON(message: Rule): unknown {
    const obj: any = {};
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.message !== undefined && message.message !== "") {
      obj.message = message.message;
    }
    if (message.expression !== undefined && message.expression !== "") {
      obj.expression = message.expression;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Rule>, I>>(base?: I): Rule {
    return Rule.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Rule>, I>>(object: I): Rule {
    const message = createBaseRule();
    message.id = object.id ?? "";
    message.message = object.message ?? "";
    message.expression = object.expression ?? "";
    return message;
  },
};

function createBaseMessageRules(): MessageRules {
  return { disabled: false, cel: [], oneof: [] };
}

export const MessageRules = {
  encode(
    message: MessageRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.disabled === true) {
      writer.uint32(8).bool(message.disabled);
    }
    if (message.cel !== undefined && message.cel.length !== 0) {
      for (const v of message.cel) {
        Rule.encode(v!, writer.uint32(26).fork()).ldelim();
      }
    }
    if (message.oneof !== undefined && message.oneof.length !== 0) {
      for (const v of message.oneof) {
        MessageOneofRule.encode(v!, writer.uint32(34).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.disabled = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.cel!.push(Rule.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.oneof!.push(MessageOneofRule.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageRules {
    return {
      disabled: isSet(object.disabled)
        ? globalThis.Boolean(object.disabled)
        : false,
      cel: globalThis.Array.isArray(object?.cel)
        ? object.cel.map((e: any) => Rule.fromJSON(e))
        : [],
      oneof: globalThis.Array.isArray(object?.oneof)
        ? object.oneof.map((e: any) => MessageOneofRule.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MessageRules): unknown {
    const obj: any = {};
    if (message.disabled === true) {
      obj.disabled = message.disabled;
    }
    if (message.cel?.length) {
      obj.cel = message.cel.map((e) => Rule.toJSON(e));
    }
    if (message.oneof?.length) {
      obj.oneof = message.oneof.map((e) => MessageOneofRule.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageRules>, I>>(
    base?: I,
  ): MessageRules {
    return MessageRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageRules>, I>>(
    object: I,
  ): MessageRules {
    const message = createBaseMessageRules();
    message.disabled = object.disabled ?? false;
    message.cel = object.cel?.map((e) => Rule.fromPartial(e)) || [];
    message.oneof =
      object.oneof?.map((e) => MessageOneofRule.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMessageOneofRule(): MessageOneofRule {
  return { fields: [], required: false };
}

export const MessageOneofRule = {
  encode(
    message: MessageOneofRule,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.fields !== undefined && message.fields.length !== 0) {
      for (const v of message.fields) {
        writer.uint32(10).string(v!);
      }
    }
    if (message.required === true) {
      writer.uint32(16).bool(message.required);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageOneofRule {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageOneofRule();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.fields!.push(reader.string());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.required = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageOneofRule {
    return {
      fields: globalThis.Array.isArray(object?.fields)
        ? object.fields.map((e: any) => globalThis.String(e))
        : [],
      required: isSet(object.required)
        ? globalThis.Boolean(object.required)
        : false,
    };
  },

  toJSON(message: MessageOneofRule): unknown {
    const obj: any = {};
    if (message.fields?.length) {
      obj.fields = message.fields;
    }
    if (message.required === true) {
      obj.required = message.required;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageOneofRule>, I>>(
    base?: I,
  ): MessageOneofRule {
    return MessageOneofRule.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageOneofRule>, I>>(
    object: I,
  ): MessageOneofRule {
    const message = createBaseMessageOneofRule();
    message.fields = object.fields?.map((e) => e) || [];
    message.required = object.required ?? false;
    return message;
  },
};

function createBaseOneofRules(): OneofRules {
  return { required: false };
}

export const OneofRules = {
  encode(
    message: OneofRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.required === true) {
      writer.uint32(8).bool(message.required);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OneofRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOneofRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.required = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OneofRules {
    return {
      required: isSet(object.required)
        ? globalThis.Boolean(object.required)
        : false,
    };
  },

  toJSON(message: OneofRules): unknown {
    const obj: any = {};
    if (message.required === true) {
      obj.required = message.required;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OneofRules>, I>>(base?: I): OneofRules {
    return OneofRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OneofRules>, I>>(
    object: I,
  ): OneofRules {
    const message = createBaseOneofRules();
    message.required = object.required ?? false;
    return message;
  },
};

function createBaseFieldRules(): FieldRules {
  return {
    cel: [],
    required: false,
    ignore: 0,
    float: undefined,
    double: undefined,
    int32: undefined,
    int64: undefined,
    uint32: undefined,
    uint64: undefined,
    sint32: undefined,
    sint64: undefined,
    fixed32: undefined,
    fixed64: undefined,
    sfixed32: undefined,
    sfixed64: undefined,
    bool: undefined,
    string: undefined,
    bytes: undefined,
    enum: undefined,
    repeated: undefined,
    map: undefined,
    any: undefined,
    duration: undefined,
    timestamp: undefined,
  };
}

export const FieldRules = {
  encode(
    message: FieldRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.cel !== undefined && message.cel.length !== 0) {
      for (const v of message.cel) {
        Rule.encode(v!, writer.uint32(186).fork()).ldelim();
      }
    }
    if (message.required === true) {
      writer.uint32(200).bool(message.required);
    }
    if (message.ignore !== undefined && message.ignore !== 0) {
      writer.uint32(216).int32(message.ignore);
    }
    if (message.float !== undefined) {
      FloatRules.encode(message.float, writer.uint32(10).fork()).ldelim();
    }
    if (message.double !== undefined) {
      DoubleRules.encode(message.double, writer.uint32(18).fork()).ldelim();
    }
    if (message.int32 !== undefined) {
      Int32Rules.encode(message.int32, writer.uint32(26).fork()).ldelim();
    }
    if (message.int64 !== undefined) {
      Int64Rules.encode(message.int64, writer.uint32(34).fork()).ldelim();
    }
    if (message.uint32 !== undefined) {
      UInt32Rules.encode(message.uint32, writer.uint32(42).fork()).ldelim();
    }
    if (message.uint64 !== undefined) {
      UInt64Rules.encode(message.uint64, writer.uint32(50).fork()).ldelim();
    }
    if (message.sint32 !== undefined) {
      SInt32Rules.encode(message.sint32, writer.uint32(58).fork()).ldelim();
    }
    if (message.sint64 !== undefined) {
      SInt64Rules.encode(message.sint64, writer.uint32(66).fork()).ldelim();
    }
    if (message.fixed32 !== undefined) {
      Fixed32Rules.encode(message.fixed32, writer.uint32(74).fork()).ldelim();
    }
    if (message.fixed64 !== undefined) {
      Fixed64Rules.encode(message.fixed64, writer.uint32(82).fork()).ldelim();
    }
    if (message.sfixed32 !== undefined) {
      SFixed32Rules.encode(message.sfixed32, writer.uint32(90).fork()).ldelim();
    }
    if (message.sfixed64 !== undefined) {
      SFixed64Rules.encode(message.sfixed64, writer.uint32(98).fork()).ldelim();
    }
    if (message.bool !== undefined) {
      BoolRules.encode(message.bool, writer.uint32(106).fork()).ldelim();
    }
    if (message.string !== undefined) {
      StringRules.encode(message.string, writer.uint32(114).fork()).ldelim();
    }
    if (message.bytes !== undefined) {
      BytesRules.encode(message.bytes, writer.uint32(122).fork()).ldelim();
    }
    if (message.enum !== undefined) {
      EnumRules.encode(message.enum, writer.uint32(130).fork()).ldelim();
    }
    if (message.repeated !== undefined) {
      RepeatedRules.encode(
        message.repeated,
        writer.uint32(146).fork(),
      ).ldelim();
    }
    if (message.map !== undefined) {
      MapRules.encode(message.map, writer.uint32(154).fork()).ldelim();
    }
    if (message.any !== undefined) {
      AnyRules.encode(message.any, writer.uint32(162).fork()).ldelim();
    }
    if (message.duration !== undefined) {
      DurationRules.encode(
        message.duration,
        writer.uint32(170).fork(),
      ).ldelim();
    }
    if (message.timestamp !== undefined) {
      TimestampRules.encode(
        message.timestamp,
        writer.uint32(178).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FieldRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFieldRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 23:
          if (tag !== 186) {
            break;
          }

          message.cel!.push(Rule.decode(reader, reader.uint32()));
          continue;
        case 25:
          if (tag !== 200) {
            break;
          }

          message.required = reader.bool();
          continue;
        case 27:
          if (tag !== 216) {
            break;
          }

          message.ignore = reader.int32() as any;
          continue;
        case 1:
          if (tag !== 10) {
            break;
          }

          message.float = FloatRules.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.double = DoubleRules.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.int32 = Int32Rules.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.int64 = Int64Rules.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.uint32 = UInt32Rules.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.uint64 = UInt64Rules.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.sint32 = SInt32Rules.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.sint64 = SInt64Rules.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.fixed32 = Fixed32Rules.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.fixed64 = Fixed64Rules.decode(reader, reader.uint32());
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.sfixed32 = SFixed32Rules.decode(reader, reader.uint32());
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.sfixed64 = SFixed64Rules.decode(reader, reader.uint32());
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.bool = BoolRules.decode(reader, reader.uint32());
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.string = StringRules.decode(reader, reader.uint32());
          continue;
        case 15:
          if (tag !== 122) {
            break;
          }

          message.bytes = BytesRules.decode(reader, reader.uint32());
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.enum = EnumRules.decode(reader, reader.uint32());
          continue;
        case 18:
          if (tag !== 146) {
            break;
          }

          message.repeated = RepeatedRules.decode(reader, reader.uint32());
          continue;
        case 19:
          if (tag !== 154) {
            break;
          }

          message.map = MapRules.decode(reader, reader.uint32());
          continue;
        case 20:
          if (tag !== 162) {
            break;
          }

          message.any = AnyRules.decode(reader, reader.uint32());
          continue;
        case 21:
          if (tag !== 170) {
            break;
          }

          message.duration = DurationRules.decode(reader, reader.uint32());
          continue;
        case 22:
          if (tag !== 178) {
            break;
          }

          message.timestamp = TimestampRules.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FieldRules {
    return {
      cel: globalThis.Array.isArray(object?.cel)
        ? object.cel.map((e: any) => Rule.fromJSON(e))
        : [],
      required: isSet(object.required)
        ? globalThis.Boolean(object.required)
        : false,
      ignore: isSet(object.ignore) ? ignoreFromJSON(object.ignore) : 0,
      float: isSet(object.float)
        ? FloatRules.fromJSON(object.float)
        : undefined,
      double: isSet(object.double)
        ? DoubleRules.fromJSON(object.double)
        : undefined,
      int32: isSet(object.int32)
        ? Int32Rules.fromJSON(object.int32)
        : undefined,
      int64: isSet(object.int64)
        ? Int64Rules.fromJSON(object.int64)
        : undefined,
      uint32: isSet(object.uint32)
        ? UInt32Rules.fromJSON(object.uint32)
        : undefined,
      uint64: isSet(object.uint64)
        ? UInt64Rules.fromJSON(object.uint64)
        : undefined,
      sint32: isSet(object.sint32)
        ? SInt32Rules.fromJSON(object.sint32)
        : undefined,
      sint64: isSet(object.sint64)
        ? SInt64Rules.fromJSON(object.sint64)
        : undefined,
      fixed32: isSet(object.fixed32)
        ? Fixed32Rules.fromJSON(object.fixed32)
        : undefined,
      fixed64: isSet(object.fixed64)
        ? Fixed64Rules.fromJSON(object.fixed64)
        : undefined,
      sfixed32: isSet(object.sfixed32)
        ? SFixed32Rules.fromJSON(object.sfixed32)
        : undefined,
      sfixed64: isSet(object.sfixed64)
        ? SFixed64Rules.fromJSON(object.sfixed64)
        : undefined,
      bool: isSet(object.bool) ? BoolRules.fromJSON(object.bool) : undefined,
      string: isSet(object.string)
        ? StringRules.fromJSON(object.string)
        : undefined,
      bytes: isSet(object.bytes)
        ? BytesRules.fromJSON(object.bytes)
        : undefined,
      enum: isSet(object.enum) ? EnumRules.fromJSON(object.enum) : undefined,
      repeated: isSet(object.repeated)
        ? RepeatedRules.fromJSON(object.repeated)
        : undefined,
      map: isSet(object.map) ? MapRules.fromJSON(object.map) : undefined,
      any: isSet(object.any) ? AnyRules.fromJSON(object.any) : undefined,
      duration: isSet(object.duration)
        ? DurationRules.fromJSON(object.duration)
        : undefined,
      timestamp: isSet(object.timestamp)
        ? TimestampRules.fromJSON(object.timestamp)
        : undefined,
    };
  },

  toJSON(message: FieldRules): unknown {
    const obj: any = {};
    if (message.cel?.length) {
      obj.cel = message.cel.map((e) => Rule.toJSON(e));
    }
    if (message.required === true) {
      obj.required = message.required;
    }
    if (message.ignore !== undefined && message.ignore !== 0) {
      obj.ignore = ignoreToJSON(message.ignore);
    }
    if (message.float !== undefined) {
      obj.float = FloatRules.toJSON(message.float);
    }
    if (message.double !== undefined) {
      obj.double = DoubleRules.toJSON(message.double);
    }
    if (message.int32 !== undefined) {
      obj.int32 = Int32Rules.toJSON(message.int32);
    }
    if (message.int64 !== undefined) {
      obj.int64 = Int64Rules.toJSON(message.int64);
    }
    if (message.uint32 !== undefined) {
      obj.uint32 = UInt32Rules.toJSON(message.uint32);
    }
    if (message.uint64 !== undefined) {
      obj.uint64 = UInt64Rules.toJSON(message.uint64);
    }
    if (message.sint32 !== undefined) {
      obj.sint32 = SInt32Rules.toJSON(message.sint32);
    }
    if (message.sint64 !== undefined) {
      obj.sint64 = SInt64Rules.toJSON(message.sint64);
    }
    if (message.fixed32 !== undefined) {
      obj.fixed32 = Fixed32Rules.toJSON(message.fixed32);
    }
    if (message.fixed64 !== undefined) {
      obj.fixed64 = Fixed64Rules.toJSON(message.fixed64);
    }
    if (message.sfixed32 !== undefined) {
      obj.sfixed32 = SFixed32Rules.toJSON(message.sfixed32);
    }
    if (message.sfixed64 !== undefined) {
      obj.sfixed64 = SFixed64Rules.toJSON(message.sfixed64);
    }
    if (message.bool !== undefined) {
      obj.bool = BoolRules.toJSON(message.bool);
    }
    if (message.string !== undefined) {
      obj.string = StringRules.toJSON(message.string);
    }
    if (message.bytes !== undefined) {
      obj.bytes = BytesRules.toJSON(message.bytes);
    }
    if (message.enum !== undefined) {
      obj.enum = EnumRules.toJSON(message.enum);
    }
    if (message.repeated !== undefined) {
      obj.repeated = RepeatedRules.toJSON(message.repeated);
    }
    if (message.map !== undefined) {
      obj.map = MapRules.toJSON(message.map);
    }
    if (message.any !== undefined) {
      obj.any = AnyRules.toJSON(message.any);
    }
    if (message.duration !== undefined) {
      obj.duration = DurationRules.toJSON(message.duration);
    }
    if (message.timestamp !== undefined) {
      obj.timestamp = TimestampRules.toJSON(message.timestamp);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FieldRules>, I>>(base?: I): FieldRules {
    return FieldRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FieldRules>, I>>(
    object: I,
  ): FieldRules {
    const message = createBaseFieldRules();
    message.cel = object.cel?.map((e) => Rule.fromPartial(e)) || [];
    message.required = object.required ?? false;
    message.ignore = object.ignore ?? 0;
    message.float =
      object.float !== undefined && object.float !== null
        ? FloatRules.fromPartial(object.float)
        : undefined;
    message.double =
      object.double !== undefined && object.double !== null
        ? DoubleRules.fromPartial(object.double)
        : undefined;
    message.int32 =
      object.int32 !== undefined && object.int32 !== null
        ? Int32Rules.fromPartial(object.int32)
        : undefined;
    message.int64 =
      object.int64 !== undefined && object.int64 !== null
        ? Int64Rules.fromPartial(object.int64)
        : undefined;
    message.uint32 =
      object.uint32 !== undefined && object.uint32 !== null
        ? UInt32Rules.fromPartial(object.uint32)
        : undefined;
    message.uint64 =
      object.uint64 !== undefined && object.uint64 !== null
        ? UInt64Rules.fromPartial(object.uint64)
        : undefined;
    message.sint32 =
      object.sint32 !== undefined && object.sint32 !== null
        ? SInt32Rules.fromPartial(object.sint32)
        : undefined;
    message.sint64 =
      object.sint64 !== undefined && object.sint64 !== null
        ? SInt64Rules.fromPartial(object.sint64)
        : undefined;
    message.fixed32 =
      object.fixed32 !== undefined && object.fixed32 !== null
        ? Fixed32Rules.fromPartial(object.fixed32)
        : undefined;
    message.fixed64 =
      object.fixed64 !== undefined && object.fixed64 !== null
        ? Fixed64Rules.fromPartial(object.fixed64)
        : undefined;
    message.sfixed32 =
      object.sfixed32 !== undefined && object.sfixed32 !== null
        ? SFixed32Rules.fromPartial(object.sfixed32)
        : undefined;
    message.sfixed64 =
      object.sfixed64 !== undefined && object.sfixed64 !== null
        ? SFixed64Rules.fromPartial(object.sfixed64)
        : undefined;
    message.bool =
      object.bool !== undefined && object.bool !== null
        ? BoolRules.fromPartial(object.bool)
        : undefined;
    message.string =
      object.string !== undefined && object.string !== null
        ? StringRules.fromPartial(object.string)
        : undefined;
    message.bytes =
      object.bytes !== undefined && object.bytes !== null
        ? BytesRules.fromPartial(object.bytes)
        : undefined;
    message.enum =
      object.enum !== undefined && object.enum !== null
        ? EnumRules.fromPartial(object.enum)
        : undefined;
    message.repeated =
      object.repeated !== undefined && object.repeated !== null
        ? RepeatedRules.fromPartial(object.repeated)
        : undefined;
    message.map =
      object.map !== undefined && object.map !== null
        ? MapRules.fromPartial(object.map)
        : undefined;
    message.any =
      object.any !== undefined && object.any !== null
        ? AnyRules.fromPartial(object.any)
        : undefined;
    message.duration =
      object.duration !== undefined && object.duration !== null
        ? DurationRules.fromPartial(object.duration)
        : undefined;
    message.timestamp =
      object.timestamp !== undefined && object.timestamp !== null
        ? TimestampRules.fromPartial(object.timestamp)
        : undefined;
    return message;
  },
};

function createBasePredefinedRules(): PredefinedRules {
  return { cel: [] };
}

export const PredefinedRules = {
  encode(
    message: PredefinedRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.cel !== undefined && message.cel.length !== 0) {
      for (const v of message.cel) {
        Rule.encode(v!, writer.uint32(10).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PredefinedRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePredefinedRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cel!.push(Rule.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PredefinedRules {
    return {
      cel: globalThis.Array.isArray(object?.cel)
        ? object.cel.map((e: any) => Rule.fromJSON(e))
        : [],
    };
  },

  toJSON(message: PredefinedRules): unknown {
    const obj: any = {};
    if (message.cel?.length) {
      obj.cel = message.cel.map((e) => Rule.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PredefinedRules>, I>>(
    base?: I,
  ): PredefinedRules {
    return PredefinedRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PredefinedRules>, I>>(
    object: I,
  ): PredefinedRules {
    const message = createBasePredefinedRules();
    message.cel = object.cel?.map((e) => Rule.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFloatRules(): FloatRules {
  return {
    const: 0,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    finite: false,
    example: [],
  };
}

export const FloatRules = {
  encode(
    message: FloatRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(13).float(message.const);
    }
    if (message.lt !== undefined) {
      writer.uint32(21).float(message.lt);
    }
    if (message.lte !== undefined) {
      writer.uint32(29).float(message.lte);
    }
    if (message.gt !== undefined) {
      writer.uint32(37).float(message.gt);
    }
    if (message.gte !== undefined) {
      writer.uint32(45).float(message.gte);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(50).fork();
      for (const v of message.in) {
        writer.float(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(58).fork();
      for (const v of message.notIn) {
        writer.float(v);
      }
      writer.ldelim();
    }
    if (message.finite === true) {
      writer.uint32(64).bool(message.finite);
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(74).fork();
      for (const v of message.example) {
        writer.float(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FloatRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFloatRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.const = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.lt = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }

          message.lte = reader.float();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }

          message.gt = reader.float();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }

          message.gte = reader.float();
          continue;
        case 6:
          if (tag === 53) {
            message.in!.push(reader.float());

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(reader.float());
            }

            continue;
          }

          break;
        case 7:
          if (tag === 61) {
            message.notIn!.push(reader.float());

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(reader.float());
            }

            continue;
          }

          break;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.finite = reader.bool();
          continue;
        case 9:
          if (tag === 77) {
            message.example!.push(reader.float());

            continue;
          }

          if (tag === 74) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(reader.float());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FloatRules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      lt: isSet(object.lt) ? globalThis.Number(object.lt) : undefined,
      lte: isSet(object.lte) ? globalThis.Number(object.lte) : undefined,
      gt: isSet(object.gt) ? globalThis.Number(object.gt) : undefined,
      gte: isSet(object.gte) ? globalThis.Number(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      finite: isSet(object.finite) ? globalThis.Boolean(object.finite) : false,
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: FloatRules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = message.const;
    }
    if (message.lt !== undefined) {
      obj.lt = message.lt;
    }
    if (message.lte !== undefined) {
      obj.lte = message.lte;
    }
    if (message.gt !== undefined) {
      obj.gt = message.gt;
    }
    if (message.gte !== undefined) {
      obj.gte = message.gte;
    }
    if (message.in?.length) {
      obj.in = message.in;
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn;
    }
    if (message.finite === true) {
      obj.finite = message.finite;
    }
    if (message.example?.length) {
      obj.example = message.example;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FloatRules>, I>>(base?: I): FloatRules {
    return FloatRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FloatRules>, I>>(
    object: I,
  ): FloatRules {
    const message = createBaseFloatRules();
    message.const = object.const ?? 0;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.finite = object.finite ?? false;
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseDoubleRules(): DoubleRules {
  return {
    const: 0,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    finite: false,
    example: [],
  };
}

export const DoubleRules = {
  encode(
    message: DoubleRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(9).double(message.const);
    }
    if (message.lt !== undefined) {
      writer.uint32(17).double(message.lt);
    }
    if (message.lte !== undefined) {
      writer.uint32(25).double(message.lte);
    }
    if (message.gt !== undefined) {
      writer.uint32(33).double(message.gt);
    }
    if (message.gte !== undefined) {
      writer.uint32(41).double(message.gte);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(50).fork();
      for (const v of message.in) {
        writer.double(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(58).fork();
      for (const v of message.notIn) {
        writer.double(v);
      }
      writer.ldelim();
    }
    if (message.finite === true) {
      writer.uint32(64).bool(message.finite);
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(74).fork();
      for (const v of message.example) {
        writer.double(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DoubleRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDoubleRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 9) {
            break;
          }

          message.const = reader.double();
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }

          message.lt = reader.double();
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }

          message.lte = reader.double();
          continue;
        case 4:
          if (tag !== 33) {
            break;
          }

          message.gt = reader.double();
          continue;
        case 5:
          if (tag !== 41) {
            break;
          }

          message.gte = reader.double();
          continue;
        case 6:
          if (tag === 49) {
            message.in!.push(reader.double());

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(reader.double());
            }

            continue;
          }

          break;
        case 7:
          if (tag === 57) {
            message.notIn!.push(reader.double());

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(reader.double());
            }

            continue;
          }

          break;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.finite = reader.bool();
          continue;
        case 9:
          if (tag === 73) {
            message.example!.push(reader.double());

            continue;
          }

          if (tag === 74) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(reader.double());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DoubleRules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      lt: isSet(object.lt) ? globalThis.Number(object.lt) : undefined,
      lte: isSet(object.lte) ? globalThis.Number(object.lte) : undefined,
      gt: isSet(object.gt) ? globalThis.Number(object.gt) : undefined,
      gte: isSet(object.gte) ? globalThis.Number(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      finite: isSet(object.finite) ? globalThis.Boolean(object.finite) : false,
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: DoubleRules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = message.const;
    }
    if (message.lt !== undefined) {
      obj.lt = message.lt;
    }
    if (message.lte !== undefined) {
      obj.lte = message.lte;
    }
    if (message.gt !== undefined) {
      obj.gt = message.gt;
    }
    if (message.gte !== undefined) {
      obj.gte = message.gte;
    }
    if (message.in?.length) {
      obj.in = message.in;
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn;
    }
    if (message.finite === true) {
      obj.finite = message.finite;
    }
    if (message.example?.length) {
      obj.example = message.example;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DoubleRules>, I>>(base?: I): DoubleRules {
    return DoubleRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DoubleRules>, I>>(
    object: I,
  ): DoubleRules {
    const message = createBaseDoubleRules();
    message.const = object.const ?? 0;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.finite = object.finite ?? false;
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseInt32Rules(): Int32Rules {
  return {
    const: 0,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    example: [],
  };
}

export const Int32Rules = {
  encode(
    message: Int32Rules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(8).int32(message.const);
    }
    if (message.lt !== undefined) {
      writer.uint32(16).int32(message.lt);
    }
    if (message.lte !== undefined) {
      writer.uint32(24).int32(message.lte);
    }
    if (message.gt !== undefined) {
      writer.uint32(32).int32(message.gt);
    }
    if (message.gte !== undefined) {
      writer.uint32(40).int32(message.gte);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(50).fork();
      for (const v of message.in) {
        writer.int32(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(58).fork();
      for (const v of message.notIn) {
        writer.int32(v);
      }
      writer.ldelim();
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(66).fork();
      for (const v of message.example) {
        writer.int32(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Int32Rules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInt32Rules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.const = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.lt = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.lte = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.gt = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.gte = reader.int32();
          continue;
        case 6:
          if (tag === 48) {
            message.in!.push(reader.int32());

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(reader.int32());
            }

            continue;
          }

          break;
        case 7:
          if (tag === 56) {
            message.notIn!.push(reader.int32());

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(reader.int32());
            }

            continue;
          }

          break;
        case 8:
          if (tag === 64) {
            message.example!.push(reader.int32());

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(reader.int32());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Int32Rules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      lt: isSet(object.lt) ? globalThis.Number(object.lt) : undefined,
      lte: isSet(object.lte) ? globalThis.Number(object.lte) : undefined,
      gt: isSet(object.gt) ? globalThis.Number(object.gt) : undefined,
      gte: isSet(object.gte) ? globalThis.Number(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: Int32Rules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = Math.round(message.const);
    }
    if (message.lt !== undefined) {
      obj.lt = Math.round(message.lt);
    }
    if (message.lte !== undefined) {
      obj.lte = Math.round(message.lte);
    }
    if (message.gt !== undefined) {
      obj.gt = Math.round(message.gt);
    }
    if (message.gte !== undefined) {
      obj.gte = Math.round(message.gte);
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => Math.round(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Int32Rules>, I>>(base?: I): Int32Rules {
    return Int32Rules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Int32Rules>, I>>(
    object: I,
  ): Int32Rules {
    const message = createBaseInt32Rules();
    message.const = object.const ?? 0;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseInt64Rules(): Int64Rules {
  return {
    const: 0,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    example: [],
  };
}

export const Int64Rules = {
  encode(
    message: Int64Rules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(8).int64(message.const);
    }
    if (message.lt !== undefined) {
      writer.uint32(16).int64(message.lt);
    }
    if (message.lte !== undefined) {
      writer.uint32(24).int64(message.lte);
    }
    if (message.gt !== undefined) {
      writer.uint32(32).int64(message.gt);
    }
    if (message.gte !== undefined) {
      writer.uint32(40).int64(message.gte);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(50).fork();
      for (const v of message.in) {
        writer.int64(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(58).fork();
      for (const v of message.notIn) {
        writer.int64(v);
      }
      writer.ldelim();
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(74).fork();
      for (const v of message.example) {
        writer.int64(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Int64Rules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInt64Rules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.const = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.lt = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.lte = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.gt = longToNumber(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.gte = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag === 48) {
            message.in!.push(longToNumber(reader.int64() as Long));

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(longToNumber(reader.int64() as Long));
            }

            continue;
          }

          break;
        case 7:
          if (tag === 56) {
            message.notIn!.push(longToNumber(reader.int64() as Long));

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(longToNumber(reader.int64() as Long));
            }

            continue;
          }

          break;
        case 9:
          if (tag === 72) {
            message.example!.push(longToNumber(reader.int64() as Long));

            continue;
          }

          if (tag === 74) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(longToNumber(reader.int64() as Long));
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Int64Rules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      lt: isSet(object.lt) ? globalThis.Number(object.lt) : undefined,
      lte: isSet(object.lte) ? globalThis.Number(object.lte) : undefined,
      gt: isSet(object.gt) ? globalThis.Number(object.gt) : undefined,
      gte: isSet(object.gte) ? globalThis.Number(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: Int64Rules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = Math.round(message.const);
    }
    if (message.lt !== undefined) {
      obj.lt = Math.round(message.lt);
    }
    if (message.lte !== undefined) {
      obj.lte = Math.round(message.lte);
    }
    if (message.gt !== undefined) {
      obj.gt = Math.round(message.gt);
    }
    if (message.gte !== undefined) {
      obj.gte = Math.round(message.gte);
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => Math.round(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Int64Rules>, I>>(base?: I): Int64Rules {
    return Int64Rules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Int64Rules>, I>>(
    object: I,
  ): Int64Rules {
    const message = createBaseInt64Rules();
    message.const = object.const ?? 0;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseUInt32Rules(): UInt32Rules {
  return {
    const: 0,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    example: [],
  };
}

export const UInt32Rules = {
  encode(
    message: UInt32Rules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(8).uint32(message.const);
    }
    if (message.lt !== undefined) {
      writer.uint32(16).uint32(message.lt);
    }
    if (message.lte !== undefined) {
      writer.uint32(24).uint32(message.lte);
    }
    if (message.gt !== undefined) {
      writer.uint32(32).uint32(message.gt);
    }
    if (message.gte !== undefined) {
      writer.uint32(40).uint32(message.gte);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(50).fork();
      for (const v of message.in) {
        writer.uint32(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(58).fork();
      for (const v of message.notIn) {
        writer.uint32(v);
      }
      writer.ldelim();
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(66).fork();
      for (const v of message.example) {
        writer.uint32(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UInt32Rules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUInt32Rules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.const = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.lt = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.lte = reader.uint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.gt = reader.uint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.gte = reader.uint32();
          continue;
        case 6:
          if (tag === 48) {
            message.in!.push(reader.uint32());

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(reader.uint32());
            }

            continue;
          }

          break;
        case 7:
          if (tag === 56) {
            message.notIn!.push(reader.uint32());

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(reader.uint32());
            }

            continue;
          }

          break;
        case 8:
          if (tag === 64) {
            message.example!.push(reader.uint32());

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(reader.uint32());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UInt32Rules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      lt: isSet(object.lt) ? globalThis.Number(object.lt) : undefined,
      lte: isSet(object.lte) ? globalThis.Number(object.lte) : undefined,
      gt: isSet(object.gt) ? globalThis.Number(object.gt) : undefined,
      gte: isSet(object.gte) ? globalThis.Number(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: UInt32Rules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = Math.round(message.const);
    }
    if (message.lt !== undefined) {
      obj.lt = Math.round(message.lt);
    }
    if (message.lte !== undefined) {
      obj.lte = Math.round(message.lte);
    }
    if (message.gt !== undefined) {
      obj.gt = Math.round(message.gt);
    }
    if (message.gte !== undefined) {
      obj.gte = Math.round(message.gte);
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => Math.round(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UInt32Rules>, I>>(base?: I): UInt32Rules {
    return UInt32Rules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UInt32Rules>, I>>(
    object: I,
  ): UInt32Rules {
    const message = createBaseUInt32Rules();
    message.const = object.const ?? 0;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseUInt64Rules(): UInt64Rules {
  return {
    const: 0,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    example: [],
  };
}

export const UInt64Rules = {
  encode(
    message: UInt64Rules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(8).uint64(message.const);
    }
    if (message.lt !== undefined) {
      writer.uint32(16).uint64(message.lt);
    }
    if (message.lte !== undefined) {
      writer.uint32(24).uint64(message.lte);
    }
    if (message.gt !== undefined) {
      writer.uint32(32).uint64(message.gt);
    }
    if (message.gte !== undefined) {
      writer.uint32(40).uint64(message.gte);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(50).fork();
      for (const v of message.in) {
        writer.uint64(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(58).fork();
      for (const v of message.notIn) {
        writer.uint64(v);
      }
      writer.ldelim();
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(66).fork();
      for (const v of message.example) {
        writer.uint64(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UInt64Rules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUInt64Rules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.const = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.lt = longToNumber(reader.uint64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.lte = longToNumber(reader.uint64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.gt = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.gte = longToNumber(reader.uint64() as Long);
          continue;
        case 6:
          if (tag === 48) {
            message.in!.push(longToNumber(reader.uint64() as Long));

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(longToNumber(reader.uint64() as Long));
            }

            continue;
          }

          break;
        case 7:
          if (tag === 56) {
            message.notIn!.push(longToNumber(reader.uint64() as Long));

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(longToNumber(reader.uint64() as Long));
            }

            continue;
          }

          break;
        case 8:
          if (tag === 64) {
            message.example!.push(longToNumber(reader.uint64() as Long));

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(longToNumber(reader.uint64() as Long));
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UInt64Rules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      lt: isSet(object.lt) ? globalThis.Number(object.lt) : undefined,
      lte: isSet(object.lte) ? globalThis.Number(object.lte) : undefined,
      gt: isSet(object.gt) ? globalThis.Number(object.gt) : undefined,
      gte: isSet(object.gte) ? globalThis.Number(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: UInt64Rules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = Math.round(message.const);
    }
    if (message.lt !== undefined) {
      obj.lt = Math.round(message.lt);
    }
    if (message.lte !== undefined) {
      obj.lte = Math.round(message.lte);
    }
    if (message.gt !== undefined) {
      obj.gt = Math.round(message.gt);
    }
    if (message.gte !== undefined) {
      obj.gte = Math.round(message.gte);
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => Math.round(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UInt64Rules>, I>>(base?: I): UInt64Rules {
    return UInt64Rules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UInt64Rules>, I>>(
    object: I,
  ): UInt64Rules {
    const message = createBaseUInt64Rules();
    message.const = object.const ?? 0;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseSInt32Rules(): SInt32Rules {
  return {
    const: 0,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    example: [],
  };
}

export const SInt32Rules = {
  encode(
    message: SInt32Rules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(8).sint32(message.const);
    }
    if (message.lt !== undefined) {
      writer.uint32(16).sint32(message.lt);
    }
    if (message.lte !== undefined) {
      writer.uint32(24).sint32(message.lte);
    }
    if (message.gt !== undefined) {
      writer.uint32(32).sint32(message.gt);
    }
    if (message.gte !== undefined) {
      writer.uint32(40).sint32(message.gte);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(50).fork();
      for (const v of message.in) {
        writer.sint32(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(58).fork();
      for (const v of message.notIn) {
        writer.sint32(v);
      }
      writer.ldelim();
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(66).fork();
      for (const v of message.example) {
        writer.sint32(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SInt32Rules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSInt32Rules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.const = reader.sint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.lt = reader.sint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.lte = reader.sint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.gt = reader.sint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.gte = reader.sint32();
          continue;
        case 6:
          if (tag === 48) {
            message.in!.push(reader.sint32());

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(reader.sint32());
            }

            continue;
          }

          break;
        case 7:
          if (tag === 56) {
            message.notIn!.push(reader.sint32());

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(reader.sint32());
            }

            continue;
          }

          break;
        case 8:
          if (tag === 64) {
            message.example!.push(reader.sint32());

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(reader.sint32());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SInt32Rules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      lt: isSet(object.lt) ? globalThis.Number(object.lt) : undefined,
      lte: isSet(object.lte) ? globalThis.Number(object.lte) : undefined,
      gt: isSet(object.gt) ? globalThis.Number(object.gt) : undefined,
      gte: isSet(object.gte) ? globalThis.Number(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: SInt32Rules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = Math.round(message.const);
    }
    if (message.lt !== undefined) {
      obj.lt = Math.round(message.lt);
    }
    if (message.lte !== undefined) {
      obj.lte = Math.round(message.lte);
    }
    if (message.gt !== undefined) {
      obj.gt = Math.round(message.gt);
    }
    if (message.gte !== undefined) {
      obj.gte = Math.round(message.gte);
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => Math.round(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SInt32Rules>, I>>(base?: I): SInt32Rules {
    return SInt32Rules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SInt32Rules>, I>>(
    object: I,
  ): SInt32Rules {
    const message = createBaseSInt32Rules();
    message.const = object.const ?? 0;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseSInt64Rules(): SInt64Rules {
  return {
    const: 0,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    example: [],
  };
}

export const SInt64Rules = {
  encode(
    message: SInt64Rules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(8).sint64(message.const);
    }
    if (message.lt !== undefined) {
      writer.uint32(16).sint64(message.lt);
    }
    if (message.lte !== undefined) {
      writer.uint32(24).sint64(message.lte);
    }
    if (message.gt !== undefined) {
      writer.uint32(32).sint64(message.gt);
    }
    if (message.gte !== undefined) {
      writer.uint32(40).sint64(message.gte);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(50).fork();
      for (const v of message.in) {
        writer.sint64(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(58).fork();
      for (const v of message.notIn) {
        writer.sint64(v);
      }
      writer.ldelim();
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(66).fork();
      for (const v of message.example) {
        writer.sint64(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SInt64Rules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSInt64Rules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.const = longToNumber(reader.sint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.lt = longToNumber(reader.sint64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.lte = longToNumber(reader.sint64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.gt = longToNumber(reader.sint64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.gte = longToNumber(reader.sint64() as Long);
          continue;
        case 6:
          if (tag === 48) {
            message.in!.push(longToNumber(reader.sint64() as Long));

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(longToNumber(reader.sint64() as Long));
            }

            continue;
          }

          break;
        case 7:
          if (tag === 56) {
            message.notIn!.push(longToNumber(reader.sint64() as Long));

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(longToNumber(reader.sint64() as Long));
            }

            continue;
          }

          break;
        case 8:
          if (tag === 64) {
            message.example!.push(longToNumber(reader.sint64() as Long));

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(longToNumber(reader.sint64() as Long));
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SInt64Rules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      lt: isSet(object.lt) ? globalThis.Number(object.lt) : undefined,
      lte: isSet(object.lte) ? globalThis.Number(object.lte) : undefined,
      gt: isSet(object.gt) ? globalThis.Number(object.gt) : undefined,
      gte: isSet(object.gte) ? globalThis.Number(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: SInt64Rules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = Math.round(message.const);
    }
    if (message.lt !== undefined) {
      obj.lt = Math.round(message.lt);
    }
    if (message.lte !== undefined) {
      obj.lte = Math.round(message.lte);
    }
    if (message.gt !== undefined) {
      obj.gt = Math.round(message.gt);
    }
    if (message.gte !== undefined) {
      obj.gte = Math.round(message.gte);
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => Math.round(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SInt64Rules>, I>>(base?: I): SInt64Rules {
    return SInt64Rules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SInt64Rules>, I>>(
    object: I,
  ): SInt64Rules {
    const message = createBaseSInt64Rules();
    message.const = object.const ?? 0;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseFixed32Rules(): Fixed32Rules {
  return {
    const: 0,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    example: [],
  };
}

export const Fixed32Rules = {
  encode(
    message: Fixed32Rules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(13).fixed32(message.const);
    }
    if (message.lt !== undefined) {
      writer.uint32(21).fixed32(message.lt);
    }
    if (message.lte !== undefined) {
      writer.uint32(29).fixed32(message.lte);
    }
    if (message.gt !== undefined) {
      writer.uint32(37).fixed32(message.gt);
    }
    if (message.gte !== undefined) {
      writer.uint32(45).fixed32(message.gte);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(50).fork();
      for (const v of message.in) {
        writer.fixed32(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(58).fork();
      for (const v of message.notIn) {
        writer.fixed32(v);
      }
      writer.ldelim();
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(66).fork();
      for (const v of message.example) {
        writer.fixed32(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Fixed32Rules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFixed32Rules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.const = reader.fixed32();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.lt = reader.fixed32();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }

          message.lte = reader.fixed32();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }

          message.gt = reader.fixed32();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }

          message.gte = reader.fixed32();
          continue;
        case 6:
          if (tag === 53) {
            message.in!.push(reader.fixed32());

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(reader.fixed32());
            }

            continue;
          }

          break;
        case 7:
          if (tag === 61) {
            message.notIn!.push(reader.fixed32());

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(reader.fixed32());
            }

            continue;
          }

          break;
        case 8:
          if (tag === 69) {
            message.example!.push(reader.fixed32());

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(reader.fixed32());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Fixed32Rules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      lt: isSet(object.lt) ? globalThis.Number(object.lt) : undefined,
      lte: isSet(object.lte) ? globalThis.Number(object.lte) : undefined,
      gt: isSet(object.gt) ? globalThis.Number(object.gt) : undefined,
      gte: isSet(object.gte) ? globalThis.Number(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: Fixed32Rules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = Math.round(message.const);
    }
    if (message.lt !== undefined) {
      obj.lt = Math.round(message.lt);
    }
    if (message.lte !== undefined) {
      obj.lte = Math.round(message.lte);
    }
    if (message.gt !== undefined) {
      obj.gt = Math.round(message.gt);
    }
    if (message.gte !== undefined) {
      obj.gte = Math.round(message.gte);
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => Math.round(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Fixed32Rules>, I>>(
    base?: I,
  ): Fixed32Rules {
    return Fixed32Rules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Fixed32Rules>, I>>(
    object: I,
  ): Fixed32Rules {
    const message = createBaseFixed32Rules();
    message.const = object.const ?? 0;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseFixed64Rules(): Fixed64Rules {
  return {
    const: 0,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    example: [],
  };
}

export const Fixed64Rules = {
  encode(
    message: Fixed64Rules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(9).fixed64(message.const);
    }
    if (message.lt !== undefined) {
      writer.uint32(17).fixed64(message.lt);
    }
    if (message.lte !== undefined) {
      writer.uint32(25).fixed64(message.lte);
    }
    if (message.gt !== undefined) {
      writer.uint32(33).fixed64(message.gt);
    }
    if (message.gte !== undefined) {
      writer.uint32(41).fixed64(message.gte);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(50).fork();
      for (const v of message.in) {
        writer.fixed64(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(58).fork();
      for (const v of message.notIn) {
        writer.fixed64(v);
      }
      writer.ldelim();
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(66).fork();
      for (const v of message.example) {
        writer.fixed64(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Fixed64Rules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFixed64Rules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 9) {
            break;
          }

          message.const = longToNumber(reader.fixed64() as Long);
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }

          message.lt = longToNumber(reader.fixed64() as Long);
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }

          message.lte = longToNumber(reader.fixed64() as Long);
          continue;
        case 4:
          if (tag !== 33) {
            break;
          }

          message.gt = longToNumber(reader.fixed64() as Long);
          continue;
        case 5:
          if (tag !== 41) {
            break;
          }

          message.gte = longToNumber(reader.fixed64() as Long);
          continue;
        case 6:
          if (tag === 49) {
            message.in!.push(longToNumber(reader.fixed64() as Long));

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(longToNumber(reader.fixed64() as Long));
            }

            continue;
          }

          break;
        case 7:
          if (tag === 57) {
            message.notIn!.push(longToNumber(reader.fixed64() as Long));

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(longToNumber(reader.fixed64() as Long));
            }

            continue;
          }

          break;
        case 8:
          if (tag === 65) {
            message.example!.push(longToNumber(reader.fixed64() as Long));

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(longToNumber(reader.fixed64() as Long));
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Fixed64Rules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      lt: isSet(object.lt) ? globalThis.Number(object.lt) : undefined,
      lte: isSet(object.lte) ? globalThis.Number(object.lte) : undefined,
      gt: isSet(object.gt) ? globalThis.Number(object.gt) : undefined,
      gte: isSet(object.gte) ? globalThis.Number(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: Fixed64Rules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = Math.round(message.const);
    }
    if (message.lt !== undefined) {
      obj.lt = Math.round(message.lt);
    }
    if (message.lte !== undefined) {
      obj.lte = Math.round(message.lte);
    }
    if (message.gt !== undefined) {
      obj.gt = Math.round(message.gt);
    }
    if (message.gte !== undefined) {
      obj.gte = Math.round(message.gte);
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => Math.round(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Fixed64Rules>, I>>(
    base?: I,
  ): Fixed64Rules {
    return Fixed64Rules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Fixed64Rules>, I>>(
    object: I,
  ): Fixed64Rules {
    const message = createBaseFixed64Rules();
    message.const = object.const ?? 0;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseSFixed32Rules(): SFixed32Rules {
  return {
    const: 0,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    example: [],
  };
}

export const SFixed32Rules = {
  encode(
    message: SFixed32Rules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(13).sfixed32(message.const);
    }
    if (message.lt !== undefined) {
      writer.uint32(21).sfixed32(message.lt);
    }
    if (message.lte !== undefined) {
      writer.uint32(29).sfixed32(message.lte);
    }
    if (message.gt !== undefined) {
      writer.uint32(37).sfixed32(message.gt);
    }
    if (message.gte !== undefined) {
      writer.uint32(45).sfixed32(message.gte);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(50).fork();
      for (const v of message.in) {
        writer.sfixed32(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(58).fork();
      for (const v of message.notIn) {
        writer.sfixed32(v);
      }
      writer.ldelim();
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(66).fork();
      for (const v of message.example) {
        writer.sfixed32(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SFixed32Rules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSFixed32Rules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.const = reader.sfixed32();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.lt = reader.sfixed32();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }

          message.lte = reader.sfixed32();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }

          message.gt = reader.sfixed32();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }

          message.gte = reader.sfixed32();
          continue;
        case 6:
          if (tag === 53) {
            message.in!.push(reader.sfixed32());

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(reader.sfixed32());
            }

            continue;
          }

          break;
        case 7:
          if (tag === 61) {
            message.notIn!.push(reader.sfixed32());

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(reader.sfixed32());
            }

            continue;
          }

          break;
        case 8:
          if (tag === 69) {
            message.example!.push(reader.sfixed32());

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(reader.sfixed32());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SFixed32Rules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      lt: isSet(object.lt) ? globalThis.Number(object.lt) : undefined,
      lte: isSet(object.lte) ? globalThis.Number(object.lte) : undefined,
      gt: isSet(object.gt) ? globalThis.Number(object.gt) : undefined,
      gte: isSet(object.gte) ? globalThis.Number(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: SFixed32Rules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = Math.round(message.const);
    }
    if (message.lt !== undefined) {
      obj.lt = Math.round(message.lt);
    }
    if (message.lte !== undefined) {
      obj.lte = Math.round(message.lte);
    }
    if (message.gt !== undefined) {
      obj.gt = Math.round(message.gt);
    }
    if (message.gte !== undefined) {
      obj.gte = Math.round(message.gte);
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => Math.round(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SFixed32Rules>, I>>(
    base?: I,
  ): SFixed32Rules {
    return SFixed32Rules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SFixed32Rules>, I>>(
    object: I,
  ): SFixed32Rules {
    const message = createBaseSFixed32Rules();
    message.const = object.const ?? 0;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseSFixed64Rules(): SFixed64Rules {
  return {
    const: 0,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    example: [],
  };
}

export const SFixed64Rules = {
  encode(
    message: SFixed64Rules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(9).sfixed64(message.const);
    }
    if (message.lt !== undefined) {
      writer.uint32(17).sfixed64(message.lt);
    }
    if (message.lte !== undefined) {
      writer.uint32(25).sfixed64(message.lte);
    }
    if (message.gt !== undefined) {
      writer.uint32(33).sfixed64(message.gt);
    }
    if (message.gte !== undefined) {
      writer.uint32(41).sfixed64(message.gte);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(50).fork();
      for (const v of message.in) {
        writer.sfixed64(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(58).fork();
      for (const v of message.notIn) {
        writer.sfixed64(v);
      }
      writer.ldelim();
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(66).fork();
      for (const v of message.example) {
        writer.sfixed64(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SFixed64Rules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSFixed64Rules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 9) {
            break;
          }

          message.const = longToNumber(reader.sfixed64() as Long);
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }

          message.lt = longToNumber(reader.sfixed64() as Long);
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }

          message.lte = longToNumber(reader.sfixed64() as Long);
          continue;
        case 4:
          if (tag !== 33) {
            break;
          }

          message.gt = longToNumber(reader.sfixed64() as Long);
          continue;
        case 5:
          if (tag !== 41) {
            break;
          }

          message.gte = longToNumber(reader.sfixed64() as Long);
          continue;
        case 6:
          if (tag === 49) {
            message.in!.push(longToNumber(reader.sfixed64() as Long));

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(longToNumber(reader.sfixed64() as Long));
            }

            continue;
          }

          break;
        case 7:
          if (tag === 57) {
            message.notIn!.push(longToNumber(reader.sfixed64() as Long));

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(longToNumber(reader.sfixed64() as Long));
            }

            continue;
          }

          break;
        case 8:
          if (tag === 65) {
            message.example!.push(longToNumber(reader.sfixed64() as Long));

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(longToNumber(reader.sfixed64() as Long));
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SFixed64Rules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      lt: isSet(object.lt) ? globalThis.Number(object.lt) : undefined,
      lte: isSet(object.lte) ? globalThis.Number(object.lte) : undefined,
      gt: isSet(object.gt) ? globalThis.Number(object.gt) : undefined,
      gte: isSet(object.gte) ? globalThis.Number(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: SFixed64Rules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = Math.round(message.const);
    }
    if (message.lt !== undefined) {
      obj.lt = Math.round(message.lt);
    }
    if (message.lte !== undefined) {
      obj.lte = Math.round(message.lte);
    }
    if (message.gt !== undefined) {
      obj.gt = Math.round(message.gt);
    }
    if (message.gte !== undefined) {
      obj.gte = Math.round(message.gte);
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => Math.round(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SFixed64Rules>, I>>(
    base?: I,
  ): SFixed64Rules {
    return SFixed64Rules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SFixed64Rules>, I>>(
    object: I,
  ): SFixed64Rules {
    const message = createBaseSFixed64Rules();
    message.const = object.const ?? 0;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseBoolRules(): BoolRules {
  return { const: false, example: [] };
}

export const BoolRules = {
  encode(
    message: BoolRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const === true) {
      writer.uint32(8).bool(message.const);
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(18).fork();
      for (const v of message.example) {
        writer.bool(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BoolRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBoolRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.const = reader.bool();
          continue;
        case 2:
          if (tag === 16) {
            message.example!.push(reader.bool());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(reader.bool());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BoolRules {
    return {
      const: isSet(object.const) ? globalThis.Boolean(object.const) : false,
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Boolean(e))
        : [],
    };
  },

  toJSON(message: BoolRules): unknown {
    const obj: any = {};
    if (message.const === true) {
      obj.const = message.const;
    }
    if (message.example?.length) {
      obj.example = message.example;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BoolRules>, I>>(base?: I): BoolRules {
    return BoolRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BoolRules>, I>>(
    object: I,
  ): BoolRules {
    const message = createBaseBoolRules();
    message.const = object.const ?? false;
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseStringRules(): StringRules {
  return {
    const: "",
    len: 0,
    minLen: 0,
    maxLen: 0,
    lenBytes: 0,
    minBytes: 0,
    maxBytes: 0,
    pattern: "",
    prefix: "",
    suffix: "",
    contains: "",
    notContains: "",
    in: [],
    notIn: [],
    email: undefined,
    hostname: undefined,
    ip: undefined,
    ipv4: undefined,
    ipv6: undefined,
    uri: undefined,
    uriRef: undefined,
    address: undefined,
    uuid: undefined,
    tuuid: undefined,
    ipWithPrefixlen: undefined,
    ipv4WithPrefixlen: undefined,
    ipv6WithPrefixlen: undefined,
    ipPrefix: undefined,
    ipv4Prefix: undefined,
    ipv6Prefix: undefined,
    hostAndPort: undefined,
    wellKnownRegex: undefined,
    strict: false,
    example: [],
  };
}

export const StringRules = {
  encode(
    message: StringRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== "") {
      writer.uint32(10).string(message.const);
    }
    if (message.len !== undefined && message.len !== 0) {
      writer.uint32(152).uint64(message.len);
    }
    if (message.minLen !== undefined && message.minLen !== 0) {
      writer.uint32(16).uint64(message.minLen);
    }
    if (message.maxLen !== undefined && message.maxLen !== 0) {
      writer.uint32(24).uint64(message.maxLen);
    }
    if (message.lenBytes !== undefined && message.lenBytes !== 0) {
      writer.uint32(160).uint64(message.lenBytes);
    }
    if (message.minBytes !== undefined && message.minBytes !== 0) {
      writer.uint32(32).uint64(message.minBytes);
    }
    if (message.maxBytes !== undefined && message.maxBytes !== 0) {
      writer.uint32(40).uint64(message.maxBytes);
    }
    if (message.pattern !== undefined && message.pattern !== "") {
      writer.uint32(50).string(message.pattern);
    }
    if (message.prefix !== undefined && message.prefix !== "") {
      writer.uint32(58).string(message.prefix);
    }
    if (message.suffix !== undefined && message.suffix !== "") {
      writer.uint32(66).string(message.suffix);
    }
    if (message.contains !== undefined && message.contains !== "") {
      writer.uint32(74).string(message.contains);
    }
    if (message.notContains !== undefined && message.notContains !== "") {
      writer.uint32(186).string(message.notContains);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      for (const v of message.in) {
        writer.uint32(82).string(v!);
      }
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      for (const v of message.notIn) {
        writer.uint32(90).string(v!);
      }
    }
    if (message.email !== undefined) {
      writer.uint32(96).bool(message.email);
    }
    if (message.hostname !== undefined) {
      writer.uint32(104).bool(message.hostname);
    }
    if (message.ip !== undefined) {
      writer.uint32(112).bool(message.ip);
    }
    if (message.ipv4 !== undefined) {
      writer.uint32(120).bool(message.ipv4);
    }
    if (message.ipv6 !== undefined) {
      writer.uint32(128).bool(message.ipv6);
    }
    if (message.uri !== undefined) {
      writer.uint32(136).bool(message.uri);
    }
    if (message.uriRef !== undefined) {
      writer.uint32(144).bool(message.uriRef);
    }
    if (message.address !== undefined) {
      writer.uint32(168).bool(message.address);
    }
    if (message.uuid !== undefined) {
      writer.uint32(176).bool(message.uuid);
    }
    if (message.tuuid !== undefined) {
      writer.uint32(264).bool(message.tuuid);
    }
    if (message.ipWithPrefixlen !== undefined) {
      writer.uint32(208).bool(message.ipWithPrefixlen);
    }
    if (message.ipv4WithPrefixlen !== undefined) {
      writer.uint32(216).bool(message.ipv4WithPrefixlen);
    }
    if (message.ipv6WithPrefixlen !== undefined) {
      writer.uint32(224).bool(message.ipv6WithPrefixlen);
    }
    if (message.ipPrefix !== undefined) {
      writer.uint32(232).bool(message.ipPrefix);
    }
    if (message.ipv4Prefix !== undefined) {
      writer.uint32(240).bool(message.ipv4Prefix);
    }
    if (message.ipv6Prefix !== undefined) {
      writer.uint32(248).bool(message.ipv6Prefix);
    }
    if (message.hostAndPort !== undefined) {
      writer.uint32(256).bool(message.hostAndPort);
    }
    if (message.wellKnownRegex !== undefined) {
      writer.uint32(192).int32(message.wellKnownRegex);
    }
    if (message.strict === true) {
      writer.uint32(200).bool(message.strict);
    }
    if (message.example !== undefined && message.example.length !== 0) {
      for (const v of message.example) {
        writer.uint32(274).string(v!);
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StringRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStringRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.const = reader.string();
          continue;
        case 19:
          if (tag !== 152) {
            break;
          }

          message.len = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.minLen = longToNumber(reader.uint64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.maxLen = longToNumber(reader.uint64() as Long);
          continue;
        case 20:
          if (tag !== 160) {
            break;
          }

          message.lenBytes = longToNumber(reader.uint64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.minBytes = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.maxBytes = longToNumber(reader.uint64() as Long);
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.pattern = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.prefix = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.suffix = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.contains = reader.string();
          continue;
        case 23:
          if (tag !== 186) {
            break;
          }

          message.notContains = reader.string();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.in!.push(reader.string());
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.notIn!.push(reader.string());
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.email = reader.bool();
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.hostname = reader.bool();
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }

          message.ip = reader.bool();
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }

          message.ipv4 = reader.bool();
          continue;
        case 16:
          if (tag !== 128) {
            break;
          }

          message.ipv6 = reader.bool();
          continue;
        case 17:
          if (tag !== 136) {
            break;
          }

          message.uri = reader.bool();
          continue;
        case 18:
          if (tag !== 144) {
            break;
          }

          message.uriRef = reader.bool();
          continue;
        case 21:
          if (tag !== 168) {
            break;
          }

          message.address = reader.bool();
          continue;
        case 22:
          if (tag !== 176) {
            break;
          }

          message.uuid = reader.bool();
          continue;
        case 33:
          if (tag !== 264) {
            break;
          }

          message.tuuid = reader.bool();
          continue;
        case 26:
          if (tag !== 208) {
            break;
          }

          message.ipWithPrefixlen = reader.bool();
          continue;
        case 27:
          if (tag !== 216) {
            break;
          }

          message.ipv4WithPrefixlen = reader.bool();
          continue;
        case 28:
          if (tag !== 224) {
            break;
          }

          message.ipv6WithPrefixlen = reader.bool();
          continue;
        case 29:
          if (tag !== 232) {
            break;
          }

          message.ipPrefix = reader.bool();
          continue;
        case 30:
          if (tag !== 240) {
            break;
          }

          message.ipv4Prefix = reader.bool();
          continue;
        case 31:
          if (tag !== 248) {
            break;
          }

          message.ipv6Prefix = reader.bool();
          continue;
        case 32:
          if (tag !== 256) {
            break;
          }

          message.hostAndPort = reader.bool();
          continue;
        case 24:
          if (tag !== 192) {
            break;
          }

          message.wellKnownRegex = reader.int32() as any;
          continue;
        case 25:
          if (tag !== 200) {
            break;
          }

          message.strict = reader.bool();
          continue;
        case 34:
          if (tag !== 274) {
            break;
          }

          message.example!.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StringRules {
    return {
      const: isSet(object.const) ? globalThis.String(object.const) : "",
      len: isSet(object.len) ? globalThis.Number(object.len) : 0,
      minLen: isSet(object.minLen) ? globalThis.Number(object.minLen) : 0,
      maxLen: isSet(object.maxLen) ? globalThis.Number(object.maxLen) : 0,
      lenBytes: isSet(object.lenBytes) ? globalThis.Number(object.lenBytes) : 0,
      minBytes: isSet(object.minBytes) ? globalThis.Number(object.minBytes) : 0,
      maxBytes: isSet(object.maxBytes) ? globalThis.Number(object.maxBytes) : 0,
      pattern: isSet(object.pattern) ? globalThis.String(object.pattern) : "",
      prefix: isSet(object.prefix) ? globalThis.String(object.prefix) : "",
      suffix: isSet(object.suffix) ? globalThis.String(object.suffix) : "",
      contains: isSet(object.contains)
        ? globalThis.String(object.contains)
        : "",
      notContains: isSet(object.notContains)
        ? globalThis.String(object.notContains)
        : "",
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.String(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.String(e))
        : [],
      email: isSet(object.email) ? globalThis.Boolean(object.email) : undefined,
      hostname: isSet(object.hostname)
        ? globalThis.Boolean(object.hostname)
        : undefined,
      ip: isSet(object.ip) ? globalThis.Boolean(object.ip) : undefined,
      ipv4: isSet(object.ipv4) ? globalThis.Boolean(object.ipv4) : undefined,
      ipv6: isSet(object.ipv6) ? globalThis.Boolean(object.ipv6) : undefined,
      uri: isSet(object.uri) ? globalThis.Boolean(object.uri) : undefined,
      uriRef: isSet(object.uriRef)
        ? globalThis.Boolean(object.uriRef)
        : undefined,
      address: isSet(object.address)
        ? globalThis.Boolean(object.address)
        : undefined,
      uuid: isSet(object.uuid) ? globalThis.Boolean(object.uuid) : undefined,
      tuuid: isSet(object.tuuid) ? globalThis.Boolean(object.tuuid) : undefined,
      ipWithPrefixlen: isSet(object.ipWithPrefixlen)
        ? globalThis.Boolean(object.ipWithPrefixlen)
        : undefined,
      ipv4WithPrefixlen: isSet(object.ipv4WithPrefixlen)
        ? globalThis.Boolean(object.ipv4WithPrefixlen)
        : undefined,
      ipv6WithPrefixlen: isSet(object.ipv6WithPrefixlen)
        ? globalThis.Boolean(object.ipv6WithPrefixlen)
        : undefined,
      ipPrefix: isSet(object.ipPrefix)
        ? globalThis.Boolean(object.ipPrefix)
        : undefined,
      ipv4Prefix: isSet(object.ipv4Prefix)
        ? globalThis.Boolean(object.ipv4Prefix)
        : undefined,
      ipv6Prefix: isSet(object.ipv6Prefix)
        ? globalThis.Boolean(object.ipv6Prefix)
        : undefined,
      hostAndPort: isSet(object.hostAndPort)
        ? globalThis.Boolean(object.hostAndPort)
        : undefined,
      wellKnownRegex: isSet(object.wellKnownRegex)
        ? knownRegexFromJSON(object.wellKnownRegex)
        : undefined,
      strict: isSet(object.strict) ? globalThis.Boolean(object.strict) : false,
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: StringRules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== "") {
      obj.const = message.const;
    }
    if (message.len !== undefined && message.len !== 0) {
      obj.len = Math.round(message.len);
    }
    if (message.minLen !== undefined && message.minLen !== 0) {
      obj.minLen = Math.round(message.minLen);
    }
    if (message.maxLen !== undefined && message.maxLen !== 0) {
      obj.maxLen = Math.round(message.maxLen);
    }
    if (message.lenBytes !== undefined && message.lenBytes !== 0) {
      obj.lenBytes = Math.round(message.lenBytes);
    }
    if (message.minBytes !== undefined && message.minBytes !== 0) {
      obj.minBytes = Math.round(message.minBytes);
    }
    if (message.maxBytes !== undefined && message.maxBytes !== 0) {
      obj.maxBytes = Math.round(message.maxBytes);
    }
    if (message.pattern !== undefined && message.pattern !== "") {
      obj.pattern = message.pattern;
    }
    if (message.prefix !== undefined && message.prefix !== "") {
      obj.prefix = message.prefix;
    }
    if (message.suffix !== undefined && message.suffix !== "") {
      obj.suffix = message.suffix;
    }
    if (message.contains !== undefined && message.contains !== "") {
      obj.contains = message.contains;
    }
    if (message.notContains !== undefined && message.notContains !== "") {
      obj.notContains = message.notContains;
    }
    if (message.in?.length) {
      obj.in = message.in;
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn;
    }
    if (message.email !== undefined) {
      obj.email = message.email;
    }
    if (message.hostname !== undefined) {
      obj.hostname = message.hostname;
    }
    if (message.ip !== undefined) {
      obj.ip = message.ip;
    }
    if (message.ipv4 !== undefined) {
      obj.ipv4 = message.ipv4;
    }
    if (message.ipv6 !== undefined) {
      obj.ipv6 = message.ipv6;
    }
    if (message.uri !== undefined) {
      obj.uri = message.uri;
    }
    if (message.uriRef !== undefined) {
      obj.uriRef = message.uriRef;
    }
    if (message.address !== undefined) {
      obj.address = message.address;
    }
    if (message.uuid !== undefined) {
      obj.uuid = message.uuid;
    }
    if (message.tuuid !== undefined) {
      obj.tuuid = message.tuuid;
    }
    if (message.ipWithPrefixlen !== undefined) {
      obj.ipWithPrefixlen = message.ipWithPrefixlen;
    }
    if (message.ipv4WithPrefixlen !== undefined) {
      obj.ipv4WithPrefixlen = message.ipv4WithPrefixlen;
    }
    if (message.ipv6WithPrefixlen !== undefined) {
      obj.ipv6WithPrefixlen = message.ipv6WithPrefixlen;
    }
    if (message.ipPrefix !== undefined) {
      obj.ipPrefix = message.ipPrefix;
    }
    if (message.ipv4Prefix !== undefined) {
      obj.ipv4Prefix = message.ipv4Prefix;
    }
    if (message.ipv6Prefix !== undefined) {
      obj.ipv6Prefix = message.ipv6Prefix;
    }
    if (message.hostAndPort !== undefined) {
      obj.hostAndPort = message.hostAndPort;
    }
    if (message.wellKnownRegex !== undefined) {
      obj.wellKnownRegex = knownRegexToJSON(message.wellKnownRegex);
    }
    if (message.strict === true) {
      obj.strict = message.strict;
    }
    if (message.example?.length) {
      obj.example = message.example;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StringRules>, I>>(base?: I): StringRules {
    return StringRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StringRules>, I>>(
    object: I,
  ): StringRules {
    const message = createBaseStringRules();
    message.const = object.const ?? "";
    message.len = object.len ?? 0;
    message.minLen = object.minLen ?? 0;
    message.maxLen = object.maxLen ?? 0;
    message.lenBytes = object.lenBytes ?? 0;
    message.minBytes = object.minBytes ?? 0;
    message.maxBytes = object.maxBytes ?? 0;
    message.pattern = object.pattern ?? "";
    message.prefix = object.prefix ?? "";
    message.suffix = object.suffix ?? "";
    message.contains = object.contains ?? "";
    message.notContains = object.notContains ?? "";
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.email = object.email ?? undefined;
    message.hostname = object.hostname ?? undefined;
    message.ip = object.ip ?? undefined;
    message.ipv4 = object.ipv4 ?? undefined;
    message.ipv6 = object.ipv6 ?? undefined;
    message.uri = object.uri ?? undefined;
    message.uriRef = object.uriRef ?? undefined;
    message.address = object.address ?? undefined;
    message.uuid = object.uuid ?? undefined;
    message.tuuid = object.tuuid ?? undefined;
    message.ipWithPrefixlen = object.ipWithPrefixlen ?? undefined;
    message.ipv4WithPrefixlen = object.ipv4WithPrefixlen ?? undefined;
    message.ipv6WithPrefixlen = object.ipv6WithPrefixlen ?? undefined;
    message.ipPrefix = object.ipPrefix ?? undefined;
    message.ipv4Prefix = object.ipv4Prefix ?? undefined;
    message.ipv6Prefix = object.ipv6Prefix ?? undefined;
    message.hostAndPort = object.hostAndPort ?? undefined;
    message.wellKnownRegex = object.wellKnownRegex ?? undefined;
    message.strict = object.strict ?? false;
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseBytesRules(): BytesRules {
  return {
    const: Buffer.alloc(0),
    len: 0,
    minLen: 0,
    maxLen: 0,
    pattern: "",
    prefix: Buffer.alloc(0),
    suffix: Buffer.alloc(0),
    contains: Buffer.alloc(0),
    in: [],
    notIn: [],
    ip: undefined,
    ipv4: undefined,
    ipv6: undefined,
    example: [],
  };
}

export const BytesRules = {
  encode(
    message: BytesRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const.length !== 0) {
      writer.uint32(10).bytes(message.const);
    }
    if (message.len !== undefined && message.len !== 0) {
      writer.uint32(104).uint64(message.len);
    }
    if (message.minLen !== undefined && message.minLen !== 0) {
      writer.uint32(16).uint64(message.minLen);
    }
    if (message.maxLen !== undefined && message.maxLen !== 0) {
      writer.uint32(24).uint64(message.maxLen);
    }
    if (message.pattern !== undefined && message.pattern !== "") {
      writer.uint32(34).string(message.pattern);
    }
    if (message.prefix !== undefined && message.prefix.length !== 0) {
      writer.uint32(42).bytes(message.prefix);
    }
    if (message.suffix !== undefined && message.suffix.length !== 0) {
      writer.uint32(50).bytes(message.suffix);
    }
    if (message.contains !== undefined && message.contains.length !== 0) {
      writer.uint32(58).bytes(message.contains);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      for (const v of message.in) {
        writer.uint32(66).bytes(v!);
      }
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      for (const v of message.notIn) {
        writer.uint32(74).bytes(v!);
      }
    }
    if (message.ip !== undefined) {
      writer.uint32(80).bool(message.ip);
    }
    if (message.ipv4 !== undefined) {
      writer.uint32(88).bool(message.ipv4);
    }
    if (message.ipv6 !== undefined) {
      writer.uint32(96).bool(message.ipv6);
    }
    if (message.example !== undefined && message.example.length !== 0) {
      for (const v of message.example) {
        writer.uint32(114).bytes(v!);
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BytesRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBytesRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.const = reader.bytes() as Buffer;
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.len = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.minLen = longToNumber(reader.uint64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.maxLen = longToNumber(reader.uint64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.pattern = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.prefix = reader.bytes() as Buffer;
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.suffix = reader.bytes() as Buffer;
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.contains = reader.bytes() as Buffer;
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.in!.push(reader.bytes() as Buffer);
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.notIn!.push(reader.bytes() as Buffer);
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.ip = reader.bool();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.ipv4 = reader.bool();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.ipv6 = reader.bool();
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.example!.push(reader.bytes() as Buffer);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BytesRules {
    return {
      const: isSet(object.const)
        ? Buffer.from(bytesFromBase64(object.const))
        : Buffer.alloc(0),
      len: isSet(object.len) ? globalThis.Number(object.len) : 0,
      minLen: isSet(object.minLen) ? globalThis.Number(object.minLen) : 0,
      maxLen: isSet(object.maxLen) ? globalThis.Number(object.maxLen) : 0,
      pattern: isSet(object.pattern) ? globalThis.String(object.pattern) : "",
      prefix: isSet(object.prefix)
        ? Buffer.from(bytesFromBase64(object.prefix))
        : Buffer.alloc(0),
      suffix: isSet(object.suffix)
        ? Buffer.from(bytesFromBase64(object.suffix))
        : Buffer.alloc(0),
      contains: isSet(object.contains)
        ? Buffer.from(bytesFromBase64(object.contains))
        : Buffer.alloc(0),
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => Buffer.from(bytesFromBase64(e)))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Buffer.from(bytesFromBase64(e)))
        : [],
      ip: isSet(object.ip) ? globalThis.Boolean(object.ip) : undefined,
      ipv4: isSet(object.ipv4) ? globalThis.Boolean(object.ipv4) : undefined,
      ipv6: isSet(object.ipv6) ? globalThis.Boolean(object.ipv6) : undefined,
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => Buffer.from(bytesFromBase64(e)))
        : [],
    };
  },

  toJSON(message: BytesRules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const.length !== 0) {
      obj.const = base64FromBytes(message.const);
    }
    if (message.len !== undefined && message.len !== 0) {
      obj.len = Math.round(message.len);
    }
    if (message.minLen !== undefined && message.minLen !== 0) {
      obj.minLen = Math.round(message.minLen);
    }
    if (message.maxLen !== undefined && message.maxLen !== 0) {
      obj.maxLen = Math.round(message.maxLen);
    }
    if (message.pattern !== undefined && message.pattern !== "") {
      obj.pattern = message.pattern;
    }
    if (message.prefix !== undefined && message.prefix.length !== 0) {
      obj.prefix = base64FromBytes(message.prefix);
    }
    if (message.suffix !== undefined && message.suffix.length !== 0) {
      obj.suffix = base64FromBytes(message.suffix);
    }
    if (message.contains !== undefined && message.contains.length !== 0) {
      obj.contains = base64FromBytes(message.contains);
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => base64FromBytes(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => base64FromBytes(e));
    }
    if (message.ip !== undefined) {
      obj.ip = message.ip;
    }
    if (message.ipv4 !== undefined) {
      obj.ipv4 = message.ipv4;
    }
    if (message.ipv6 !== undefined) {
      obj.ipv6 = message.ipv6;
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => base64FromBytes(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BytesRules>, I>>(base?: I): BytesRules {
    return BytesRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BytesRules>, I>>(
    object: I,
  ): BytesRules {
    const message = createBaseBytesRules();
    message.const = object.const ?? Buffer.alloc(0);
    message.len = object.len ?? 0;
    message.minLen = object.minLen ?? 0;
    message.maxLen = object.maxLen ?? 0;
    message.pattern = object.pattern ?? "";
    message.prefix = object.prefix ?? Buffer.alloc(0);
    message.suffix = object.suffix ?? Buffer.alloc(0);
    message.contains = object.contains ?? Buffer.alloc(0);
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ip = object.ip ?? undefined;
    message.ipv4 = object.ipv4 ?? undefined;
    message.ipv6 = object.ipv6 ?? undefined;
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseEnumRules(): EnumRules {
  return { const: 0, definedOnly: false, in: [], notIn: [], example: [] };
}

export const EnumRules = {
  encode(
    message: EnumRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined && message.const !== 0) {
      writer.uint32(8).int32(message.const);
    }
    if (message.definedOnly === true) {
      writer.uint32(16).bool(message.definedOnly);
    }
    if (message.in !== undefined && message.in.length !== 0) {
      writer.uint32(26).fork();
      for (const v of message.in) {
        writer.int32(v);
      }
      writer.ldelim();
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      writer.uint32(34).fork();
      for (const v of message.notIn) {
        writer.int32(v);
      }
      writer.ldelim();
    }
    if (message.example !== undefined && message.example.length !== 0) {
      writer.uint32(42).fork();
      for (const v of message.example) {
        writer.int32(v);
      }
      writer.ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EnumRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEnumRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.const = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.definedOnly = reader.bool();
          continue;
        case 3:
          if (tag === 24) {
            message.in!.push(reader.int32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.in!.push(reader.int32());
            }

            continue;
          }

          break;
        case 4:
          if (tag === 32) {
            message.notIn!.push(reader.int32());

            continue;
          }

          if (tag === 34) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.notIn!.push(reader.int32());
            }

            continue;
          }

          break;
        case 5:
          if (tag === 40) {
            message.example!.push(reader.int32());

            continue;
          }

          if (tag === 42) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.example!.push(reader.int32());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EnumRules {
    return {
      const: isSet(object.const) ? globalThis.Number(object.const) : 0,
      definedOnly: isSet(object.definedOnly)
        ? globalThis.Boolean(object.definedOnly)
        : false,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.Number(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.Number(e))
        : [],
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: EnumRules): unknown {
    const obj: any = {};
    if (message.const !== undefined && message.const !== 0) {
      obj.const = Math.round(message.const);
    }
    if (message.definedOnly === true) {
      obj.definedOnly = message.definedOnly;
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => Math.round(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EnumRules>, I>>(base?: I): EnumRules {
    return EnumRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EnumRules>, I>>(
    object: I,
  ): EnumRules {
    const message = createBaseEnumRules();
    message.const = object.const ?? 0;
    message.definedOnly = object.definedOnly ?? false;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseRepeatedRules(): RepeatedRules {
  return { minItems: 0, maxItems: 0, unique: false, items: undefined };
}

export const RepeatedRules = {
  encode(
    message: RepeatedRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.minItems !== undefined && message.minItems !== 0) {
      writer.uint32(8).uint64(message.minItems);
    }
    if (message.maxItems !== undefined && message.maxItems !== 0) {
      writer.uint32(16).uint64(message.maxItems);
    }
    if (message.unique === true) {
      writer.uint32(24).bool(message.unique);
    }
    if (message.items !== undefined) {
      FieldRules.encode(message.items, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RepeatedRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRepeatedRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.minItems = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.maxItems = longToNumber(reader.uint64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.unique = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.items = FieldRules.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RepeatedRules {
    return {
      minItems: isSet(object.minItems) ? globalThis.Number(object.minItems) : 0,
      maxItems: isSet(object.maxItems) ? globalThis.Number(object.maxItems) : 0,
      unique: isSet(object.unique) ? globalThis.Boolean(object.unique) : false,
      items: isSet(object.items)
        ? FieldRules.fromJSON(object.items)
        : undefined,
    };
  },

  toJSON(message: RepeatedRules): unknown {
    const obj: any = {};
    if (message.minItems !== undefined && message.minItems !== 0) {
      obj.minItems = Math.round(message.minItems);
    }
    if (message.maxItems !== undefined && message.maxItems !== 0) {
      obj.maxItems = Math.round(message.maxItems);
    }
    if (message.unique === true) {
      obj.unique = message.unique;
    }
    if (message.items !== undefined) {
      obj.items = FieldRules.toJSON(message.items);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RepeatedRules>, I>>(
    base?: I,
  ): RepeatedRules {
    return RepeatedRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RepeatedRules>, I>>(
    object: I,
  ): RepeatedRules {
    const message = createBaseRepeatedRules();
    message.minItems = object.minItems ?? 0;
    message.maxItems = object.maxItems ?? 0;
    message.unique = object.unique ?? false;
    message.items =
      object.items !== undefined && object.items !== null
        ? FieldRules.fromPartial(object.items)
        : undefined;
    return message;
  },
};

function createBaseMapRules(): MapRules {
  return { minPairs: 0, maxPairs: 0, keys: undefined, values: undefined };
}

export const MapRules = {
  encode(
    message: MapRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.minPairs !== undefined && message.minPairs !== 0) {
      writer.uint32(8).uint64(message.minPairs);
    }
    if (message.maxPairs !== undefined && message.maxPairs !== 0) {
      writer.uint32(16).uint64(message.maxPairs);
    }
    if (message.keys !== undefined) {
      FieldRules.encode(message.keys, writer.uint32(34).fork()).ldelim();
    }
    if (message.values !== undefined) {
      FieldRules.encode(message.values, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MapRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMapRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.minPairs = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.maxPairs = longToNumber(reader.uint64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.keys = FieldRules.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.values = FieldRules.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MapRules {
    return {
      minPairs: isSet(object.minPairs) ? globalThis.Number(object.minPairs) : 0,
      maxPairs: isSet(object.maxPairs) ? globalThis.Number(object.maxPairs) : 0,
      keys: isSet(object.keys) ? FieldRules.fromJSON(object.keys) : undefined,
      values: isSet(object.values)
        ? FieldRules.fromJSON(object.values)
        : undefined,
    };
  },

  toJSON(message: MapRules): unknown {
    const obj: any = {};
    if (message.minPairs !== undefined && message.minPairs !== 0) {
      obj.minPairs = Math.round(message.minPairs);
    }
    if (message.maxPairs !== undefined && message.maxPairs !== 0) {
      obj.maxPairs = Math.round(message.maxPairs);
    }
    if (message.keys !== undefined) {
      obj.keys = FieldRules.toJSON(message.keys);
    }
    if (message.values !== undefined) {
      obj.values = FieldRules.toJSON(message.values);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MapRules>, I>>(base?: I): MapRules {
    return MapRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MapRules>, I>>(object: I): MapRules {
    const message = createBaseMapRules();
    message.minPairs = object.minPairs ?? 0;
    message.maxPairs = object.maxPairs ?? 0;
    message.keys =
      object.keys !== undefined && object.keys !== null
        ? FieldRules.fromPartial(object.keys)
        : undefined;
    message.values =
      object.values !== undefined && object.values !== null
        ? FieldRules.fromPartial(object.values)
        : undefined;
    return message;
  },
};

function createBaseAnyRules(): AnyRules {
  return { in: [], notIn: [] };
}

export const AnyRules = {
  encode(
    message: AnyRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.in !== undefined && message.in.length !== 0) {
      for (const v of message.in) {
        writer.uint32(18).string(v!);
      }
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      for (const v of message.notIn) {
        writer.uint32(26).string(v!);
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AnyRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAnyRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.in!.push(reader.string());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.notIn!.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AnyRules {
    return {
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => globalThis.String(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: AnyRules): unknown {
    const obj: any = {};
    if (message.in?.length) {
      obj.in = message.in;
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AnyRules>, I>>(base?: I): AnyRules {
    return AnyRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AnyRules>, I>>(object: I): AnyRules {
    const message = createBaseAnyRules();
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    return message;
  },
};

function createBaseDurationRules(): DurationRules {
  return {
    const: undefined,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
    example: [],
  };
}

export const DurationRules = {
  encode(
    message: DurationRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined) {
      Duration.encode(message.const, writer.uint32(18).fork()).ldelim();
    }
    if (message.lt !== undefined) {
      Duration.encode(message.lt, writer.uint32(26).fork()).ldelim();
    }
    if (message.lte !== undefined) {
      Duration.encode(message.lte, writer.uint32(34).fork()).ldelim();
    }
    if (message.gt !== undefined) {
      Duration.encode(message.gt, writer.uint32(42).fork()).ldelim();
    }
    if (message.gte !== undefined) {
      Duration.encode(message.gte, writer.uint32(50).fork()).ldelim();
    }
    if (message.in !== undefined && message.in.length !== 0) {
      for (const v of message.in) {
        Duration.encode(v!, writer.uint32(58).fork()).ldelim();
      }
    }
    if (message.notIn !== undefined && message.notIn.length !== 0) {
      for (const v of message.notIn) {
        Duration.encode(v!, writer.uint32(66).fork()).ldelim();
      }
    }
    if (message.example !== undefined && message.example.length !== 0) {
      for (const v of message.example) {
        Duration.encode(v!, writer.uint32(74).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DurationRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDurationRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.const = Duration.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.lt = Duration.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.lte = Duration.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.gt = Duration.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.gte = Duration.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.in!.push(Duration.decode(reader, reader.uint32()));
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.notIn!.push(Duration.decode(reader, reader.uint32()));
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.example!.push(Duration.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DurationRules {
    return {
      const: isSet(object.const) ? Duration.fromJSON(object.const) : undefined,
      lt: isSet(object.lt) ? Duration.fromJSON(object.lt) : undefined,
      lte: isSet(object.lte) ? Duration.fromJSON(object.lte) : undefined,
      gt: isSet(object.gt) ? Duration.fromJSON(object.gt) : undefined,
      gte: isSet(object.gte) ? Duration.fromJSON(object.gte) : undefined,
      in: globalThis.Array.isArray(object?.in)
        ? object.in.map((e: any) => Duration.fromJSON(e))
        : [],
      notIn: globalThis.Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Duration.fromJSON(e))
        : [],
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => Duration.fromJSON(e))
        : [],
    };
  },

  toJSON(message: DurationRules): unknown {
    const obj: any = {};
    if (message.const !== undefined) {
      obj.const = Duration.toJSON(message.const);
    }
    if (message.lt !== undefined) {
      obj.lt = Duration.toJSON(message.lt);
    }
    if (message.lte !== undefined) {
      obj.lte = Duration.toJSON(message.lte);
    }
    if (message.gt !== undefined) {
      obj.gt = Duration.toJSON(message.gt);
    }
    if (message.gte !== undefined) {
      obj.gte = Duration.toJSON(message.gte);
    }
    if (message.in?.length) {
      obj.in = message.in.map((e) => Duration.toJSON(e));
    }
    if (message.notIn?.length) {
      obj.notIn = message.notIn.map((e) => Duration.toJSON(e));
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => Duration.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DurationRules>, I>>(
    base?: I,
  ): DurationRules {
    return DurationRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DurationRules>, I>>(
    object: I,
  ): DurationRules {
    const message = createBaseDurationRules();
    message.const =
      object.const !== undefined && object.const !== null
        ? Duration.fromPartial(object.const)
        : undefined;
    message.lt =
      object.lt !== undefined && object.lt !== null
        ? Duration.fromPartial(object.lt)
        : undefined;
    message.lte =
      object.lte !== undefined && object.lte !== null
        ? Duration.fromPartial(object.lte)
        : undefined;
    message.gt =
      object.gt !== undefined && object.gt !== null
        ? Duration.fromPartial(object.gt)
        : undefined;
    message.gte =
      object.gte !== undefined && object.gte !== null
        ? Duration.fromPartial(object.gte)
        : undefined;
    message.in = object.in?.map((e) => Duration.fromPartial(e)) || [];
    message.notIn = object.notIn?.map((e) => Duration.fromPartial(e)) || [];
    message.example = object.example?.map((e) => Duration.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTimestampRules(): TimestampRules {
  return {
    const: undefined,
    lt: undefined,
    lte: undefined,
    ltNow: undefined,
    gt: undefined,
    gte: undefined,
    gtNow: undefined,
    within: undefined,
    example: [],
  };
}

export const TimestampRules = {
  encode(
    message: TimestampRules,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.const !== undefined) {
      Timestamp.encode(
        toTimestamp(message.const),
        writer.uint32(18).fork(),
      ).ldelim();
    }
    if (message.lt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.lt),
        writer.uint32(26).fork(),
      ).ldelim();
    }
    if (message.lte !== undefined) {
      Timestamp.encode(
        toTimestamp(message.lte),
        writer.uint32(34).fork(),
      ).ldelim();
    }
    if (message.ltNow !== undefined) {
      writer.uint32(56).bool(message.ltNow);
    }
    if (message.gt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.gt),
        writer.uint32(42).fork(),
      ).ldelim();
    }
    if (message.gte !== undefined) {
      Timestamp.encode(
        toTimestamp(message.gte),
        writer.uint32(50).fork(),
      ).ldelim();
    }
    if (message.gtNow !== undefined) {
      writer.uint32(64).bool(message.gtNow);
    }
    if (message.within !== undefined) {
      Duration.encode(message.within, writer.uint32(74).fork()).ldelim();
    }
    if (message.example !== undefined && message.example.length !== 0) {
      for (const v of message.example) {
        Timestamp.encode(toTimestamp(v!), writer.uint32(82).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TimestampRules {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimestampRules();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.const = fromTimestamp(
            Timestamp.decode(reader, reader.uint32()),
          );
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.lt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.lte = fromTimestamp(
            Timestamp.decode(reader, reader.uint32()),
          );
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.ltNow = reader.bool();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.gt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.gte = fromTimestamp(
            Timestamp.decode(reader, reader.uint32()),
          );
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.gtNow = reader.bool();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.within = Duration.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.example!.push(
            fromTimestamp(Timestamp.decode(reader, reader.uint32())),
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

  fromJSON(object: any): TimestampRules {
    return {
      const: isSet(object.const) ? fromJsonTimestamp(object.const) : undefined,
      lt: isSet(object.lt) ? fromJsonTimestamp(object.lt) : undefined,
      lte: isSet(object.lte) ? fromJsonTimestamp(object.lte) : undefined,
      ltNow: isSet(object.ltNow) ? globalThis.Boolean(object.ltNow) : undefined,
      gt: isSet(object.gt) ? fromJsonTimestamp(object.gt) : undefined,
      gte: isSet(object.gte) ? fromJsonTimestamp(object.gte) : undefined,
      gtNow: isSet(object.gtNow) ? globalThis.Boolean(object.gtNow) : undefined,
      within: isSet(object.within)
        ? Duration.fromJSON(object.within)
        : undefined,
      example: globalThis.Array.isArray(object?.example)
        ? object.example.map((e: any) => fromJsonTimestamp(e))
        : [],
    };
  },

  toJSON(message: TimestampRules): unknown {
    const obj: any = {};
    if (message.const !== undefined) {
      obj.const = message.const.toISOString();
    }
    if (message.lt !== undefined) {
      obj.lt = message.lt.toISOString();
    }
    if (message.lte !== undefined) {
      obj.lte = message.lte.toISOString();
    }
    if (message.ltNow !== undefined) {
      obj.ltNow = message.ltNow;
    }
    if (message.gt !== undefined) {
      obj.gt = message.gt.toISOString();
    }
    if (message.gte !== undefined) {
      obj.gte = message.gte.toISOString();
    }
    if (message.gtNow !== undefined) {
      obj.gtNow = message.gtNow;
    }
    if (message.within !== undefined) {
      obj.within = Duration.toJSON(message.within);
    }
    if (message.example?.length) {
      obj.example = message.example.map((e) => e.toISOString());
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TimestampRules>, I>>(
    base?: I,
  ): TimestampRules {
    return TimestampRules.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TimestampRules>, I>>(
    object: I,
  ): TimestampRules {
    const message = createBaseTimestampRules();
    message.const = object.const ?? undefined;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.ltNow = object.ltNow ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.gtNow = object.gtNow ?? undefined;
    message.within =
      object.within !== undefined && object.within !== null
        ? Duration.fromPartial(object.within)
        : undefined;
    message.example = object.example?.map((e) => e) || [];
    return message;
  },
};

function createBaseViolations(): Violations {
  return { violations: [] };
}

export const Violations = {
  encode(
    message: Violations,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.violations !== undefined && message.violations.length !== 0) {
      for (const v of message.violations) {
        Violation.encode(v!, writer.uint32(10).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Violations {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseViolations();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.violations!.push(Violation.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Violations {
    return {
      violations: globalThis.Array.isArray(object?.violations)
        ? object.violations.map((e: any) => Violation.fromJSON(e))
        : [],
    };
  },

  toJSON(message: Violations): unknown {
    const obj: any = {};
    if (message.violations?.length) {
      obj.violations = message.violations.map((e) => Violation.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Violations>, I>>(base?: I): Violations {
    return Violations.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Violations>, I>>(
    object: I,
  ): Violations {
    const message = createBaseViolations();
    message.violations =
      object.violations?.map((e) => Violation.fromPartial(e)) || [];
    return message;
  },
};

function createBaseViolation(): Violation {
  return {
    field: undefined,
    rule: undefined,
    ruleId: "",
    message: "",
    forKey: false,
  };
}

export const Violation = {
  encode(
    message: Violation,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.field !== undefined) {
      FieldPath.encode(message.field, writer.uint32(42).fork()).ldelim();
    }
    if (message.rule !== undefined) {
      FieldPath.encode(message.rule, writer.uint32(50).fork()).ldelim();
    }
    if (message.ruleId !== undefined && message.ruleId !== "") {
      writer.uint32(18).string(message.ruleId);
    }
    if (message.message !== undefined && message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    if (message.forKey === true) {
      writer.uint32(32).bool(message.forKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Violation {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseViolation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 5:
          if (tag !== 42) {
            break;
          }

          message.field = FieldPath.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.rule = FieldPath.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.ruleId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.message = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.forKey = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Violation {
    return {
      field: isSet(object.field) ? FieldPath.fromJSON(object.field) : undefined,
      rule: isSet(object.rule) ? FieldPath.fromJSON(object.rule) : undefined,
      ruleId: isSet(object.ruleId) ? globalThis.String(object.ruleId) : "",
      message: isSet(object.message) ? globalThis.String(object.message) : "",
      forKey: isSet(object.forKey) ? globalThis.Boolean(object.forKey) : false,
    };
  },

  toJSON(message: Violation): unknown {
    const obj: any = {};
    if (message.field !== undefined) {
      obj.field = FieldPath.toJSON(message.field);
    }
    if (message.rule !== undefined) {
      obj.rule = FieldPath.toJSON(message.rule);
    }
    if (message.ruleId !== undefined && message.ruleId !== "") {
      obj.ruleId = message.ruleId;
    }
    if (message.message !== undefined && message.message !== "") {
      obj.message = message.message;
    }
    if (message.forKey === true) {
      obj.forKey = message.forKey;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Violation>, I>>(base?: I): Violation {
    return Violation.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Violation>, I>>(
    object: I,
  ): Violation {
    const message = createBaseViolation();
    message.field =
      object.field !== undefined && object.field !== null
        ? FieldPath.fromPartial(object.field)
        : undefined;
    message.rule =
      object.rule !== undefined && object.rule !== null
        ? FieldPath.fromPartial(object.rule)
        : undefined;
    message.ruleId = object.ruleId ?? "";
    message.message = object.message ?? "";
    message.forKey = object.forKey ?? false;
    return message;
  },
};

function createBaseFieldPath(): FieldPath {
  return { elements: [] };
}

export const FieldPath = {
  encode(
    message: FieldPath,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.elements !== undefined && message.elements.length !== 0) {
      for (const v of message.elements) {
        FieldPathElement.encode(v!, writer.uint32(10).fork()).ldelim();
      }
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FieldPath {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFieldPath();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.elements!.push(
            FieldPathElement.decode(reader, reader.uint32()),
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

  fromJSON(object: any): FieldPath {
    return {
      elements: globalThis.Array.isArray(object?.elements)
        ? object.elements.map((e: any) => FieldPathElement.fromJSON(e))
        : [],
    };
  },

  toJSON(message: FieldPath): unknown {
    const obj: any = {};
    if (message.elements?.length) {
      obj.elements = message.elements.map((e) => FieldPathElement.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FieldPath>, I>>(base?: I): FieldPath {
    return FieldPath.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FieldPath>, I>>(
    object: I,
  ): FieldPath {
    const message = createBaseFieldPath();
    message.elements =
      object.elements?.map((e) => FieldPathElement.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFieldPathElement(): FieldPathElement {
  return {
    fieldNumber: 0,
    fieldName: "",
    fieldType: 1,
    keyType: 1,
    valueType: 1,
    index: undefined,
    boolKey: undefined,
    intKey: undefined,
    uintKey: undefined,
    stringKey: undefined,
  };
}

export const FieldPathElement = {
  encode(
    message: FieldPathElement,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.fieldNumber !== undefined && message.fieldNumber !== 0) {
      writer.uint32(8).int32(message.fieldNumber);
    }
    if (message.fieldName !== undefined && message.fieldName !== "") {
      writer.uint32(18).string(message.fieldName);
    }
    if (message.fieldType !== undefined && message.fieldType !== 1) {
      writer.uint32(24).int32(message.fieldType);
    }
    if (message.keyType !== undefined && message.keyType !== 1) {
      writer.uint32(32).int32(message.keyType);
    }
    if (message.valueType !== undefined && message.valueType !== 1) {
      writer.uint32(40).int32(message.valueType);
    }
    if (message.index !== undefined) {
      writer.uint32(48).uint64(message.index);
    }
    if (message.boolKey !== undefined) {
      writer.uint32(56).bool(message.boolKey);
    }
    if (message.intKey !== undefined) {
      writer.uint32(64).int64(message.intKey);
    }
    if (message.uintKey !== undefined) {
      writer.uint32(72).uint64(message.uintKey);
    }
    if (message.stringKey !== undefined) {
      writer.uint32(82).string(message.stringKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FieldPathElement {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFieldPathElement();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.fieldNumber = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.fieldName = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.fieldType = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.keyType = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.valueType = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.index = longToNumber(reader.uint64() as Long);
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.boolKey = reader.bool();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.intKey = longToNumber(reader.int64() as Long);
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.uintKey = longToNumber(reader.uint64() as Long);
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.stringKey = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FieldPathElement {
    return {
      fieldNumber: isSet(object.fieldNumber)
        ? globalThis.Number(object.fieldNumber)
        : 0,
      fieldName: isSet(object.fieldName)
        ? globalThis.String(object.fieldName)
        : "",
      fieldType: isSet(object.fieldType)
        ? fieldDescriptorProto_TypeFromJSON(object.fieldType)
        : 1,
      keyType: isSet(object.keyType)
        ? fieldDescriptorProto_TypeFromJSON(object.keyType)
        : 1,
      valueType: isSet(object.valueType)
        ? fieldDescriptorProto_TypeFromJSON(object.valueType)
        : 1,
      index: isSet(object.index) ? globalThis.Number(object.index) : undefined,
      boolKey: isSet(object.boolKey)
        ? globalThis.Boolean(object.boolKey)
        : undefined,
      intKey: isSet(object.intKey)
        ? globalThis.Number(object.intKey)
        : undefined,
      uintKey: isSet(object.uintKey)
        ? globalThis.Number(object.uintKey)
        : undefined,
      stringKey: isSet(object.stringKey)
        ? globalThis.String(object.stringKey)
        : undefined,
    };
  },

  toJSON(message: FieldPathElement): unknown {
    const obj: any = {};
    if (message.fieldNumber !== undefined && message.fieldNumber !== 0) {
      obj.fieldNumber = Math.round(message.fieldNumber);
    }
    if (message.fieldName !== undefined && message.fieldName !== "") {
      obj.fieldName = message.fieldName;
    }
    if (message.fieldType !== undefined && message.fieldType !== 1) {
      obj.fieldType = fieldDescriptorProto_TypeToJSON(message.fieldType);
    }
    if (message.keyType !== undefined && message.keyType !== 1) {
      obj.keyType = fieldDescriptorProto_TypeToJSON(message.keyType);
    }
    if (message.valueType !== undefined && message.valueType !== 1) {
      obj.valueType = fieldDescriptorProto_TypeToJSON(message.valueType);
    }
    if (message.index !== undefined) {
      obj.index = Math.round(message.index);
    }
    if (message.boolKey !== undefined) {
      obj.boolKey = message.boolKey;
    }
    if (message.intKey !== undefined) {
      obj.intKey = Math.round(message.intKey);
    }
    if (message.uintKey !== undefined) {
      obj.uintKey = Math.round(message.uintKey);
    }
    if (message.stringKey !== undefined) {
      obj.stringKey = message.stringKey;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FieldPathElement>, I>>(
    base?: I,
  ): FieldPathElement {
    return FieldPathElement.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FieldPathElement>, I>>(
    object: I,
  ): FieldPathElement {
    const message = createBaseFieldPathElement();
    message.fieldNumber = object.fieldNumber ?? 0;
    message.fieldName = object.fieldName ?? "";
    message.fieldType = object.fieldType ?? 1;
    message.keyType = object.keyType ?? 1;
    message.valueType = object.valueType ?? 1;
    message.index = object.index ?? undefined;
    message.boolKey = object.boolKey ?? undefined;
    message.intKey = object.intKey ?? undefined;
    message.uintKey = object.uintKey ?? undefined;
    message.stringKey = object.stringKey ?? undefined;
    return message;
  },
};

export const message: Extension<MessageRules> = {
  number: 1159,
  tag: 9274,
  repeated: false,
  packed: false,
  encode: (value: MessageRules): Uint8Array[] => {
    const encoded: Uint8Array[] = [];
    const writer = _m0.Writer.create();
    MessageRules.encode(value, writer.fork()).ldelim();
    encoded.push(writer.finish());
    return encoded;
  },
  decode: (tag: number, input: Uint8Array[]): MessageRules => {
    const reader = _m0.Reader.create(input[input.length - 1] ?? fail());
    return MessageRules.decode(reader, reader.uint32());
  },
};

export const oneof: Extension<OneofRules> = {
  number: 1159,
  tag: 9274,
  repeated: false,
  packed: false,
  encode: (value: OneofRules): Uint8Array[] => {
    const encoded: Uint8Array[] = [];
    const writer = _m0.Writer.create();
    OneofRules.encode(value, writer.fork()).ldelim();
    encoded.push(writer.finish());
    return encoded;
  },
  decode: (tag: number, input: Uint8Array[]): OneofRules => {
    const reader = _m0.Reader.create(input[input.length - 1] ?? fail());
    return OneofRules.decode(reader, reader.uint32());
  },
};

export const field: Extension<FieldRules> = {
  number: 1159,
  tag: 9274,
  repeated: false,
  packed: false,
  encode: (value: FieldRules): Uint8Array[] => {
    const encoded: Uint8Array[] = [];
    const writer = _m0.Writer.create();
    FieldRules.encode(value, writer.fork()).ldelim();
    encoded.push(writer.finish());
    return encoded;
  },
  decode: (tag: number, input: Uint8Array[]): FieldRules => {
    const reader = _m0.Reader.create(input[input.length - 1] ?? fail());
    return FieldRules.decode(reader, reader.uint32());
  },
};

export const predefined: Extension<PredefinedRules> = {
  number: 1160,
  tag: 9282,
  repeated: false,
  packed: false,
  encode: (value: PredefinedRules): Uint8Array[] => {
    const encoded: Uint8Array[] = [];
    const writer = _m0.Writer.create();
    PredefinedRules.encode(value, writer.fork()).ldelim();
    encoded.push(writer.finish());
    return encoded;
  },
  decode: (tag: number, input: Uint8Array[]): PredefinedRules => {
    const reader = _m0.Reader.create(input[input.length - 1] ?? fail());
    return PredefinedRules.decode(reader, reader.uint32());
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

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

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface Extension<T> {
  number: number;
  tag: number;
  singularTag?: number;
  encode?: (message: T) => Uint8Array[];
  decode?: (tag: number, input: Uint8Array[]) => T;
  repeated: boolean;
  packed: boolean;
}

function fail(message?: string): never {
  throw new globalThis.Error(message ?? "Failed");
}
