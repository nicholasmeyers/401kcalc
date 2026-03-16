import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import styled from "styled-components";

import { CalculatorExperience } from "@/components/calculator/calculator-experience";
import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { getGuideBySlug } from "@/lib/guides/guides";
import { siteConfig } from "@/lib/site";
import { SectionSubtitle, SectionTitle, SurfaceCard } from "@/components/ui/primitives";
import { theme } from "@/styles/theme";

const bridgeGuideCards = [
  {
    eyebrow: "Contribution rate",
    href: "/guides/how-much-should-i-contribute-to-my-401k",
    guide: getGuideBySlug("how-much-should-i-contribute-to-my-401k"),
    body:
      "Contribution rate is the biggest input lever in the model. Use this guide if you want a practical starting point before testing scenarios.",
  },
  {
    eyebrow: "Employer match",
    href: "/guides/401k-employer-match-explained",
    guide: getGuideBySlug("401k-employer-match-explained"),
    body:
      "If you are unsure how to enter your plan match, start here. Match structure can change your results more than small tweaks to return assumptions.",
  },
  {
    eyebrow: "Tax treatment",
    href: "/guides/roth-vs-traditional-401k",
    guide: getGuideBySlug("roth-vs-traditional-401k"),
    body:
      "The calculator supports both Traditional and Roth balances, but this guide helps you think through the tradeoff before you model a split.",
  },
  {
    eyebrow: "Benchmark check",
    href: "/retirement-by-age",
    guide: null,
    body:
      "Use the retirement-by-age planner when your real question is not just what you may have, but whether your current path looks on track for your age.",
  },
];

const calculatorHighlights = [
  {
    title: "How this calculator works",
    body:
      "The projection estimates your 401(k) balance year by year from your current age through life expectancy. After retirement age, it models annual withdrawals against your spending goal so you can see whether savings may last.",
  },
  {
    title: "Inputs that matter most",
    body:
      "Your savings rate, employer match, retirement age, and retirement spending goal usually matter more than tiny changes to market-return assumptions. The fastest way to learn from the tool is to compare a baseline scenario against one or two realistic improvements.",
  },
  {
    title: "What this page is best for",
    body:
      "Use this calculator to stress-test a plan, compare tradeoffs, and understand whether your current savings path supports your target retirement lifestyle. Treat it as a planning model, not a prediction of actual market returns.",
  },
];

const calculatorFaqs = [
  {
    question: "How much should I contribute to my 401(k)?",
    answer:
      "There is no single percentage that fits everyone, but the most useful starting point is usually the highest rate you can sustain while still capturing the full employer match. From there, compare scenarios with higher savings rates and annual step-ups to see how much they improve your retirement-income outlook.",
    href: "/guides/how-much-should-i-contribute-to-my-401k",
    label: "Read the contribution guide",
  },
  {
    question: "How should I enter employer match in the calculator?",
    answer:
      "Use your plan&apos;s match percentage and cap as a simplified estimate. The model is directionally useful, but real plans can have true-up rules, vesting schedules, or payroll timing details that are more complex than a single flat match formula.",
    href: "/guides/401k-employer-match-explained",
    label: "See employer match examples",
  },
  {
    question: "Does this calculator support Roth 401(k) contributions?",
    answer:
      "Yes. You can model both current Roth balances and a Roth contribution split, which helps compare taxable and tax-free retirement income. If you are deciding between Roth and Traditional contributions, use the calculator alongside the tax-treatment guide rather than relying on a default split.",
    href: "/guides/roth-vs-traditional-401k",
    label: "Compare Roth vs Traditional",
  },
  {
    question: "Can this page tell me whether I am on track for my age?",
    answer:
      "It can show what your current plan may produce, but age-based benchmarks answer a different question: whether your balance lines up with common savings checkpoints for your stage of life. Use the benchmark planner if you want a faster directional check before or after running a full projection.",
    href: "/retirement-by-age",
    label: "Open the benchmark planner",
  },
  {
    question: "What does this calculator not include?",
    answer:
      "This model does not run Monte Carlo simulations, include taxes in retirement-income estimates, or capture every employer-plan detail. It is built to make assumptions visible and editable so you can compare scenarios clearly, then use the methodology page for the full explanation of what is and is not modeled.",
    href: "/methodology",
    label: "Review the methodology",
  },
];

