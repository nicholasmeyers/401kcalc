"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { trackEvent } from "@/lib/analytics";

const guidesPrefix = "/guides/";
const retirementByAgePrefix = "/retirement-by-age/";
const contributionCalculatorPath = "/401k-contribution-calculator";

export function RouteAnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastTrackedPathRef.current === pathname) {
      return;
    }

    lastTrackedPathRef.current = pathname;

    if (pathname === "/401k-calculator") {
      trackEvent("calculator_view", { calculator_type: "full_projection" });
      return;
    }

    if (pathname === contributionCalculatorPath) {
      trackEvent("calculator_view", { calculator_type: "contribution_increase" });
      return;
    }

    if (pathname === "/guides") {
      trackEvent("guide_view", { page_type: "index" });
      return;
    }

    if (pathname.startsWith(guidesPrefix)) {
      const slug = pathname.slice(guidesPrefix.length);
      trackEvent("guide_view", { page_type: "detail", guide_slug: slug || "unknown" });
      return;
    }

    if (pathname === "/retirement-by-age") {
      trackEvent("retirement_by_age_view", { page_type: "index" });
      return;
    }

    if (pathname.startsWith(retirementByAgePrefix)) {
      const age = pathname.slice(retirementByAgePrefix.length);
      trackEvent("retirement_by_age_view", { page_type: "detail", age: age || "unknown" });
      return;
    }

    if (pathname === "/methodology") {
      trackEvent("methodology_view");
    }
  }, [pathname]);

  return null;
}
