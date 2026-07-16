"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mainNav, isNavGroup, type NavItem } from "./nav-data";

/** Pathname portion of a nav href, stripping query and hash. */
function hrefPathname(href: string): string {
  return href.split(/[?#]/)[0];
}

/** The `categoria` query param of a nav href, if any. */
function hrefCategoria(href: string): string | null {
  const query = href.split("?")[1]?.split("#")[0];
  return query ? new URLSearchParams(query).get("categoria") : null;
}

/**
 * Whether the current route matches a nav destination. When the href carries a
 * `categoria` query param, it must also match the active category — otherwise
 * every `/asociados?categoria=…` link would light up on the same pathname.
 */
function isHrefActive(
  pathname: string,
  activeCategoria: string | null,
  href: string,
): boolean {
  const target = hrefPathname(href);
  const pathMatch =
    target === "/"
      ? pathname === "/"
      : pathname === target || pathname.startsWith(`${target}/`);
  if (!pathMatch) return false;

  const targetCategoria = hrefCategoria(href);
  if (targetCategoria) return activeCategoria === targetCategoria;
  return true;
}

/** Whether any child of a group is the active route. */
function isGroupActive(
  pathname: string,
  activeCategoria: string | null,
  item: NavItem,
): boolean {
  return (
    isNavGroup(item) &&
    item.children.some((child) =>
      isHrefActive(pathname, activeCategoria, child.href),
    )
  );
}

/**
 * Public site header. Content parity phase: reproduces the original CASC menu
 * structure (grouped dropdowns + direct links) plus the Ingresar / Asociarse
 * CTAs. Styling uses the shared design tokens, not the legacy Flowbite theme.
 *
 * Reveal animations (dropdown + mobile panel) use a staggered card-style feel
 * powered by `motion`, and collapse to no motion when the user prefers reduced
 * motion.
 */
export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategoria = searchParams.get("categoria");

  const panelVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.2, ease: "easeOut", staggerChildren: 0.05 },
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -8,
      transition: { duration: prefersReducedMotion ? 0 : 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center" aria-label="CASC — Inicio">
          <Image
            src="/assets/brand/casc-logo.webp"
            alt="Cámara Argentina de Shopping Centers"
            width={132}
            height={44}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) =>
            isNavGroup(item) ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenGroup(item.label)}
                onMouseLeave={() =>
                  setOpenGroup((current) =>
                    current === item.label ? null : current,
                  )
                }
              >
                <button
                  className={cn(
                    "relative z-10 flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                    openGroup === item.label
                      ? "rounded-t-lg bg-casc-navy-500 text-white"
                      : isGroupActive(pathname, activeCategoria, item)
                        ? "rounded-md text-primary hover:bg-surface"
                        : "rounded-md text-ink hover:bg-surface",
                  )}
                  aria-expanded={openGroup === item.label}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      openGroup === item.label && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                <AnimatePresence>
                  {openGroup === item.label && (
                    <motion.div
                      variants={panelVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute left-0 top-full -mt-1 min-w-64 rounded-b-xl rounded-tr-xl bg-casc-navy-500 p-2 shadow-xl ring-1 ring-white/10"
                    >
                      {item.children.map((child) => {
                        const active = isHrefActive(pathname, activeCategoria, child.href);
                        return (
                          <motion.div key={child.href} variants={itemVariants}>
                            <Link
                              href={child.href}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "group/link flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                active
                                  ? "bg-white/15 text-white"
                                  : "text-white/85 hover:bg-white/10 hover:text-white",
                              )}
                            >
                              <ArrowUpRight
                                className={cn(
                                  "h-4 w-4 shrink-0 transition-all duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-white",
                                  active ? "text-white" : "text-white/50",
                                )}
                                aria-hidden="true"
                              />
                              {child.label}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  isHrefActive(pathname, activeCategoria, item.href)
                    ? "page"
                    : undefined
                }
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-casc-navy-500 hover:text-white",
                  isHrefActive(pathname, activeCategoria, item.href) &&
                    "bg-surface text-primary",
                  !isHrefActive(pathname, activeCategoria, item.href) &&
                    "text-ink",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/como-asociarse" variant="secondary">
            Solicitar asociarse
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </ButtonLink>
          <ButtonLink href="/login">Ingresar</ButtonLink>
        </div>

        {/* Mobile: Ingresar visible + toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <ButtonLink href="/login" size="sm">
            Ingresar
          </ButtonLink>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 text-ink transition-colors hover:bg-surface"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-y-auto border-t border-border bg-bg lg:hidden"
            style={{ maxHeight: "calc(100vh - 4rem)" }}
          >
            <nav className="space-y-2 px-4 py-4">
              {mainNav.map((item) =>
                isNavGroup(item) ? (
                  <motion.div
                    key={item.label}
                    variants={itemVariants}
                    className="rounded-xl border border-border bg-surface/40 p-2"
                  >
                    <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      {item.label}
                    </p>
                    {item.children.map((child) => {
                      const active = isHrefActive(pathname, activeCategoria, child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "group/link flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                            active
                              ? "bg-surface text-primary"
                              : "text-ink hover:bg-surface",
                          )}
                        >
                          <ArrowUpRight
                            className={cn(
                              "h-4 w-4 shrink-0 transition-all duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5",
                              active ? "text-primary" : "text-ink-muted",
                            )}
                            aria-hidden="true"
                          />
                          {child.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={
                        isHrefActive(pathname, activeCategoria, item.href)
                    ? "page"
                    : undefined
                      }
                      className={cn(
                        "block rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-surface",
                        isHrefActive(pathname, activeCategoria, item.href)
                          ? "bg-surface text-primary"
                          : "text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ),
              )}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-2 pt-3"
              >
                <ButtonLink
                  href="/como-asociarse"
                  onClick={() => setMobileOpen(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Solicitar asociarse
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </ButtonLink>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
