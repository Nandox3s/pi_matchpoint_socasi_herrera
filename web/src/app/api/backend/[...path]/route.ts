import { NextRequest, NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/config";
import { refresh } from "@/lib/cognito";
import { clearTokens, readAccessToken, readRefreshToken, saveTokens } from "@/lib/session";

/**
 * Proxy servidor -> backend MatchPoint.
 *
 * Existe por dos razones:
 *  1. Vercel sirve HTTPS y el gateway Nginx del backend habla HTTP puro. Una llamada
 *     directa desde el navegador seria bloqueada por mixed content; esta funcion corre
 *     en el servidor, donde esa restriccion no aplica.
 *  2. Mantiene el access token en cookies httpOnly, fuera del alcance del JavaScript.
 *
 * Replica AuthInterceptor + TokenAuthenticator del cliente Android: adjunta el Bearer y,
 * ante un 401, refresca el token con Cognito y reintenta una sola vez.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

async function forward(request: NextRequest, path: string[]): Promise<NextResponse> {
  const target = `${API_BASE_URL}/${path.join("/")}${request.nextUrl.search}`;

  const accessToken = await readAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body =
    request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase()) && key.toLowerCase() !== "cookie") {
      headers.set(key, value);
    }
  });
  if (body) headers.set("content-type", request.headers.get("content-type") ?? "application/json");

  const send = (token: string) =>
    fetch(target, {
      method: request.method,
      headers: new Headers([...headers.entries(), ["authorization", `Bearer ${token}`]]),
      body: body && body.length > 0 ? body : undefined,
      cache: "no-store",
      redirect: "manual",
    });

  let upstream: Response;
  try {
    upstream = await send(accessToken);
  } catch {
    return NextResponse.json(
      { error: `No se pudo conectar con el backend (${API_BASE_URL}). Verifica que el gateway esté encendido.` },
      { status: 503 },
    );
  }

  if (upstream.status === 401) {
    const refreshToken = await readRefreshToken();
    const renewed = refreshToken ? await refresh(refreshToken) : null;
    if (renewed) {
      await saveTokens(renewed.accessToken, renewed.refreshToken);
      try {
        upstream = await send(renewed.accessToken);
      } catch {
        return NextResponse.json({ error: "No se pudo conectar con el backend." }, { status: 503 });
      }
    } else {
      await clearTokens();
    }
  }

  const payload = await upstream.text();
  const response = new NextResponse(payload || null, { status: upstream.status });
  const contentType = upstream.headers.get("content-type");
  if (contentType) response.headers.set("content-type", contentType);
  return response;
}

type Context = { params: Promise<{ path: string[] }> };

async function handler(request: NextRequest, context: Context): Promise<NextResponse> {
  const { path } = await context.params;
  return forward(request, path);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
