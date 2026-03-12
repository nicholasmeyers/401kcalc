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

const utilityPoints = [
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
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
    inLanguage: "en-US",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />

      <HeroSection>
        <Container>
          <HeroCard>
            <HeroContent>
              <PageIntro
                eyebrow="401(k) Planning"
                title="See how today’s 401(k) choices can shape your retirement income."
                description="401kcalc helps you model long-term outcomes with assumptions you can inspect, adjust, and compare in minutes."
              >
                <HeroActions>
                  <ButtonLink href="/401k-calculator">Open 401(k) Calculator</ButtonLink>
                  <ButtonLink href="/guides" variant="secondary">
                    Browse Guides
                  </ButtonLink>
                </HeroActions>
                <HeroSignals aria-label="Calculator value signals">
                  <SignalPill>Projection to retirement age</SignalPill>
                  <SignalPill>Inflation-aware outcomes</SignalPill>
                  <SignalPill>Assumptions fully visible</SignalPill>
                </HeroSignals>
              </PageIntro>
            </HeroContent>
            <HeroSummary>
              <SummaryLabel>What you can answer quickly</SummaryLabel>
              <SummaryList>
                <SummaryItem>How much your 401(k) could grow by retirement</SummaryItem>
                <SummaryItem>How much employer match adds over time</SummaryItem>
                <SummaryItem>How inflation changes real retirement value</SummaryItem>
                <SummaryItem>What annual retirement income the balance may support</SummaryItem>
              </SummaryList>
            </HeroSummary>
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
            {utilityPoints.map((point) => (
              <UtilityCard key={point.title}>
                <UtilityTitle>{point.title}</UtilityTitle>
                <UtilityBody>{point.body}</UtilityBody>
              </UtilityCard>
            ))}
          </UtilityGrid>
        </Container>
      </UtilitySection>

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
  padding-top: 52px;
  padding-bottom: 34px;
`;

const HeroCard = styled(SurfaceCard)`
  padding: 34px;
  display: grid;
  gap: 28px;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.1), transparent 62%),
    ${theme.colors.surface};

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 1.5fr) minmax(260px, 1fr);
    align-items: start;
  }
`;

const HeroContent = styled.div`
  min-width: 0;
`;

const HeroSignals = styled.ul`
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SignalPill = styled.li`
  height: 32px;
  display: inline-flex;
  align-items: center;
  padding-inline: 12px;
  border-radius: ${theme.radii.pill};
  border: 1px solid ${theme.colors.border};
  background: rgba(255, 255, 255, 0.86);
  font-size: 0.8rem;
  font-weight: 600;
  color: ${theme.colors.mutedTextStrong};
`;

const HeroSummary = styled.aside`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  background: rgba(255, 255, 255, 0.82);
  padding: 20px;
  display: grid;
  gap: 12px;

  @media (min-width: ${theme.breakpoints.lg}) {
    margin-top: 18px;
    position: relative;
    top: 2px;
  }
`;

const SummaryLabel = styled.p`
  font-size: 0.74rem;
  font-weight: 700;
  color: ${theme.colors.mutedText};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

const SummaryList = styled.ul`
  display: grid;
  gap: 10px;
`;

const SummaryItem = styled.li`
  font-size: 0.9rem;
  line-height: 1.55;
  color: ${theme.colors.textSecondary};
  position: relative;
  padding-left: 14px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${theme.colors.accent};
  }
`;

const HeroActions = styled.div`
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const UtilitySection = styled(Section)`
  padding-top: 14px;
  border-block: 1px solid ${theme.colors.border};
  background: rgba(255, 255, 255, 0.64);
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
  font-size: 1.04rem;
  font-weight: 630;
`;

const UtilityBody = styled.p`
  font-size: 0.94rem;
  line-height: 1.68;
`;

const TrustSection = styled(Section)`
  padding-top: 36px;
`;

const TrustGrid = styled.div`
  margin-top: 34px;
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
  font-size: 1.06rem;
  font-weight: 630;
`;

const TrustBody = styled.p`
  font-size: 0.93rem;
  line-height: 1.7;
`;

const TrustLink = styled(Link)`
  width: fit-content;
  font-size: 0.86rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;

const GuidesSection = styled(Section)`
  padding-top: 28px;
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
  font-size: 0.72rem;
  font-weight: 700;
  color: ${theme.colors.mutedText};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

const GuideDate = styled.p`
  font-size: 0.82rem;
  color: ${theme.colors.mutedText};
`;

const GuideTitle = styled.h3`
  font-size: 1.12rem;
  font-weight: 630;
  line-height: 1.34;
`;

const GuideSummary = styled.p`
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
  font-size: 0.84rem;
  color: ${theme.colors.mutedText};
`;

const GuideReadLink = styled.p`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${theme.colors.accent};
`;

const GuidesActions = styled.div`
  margin-top: 24px;
`;

const ClosingSection = styled(Section)`
  padding-top: 18px;
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
  font-size: clamp(1.5rem, 2.8vw, 1.95rem);
  font-weight: 640;
`;

const ClosingBody = styled.p`
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
