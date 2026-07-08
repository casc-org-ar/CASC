"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import type { ToastVariant } from "./toast-context";
import { useToastState } from "./toast-context";

const variantStyles: Record<
  ToastVariant,
  { icon: LucideIcon; iconClass: string; barClass: string }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-green-600",
    barClass: "bg-green-600",
  },
  error: {
    icon: AlertCircle,
    iconClass: "text-red-600",
    barClass: "bg-red-600",
  },
  info: {
    icon: Info,
    iconClass: "text-casc-navy-700",
    barClass: "bg-accent",
  },
};

/**
 * Renders the stack of active toasts, bottom-right. Portaled to document.body
 * so its fixed position anchors to the viewport (same reason as Modal). Mount
 * this once, inside the ToastProvider.
 */
export function ToastViewport() {
  const { toasts, dismiss } = useToastState();
  const hydrated = useHydrated();

  if (!hydrated) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-60 flex w-full max-w-sm flex-col gap-2"
      role="region"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => {
        const { icon: Icon, iconClass, barClass } = variantStyles[toast.variant];
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-lg border border-border bg-white px-4 py-3 pl-5 shadow-lg"
          >
            <span className={cn("absolute left-0 top-0 h-full w-1", barClass)} />
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconClass)} />
            <p className="flex-1 text-sm text-ink">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Cerrar notificación"
              className="rounded p-0.5 text-ink-muted transition-colors hover:bg-surface hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
