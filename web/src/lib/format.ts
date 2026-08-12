// Espejo de utils/Formatters.kt. El backend usa LocalDateTime ISO-8601 sin zona horaria,
// asi que la cadena se interpreta tal cual, sin convertir a UTC.

const DATE = new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "short", year: "numeric" });
const TIME = new Intl.DateTimeFormat("es-EC", { hour: "2-digit", minute: "2-digit", hour12: false });
const MONEY = new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" });

/** Convierte "2026-08-20T18:30:00" en una fecha local sin desplazamiento de zona. */
export function parseLocalDateTime(raw: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(raw);
  if (!match) {
    const fallback = new Date(raw);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }
  const [, year, month, day, hour, minute, second] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second ?? "0"),
  );
}

export function formatDateTime(raw: string): { date: string; time: string } {
  const parsed = parseLocalDateTime(raw);
  if (!parsed) return { date: raw, time: "" };
  return { date: DATE.format(parsed), time: TIME.format(parsed) };
}

export function formatMoney(value: number): string {
  return MONEY.format(value);
}

export function isFuture(raw: string): boolean {
  const parsed = parseLocalDateTime(raw);
  return parsed !== null && parsed.getTime() > Date.now();
}

/** Serializa a "YYYY-MM-DDTHH:mm:00", el formato LocalDateTime que exige el backend. */
export function toLocalDateTimeString(date: string, time: string): string {
  return `${date}T${time.length === 5 ? `${time}:00` : time}`;
}

/** Valor minimo para los <input type="datetime-local">: ahora mismo. */
export function nowForInput(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
