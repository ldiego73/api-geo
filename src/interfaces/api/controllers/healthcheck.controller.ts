import { FastifyRequest, FastifyReply } from "fastify";
import { HttpStatus } from "micro-lambda-api";

export class HealthCheckController {
  static async get(_: FastifyRequest, res: FastifyReply): Promise<void> {
    res.code(HttpStatus.NO_CONTENT).send("");
  }
}
