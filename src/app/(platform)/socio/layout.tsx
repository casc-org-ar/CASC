import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { getAuth } from "@/lib/auth";

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
