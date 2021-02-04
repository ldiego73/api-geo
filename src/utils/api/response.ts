import { HttpStatus } from "./http";
import { ProxyIntegration, Request } from "./request";

interface Result {
  isBase64Encoded: boolean;
  statusCode: number;
  statusDescription?: string;
  body: string;
  headers: {
    [key: string]: string | undefined;
  };
}

export interface OptionsCors {
  credentials?: boolean;
  exposeHeaders?: string;
  maxAge?: number;
}

export interface ResponseError {
  status: HttpStatus;
  code: string;
  message: string;
  data?: {
    [key: string]: unknown;
  };
}

export class Response {
  static cors: boolean = false;
  static credentials: boolean = false;

  private statusCode = HttpStatus.OK;
  private headers: {
    [key: string]: string | undefined;
  };

  constructor(private request: Request) {
    this.headers = Object.assign({}, request.headers);
  }

  status(code: HttpStatus): Response {
    this.statusCode = code;
    return this;
  }

  header(key: string, value: string): Response {
    this.headers[key.toLowerCase()] = value;
    return this;
  }

  cors(options?: OptionsCors): Response {
    const opts = options || {};

    if (opts.credentials) {
      this.headers["Access-Control-Allow-Credentials"] = "true";
    }

    if (opts.exposeHeaders) {
      this.headers["Access-Control-Expose-Headers"] = opts.exposeHeaders;
    }

    if (opts.maxAge && !isNaN(opts.maxAge)) {
      this.headers["Access-Control-Max-Age"] = (opts.maxAge / 1000 | 0).toString();
    }

    return this;
  }

  send(payload?: unknown): Result {
    let responseBody = typeof payload !== "string" ?
      JSON.stringify(payload) : (payload || "");

    if (Response.cors) {
      this.headers["Access-Control-Allow-Origin"] = "*";
      this.headers["Access-Control-Allow-Methods"] = "GET, PUT, POST, DELETE, OPTIONS";
      this.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Content-Length, X-Requested-With, X-Amz-Date, X-Api-Key, X-Amz-Security-Token";
    }

    if (Response.credentials) {
      this.headers["Access-Control-Allow-Credentials"] = "true";
    }

    let result: Result = {
      isBase64Encoded: this.request.isBase64Encoded,
      statusCode: this.statusCode,
      body: responseBody,
      headers: this.headers,
    }

    if (this.request.proxyIntegration === ProxyIntegration.ALB) {
      result.statusDescription = `${this.statusCode} ${HttpStatus[this.statusCode]}`;
    }

    return result;
  }

  json(body: any): Result {
    return this
      .header("content-type", "application/json")
      .send(body);
  }

  html(body: string): Result {
    return this
      .header("content-type", "text/html; charset=UTF-8")
      .send(body);
  }

  file(body: any): Result {
    return this
      .header("content-type", "application/octet-stream")
      .send(body);
  }

  error(payload: ResponseError): Result {
    return this.send({
      status: payload.status,
      code: payload.code,
      message: payload.message,
      ...(payload.data ?? {}),
    });
  }
}
