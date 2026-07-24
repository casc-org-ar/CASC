import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { contactInfo, footerColumns, legalNav, socialLinks } from "./nav-data";

/**
 * Brand icons (LinkedIn, Instagram). lucide-react dropped brand logos over
 * trademark concerns, so these SVGs are kept verbatim from the original site.
 */
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
    </svg>
  );
}

const footerDescription =
  "La Cámara Argentina de Shopping Centers es una entidad sin fines de lucro que desde hace más de 35 años representa, conecta y acompaña a los centros comerciales del país.";

/** Social icon buttons, styled for the dark navy footer surface. */
const socialLinkClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:border-white/40 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-casc-navy-900";

/**
 * Public site footer. Uses real CASC navigation, social links and legal links.
 *
 * Layout: menu sections come first, then the brand block (logo + socials)
 * below them. The institutional navy background moved here from the home
 * platform CTA, so every element is styled for a dark surface.
 *
 * The newsletter subscription lives in the members-only platform, not here.
 */
export function SiteFooter() {
  return (
    <footer className="bg-casc-navy-900 text-white print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/*
          Brand block on the left, menu sections on the right. Below lg they
          stack (brand first, then the menu), and the menu itself collapses
          from three columns to two, then one on the narrowest screens.
        */}
        <div className="grid gap-10 border-b border-white/15 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
          <div className="flex max-w-md flex-col">
            <Link
              href="/"
              aria-label="CASC — Inicio"
              className="inline-flex w-fit"
            >
              <Image
                src="/assets/brand/casc-logo.webp"
                alt="Cámara Argentina de Shopping Centers"
                width={312}
                height={104}
                className="h-10 w-auto brightness-0 invert sm:h-12"
              />
            </Link>

            <p className="mt-4 text-sm leading-6 text-white/75">
              {footerDescription}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn de CASC"
                className={socialLinkClass}
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram de CASC"
                className={socialLinkClass}
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                aria-label="Enviar email a CASC"
                className={socialLinkClass}
              >
                <Mail className="h-5 w-5" strokeWidth={1.8} aria-hidden />
              </a>
            </div>
          </div>

          <nav
            aria-label="Secciones del sitio"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {footerColumns.map((column) => (
              <div key={column.label}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  {column.label}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.children.map((link) => (
                    <li key={`${column.label}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/75 transition-colors hover:text-white hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/60">
            © 2026 Cámara Argentina de Shopping Centers, Todos los derechos
            reservados.
          </p>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-white/60 transition-colors hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

