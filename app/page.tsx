import type { Metadata } from "next";
import Link from "next/link";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionSubtitle, SectionTitle, SurfaceCard } from "@/components/ui/primitives";
import { formatGuideDate, getAllGuides, getGuideDateObject, getGuideReviewedDate } from "@/lib/guides/guides";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

const calculatorUtilityPoints = [
  {
    title: "Projected retirement balance",
    body: "Estimate how your current balance, contributions, and return assumptions may compound through retirement age.",
  },
  {
    title: "Employer match impact",
    body: "See how your plan match changes long-term outcomes and where contribution increases create the biggest payoff.",
  },
  {
    title: "Inflation-adjusted outcomes",
    body: "Compare nominal growth with inflation-adjusted results so planning decisions stay anchored to real purchasing power.",
  },
  {
    title: "Estimated retirement income",
    body: "Translate balance projections into an annual income estimate to evaluate readiness instead of only chasing a balance target.",
  },
];

const benchmarkUtilityPoints = [
  {
    title: "Age-based savings checkpoints",
    body: "See how your current 401(k) balance compares to common savings benchmarks for your age group.",
  },
  {
    title: "Projected savings path",
    body: "Model how your balance may grow from today through age 70 based on your contribution rate and return assumptions.",
  },
  {
    title: "Catch-up scenario modeling",
    body: "Test how increasing your contribution rate each year could close the gap between your balance and the benchmark.",
  },
  {
    title: "Milestone comparison",
    body: "See projected balances at future checkpoints and whether your current path keeps pace with age-based targets.",
  },
];

const heroFeatureChecks = [
  "Standard assumptions",
  "Your & employer contributions",
  "401(k) + Roth balances",
  "Inflation + IRS age limits",
  "Future windfalls",
];

const trustPoints = [
  {
    title: "Transparent methodology",
    body: "Formulas, assumptions, and model limitations are documented in plain language.",
    link: { label: "Read methodology", href: "/methodology" },
  },
  {
    title: "Educational by design",
    body: "Outputs are planning estimates to support decisions, not personalized financial advice.",
    link: { label: "About 401kcalc", href: "/about" },
  },
  {
    title: "Reviewed guide library",
    body: "Guides are built to explain practical retirement tradeoffs and connect directly to scenario modeling.",
    link: { label: "Explore guides", href: "/guides" },
  },
  {
    title: "Clear assumptions and limits",
    body: "Every scenario is inspectable so you can stress-test outcomes instead of relying on a black-box score.",
    link: { label: "Open calculator", href: "/401k-calculator" },
  },
];

const featuredGuides = [...getAllGuides()]
  .sort((firstGuide, secondGuide) => {
    const firstReviewed = getGuideDateObject(getGuideReviewedDate(firstGuide))?.getTime() ?? 0;
    const secondReviewed = getGuideDateObject(getGuideReviewedDate(secondGuide))?.getTime() ?? 0;
    return secondReviewed - firstReviewed;
  })
  .slice(0, 3);

export const metadata: Metadata = {
  title: "401(k) Calculator for Retirement Projections",
  description:
    "Model your 401(k) growth, compare retirement scenarios, and make clearer long-term planning decisions with transparent assumptions.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "401(k) Calculator for Retirement Projections | 401kcalc",
    description:
      "Run transparent 401(k) projections, compare outcomes, and explore practical retirement planning guides.",
    url: siteConfig.url,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "401(k) Calculator for Retirement Projections",
    description:
      "Project your 401(k), compare assumptions, and use practical retirement planning guides.",
  },
};

