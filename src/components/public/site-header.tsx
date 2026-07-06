"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, isNavGroup } from "./nav-data";

/**
 * Public site header. Content parity phase: reproduces the original CASC menu
 * structure (grouped dropdowns + direct links) plus the Ingresar / Asociarse
 * CTAs. Styling uses the shared design tokens, not the legacy Flowbite theme.
 */
export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center text-xl font-bold tracking-tight text-ink">
          <span className="text-accent">[</span>
          CASC
          <span className="text-accent">]</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) =>
            isNavGroup(item) ? (
              <div key={item.label} className="group relative">
                <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface">
                  {item.label}
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </button>
                <div className="invisible absolute left-0 top-full min-w-52 rounded-md border border-border bg-bg py-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-ink transition-colors hover:bg-surface"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/como-asociarse"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface"
          >
            Solicitar asociarse
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Ingresar
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md p-2 text-ink transition-colors hover:bg-surface lg:hidden"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-y-auto border-t border-border bg-bg lg:hidden",
          mobileOpen ? "max-h-[calc(100vh-4rem)]" : "hidden",
        )}
      >
        <nav className="space-y-1 px-4 py-4">
          {mainNav.map((item) =>
            isNavGroup(item) ? (
              <div key={item.label} className="py-1">
                <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {item.label}
                </p>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-4 py-2 text-sm text-ink transition-colors hover:bg-surface"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-2 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface"
              >
                {item.label}
              </Link>
            ),
          )}
          <div className="flex flex-col gap-2 pt-3">
            <Link
              href="/como-asociarse"
              onClick={() => setMobileOpen(false)}
              className="rounded-md border border-border px-4 py-2 text-center text-sm font-medium text-ink transition-colors hover:bg-surface"
            >
              Solicitar asociarse
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Ingresar
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
