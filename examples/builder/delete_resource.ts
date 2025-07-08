import { DeleteResourceRequest } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/delete_resource_request";
import { ClientBuilder } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";
import "dotenv/config";

const client = ClientBuilder.builder()
  .withTarget(process.env.KESSEL_ENDPOINT)
  .withInsecureCredentials()
  // .withKeepAlive(10000, 5000, true)
  // .withCredentials(ChannelCredentials.createSsl())
  .build();

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
