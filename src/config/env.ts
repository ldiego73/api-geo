import { getParam } from "@utils/aws";
import { getEnv } from "@utils/env";

export const getAccountId = () => getEnv("ACCOUNT_ID") as string;
export const getRegion = () => getEnv("REGION") as string;
export const getStage = () => getEnv("STAGE", "develop") as string;
export const isOffline = () => getEnv("IS_OFFLINE", false) === "true";

export const getGoogleMapsApiKey = () =>
  getParam(`${getStage()}/GOOGLE_MAPS_API_KEY`);
