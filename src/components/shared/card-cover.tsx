import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Cover image for a listing card (Noticias, Webinars, Informes). Bleeds to the
 * card edges by cancelling the Card's padding. When no image is set, falls back
 * to the brand bracket motif so the card still reads as a visual post.
 */
export function CardCover({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
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
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-casc-navy-900">
          <span className="text-4xl font-bold text-accent">[ ]</span>
        </div>
      )}
    </div>
  );
}
