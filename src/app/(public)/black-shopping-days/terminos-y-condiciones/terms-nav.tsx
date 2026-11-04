"use client";

import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
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
  activeGroupOnly = false,
  onNavigate,
}: {
  groups: TermsNavGroup[];
  active: string;
  /** Lists sections only for the document being read, so the index stays short. */
  activeGroupOnly?: boolean;
  onNavigate?: () => void;
}) {
  const current = (id: string) => (id === active ? "location" : undefined);
  const isOpen = (group: TermsNavGroup) =>
    !activeGroupOnly ||
    group.id === active ||
    group.items.some((item) => item.id === active);

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
      {isOpen(group) && (
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
      )}
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
  const mobile = useRef<HTMLDetailsElement>(null);

  return (
    <>
      <nav className={styles.sidebar} aria-label="Índice">
        <NavLinks groups={groups} active={active} activeGroupOnly />
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
