import type { Metadata } from "next";
import Link from "next/link";
import styled from "styled-components";

import { CalculatorExperience } from "@/components/calculator/calculator-experience";
import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

export const metadata: Metadata = {
  title: "401(k) Retirement Calculator",
  description:
    "Estimate your 401(k) balance, income potential, and retirement timeline with transparent assumptions and dual projection scenarios.",
  alternates: {
    canonical: "/401k-calculator",
  },
  openGraph: {
    title: "401(k) Retirement Calculator | 401kcalc",
    description:
      "Run a transparent 401(k) projection, compare retirement outcomes, and adjust assumptions in real time.",
    url: `${siteConfig.url}/401k-calculator`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "401(k) Retirement Calculator",
    description:
      "Project your 401(k) balance, retirement income, and timeline with adjustable assumptions.",
  },
};

export default function CalculatorPage() {
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "401(k) Retirement Calculator",
    operatingSystem: "Web",
    applicationCategory: "FinanceApplication",
    url: `${siteConfig.url}/401k-calculator`,
    description:
      "Interactive web calculator for 401(k) retirement projections with editable assumptions and scenario comparisons.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
    featureList: [
      "Dual retirement projection scenarios",
      "Inflation-adjusted balance view",
      "Interactive retirement age marker",
      "Target retirement spending scenario",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "401(k) Calculator",
        item: `${siteConfig.url}/401k-calculator`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <IntroSection>
        <Container>
          <PageIntro
            eyebrow="Calculator"
            title="401(k) Calculator"
            description="Model your retirement path with clear assumptions, real-time updates, and projection outputs designed for fast decision-making."
          >
            <MethodologyLink href="/methodology">How we calculate projections {"\u2192"}</MethodologyLink>
          </PageIntro>
        </Container>
      </IntroSection>

      <CalculatorSection>
        <Container>
          <CalculatorExperience />
        </Container>
      </CalculatorSection>
    </>
  );
}

const IntroSection = styled(Section)`
  padding-top: 52px;
  padding-bottom: 30px;
`;

const MethodologyLink = styled(Link)`
  margin-top: 6px;
  width: fit-content;
  font-size: 0.86rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;

const CalculatorSection = styled(Section)`
  padding-top: 8px;
  padding-bottom: 84px;
`;
