import { KesselInventoryServiceClient } from "./inventory_service";
import { clientBuilderForStub } from "..";

/**
 * Client builder for the Kessel Inventory Service (v1beta2).
 *
 * Construct a client for a gRPC target and configure authentication and
 * optional keepalive settings with the fluent methods inherited from the shared
 * `ClientBuilder`. Keepalive is enabled by default with a 45-second ping
 * interval, a 10-second acknowledgement timeout, and pings permitted without
 * active calls. Call `.keepalive()` to customize these defaults. `build()`
 * returns the callback-based client; `buildAsync()` returns its Promise-based
 * unary-method wrapper.
 *
 * @example
 * ```typescript
 * import { ClientBuilder } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";
 *
 * const client = new ClientBuilder("localhost:9000")
 *   .insecure()
 *   .buildAsync();
 *
 * // This config-only sample closes immediately. In an app, reuse the client
 * // and close it once on shutdown.
 * client.close();
 * ```
 */
export const ClientBuilder = clientBuilderForStub(KesselInventoryServiceClient);

export type { KeepaliveOptions } from "..";
