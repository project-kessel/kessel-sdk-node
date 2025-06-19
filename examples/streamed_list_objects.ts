import { KesselInventoryServiceClient } from "kessel-sdk/kessel/inventory/v1beta2/inventory_service";

import { SubjectReference } from "kessel-sdk/kessel/inventory/v1beta2/subject_reference";
import { RepresentationType } from "kessel-sdk/kessel/inventory/v1beta2/representation_type";
import { StreamedListObjectsRequest } from "kessel-sdk/kessel/inventory/v1beta2/streamed_list_objects_request";
import { promisify } from "util";
import {ChannelCredentials} from "@grpc/grpc-js";


const stub = new KesselInventoryServiceClient(
    "localhost:9081",
    ChannelCredentials.createInsecure(),
    {
      // Channel options
    },
);

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

const fetchUsingForEach = () => {
  console.log('Using forEach to fetch all');
  try {
    const streamedResponse = stub.streamedListObjects(request);
    console.log("Received streamed response:");
    streamedResponse.forEach(response => {
      console.log(response);
    });
  } catch (e) {
    console.log("gRPC error occurred during streamed response:");
    console.log(`Exception:`, e);
  }
}

const fetchUsingAsyncIterator = async () => {
  console.log("Using response as async iterator");
  const streamedResponse = stub.streamedListObjects(request);
  console.log("Received streamed response:");
  try {
    for await (const response of streamedResponse) {
      console.log(response);
    }
  } catch (e) {
    console.log("gRPC error occurred during Check:");
    console.log(`Exception:`, e);
  }
}

(async () => {
  await fetchUsingAsyncIterator();
  fetchUsingForEach();
})();
