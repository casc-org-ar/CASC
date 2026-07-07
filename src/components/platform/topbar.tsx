"use client";

import { Menu, ShieldCheck } from "lucide-react";
import { RoleSwitcher } from "@/components/platform/role-switcher";
import type { UserRole } from "@/lib/types/domain";

interface TopbarProps {
  role: UserRole;
  showDevSwitcher: boolean;
  onMenuClick: () => void;
}

/**
 * Topbar: mobile menu toggle + dev role switcher. User identity, Ajustes and
 * logout now live in the sidebar's account footer, so they're not repeated here.
 * Admins get a persistent "Panel de administración" badge so it's always clear
 * which panel is active.
 */
export function Topbar({ role, showDevSwitcher, onMenuClick }: TopbarProps) {
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
        <span className="inline-flex items-center gap-1.5 rounded-md bg-casc-black px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          <ShieldCheck className="h-3.5 w-3.5" />
          Panel de administración
        </span>
      )}

      <div className="ml-auto flex items-center gap-3">
        {showDevSwitcher && <RoleSwitcher current={role} />}
      </div>
    </header>
  );
}
