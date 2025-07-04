import { ClientBuilderFactory } from "../../grpc";
import { KesselK8SPolicyIsPropagatedToK8SClusterServiceClient } from "./relationships/k8spolicy_ispropagatedto_k8scluster_service";
import { KesselK8sClusterServiceClient } from "./resources/k8s_clusters_service";
import { KesselK8sPolicyServiceClient } from "./resources/k8s_policies_service";
import { KesselNotificationsIntegrationServiceClient } from "./resources/notifications_integrations_service";
import { KesselRhelHostServiceClient } from "./resources/rhel_hosts_service";

export const KesselK8SPolicyIsPropagatedToK8SClusterClientBuilder =
  ClientBuilderFactory(KesselK8SPolicyIsPropagatedToK8SClusterServiceClient);
export const KesselK8sClusterClientBuilder = ClientBuilderFactory(
  KesselK8sClusterServiceClient,
);
export const KesselK8sPolicyClientBuilder = ClientBuilderFactory(
  KesselK8sPolicyServiceClient,
);
export const KesselNotificationsIntegrationClientBuilder = ClientBuilderFactory(
  KesselNotificationsIntegrationServiceClient,
);
export const KesselRhelHostClientBuilder = ClientBuilderFactory(
  KesselRhelHostServiceClient,
);
