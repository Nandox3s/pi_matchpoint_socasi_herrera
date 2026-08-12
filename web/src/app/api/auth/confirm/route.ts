import { NextRequest, NextResponse } from "next/server";
import { CognitoError, confirmSignUp, resendConfirmationCode } from "@/lib/cognito";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { username?: string; code?: string; resend?: boolean };
    const username = (body.username ?? "").trim();
    if (!username) return NextResponse.json({ error: "Falta el nombre de usuario." }, { status: 400 });
    if (body.resend) return NextResponse.json({ destination: await resendConfirmationCode(username) });
    const code = (body.code ?? "").trim();
    if (!/^\d{6}$/.test(code))
      return NextResponse.json({ error: "Ingresa el código de 6 dígitos." }, { status: 400 });
    await confirmSignUp(username, code);
    return NextResponse.json({ confirmed: true });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
    if (error instanceof CognitoError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof Error && error.message.includes("COGNITO_APP_CLIENT_ID"))
      return NextResponse.json({ error: error.message }, { status: 503 });
    return NextResponse.json({ error: "No se pudo confirmar la cuenta." }, { status: 500 });
  }
}
