import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import * as dotenv from "dotenv";
import { resolve } from "path";

const path = resolve(process.cwd(), "../../.env");

dotenv.config({ path });

const { ACCOUNT_ID, REGION, STAGE } = process.env;

const stack = pulumi.getStack();

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
  memorySize: 1024,
  description: "Georeferencing api for address search",
  environment: {
    variables: {
      ACCOUNT_ID: ACCOUNT_ID as string,
      REGION: REGION as string,
      STAGE: STAGE as string,
    },
  },
});

const geoFunctionApi = new aws.apigatewayv2.Api("geoFunctionApi", {
  protocolType: "HTTP",
});

const geoFunctionPermission = new aws.lambda.Permission(
  "geoFunctionPermission",
  {
    action: "lambda:InvokeFunction",
    principal: "apigateway.amazonaws.com",
    function: geoFunction,
    sourceArn: pulumi.interpolate`${geoFunctionApi.executionArn}/*/*`,
  }
  , { dependsOn: [geoFunctionApi, geoFunction] });

const geoFunctionApiIntegration = new aws.apigatewayv2.Integration("geoFunctionApiIntegration", {
  apiId: geoFunctionApi.id,
  integrationType: "AWS_PROXY",
  integrationUri: geoFunction.arn,
  integrationMethod: "POST",
  payloadFormatVersion: "2.0",
  passthroughBehavior: "WHEN_NO_MATCH",
});

const geoFunctionApiRoute = new aws.apigatewayv2.Route("geoFunctionApiRoute", {
  apiId: geoFunctionApi.id,
  routeKey: "ANY /geo/{proxy+}",
  target: pulumi.interpolate`integrations/${geoFunctionApiIntegration.id}`,
});

const geoFunctionApiStage = new aws.apigatewayv2.Stage("geoFunctionApiStage", {
  apiId: geoFunctionApi.id,
  name: stack,
  routeSettings: [
    {
      routeKey: geoFunctionApiRoute.routeKey,
      throttlingBurstLimit: 5000,
      throttlingRateLimit: 10000,
    },
  ],
  autoDeploy: true,
}, { dependsOn: [geoFunctionApiRoute] });

export const geoFunctionName = geoFunction.id;
export const geoFunctionEndpoint = pulumi.interpolate`${geoFunctionApi.apiEndpoint}/${geoFunctionApiStage.name}`;
