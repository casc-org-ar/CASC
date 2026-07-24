import { SectionHeading } from "@/components/shared/section-heading";
import { CardGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <SectionHeading
        title="Bolsa de Trabajo"
        subtitle="Perfiles de candidatos para tus búsquedas"
      />
      <CardGridSkeleton />
    </>
  );
}
