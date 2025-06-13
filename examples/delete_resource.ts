import { createClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";

import { KesselInventoryService } from "kessel-sdk/kessel/inventory/v1beta2/inventory_service_pb";
import { DeleteResourceRequest } from "kessel-sdk/kessel/inventory/v1beta2/delete_resource_request";

const channel = createGrpcTransport({
  baseUrl: "http://localhost:9081",
});

const stub = createClient(KesselInventoryService, channel);

const deleteResourceRequest: DeleteResourceRequest = {
  reference: {
    resourceType: "host",
    resourceId: "854589f0-3be7-4cad-8bcd-45e18f33cb81",
    reporter: {
      type: "HBI",
    },
  },
};

(async () => {
  try {
    const response = await stub.deleteResource(deleteResourceRequest);
    console.log("Delete Resource response received successfully:");
    console.log(response);
  } catch (e) {
    console.log("gRPC error occurred during Delete Resource:");
    console.log(`Exception:`, e);
  }
})();
