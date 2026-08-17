"use client";

import { useEffect } from "react";

/**
 * Toggles the `.ativo` class on every `.scroll-*` element as it enters or
 * leaves the viewport.
 *
 * Replaces the original GSAP + ScrollTrigger setup, which did nothing else on
 * this page. The original triggered at `top 80%` / `bottom 10%` and toggled in
 * both directions (onEnter/onLeave/onEnterBack/onLeaveBack), so the reveal
 * replays on scroll-up. `rootMargin` reproduces those thresholds.
 */
export function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      ".scroll-bottom, .scroll-top, .scroll-left, .scroll-right"
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("ativo"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("ativo", entry.isIntersecting);
        });
      },
      { rootMargin: "-10% 0px -20% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
