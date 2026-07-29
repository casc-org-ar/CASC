import { SafeImage } from "@/components/shared/safe-image";
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
      <SafeImage
        src={src}
        alt={alt}
        className={cn(
          "transition-transform duration-300 group-hover:scale-105",
          imageClassName,
        )}
      />
    </div>
  );
}
