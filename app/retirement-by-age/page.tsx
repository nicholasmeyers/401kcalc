import type { Metadata } from "next";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { RetirementByAgeLanding } from "@/components/retirement-by-age/retirement-by-age-landing";
import { getAllRetirementBenchmarks } from "@/lib/retirement-benchmarks/benchmarks";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

const benchmarks = getAllRetirementBenchmarks();

export const metadata: Metadata = {
  title: "Retirement Benchmark Planner by Age",
  description:
    "Compare your retirement savings to common age-based checkpoints, model catch-up paths, and plan your next move with the interactive benchmark planner.",
  alternates: {
    canonical: "/retirement-by-age",
  },
  openGraph: {
    title: "Retirement Benchmark Planner by Age | 401kcalc",
    description:
      "Interactive retirement benchmark planner. Pick your age and instantly see how your savings compare to common checkpoints.",
    url: `${siteConfig.url}/retirement-by-age`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Retirement Benchmark Planner by Age",
    description: "Compare benchmarks from age 25 through 70 and model your catch-up path.",
  },
};

export default function RetirementByAgeIndexPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Retirement by Age", item: `${siteConfig.url}/retirement-by-age` },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Retirement Benchmark Planner by Age",
    url: `${siteConfig.url}/retirement-by-age`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: benchmarks.map((benchmark, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteConfig.url}/retirement-by-age/${benchmark.age}`,
        name: `Age ${benchmark.age} retirement benchmark planner`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <PlannerSection>
        <Container>
          <RetirementByAgeLanding />
        </Container>
      </PlannerSection>
    </>
  );
}

const PlannerSection = styled(Section)`
  padding-top: 24px;
  padding-bottom: 14px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 48px;
  }
`;
