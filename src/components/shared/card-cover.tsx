import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Cover image for a listing card (Noticias, Webinars, Informes, home feed).
 * Bleeds to the card edges by cancelling the Card's padding. When no image is
 * set, shows a neutral placeholder (soft gray + image icon) so the card still
 * reads as a visual post and the user understands an image belongs there.
 */
export function CardCover({
  src,
  alt,
  className,
  imageClassName,
}: {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative -mx-5 -mt-5 mb-4 h-40 overflow-hidden rounded-t-xl bg-surface",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className={cn(
            "object-cover transition-transform duration-300 group-hover:scale-105",
            imageClassName,
          )}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 bg-casc-gray-100 text-ink-muted/60">
          <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
          <span className="text-xs font-medium">Sin imagen</span>
        </div>
      )}
    </div>
  );
}