export default function HomePage() {
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
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "401(k) Calculator for Retirement Projections",
    description:
      "Model your 401(k) growth, compare retirement scenarios, and make clearer long-term planning decisions with transparent assumptions.",
    url: siteConfig.url,
    isPartOf: { "@type": "WebSite", url: siteConfig.url, name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.url,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/images/logo.png` },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <HeroSection>
        <Container>
          <HeroCard>
            <HeroContent>
              <HeroText>
                <PageIntro
                  eyebrow="401(k) Planning"
                  title="See how today’s 401(k) choices can shape your retirement income."
                  description="401kcalc helps you model long-term outcomes with assumptions you can inspect, adjust, and compare in minutes."
                >
                  <HeroActions>
                    <ButtonLink href="/401k-calculator">Open 401(k) Calculator</ButtonLink>
                    <ButtonLink href="/retirement-by-age" variant="secondary">
                      Retirement Age Benchmarks
                    </ButtonLink>
                    <ButtonLink href="/guides" variant="secondary">
                      Browse Guides
                    </ButtonLink>
                  </HeroActions>
                </PageIntro>
              </HeroText>

              <HeroVisualCard>
                <HeroVisualBody>
                  <CalculatorSnapshotPrimary>
                    <CalculatorSnapshotTop>
                      <CalculatorSnapshotLabel>Projected annual spend available</CalculatorSnapshotLabel>
                      <CalculatorSnapshotStatus>On track</CalculatorSnapshotStatus>
                    </CalculatorSnapshotTop>
                    <CalculatorSnapshotValue>$137,501</CalculatorSnapshotValue>
                    <CalculatorSnapshotMeta>
                      You will meet your goal of $85,000 a year, with about $52,500 above your target.
                    </CalculatorSnapshotMeta>
                  </CalculatorSnapshotPrimary>

                  <HeroFeatureList aria-label="Calculator features">
                    {heroFeatureChecks.map((feature) => (
                      <HeroFeatureItem key={feature}>
                        <HeroFeatureCheck aria-hidden="true" />
                        <span>{feature}</span>
                      </HeroFeatureItem>
                    ))}
                  </HeroFeatureList>
                </HeroVisualBody>
              </HeroVisualCard>
            </HeroContent>
          </HeroCard>
        </Container>
      </HeroSection>

      <UtilitySection>
        <Container>
          <SectionTitle>What the calculator helps you understand</SectionTitle>
          <SectionSubtitle>
            A focused planning view for key retirement questions, without dashboard noise.
          </SectionSubtitle>
          <UtilityGrid>
            {calculatorUtilityPoints.map((point) => (
              <UtilityCard key={point.title}>
                <UtilityTitle>{point.title}</UtilityTitle>
                <UtilityBody>{point.body}</UtilityBody>
              </UtilityCard>
            ))}
          </UtilityGrid>
          <UtilityLink href="/401k-calculator">Open 401(k) Calculator &rarr;</UtilityLink>
        </Container>
      </UtilitySection>

      <BenchmarkUtilitySection>
        <Container>
          <BenchmarkUtilityLayout>
            <BenchmarkUtilityIntro>
              <SectionTitle>What the retirement by age simulator helps you understand</SectionTitle>
              <SectionSubtitle>
                Age-based checkpoints and projection tools to see whether your savings are keeping pace.
              </SectionSubtitle>
            </BenchmarkUtilityIntro>

            <BenchmarkUtilityText>
              <BenchmarkUtilityStack>
                {benchmarkUtilityPoints.map((point) => (
                  <UtilityCard key={point.title}>
                    <UtilityTitle>{point.title}</UtilityTitle>
                    <UtilityBody>{point.body}</UtilityBody>
                  </UtilityCard>
                ))}
              </BenchmarkUtilityStack>
              <UtilityLink href="/retirement-by-age">Open Retirement Age Benchmarks &rarr;</UtilityLink>
            </BenchmarkUtilityText>

            <BenchmarkSnapshotCard>
              <HeroVisualTop>
                <HeroPill>Retirement by age snapshot</HeroPill>
              </HeroVisualTop>

              <HeroVisualBody>
                <HeroVisualTitle>Compare your current path with a stronger one.</HeroVisualTitle>
                <HeroVisualSubtitle>
                  A simplified planning view for benchmark gaps and contribution changes.
                </HeroVisualSubtitle>

                <HeroChartCard>
                  <HeroLegendRow>
                    <HeroLegendItem>
                      <HeroLegendSwatch $kind="benchmark" />
                      <span>Benchmark</span>
                    </HeroLegendItem>
                    <HeroLegendItem>
                      <HeroLegendSwatch $kind="current" />
                      <span>Current path</span>
                    </HeroLegendItem>
                    <HeroLegendItem>
                      <HeroLegendSwatch $kind="improved" />
                      <span>Improved path</span>
                    </HeroLegendItem>
                  </HeroLegendRow>

                  <HeroChartFrame aria-hidden="true">
                    <HeroChartSvg viewBox="0 0 320 190" preserveAspectRatio="none">
                      <line x1="18" y1="26" x2="302" y2="26" stroke={theme.colors.chartGrid} strokeDasharray="4 6" />
                      <line x1="18" y1="78" x2="302" y2="78" stroke={theme.colors.chartGrid} strokeDasharray="4 6" />
                      <line x1="18" y1="130" x2="302" y2="130" stroke={theme.colors.chartGrid} strokeDasharray="4 6" />
                      <line x1="18" y1="174" x2="302" y2="174" stroke={theme.colors.chartGrid} />
                      <line x1="18" y1="18" x2="18" y2="174" stroke={theme.colors.chartGrid} />

                      <path
                        d="M18 128 C60 118, 92 106, 134 96 S214 78, 302 62"
                        stroke={theme.colors.chartBenchmark}
                        strokeWidth="3"
                        strokeDasharray="8 7"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M18 144 C58 140, 96 132, 134 124 S216 112, 302 102"
                        stroke={theme.colors.chartMain}
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M18 144 C56 136, 92 124, 134 110 S220 86, 302 72"
                        stroke={theme.colors.chartImproved}
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </HeroChartSvg>

                    <HeroAxisLabel style={{ left: 16, bottom: 8 }}>Today</HeroAxisLabel>
                    <HeroAxisLabel style={{ left: "42%", bottom: 8 }}>Age 50</HeroAxisLabel>
                    <HeroAxisLabel style={{ right: 14, bottom: 8 }}>Age 60</HeroAxisLabel>
                  </HeroChartFrame>
                </HeroChartCard>

                <HeroCalloutRow>
                  <HeroCallout>
                    Benchmark gap closes faster when contribution increases are modeled year by year.
                  </HeroCallout>
                  <HeroMetricPill>Current 78%</HeroMetricPill>
                  <HeroMetricPill $improved>Improved 96%</HeroMetricPill>
                </HeroCalloutRow>
              </HeroVisualBody>
            </BenchmarkSnapshotCard>
          </BenchmarkUtilityLayout>
        </Container>
      </BenchmarkUtilitySection>

      <TrustSection>
        <Container>
          <SectionTitle>Built for trust and transparency</SectionTitle>
          <SectionSubtitle>
            Every estimate should be explainable. The calculator and guides are designed to make assumptions visible and decisions clearer.
          </SectionSubtitle>
          <TrustGrid>
            {trustPoints.map((point) => (
              <TrustItem key={point.title}>
                <TrustTitle>{point.title}</TrustTitle>
                <TrustBody>{point.body}</TrustBody>
                <TrustLink href={point.link.href}>{point.link.label}</TrustLink>
              </TrustItem>
            ))}
          </TrustGrid>
        </Container>
      </TrustSection>

      <GuidesSection>
        <Container>
          <SectionTitle>Featured guides</SectionTitle>
          <SectionSubtitle>
            Concise, reviewed explainers to support contribution strategy, tax decisions, and employer match optimization.
          </SectionSubtitle>
          <GuideGrid>
            {featuredGuides.map((guide) => {
              const reviewedDate = formatGuideDate(getGuideReviewedDate(guide));

              return (
                <GuideCard key={guide.slug} href={`/guides/${guide.slug}`}>
                  <GuideMeta>
                    {guide.category ? <GuideCategory>{guide.category}</GuideCategory> : null}
                    <GuideDate>{reviewedDate ? `Reviewed ${reviewedDate}` : "Reviewed guide"}</GuideDate>
                  </GuideMeta>
                  <GuideTitle>{guide.title}</GuideTitle>
                  <GuideSummary>{guide.excerpt}</GuideSummary>
                  <GuideFooter>
                    <GuideRead>{guide.readingTime ?? "Guide"}</GuideRead>
                    <GuideReadLink>Read guide</GuideReadLink>
                  </GuideFooter>
                </GuideCard>
              );
            })}
          </GuideGrid>
          <GuidesActions>
            <ButtonLink href="/guides" variant="secondary">
              View All Guides
            </ButtonLink>
          </GuidesActions>
        </Container>
      </GuidesSection>

      <ClosingSection>
        <Container>
          <ClosingCard>
            <ClosingTitle>Ready to run your 401(k) scenario?</ClosingTitle>
            <ClosingBody>
              Start with your current numbers, then adjust contribution rate, retirement age, and assumptions to compare outcomes clearly.
            </ClosingBody>
            <ClosingActions>
              <ButtonLink href="/401k-calculator">Go to 401(k) Calculator</ButtonLink>
              <ButtonLink href="/guides" variant="secondary">
                Read Planning Guides
              </ButtonLink>
            </ClosingActions>
          </ClosingCard>
        </Container>
      </ClosingSection>
    </>
  );
}

const HeroSection = styled(Section)`
  padding-top: 24px;
  padding-bottom: 16px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 52px;
    padding-bottom: 24px;
  }
`;

const HeroCard = styled(SurfaceCard)`
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.1), transparent 62%),
    ${theme.colors.surface};

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 34px;
  }
