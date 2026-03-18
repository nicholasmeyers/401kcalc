import type { MetadataRoute } from "next";

import { getAllGuides, getGuideDateObject, getGuideModifiedDate } from "@/lib/guides/guides";
import { getSupportedRetirementPlannerAges } from "@/lib/retirement-benchmarks/benchmarks";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/401k-calculator", changeFrequency: "weekly" as const, priority: 0.95 },
    { path: "/401k-contribution-calculator", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/guides", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/retirement-by-age", changeFrequency: "weekly" as const, priority: 0.88 },
    { path: "/methodology", changeFrequency: "monthly" as const, priority: 0.62 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.58 },
  ];
  const guides = getAllGuides();
  const guideRoutes = guides.map((guide) => ({
    path: `/guides/${guide.slug}`,
    lastModified: getGuideDateObject(getGuideModifiedDate(guide)) ?? new Date(),
  }));
  const benchmarkRoutes = getSupportedRetirementPlannerAges().map((age) => ({
    path: `/retirement-by-age/${age}`,
    lastModified: new Date(),
  }));

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const guideEntries = guideRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const benchmarkEntries = benchmarkRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.78,
  }));

  return [...staticEntries, ...guideEntries, ...benchmarkEntries];
}
