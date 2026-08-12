"use client";

import { useState } from "react";

import { ReservationCard } from "@/components/cards";
import { ReservationFormDialog } from "@/components/reservation-form";
import {
  Chip,
  ConfirmDialog,
  Dialog,
  EmptyState,
  Heading,
  InfoLine,
  StateView,
  Toast,
} from "@/components/ui";
import { api } from "@/lib/api";
import { formatDateTime, formatMoney, isFuture } from "@/lib/format";
import { messageOf, useAsync, useToast } from "@/lib/hooks";
import { RESERVATION_LABEL, type CourtResponse, type ReservationResponse } from "@/lib/types";

type Filter = "Todas" | "Próximas" | "Canceladas";
const FILTERS: Filter[] = ["Todas", "Próximas", "Canceladas"];

/** Equivalente de ReservationsScreen. */
export default function ReservationsPage() {
  const { data, loading, error, reload } = useAsync(
    () => Promise.all([api.reservations(), api.courts()]).then(([reservations, courts]) => ({ reservations, courts })),
    [],
  );
  const { toast, notify, dismiss } = useToast();

  const [filter, setFilter] = useState<Filter>("Todas");
  const [detail, setDetail] = useState<ReservationResponse | null>(null);
  const [cancelling, setCancelling] = useState<ReservationResponse | null>(null);
  const [pickingCourt, setPickingCourt] = useState(false);
  const [chosenCourt, setChosenCourt] = useState<CourtResponse | null>(null);

  async function cancel(reservation: ReservationResponse) {
    setCancelling(null);
    try {
      await api.cancelReservation(reservation.id);
      notify("Reserva cancelada.");
    } catch (caught) {
      notify(messageOf(caught), "error");
    }
    void reload();
  }

  return (
    <>
      <Heading title="Mis reservas" subtitle="Organiza tus próximos partidos." />

      <div className="filters">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            className="filter-chip"
            data-active={filter === option}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <StateView
        loading={loading}
        error={error}
        data={data}
        onRetry={reload}
        isEmpty={(payload) => payload.reservations.length === 0}
        empty={
          <EmptyState title="No tienes reservas" message="Busca una cancha y crea tu primera reserva." />
        }
      >
        {(payload) => {
          const filtered = payload.reservations.filter((reservation) => {
            if (filter === "Próximas") {
              return reservation.status === "CONFIRMED" && isFuture(reservation.startsAt);
            }
            if (filter === "Canceladas") return reservation.status === "CANCELLED";
            return true;
          });

          if (filtered.length === 0) {
            return <EmptyState title="Sin reservas en esta categoría" message="Selecciona otro filtro." />;
          }

          return (
            <div className="grid">
              {[...filtered]
                .sort((a, b) => b.startsAt.localeCompare(a.startsAt))
                .map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onOpen={() => setDetail(reservation)}
                  />
                ))}
            </div>
          );
        }}
      </StateView>

      <button type="button" className="fab" onClick={() => setPickingCourt(true)}>
        <span aria-hidden>＋</span> Nueva reserva
      </button>

      {detail ? (
        <Dialog title="Reserva" onClose={() => setDetail(null)}>
          <h3>{detail.courtName}</h3>
          <div style={{ marginTop: 14 }}>
            <InfoLine label="Fecha" value={formatDateTime(detail.startsAt).date} />
            <InfoLine label="Hora" value={formatDateTime(detail.startsAt).time} />
            <InfoLine label="Duración" value={`${detail.durationMinutes} minutos`} />
            <InfoLine label="Estado" value={<Chip positive={detail.status === "CONFIRMED"}>{RESERVATION_LABEL[detail.status]}</Chip>} />
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn-text" onClick={() => setDetail(null)}>
              Volver
            </button>
            {detail.status === "CONFIRMED" ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  setCancelling(detail);
                  setDetail(null);
                }}
              >
                Cancelar reserva
              </button>
            ) : null}
          </div>
        </Dialog>
      ) : null}

      {cancelling ? (
        <ConfirmDialog
          title="¿Cancelar reserva?"
          message="Esta acción cancelará tu reserva."
          confirmLabel="Sí, cancelar"
          danger
          onCancel={() => setCancelling(null)}
          onConfirm={() => void cancel(cancelling)}
        />
      ) : null}

      {pickingCourt ? (
        <Dialog title="Selecciona una cancha" onClose={() => setPickingCourt(false)}>
          {(data?.courts ?? []).filter((court) => court.active).length === 0 ? (
            <p className="muted">No hay canchas activas disponibles en este momento.</p>
          ) : (
            <div className="card-list">
              {(data?.courts ?? [])
                .filter((court) => court.active)
                .map((court) => (
                  <button
                    key={court.id}
                    type="button"
                    className="card-outlined card-clickable"
                    onClick={() => {
                      setChosenCourt(court);
                      setPickingCourt(false);
                    }}
                  >
                    <strong>{court.name}</strong>
                    <p className="muted">
                      {court.sector} · {formatMoney(court.pricePerHour)} / hora
                    </p>
                  </button>
                ))}
            </div>
          )}
          <div className="btn-row">
            <button type="button" className="btn btn-text" onClick={() => setPickingCourt(false)}>
              Cerrar
            </button>
          </div>
        </Dialog>
      ) : null}

      {chosenCourt ? (
        <ReservationFormDialog
          court={chosenCourt}
          onClose={() => setChosenCourt(null)}
          onSubmit={async (body) => {
            await api.reserve(body);
            setChosenCourt(null);
            notify("Reserva creada correctamente.");
            void reload();
          }}
        />
      ) : null}

      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={dismiss} /> : null}
    </>
  );
}
