import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as dotenv from "dotenv";
import { resolve } from "path";

const path = resolve(process.cwd(), ".env");

dotenv.config({ path });

const { ACCOUNT_ID, REGION, STAGE } = process.env;

const geoFunctionRole = new aws.iam.Role("geoFunctionRole", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: "lambda.amazonaws.com",
  }),
});

const geoFunctionRoleAttachment = new aws.iam.RolePolicyAttachment(
  "geoFunctionRoleAttachment",
  {
    role: geoFunctionRole,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
  }
);

const geImage = awsx.ecr.buildAndPushImage("geoFunctionImage", {
  context: "../../",
  dockerfile: "Dockerfile"
});

const geoFunction = new aws.lambda.Function("geoFunctionLambda", {
  packageType: "Image",
  imageUri: geImage.imageValue,
  role: geoFunctionRole.arn,
  timeout: 30,
  description: "Georeferencing api for address search",
  environment: {
    variables: {
      ACCOUNT_ID: ACCOUNT_ID as string,
      REGION: REGION as string,
      STAGE: STAGE as string,
    },
  },
});

const geoFunctionPermission = new aws.lambda.Permission(
  "geoFunctionPermission",
  {
    action: "lambda:InvokeFunction",
    principal: "apigateway.amazonaws.com",
    function: geoFunction,
  }
);

const geoFunctionApi = new aws.apigatewayv2.Api("geoFunctionApi", {
  protocolType: "HTTP",
  routeKey: "ANY /geo/{proxy+}",
  target: geoFunction.invokeArn,
});

export const geoFunctionName = geoFunction.id;
export const geoFunctionEndpoint = geoFunctionApi.apiEndpoint;
