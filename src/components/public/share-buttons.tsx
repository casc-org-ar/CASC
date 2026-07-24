"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

/**
 * Social sharing for an article.
 *
 * Instagram is intentionally absent: it offers no web share URL — links can
 * only be shared from its app — so a button would be misleading. The Web Share
 * API is used on devices that support it (mobile), where it opens the native
 * sheet including Instagram if installed.
 */

const shareClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-ink-muted transition-colors hover:border-accent/70 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z" />
    </svg>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.72 2.63 4.18 3.69.58.25 1.04.4 1.4.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.47-.28-.25-.13-1.44-.72-1.66-.8-.22-.08-.38-.12-.55.12-.16.25-.63.79-.77.95-.14.17-.28.19-.53.07-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.43z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.79 8.45-4.93 8.45-9.94" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.9 2.25h3.32l-7.26 8.3 8.54 11.2h-6.69l-5.24-6.84-5.99 6.84H2.25l7.77-8.88L1.83 2.25H8.7l4.73 6.26zm-1.17 17.52h1.84L6.42 4.13H4.45z" />
    </svg>
  );
}

export function ShareButtons({
  title,
  url,
}: {
  title: string;
  /** Absolute or root-relative URL of the article. */
  url: string;
}) {
  const [copiado, setCopiado] = useState(false);

  // Resolve to an absolute URL in the browser; social networks need one.
  const absolute =
    typeof window !== "undefined" ? new URL(url, window.location.origin).href : url;

  const encodedUrl = encodeURIComponent(absolute);
  const encodedTitle = encodeURIComponent(title);

  const redes = [
    {
      label: "Compartir en LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <LinkedinIcon className="h-4 w-4" />,
    },
    {
      label: "Compartir por WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: <WhatsappIcon className="h-4 w-4" />,
    },
    {
      label: "Compartir en Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FacebookIcon className="h-4 w-4" />,
    },
    {
      label: "Compartir en X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <XIcon className="h-4 w-4" />,
    },
  ];

  async function copiarEnlace() {
    try {
      await navigator.clipboard.writeText(absolute);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Clipboard can be blocked; the social links still work.
    }
  }

  /** Native share sheet (mobile) — includes apps like Instagram when present. */
  async function compartirNativo() {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try {
      await navigator.share({ title, url: absolute });
    } catch {
      // User dismissed the sheet.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-ink">Compartir</span>

      {redes.map((red) => (
        <a
          key={red.label}
          href={red.href}
          target="_blank"
          rel="noreferrer"
          aria-label={red.label}
          title={red.label}
          className={shareClass}
        >
          {red.icon}
        </a>
      ))}

      <button
        type="button"
        onClick={copiarEnlace}
        aria-label="Copiar enlace"
        title={copiado ? "¡Enlace copiado!" : "Copiar enlace"}
        className={shareClass}
      >
        {copiado ? (
          <Check className="h-4 w-4 text-primary" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </button>

      {/* Mobile-only: the OS share sheet covers Instagram and everything else. */}
      <button
        type="button"
        onClick={compartirNativo}
        aria-label="Más opciones para compartir"
        title="Más opciones"
        className={`${shareClass} sm:hidden`}
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}
