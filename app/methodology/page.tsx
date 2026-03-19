import type { Metadata } from "next";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { SurfaceCard } from "@/components/ui/primitives";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

export const metadata: Metadata = {
  title: "401k Calculator Methodology",
  description:
    "How 401kcalc estimates retirement balances, contribution limits, and retirement spending using editable assumptions.",
  alternates: {
    canonical: "/methodology",
  },
  openGraph: {
    title: "Methodology | 401kcalc",
    description: "Review the assumptions and formulas used by the 401kcalc retirement calculator.",
    url: `${siteConfig.url}/methodology`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "401k Calculator Methodology",
    description: "Clear explanation of projection assumptions and calculation logic.",
  },
};

const methodologySections = [
  {
    heading: "How the calculator works",
    body: "The calculator estimates your 401(k) balance each year from your current age through life expectancy. After retirement age, it models annual withdrawals based on your spending target so you can see whether savings may support your planned lifestyle.",
  },
  {
    heading: "Projection assumptions",
    body: "Every assumption is visible and editable. Unless you change an input, the model keeps that value the same each year. Use it to compare scenarios, not to predict market returns.",
  },
  {
    heading: "Midpoint contribution method",
    body: "Employee and employer contributions are treated as if they are invested throughout the year. To avoid overstating growth, annual contributions are modeled as arriving around the middle of each year.",
  },
  {
    heading: "Simplified employer match",
    body: "Employer match is estimated using a simplified formula based on salary and contribution rate. Plan-specific details such as per-paycheck true-up rules, vesting timelines, and annual cap nuances may differ from your employer plan documents.",
  },
  {
    heading: "Employee contribution cap",
    body: "Employee contributions are calculated from your selected rate, then limited by IRS rules. The model applies the compensation cap, age-based deferral limits (including catch-up and ages 60-63 super catch-up), and the annual combined employee + employer contribution cap.",
  },
  {
    heading: "Retirement spending simulation",
    body: "After retirement age, the model runs a deterministic year-by-year drawdown. Each retirement year applies portfolio growth first and then subtracts that year’s spending. You can keep spending flat, increase it for inflation each year, and optionally use age-based spending phases (early, mid, and late retirement).",
  },
  {
    heading: "Spending goal durability result",
    body: "Results are based on your annual retirement spending goal. The calculator reports whether savings last through your selected life expectancy and, if not, the age where the portfolio is projected to run out.",
  },
  {
    heading: "Deterministic projection model",
    body: "The calculator assumes the same return and growth pattern each year based on the values you enter. It does not run Monte Carlo simulations or random market paths, so treat the result as a baseline scenario rather than a probability forecast.",
  },
];

export default function MethodologyPage() {
  const methodologySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "401k Calculator Methodology",
    url: `${siteConfig.url}/methodology`,
    description:
      "How 401kcalc estimates retirement balances, contribution limits, and spending sustainability using editable assumptions.",
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
            description="This page explains the assumptions and formulas used in the calculator so you can understand what each estimate is based on."
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
