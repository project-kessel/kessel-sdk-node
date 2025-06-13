import { createChannel, createClient } from "nice-grpc";
import {
  KesselInventoryServiceClient,
  KesselInventoryServiceDefinition,
} from "kessel-sdk/kessel/inventory/v1beta2/inventory_service";
import { DeleteResourceRequest } from "kessel-sdk/kessel/inventory/v1beta2/delete_resource_request";

const channel = createChannel("localhost:9081");

const stub: KesselInventoryServiceClient = createClient(
  KesselInventoryServiceDefinition,
  channel,
);

const deleteResourceRequest: DeleteResourceRequest = {
  reference: {
    resourceType: "host",
    resourceId: "854589f0-3be7-4cad-8bcd-45e18f33cb81",
    reporter: {
      type: "HBI",
    },
  },
};

try {
  const response = await stub.deleteResource(deleteResourceRequest);
  console.log("Delete Resource response received successfully:");
  console.log(response);
} catch (e) {
  console.log("gRPC error occurred during Delete Resource:");
  console.log(`Exception:`, e);
}
