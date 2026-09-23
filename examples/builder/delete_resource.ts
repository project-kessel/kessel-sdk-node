/**
 * WARNING: This example uses .insecure() for local development only.
 * DO NOT USE IN PRODUCTION. This disables TLS encryption and certificate validation.
 * For production, use proper TLS credentials with certificate verification.
 * See the auth.ts example for secure credential configuration.
 */

import { DeleteResourceRequest } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/delete_resource_request";
import { ClientBuilder } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";
import "dotenv/config";

// WARNING: .insecure() disables TLS - local development only
const client = new ClientBuilder(process.env.KESSEL_ENDPOINT!)
  .insecure()
  .buildAsync(); // Or .build if using the callback client

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
    const response = await client.deleteResource(deleteResourceRequest);
    console.log("Delete Resource response received successfully:");
    console.log(response);
  } catch (error) {
    console.log("gRPC error occurred during Delete Resource:");
    console.log(`Exception:`, error);
  }
})();
