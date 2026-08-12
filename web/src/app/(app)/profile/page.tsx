"use client";

import { useState } from "react";

import { useSession } from "@/components/session-context";
import { Chip, Dialog, ErrorState, Field, Heading, InfoLine, Loading, Toast } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import { messageOf, useAsync, useToast } from "@/lib/hooks";
import { ROLE_LABEL, type UserRequest, type UserResponse } from "@/lib/types";
import { validateProfile } from "@/lib/validators";

/**
 * Equivalente de ProfileScreen, más el caso que la app Android no cubre:
 * si el perfil todavía no existe en el microservicio users, se ofrece crearlo.
 * Sin perfil el backend rechaza las reservas con 409.
 */
export default function ProfilePage() {
  const session = useSession();
  const { toast, notify, dismiss } = useToast();
  const [editing, setEditing] = useState(false);

  const { data, loading, error, reload } = useAsync<{ profile: UserResponse | null; missing: boolean }>(
    async () => {
      try {
        return { profile: await api.profile(), missing: false };
      } catch (caught) {
        if (caught instanceof ApiError && caught.status === 404) return { profile: null, missing: true };
        throw caught;
      }
    },
    [],
  );

  if (loading && !data) return <Loading />;
  if (error && !data) return <ErrorState message={error} onRetry={reload} />;

  const profile = data?.profile ?? null;

  return (
    <>
      <Heading title="Mi perfil" subtitle="Tus datos en el microservicio users." />

      {data?.missing ? (
        <div className="banner" data-tone="info">
          Todavía no tienes perfil en el backend. Créalo para poder reservar canchas e inscribir equipos.
        </div>
      ) : null}

      <section className="card" style={{ display: "grid", justifyItems: "center", textAlign: "center" }}>
        <div className="login-logo" aria-hidden style={{ marginBottom: 12 }}>
          👤
        </div>
        <h2>{profile?.name ?? session.username}</h2>
        <Chip>{ROLE_LABEL[session.role]}</Chip>

        <div style={{ width: "100%", marginTop: 22, textAlign: "left" }}>
          <InfoLine label="Usuario Cognito" value={session.username} />
          <InfoLine label="Correo" value={profile?.email ?? "Sin correo"} />
          <InfoLine label="Teléfono" value={profile?.phone ?? "Sin teléfono"} />
          {profile ? <InfoLine label="Grupos" value={session.groups.join(", ") || "—"} /> : null}
        </div>

        <button type="button" className="btn btn-block" style={{ marginTop: 22 }} onClick={() => setEditing(true)}>
          {profile ? "Editar perfil" : "Crear perfil"}
        </button>
      </section>

      {editing ? (
        <ProfileFormDialog
          profile={profile}
          fallbackName={session.username}
          onClose={() => setEditing(false)}
          onSaved={(message) => {
            setEditing(false);
            notify(message);
            void reload();
          }}
        />
      ) : null}

      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={dismiss} /> : null}
    </>
  );
}

function ProfileFormDialog({
  profile,
  fallbackName,
  onClose,
  onSaved,
}: {
  profile: UserResponse | null;
  fallbackName: string;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [name, setName] = useState(profile?.name ?? fallbackName);
  const [email, setEmail] = useState(profile?.email ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    const invalid = validateProfile(name, email, phone);
    if (invalid) {
      setError(invalid);
      return;
    }
    setSaving(true);
    setError(null);
    const body: UserRequest = {
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
    };
    try {
      if (profile) {
        await api.updateProfile(body);
        onSaved("Perfil actualizado correctamente.");
      } else {
        await api.createProfile(body);
        onSaved("Perfil creado correctamente.");
      }
    } catch (caught) {
      setError(messageOf(caught));
      setSaving(false);
    }
  }

  return (
    <Dialog title={profile ? "Editar perfil" : "Crear perfil"} onClose={onClose}>
      <Field label="Nombre" value={name} onChange={setName} />
      <Field label="Correo" type="email" value={email} onChange={setEmail} />
      <Field label="Teléfono" value={phone} onChange={setPhone} hint="Entre 7 y 15 dígitos, opcional." />
      {error ? <p className="error-text">{error}</p> : null}
      <div className="btn-row">
        <button type="button" className="btn btn-text" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn" onClick={submit} disabled={saving}>
          {saving ? "Guardando…" : profile ? "Guardar cambios" : "Crear perfil"}
        </button>
      </div>
    </Dialog>
  );
}
