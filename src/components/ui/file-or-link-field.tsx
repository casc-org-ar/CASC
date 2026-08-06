"use client";

import { Link2, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/field";
import { uploadContentImage } from "@/lib/actions/upload-image";
import { uploadInformePdf } from "@/lib/actions/upload-informe";
import {
  compressImage,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
} from "@/lib/utils/image-compress";
import { cn } from "@/lib/utils";

/** Human-readable MB for messages, e.g. "8.3 MB". */
const formatMB = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/** PDF uploads have their own (larger) size ceiling. */
const MAX_PDF_MB = 20;
const MAX_PDF_BYTES = MAX_PDF_MB * 1024 * 1024;

type Mode = "upload" | "link";

interface FileOrLinkFieldProps {
  /** Form field name; the resolved URL is submitted under this name as a hidden input. */
  name: string;
  /** Current value (an uploaded URL/path or a pasted link). */
  value: string;
  onChange: (value: string) => void;
  /**
   * What kind of file this field uploads. "image" (default) compresses and
   * stores a public URL; "pdf" uploads to the private informes bucket and
   * stores the object path.
   */
  kind?: "image" | "pdf";
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
 * which field to use. Uploading pushes the file to Supabase Storage (public
 * `portadas` bucket) and stores the returned public URL — the resolved URL
 * travels in a hidden input so the parent form submits it like any other field.
 */
export function FileOrLinkField({
  name,
  value,
  onChange,
  kind = "image",
  accept,
  uploadLabel = "Subir archivo",
  linkPlaceholder = "https://…",
  hint,
}: FileOrLinkFieldProps) {
  const isPdf = kind === "pdf";
  const limitBytes = isPdf ? MAX_PDF_BYTES : MAX_UPLOAD_BYTES;
  const limitMb = isPdf ? MAX_PDF_MB : MAX_UPLOAD_MB;
  // Start on the tab that matches the existing value: a pasted link stays on
  // the link tab, everything else (empty or an uploaded URL) on upload.
  const [mode, setMode] = useState<Mode>(
    value.startsWith("http") ? "link" : "upload",
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    // Guard the original before doing anything: reject an oversized file up
    // front with a clear reason, instead of letting the upload fail server-side.
    if (file.size > limitBytes) {
      setError(
        `El archivo pesa ${formatMB(file.size)}. El máximo es ${limitMb} MB. Probá con un archivo más liviano.`,
      );
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      if (isPdf) {
        const fd = new FormData();
        fd.set("file", file);
        const result = await uploadInformePdf(fd);
        if (result.ok) onChange(result.path);
        else setError(result.error);
      } else {
        // Compress/resize in the browser before uploading to save storage.
        const optimized = await compressImage(file);
        const fd = new FormData();
        fd.set("file", optimized);
        const result = await uploadContentImage(fd);
        if (result.ok) onChange(result.url);
        else setError(result.error);
      }
    } catch (err) {
      // A body-size rejection from the server surfaces here; name the reason.
      const msg = err instanceof Error ? err.message : "";
      if (/body|413|exceeded|limit/i.test(msg)) {
        setError(
          `El archivo es demasiado pesado para subirlo (máx ${limitMb} MB). Probá con uno más liviano.`,
        );
      } else {
        setError("No pudimos subir el archivo. Intentá de nuevo.");
      }
    } finally {
      setUploading(false);
      // Reset so re-picking the same file fires onChange again.
      e.target.value = "";
    }
  };

  const inputId = `${name}-file`;
  // An uploaded value: a public URL (images) or a stored object path (PDFs).
  // A pasted external link always starts with http and is not an "upload".
  const uploaded = isPdf
    ? value.length > 0 && !value.startsWith("http")
    : value.startsWith("http");

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
            className={cn(
              "flex items-center gap-2 rounded-md border border-dashed border-border bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors",
              uploading
                ? "cursor-wait opacity-70"
                : "cursor-pointer hover:border-primary hover:bg-white",
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Subiendo…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 text-primary" />
                {uploaded
                  ? isPdf
                    ? "Cambiar archivo"
                    : "Cambiar imagen"
                  : uploadLabel}
              </>
            )}
          </label>
          <input
            id={inputId}
            type="file"
            accept={accept}
            onChange={onFilePick}
            disabled={uploading}
            className="sr-only"
          />
          {uploaded && !uploading && (
            <p className="mt-1.5 truncate text-xs text-ink-muted">
              {isPdf ? "PDF cargado correctamente." : "Imagen cargada correctamente."}
            </p>
          )}
          {/* Preventive hint about the size limit, shown in the idle state. */}
          {!uploaded && !uploading && !error && (
            <p className="mt-1.5 text-xs text-ink-muted">
              {isPdf
                ? `Formato: PDF. Peso máximo: ${limitMb} MB.`
                : `Formatos: JPG, PNG o WebP. Peso máximo: ${limitMb} MB.`}
            </p>
          )}
          {error && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
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
