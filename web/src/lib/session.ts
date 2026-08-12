import "server-only";

import { cookies } from "next/headers";
import type { Session, UserRole } from "@/lib/types";

/**
 * Los tokens viven en cookies httpOnly: el JavaScript del navegador nunca los ve.
 * El proxy (/api/backend) es el unico que los lee para firmar las peticiones.
 */

export const ACCESS_COOKIE = "mp_access";
export const REFRESH_COOKIE = "mp_refresh";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;

interface AccessTokenClaims {
  username?: string;
  "cognito:username"?: string;
  "cognito:groups"?: string[];
  exp?: number;
  sub?: string;
}

/** Decodifica el payload del JWT. La firma la valida el backend (Spring Resource Server via JWKS). */
export function decodeAccessToken(token: string): AccessTokenClaims | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as AccessTokenClaims;
  } catch {
    return null;
  }
}

export function roleFromGroups(groups: string[] | undefined): UserRole | null {
  if (!groups) return null;
  if (groups.includes("MANAGER")) return "MANAGER";
  if (groups.includes("PLAYER")) return "PLAYER";
  return null;
}

export function sessionFromToken(token: string): Session | null {
  const claims = decodeAccessToken(token);
  if (!claims) return null;
  const groups = claims["cognito:groups"] ?? [];
  const role = roleFromGroups(groups);
  if (!role) return null;
  return {
    username: claims.username ?? claims["cognito:username"] ?? claims.sub ?? "usuario",
    role,
    groups,
    expiresAt: (claims.exp ?? 0) * 1000,
  };
}

export async function readAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function readRefreshToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value ?? null;
}

export async function getSession(): Promise<Session | null> {
  const token = await readAccessToken();
  return token ? sessionFromToken(token) : null;
}

export async function saveTokens(accessToken: string, refreshToken?: string): Promise<void> {
  const store = await cookies();
  // El access token dura ~1h; la cookie se mantiene 30 dias para poder refrescarlo.
  store.set(ACCESS_COOKIE, accessToken, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 30 });
  if (refreshToken) {
    store.set(REFRESH_COOKIE, refreshToken, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 30 });
  }
}

export async function clearTokens(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}
