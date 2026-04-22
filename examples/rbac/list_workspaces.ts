import { ClientBuilder } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";
import { StreamedListObjectsResponse } from "../../src/kessel/inventory/v1beta2/streamed_list_objects_response";
import { principalSubject, listWorkspaces } from "../../src/kessel/rbac/v2";
import "dotenv/config";

(async () => {
  try {
    const client = new ClientBuilder(process.env.KESSEL_ENDPOINT!)
      .insecure()
      .buildAsync();

    // Iterate one-by-one (lazy, constant memory)
    console.log("Listing workspaces\n");
    for await (const response of listWorkspaces(
      client,
      principalSubject("alice", "redhat"),
      "view_document",
    )) {
      console.log(`Workspace: ${response.object?.resourceId}`);
    }

    // Materialise all workspaces into an array
    console.log("\nCollecting all workspaces into an array:");
    const allWorkspaces: StreamedListObjectsResponse[] = [];
    for await (const response of listWorkspaces(
      client,
      principalSubject("alice", "redhat"),
      "view_document",
    )) {
      allWorkspaces.push(response);
    }
    console.log(`Total workspaces: ${allWorkspaces.length}`);
  } catch (e) {
    console.error(`Error received when listing workspaces`, e);
  }
})();
