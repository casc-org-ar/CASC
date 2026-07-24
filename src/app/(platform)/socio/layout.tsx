import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { getAuth } from "@/lib/auth";

/**
 * Title template for socio pages: each page sets a short title (e.g. "Informes")
 * and Next composes it as "Informes — CASC Socios". Pages without a title fall
 * back to the default.
 */
export const metadata: Metadata = {
  title: {
    template: "%s — CASC Socios",
    default: "Plataforma de Socios — CASC",
  },
};

/**
 * Socio subtree guard. Both roles may view socio routes, but an
 * unauthenticated user is sent to login. (Admins can preview the socio
 * side via the dev role switcher.)
 */
export default async function SocioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuth().getCurrentUser();

  if (!user) redirect("/login");

  return (
    <PlatformShell
      user={user}
      showDevSwitcher={process.env.NODE_ENV !== "production"}
    >
      {children}
    </PlatformShell>
  );
}
