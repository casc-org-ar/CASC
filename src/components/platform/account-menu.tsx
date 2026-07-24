"use client";

import { LogOut, Settings } from "lucide-react";
import { useState, useTransition } from "react";
import { signOut } from "@/lib/auth/actions";
import { Modal } from "@/components/ui/modal";
import type { CurrentUser } from "@/lib/types/domain";

/**
 * Account footer for the sidebar: user identity + "Ajustes" (Clerk account
 * settings, wired later) + "Cerrar sesión". Lives at the bottom of the
 * sidebar for both roles.
 */
export function AccountMenu({ user }: { user: CurrentUser }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="border-t border-white/10 p-3">
      <div className="mb-2 flex items-center gap-3 px-2 py-1.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
          {user.nombre.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {user.nombre}
          </p>
          <p className="truncate text-xs capitalize text-blue-200/70">
            {user.role}
          </p>
        </div>
      </div>

      <button
        onClick={() => setSettingsOpen(true)}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-blue-100 transition-colors hover:bg-white/10"
      >
        <Settings className="h-4 w-4 shrink-0" />
        Ajustes
      </button>

      <button
        onClick={() => startTransition(() => void signOut())}
        disabled={pending}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-blue-100 transition-colors hover:bg-white/10 disabled:opacity-50"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Cerrar sesión
      </button>

      {/* Ajustes: placeholder until Clerk's account component is connected. */}
      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Ajustes de cuenta"
      >
        <div className="py-4 text-center">
          <Settings className="mx-auto h-8 w-8 text-accent" aria-hidden />
          <p className="mt-3 text-sm text-ink-muted">
            La configuración de cuenta estará disponible al conectar Clerk.
          </p>
        </div>
      </Modal>
    </div>
  );
}
