import "server-only";

import {
  COGNITO_APP_CLIENT_ID,
  COGNITO_ENDPOINT,
  assertCognitoConfigured,
} from "@/lib/config";

/**
 * Reproduce el flujo de AuthRepository.login del cliente Android:
 * InitiateAuth(USER_PASSWORD_AUTH).
 * El App Client debe ser publico (sin secret) y tener ALLOW_USER_PASSWORD_AUTH habilitado.
 */

interface CognitoAuthResult {
  AccessToken?: string;
  IdToken?: string;
  RefreshToken?: string;
  ExpiresIn?: number;
  TokenType?: string;
}

interface CognitoAuthResponse {
  AuthenticationResult?: CognitoAuthResult;
  ChallengeName?: string;
  Session?: string;
}

export interface CognitoTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export class CognitoError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "CognitoError";
    this.code = code;
  }
}

const FRIENDLY_ERRORS: Record<string, string> = {
  NotAuthorizedException: "Usuario o contraseña incorrectos.",
  UserNotFoundException: "Usuario o contraseña incorrectos.",
  UserNotConfirmedException: "La cuenta aún no está confirmada en Cognito.",
  PasswordResetRequiredException: "Debes restablecer tu contraseña en Cognito.",
  TooManyRequestsException: "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
  InvalidParameterException:
    "Cognito rechazó la petición. Verifica que el App Client sea público (sin secret) y tenga ALLOW_USER_PASSWORD_AUTH habilitado.",
  ResourceNotFoundException:
    "El App Client de Cognito no existe en esta región. Revisa COGNITO_APP_CLIENT_ID y COGNITO_REGION.",
};

async function callCognito(
  target: "InitiateAuth" | "RespondToAuthChallenge",
  body: unknown,
): Promise<CognitoAuthResponse> {
  const response = await fetch(COGNITO_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": `AWSCognitoIdentityProviderService.${target}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const raw = await response.text();
  const payload: unknown = raw ? JSON.parse(raw) : {};

  if (!response.ok) {
    const error = payload as { __type?: string; message?: string };
    const code = (error.__type ?? "UnknownException").split("#").pop() ?? "UnknownException";
    throw new CognitoError(FRIENDLY_ERRORS[code] ?? error.message ?? "No se pudo autenticar con Cognito.", code);
  }

  return payload as CognitoAuthResponse;
}

export async function login(username: string, password: string): Promise<CognitoTokens> {
  assertCognitoConfigured();

  const start = await callCognito("InitiateAuth", {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: COGNITO_APP_CLIENT_ID,
    AuthParameters: { USERNAME: username, PASSWORD: password },
  });

  let response = start;
  if (!start.AuthenticationResult) {
    if (start.ChallengeName !== "PASSWORD" || !start.Session) {
      throw new CognitoError(
        `Cognito requiere completar el desafío ${start.ChallengeName ?? "desconocido"}, que esta aplicación no maneja.`,
        start.ChallengeName ?? "UnsupportedChallenge",
      );
    }
    response = await callCognito("RespondToAuthChallenge", {
      ChallengeName: "PASSWORD",
      ClientId: COGNITO_APP_CLIENT_ID,
      Session: start.Session,
      ChallengeResponses: { USERNAME: username, PASSWORD: password },
    });
  }

  const result = response.AuthenticationResult;
  if (!result?.AccessToken) {
    throw new CognitoError("No se pudo completar la autenticación de Cognito.", "MissingAccessToken");
  }

  return {
    accessToken: result.AccessToken,
    refreshToken: result.RefreshToken,
    expiresIn: result.ExpiresIn ?? 3600,
  };
}

/** Equivalente a TokenAuthenticator: canjea el refresh token por un access token nuevo. */
export async function refresh(refreshToken: string): Promise<CognitoTokens | null> {
  if (!COGNITO_APP_CLIENT_ID) return null;

  try {
    const response = await callCognito("InitiateAuth", {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: COGNITO_APP_CLIENT_ID,
      AuthParameters: { REFRESH_TOKEN: refreshToken },
    });
    const result = response.AuthenticationResult;
    if (!result?.AccessToken) return null;
    return {
      accessToken: result.AccessToken,
      refreshToken: result.RefreshToken,
      expiresIn: result.ExpiresIn ?? 3600,
    };
  } catch {
    return null;
  }
}
