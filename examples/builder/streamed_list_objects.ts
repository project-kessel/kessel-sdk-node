import { SubjectReference } from "kessel-sdk/kessel/inventory/v1beta2/subject_reference";
import { RepresentationType } from "kessel-sdk/kessel/inventory/v1beta2/representation_type";
import { StreamedListObjectsRequest } from "kessel-sdk/kessel/inventory/v1beta2/streamed_list_objects_request";
import { ClientBuilder } from "kessel-sdk/kessel/inventory/v1beta2";

const client = ClientBuilder.builder()
  .withTarget("localhost:9081")
  .withInsecureCredentials()
  // .withKeepAlive(10000, 5000, true)
  // .withCredentials(ChannelCredentials.createSsl())
  .build();

const representationType: RepresentationType = {
  resourceType: "workspace",
  reporterType: "rbac",
};

const subjectReference: SubjectReference = {
  resource: {
    reporter: {
      type: "rbac",
    },
    resourceId: "foobar",
    resourceType: "principal",
  },
};

const request: StreamedListObjectsRequest = {
  objectType: representationType,
  relation: "inventory_host_view",
  subject: subjectReference,
};

(async () => {
  const streamedResponse = client.streamedListObjects(request);
  console.log("Received streamed response:");
  try {
    for await (const response of streamedResponse) {
      console.log(response);
    }
  } catch (e) {
    console.log("gRPC error occurred during Check:");
    console.log(`Exception:`, e);
  }
})();
