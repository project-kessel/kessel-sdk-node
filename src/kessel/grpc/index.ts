import { OAuth2ClientCredentials } from "../auth";
import { credentials, Metadata } from "@grpc/grpc-js";

export const oauth2CallCredentials = (auth: OAuth2ClientCredentials) => {
  return credentials.createFromMetadataGenerator(async (_options, callback) => {
    try {
      const token = (await auth.getToken()).accessToken;
      const metadata = new Metadata();
      metadata.add("Authorization", `Bearer ${token}`);
      callback(null, metadata);
    } catch (err) {
      callback(err instanceof Error ? err : new Error(String(err)));
    }
  });
};