export const metadata: Metadata = {
  title: "401(k) Retirement Calculator",
  description:
    "Estimate how much your 401(k) could grow and whether your annual retirement spending goal may last through life expectancy.",
  alternates: {
    canonical: "/401k-calculator",
  },
  openGraph: {
    title: "401(k) Retirement Calculator | 401kcalc",
    description:
      "Test assumptions and estimate projected balance and retirement spending longevity.",
    url: `${siteConfig.url}/401k-calculator`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "401(k) Retirement Calculator",
    description:
      "Estimate projected balance and whether savings may last through retirement spending years.",
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
      "Interactive 401(k) calculator that estimates projected balance and retirement spending longevity based on your assumptions.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.url,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/images/logo.png` },
    },
    featureList: [
      "Projected balance over time",
      "Annual retirement spending goal simulation",
      "Inflation-adjusted balance view",
      "Interactive retirement age marker",
      "Year-by-year retirement drawdown simulation",
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: calculatorFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replaceAll("&apos;", "'"),
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <IntroSection>
        <Container>
          <PageIntro
            eyebrow="Calculator"
            title="401(k) Calculator"
            description="Enter your assumptions to estimate projected balance and whether your annual retirement spending goal may last through retirement."
          >
            <MethodologyLink href="/methodology">How these estimates are calculated {"\u2192"}</MethodologyLink>
          </PageIntro>
        </Container>
      </IntroSection>

      <CalculatorSection>
        <Container>
          <Suspense>
            <CalculatorExperience />
          </Suspense>
        </Container>
      </CalculatorSection>

      <SupportingContentSection>
        <Container>
          <SupportingContentStack>
            <SectionHeader>
              <SectionTitle>How this 401(k) calculator supports planning decisions</SectionTitle>
              <SectionSubtitle>
                Use the interactive model for the numbers, then use the sections below to choose better assumptions,
                interpret the result, and jump into the next question that usually comes up.
              </SectionSubtitle>
            </SectionHeader>

            <HighlightGrid>
              {calculatorHighlights.map((highlight) => (
                <HighlightCard key={highlight.title}>
                  <HighlightTitle>{highlight.title}</HighlightTitle>
                  <HighlightBody>{highlight.body}</HighlightBody>
                </HighlightCard>
              ))}
            </HighlightGrid>

            <BridgeBlock>
              <BridgeHeader>
                <SectionTitle as="h2">Before you run the numbers</SectionTitle>
                <SectionSubtitle>
                  These are the most common planning questions that sit right next to the calculator. They help turn a
                  raw projection into a better decision.
                </SectionSubtitle>
              </BridgeHeader>

              <BridgeGrid>
                {bridgeGuideCards.map((card) => (
                  <BridgeCard key={card.href}>
                    <BridgeEyebrow>{card.eyebrow}</BridgeEyebrow>
                    <BridgeTitle>{card.guide?.title ?? "Are you on track for your age?"}</BridgeTitle>
                    <BridgeBody>{card.guide?.excerpt ?? card.body}</BridgeBody>
                    <BridgeSupport>{card.body}</BridgeSupport>
                    <BridgeLink href={card.href}>
                      {card.guide ? `Open ${card.guide.title} →` : "Open Retirement by Age →"}
                    </BridgeLink>
                  </BridgeCard>
                ))}
              </BridgeGrid>
            </BridgeBlock>

            <FaqBlock>
              <BridgeHeader>
                <SectionTitle as="h2">401(k) calculator FAQ</SectionTitle>
                <SectionSubtitle>
                  Focused answers for the questions most people have while entering assumptions or interpreting their
                  result.
                </SectionSubtitle>
              </BridgeHeader>

              <FaqList>
                {calculatorFaqs.map((faq) => (
                  <FaqItem key={faq.question}>
                    <FaqSummary>{faq.question}</FaqSummary>
                    <FaqAnswer>
                      <p>{faq.answer.replaceAll("&apos;", "'")}</p>
                      <FaqLink href={faq.href}>{faq.label} →</FaqLink>
                    </FaqAnswer>
                  </FaqItem>
                ))}
              </FaqList>
            </FaqBlock>
          </SupportingContentStack>
        </Container>
      </SupportingContentSection>
    </>
  );
}

const IntroSection = styled(Section)`
  padding-top: 28px;
  padding-bottom: 24px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 48px;
    padding-bottom: 30px;
  }
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

const SupportingContentSection = styled(Section)`
  padding-top: 0;
  padding-bottom: 88px;
`;

const SupportingContentStack = styled.div`
  display: grid;
  gap: 28px;
`;

const SectionHeader = styled.div`
  display: grid;
  gap: 8px;
  max-width: 760px;
`;

const HighlightGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const HighlightCard = styled(SurfaceCard)`
  padding: 22px;
  display: grid;
  gap: 10px;
`;

const HighlightTitle = styled.h2`
  font-size: 1.02rem;
  font-weight: 650;
  line-height: 1.35;
`;

const HighlightBody = styled.p`
  font-size: 0.94rem;
  line-height: 1.6;
  color: ${theme.colors.mutedTextStrong};
`;

const BridgeBlock = styled.div`
  display: grid;
  gap: 16px;
`;

const BridgeHeader = styled.div`
  display: grid;
  gap: 8px;
  max-width: 760px;
`;

const BridgeGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const BridgeCard = styled(SurfaceCard)`
  padding: 22px;
  display: grid;
  gap: 10px;
`;

const BridgeEyebrow = styled.p`
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedText};
`;

const BridgeTitle = styled.h3`
  font-size: 1.08rem;
  font-weight: 650;
  line-height: 1.35;
`;

const BridgeBody = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${theme.colors.text};
`;

const BridgeSupport = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${theme.colors.mutedTextStrong};
`;

const BridgeLink = styled(Link)`
  width: fit-content;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;

const FaqBlock = styled.div`
  display: grid;
  gap: 16px;
`;

const FaqList = styled.div`
  display: grid;
  gap: 12px;
`;

const FaqItem = styled.details`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  background: ${theme.colors.surface};
  overflow: hidden;
`;

const FaqSummary = styled.summary`
  cursor: pointer;
  list-style: none;
  padding: 18px 22px;
  font-size: 1rem;
  font-weight: 650;
  line-height: 1.45;

  &::-webkit-details-marker {
    display: none;
  }
`;

const FaqAnswer = styled.div`
  padding: 0 22px 20px;
  display: grid;
  gap: 10px;
  font-size: 0.94rem;
  line-height: 1.65;
  color: ${theme.colors.mutedTextStrong};
`;

const FaqLink = styled(Link)`
  width: fit-content;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;
