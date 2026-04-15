import {
  principalFromRHIdentity,
  principalFromRHIdentityHeader,
} from "@project-kessel/kessel-sdk/kessel/console";


// --- From a parsed User identity object ---
const userIdentity = {
  type: "User",
  org_id: "12345",
  user: { user_id: "7393748", username: "jdoe" },
};

let subject = principalFromRHIdentity(userIdentity);
console.log(`User principal:            ${subject.resource?.resourceId}`);

// --- From a parsed ServiceAccount identity object ---
const saIdentity = {
  type: "ServiceAccount",
  org_id: "456",
  service_account: {
    user_id: "12345",
    client_id: "b69eaf9e-e6a6-4f9e-805e-02987daddfbd",
    username: "service-account-b69eaf9e",
  },
};

subject = principalFromRHIdentity(saIdentity);
console.log(`ServiceAccount principal:  ${subject.resource?.resourceId}`);

// --- From a raw base64-encoded x-rh-identity header ---
const headerPayload = {
  identity: {
    type: "User",
    org_id: "12345",
    user: { user_id: "7393748", username: "jdoe" },
  },
};

const header = Buffer.from(JSON.stringify(headerPayload)).toString("base64");
subject = principalFromRHIdentityHeader(header);
console.log(`From header principal:     ${subject.resource?.resourceId}`);
