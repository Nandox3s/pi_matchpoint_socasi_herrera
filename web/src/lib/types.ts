// Espejo del contrato definido en app/src/main/java/ec/edu/puce/matchpoint/data/models/Models.kt
// Cualquier cambio en el backend debe reflejarse en ambos clientes.

export type UserRole = "PLAYER" | "MANAGER";
export type SportType = "BASKET";
export type ReservationStatus = "CONFIRMED" | "CANCELLED";
export type TournamentStatus = "REGISTRATION" | "IN_PROGRESS" | "FINISHED";
export type MatchStatus = "PENDING" | "READY" | "PLAYED";

export interface UserRequest {
  name: string;
  email: string | null;
  phone: string | null;
}

export interface UserResponse {
  id: number;
  cognitoId: string;
  username: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
}

export interface CreateCourtRequest {
  name: string;
  sector: string;
  hasParking: boolean;
  sportType: SportType;
  floorType: string;
  pricePerHour: number;
}

export interface UpdateCourtRequest {
  pricePerHour?: number;
  active?: boolean;
}

export interface CourtResponse {
  id: number;
  name: string;
  sector: string;
  hasParking: boolean;
  sportType: SportType;
  floorType: string;
  pricePerHour: number;
  active: boolean;
  managerUser: string;
  createdAt: string;
}

export interface CreateReservationRequest {
  courtId: number;
  startsAt: string;
  durationMinutes: number;
}

export interface ReservationResponse {
  id: number;
  courtId: number;
  courtName: string;
  ownerUser: string;
  ownerName: string;
  startsAt: string;
  durationMinutes: number;
  status: ReservationStatus;
  createdAt: string;
}

export interface CreateTournamentRequest {
  name: string;
  sportType: SportType;
  maxTeams: number;
  prize?: string | null;
  courtId?: number | null;
}

export interface TournamentResponse {
  id: number;
  name: string;
  sportType: SportType;
  maxTeams: number;
  registeredTeams: number;
  prize: string | null;
  status: TournamentStatus;
  managerUser: string;
  courtName: string | null;
  championTeamName: string | null;
  createdAt: string;
}

export interface RegisterTeamRequest {
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface TeamStatsResponse {
  eliminated: boolean;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  pointsFor: number;
  pointsAgainst: number;
  currentRound: number;
}

export interface TeamResponse {
  id: number;
  tournamentId: number;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  registeredByUser: string;
  stats: TeamStatsResponse;
  createdAt: string;
}

export interface ScheduleMatchRequest {
  scheduledAt: string;
}

export interface RegisterScoreRequest {
  homeScore: number;
  awayScore: number;
}

export interface MatchResponse {
  id: number;
  tournamentId: number;
  roundNumber: number;
  positionInRound: number;
  homeTeamName: string | null;
  awayTeamName: string | null;
  homeScore: number | null;
  awayScore: number | null;
  winnerTeamName: string | null;
  status: MatchStatus;
  scheduledAt: string | null;
}

export interface RoundResponse {
  roundNumber: number;
  roundName: string;
  matches: MatchResponse[];
}

export interface TournamentProgressResponse {
  tournament: TournamentResponse;
  rounds: RoundResponse[];
  champion: TeamResponse | null;
}

export interface MeResponse {
  username: string;
  sub: string;
  email: string | null;
  groups: string[];
  profile: UserResponse | null;
}

/** Sesion resuelta en el servidor a partir del access token de Cognito. */
export interface Session {
  username: string;
  role: UserRole;
  groups: string[];
  expiresAt: number;
}

export const ROLE_LABEL: Record<UserRole, string> = {
  PLAYER: "Jugador",
  MANAGER: "Manager",
};

export const SPORT_LABEL: Record<SportType, string> = {
  BASKET: "Básquet",
};

export const RESERVATION_LABEL: Record<ReservationStatus, string> = {
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

export const TOURNAMENT_LABEL: Record<TournamentStatus, string> = {
  REGISTRATION: "Inscripciones",
  IN_PROGRESS: "En curso",
  FINISHED: "Finalizado",
};

export const MATCH_LABEL: Record<MatchStatus, string> = {
  PENDING: "Pendiente",
  READY: "Listo",
  PLAYED: "Jugado",
};
