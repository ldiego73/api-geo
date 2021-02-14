import { APIGatewayEvent, Context } from "aws-lambda";
import {
  Api,
  ApiRequest,
  ApiResponse,
  ApiRouter,
  HttpStatus,
} from "micro-lambda-api";

import { HealthCheckController } from "./controllers";
import { getAccountId, getRegion, getStage, isOffline } from "@config/env";

console.log("account id => ", getAccountId());
console.log("region => ", getRegion());
console.log("stage => ", getStage());
console.log("is offline => ", isOffline());

const api = new Api({ logger: { trace: true } });
const router = new ApiRouter({ basePath: "/geo" });

router.get("/", (req: ApiRequest, res: ApiResponse) => {
  req.log.info("request data", {
    id: req.id,
    method: req.method,
    path: req.path,
    integration: req.proxyIntegration,
  });

  res.status(HttpStatus.OK).send({
    id: req.id,
    message: "Endpoint /",
  });
});

router.get("/error", () => {
  throw Error("error caused!!!");
});

router.get("/healthcheck", HealthCheckController.get);

ApiResponse.cors = true;
ApiResponse.credentials = true;

api.use(router.routes());

export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<any> {
  console.log("Event => ", event);
  console.log("Context => ", context);

  return await api.listen(event, context);
}

async function close(signal: unknown) {
  console.log(`Received signal to terminate: ${signal}`);
  console.log(`Events closed`);

  process.exit();
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