`;

const HeroContent = styled.div`
  min-width: 0;
  display: grid;
  gap: 24px;

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 1.1fr) minmax(320px, 420px);
    align-items: start;
    gap: 30px;
  }
`;

const HeroText = styled.div`
  min-width: 0;
`;

const HeroActions = styled.div`
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const HeroVisualCard = styled(SurfaceCard)`
  display: none;
  padding: 16px;
  gap: 14px;
  min-width: 0;
  background:
    radial-gradient(circle at top right, rgba(22, 163, 74, 0.06), transparent 45%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(250, 252, 255, 0.92)),
    ${theme.colors.surface};
  border-color: ${theme.colors.elevatedBorder};

  @media (min-width: ${theme.breakpoints.lg}) {
    display: grid;
    padding: 20px;
  }
`;

const HeroVisualTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HeroPill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding-inline: 10px;
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.successSurface};
  border: 1px solid ${theme.colors.successBorder};
  color: ${theme.colors.successText};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const HeroVisualBody = styled.div`
  display: grid;
  gap: 10px;
`;

const HeroVisualTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.1rem, 2vw, 1.32rem);
  font-weight: 640;
  line-height: 1.28;
`;

const HeroVisualSubtitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.62;
  color: ${theme.colors.mutedTextStrong};
`;

