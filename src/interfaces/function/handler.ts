import { APIGatewayEvent, Context } from "aws-lambda";
// import lambdaApi from "lambda-api";

// import { HealthCheckController } from "./controllers";
import { getAccountId, getRegion, getStage, isOffline } from "@config/env";
import { Request } from "@utils/api/request";
import { Response } from "@utils/api/response";
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
*/

Response.cors = true;
Response.credentials = true;

export async function router(
  event: APIGatewayEvent,
  context: Context
): Promise<any> {
  console.log("Event => ", event);
  console.log("Context => ", context);

  const request = Request(event, context);

  console.log("Request => ", request);

  return new Response(request)
    .send(request.body);
}

async function close(signal: unknown) {
  console.log(`Received signal to terminate: ${signal}`);
  console.log(`Events closed`);

  process.exit();
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
