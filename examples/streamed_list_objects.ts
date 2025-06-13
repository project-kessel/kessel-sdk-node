import { createChannel, createClient } from "nice-grpc";
import {
  KesselInventoryServiceClient,
  KesselInventoryServiceDefinition,
} from "kessel-sdk/kessel/inventory/v1beta2/inventory_service";
import { SubjectReference } from "kessel-sdk/kessel/inventory/v1beta2/subject_reference";
import { RepresentationType } from "kessel-sdk/kessel/inventory/v1beta2/representation_type";
import { StreamedListObjectsRequest } from "kessel-sdk/kessel/inventory/v1beta2/streamed_list_objects_request";

const channel = createChannel("localhost:9081");

const stub: KesselInventoryServiceClient = createClient(
  KesselInventoryServiceDefinition,
  channel,
);

const representationType: RepresentationType = {
  resourceType: "host",
  reporterType: "hbi",
};

const subjectReference: SubjectReference = {
  resource: {
    reporter: {
      type: "rbac",
    },
    resourceId: "localhost/1",
    resourceType: "principal",
  },
};

const request: StreamedListObjectsRequest = {
  objectType: representationType,
  relation: "view",
  subject: subjectReference,
};

try {
  const streamedResponse = stub.streamedListObjects(request);
  console.log("Received streamed response:");
  for await (const response of streamedResponse) {
    console.log(response);
  }
} catch (e) {
  console.log("gRPC error occurred during streamed response:");
  console.log(`Exception:`, e);
}
