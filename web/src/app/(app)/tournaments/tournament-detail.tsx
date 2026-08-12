"use client";

import { useState } from "react";

import { MatchCard, TeamCard } from "@/components/cards";
import { useSession } from "@/components/session-context";
import {
  Chip,
  ConfirmDialog,
  Dialog,
  EmptyState,
  ErrorState,
  Field,
  InfoLine,
  Loading,
} from "@/components/ui";
import { api } from "@/lib/api";
import { nowForInput } from "@/lib/format";
import { messageOf, useAsync } from "@/lib/hooks";
import { SPORT_LABEL, TOURNAMENT_LABEL, type MatchResponse, type TeamResponse } from "@/lib/types";
import { validateScore, validateTeam } from "@/lib/validators";

const TABS = ["Resumen", "Equipos", "Cuadro"] as const;
type Tab = (typeof TABS)[number];

/** Equivalente de TournamentDetailDialog: resumen, equipos y cuadro de eliminación directa. */
export default function TournamentDetailDialog({
  tournamentId,
  onClose,
  onChanged,
}: {
  tournamentId: number;
  onClose: () => void;
  onChanged: (message: string) => void;
}) {
  const session = useSession();
  const isManager = session.role === "MANAGER";
  const { data, loading, error, reload } = useAsync(
    () =>
      Promise.all([api.tournament(tournamentId), api.teams(tournamentId).catch(() => [] as TeamResponse[])]).then(
        ([progress, teams]) => ({ progress, teams }),
      ),
    [tournamentId],
  );

  const [tab, setTab] = useState<Tab>("Resumen");
  const [registering, setRegistering] = useState(false);
  const [confirmStart, setConfirmStart] = useState(false);
  const [teamDetail, setTeamDetail] = useState<TeamResponse | null>(null);
  const [managing, setManaging] = useState<MatchResponse | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function start() {
    setConfirmStart(false);
    try {
      await api.startTournament(tournamentId);
      onChanged("Torneo iniciado. El cuadro ya está generado.");
      void reload();
    } catch (caught) {
      setActionError(messageOf(caught));
    }
  }

  const title = data?.progress.tournament.name ?? "Torneo";

  return (
    <>
      <Dialog title={title} onClose={onClose}>
        {loading && !data ? <Loading /> : null}
        {error && !data ? <ErrorState message={error} onRetry={reload} /> : null}

        {data ? (
          <>
            <div className="card-title-row">
              <Chip positive={data.progress.tournament.status !== "FINISHED"}>
                {TOURNAMENT_LABEL[data.progress.tournament.status]}
              </Chip>
              <span className="muted">
                {data.progress.tournament.registeredTeams} / {data.progress.tournament.maxTeams} equipos
              </span>
            </div>

            {data.progress.tournament.status === "FINISHED" && data.progress.tournament.championTeamName ? (
              <div className="champion">
                <span>🏆 CAMPEÓN</span>
                <strong>{data.progress.tournament.championTeamName}</strong>
              </div>
            ) : null}

            <div className="tabs">
              {TABS.map((option) => (
                <button key={option} type="button" data-active={tab === option} onClick={() => setTab(option)}>
                  {option}
                </button>
              ))}
            </div>

            {actionError ? <div className="banner">{actionError}</div> : null}

            {tab === "Resumen" ? (
              <div>
                <InfoLine label="Deporte" value={SPORT_LABEL[data.progress.tournament.sportType]} />
                <InfoLine label="Estado" value={TOURNAMENT_LABEL[data.progress.tournament.status]} />
                <InfoLine label="Organiza" value={data.progress.tournament.managerUser} />
                {data.progress.tournament.prize ? (
                  <InfoLine label="Premio" value={data.progress.tournament.prize} />
                ) : null}
                {data.progress.tournament.courtName ? (
                  <InfoLine label="Cancha" value={data.progress.tournament.courtName} />
                ) : null}

                {!isManager && data.progress.tournament.status === "REGISTRATION" ? (
                  <button
                    type="button"
                    className="btn btn-block"
                    style={{ marginTop: 18 }}
                    onClick={() => setRegistering(true)}
                  >
                    Inscribir equipo
                  </button>
                ) : null}

                {isManager && data.progress.tournament.status === "REGISTRATION" ? (
                  <>
                    <p className="muted" style={{ marginTop: 18 }}>
                      {data.progress.tournament.registeredTeams === data.progress.tournament.maxTeams
                        ? "El torneo está listo para iniciar."
                        : `Faltan ${data.progress.tournament.maxTeams - data.progress.tournament.registeredTeams} equipos para iniciar.`}
                    </p>
                    <button
                      type="button"
                      className="btn btn-block"
                      style={{ marginTop: 10 }}
                      disabled={data.progress.tournament.registeredTeams !== data.progress.tournament.maxTeams}
                      onClick={() => setConfirmStart(true)}
                    >
                      Iniciar torneo
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}

            {tab === "Equipos" ? (
              data.teams.length === 0 ? (
                <EmptyState title="Sin equipos" message="Aún no hay equipos inscritos." />
              ) : (
                <div className="card-list">
                  {data.teams.map((team) => (
                    <TeamCard key={team.id} team={team} onOpen={() => setTeamDetail(team)} />
                  ))}
                </div>
              )
            ) : null}

            {tab === "Cuadro" ? (
              data.progress.rounds.length === 0 ? (
                <EmptyState
                  title="El cuadro aún no existe"
                  message="Se genera automáticamente cuando el torneo inicia."
                />
              ) : (
                <div>
                  {data.progress.rounds.map((round) => (
                    <section key={round.roundNumber}>
                      <h3 className="round-title">{round.roundName}</h3>
                      <div className="card-list">
                        {[...round.matches]
                          .sort((a, b) => a.positionInRound - b.positionInRound)
                          .map((match) => (
                            <MatchCard
                              key={match.id}
                              match={match}
                              roundName={round.roundName}
                              onManage={
                                isManager && match.status !== "PLAYED" ? () => setManaging(match) : undefined
                              }
                            />
                          ))}
                      </div>
                    </section>
                  ))}
                </div>
              )
            ) : null}
          </>
        ) : null}

        <div className="btn-row">
          <button type="button" className="btn btn-text" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </Dialog>

      {registering ? (
        <TeamFormDialog
          onClose={() => setRegistering(false)}
          onSubmit={async (body) => {
            await api.registerTeam(tournamentId, body);
            setRegistering(false);
            onChanged("Equipo inscrito.");
            void reload();
          }}
        />
      ) : null}

      {confirmStart ? (
        <ConfirmDialog
          title="¿Iniciar torneo?"
          message="Se generará el cuadro y ya no se admitirán equipos."
          confirmLabel="Iniciar"
          onCancel={() => setConfirmStart(false)}
          onConfirm={() => void start()}
        />
      ) : null}

      {teamDetail ? <TeamDetailDialog team={teamDetail} onClose={() => setTeamDetail(null)} /> : null}

      {managing ? (
        <MatchManageDialog
          match={managing}
          onClose={() => setManaging(null)}
          onDone={(message) => {
            setManaging(null);
            onChanged(message);
            void reload();
          }}
        />
      ) : null}
    </>
  );
}

function TeamDetailDialog({ team, onClose }: { team: TeamResponse; onClose: () => void }) {
  return (
    <Dialog title={team.name} onClose={onClose}>
      <Chip positive={!team.stats.eliminated}>{team.stats.eliminated ? "Eliminado" : "En competencia"}</Chip>
      <h3 style={{ marginTop: 18 }}>Contacto</h3>
      <p>{team.contactName}</p>
      <p className="muted">{team.contactEmail}</p>
      <p className="muted">{team.contactPhone}</p>
      <h3 style={{ marginTop: 18 }}>Estadísticas</h3>
      <InfoLine label="Partidos jugados" value={team.stats.matchesPlayed} />
      <InfoLine label="Victorias" value={team.stats.matchesWon} />
      <InfoLine label="Derrotas" value={team.stats.matchesLost} />
      <InfoLine label="Puntos a favor" value={team.stats.pointsFor} />
      <InfoLine label="Puntos en contra" value={team.stats.pointsAgainst} />
      <InfoLine label="Ronda actual" value={team.stats.currentRound} />
      <div className="btn-row">
        <button type="button" className="btn btn-text" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </Dialog>
  );
}

function TeamFormDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (body: {
    name: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    const invalid = validateTeam(name, contact, email, phone);
    if (invalid) {
      setError(invalid);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        contactName: contact.trim(),
        contactEmail: email.trim(),
        contactPhone: phone.trim(),
      });
    } catch (caught) {
      setError(messageOf(caught));
      setSaving(false);
    }
  }

  return (
    <Dialog title="Inscribir equipo" onClose={onClose}>
      <Field label="Nombre del equipo" value={name} onChange={setName} />
      <Field label="Responsable" value={contact} onChange={setContact} />
      <Field label="Correo" type="email" value={email} onChange={setEmail} />
      <Field label="Teléfono" value={phone} onChange={setPhone} hint="Entre 7 y 15 dígitos." />
      {error ? <p className="error-text">{error}</p> : null}
      <div className="btn-row">
        <button type="button" className="btn btn-text" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn" onClick={submit} disabled={saving}>
          {saving ? "Inscribiendo…" : "Inscribir equipo"}
        </button>
      </div>
    </Dialog>
  );
}

function MatchManageDialog({
  match,
  onClose,
  onDone,
}: {
  match: MatchResponse;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const scheduling = match.status === "PENDING";
  const [scheduledAt, setScheduledAt] = useState("");
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setError(null);
    if (scheduling) {
      if (!scheduledAt) {
        setError("Selecciona la fecha y hora del partido.");
        return;
      }
      setSaving(true);
      try {
        await api.scheduleMatch(match.id, scheduledAt.length === 16 ? `${scheduledAt}:00` : scheduledAt);
        onDone("Partido programado.");
      } catch (caught) {
        setError(messageOf(caught));
        setSaving(false);
      }
      return;
    }

    const homeScore = home.trim() === "" ? null : Number(home);
    const awayScore = away.trim() === "" ? null : Number(away);
    const invalid = validateScore(homeScore, awayScore);
    if (invalid) {
      setError(invalid);
      return;
    }
    setSaving(true);
    try {
      await api.scoreMatch(match.id, homeScore as number, awayScore as number);
      onDone("Marcador registrado.");
    } catch (caught) {
      setError(messageOf(caught));
      setSaving(false);
    }
  }

  return (
    <Dialog title={scheduling ? "Programar partido" : "Registrar resultado"} onClose={onClose}>
      <p style={{ textAlign: "center", fontWeight: 700 }}>
        {match.homeTeamName ?? "Por definir"} vs {match.awayTeamName ?? "Por definir"}
      </p>

      <div style={{ marginTop: 18 }}>
        {scheduling ? (
          <Field
            label="Fecha y hora"
            type="datetime-local"
            value={scheduledAt}
            onChange={setScheduledAt}
            min={nowForInput()}
          />
        ) : (
          <div className="form-row">
            <Field
              label={match.homeTeamName ?? "Local"}
              type="number"
              min={0}
              value={home}
              onChange={setHome}
            />
            <Field
              label={match.awayTeamName ?? "Visitante"}
              type="number"
              min={0}
              value={away}
              onChange={setAway}
            />
          </div>
        )}
      </div>

      {!scheduling ? <p className="muted">El backend no permite empates: los marcadores deben diferir.</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      <div className="btn-row">
        <button type="button" className="btn btn-text" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn" onClick={submit} disabled={saving}>
          {saving ? "Guardando…" : scheduling ? "Programar" : "Guardar resultado"}
        </button>
      </div>
    </Dialog>
  );
}
