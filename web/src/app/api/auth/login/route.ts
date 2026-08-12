import { NextRequest, NextResponse } from "next/server";

import { CognitoError, login } from "@/lib/cognito";
import { saveTokens, sessionFromToken } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let username = "";
  let password = "";

  try {
    const body = (await request.json()) as { username?: string; password?: string };
    username = (body.username ?? "").trim();
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  // Misma validacion que AuthViewModel.login del cliente Android.
  if (!username || password.length < 6) {
    return NextResponse.json({ error: "Ingresa usuario y contraseña válida." }, { status: 400 });
  }

  try {
    const tokens = await login(username, password);
    const session = sessionFromToken(tokens.accessToken);
    if (!session) {
      return NextResponse.json(
        { error: "La cuenta no pertenece a los grupos PLAYER ni MANAGER en Cognito." },
        { status: 403 },
      );
    }
    await saveTokens(tokens.accessToken, tokens.refreshToken);
    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof CognitoError) {
      const status = error.code === "NotAuthorizedException" || error.code === "UserNotFoundException" ? 401 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }
    const message = error instanceof Error ? error.message : "No se pudo iniciar sesión.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
