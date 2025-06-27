import { ResourceReference } from "kessel-sdk/kessel/inventory/v1beta2/resource_reference";
import { SubjectReference } from "kessel-sdk/kessel/inventory/v1beta2/subject_reference";
import { CheckRequest } from "kessel-sdk/kessel/inventory/v1beta2/check_request";
import { ClientBuilder } from "kessel-sdk/kessel/inventory/v1beta2";

const client = ClientBuilder.builder()
  .withTarget("localhost:9081")
  .withInsecureCredentials()
  // .withKeepAlive(10000, 5000, true)
  // .withCredentials(ChannelCredentials.createSsl())
  .build();

const subjectReference: SubjectReference = {
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

const check_request: CheckRequest = {
  object: resource,
  relation: "inventory_host_view",
  subject: subjectReference,
};

(async () => {
  try {
    const response = await client.check(check_request);
    console.log("Check response received successfully:");
    console.log(response);
  } catch (error) {
    console.log("gRPC error occurred during Check:");
    console.log(`Exception:`, error);
  }
})();
