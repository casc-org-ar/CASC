import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { contactInfo, legalNav, socialLinks } from "./nav-data";

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

/**
 * Public site footer. Content parity phase: reproduces the original CASC
 * footer — contact data, social links, legal links and copyright — verbatim.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand + email */}
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-ink">
              <span className="text-accent">[</span>
              CASC
              <span className="text-accent">]</span>
            </Link>
            <p className="mt-3 text-sm text-ink-muted">
              Cámara Argentina de Shopping Centers
            </p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="mt-3 inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {contactInfo.email}
            </a>
          </div>

          {/* Addresses */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-ink">Domicilio comercial</h3>
              <p className="mt-1 text-sm text-ink-muted">
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
              <h3 className="text-sm font-bold text-ink">Domicilio legal</h3>
              <p className="mt-1 text-sm text-ink-muted">
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

          {/* Legal + social */}
          <div className="space-y-4">
            <ul className="space-y-2">
              {legalNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-ink-muted transition-colors hover:text-primary"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-ink-muted transition-colors hover:text-primary"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                aria-label="Email"
                className="text-ink-muted transition-colors hover:text-primary"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-ink-muted">
            © 2026 Cámara Argentina de Shopping Centers, All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
