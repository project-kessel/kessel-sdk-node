import { KesselInventoryServiceClient } from "kessel-sdk/kessel/inventory/v1beta2/inventory_service";
import { ResourceReference } from "kessel-sdk/kessel/inventory/v1beta2/resource_reference";
import { SubjectReference } from "kessel-sdk/kessel/inventory/v1beta2/subject_reference";
import { CheckRequest } from "kessel-sdk/kessel/inventory/v1beta2/check_request";
import { ChannelCredentials } from "@grpc/grpc-js";
import { promisify } from "util";

const stub = new KesselInventoryServiceClient(
  "localhost:9081",
  ChannelCredentials.createInsecure(),
  {
    // Channel options
  },
);

const subjectReference: SubjectReference = {
  resource: {
    reporter: {
      type: "rbac",
    },
    resourceId: "localhost/1",
    resourceType: "principal",
  },
};

const resource: ResourceReference = {
  reporter: {
    type: "rbac",
  },
  resourceId: "1234",
  resourceType: "workspace",
};

const check_request: CheckRequest = {
  object: resource,
  relation: "inventory_host_view",
  subject: subjectReference,
};

// Using callbacks
stub.check(check_request, (error, response) => {
  console.log("Using callbacks");
  if (!error) {
    console.log("Check response received successfully:");
    console.log(response);
  } else {
    console.log("gRPC error occurred during Check:");
    console.log(`Exception:`, error);
  }
});

// or using promisify
(async () => {
  const check = promisify(stub.check.bind(stub));
  console.log("Using promisify");
  try {
    const response = await check(check_request);
    console.log("Check response received successfully:");
    console.log(response);
  } catch (e) {
    console.log("gRPC error occurred during Check:");
    console.log(`Exception:`, e);
  }
})();
