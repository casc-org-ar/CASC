import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { ContactForm } from "@/components/public/contact-form";
import { contactInfo } from "@/components/public/nav-data";

/**
 * Contacto — migrated verbatim from contacto.html. Contact data is reused from
 * the shared nav-data single source of truth.
 */

export const metadata: Metadata = {
  title: "Contacto — CASC",
  description:
    "Contactanos para obtener más información sobre la Cámara Argentina de Shopping Centers, nuestros servicios, actividades y beneficios.",
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        title="Contactanos"
        subtitle="Contactanos para obtener más información sobre la Cámara Argentina de Shopping Centers, nuestros servicios, actividades y beneficios para Centros Comerciales y actores de la industria en Argentina."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Datos de contacto */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-ink">Email</h2>
              <a
                href={`mailto:${contactInfo.email}`}
                className="mt-1 inline-block font-light text-ink-muted transition-colors hover:text-primary"
              >
                {contactInfo.email}
              </a>
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">Domicilio comercial</h2>
              <p className="mt-1 font-light text-ink-muted">
                {contactInfo.commercialAddress}
              </p>
              <a
                href={contactInfo.commercialMap}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <MapPin className="h-4 w-4" aria-hidden />
                Ver mapa
              </a>
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">Domicilio legal</h2>
              <p className="mt-1 font-light text-ink-muted">
                {contactInfo.legalAddress}
              </p>
              <a
                href={contactInfo.legalMap}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <MapPin className="h-4 w-4" aria-hidden />
                Ver mapa
              </a>
            </div>
          </div>

          {/* Formulario */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