const HeroChartCard = styled.div`
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: rgba(255, 255, 255, 0.88);
`;

const HeroLegendRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
`;

const HeroLegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.76rem;
  color: ${theme.colors.mutedTextStrong};
`;

const HeroLegendSwatch = styled.span<{ $kind: "benchmark" | "current" | "improved" | "inflation" }>`
  width: ${({ $kind }) => ($kind === "benchmark" ? "18px" : "16px")};
  height: 3px;
  border-radius: 999px;
  background: ${({ $kind }) =>
    $kind === "benchmark"
      ? `repeating-linear-gradient(to right, ${theme.colors.chartBenchmark} 0 8px, transparent 8px 13px)`
      : $kind === "current"
        ? theme.colors.chartMain
        : $kind === "improved"
          ? theme.colors.chartImproved
          : theme.colors.chartInflation};
`;

const HeroChartFrame = styled.div`
  position: relative;
  min-height: 154px;
  border-radius: ${theme.radii.md};
  background:
    linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(255, 255, 255, 0.96)),
    ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
`;

const HeroChartSvg = styled.svg`
  display: block;
  width: 100%;
  height: 154px;
`;

const HeroAxisLabel = styled.span`
  position: absolute;
  font-size: 0.72rem;
  color: ${theme.colors.mutedText};
`;

const HeroCalloutRow = styled.div`
  display: grid;
  gap: 10px;

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr auto auto;
    align-items: center;
  }
`;

const HeroCallout = styled.p`
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.56;
  color: ${theme.colors.mutedTextStrong};
`;

