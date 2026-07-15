import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Building2, Landmark, Mail } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { ContactForm } from "@/components/public/contact-form";
import { ButtonAnchor } from "@/components/ui/button";
import { IconFrame } from "@/components/ui/icon-frame";
import { contactInfo } from "@/components/public/nav-data";

/**
 * Contact page. Content remains sourced from the legacy contact page and
 * contact data is reused from the shared nav-data single source of truth.
 */

export const metadata: Metadata = {
  title: "Contacto — CASC",
  description:
    "Contactanos para obtener más información sobre la Cámara Argentina de Shopping Centers, nuestros servicios, actividades y beneficios.",
};

const contactCards: {
  title: string;
  value: string;
  href: string;
  action?: string;
  icon: LucideIcon;
  external?: boolean;
}[] = [
  {
    title: "Email",
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
    icon: Mail,
  },
  {
    title: "Domicilio comercial",
    value: contactInfo.commercialAddress,
    href: contactInfo.commercialMap,
    action: "Ver mapa",
    icon: Building2,
    external: true,
  },
  {
    title: "Domicilio legal",
    value: contactInfo.legalAddress,
    href: contactInfo.legalMap,
    action: "Ver mapa",
    icon: Landmark,
    external: true,
  },
];

export default function ContactoPage() {
  return (
    <>
      <PageHero
        title="Contactanos"
        subtitle="Contactanos para obtener más información sobre la Cámara Argentina de Shopping Centers, nuestros servicios, actividades y beneficios para Centros Comerciales y actores de la industria en Argentina."
      />

      <section className="bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
            <div className="grid gap-4 lg:h-full lg:grid-rows-[auto_1fr_1fr]">
              {contactCards.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="group rounded-2xl border border-primary-hover/40 bg-primary p-5 text-white transition-colors duration-200 hover:border-accent"
                  >
                    <div className="flex gap-4">
                      <IconFrame
                        size="md"
                        variant="secondary"
                        contentClassName="text-primary"
                      >
                        <Icon
                          className="h-5 w-5"
                          strokeWidth={1.8}
                          aria-hidden
                        />
                      </IconFrame>
                      <div className="min-w-0">
                        <h2 className="text-base font-extrabold tracking-tight text-white">
                          {item.title}
                        </h2>
                        {item.action ? (
                          <>
                            <p className="mt-1.5 text-sm leading-6 text-white/75">
                              {item.value}
                            </p>
                            <ButtonAnchor
                              href={item.href}
                              target={item.external ? "_blank" : undefined}
                              rel={item.external ? "noreferrer" : undefined}
                              variant="secondary"
                              size="sm"
                              className="mt-3"
                            >
                              {item.action}
                              <ArrowUpRight
                                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                strokeWidth={1.8}
                                aria-hidden
                              />
                            </ButtonAnchor>
                          </>
                        ) : (
                          <a
                            href={item.href}
                            className="mt-1.5 inline-flex text-sm leading-6 text-white/75 transition-colors hover:text-accent"
                          >
                            {item.value}
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 lg:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
