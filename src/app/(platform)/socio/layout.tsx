import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { getAuth } from "@/lib/auth";
import { clerkEnabled } from "@/lib/auth/flag";

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
 * Socio subtree guard. Any authenticated member may view socio routes; an
 * unauthenticated user is sent to login. Admins are allowed here on purpose:
 * they can preview the socio experience (via the sidebar's section switcher)
 * while keeping their admin permissions — socio routes expose only published,
 * member-facing content, nothing an admin shouldn't see. Write authorization
 * still lives in each action's `requireRole`, never here.
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
      showDevSwitcher={process.env.NODE_ENV !== "production" && !clerkEnabled()}
    >
      {children}
    </PlatformShell>
  );
}
