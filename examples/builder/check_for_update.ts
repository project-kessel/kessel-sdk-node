import { ResourceReference } from "kessel-sdk/kessel/inventory/v1beta2/resource_reference";
import { SubjectReference } from "kessel-sdk/kessel/inventory/v1beta2/subject_reference";
import { CheckForUpdateRequest } from "kessel-sdk/kessel/inventory/v1beta2/check_for_update_request";
import { ClientBuilder } from "kessel-sdk/kessel/inventory/v1beta2";

const client = ClientBuilder.builder()
  .withTarget("localhost:9081")
  .withInsecureCredentials()
  // .withKeepAlive(10000, 5000, true)
  // .withCredentials(ChannelCredentials.createSsl())
  .build();

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

(async () => {
  try {
    const response = await client.checkForUpdate(checkForUpdateRequest);
    console.log("CheckForUpdate response received successfully:");
    console.log(response);
  } catch (error) {
    console.log("gRPC error occurred during CheckForUpdate:");
    console.log(`Exception:`, error);
  }
})();
