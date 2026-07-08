import { SectionHeading } from "@/components/shared/section-heading";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <SectionHeading
        title="Newsletter"
        subtitle="Archivo de ediciones del boletín"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-14" />
              </div>
              <Skeleton className="mb-2 h-5 w-2/3" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
