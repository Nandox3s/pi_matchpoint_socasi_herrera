"use client";

import { useEffect, type ReactNode } from "react";

/* Equivalentes web de ui/components/Common.kt */

export function Chip({ children, positive = true }: { children: ReactNode; positive?: boolean }) {
  return (
    <span className="chip" data-positive={positive}>
      {children}
    </span>
  );
}

export function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="heading">
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <section className="hero">
      <div className="hero-eyebrow">
        <span className="hero-icon" aria-hidden>
          {icon}
        </span>
        <span>{eyebrow}</span>
      </div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </section>
  );
}

export function InfoLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="info-line">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function Loading() {
  return (
    <div className="state">
      <div className="spinner" role="status" aria-label="Cargando" />
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state">
      <span className="state-icon" aria-hidden>
        ☁️
      </span>
      <p className="error-text">{message}</p>
      {onRetry ? (
        <button type="button" className="btn btn-outline" onClick={onRetry}>
          Reintentar
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="state">
      <span className="state-icon" aria-hidden>
        🏀
      </span>
      <h3>{title}</h3>
      <p className="muted">{message}</p>
      {onAction && actionLabel ? (
        <button type="button" className="btn btn-text" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

/** Equivalente de StateView: resuelve cargando / error / vacío / contenido. */
export function StateView<T>({
  loading,
  error,
  data,
  onRetry,
  isEmpty,
  empty,
  children,
}: {
  loading: boolean;
  error: string | null;
  data: T | null;
  onRetry?: () => void;
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (loading && data === null) return <Loading />;
  if (error && data === null) return <ErrorState message={error} onRetry={onRetry} />;
  if (data === null) return <Loading />;
  if (isEmpty?.(data)) {
    return <>{empty ?? <EmptyState title="Sin resultados" message="Todavía no hay información disponible." />}</>;
  }
  return <>{children(data)}</>;
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
  invalid = false,
  min,
  step,
  required = false,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  hint?: string;
  invalid?: boolean;
  min?: string | number;
  step?: string | number;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        data-invalid={invalid}
        min={min}
        step={step}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

/** Los diálogos se anidan (detalle de torneo -> inscribir equipo), así que el bloqueo
 *  del scroll se cuenta: solo se libera cuando se cierra el último. */
let openDialogs = 0;

export function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    openDialogs += 1;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      openDialogs = Math.max(0, openDialogs - 1);
      if (openDialogs === 0) document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog" role="dialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirmar",
  danger = false,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog title={title} onClose={onCancel}>
      <p className="muted" style={{ whiteSpace: "pre-line" }}>
        {message}
      </p>
      <div className="btn-row">
        <button type="button" className="btn btn-text" onClick={onCancel}>
          Volver
        </button>
        <button type="button" className={danger ? "btn btn-danger" : "btn"} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}

export function Toast({
  message,
  tone = "success",
  onDismiss,
}: {
  message: string;
  tone?: "success" | "error";
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4200);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className="toast" data-tone={tone} role="status">
      {message}
    </div>
  );
}