const HeroMetricPill = styled.span<{ $improved?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding-inline: 12px;
  border-radius: ${theme.radii.pill};
  border: 1px solid ${({ $improved }) => ($improved ? theme.colors.successBorder : theme.colors.border)};
  background: ${({ $improved }) => ($improved ? theme.colors.successSurface : "rgba(255, 255, 255, 0.9)")};
  color: ${({ $improved }) => ($improved ? theme.colors.successText : theme.colors.text)};
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
`;

const CalculatorSnapshotPrimary = styled.div`
  padding: 14px;
  border: 1px solid ${theme.colors.successBorder};
  border-radius: ${theme.radii.md};
  background:
    radial-gradient(circle at top right, rgba(22, 163, 74, 0.06), transparent 55%),
    ${theme.colors.successSurface};
  display: grid;
  gap: 8px;
`;

const CalculatorSnapshotTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

const CalculatorSnapshotLabel = styled.span`
  font-size: 0.76rem;
  font-weight: 700;
  color: ${theme.colors.mutedTextStrong};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const CalculatorSnapshotStatus = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding-inline: 10px;
  border-radius: ${theme.radii.pill};
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid ${theme.colors.successBorder};
  color: ${theme.colors.successText};
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const CalculatorSnapshotValue = styled.div`
  font-size: clamp(1.8rem, 3.4vw, 2.2rem);
  font-weight: 670;
  line-height: 1.05;
`;

const CalculatorSnapshotMeta = styled.p`
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.5;
  color: ${theme.colors.mutedTextStrong};
`;

const HeroFeatureList = styled.ul`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const HeroFeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: rgba(255, 255, 255, 0.72);
  font-size: 0.83rem;
  line-height: 1.4;
  color: ${theme.colors.mutedTextStrong};
`;

const HeroFeatureCheck = styled.span`
  position: relative;
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  border-radius: 999px;
  border: 1px solid ${theme.colors.successBorder};
  background: ${theme.colors.successSurface};

  &::after {
    content: "";
    position: absolute;
    left: 5px;
    top: 2px;
    width: 5px;
    height: 9px;
    border-right: 2px solid ${theme.colors.successText};
    border-bottom: 2px solid ${theme.colors.successText};
    transform: rotate(40deg);
  }
`;

const UtilitySection = styled(Section)`
  padding-block: 28px;
  border-top: 1px solid ${theme.colors.border};
  background: rgba(255, 255, 255, 0.64);

  @media (min-width: ${theme.breakpoints.md}) {
    padding-block: 40px;
  }
`;

const BenchmarkUtilitySection = styled(Section)`
  padding-block: 28px;
  border-bottom: 1px solid ${theme.colors.border};
  background: rgba(255, 255, 255, 0.64);

  @media (min-width: ${theme.breakpoints.md}) {
    padding-block: 40px;
  }
`;

const BenchmarkUtilityLayout = styled.div`
  display: grid;
  gap: 24px;

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
    align-items: start;
    gap: 28px;
  }
`;

const BenchmarkUtilityIntro = styled.div`
  min-width: 0;

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-column: 1 / -1;
  }
`;

const BenchmarkUtilityText = styled.div`
  min-width: 0;
`;

const BenchmarkUtilityStack = styled.div`
  margin-top: 32px;
  display: grid;
  gap: 14px;
`;

const BenchmarkSnapshotCard = styled(HeroVisualCard)`
  align-self: start;

  @media (min-width: ${theme.breakpoints.lg}) {
    margin-top: 32px;
  }
`;

const UtilityLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: 20px;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;

const UtilityGrid = styled.div`
  margin-top: 32px;
  display: grid;
  gap: 14px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const UtilityCard = styled(SurfaceCard)`
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  display: grid;
  gap: 10px;
`;

const UtilityTitle = styled.h3`
  margin: 0;
  font-size: 1.04rem;
  font-weight: 630;
`;

const UtilityBody = styled.p`
  margin: 0;
  font-size: 0.94rem;
  line-height: 1.68;
`;

const TrustSection = styled(Section)`
  padding-block: 28px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding-block: 40px;
  }
`;

const TrustGrid = styled.div`
  margin-top: 32px;
  display: grid;
  gap: 16px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const TrustItem = styled(SurfaceCard)`
  padding: 22px;
  display: grid;
  gap: 10px;
`;

const TrustTitle = styled.h3`
  margin: 0;
  font-size: 1.06rem;
  font-weight: 630;
`;

const TrustBody = styled.p`
  margin: 0;
  font-size: 0.93rem;
  line-height: 1.7;
`;

const TrustLink = styled(Link)`
  width: fit-content;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  font-size: 0.86rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;

const GuidesSection = styled(Section)`
  padding-block: 28px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding-block: 40px;
  }
`;

const GuideGrid = styled.div`
  margin-top: 32px;
  display: grid;
  gap: 14px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const GuideCard = styled(Link)`
  display: grid;
  gap: 14px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  background: ${theme.colors.surface};
  padding: 24px;
  transition: border-color 120ms ease, transform 120ms ease;

  &:hover {
    border-color: ${theme.colors.borderStrong};
    transform: translateY(-1px);
  }
`;

const GuideMeta = styled.div`
  display: grid;
  gap: 8px;
`;

const GuideCategory = styled.p`
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${theme.colors.mutedText};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

const GuideDate = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: ${theme.colors.mutedText};
`;

const GuideTitle = styled.h3`
  margin: 0;
  font-size: 1.12rem;
  font-weight: 630;
  line-height: 1.34;
`;

const GuideSummary = styled.p`
  margin: 0;
  font-size: 0.94rem;
  line-height: 1.66;
`;

const GuideFooter = styled.div`
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const GuideRead = styled.p`
  margin: 0;
  font-size: 0.84rem;
  color: ${theme.colors.mutedText};
`;

const GuideReadLink = styled.p`
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${theme.colors.accent};
`;

const GuidesActions = styled.div`
  margin-top: 24px;
`;

const ClosingSection = styled(Section)`
  padding-top: 28px;
  padding-bottom: 40px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 40px;
    padding-bottom: 56px;
  }
`;

const ClosingCard = styled(SurfaceCard)`
  padding: 32px;
  display: grid;
  gap: 16px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.86)),
    ${theme.colors.surface};
`;

const ClosingTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.5rem, 2.8vw, 1.95rem);
  font-weight: 640;
`;

const ClosingBody = styled.p`
  margin: 0;
  max-width: 64ch;
  font-size: 0.98rem;
  line-height: 1.72;
`;

const ClosingActions = styled.div`
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
