/**
 * WARNING: This example uses .insecure() for local development only.
 * DO NOT USE IN PRODUCTION. This disables TLS encryption and certificate validation.
 * For production, use proper TLS credentials with certificate verification.
 * See the auth.ts example for secure credential configuration.
 */

import { ResourceReference } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/resource_reference";
import { SubjectReference } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/subject_reference";
import { CheckForUpdateRequest } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/check_for_update_request";
import { ClientBuilder } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";
import "dotenv/config";

// WARNING: .insecure() disables TLS - local development only
const client = new ClientBuilder(process.env.KESSEL_ENDPOINT!)
  .insecure()
  .buildAsync(); // Or .build if using the callback client

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
