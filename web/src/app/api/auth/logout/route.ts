import { NextResponse } from "next/server";

import { clearTokens } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(): Promise<NextResponse> {
  await clearTokens();
  return NextResponse.json({ ok: true });
}
