import type { Metadata } from "next";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { SurfaceCard } from "@/components/ui/primitives";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

export const metadata: Metadata = {
  title: "401(k) Calculator Methodology",
  description: "How 401kcalc projects retirement balances, match contributions, and withdrawal readiness with transparent assumptions.",
  alternates: {
    canonical: "/methodology",
  },
  openGraph: {
    title: "Methodology | 401kcalc",
    description: "Review the assumptions and projection mechanics used by the 401kcalc retirement calculator.",
    url: `${siteConfig.url}/methodology`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "401(k) Calculator Methodology",
    description: "Transparent explanation of projection assumptions and calculation logic.",
  },
};

const methodologySections = [
  {
    heading: "How the calculator works",
    body: "The calculator projects yearly 401(k) balances from your current age through life expectancy. It models both a withdrawal-rate retirement path and a fixed target-spending retirement path so you can compare sustainability side by side.",
  },
  {
    heading: "Projection assumptions",
    body: "Assumptions are explicit, user-editable, and held constant within each scenario unless you change them. The model is intended for directional planning and scenario comparison rather than market prediction.",
  },
  {
    heading: "Midpoint contribution method",
    body: "Employee and employer contributions are approximated as arriving throughout the year. To avoid overstating growth from early-year deposits, annual contributions are treated as if they are invested around the middle of each year.",
  },
  {
    heading: "Simplified employer match",
    body: "Employer match is modeled as a simplified formula against salary and contribution rate. Plan-specific rules such as per-paycheck true-up behavior, vesting timelines, and annual cap nuances may differ from your employer plan documents.",
  },
  {
    heading: "Employee contribution cap",
    body: "Employee contributions are derived from salary and your selected contribution rate, then capped by a configurable annual IRS employee contribution limit in this version. If your selected rate implies a higher annual amount, projections use the capped value.",
  },
  {
    heading: "Withdrawal rate assumption",
    body: "Retirement readiness uses an assumed withdrawal rate as a planning heuristic. This is not a guaranteed safe withdrawal level and should be stress-tested against your spending needs, tax context, and retirement timing.",
  },
  {
    heading: "Deterministic projection model",
    body: "The model is deterministic: each year follows a fixed return and growth path from your selected assumptions. It does not run Monte Carlo simulations or random market paths, so it should be interpreted as a baseline scenario, not a probability forecast.",
  },
];

export default function MethodologyPage() {
  const methodologySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "401(k) Calculator Methodology",
    url: `${siteConfig.url}/methodology`,
    description:
      "How 401kcalc projects retirement balances, match contributions, and withdrawal readiness with transparent assumptions.",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(methodologySchema) }} />

      <IntroSection>
        <Container>
          <PageIntro
            eyebrow="Methodology"
            title="How 401kcalc estimates retirement outcomes"
            description="This page explains the assumptions and formulas used in our calculator. The goal is transparency, not certainty."
          />
        </Container>
      </IntroSection>

      <ContentSection>
        <Container>
          <MethodologyCard>
            {methodologySections.map((section) => (
              <MethodBlock key={section.heading}>
                <MethodTitle>{section.heading}</MethodTitle>
                <MethodBody>{section.body}</MethodBody>
              </MethodBlock>
            ))}
            <Disclosure>
              401kcalc is educational software and not financial, tax, legal, or investment advice.
            </Disclosure>
          </MethodologyCard>
        </Container>
      </ContentSection>
    </>
  );
}

const IntroSection = styled(Section)`
  padding-top: 52px;
  padding-bottom: 30px;
`;

const ContentSection = styled(Section)`
  padding-top: 12px;
`;

const MethodologyCard = styled(SurfaceCard)`
  max-width: 860px;
  padding: 30px;
  display: grid;
  gap: 24px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 38px 40px;
    gap: 28px;
  }
`;

const MethodBlock = styled.section`
  display: grid;
  gap: 10px;
`;

const MethodTitle = styled.h2`
  font-size: clamp(1.22rem, 2.8vw, 1.55rem);
  font-weight: 640;
  color: ${theme.colors.text};
`;

const MethodBody = styled.p`
  font-size: 0.97rem;
  line-height: 1.72;
  color: ${theme.colors.textSecondary};
  max-width: 70ch;
`;

const Disclosure = styled.p`
  margin-top: 4px;
  padding-top: 16px;
  border-top: 1px solid ${theme.colors.border};
  font-size: 0.82rem;
  line-height: 1.62;
  color: ${theme.colors.mutedText};
`;
