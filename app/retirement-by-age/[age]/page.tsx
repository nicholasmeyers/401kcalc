import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { RetirementByAgeLanding } from "@/components/retirement-by-age/retirement-by-age-landing";
import {
  MAX_RETIREMENT_PLANNER_AGE,
  MIN_RETIREMENT_PLANNER_AGE,
  getRetirementBenchmarkAges,
  getRetirementBenchmarkByAge,
  getSupportedRetirementPlannerAges,
} from "@/lib/retirement-benchmarks/benchmarks";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

// ---------------------------------------------------------------------------
// Route helpers
// ---------------------------------------------------------------------------

type RetirementByAgePageProps = {
  params: Promise<{ age: string }>;
};

function parseAgeParam(value: string): number | undefined {
  if (!/^\d+$/.test(value)) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= MIN_RETIREMENT_PLANNER_AGE && parsed <= MAX_RETIREMENT_PLANNER_AGE
    ? parsed
    : undefined;
}

// ---------------------------------------------------------------------------
// Static params & metadata
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getSupportedRetirementPlannerAges().map((age) => ({ age: String(age) }));
}

export async function generateMetadata({ params }: RetirementByAgePageProps): Promise<Metadata> {
  const { age: ageParam } = await params;
  const age = parseAgeParam(ageParam);

  if (!age) {
    return { title: "Retirement Benchmark Not Found", robots: { index: false, follow: false } };
  }

  const benchmark = getRetirementBenchmarkByAge(age);
  const title = benchmark
    ? `Retirement Benchmark Planner \u2013 Age ${age} (${benchmark.recommendedMultiple})`
    : `Retirement Benchmark Planner \u2013 Age ${age}`;

  const description = benchmark
    ? benchmark.metaDescription
    : `Plan your retirement savings path starting at age ${age}. Compare your balance to common benchmarks and model catch-up strategies.`;

  const canonicalPath = `/retirement-by-age/${age}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${title} | 401kcalc`,
      description,
      url: `${siteConfig.url}${canonicalPath}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function RetirementByAgePlannerPage({ params }: RetirementByAgePageProps) {
  const { age: ageParam } = await params;
  const age = parseAgeParam(ageParam);

  if (!age) {
    notFound();
  }

  const benchmark = getRetirementBenchmarkByAge(age);
  const allAges = getRetirementBenchmarkAges();
  const otherAges = allAges.filter((a) => a !== age);
  const pageUrl = `${siteConfig.url}/retirement-by-age/${age}`;

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Retirement Benchmark Planner \u2013 Age ${age}`,
    url: pageUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: siteConfig.legalName, url: siteConfig.url },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Retirement By Age", item: `${siteConfig.url}/retirement-by-age` },
      { "@type": "ListItem", position: 3, name: `Age ${age}`, item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <PlannerSection>
        <Container>
          <RetirementByAgeLanding initialAge={age} />
        </Container>
      </PlannerSection>

      {benchmark && benchmark.relatedGuides.length > 0 && (
        <FooterSection>
          <Container>
            <FooterGrid>
              <FooterColumn>
                <FooterHeading>Related guides</FooterHeading>
                <FooterLinkList>
                  {benchmark.relatedGuides.map((g) => (
                    <li key={g.href}>
                      <FooterLink href={g.href}>{g.label}</FooterLink>
                    </li>
                  ))}
                </FooterLinkList>
              </FooterColumn>

              <FooterColumn>
                <FooterHeading>Other age benchmarks</FooterHeading>
                <FooterLinkList>
                  {otherAges.map((a) => (
                    <li key={a}>
                      <FooterLink href={`/retirement-by-age/${a}`}>Age {a} benchmark planner</FooterLink>
                    </li>
                  ))}
                </FooterLinkList>
              </FooterColumn>
            </FooterGrid>
          </Container>
        </FooterSection>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const PlannerSection = styled(Section)`
  padding-top: 24px;
  padding-bottom: 14px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 48px;
  }
`;

const FooterSection = styled(Section)`
  padding-top: 10px;
`;

const FooterGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FooterColumn = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surface};
  padding: 18px;
  display: grid;
  gap: 10px;
`;

const FooterHeading = styled.h3`
  font-size: 1rem;
  font-weight: 640;
`;

const FooterLinkList = styled.ul`
  display: grid;
  gap: 8px;
`;

const FooterLink = styled(Link)`
  font-size: 0.88rem;
  font-weight: 600;
  color: ${theme.colors.accent};
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;
