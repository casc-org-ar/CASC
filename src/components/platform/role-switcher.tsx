"use client";

import { useTransition } from "react";
import { signInAs } from "@/lib/auth/actions";
import type { UserRole } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

/**
 * Dev-only role switcher. Lets the demo flip between admin and socio views
 * without a real login. Rendered only when NODE_ENV !== "production".
 */
export function RoleSwitcher({ current }: { current: UserRole }) {
  const [pending, startTransition] = useTransition();

  const switchTo = (role: UserRole) =>
    startTransition(() => {
      void signInAs(role);
    });

  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-0.5 text-xs">
      <span className="px-2 text-ink-muted">Vista dev:</span>
      {(["admin", "socio"] as const).map((role) => (
        <button
          key={role}
          disabled={pending}
          onClick={() => switchTo(role)}
          className={cn(
            "rounded px-2 py-1 font-medium capitalize transition-colors disabled:opacity-50",
            current === role
              ? "bg-primary text-white"
              : "text-ink hover:bg-white",
          )}
        >
          {role}
        </button>
      ))}
    </div>
  );
}
