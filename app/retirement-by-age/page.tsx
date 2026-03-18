import type { Metadata } from "next";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { RetirementByAgeLanding } from "@/components/retirement-by-age/retirement-by-age-landing";
import {
  RetirementByAgeSupportingContent,
  retirementByAgeFaqs,
} from "@/components/retirement-by-age/retirement-supporting-content";
import { getAllRetirementBenchmarks } from "@/lib/retirement-benchmarks/benchmarks";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

const benchmarks = getAllRetirementBenchmarks();

export const metadata: Metadata = {
  title: "How much should you have in your 401k?",
  description:
    "Compare your retirement savings to common age-based checkpoints, model catch-up paths, and plan your next move with the interactive benchmark planner.",
  alternates: {
    canonical: "/retirement-by-age",
  },
  openGraph: {
    title: "How much should you have in your 401k? | 401kcalc",
    description:
      "Interactive retirement benchmark planner. Pick your age and instantly see how your savings compare to common checkpoints.",
    url: `${siteConfig.url}/retirement-by-age`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How much should you have in your 401k?",
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
    name: "How much should you have in your 401k?",
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: retirementByAgeFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <PlannerSection>
        <Container>
          <RetirementByAgeLanding />
        </Container>
      </PlannerSection>

      <SupportingSection>
        <Container>
          <RetirementByAgeSupportingContent />
        </Container>
      </SupportingSection>
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

const SupportingSection = styled(Section)`
  padding-top: 0;
  padding-bottom: 88px;
`;
