"use client";

import { useEffect } from "react";

/**
 * Rotates the browser tab title between the page's real title and a branded
 * greeting on a fixed interval. Mounted once at the root so it covers every
 * route.
 *
 * The "real" title is read from `document.title` and re-read whenever Next
 * updates it on navigation (watched via a MutationObserver on <title>), so the
 * rotator always alternates with the current section's title rather than a
 * stale one.
 */
const GREETING = "¡Bienvenido a CASC!";
const INTERVAL_MS = 3000;

export function TitleRotator() {
  useEffect(() => {
    // The page's own title. Updated when navigation changes <title>.
    let realTitle = document.title;
    let showingGreeting = false;

    const titleEl = document.querySelector("title");

    // When Next swaps the title on navigation, capture it as the new "real"
    // title — unless the change is our own greeting write.
    const observer = titleEl
      ? new MutationObserver(() => {
          if (!showingGreeting && document.title !== GREETING) {
            realTitle = document.title;
          }
        })
      : null;
    observer?.observe(titleEl!, { childList: true });

    const interval = setInterval(() => {
      showingGreeting = !showingGreeting;
      document.title = showingGreeting ? GREETING : realTitle;
    }, INTERVAL_MS);

    return () => {
      clearInterval(interval);
      observer?.disconnect();
      // Leave the real title in place on unmount.
      document.title = realTitle;
    };
  }, []);

  return null;
}
