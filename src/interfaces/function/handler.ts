import { APIGatewayEvent, Context } from "aws-lambda";
import lambdaApi from "lambda-api";

import { createCors } from "./cors";
import { HealthCheckController } from "./controllers";
import { getAccountId, getRegion, getStage, isOffline } from "@config/env";

console.log("account id => ", getAccountId());
console.log("region => ", getRegion());
console.log("stage => ", getStage());
console.log("is offline => ", isOffline());

const api = lambdaApi({
  base: "geo",
  logger: true,
  errorHeaderWhitelist: [
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Headers",
  ],
});

api.use((req, res, next) => {
  createCors(res);

  console.log("Route => ", req.route);
  console.log("Path => ", req.path);

  next();
});

api.options("/*", (_, res) => {
  createCors(res);

  res.status(200).json({});
});

api.get("/healthcheck", HealthCheckController.get);

export async function router(
  event: APIGatewayEvent,
  context: Context
): Promise<any> {
  return await api.run(event, context);
}

async function close(signal: unknown) {
  console.log(`Received signal to terminate: ${signal}`);
  console.log(`Events closed`);

  process.exit();
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
