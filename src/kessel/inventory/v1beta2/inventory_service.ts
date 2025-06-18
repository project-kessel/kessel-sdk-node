import {
  ChannelCredentials,
  Client,
  ClientReadableStream,
  handleServerStreamingCall,
  makeGenericClientConstructor,
  Metadata,
} from "@grpc/grpc-js";
import type {
  CallOptions,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import { CheckForUpdateRequest } from "./check_for_update_request";
import { CheckForUpdateResponse } from "./check_for_update_response";
import { CheckRequest } from "./check_request";
import { CheckResponse } from "./check_response";
import { DeleteResourceRequest } from "./delete_resource_request";
import { DeleteResourceResponse } from "./delete_resource_response";
import { ReportResourceRequest } from "./report_resource_request";
import { ReportResourceResponse } from "./report_resource_response";
import { StreamedListObjectsRequest } from "./streamed_list_objects_request";
import { StreamedListObjectsResponse } from "./streamed_list_objects_response";

export const protobufPackage = "kessel.inventory.v1beta2";

/**
 * KesselInventoryService provides APIs to perform relationship checks
 * and manage inventory resource lifecycles (reporting and deletion).
 */
export type KesselInventoryServiceDefinition =
  typeof KesselInventoryServiceDefinition;
export const KesselInventoryServiceDefinition = {
  name: "KesselInventoryService",
  fullName: "kessel.inventory.v1beta2.KesselInventoryService",
  methods: {
    /**
     * Performs an relationship check to determine whether a subject has a specific
     * permission or relationship on a resource.
     *
     * This API evaluates whether the provided subject is a member of the specified relation
     * (e.g., "viewer", "editor", "admin") on the target object. It answers the question:
     * "Does subject *X* have relation *Y* on object *Z*?"
     *
     * Common use cases include enforcing read access, conditional UI visibility,
     * or authorization gating for downstream API calls.
     */
    check: {
      name: "Check",
      requestType: CheckRequest,
      requestStream: false,
      responseType: CheckResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              33, 58, 1, 42, 34, 28, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 50, 47,
              99, 104, 101, 99, 107,
            ]),
          ],
        },
      },
    },
    /**
     * Performs a strongly consistent relationship check to determine whether a subject
     * has a specific relation to an object (representing, for example, a permission).
     *
     * This API answers the question:
     * "Is subject *X* currently authorized to update or modify resource *Y*?"
     * Unlike the basic `Check` endpoint, this method guarantees a fully up-to-date
     * view of the relationship state (e.g., not relying on cached or eventually consistent data).
     *
     * It is intended to be used just prior to sensitive operation (e.g., update, delete)
     * which depend on the current state of the relationship.
     */
    checkForUpdate: {
      name: "CheckForUpdate",
      requestType: CheckForUpdateRequest,
      requestStream: false,
      responseType: CheckForUpdateResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              42, 58, 1, 42, 34, 37, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 50, 47,
              99, 104, 101, 99, 107, 102, 111, 114, 117, 112, 100, 97, 116, 101,
            ]),
          ],
        },
      },
    },
    /**
     * Reports to Kessel Inventory that a Resource has been created or has been updated.
     *
     * Reporters can use this API to report facts about their resources in order to
     * facilitate integration, correlation, and access control.
     *
     * Each call can include:
     * - Reporter-specific attributes and relationships (`representations.reporter`)
     * - Shared attributes and relationships common to all reporters (`representations.common`)
     * - Identifiers and metadata that allow correlation to an existing resource
     *
     * Multiple reporters may report representations for the same resource.
     * Kessel Inventory correlates these
     * based on correlation keys provided for a given resource type
     *
     * All versions of your reported facts will be retained and can be queried as needed
     *
     * The relationships reported through this API are used to determine relationship check outcomes
     * via the Check and CheckForUpdate APIs.
     *
     * Reporters are responsible for ensuring delivery guarantees and message ordering
     * appropriate to the sensitivity and consistency needs of their use case.
     *
     * This API does **not** guarantee immediate read-your-writes consistency by default.
     *  If a reporter requires newly submitted resources or relationships to be visible
     * in subsequent checks (e.g., `Check`), the request must explicitly set
     * `write_visibility = IMMEDIATE`.
     */
    reportResource: {
      name: "ReportResource",
      requestType: ReportResourceRequest,
      requestStream: false,
      responseType: ReportResourceResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              37, 58, 1, 42, 34, 32, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 50, 47,
              114, 101, 115, 111, 117, 114, 99, 101, 115,
            ]),
          ],
        },
      },
    },
    /**
     * Reports to Kessel Inventory that a Reporter's representation of a Resource has been deleted.
     *
     * This operation is typically used when a resource has been decommissioned or
     * is no longer reported by any authorized system.
     *
     * As a result, relationship checks performed via the `Check` and
     * `CheckForUpdate` APIs will no longer resolve positively for the deleted
     * resource. Any decisions that depend on relationships tied to
     * this resource will be affected.
     *
     * As an example, it can revoke previously granted access across the system.
     */
    deleteResource: {
      name: "DeleteResource",
      requestType: DeleteResourceRequest,
      requestStream: false,
      responseType: DeleteResourceResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            Buffer.from([
              37, 58, 1, 42, 42, 32, 47, 97, 112, 105, 47, 105, 110, 118, 101,
              110, 116, 111, 114, 121, 47, 118, 49, 98, 101, 116, 97, 50, 47,
              114, 101, 115, 111, 117, 114, 99, 101, 115,
            ]),
          ],
        },
      },
    },
    /**
     * Streams a list of objects where the given subject has the specified relation.
     *
     * This relationship query answers the question:
     * "Which objects of type *X* does subject *Y* have the *Z* relation to?"
     *
     * It is often used to power user-facing dashboards, filtered UIs, or policy-driven
     * access lists. The result is streamed incrementally to support large datasets and
     * reduce client-side latency or memory pressure.
     *
     * Pagination and consistency controls allow fine-tuned performance and data freshness.
     */
    streamedListObjects: {
      name: "StreamedListObjects",
      requestType: StreamedListObjectsRequest,
      requestStream: false,
      responseType: StreamedListObjectsResponse,
      responseStream: true,
      options: {},
    },
  },
} as const;

