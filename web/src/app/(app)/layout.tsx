import { redirect } from "next/navigation";

import AppShell from "@/app/(app)/app-shell";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return <AppShell session={session}>{children}</AppShell>;
}
