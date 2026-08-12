import { redirect } from "next/navigation";

import LoginForm from "@/app/login/login-form";
import { COGNITO_APP_CLIENT_ID } from "@/lib/config";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return <LoginForm cognitoConfigured={COGNITO_APP_CLIENT_ID.length > 0} />;
}
