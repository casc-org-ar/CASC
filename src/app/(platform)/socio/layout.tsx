import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { getAuth } from "@/lib/auth";
import { getMemberAccess } from "@/lib/auth/member-status";
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

  // A member reaches the platform only while they have an ACTIVE socios row.
  // Their Clerk account outlives the socios record, so we must gate on the
  // record, not just on being signed in: a member given de baja (estado
  // "inactivo") is bounced out. Admins have role "admin" and no socios row, so
  // they skip this check entirely.
  //
  // The two failure modes go to DIFFERENT pages. A member whose row is not
  // linked to their Clerk user yet (the window between accepting the invitation
  // and the `user.created` webhook landing) is not deactivated — telling them
  // their access "was disabled" sends them to support over a state that
  // resolves itself.
  if (user.role === "socio") {
    const access = await getMemberAccess();
    if (!access.allowed) {
      redirect(
        access.reason === "inactivo"
          ? "/cuenta-inactiva"
          : "/cuenta-en-activacion",
      );
    }
  }

  return (
    <PlatformShell
      user={user}
      showDevSwitcher={process.env.NODE_ENV !== "production" && !clerkEnabled()}
    >
      {children}
    </PlatformShell>
  );
}
