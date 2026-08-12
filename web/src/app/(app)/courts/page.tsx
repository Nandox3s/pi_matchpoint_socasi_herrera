"use client";

import { useState } from "react";

import { CourtCard } from "@/components/cards";
import { ReservationFormDialog } from "@/components/reservation-form";
import { useSession } from "@/components/session-context";
import { Chip, Dialog, EmptyState, Field, Heading, InfoLine, StateView, Toast } from "@/components/ui";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { messageOf, useAsync, useToast } from "@/lib/hooks";
import { SPORT_LABEL, type CourtResponse, type UpdateCourtRequest } from "@/lib/types";
import { validateCourt } from "@/lib/validators";

/** Equivalente de CourtsScreen: PLAYER busca y reserva, MANAGER crea y edita las suyas. */
export default function CourtsPage() {
  const session = useSession();
  const isManager = session.role === "MANAGER";
  const { data, loading, error, reload } = useAsync(() => api.courts(), []);
  const { toast, notify, dismiss } = useToast();

  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("");
  const [detail, setDetail] = useState<CourtResponse | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<CourtResponse | null>(null);
  const [reserving, setReserving] = useState<CourtResponse | null>(null);

  return (
    <>
      <Heading
        title={isManager ? "Mis canchas" : "Buscar canchas"}
        subtitle={
          isManager ? "Gestiona disponibilidad y precios." : "Tu partido empieza con el lugar perfecto."
        }
      />

      <div className="form-row">
        <Field label="Buscar por nombre" value={query} onChange={setQuery} placeholder="Coliseo, cancha…" />
        <Field label="Sector" value={sector} onChange={setSector} placeholder="Norte, Valle…" />
      </div>

      <StateView
        loading={loading}
        error={error}
        data={data}
        onRetry={reload}
        isEmpty={(courts) => courts.length === 0}
        empty={
          <EmptyState
            title="No encontramos canchas"
            message={isManager ? "Crea tu primera cancha con el botón inferior." : "Vuelve pronto."}
          />
        }
      >
        {(courts) => {
          const filtered = courts.filter(
            (court) =>
              (!isManager || court.managerUser === session.username) &&
              court.name.toLowerCase().includes(query.toLowerCase()) &&
              court.sector.toLowerCase().includes(sector.toLowerCase()),
          );

          if (filtered.length === 0) {
            return (
              <EmptyState
                title="No encontramos canchas"
                message="Prueba cambiando los filtros."
                actionLabel="Limpiar filtros"
                onAction={() => {
                  setQuery("");
                  setSector("");
                }}
              />
            );
          }

          return (
            <div className="grid">
              {filtered.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  onOpen={() => setDetail(court)}
                  onEdit={isManager ? () => setEditing(court) : undefined}
                />
              ))}
            </div>
          );
        }}
      </StateView>

      {isManager ? (
        <button type="button" className="fab" onClick={() => setCreating(true)}>
          <span aria-hidden>＋</span> Crear cancha
        </button>
      ) : null}

      {detail ? (
        <Dialog title={detail.name} onClose={() => setDetail(null)}>
          <Chip positive={detail.active}>{detail.active ? "Disponible" : "No disponible"}</Chip>
          <div style={{ marginTop: 14 }}>
            <InfoLine label="Sector" value={detail.sector} />
            <InfoLine label="Deporte" value={SPORT_LABEL[detail.sportType]} />
            <InfoLine label="Piso" value={detail.floorType} />
            <InfoLine label="Parqueadero" value={detail.hasParking ? "Sí" : "No"} />
            <InfoLine label="Precio" value={`${formatMoney(detail.pricePerHour)} / hora`} />
            <InfoLine label="Responsable" value={detail.managerUser} />
          </div>
          <p className="muted" style={{ marginTop: 14 }}>
            {detail.active
              ? "Elige una fecha y hora para reservar."
              : "Esta cancha no está disponible actualmente."}
          </p>
          <div className="btn-row">
            <button type="button" className="btn btn-text" onClick={() => setDetail(null)}>
              Cerrar
            </button>
            {!isManager && detail.active ? (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setReserving(detail);
                  setDetail(null);
                }}
              >
                Reservar cancha
              </button>
            ) : null}
          </div>
        </Dialog>
      ) : null}

      {creating ? (
        <CourtFormDialog
          onClose={() => setCreating(false)}
          onSaved={(message) => {
            setCreating(false);
            notify(message);
            void reload();
          }}
        />
      ) : null}

      {editing ? (
        <CourtEditDialog
          court={editing}
          onClose={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            notify(message);
            void reload();
          }}
        />
      ) : null}

      {reserving ? (
        <ReservationFormDialog
          court={reserving}
          onClose={() => setReserving(null)}
          onSubmit={async (body) => {
            await api.reserve(body);
            setReserving(null);
            notify("Reserva creada correctamente.");
          }}
        />
      ) : null}

      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={dismiss} /> : null}
    </>
  );
}

