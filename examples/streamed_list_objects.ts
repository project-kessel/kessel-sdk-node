import { createClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";

import { KesselInventoryService } from "kessel-sdk/kessel/inventory/v1beta2/inventory_service_pb";
import { SubjectReference } from "kessel-sdk/kessel/inventory/v1beta2/subject_reference";
import { RepresentationType } from "kessel-sdk/kessel/inventory/v1beta2/representation_type";
import { StreamedListObjectsRequest } from "kessel-sdk/kessel/inventory/v1beta2/streamed_list_objects_request";

const channel = createGrpcTransport({
  baseUrl: "http://localhost:9081",
});

const stub = createClient(KesselInventoryService, channel);

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

(async () => {
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
})();
