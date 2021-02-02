import { APIGatewayEvent, Context } from "aws-lambda";
import lambdaApi from "lambda-api";

import { createCors } from "./cors";
import { HealthCheckController } from "./controllers";
import { getAccountId, getRegion, getStage, isOffline } from "@config/env";
// import { Api, Request } from "@utils/api";

console.log("account id => ", getAccountId());
console.log("region => ", getRegion());
console.log("stage => ", getStage());
console.log("is offline => ", isOffline());

/*
const apiV2 = new Api({ basePath: "/geo" });

apiV2.get("/", (req: Request) => {
  console.log("request id => ", req.id);
  console.log("method => ", req.method);
  console.log("path => ", req.path);
  console.log("params => ", req.params);
  console.log("headers => ", req.headers);
  console.log("cookies => ", req.cookies);
  console.log("body => ", req.body);
  console.log("ip => ", req.ip);
  console.log("host => ", req.host);
  console.log("user agent => ", req.userAgent);
  console.log("stage => ", req.stage);
});
*/

const api = lambdaApi({
  base: "geo",
  logger: true,
  errorHeaderWhitelist: [
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Headers",
  ],
});

api.use((_, res, next) => {
  createCors(res);

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
  console.log("Event => ", event);
  console.log("Context => ", context);
  // return await apiV2.listen(event, context);

  return await api.run(event, context);
}

async function close(signal: unknown) {
  console.log(`Received signal to terminate: ${signal}`);
  console.log(`Events closed`);

  process.exit();
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
