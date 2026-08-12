import { NextRequest, NextResponse } from "next/server";
import { CognitoError, signUp } from "@/lib/cognito";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { username?: string; password?: string; email?: string };
    const username = (body.username ?? "").trim();
    const password = body.password ?? "";
    const email = (body.email ?? "").trim().toLowerCase();
    if (!/^[A-Za-z0-9._-]{3,40}$/.test(username))
      return NextResponse.json({ error: "El usuario debe tener entre 3 y 40 caracteres válidos." }, { status: 400 });
    if (password.length < 8)
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "Ingresa un correo válido." }, { status: 400 });
    return NextResponse.json(await signUp(username, password, email), { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
    if (error instanceof CognitoError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof Error && error.message.includes("COGNITO_APP_CLIENT_ID"))
      return NextResponse.json({ error: error.message }, { status: 503 });
    return NextResponse.json({ error: "No se pudo crear la cuenta." }, { status: 500 });
  }
}
