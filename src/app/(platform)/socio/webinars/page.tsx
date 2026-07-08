import { SectionHeading } from "@/components/shared/section-heading";
import { getDataLayer } from "@/lib/data";
import { onlyPublished } from "@/lib/data/published";
import { WebinarsList } from "./webinars-list";

/** Socio Webinars: grid of published webinars with a category filter. */
export default async function SocioWebinarsPage() {
  const webinars = onlyPublished(await getDataLayer().webinars.list());

  return (
    <>
      <SectionHeading
        title="Webinars"
        subtitle="Charlas y capacitaciones de la Cámara"
      />
      <WebinarsList webinars={webinars} />
    </>
  );
}
