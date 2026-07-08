import { SectionHeading } from "@/components/shared/section-heading";
import { CardGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <SectionHeading title="Noticias" subtitle="Novedades institucionales" />
      <CardGridSkeleton />
    </>
  );
}
