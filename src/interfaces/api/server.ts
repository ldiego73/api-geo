import fastify from "fastify";

import { HealthCheckController } from "./controllers";

import { getAccountId, getRegion, getStage, isOffline } from "@config/env";

console.log("account id => ", getAccountId());
console.log("region => ", getRegion());
console.log("stage => ", getStage());
console.log("is offline => ", isOffline());

const server = fastify();

server.register(require("fastify-cors"));
server.register(
  (router, _, done) => {
    router.get("/healthcheck", {}, HealthCheckController.get);

    done();
  },
  { prefix: "/geo" }
);

server.listen(3000, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

async function close(signal: unknown) {
  console.log(`Received signal to terminate: ${signal}`);

  await server.close();

  console.log(`Events closed`);

  process.exit();
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
