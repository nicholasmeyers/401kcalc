"use client";

import { useEffect, useState } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQueryList = window.matchMedia(motionQuery);
    const updatePreference = () => setPrefersReducedMotion(mediaQueryList.matches);

    updatePreference();
    mediaQueryList.addEventListener("change", updatePreference);

    return () => {
      mediaQueryList.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}
