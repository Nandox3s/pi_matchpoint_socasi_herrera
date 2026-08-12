"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Field } from "@/components/ui";
import { confirmAccount, registerAccount, resendConfirmation, signIn } from "@/lib/api";
import { messageOf } from "@/lib/hooks";

type Mode = "login" | "register" | "confirm";

export default function LoginForm({ cognitoConfigured }: { cognitoConfigured: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function changeMode(next: Mode) {
    setMode(next);
    setError(null);
    setNotice(null);
  }

  async function submitLogin(event: React.FormEvent) {
    event.preventDefault();
    if (!username.trim() || password.length < 6) return setError("Ingresa usuario y contraseña válida.");
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

  async function submitRegister(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[A-Za-z0-9._-]{3,40}$/.test(username.trim()))
      return setError("Usa entre 3 y 40 letras, números, punto, guion o guion bajo.");
    if (!email.includes("@")) return setError("Ingresa un correo válido.");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (password !== confirmPassword) return setError("Las contraseñas no coinciden.");
    setLoading(true);
    setError(null);
    try {
      const result = await registerAccount(username.trim(), password, email.trim());
      if (result.confirmed) {
        changeMode("login");
        setNotice("Cuenta creada. Ya puedes iniciar sesión.");
      } else {
        changeMode("confirm");
        setNotice(`Enviamos un código${result.destination ? ` a ${result.destination}` : " a tu correo"}.`);
      }
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setLoading(false);
    }
  }

  async function submitConfirmation(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await confirmAccount(username.trim(), code.trim());
      changeMode("login");
      setNotice("Correo confirmado. Ya puedes iniciar sesión.");
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setLoading(true);
    setError(null);
    try {
      const result = await resendConfirmation(username.trim());
      setNotice(`Código reenviado${result.destination ? ` a ${result.destination}` : ""}.`);
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-logo" aria-hidden>🏀</div>
        <h1>MatchPoint</h1>
        <p className="muted">Reserva. Compite. Gana.</p>

        {!cognitoConfigured ? (
          <div className="banner login-banner">Falta configurar <code>COGNITO_APP_CLIENT_ID</code>.</div>
        ) : null}
        {notice ? <div className="banner login-banner" data-tone="info">{notice}</div> : null}

        {mode !== "confirm" ? (
          <div className="auth-tabs" role="tablist" aria-label="Acceso">
            <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => changeMode("login")}>Ingresar</button>
            <button type="button" role="tab" aria-selected={mode === "register"} onClick={() => changeMode("register")}>Crear cuenta</button>
          </div>
        ) : null}

        {mode === "login" ? (
          <form onSubmit={submitLogin}>
            <Field label="Usuario" value={username} onChange={setUsername} autoComplete="username" />
            <Field label="Contraseña" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
            {error ? <p className="error-text">{error}</p> : null}
            <button type="submit" className="btn btn-block" disabled={loading || !cognitoConfigured}>{loading ? "Ingresando…" : "Iniciar sesión"}</button>
          </form>
        ) : null}

        {mode === "register" ? (
          <form onSubmit={submitRegister}>
            <Field label="Usuario" value={username} onChange={setUsername} autoComplete="username" placeholder="fernando.socasi" />
            <Field label="Correo" type="email" value={email} onChange={setEmail} autoComplete="email" />
            <Field label="Contraseña" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
            <Field label="Repetir contraseña" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
            <p className="field-hint">Las cuentas públicas son para jugadores. El rol MANAGER se asigna únicamente por administración.</p>
            {error ? <p className="error-text">{error}</p> : null}
            <button type="submit" className="btn btn-block" disabled={loading || !cognitoConfigured}>{loading ? "Creando…" : "Crear cuenta"}</button>
          </form>
        ) : null}

        {mode === "confirm" ? (
          <form onSubmit={submitConfirmation}>
            <h2>Confirma tu correo</h2>
            <p className="muted confirm-copy">Escribe el código enviado por Cognito para activar <strong>{username}</strong>.</p>
            <Field label="Código de 6 dígitos" value={code} onChange={setCode} autoComplete="one-time-code" inputMode="numeric" />
            {error ? <p className="error-text">{error}</p> : null}
            <button type="submit" className="btn btn-block" disabled={loading}>{loading ? "Confirmando…" : "Confirmar cuenta"}</button>
            <button type="button" className="btn btn-text btn-block" disabled={loading} onClick={resend}>Reenviar código</button>
            <button type="button" className="btn btn-text btn-block" onClick={() => changeMode("login")}>Volver al ingreso</button>
          </form>
        ) : null}

        <p className="field-hint login-security">Cognito valida las credenciales. Los tokens permanecen en cookies httpOnly y no son accesibles desde JavaScript.</p>
      </div>
    </main>
  );
}
