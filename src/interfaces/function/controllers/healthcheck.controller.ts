import { Request, Response } from "lambda-api";
import { HttpStatus } from "@utils/http";

export class HealthCheckController {
  static async get(_: Request, res: Response): Promise<void> {
    res.status(HttpStatus.NO_CONTENT).send("");
  }
}
