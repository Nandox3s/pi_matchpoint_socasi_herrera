// Espejo de utils/Validators.kt: las mismas reglas y los mismos mensajes que la app Android.

const EMAIL = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE = /^\+?[0-9]{7,15}$/;

export function validateProfile(name: string, mail: string, mobile: string): string | null {
  if (name.trim().length < 2) return "Ingresa un nombre válido.";
  if (mail && !EMAIL.test(mail)) return "Ingresa un correo válido.";
  if (mobile && !PHONE.test(mobile)) return "Ingresa un teléfono de 7 a 15 dígitos.";
  return null;
}

export function validateCourt(
  name: string,
  sector: string,
  floor: string,
  price: number | null,
): string | null {
  if (!name.trim() || !sector.trim() || !floor.trim()) return "Completa nombre, sector y tipo de piso.";
  if (price === null || Number.isNaN(price) || price <= 0) return "El precio debe ser mayor que cero.";
  return null;
}

export function validateReservation(
  courtId: number | null,
  startsAt: string,
  duration: number | null,
): string | null {
  if (courtId === null || courtId <= 0) return "Selecciona una cancha.";
  const parsed = new Date(startsAt);
  if (Number.isNaN(parsed.getTime()) || parsed.getTime() <= Date.now()) {
    return "Selecciona una fecha y hora futura.";
  }
  if (duration === null || Number.isNaN(duration) || duration <= 0) return "La duración debe ser mayor que cero.";
  return null;
}

export function validateTournament(name: string, maxTeams: number | null): string | null {
  if (!name.trim()) return "Ingresa el nombre del torneo.";
  if (maxTeams === null || Number.isNaN(maxTeams) || maxTeams < 2 || (maxTeams & (maxTeams - 1)) !== 0) {
    return "Los cupos deben ser una potencia de 2 (2, 4, 8...).";
  }
  return null;
}

export function validateTeam(
  name: string,
  contact: string,
  mail: string,
  mobile: string,
): string | null {
  if (!name.trim() || !contact.trim()) return "Completa el equipo y el contacto.";
  if (!EMAIL.test(mail)) return "Ingresa un correo válido.";
  if (!PHONE.test(mobile)) return "Ingresa un teléfono válido.";
  return null;
}

export function validateScore(home: number | null, away: number | null): string | null {
  if (home === null || away === null || Number.isNaN(home) || Number.isNaN(away) || home < 0 || away < 0) {
    return "Los marcadores deben ser números no negativos.";
  }
  if (home === away) return "El backend no permite empates.";
  return null;
}
