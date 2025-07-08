import { ReportResourceRequest } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/report_resource_request";
import { ResourceRepresentations } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/resource_representations";
import { RepresentationMetadata } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2/representation_metadata";
import { ClientBuilder } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";
import "dotenv/config";

const client = ClientBuilder.builder()
  .withTarget(process.env.KESSEL_ENDPOINT)
  .withInsecureCredentials()
  // .withKeepAlive(10000, 5000, true)
  // .withCredentials(ChannelCredentials.createSsl())
  .build();

const common = {
  workspace_id: "6eb10953-4ec9-4feb-838f-ba43a60880bf",
};

const reporter = {
  satellite_id: "ca234d8f-9861-4659-a033-e80460b2801c",
  sub_manager_id: "e9b7d65f-3f81-4c26-b86c-2db663376eed",
  insights_inventory_id: "c4b9b5e7-a82a-467a-b382-024a2f18c129",
  ansible_host: "host-1",
};

const metadata: RepresentationMetadata = {
  localResourceId: "854589f0-3be7-4cad-8bcd-45e18f33cb81",
  apiHref: "https://apiHref.com/",
  consoleHref: "https://www.consoleHref.com/",
  reporterVersion: "0.2.11",
};

const representations: ResourceRepresentations = {
  metadata: metadata,
  common: common,
  reporter: reporter,
};

const reportResourceRequest: ReportResourceRequest = {
  type: "host",
  reporterType: "hbi",
  reporterInstanceId: "0a2a430e-1ad9-4304-8e75-cc6fd3b5441a",
  representations,
};

(async () => {
  try {
    const response = await client.reportResource(reportResourceRequest);
    console.log("Resource reported successfully:");
    console.log(response);
  } catch (error) {
    console.log("gRPC error occurred during Resource reporting:");
    console.log(`Exception:`, error);
  }
})();