function CourtFormDialog({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [floor, setFloor] = useState("");
  const [price, setPrice] = useState("");
  const [parking, setParking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    const parsedPrice = price.trim() === "" ? null : Number(price);
    const invalid = validateCourt(name, sector, floor, parsedPrice);
    if (invalid) {
      setError(invalid);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.createCourt({
        name: name.trim(),
        sector: sector.trim(),
        hasParking: parking,
        sportType: "BASKET",
        floorType: floor.trim(),
        pricePerHour: parsedPrice as number,
      });
      onSaved("Cancha creada correctamente.");
    } catch (caught) {
      setError(messageOf(caught));
      setSaving(false);
    }
  }

  return (
    <Dialog title="Nueva cancha" onClose={onClose}>
      <Field label="Nombre" value={name} onChange={setName} />
      <Field label="Sector" value={sector} onChange={setSector} />
      <Field label="Tipo de piso" value={floor} onChange={setFloor} placeholder="Parquet, cemento…" />
      <Field label="Precio por hora (USD)" type="number" min={0} step="0.01" value={price} onChange={setPrice} />
      <label className="switch-row">
        <span>Parqueadero</span>
        <input type="checkbox" checked={parking} onChange={(event) => setParking(event.target.checked)} />
      </label>
      <p className="muted">Deporte: Básquet (único que expone el backend).</p>
      {error ? <p className="error-text">{error}</p> : null}
      <div className="btn-row">
        <button type="button" className="btn btn-text" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn" onClick={submit} disabled={saving}>
          {saving ? "Creando…" : "Crear cancha"}
        </button>
      </div>
    </Dialog>
  );
}

function CourtEditDialog({
  court,
  onClose,
  onSaved,
}: {
  court: CourtResponse;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [price, setPrice] = useState(String(court.pricePerHour));
  const [active, setActive] = useState(court.active);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    const parsed = Number(price);
    if (Number.isNaN(parsed) || parsed <= 0) {
      setError("El precio debe ser mayor que 0.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body: UpdateCourtRequest = { pricePerHour: parsed, active };
      await api.updateCourt(court.id, body);
      onSaved(active ? "Cancha actualizada." : "Cancha desactivada.");
    } catch (caught) {
      setError(messageOf(caught));
      setSaving(false);
    }
  }

  return (
    <Dialog title="Editar cancha" onClose={onClose}>
      <h3>{court.name}</h3>
      <p className="muted">El backend solo permite editar precio y estado.</p>
      <div style={{ marginTop: 16 }}>
        <Field label="Precio por hora (USD)" type="number" min={0} step="0.01" value={price} onChange={setPrice} />
        <label className="switch-row">
          <span>Cancha activa</span>
          <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
        </label>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <div className="btn-row">
        <button type="button" className="btn btn-text" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn" onClick={submit} disabled={saving}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </Dialog>
  );
}
