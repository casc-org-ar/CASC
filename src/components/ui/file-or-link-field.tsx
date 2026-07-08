"use client";

import { Link2, Upload } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type Mode = "upload" | "link";

interface FileOrLinkFieldProps {
  /** Form field name; the resolved URL is submitted under this name as a hidden input. */
  name: string;
  /** Current value (an uploaded mock path or a pasted link). */
  value: string;
  onChange: (value: string) => void;
  /** `accept` attribute for the file input, e.g. "image/*" or ".pdf". */
  accept?: string;
  /** Label for the upload button, e.g. "Subir imagen" or "Subir PDF". */
  uploadLabel?: string;
  /** Placeholder shown in the link input. */
  linkPlaceholder?: string;
  /** Helper text shown under the control. */
  hint?: string;
}

/**
 * File-or-link picker with two tabs: upload a file or paste an external link.
 * One control is shown at a time so a non-technical admin never has to guess
 * which field to use. Upload is mocked (fills the value with `/mock/<name>`)
 * until Vercel Blob is wired up — the resolved URL travels in a hidden input
 * so the parent form submits it like any other field.
 */
export function FileOrLinkField({
  name,
  value,
  onChange,
  accept,
  uploadLabel = "Subir archivo",
  linkPlaceholder = "https://…",
  hint,
}: FileOrLinkFieldProps) {
  // Start on the tab that matches the existing value: a pasted link stays on
  // the link tab, everything else (empty or an uploaded path) on upload.
  const [mode, setMode] = useState<Mode>(
    value.startsWith("http") ? "link" : "upload",
  );

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // In production this URL comes from the Blob upload response.
    if (file) onChange(`/mock/${file.name}`);
  };

  const inputId = `${name}-file`;
  const uploaded = value && !value.startsWith("http");

  return (
    <div>
      <div className="mb-2 inline-flex rounded-md border border-accent/40 bg-accent/15 p-0.5">
        <TabButton
          active={mode === "upload"}
          onClick={() => setMode("upload")}
          icon={<Upload className="h-3.5 w-3.5" />}
          label="Subir archivo"
        />
        <TabButton
          active={mode === "link"}
          onClick={() => setMode("link")}
          icon={<Link2 className="h-3.5 w-3.5" />}
          label="Pegar link"
        />
      </div>

      {mode === "upload" ? (
        <>
          <label
            htmlFor={inputId}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-primary hover:bg-white"
          >
            <Upload className="h-4 w-4 text-primary" />
            {uploaded ? "Cambiar archivo" : uploadLabel}
          </label>
          <input
            id={inputId}
            type="file"
            accept={accept}
            onChange={onFilePick}
            className="sr-only"
          />
          {uploaded && (
            <p className="mt-1.5 truncate text-xs text-ink-muted">
              Archivo cargado: {value}
            </p>
          )}
        </>
      ) : (
        <Input
          type="url"
          value={value.startsWith("http") ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={linkPlaceholder}
        />
      )}

      {/* Carries the resolved URL (upload or link) into the submitted form data. */}
      <input type="hidden" name={name} value={value} />
      {hint && <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-white text-ink shadow-sm"
          : "text-casc-navy-700 hover:bg-white/50",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
