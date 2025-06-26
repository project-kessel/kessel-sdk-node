import { KesselInventoryServiceClient } from "kessel-sdk/kessel/inventory/v1beta2/inventory_service";
import { DeleteResourceRequest } from "kessel-sdk/kessel/inventory/v1beta2/delete_resource_request";
import { ChannelCredentials } from "@grpc/grpc-js";

const stub = new KesselInventoryServiceClient(
  "localhost:9081",
  ChannelCredentials.createInsecure(),
  {
    // Channel options
  },
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

stub.deleteResource(deleteResourceRequest, (error, response) => {
  if (!error) {
    console.log("Delete Resource response received successfully:");
    console.log(response);
  } else {
    console.log("gRPC error occurred during Delete Resource:");
    console.log(`Exception:`, error);
  }
});
