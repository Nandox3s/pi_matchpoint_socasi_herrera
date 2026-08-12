"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { SessionProvider } from "@/components/session-context";
import { ConfirmDialog } from "@/components/ui";
import { signOut } from "@/lib/api";
import { ROLE_LABEL, type Session } from "@/lib/types";

/**
 * Navegación equivalente a la NavigationBar de MainActivity.
 * En móvil vive abajo (barra fija, como en Android); a partir de 900px pasa al encabezado.
 */
const PLAYER_NAV = [
  { href: "/dashboard", label: "Inicio", icon: "🏠" },
  { href: "/courts", label: "Canchas", icon: "📍" },
  { href: "/reservations", label: "Reservas", icon: "📅" },
  { href: "/tournaments", label: "Torneos", icon: "🏆" },
  { href: "/profile", label: "Perfil", icon: "👤" },
];

const MANAGER_NAV = PLAYER_NAV.filter((item) => item.href !== "/reservations");

export default function AppShell({ session, children }: { session: Session; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const items = session.role === "PLAYER" ? PLAYER_NAV : MANAGER_NAV;

  async function logout() {
    await signOut();
    setConfirmLogout(false);
    router.replace("/login");
    router.refresh();
  }

  return (
    <SessionProvider session={session}>
      <div className="shell">
        <header className="topbar">
          <span className="brand">
            <span className="brand-mark" aria-hidden>
              🏀
            </span>
            MatchPoint
          </span>

          <nav className="nav-top" aria-label="Secciones">
            {items.map((item) => (
              <Link key={item.href} href={item.href} data-active={pathname === item.href}>
                <span aria-hidden>{item.icon}</span> {item.label}
              </Link>
            ))}
          </nav>

          <div className="topbar-user">
            <span className="chip" data-positive="true">
              {ROLE_LABEL[session.role]}
            </span>
            <button type="button" className="btn btn-text" onClick={() => setConfirmLogout(true)}>
              Salir
            </button>
          </div>
        </header>

        <main className="content">{children}</main>

        <nav className="nav-bottom" aria-label="Secciones">
          {items.map((item) => (
            <Link key={item.href} href={item.href} data-active={pathname === item.href}>
              <span aria-hidden>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {confirmLogout ? (
        <ConfirmDialog
          title="¿Cerrar sesión?"
          message="Tendrás que volver a ingresar tus credenciales."
          confirmLabel="Cerrar sesión"
          danger
          onCancel={() => setConfirmLogout(false)}
          onConfirm={logout}
        />
      ) : null}
    </SessionProvider>
  );
}
