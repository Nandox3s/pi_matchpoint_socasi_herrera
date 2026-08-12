"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Field } from "@/components/ui";
import { signIn } from "@/lib/api";
import { messageOf } from "@/lib/hooks";

/** Equivalente de LoginScreen: mismas validaciones y mismo flujo USER_AUTH de Cognito. */
export default function LoginForm({ cognitoConfigured }: { cognitoConfigured: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!username.trim() || password.length < 6) {
      setError("Ingresa usuario y contraseña válida.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn(username.trim(), password);
      router.replace("/dashboard");
      router.refresh();
    } catch (caught) {
      setError(messageOf(caught));
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-logo" aria-hidden>
          🏀
        </div>
        <h1>MatchPoint</h1>
        <p className="muted">Reserva. Compite. Gana.</p>

        {!cognitoConfigured ? (
          <div className="banner" style={{ marginTop: 22, textAlign: "left" }}>
            Falta configurar <code>COGNITO_APP_CLIENT_ID</code>. Sin esa variable de entorno el inicio de sesión no
            puede funcionar. Revisa <code>/api/health</code> para el diagnóstico completo.
          </div>
        ) : null}

        <form onSubmit={submit}>
          <Field
            label="Usuario"
            value={username}
            onChange={setUsername}
            autoComplete="username"
            placeholder="usuario de Cognito"
          />
          <Field
            label="Contraseña"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="btn btn-block" style={{ marginTop: 20 }} disabled={loading}>
            {loading ? "Ingresando…" : "Iniciar sesión"}
          </button>
        </form>

        <p className="field-hint" style={{ marginTop: 18 }}>
          Las credenciales se validan en AWS Cognito. El token queda en una cookie httpOnly y nunca es accesible desde
          el navegador.
        </p>
      </div>
    </main>
  );
}
