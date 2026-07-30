/**
 * JSON-LD structured data describing CASC as an Organization. Helps search
 * engines show a rich result (name, logo, social profiles) and understand what
 * the site represents. Rendered as a static <script> — no user input, so it's
 * safe to serialize directly.
 */
const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://casc.org.ar";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cámara Argentina de Shopping Centers",
  alternateName: "CASC",
  url: siteUrl,
  logo: `${siteUrl}/assets/brand/casc-logo.webp`,
  description:
    "Entidad sin fines de lucro que representa a los centros comerciales, retailers y proveedores de la Argentina.",
  foundingDate: "1990",
  areaServed: "AR",
  email: "casc@casc.org.ar",
  sameAs: [
    "https://www.linkedin.com/company/camaraargentinadeshoppingcenters",
    "https://www.instagram.com/camaraargentinadeshopping/",
  ],
};

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      // Static, trusted content — not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}