/**
 * KesselInventoryService provides APIs to perform relationship checks
 * and manage inventory resource lifecycles (reporting and deletion).
 */
export type KesselInventoryServiceService =
  typeof KesselInventoryServiceService;
export const KesselInventoryServiceService = {
  /**
   * Performs an relationship check to determine whether a subject has a specific
   * permission or relationship on a resource.
   *
   * This API evaluates whether the provided subject is a member of the specified relation
   * (e.g., "viewer", "editor", "admin") on the target object. It answers the question:
   * "Does subject *X* have relation *Y* on object *Z*?"
   *
   * Common use cases include enforcing read access, conditional UI visibility,
   * or authorization gating for downstream API calls.
   */
  check: {
    path: "/kessel.inventory.v1beta2.KesselInventoryService/Check",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CheckRequest) =>
      Buffer.from(CheckRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CheckRequest.decode(value),
    responseSerialize: (value: CheckResponse) =>
      Buffer.from(CheckResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CheckResponse.decode(value),
  },
  /**
   * Performs a strongly consistent relationship check to determine whether a subject
   * has a specific relation to an object (representing, for example, a permission).
   *
   * This API answers the question:
   * "Is subject *X* currently authorized to update or modify resource *Y*?"
   * Unlike the basic `Check` endpoint, this method guarantees a fully up-to-date
   * view of the relationship state (e.g., not relying on cached or eventually consistent data).
   *
   * It is intended to be used just prior to sensitive operation (e.g., update, delete)
   * which depend on the current state of the relationship.
   */
  checkForUpdate: {
    path: "/kessel.inventory.v1beta2.KesselInventoryService/CheckForUpdate",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CheckForUpdateRequest) =>
      Buffer.from(CheckForUpdateRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CheckForUpdateRequest.decode(value),
    responseSerialize: (value: CheckForUpdateResponse) =>
      Buffer.from(CheckForUpdateResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CheckForUpdateResponse.decode(value),
  },
  /**
   * Reports to Kessel Inventory that a Resource has been created or has been updated.
   *
   * Reporters can use this API to report facts about their resources in order to
   * facilitate integration, correlation, and access control.
   *
   * Each call can include:
   * - Reporter-specific attributes and relationships (`representations.reporter`)
   * - Shared attributes and relationships common to all reporters (`representations.common`)
   * - Identifiers and metadata that allow correlation to an existing resource
   *
   * Multiple reporters may report representations for the same resource.
   * Kessel Inventory correlates these
   * based on correlation keys provided for a given resource type
   *
   * All versions of your reported facts will be retained and can be queried as needed
   *
   * The relationships reported through this API are used to determine relationship check outcomes
   * via the Check and CheckForUpdate APIs.
   *
   * Reporters are responsible for ensuring delivery guarantees and message ordering
   * appropriate to the sensitivity and consistency needs of their use case.
   *
   * This API does **not** guarantee immediate read-your-writes consistency by default.
   *  If a reporter requires newly submitted resources or relationships to be visible
   * in subsequent checks (e.g., `Check`), the request must explicitly set
   * `write_visibility = IMMEDIATE`.
   */
  reportResource: {
    path: "/kessel.inventory.v1beta2.KesselInventoryService/ReportResource",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ReportResourceRequest) =>
      Buffer.from(ReportResourceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ReportResourceRequest.decode(value),
    responseSerialize: (value: ReportResourceResponse) =>
      Buffer.from(ReportResourceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ReportResourceResponse.decode(value),
  },
  /**
   * Reports to Kessel Inventory that a Reporter's representation of a Resource has been deleted.
   *
   * This operation is typically used when a resource has been decommissioned or
   * is no longer reported by any authorized system.
   *
   * As a result, relationship checks performed via the `Check` and
   * `CheckForUpdate` APIs will no longer resolve positively for the deleted
   * resource. Any decisions that depend on relationships tied to
   * this resource will be affected.
   *
   * As an example, it can revoke previously granted access across the system.
   */
  deleteResource: {
    path: "/kessel.inventory.v1beta2.KesselInventoryService/DeleteResource",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteResourceRequest) =>
      Buffer.from(DeleteResourceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => DeleteResourceRequest.decode(value),
    responseSerialize: (value: DeleteResourceResponse) =>
      Buffer.from(DeleteResourceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      DeleteResourceResponse.decode(value),
  },
  /**
   * Streams a list of objects where the given subject has the specified relation.
   *
   * This relationship query answers the question:
   * "Which objects of type *X* does subject *Y* have the *Z* relation to?"
   *
   * It is often used to power user-facing dashboards, filtered UIs, or policy-driven
   * access lists. The result is streamed incrementally to support large datasets and
   * reduce client-side latency or memory pressure.
   *
   * Pagination and consistency controls allow fine-tuned performance and data freshness.
   */
  streamedListObjects: {
    path: "/kessel.inventory.v1beta2.KesselInventoryService/StreamedListObjects",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: StreamedListObjectsRequest) =>
      Buffer.from(StreamedListObjectsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      StreamedListObjectsRequest.decode(value),
    responseSerialize: (value: StreamedListObjectsResponse) =>
      Buffer.from(StreamedListObjectsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      StreamedListObjectsResponse.decode(value),
  },
} as const;

export interface KesselInventoryServiceServer
  extends UntypedServiceImplementation {
  /**
   * Performs an relationship check to determine whether a subject has a specific
   * permission or relationship on a resource.
   *
   * This API evaluates whether the provided subject is a member of the specified relation
   * (e.g., "viewer", "editor", "admin") on the target object. It answers the question:
   * "Does subject *X* have relation *Y* on object *Z*?"
   *
   * Common use cases include enforcing read access, conditional UI visibility,
   * or authorization gating for downstream API calls.
   */
  check: handleUnaryCall<CheckRequest, CheckResponse>;
  /**
   * Performs a strongly consistent relationship check to determine whether a subject
   * has a specific relation to an object (representing, for example, a permission).
   *
   * This API answers the question:
   * "Is subject *X* currently authorized to update or modify resource *Y*?"
   * Unlike the basic `Check` endpoint, this method guarantees a fully up-to-date
   * view of the relationship state (e.g., not relying on cached or eventually consistent data).
   *
   * It is intended to be used just prior to sensitive operation (e.g., update, delete)
   * which depend on the current state of the relationship.
   */
  checkForUpdate: handleUnaryCall<
    CheckForUpdateRequest,
    CheckForUpdateResponse
  >;
  /**
   * Reports to Kessel Inventory that a Resource has been created or has been updated.
   *
   * Reporters can use this API to report facts about their resources in order to
   * facilitate integration, correlation, and access control.
   *
   * Each call can include:
   * - Reporter-specific attributes and relationships (`representations.reporter`)
   * - Shared attributes and relationships common to all reporters (`representations.common`)
   * - Identifiers and metadata that allow correlation to an existing resource
   *
   * Multiple reporters may report representations for the same resource.
   * Kessel Inventory correlates these
   * based on correlation keys provided for a given resource type
   *
   * All versions of your reported facts will be retained and can be queried as needed
   *
   * The relationships reported through this API are used to determine relationship check outcomes
   * via the Check and CheckForUpdate APIs.
   *
   * Reporters are responsible for ensuring delivery guarantees and message ordering
   * appropriate to the sensitivity and consistency needs of their use case.
   *
   * This API does **not** guarantee immediate read-your-writes consistency by default.
   *  If a reporter requires newly submitted resources or relationships to be visible
   * in subsequent checks (e.g., `Check`), the request must explicitly set
   * `write_visibility = IMMEDIATE`.
   */
  reportResource: handleUnaryCall<
    ReportResourceRequest,
    ReportResourceResponse
  >;
  /**
   * Reports to Kessel Inventory that a Reporter's representation of a Resource has been deleted.
   *
   * This operation is typically used when a resource has been decommissioned or
   * is no longer reported by any authorized system.
   *
   * As a result, relationship checks performed via the `Check` and
   * `CheckForUpdate` APIs will no longer resolve positively for the deleted
   * resource. Any decisions that depend on relationships tied to
   * this resource will be affected.
   *
   * As an example, it can revoke previously granted access across the system.
   */
  deleteResource: handleUnaryCall<
    DeleteResourceRequest,
    DeleteResourceResponse
  >;
  /**
   * Streams a list of objects where the given subject has the specified relation.
   *
   * This relationship query answers the question:
   * "Which objects of type *X* does subject *Y* have the *Z* relation to?"
   *
   * It is often used to power user-facing dashboards, filtered UIs, or policy-driven
   * access lists. The result is streamed incrementally to support large datasets and
   * reduce client-side latency or memory pressure.
   *
   * Pagination and consistency controls allow fine-tuned performance and data freshness.
   */
  streamedListObjects: handleServerStreamingCall<
    StreamedListObjectsRequest,
    StreamedListObjectsResponse
  >;
}

export interface KesselInventoryServiceClient extends Client {
  /**
   * Performs an relationship check to determine whether a subject has a specific
   * permission or relationship on a resource.
   *
   * This API evaluates whether the provided subject is a member of the specified relation
   * (e.g., "viewer", "editor", "admin") on the target object. It answers the question:
   * "Does subject *X* have relation *Y* on object *Z*?"
   *
   * Common use cases include enforcing read access, conditional UI visibility,
   * or authorization gating for downstream API calls.
   */
  check(
    request: CheckRequest,
    callback: (error: ServiceError | null, response: CheckResponse) => void,
  ): ClientUnaryCall;
  check(
    request: CheckRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CheckResponse) => void,
  ): ClientUnaryCall;
  check(
    request: CheckRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CheckResponse) => void,
  ): ClientUnaryCall;
  /**
   * Performs a strongly consistent relationship check to determine whether a subject
   * has a specific relation to an object (representing, for example, a permission).
   *
   * This API answers the question:
   * "Is subject *X* currently authorized to update or modify resource *Y*?"
   * Unlike the basic `Check` endpoint, this method guarantees a fully up-to-date
   * view of the relationship state (e.g., not relying on cached or eventually consistent data).
   *
   * It is intended to be used just prior to sensitive operation (e.g., update, delete)
   * which depend on the current state of the relationship.
   */
  checkForUpdate(
    request: CheckForUpdateRequest,
    callback: (
      error: ServiceError | null,
      response: CheckForUpdateResponse,
    ) => void,
  ): ClientUnaryCall;
  checkForUpdate(
    request: CheckForUpdateRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CheckForUpdateResponse,
    ) => void,
  ): ClientUnaryCall;
  checkForUpdate(
    request: CheckForUpdateRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CheckForUpdateResponse,
    ) => void,
  ): ClientUnaryCall;
  /**
   * Reports to Kessel Inventory that a Resource has been created or has been updated.
   *
   * Reporters can use this API to report facts about their resources in order to
   * facilitate integration, correlation, and access control.
   *
   * Each call can include:
   * - Reporter-specific attributes and relationships (`representations.reporter`)
   * - Shared attributes and relationships common to all reporters (`representations.common`)
   * - Identifiers and metadata that allow correlation to an existing resource
   *
   * Multiple reporters may report representations for the same resource.
   * Kessel Inventory correlates these
   * based on correlation keys provided for a given resource type
   *
   * All versions of your reported facts will be retained and can be queried as needed
   *
   * The relationships reported through this API are used to determine relationship check outcomes
   * via the Check and CheckForUpdate APIs.
   *
   * Reporters are responsible for ensuring delivery guarantees and message ordering
   * appropriate to the sensitivity and consistency needs of their use case.
   *
   * This API does **not** guarantee immediate read-your-writes consistency by default.
   *  If a reporter requires newly submitted resources or relationships to be visible
   * in subsequent checks (e.g., `Check`), the request must explicitly set
   * `write_visibility = IMMEDIATE`.
   */
  reportResource(
    request: ReportResourceRequest,
    callback: (
      error: ServiceError | null,
      response: ReportResourceResponse,
    ) => void,
  ): ClientUnaryCall;
  reportResource(
    request: ReportResourceRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ReportResourceResponse,
    ) => void,
  ): ClientUnaryCall;
  reportResource(
    request: ReportResourceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ReportResourceResponse,
    ) => void,
  ): ClientUnaryCall;
  /**
   * Reports to Kessel Inventory that a Reporter's representation of a Resource has been deleted.
   *
   * This operation is typically used when a resource has been decommissioned or
   * is no longer reported by any authorized system.
   *
   * As a result, relationship checks performed via the `Check` and
   * `CheckForUpdate` APIs will no longer resolve positively for the deleted
   * resource. Any decisions that depend on relationships tied to
   * this resource will be affected.
   *
   * As an example, it can revoke previously granted access across the system.
   */
  deleteResource(
    request: DeleteResourceRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteResourceResponse,
    ) => void,
  ): ClientUnaryCall;
  deleteResource(
    request: DeleteResourceRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteResourceResponse,
    ) => void,
  ): ClientUnaryCall;
  deleteResource(
    request: DeleteResourceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteResourceResponse,
    ) => void,
  ): ClientUnaryCall;
  /**
   * Streams a list of objects where the given subject has the specified relation.
   *
   * This relationship query answers the question:
   * "Which objects of type *X* does subject *Y* have the *Z* relation to?"
   *
   * It is often used to power user-facing dashboards, filtered UIs, or policy-driven
   * access lists. The result is streamed incrementally to support large datasets and
   * reduce client-side latency or memory pressure.
   *
   * Pagination and consistency controls allow fine-tuned performance and data freshness.
   */
  streamedListObjects(
    request: StreamedListObjectsRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<StreamedListObjectsResponse>;
  streamedListObjects(
    request: StreamedListObjectsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<StreamedListObjectsResponse>;
}

export const KesselInventoryServiceClient = makeGenericClientConstructor(
  KesselInventoryServiceService,
  "kessel.inventory.v1beta2.KesselInventoryService",
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>,
  ): KesselInventoryServiceClient;
  service: typeof KesselInventoryServiceService;
  serviceName: string;
};
