import { KesselInventoryServiceClient } from "kessel-sdk/kessel/inventory/v1beta2/inventory_service";
import { ResourceReference } from "kessel-sdk/kessel/inventory/v1beta2/resource_reference";
import { SubjectReference } from "kessel-sdk/kessel/inventory/v1beta2/subject_reference";
import { CheckForUpdateRequest } from "kessel-sdk/kessel/inventory/v1beta2/check_for_update_request";
import { ChannelCredentials } from "@grpc/grpc-js";

const stub = new KesselInventoryServiceClient(
  "localhost:9081",
  ChannelCredentials.createInsecure(),
  {
    // Channel options
  },
);

const subject: SubjectReference = {
  resource: {
    reporter: {
      type: "rbac",
    },
    resourceId: "foobar",
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

const checkForUpdateRequest: CheckForUpdateRequest = {
  object: resource,
  relation: "inventory_host_view",
  subject: subject,
};

stub.checkForUpdate(checkForUpdateRequest, (error, response) => {
  if (!error) {
    console.log("CheckForUpdate response received successfully:");
    console.log(response);
  } else {
    console.log("gRPC error occurred during CheckForUpdate:");
    console.log(`Exception:`, error);
  }
});
