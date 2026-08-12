import type {
  CourtResponse,
  CreateCourtRequest,
  CreateReservationRequest,
  CreateTournamentRequest,
  MatchResponse,
  MeResponse,
  RegisterTeamRequest,
  ReservationResponse,
  Session,
  SportType,
  TeamResponse,
  TournamentProgressResponse,
  TournamentResponse,
  UpdateCourtRequest,
  UserRequest,
  UserResponse,
} from "@/lib/types";

/**
 * Cliente de navegador. Nunca habla con el backend directamente: todo pasa por
 * /api/backend, que corre en el servidor y adjunta el token.
 */

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Traduccion de errores identica a ApiErrorMapper del cliente Android. */
function conflictMessage(raw: string | null): string {
  const value = (raw ?? "").toLowerCase();
  if (value.includes("booked")) return "Esta cancha ya está reservada en ese horario.";
  if (value.includes("profile")) return "Primero debes completar tu perfil.";
  if (value.includes("full")) return "El torneo ya no tiene cupos disponibles.";
  if (value.includes("closed")) return "La inscripción del torneo está cerrada.";
  return raw ?? "La operación entra en conflicto con el estado actual.";
}

function messageFor(status: number, backendMessage: string | null): string {
  switch (status) {
    case 400:
      return "Revisa los datos ingresados.";
    case 401:
      return "Tu sesión expiró. Inicia sesión nuevamente.";
    case 403:
      return "No tienes permisos para realizar esta acción.";
    case 404:
      return "El recurso solicitado no existe.";
    case 409:
      return conflictMessage(backendMessage);
    case 500:
      return "El servidor encontró un problema. Intenta más tarde.";
    case 503:
    case 504:
      return "El servicio no está disponible temporalmente.";
    default:
      return backendMessage ?? "No se pudo completar la operación.";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/backend/${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      cache: "no-store",
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor. Revisa tu conexión.", 0);
  }

  const raw = await response.text();
  let parsed: unknown = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    const body = parsed as { error?: string; message?: string } | null;
    throw new ApiError(messageFor(response.status, body?.error ?? body?.message ?? null), response.status);
  }

  return parsed as T;
}

const query = (params: Record<string, string | number | undefined | null>): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const rendered = search.toString();
  return rendered ? `?${rendered}` : "";
};

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});

/* --- Sesión (rutas propias de Next, no del backend) --- */

export async function fetchSession(): Promise<Session | null> {
  const response = await fetch("/api/auth/session", { cache: "no-store" });
  return response.ok ? ((await response.json()) as Session) : null;
}

export async function signIn(username: string, password: string): Promise<Session> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const payload = (await response.json()) as Session & { error?: string };
  if (!response.ok) throw new ApiError(payload.error ?? "No se pudo iniciar sesión.", response.status);
  return payload;
}

export async function signOut(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

async function authRequest<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new ApiError(payload.error ?? "No se pudo completar la solicitud.", response.status);
  return payload;
}

export const registerAccount = (username: string, password: string, email: string) =>
  authRequest<{ confirmed: boolean; destination?: string }>("register", { username, password, email });

export const confirmAccount = (username: string, code: string) =>
  authRequest<{ confirmed: boolean }>("confirm", { username, code });

export const resendConfirmation = (username: string) =>
  authRequest<{ destination?: string }>("confirm", { username, resend: true });

/* --- Microservicio users --- */

export const api = {
  me: () => request<MeResponse>("matchpoint/me"),
  profile: () => request<UserResponse>("users/me"),
  createProfile: (body: UserRequest) => request<UserResponse>("users/me", json("POST", body)),
  updateProfile: (body: UserRequest) => request<UserResponse>("users/me", json("PUT", body)),

  /* --- Canchas --- */
  courts: (sector?: string, sport?: SportType) =>
    request<CourtResponse[]>(`matchpoint/courts${query({ sector, sport })}`),
  availableCourts: (sector?: string, sport?: SportType, startsAt?: string, durationMinutes?: number) =>
    request<CourtResponse[]>(`matchpoint/courts/available${query({ sector, sport, startsAt, durationMinutes })}`),
  createCourt: (body: CreateCourtRequest) => request<CourtResponse>("matchpoint/courts", json("POST", body)),
  updateCourt: (id: number, body: UpdateCourtRequest) =>
    request<CourtResponse>(`matchpoint/courts/${id}`, json("PATCH", body)),

  /* --- Reservas --- */
  reservations: () => request<ReservationResponse[]>("matchpoint/reservations/me"),
  reserve: (body: CreateReservationRequest) =>
    request<ReservationResponse>("matchpoint/reservations", json("POST", body)),
  cancelReservation: (id: number) => request<void>(`matchpoint/reservations/${id}`, json("DELETE")),

  /* --- Torneos --- */
  tournaments: () => request<TournamentResponse[]>("matchpoint/tournaments"),
  tournament: (id: number) => request<TournamentProgressResponse>(`matchpoint/tournaments/${id}`),
  createTournament: (body: CreateTournamentRequest) =>
    request<TournamentResponse>("matchpoint/tournaments", json("POST", body)),
  startTournament: (id: number) =>
    request<TournamentProgressResponse>(`matchpoint/tournaments/${id}/start`, json("POST")),
  teams: (id: number) => request<TeamResponse[]>(`matchpoint/tournaments/${id}/teams`),
  registerTeam: (id: number, body: RegisterTeamRequest) =>
    request<TeamResponse>(`matchpoint/tournaments/${id}/teams`, json("POST", body)),
  withdrawTeam: (id: number, teamId: number) =>
    request<void>(`matchpoint/tournaments/${id}/teams/${teamId}`, json("DELETE")),

  /* --- Partidos --- */
  scheduleMatch: (matchId: number, scheduledAt: string) =>
    request<MatchResponse>(`matchpoint/matches/${matchId}/schedule`, json("PATCH", { scheduledAt })),
  scoreMatch: (matchId: number, homeScore: number, awayScore: number) =>
    request<MatchResponse>(`matchpoint/matches/${matchId}/score`, json("PATCH", { homeScore, awayScore })),
};
