import { BaseException } from "./exception";

export class EnvVariableException extends BaseException {
  constructor(name: string) {
    super("ENV_VARIABLE_EXCEPTION", `Variable "${name}" not exists`);
  }
}

export function getEnv(name: string, defaultValue?: unknown): unknown {
  const value = process.env[name];

  if (value) return value;
  else if (defaultValue) return defaultValue;

  throw new EnvVariableException(name);
}
