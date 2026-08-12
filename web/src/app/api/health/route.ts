import { NextResponse } from "next/server";

import {
  API_BASE_URL,
  COGNITO_APP_CLIENT_ID,
  COGNITO_REGION,
  COGNITO_USER_POOL_ID,
} from "@/lib/config";

/**
 * Diagnostico de despliegue. Abre /api/health en el hosting para saber, sin iniciar sesion,
 * si el backend responde y si las variables de entorno estan completas.
 * No expone secretos: solo indica si cada valor esta configurado.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const started = Date.now();
  let gateway: { reachable: boolean; status?: number; detail?: string };

  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    gateway = { reachable: true, status: response.status, detail: (await response.text()).slice(0, 120) };
  } catch (error) {
    gateway = {
      reachable: false,
      detail: error instanceof Error ? error.message : "error desconocido",
    };
  }

  const cognitoReady = COGNITO_APP_CLIENT_ID.length > 0;

  return NextResponse.json(
    {
      ok: gateway.reachable && cognitoReady,
      apiBaseUrl: API_BASE_URL,
      gateway,
      cognito: {
        region: COGNITO_REGION,
        appClientIdConfigured: cognitoReady,
        userPoolIdConfigured: COGNITO_USER_POOL_ID.length > 0,
      },
      elapsedMs: Date.now() - started,
    },
    { status: gateway.reachable && cognitoReady ? 200 : 503 },
  );
}
