"use client";

import { Chip } from "@/components/ui";
import { formatDateTime, formatMoney } from "@/lib/format";
import {
  MATCH_LABEL,
  RESERVATION_LABEL,
  SPORT_LABEL,
  TOURNAMENT_LABEL,
  type CourtResponse,
  type MatchResponse,
  type ReservationResponse,
  type TeamResponse,
  type TournamentResponse,
} from "@/lib/types";

export function CourtCard({
  court,
  onOpen,
  onEdit,
}: {
  court: CourtResponse;
  onOpen: () => void;
  onEdit?: () => void;
}) {
  return (
    <article className="card">
      <div className="card-title-row">
        <h3>{court.name}</h3>
        <Chip positive={court.active}>{court.active ? "Activa" : "Inactiva"}</Chip>
      </div>
      <p className="muted" style={{ marginTop: 10 }}>
        📍 {court.sector} · 🏀 {SPORT_LABEL[court.sportType]}
      </p>
      <p className="muted">
        Piso {court.floorType} · Parqueadero: {court.hasParking ? "Sí" : "No"}
      </p>
      <p className="price" style={{ marginTop: 12 }}>
        {formatMoney(court.pricePerHour)} / hora
      </p>
      <div className="btn-row btn-row-inline">
        <button type="button" className="btn btn-text" onClick={onOpen}>
          Ver detalle
        </button>
        {onEdit ? (
          <button type="button" className="btn btn-text" onClick={onEdit}>
            ✏️ Editar
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function ReservationCard({
  reservation,
  onOpen,
}: {
  reservation: ReservationResponse;
  onOpen: () => void;
}) {
  const { date, time } = formatDateTime(reservation.startsAt);
  return (
    <article className="card">
      <div className="card-title-row">
        <h3>{reservation.courtName}</h3>
        <Chip positive={reservation.status === "CONFIRMED"}>{RESERVATION_LABEL[reservation.status]}</Chip>
      </div>
      <p className="muted" style={{ marginTop: 10 }}>
        📅 {date}
      </p>
      <p className="muted">
        🕒 {time} · ⏱ {reservation.durationMinutes} minutos
      </p>
      <div className="btn-row btn-row-inline">
        <button type="button" className="btn btn-text" onClick={onOpen}>
          Ver detalle
        </button>
      </div>
    </article>
  );
}

export function TournamentCard({
  tournament,
  onOpen,
}: {
  tournament: TournamentResponse;
  onOpen: () => void;
}) {
  return (
    <article className="card">
      <div className="card-title-row">
        <h3>🏆 {tournament.name}</h3>
        <Chip positive={tournament.status !== "FINISHED"}>{TOURNAMENT_LABEL[tournament.status]}</Chip>
      </div>
      <p className="muted" style={{ marginTop: 10 }}>
        🏀 {SPORT_LABEL[tournament.sportType]} · 👥 {tournament.registeredTeams} / {tournament.maxTeams} equipos
      </p>
      {tournament.prize ? <p className="muted">Premio: {tournament.prize}</p> : null}
      {tournament.championTeamName ? <p className="price">🏅 Campeón: {tournament.championTeamName}</p> : null}
      <div className="btn-row btn-row-inline">
        <button type="button" className="btn btn-text" onClick={onOpen}>
          Ver torneo
        </button>
      </div>
    </article>
  );
}

export function TeamCard({ team, onOpen }: { team: TeamResponse; onOpen: () => void }) {
  return (
    <button type="button" className="card-outlined card-clickable" onClick={onOpen}>
      <div className="card-title-row">
        <strong>🏀 {team.name}</strong>
        <Chip positive={!team.stats.eliminated}>{team.stats.eliminated ? "Eliminado" : "En competencia"}</Chip>
      </div>
      <p className="muted" style={{ marginTop: 8 }}>
        Responsable: {team.contactName}
      </p>
      {team.stats.matchesPlayed > 0 ? (
        <p className="muted">
          PJ {team.stats.matchesPlayed} · PG {team.stats.matchesWon} · PP {team.stats.matchesLost} · PF{" "}
          {team.stats.pointsFor} · PC {team.stats.pointsAgainst}
        </p>
      ) : null}
    </button>
  );
}

export function MatchCard({
  match,
  roundName,
  onManage,
}: {
  match: MatchResponse;
  roundName: string;
  onManage?: () => void;
}) {
  const schedule = match.scheduledAt ? formatDateTime(match.scheduledAt) : null;
  return (
    <article className="match">
      <p className="match-round">{roundName}</p>
      <div className="match-team" data-winner={match.winnerTeamName === match.homeTeamName && match.winnerTeamName !== null}>
        <span>{match.homeTeamName ?? "Por definir"}</span>
        <span>{match.homeScore ?? "–"}</span>
      </div>
      <p className="match-vs">VS</p>
      <div className="match-team" data-winner={match.winnerTeamName === match.awayTeamName && match.winnerTeamName !== null}>
        <span>{match.awayTeamName ?? "Por definir"}</span>
        <span>{match.awayScore ?? "–"}</span>
      </div>
      {schedule ? (
        <p className="muted" style={{ textAlign: "center", marginTop: 8 }}>
          📅 {schedule.date} · 🕒 {schedule.time}
        </p>
      ) : null}
      <div style={{ display: "grid", placeItems: "center", marginTop: 10, gap: 8 }}>
        <Chip positive={match.status === "PLAYED"}>{MATCH_LABEL[match.status]}</Chip>
        {onManage ? (
          <button type="button" className="btn btn-text" onClick={onManage}>
            {match.status === "PENDING" ? "Programar" : "Registrar resultado"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
