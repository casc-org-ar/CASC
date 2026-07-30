"use client";

import { Menu, ShieldCheck, Store } from "lucide-react";
import { usePathname } from "next/navigation";
import { RoleSwitcher } from "@/components/platform/role-switcher";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types/domain";

interface TopbarProps {
  role: UserRole;
  showDevSwitcher: boolean;
  onMenuClick: () => void;
}

/**
 * Topbar: mobile menu toggle + dev role switcher + a badge showing which panel
 * is active. Only admins see the badge, but its label/color track the SECTION
 * being viewed (from the URL), not the role — so when an admin previews the
 * socio side it reads "Panel de socio" (navy), not "Panel de administración".
 * That avoids confusing the admin about where they are.
 */
export function Topbar({ role, showDevSwitcher, onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const inSocioSection = pathname.startsWith("/socio");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-white/80 px-4 backdrop-blur lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-ink hover:bg-surface lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      {role === "admin" && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white",
            inSocioSection ? "bg-casc-navy-700" : "bg-casc-black",
          )}
        >
          {inSocioSection ? (
            <>
              <Store className="h-3.5 w-3.5" />
              Panel de socio
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5" />
              Panel de administración
            </>
          )}
        </span>
      )}

      <div className="ml-auto flex items-center gap-3">
        {showDevSwitcher && <RoleSwitcher current={role} />}
      </div>
    </header>
  );
}
