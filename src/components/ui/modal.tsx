"use client";

import { X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { cn } from "@/lib/utils";

type ModalSize = "md" | "lg" | "xl";

const sizeClasses: Record<ModalSize, string> = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Controls the dialog width. Defaults to "md". */
  size?: ModalSize;
  children: React.ReactNode;
}

/** Lightweight accessible modal. Closes on backdrop click or Escape. */
export function Modal({
  open,
  onClose,
  title,
  size = "md",
  children,
}: ModalProps) {
  const mounted = useHydrated();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  // Portal to document.body so the fixed overlay anchors to the viewport,
  // not to a transformed ancestor (e.g. the sidebar uses translate-x, which
  // would otherwise trap `position: fixed` inside it).
  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(
          "w-full animate-fade-in-up rounded-xl border border-border bg-white shadow-lg",
          sizeClasses[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold tracking-tight text-ink">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-ink-muted hover:bg-surface hover:text-ink"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
