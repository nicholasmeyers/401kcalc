import type { Metadata } from "next";
import Link from "next/link";
import styled from "styled-components";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { SurfaceCard } from "@/components/ui/primitives";
import { getAllRetirementBenchmarks } from "@/lib/retirement-benchmarks/benchmarks";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

const benchmarks = getAllRetirementBenchmarks();

export const metadata: Metadata = {
  title: "Retirement Savings Benchmarks by Age",
  description:
    "Review common retirement savings milestones by age, compare benchmark ranges, and run personalized projections in the 401(k) calculator.",
  alternates: {
    canonical: "/retirement-by-age",
  },
  openGraph: {
    title: "Retirement Savings Benchmarks by Age | 401kcalc",
    description:
      "Explore age-based retirement savings checkpoints and connect each benchmark directly to a personalized calculator projection.",
    url: `${siteConfig.url}/retirement-by-age`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Retirement Savings Benchmarks by Age",
    description: "Compare benchmark milestones from age 30 through age 60 and run your own retirement projection.",
  },
};

export default function RetirementByAgeIndexPage() {
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Retirement Savings Benchmarks by Age",
    url: `${siteConfig.url}/retirement-by-age`,
    description:
      "Review common retirement savings milestones by age, compare benchmark ranges, and run personalized projections in the 401(k) calculator.",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: benchmarks.map((benchmark, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteConfig.url}/retirement-by-age/${benchmark.age}`,
        name: `Retirement benchmark by age ${benchmark.age}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />

      <HeroSection>
        <Container>
          <HeroCard>
            <PageIntro
              eyebrow="Retirement by age"
              title="Retirement savings benchmarks by age"
              description="Use common age-based milestones as a planning reference, then test your own numbers in the calculator."
            />
            <HeroActions>
              <ButtonLink href="/401k-calculator">Open 401(k) Calculator</ButtonLink>
              <ButtonLink href="/guides" variant="secondary">
                Browse Guides
              </ButtonLink>
            </HeroActions>
          </HeroCard>
        </Container>
      </HeroSection>

      <BenchmarkSection>
        <Container>
          <BenchmarkGrid>
            {benchmarks.map((benchmark) => (
              <BenchmarkCard key={benchmark.age} href={`/retirement-by-age/${benchmark.age}`}>
                <AgeLabel>Age {benchmark.age}</AgeLabel>
                <BenchmarkTitle>
                  Retirement benchmark: <strong>{benchmark.recommendedMultiple}</strong>
                </BenchmarkTitle>
                <BenchmarkSummary>{benchmark.benchmarkSummary}</BenchmarkSummary>
                <BenchmarkLink>Read age-{benchmark.age} benchmark</BenchmarkLink>
              </BenchmarkCard>
            ))}
          </BenchmarkGrid>
        </Container>
      </BenchmarkSection>

      <CtaSection>
        <Container>
          <CtaCard>
            <CtaTitle>Ready to test your own numbers?</CtaTitle>
            <CtaText>
              Benchmarks are directional. Your retirement plan should be based on your salary, contribution rate, employer match, return assumptions, and
              timeline.
            </CtaText>
            <ButtonLink href="/401k-calculator">Run your own retirement projection {"\u2192"}</ButtonLink>
          </CtaCard>
        </Container>
      </CtaSection>
    </>
  );
}

const HeroSection = styled(Section)`
  padding-top: 52px;
  padding-bottom: 26px;
`;

const HeroCard = styled(SurfaceCard)`
  padding: 34px;
  display: grid;
  gap: 22px;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 58%),
    ${theme.colors.surface};

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 42px;
  }
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const BenchmarkSection = styled(Section)`
  padding-top: 14px;
`;

const BenchmarkGrid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const BenchmarkCard = styled(Link)`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  background: ${theme.colors.surface};
  padding: 22px;
  display: grid;
  gap: 10px;
  transition: border-color 120ms ease, transform 120ms ease;

  &:hover {
    border-color: ${theme.colors.borderStrong};
    transform: translateY(-1px);
  }
`;

const AgeLabel = styled.p`
  width: fit-content;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${theme.colors.mutedText};
`;

const BenchmarkTitle = styled.h2`
  font-size: clamp(1.14rem, 2.3vw, 1.34rem);
  font-weight: 640;
  line-height: 1.3;
`;

const BenchmarkSummary = styled.p`
  max-width: 54ch;
  font-size: 0.95rem;
  line-height: 1.66;
  color: ${theme.colors.textSecondary};
`;

const BenchmarkLink = styled.p`
  margin-top: 4px;
  font-size: 0.86rem;
  font-weight: 700;
  color: ${theme.colors.accent};
`;

const CtaSection = styled(Section)`
  padding-top: 14px;
`;

const CtaCard = styled(SurfaceCard)`
  max-width: 760px;
  padding: 28px;
  border-radius: ${theme.radii.md};
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 58%),
    ${theme.colors.surfaceMuted};
  display: grid;
  gap: 12px;
`;

const CtaTitle = styled.h2`
  font-size: clamp(1.3rem, 2.8vw, 1.6rem);
  font-weight: 640;
`;

const CtaText = styled.p`
  max-width: 62ch;
  font-size: 0.98rem;
  line-height: 1.72;
`;
