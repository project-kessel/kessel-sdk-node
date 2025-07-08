import { KesselInventoryHealthServiceClient } from "./health";
import { ClientBuilderFactory } from "../../grpc";

export const ClientBuilder = ClientBuilderFactory(
  KesselInventoryHealthServiceClient,
);
