import { ApiRequest, ApiResponse, HttpStatus } from "micro-lambda-api";

export class HealthCheckController {
  static async get(_: ApiRequest, res: ApiResponse): Promise<void> {
    res.status(HttpStatus.NO_CONTENT).send("");
  }
}
