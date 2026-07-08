import { SectionHeading } from "@/components/shared/section-heading";
import { CardGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <SectionHeading
        title="Informes"
        subtitle="Documentos y reportes del sector"
      />
      <CardGridSkeleton />
    </>
  );
}
