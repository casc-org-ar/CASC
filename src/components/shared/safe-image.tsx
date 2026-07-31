"use client";

import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Content image that tolerates arbitrary external URLs.
 *
 * Content authors paste image URLs from anywhere, so we deliberately do NOT use
 * `next/image` here: it rejects un-allowlisted hosts by THROWING during render,
 * which takes the whole page down. A plain <img> renders any URL, and an
 * `onError` fallback means a dead/removed remote image degrades to a neutral
 * placeholder instead of a broken-image icon or a crash.
 *
 * Trade-off (accepted): no next/image optimization, and the image depends on
 * the remote host staying up. For author-controlled covers this is the pragmatic
 * choice; uploads to our own Storage would remove that dependency later.
 */
export function SafeImage({
  src,
  alt,
  className,
  fit = "cover",
}: {
  src?: string;
  alt: string;
  className?: string;
  /**
   * How the image fills its box. "cover" (default) crops to fill — right for
   * uniform card thumbnails. "contain" shows the whole image at its natural
   * proportions without cropping or stretching — right for the article detail,
   * where the real photo must be shown intact, not distorted.
   */
  fit?: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-casc-gray-100 text-ink-muted/60">
        <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
        <span className="text-xs font-medium">Sin imagen</span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element -- external content URLs
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn(
        "h-full w-full",
        fit === "contain" ? "object-contain" : "object-cover",
        className,
      )}
    />
  );
}
