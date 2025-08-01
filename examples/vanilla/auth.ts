import { KesselInventoryServiceClient } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/inventory_service";
import { ResourceReference } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/resource_reference";
import { SubjectReference } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/subject_reference";
import { CheckRequest } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/check_request";
import { fetchOIDCDiscovery } from "@project-kessel/kessel-sdk/kessel/auth";
import "dotenv/config";
import { ChannelCredentials, Metadata } from "@grpc/grpc-js";
import { OAuth2ClientCredentials } from "../../src/kessel/auth";

const stub = new KesselInventoryServiceClient(
  process.env.KESSEL_ENDPOINT,
  ChannelCredentials.createInsecure(),
  {
    // Channel options
  },
);

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

fetchOIDCDiscovery(process.env.AUTH_DISCOVERY_ISSUER_URL)
  .then((discovery) => {
    return new OAuth2ClientCredentials({
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      tokenEndpoint: discovery.tokenEndpoint,
    });
  })
  .then((auth) => {
    auth.getToken().then((token) => {
      const metadata = new Metadata();
      metadata.add("authorization", `Bearer ${token}`);

      stub.check(check_request, metadata, (error, response) => {
        if (!error) {
          console.log("Check response received successfully:");
          console.log(response);
        } else {
          console.log("gRPC error occurred during Check:");
          console.log(`Exception:`, error);
        }
      });
    });
  });
