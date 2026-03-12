"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type AnimatedNumberProps = {
  value: number;
  formatValue: (value: number) => string;
  durationMs?: number;
};

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

export function AnimatedNumber({ value, formatValue, durationMs = 260 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const lastTargetRef = useRef(value);
  const frameRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    const startValue = lastTargetRef.current;
    const canAnimate = !prefersReducedMotion && Number.isFinite(startValue) && Number.isFinite(value) && startValue !== value;

    if (!canAnimate) {
      setDisplayValue(value);
      lastTargetRef.current = value;
      return;
    }

    const startedAt = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(progress);
      const nextValue = startValue + (value - startValue) * eased;

      setDisplayValue(nextValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      lastTargetRef.current = value;
      frameRef.current = null;
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [durationMs, prefersReducedMotion, value]);

  return <>{formatValue(displayValue)}</>;
}
