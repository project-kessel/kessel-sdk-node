import { createChannel, createClient } from "nice-grpc";
import {
  KesselInventoryServiceClient,
  KesselInventoryServiceDefinition,
} from "kessel-sdk/kessel/inventory/v1beta2/inventory_service";
import { ResourceReference } from "kessel-sdk/kessel/inventory/v1beta2/resource_reference";
import { SubjectReference } from "kessel-sdk/kessel/inventory/v1beta2/subject_reference";
import { CheckRequest } from "kessel-sdk/kessel/inventory/v1beta2/check_request";

const channel = createChannel("localhost:9081");

const stub: KesselInventoryServiceClient = createClient(
  KesselInventoryServiceDefinition,
  channel,
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

try {
  const response = await stub.check(check_request);
  console.log("Check response received successfully:");
  console.log(response);
} catch (e) {
  console.log("gRPC error occurred during Check:");
  console.log(`Exception:`, e);
}
