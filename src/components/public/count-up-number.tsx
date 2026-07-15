"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

const formatter = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 0,
});

/**
 * Spring-based count-up (React Bits feel) with an accessibility guard:
 * when the user prefers reduced motion, the final value is rendered
 * immediately with no animation.
 */
export function CountUpNumber({
  value,
  from = 0,
  duration = 1.1,
}: {
  value: number;
  from?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const motionValue = useMotionValue(from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, { damping, stiffness });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatter.format(
        prefersReducedMotion ? value : from,
      );
    }
  }, [from, value, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !isInView) {
      return;
    }
    motionValue.set(value);
  }, [isInView, prefersReducedMotion, motionValue, value]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatter.format(latest);
      }
    });
    return () => unsubscribe();
  }, [springValue, prefersReducedMotion]);

  return <span ref={ref} />;
}
