import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "MatchPoint — Reservas y torneos",
  description:
    "Cliente web de MatchPoint: reserva canchas, gestiona torneos de eliminación directa y consulta tu perfil.",
  applicationName: "MatchPoint",
  // Permite instalar la web en la pantalla de inicio del teléfono y abrirla sin barra del navegador.
  appleWebApp: { capable: true, title: "MatchPoint", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Necesario para que env(safe-area-inset-*) tenga valor en iPhone con notch.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7faf8" },
    { media: "(prefers-color-scheme: dark)", color: "#101512" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
