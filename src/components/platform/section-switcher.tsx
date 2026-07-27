"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Eye } from "lucide-react";
import type { UserRole } from "@/lib/types/domain";

/**
 * Admin-only section switcher. Lets an admin preview the socio section and
 * return to the admin panel. This is NAVIGATION, not a role change: the admin
 * stays admin on every request, and server actions still enforce `requireRole`.
 *
 * Navigates programmatically and calls `router.refresh()` so the target
 * layout (a server component) re-renders with the new section instead of
 * serving a cached tree — otherwise the panel chrome could lag behind the URL.
 */
export function SectionSwitcher({
  section,
  onNavigate,
}: {
  section: UserRole;
  onNavigate: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const viewingSocio = section === "socio";
  const target = viewingSocio ? "/admin" : "/socio";

  const go = () => {
    onNavigate();
    startTransition(() => {
      router.push(target);
      router.refresh();
    });
  };

  return (
    <div className="border-b border-white/10 px-3 py-2">
      <button
        onClick={go}
        disabled={pending}
        className="flex w-full items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-xs font-medium text-blue-100 transition-colors hover:bg-white/10 disabled:opacity-60"
      >
        {viewingSocio ? (
          <>
            <ArrowLeftRight className="h-3.5 w-3.5 shrink-0" />
            Volver al panel de administración
          </>
        ) : (
          <>
            <Eye className="h-3.5 w-3.5 shrink-0" />
            Ver la plataforma como socio
          </>
        )}
      </button>
      {viewingSocio && (
        <p className="mt-1.5 px-1 text-[11px] leading-tight text-blue-200/60">
          Estás viendo la vista de socio. Tus permisos siguen siendo de
          administrador.
        </p>
      )}
    </div>
  );
}
