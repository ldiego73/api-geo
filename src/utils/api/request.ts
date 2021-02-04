import qs from "querystring";

const parseBody = (body: any): any => {
  try {
    return JSON.parse(body);
  } catch (e) {
    return body;
  }
}

export enum ProxyIntegration {
  ALB = "elb",
  API_GATEWAY = "apigateway"
}

export interface Request {
  id: string;
  method: string;
  path: string;
  params: {
    [key: string]: string | undefined;
  };
  headers: {
    [key: string]: string | undefined;
  };
  body: any;
  host: string;
  ip: string;
  userAgent: string;
  stage: string;
  proxyIntegration: ProxyIntegration;
  isBase64Encoded: boolean;
  [key: string]: any;
}

export function Request(event: any, context: any): Request {
  const { requestContext, isBase64Encoded } = event;

  const id =
    context.awsRequestId ||
    requestContext.requestId;
  const rawStage = requestContext?.stage || "";
  const stage = rawStage === "$default" ? "" : rawStage;
  const method =
    event.httpMethod ||
    requestContext?.http?.method ||
    requestContext?.httpMethod ||
    undefined;

  let path = event.path || event.rawPath || "/";
  const routeKey = requestContext.resourcePath || requestContext.routeKey;
  if (rawStage && routeKey &&
    path.indexOf(`/${rawStage}/`) === 0 &&
    routeKey.indexOf(`/${rawStage}/`) !== 0) {
    path = path.substring(rawStage.length + 1)
  }

  const params = Object.assign({}, event.queryStringParameters);
  const headers: { [key: string]: any } = {};

  if (event.headers) {
    for (const header in event.headers) {
      headers[header.toLowerCase()] = event.headers[header];
    }
    headers["x-request-id"] = id;
  }

  const rawBody = isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString()
    : event.body;
  let body: any;

  if (headers['content-type'] && headers['content-type'].includes('application/x-www-form-urlencoded')) {
    body = qs.parse(rawBody);
  } else if (typeof rawBody === "object") {
    body = rawBody;
  } else {
    body = parseBody(rawBody);
  }

  const host = headers.host || requestContext.domainName;

  const rawIp =
    headers["x-forwarded-for"] ||
    requestContext?.http?.sourceIp ||
    requestContext.identity.sourceIp || "";
  const ip = rawIp.split(",")[0].trim();

  const userAgent = headers["user-agent"] ||
    requestContext?.http?.userAgent ||
    requestContext?.identity?.userAgent || "";
  const proxyIntegration = requestContext.elb ? ProxyIntegration.ALB : ProxyIntegration.API_GATEWAY;

  return {
    id,
    method,
    path,
    params,
    headers,
    body,
    host,
    ip,
    userAgent,
    stage,
    proxyIntegration,
    isBase64Encoded
  }
}
