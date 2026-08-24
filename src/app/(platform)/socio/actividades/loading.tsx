import { SectionHeading } from "@/components/shared/section-heading";
import { CardGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <SectionHeading
        title="Actividades"
        subtitle="Capacitaciones, congresos y eventos de la Cámara"
      />
      <CardGridSkeleton />
    </>
  );
}
