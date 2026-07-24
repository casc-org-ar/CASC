import { SectionHeading } from "@/components/shared/section-heading";
import { CardGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <SectionHeading
        title="Beneficios"
        subtitle="Hoteles con descuentos para socios de la CASC"
      />
      <CardGridSkeleton />
    </>
  );
}
