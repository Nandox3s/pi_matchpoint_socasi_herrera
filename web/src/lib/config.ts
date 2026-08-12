import "server-only";

/**
 * Configuracion de servidor. Ninguno de estos valores llega al navegador:
 * el token nunca sale de las funciones serverless.
 */

function trimSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export const API_BASE_URL = trimSlash(
  process.env.API_BASE_URL ?? "http://18.234.231.25:9090",
);

export const COGNITO_REGION = process.env.COGNITO_REGION ?? "us-east-1";

export const COGNITO_APP_CLIENT_ID = (process.env.COGNITO_APP_CLIENT_ID ?? "").trim();

export const COGNITO_USER_POOL_ID = (process.env.COGNITO_USER_POOL_ID ?? "").trim();

export const COGNITO_ENDPOINT = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`;

export function assertCognitoConfigured(): void {
  if (!COGNITO_APP_CLIENT_ID) {
    throw new Error(
      "Falta COGNITO_APP_CLIENT_ID. Configúralo en las variables de entorno del hosting o en web/.env.local para desarrollo.",
    );
  }
}
