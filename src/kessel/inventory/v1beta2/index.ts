import { KesselInventoryServiceClient } from "./inventory_service";
import {
  ClientBuilderFactory, GRpcClientBuilder, PromisifiedClient
} from "../../grpc";

export const ClientBuilder = ClientBuilderFactory(KesselInventoryServiceClient);
