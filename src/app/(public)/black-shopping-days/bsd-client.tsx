"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import styles from "./bsd.module.css";

/** Event window, in Argentina time. */
const EVENT_START = new Date("2026-11-27T00:00:00-03:00").getTime();
const EVENT_END = new Date("2026-11-30T00:00:00-03:00").getTime();

/** Ticks every 30s. Server snapshot is null so the countdown renders client-side only. */
function subscribeClock(onTick: () => void) {
  const id = setInterval(onTick, 30_000);
  return () => clearInterval(id);
}
const getNowBucket = () => Math.floor(Date.now() / 30_000) * 30_000;
const getServerNow = () => null;

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown() {
  const now = useSyncExternalStore(subscribeClock, getNowBucket, getServerNow);

  if (now === null) {
    return <div className={styles.count} aria-hidden="true" />;
  }

  if (now >= EVENT_START) {
    return (
      <div className={styles.count} aria-live="polite">
        <span className={styles.countMsg}>
          {now < EVENT_END
            ? "Está pasando ahora en los Shoppings"
            : "¡Gracias por ponerte en movimiento!"}
        </span>
      </div>
    );
  }

  let s = Math.floor((EVENT_START - now) / 1000);
  const d = Math.floor(s / 86400);
  s %= 86400;
  const h = Math.floor(s / 3600);
  s %= 3600;
  const m = Math.floor(s / 60);
  const units = [
    { n: pad(d), l: d === 1 ? "día" : "días" },
    { n: pad(h), l: "horas" },
    { n: pad(m), l: "min" },
  ];

  return (
    <div className={styles.count} aria-live="polite">
      {units.map((u) => (
        <div key={u.l} className={styles.countUnit}>
          <div className={styles.countNum}>{u.n}</div>
          <div className={styles.countLabel}>{u.l}</div>
        </div>
      ))}
    </div>
  );
}

const ROT_WORDS = [
  "recorrer",
  "descubrir",
  "probar",
  "elegir",
  "compartir",
  "disfrutar",
];
// The last slot repeats the first so the loop wraps without jumping backwards.
const SLOTS = [...ROT_WORDS, ROT_WORDS[0]];

/** Vertical word slot that cycles through ROT_WORDS. */
export function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [snap, setSnap] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let current = 0;
    let snapTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setInterval(() => {
      current += 1;
      setSnap(false);
      setIndex(current);
      if (current === ROT_WORDS.length) {
        // Once the copy of the first word is shown, jump back to slot 0 unanimated.
        snapTimer = setTimeout(() => {
          current = 0;
          setSnap(true);
          setIndex(0);
        }, 650);
      }
    }, 2200);
    return () => {
      clearInterval(timer);
      clearTimeout(snapTimer);
    };
  }, []);

  return (
    <span className={styles.slot}>
      <span
        className={styles.slotIn}
        style={{
          transform: `translateY(-${index * 1.2}em)`,
          transition: snap ? "none" : undefined,
        }}
      >
        {SLOTS.map((w, i) => (
          <span key={i} aria-hidden={i !== index}>
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
