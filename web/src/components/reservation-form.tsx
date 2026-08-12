"use client";

import { useState } from "react";

import { Dialog, Field } from "@/components/ui";
import { formatMoney, nowForInput } from "@/lib/format";
import { messageOf } from "@/lib/hooks";
import { validateReservation } from "@/lib/validators";
import type { CourtResponse, CreateReservationRequest } from "@/lib/types";

const DURATIONS = [60, 90, 120];

/**
 * Equivalente de ReservationFormDialog. El backend espera LocalDateTime ISO-8601 sin zona,
 * que es exactamente lo que produce un <input type="datetime-local">.
 */
export function ReservationFormDialog({
  court,
  onClose,
  onSubmit,
}: {
  court: CourtResponse;
  onClose: () => void;
  onSubmit: (body: CreateReservationRequest) => Promise<void>;
}) {
  const [startsAt, setStartsAt] = useState("");
  const [duration, setDuration] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    const normalized = startsAt.length === 16 ? `${startsAt}:00` : startsAt;
    const invalid = validateReservation(court.id, normalized, duration);
    if (invalid) {
      setError(invalid);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ courtId: court.id, startsAt: normalized, durationMinutes: duration });
    } catch (caught) {
      setError(messageOf(caught));
      setSaving(false);
    }
  }

  return (
    <Dialog title="Reservar cancha" onClose={onClose}>
      <h3 style={{ marginBottom: 2 }}>{court.name}</h3>
      <p className="price" style={{ marginBottom: 18 }}>
        {formatMoney(court.pricePerHour)} / hora
      </p>

      <Field
        label="Fecha y hora de inicio"
        type="datetime-local"
        value={startsAt}
        onChange={setStartsAt}
        min={nowForInput()}
      />

      <span className="field-hint" style={{ marginBottom: 8 }}>
        Duración
      </span>
      <div className="filters">
        {DURATIONS.map((option) => (
          <button
            key={option}
            type="button"
            className="filter-chip"
            data-active={duration === option}
            onClick={() => setDuration(option)}
          >
            {option} min
          </button>
        ))}
      </div>

      <div className="card-outlined" style={{ marginTop: 12 }}>
        <strong>Resumen</strong>
        <p className="muted">Cancha: {court.name}</p>
        <p className="muted">Inicio: {startsAt ? startsAt.replace("T", " ") : "Pendiente"}</p>
        <p className="muted">Duración: {duration} minutos</p>
      </div>

      {error ? <p className="error-text" style={{ marginTop: 12 }}>{error}</p> : null}

      <div className="btn-row">
        <button type="button" className="btn btn-text" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn" onClick={submit} disabled={saving || !startsAt}>
          {saving ? "Reservando…" : "Confirmar reserva"}
        </button>
      </div>
    </Dialog>
  );
}
