import {
  ClientBuilder,
  type KeepaliveOptions,
} from "@project-kessel/kessel-sdk/kessel/inventory/v1beta2";
import "dotenv/config";

const keepalive: KeepaliveOptions = {
  interval: 30_000,
  timeout: 8_000,
  permitWithoutCalls: false,
};

const client = new ClientBuilder(process.env.KESSEL_ENDPOINT!)
  .insecure()
  .keepalive(keepalive)
  .buildAsync();

// Omit `.keepalive(keepalive)` to use the 45,000 ms / 10,000 ms / true defaults.
// Reuse this client for the application's lifetime; this config-only example
// closes it immediately because it does not make an RPC.
client.close();
