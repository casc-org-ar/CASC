import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { getAuth } from "@/lib/auth";

/**
 * Admin subtree guard. Resolves the user on the server; only role "admin"
 * passes. A socio hitting an admin route is bounced to their own home —
 * the socio never sees admin tooling.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuth().getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/socio");

  return (
    <PlatformShell
      user={user}
      showDevSwitcher={process.env.NODE_ENV !== "production"}
    >
      {children}
    </PlatformShell>
  );
}
