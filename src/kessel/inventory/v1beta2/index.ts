import { KesselInventoryServiceClient } from "./inventory_service";
import { clientBuilderForStub } from "..";

/**
 * Client builder for the Kessel Inventory Service (v1beta2).
 *
 * Construct a client for a gRPC target and configure authentication and keepalive
 * settings with the fluent methods inherited from the shared `ClientBuilder`.
 * `build()` returns the callback-based client; `buildAsync()` returns its
 * Promise-based unary-method wrapper.
 *
 * @example
 * ```typescript
 * import {
 *   ClientBuilder,
 *   type KeepaliveOptions,
 * } from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";
 *
 * const keepalive: KeepaliveOptions = { interval: 60_000 };
 * const client = new ClientBuilder("localhost:9000")
 *   .insecure()
 *   .keepalive(keepalive)
 *   .buildAsync();
 *
 * // This config-only sample closes immediately. In an app, reuse the client
 * // and close it once on shutdown.
 * client.close();
 * ```
 */
export const ClientBuilder = clientBuilderForStub(KesselInventoryServiceClient);

export type { KeepaliveOptions } from "..";
