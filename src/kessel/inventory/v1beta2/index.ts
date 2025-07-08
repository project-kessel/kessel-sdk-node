import { KesselInventoryServiceClient } from "./inventory_service";
import { ClientBuilderFactory } from "../../grpc";

export const ClientBuilder = ClientBuilderFactory(KesselInventoryServiceClient);
