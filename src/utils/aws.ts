import { SSM } from "aws-sdk";
import { BaseException } from "./exception";

export class ParameterException extends BaseException {
  constructor(name: string) {
    super("AWS_PARAMETER_EXCEPTION", `Parameter "${name}" not exists`);
  }
}

export async function getParam(name: string, defaultValue?: string): Promise<string> {
  const ssm = new SSM();

  try {
    const { Parameter } = await ssm
      .getParameter({ Name: name, WithDecryption: true })
      .promise();

    if (Parameter?.Value) return Parameter.Value;
    else if (defaultValue) return defaultValue;

    throw new ParameterException(name);
  } catch (err) {
    throw new ParameterException(name);
  }
}
