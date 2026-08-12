"use client";

import { useEffect, useState } from "react";

import TournamentDetailDialog from "@/app/(app)/tournaments/tournament-detail";
import { TournamentCard } from "@/components/cards";
import { useSession } from "@/components/session-context";
import { Dialog, EmptyState, Field, Heading, StateView, Toast } from "@/components/ui";
import { api } from "@/lib/api";
import { messageOf, useAsync, useToast } from "@/lib/hooks";
import { TOURNAMENT_LABEL, type TournamentStatus } from "@/lib/types";
import { validateTournament } from "@/lib/validators";

const STATUSES: TournamentStatus[] = ["REGISTRATION", "IN_PROGRESS", "FINISHED"];

/** Equivalente de TournamentsScreen. */
export default function TournamentsPage() {
  const session = useSession();
  const isManager = session.role === "MANAGER";
  const { data, loading, error, reload } = useAsync(() => api.tournaments(), []);
  const { toast, notify, dismiss } = useToast();

  const [filter, setFilter] = useState<TournamentStatus | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  // Permite abrir un torneo directamente desde el dashboard (/tournaments?open=3).
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("open");
    if (requested) setOpenId(Number(requested));
  }, []);

  return (
    <>
      <Heading
        title={isManager ? "Mis torneos" : "Torneos"}
        subtitle={
          isManager ? "Crea competencias y lleva el cuadro al día." : "Inscribe a tu equipo y sigue el cuadro."
        }
      />

      <div className="filters">
        <button
          type="button"
          className="filter-chip"
          data-active={filter === null}
          onClick={() => setFilter(null)}
        >
          Todos
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            className="filter-chip"
            data-active={filter === status}
            onClick={() => setFilter(status)}
          >
            {TOURNAMENT_LABEL[status]}
          </button>
        ))}
      </div>

      <StateView
        loading={loading}
        error={error}
        data={data}
        onRetry={reload}
        isEmpty={(tournaments) => tournaments.length === 0}
        empty={
          <EmptyState
            title="No hay torneos"
            message={isManager ? "Crea el primero con el botón inferior." : "Vuelve pronto para descubrir nuevas competencias."}
          />
        }
      >
        {(tournaments) => {
          const filtered = tournaments.filter(
            (tournament) =>
              (!isManager || tournament.managerUser === session.username) &&
              (filter === null || tournament.status === filter),
          );

          if (filtered.length === 0) {
            return <EmptyState title="Sin torneos en esta categoría" message="Selecciona otro filtro." />;
          }

          return (
            <div className="grid">
              {filtered.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onOpen={() => setOpenId(tournament.id)}
                />
              ))}
            </div>
          );
        }}
      </StateView>

      {isManager ? (
        <button type="button" className="fab" onClick={() => setCreating(true)}>
          <span aria-hidden>＋</span> Crear torneo
        </button>
      ) : null}

      {openId !== null ? (
        <TournamentDetailDialog
          tournamentId={openId}
          onClose={() => setOpenId(null)}
          onChanged={(message) => {
            notify(message);
            void reload();
          }}
        />
      ) : null}

      {creating ? (
        <TournamentFormDialog
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            notify("Torneo creado correctamente.");
            void reload();
          }}
        />
      ) : null}

      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={dismiss} /> : null}
    </>
  );
}

function TournamentFormDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [maxTeams, setMaxTeams] = useState("4");
  const [prize, setPrize] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    const parsed = maxTeams.trim() === "" ? null : Number(maxTeams);
    const invalid = validateTournament(name, parsed);
    if (invalid) {
      setError(invalid);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.createTournament({
        name: name.trim(),
        sportType: "BASKET",
        maxTeams: parsed as number,
        prize: prize.trim() || null,
      });
      onSaved();
    } catch (caught) {
      setError(messageOf(caught));
      setSaving(false);
    }
  }

  return (
    <Dialog title="Crear torneo" onClose={onClose}>
      <Field label="Nombre" value={name} onChange={setName} />
      <Field
        label="Máximo de equipos"
        type="number"
        min={2}
        value={maxTeams}
        onChange={setMaxTeams}
        hint="Debe ser potencia de 2 (2, 4, 8, 16…) porque el cuadro es de eliminación directa."
      />
      <Field label="Premio (opcional)" value={prize} onChange={setPrize} />
      <p className="muted">Deporte: Básquet (único que expone el backend).</p>
      {error ? <p className="error-text">{error}</p> : null}
      <div className="btn-row">
        <button type="button" className="btn btn-text" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn" onClick={submit} disabled={saving}>
          {saving ? "Creando…" : "Crear torneo"}
        </button>
      </div>
    </Dialog>
  );
}
