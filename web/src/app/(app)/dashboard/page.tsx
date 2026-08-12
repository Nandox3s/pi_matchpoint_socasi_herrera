"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ReservationCard, TournamentCard } from "@/components/cards";
import { useSession } from "@/components/session-context";
import { Hero, Loading } from "@/components/ui";
import { api } from "@/lib/api";
import { isFuture } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import type { CourtResponse, ReservationResponse, TournamentResponse, UserResponse } from "@/lib/types";

/** Equivalente de HomeScreen: cambia por completo según el rol devuelto por Cognito. */
export default function DashboardPage() {
  const session = useSession();
  const router = useRouter();
  const isPlayer = session.role === "PLAYER";

  const { data, loading } = useAsync<{
    profile: UserResponse | null;
    courts: CourtResponse[];
    tournaments: TournamentResponse[];
    reservations: ReservationResponse[];
  }>(async () => {
    const [profile, courts, tournaments, reservations] = await Promise.all([
      api.profile().catch(() => null),
      api.courts().catch(() => [] as CourtResponse[]),
      api.tournaments().catch(() => [] as TournamentResponse[]),
      isPlayer ? api.reservations().catch(() => [] as ReservationResponse[]) : Promise.resolve([]),
    ]);
    return { profile, courts, tournaments, reservations };
  }, [isPlayer]);

  if (loading && !data) return <Loading />;

  const firstName = data?.profile?.name?.split(" ")[0] ?? session.username;
  const nextReservation = (data?.reservations ?? [])
    .filter((item) => item.status === "CONFIRMED" && isFuture(item.startsAt))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
  const openTournaments = (data?.tournaments ?? []).filter((item) => item.status === "REGISTRATION").slice(0, 2);
  const myCourts = (data?.courts ?? []).filter((item) => item.managerUser === session.username).length;
  const myTournaments = (data?.tournaments ?? []).filter((item) => item.managerUser === session.username).length;

  return (
    <>
      <Hero
        eyebrow={isPlayer ? "Tu próxima jugada" : "MatchPoint Manager"}
        title={`Hola, ${firstName} 👋`}
        subtitle={
          isPlayer ? "Encuentra cancha, reserva y compite." : "Todo tu espacio deportivo, bajo control."
        }
        icon={isPlayer ? "⚡" : "📊"}
      />

      <div className="grid-2" style={{ marginTop: 18 }}>
        <Link href="/courts" className="quick-action">
          <span aria-hidden>🏀</span>
          <span>Canchas</span>
        </Link>
        {isPlayer ? (
          <Link href="/reservations" className="quick-action">
            <span aria-hidden>📅</span>
            <span>Reservas</span>
          </Link>
        ) : (
          <Link href="/tournaments" className="quick-action">
            <span aria-hidden>🏆</span>
            <span>Torneos</span>
          </Link>
        )}
      </div>

      {!data?.profile ? (
        <div className="banner" data-tone="info" style={{ marginTop: 20 }}>
          Aún no tienes perfil creado en el backend. Ve a{" "}
          <Link href="/profile" style={{ textDecoration: "underline" }}>
            Perfil
          </Link>{" "}
          para crearlo: sin él, el backend rechaza las reservas con un 409.
        </div>
      ) : null}

      {isPlayer ? (
        <>
          {nextReservation ? (
            <>
              <div className="section-title">
                <h2>Próxima reserva</h2>
                <Link href="/reservations" className="btn btn-text">
                  Ver todas
                </Link>
              </div>
              <ReservationCard reservation={nextReservation} onOpen={() => router.push("/reservations")} />
            </>
          ) : null}

          {openTournaments.length > 0 ? (
            <>
              <div className="section-title">
                <h2>Torneos disponibles</h2>
                <Link href="/tournaments" className="btn btn-text">
                  Ver todos
                </Link>
              </div>
              <div className="card-list">
                {openTournaments.map((tournament) => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    onOpen={() => router.push(`/tournaments?open=${tournament.id}`)}
                  />
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : (
        <>
          <div className="grid-2" style={{ marginTop: 22 }}>
            <div className="metric">
              <strong>{myCourts}</strong>
              <span className="muted">Canchas</span>
            </div>
            <div className="metric">
              <strong>{myTournaments}</strong>
              <span className="muted">Torneos</span>
            </div>
          </div>
          <div style={{ display: "grid", gap: 10, marginTop: 22 }}>
            <Link href="/courts" className="btn btn-block">
              Crear cancha
            </Link>
            <Link href="/tournaments" className="btn btn-outline btn-block">
              Crear torneo
            </Link>
          </div>
        </>
      )}
    </>
  );
}
