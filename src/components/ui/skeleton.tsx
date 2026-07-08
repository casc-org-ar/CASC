import { cn } from "@/lib/utils";

/**
 * Skeleton placeholder with a shimmer sweep. Use to reserve the shape of
 * content while it loads, so the layout doesn't jump when data arrives.
 * The shimmer is a gradient bar translated across the element; it collapses
 * to still under `prefers-reduced-motion` (handled globally).
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-casc-gray-100",
        // The sweeping highlight.
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[casc-shimmer_1.5s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

/** Skeleton matching a listing card (cover + badges + title + text). */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <Skeleton className="-mx-5 -mt-5 mb-4 h-40 rounded-b-none" />
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-1.5 h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}

/** A responsive grid of card skeletons, matching the socio listing grids. */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
