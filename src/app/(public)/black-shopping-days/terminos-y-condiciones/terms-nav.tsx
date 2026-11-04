"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import styles from "./terms.module.css";

export interface TermsNavGroup {
  id: string;
  label: string;
  items: { id: string; label: string }[];
}

/** Distance from the viewport top at which a heading counts as the current one. */
const ACTIVE_OFFSET = 150;

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function useActiveId(ids: string[]) {
  const getSnapshot = useCallback(() => {
    let active = ids[0];
    for (const id of ids) {
      const heading = document.getElementById(id);
      if (heading && heading.getBoundingClientRect().top <= ACTIVE_OFFSET) {
        active = id;
      }
    }
    return active;
  }, [ids]);
  return useSyncExternalStore(subscribeScroll, getSnapshot, () => ids[0]);
}

function NavLinks({
  groups,
  active,
  onNavigate,
}: {
  groups: TermsNavGroup[];
  active: string;
  onNavigate?: () => void;
}) {
  const current = (id: string) => (id === active ? "location" : undefined);

  return groups.map((group) => (
    <div key={group.id} className={styles.navGroup}>
      <a
        className={styles.navGroupLink}
        href={`#${group.id}`}
        aria-current={current(group.id)}
        onClick={onNavigate}
      >
        {group.label}
      </a>
      <ol className={styles.navList}>
        {group.items.map((item) => (
          <li key={item.id}>
            <a
              className={styles.navLink}
              href={`#${item.id}`}
              aria-current={current(item.id)}
              onClick={onNavigate}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </div>
  ));
}

/** Section index: sticky sidebar on desktop, collapsible block on mobile. */
export function TermsNav({ groups }: { groups: TermsNavGroup[] }) {
  const ids = useMemo(
    () => groups.flatMap((g) => [g.id, ...g.items.map((i) => i.id)]),
    [groups],
  );
  const active = useActiveId(ids);
  const sidebar = useRef<HTMLElement>(null);
  const mobile = useRef<HTMLDetailsElement>(null);

  // Keeps the current entry in view when the sidebar is taller than the screen.
  useEffect(() => {
    const nav = sidebar.current;
    const link = nav?.querySelector<HTMLElement>("[aria-current]");
    if (!nav || !link) return;
    const top = link.offsetTop;
    const bottom = top + link.offsetHeight;
    if (top < nav.scrollTop) nav.scrollTop = top - 12;
    else if (bottom > nav.scrollTop + nav.clientHeight) {
      nav.scrollTop = bottom - nav.clientHeight + 12;
    }
  }, [active]);

  return (
    <>
      <nav ref={sidebar} className={styles.sidebar} aria-label="Índice">
        <NavLinks groups={groups} active={active} />
      </nav>
      <details ref={mobile} className={styles.mobileNav}>
        <summary>Índice</summary>
        <nav aria-label="Índice">
          <NavLinks
            groups={groups}
            active={active}
            onNavigate={() => mobile.current?.removeAttribute("open")}
          />
        </nav>
      </details>
    </>
  );
}
