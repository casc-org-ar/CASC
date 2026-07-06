import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "muted" | "accent";

const tones: Record<Tone, string> = {
  neutral: "bg-casc-gray-100 text-ink",
  success: "bg-green-100 text-green-800",
  muted: "bg-surface text-ink-muted border border-border",
  accent: "bg-accent/20 text-casc-navy-700",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Maps a publication/member status to a badge tone + label. */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: Tone; label: string }> = {
    publicado: { tone: "success", label: "Publicado" },
    borrador: { tone: "muted", label: "Borrador" },
    activo: { tone: "success", label: "Activo" },
    inactivo: { tone: "muted", label: "Inactivo" },
  };
  const entry = map[status] ?? { tone: "neutral" as Tone, label: status };
  return <Badge tone={entry.tone}>{entry.label}</Badge>;
}
