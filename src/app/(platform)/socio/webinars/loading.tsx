import { SectionHeading } from "@/components/shared/section-heading";
import { CardGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <SectionHeading
        title="Webinars"
        subtitle="Charlas y capacitaciones de la Cámara"
      />
      <CardGridSkeleton />
    </>
  );
}
