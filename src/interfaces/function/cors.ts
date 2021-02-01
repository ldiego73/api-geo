import { Response } from "lambda-api";

export function createCors(res: Response): void {
  res.cors({
    headers:
      "Content-Type, Authorization, Content-Length, X-Requested-With, access-control-allow-origin",
  });
}
