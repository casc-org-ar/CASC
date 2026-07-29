"use client";

import Image from "next/image";
import { LogOut, Settings } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { SignOutButton, UserProfile, useUser } from "@clerk/nextjs";
import { signOut } from "@/lib/auth/actions";
import { clerkEnabled } from "@/lib/auth/flag";
import { clerkAppearance } from "@/lib/auth/clerk-appearance";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { Modal } from "@/components/ui/modal";
import type { CurrentUser } from "@/lib/types/domain";

/**
 * Account footer for the sidebar: user identity + "Ajustes" (account settings)
 * + "Cerrar sesión". With Clerk active it uses Clerk's real components
 * (<UserButton>, <UserProfile>, <SignOutButton>); in mock mode it renders the
 * prototype identity + mock sign-out. Lives at the bottom of the sidebar for
 * both roles.
 */
export function AccountMenu({ user }: { user: CurrentUser }) {
  return clerkEnabled() ? (
    <ClerkAccount user={user} />
  ) : (
    <MockAccount user={user} />
  );
}

/** Clerk-backed account footer. Real avatar, real profile, real sign-out. */
function ClerkAccount({ user }: { user: CurrentUser }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user: clerkUser } = useUser();

  return (
    <div className="border-t border-white/10 p-3">
      {/* Identity only — a plain avatar, NOT Clerk's <UserButton> (which brings
          its own dropdown with profile + sign-out and would duplicate the
          buttons below). All actions live in the buttons, one place each. */}
      <div className="mb-2 flex items-center gap-3 px-2 py-1.5">
        {clerkUser?.hasImage ? (
          <Image
            src={clerkUser.imageUrl}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
            {user.nombre.charAt(0)}
          </div>
        )}
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

      {/* Sign out → back to the public site, fully logged out. */}
      <SignOutButton redirectUrl="/">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-blue-100 transition-colors hover:bg-white/10">
          <LogOut className="h-4 w-4 shrink-0" />
          Cerrar sesión
        </button>
      </SignOutButton>

      {/* Ajustes: Clerk's <UserProfile> brings its own card + header, so it is
          rendered in a chrome-less overlay (no extra modal box) to avoid a
          double frame. Backdrop click / Escape closes it. */}
      {settingsOpen && (
        <ProfileOverlay onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}

/**
 * Chrome-less overlay hosting Clerk's <UserProfile>. We don't reuse the shared
 * <Modal> here because UserProfile already renders its own titled card —
 * wrapping it would nest two frames. This just dims the backdrop and centers
 * Clerk's own panel.
 *
 * Portaled to document.body: the sidebar uses `translate-x`, and a transformed
 * ancestor makes `position: fixed` anchor to the sidebar instead of the
 * viewport — which would trap this overlay inside the sidebar. The shared
 * <Modal> portals for the same reason.
 */
function ProfileOverlay({ onClose }: { onClose: () => void }) {
  const mounted = useHydrated();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ajustes de cuenta"
    >
      <div onClick={(e) => e.stopPropagation()}>
        {/* hash routing: <UserProfile> runs inside this modal, not on its own
            route. Without it Clerk treats the current path as a catch-all and
            probes a non-existent child URL (the ...catchall_check 404). */}
        <UserProfile routing="hash" appearance={clerkAppearance} />
      </div>
    </div>,
    document.body,
  );
}

/** Mock account footer (dev/prototype): static identity + mock sign-out. */
function MockAccount({ user }: { user: CurrentUser }) {
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
