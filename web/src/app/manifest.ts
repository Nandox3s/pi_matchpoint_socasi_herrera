import type { MetadataRoute } from "next";

/** Permite "Agregar a pantalla de inicio" en Android/iOS y abrir la app a pantalla completa. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MatchPoint — Reservas y torneos",
    short_name: "MatchPoint",
    description: "Reserva canchas, inscribe equipos y sigue el cuadro de tus torneos.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7faf8",
    theme_color: "#087a55",
    lang: "es",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
