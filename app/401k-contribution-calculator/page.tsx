import type { Metadata } from "next";
import Link from "next/link";
import styled from "styled-components";

import { ContributionImpactExperience } from "@/components/contribution-impact/contribution-impact-experience";
import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { SectionSubtitle, SectionTitle, SurfaceCard } from "@/components/ui/primitives";
import { getGuideBySlug } from "@/lib/guides/guides";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

const contributionGuide = getGuideBySlug("how-much-should-i-contribute-to-my-401k");
const employerMatchGuide = getGuideBySlug("401k-employer-match-explained");

const contributionHighlights = [
  {
    title: "One change, isolated",
    body:
      "Models only the extra dollars from the increase — not your full retirement plan.",
  },
  {
    title: "Duration matters",
    body:
      "Compare 1-year, 5-year, and until-retirement scenarios to see how consistency compounds.",
  },
  {
    title: "IRS cap stays fixed",
    body:
      "Uses the employee contribution cap for your current age and holds it constant.",
  },
];

const bridgeCards = [
  {
    eyebrow: "Full projection",
    href: "/401k-calculator",
    title: "Open the full 401(k) calculator",
    body:
      "Combine this increase with your current balance, spending goals, and broader plan assumptions.",
  },
  {
    eyebrow: "Benchmark check",
    href: "/retirement-by-age",
    title: "See your retirement-by-age benchmark",
    body:
      "Check whether your current savings path is directionally on track for your age.",
  },
  {
    eyebrow: "Contribution guide",
    href: contributionGuide?.slug ? `/guides/${contributionGuide.slug}` : "/guides/how-much-should-i-contribute-to-my-401k",
    title: contributionGuide?.title ?? "How Much Should I Contribute to My 401(k)?",
    body:
      contributionGuide?.excerpt ??
      "Practical guidance for choosing a savings rate you can keep long enough for compounding to matter.",
  },
  {
    eyebrow: "Employer match",
    href: employerMatchGuide?.slug ? `/guides/${employerMatchGuide.slug}` : "/guides/401k-employer-match-explained",
    title: employerMatchGuide?.title ?? "401(k) Employer Match Explained",
    body:
      employerMatchGuide?.excerpt ??
      "If you may still be leaving match dollars on the table, solve that first before optimizing the next 1% to 5%.",
  },
];

const contributionFaqs = [
  {
    question: "Does this calculator use my current 401(k) balance?",
    answer:
      "No. This calculator isolates the increase itself and treats the extra dollars like a separate stream of contributions starting from zero. That keeps the result focused on what the change alone adds.",
    href: "/401k-calculator",
    label: "Use the full calculator for a full projection",
  },
  {
    question: "Does the calculator raise my contribution limit when I turn 50 later?",
    answer:
      "No. This page intentionally freezes the employee contribution cap at the limit that applies to your current age. If you are already catch-up eligible today, that higher cap is included from the start. If you are not, the model does not step up later.",
    href: "/retirement-by-age",
    label: "See your retirement-by-age benchmark to explore age related limits and catch-up eligibility",
  },
  {
    question: "How is retirement income from the increase estimated?",
    answer:
      "The page turns the added balance into an income estimate with a simple 4% withdrawal-rate rule of thumb. That makes the result easier to interpret, but it is not personalized retirement-income advice.",
    href: "/methodology",
    label: "Review the methodology",
  },
  {
    question: "Does the paycheck impact include taxes?",
    answer:
      "Not fully. The paycheck-impact card uses a simplified estimate so the tradeoff stays easy to understand. Roth dollars reduce take-home pay more directly, while traditional dollars get a rough tax offset in the model.",
    href: "/guides/roth-vs-traditional-401k",
    label: "Compare Roth vs Traditional",
  },
  {
    question: "When should I use this page instead of the main calculator?",
    answer:
      "Use this page when your question is what a modest contribution increase alone adds. Use the main calculator when you want the broader retirement-planning answer, including balances, spending goals, and more detailed assumptions.",
    href: "/401k-calculator",
    label: "Open the full calculator",
  },
];

export const metadata: Metadata = {
  title: "401(k) Contribution Increase Calculator",
  description:
    "Contribution increase calculator: see how much increasing your 401(k) contribution could add by retirement. Compare 1-year, 5-year, and until-retirement scenarios. Estimate paycheck impact and monthly retirement income.",
  keywords: [
    "401k contribution increase calculator",
    "increase 401k contribution",
    "401k contribution rate calculator",
    "how much to increase 401k",
    "401k contribution impact",
  ],
  alternates: {
    canonical: "/401k-contribution-calculator",
  },
  openGraph: {
    title: "401(k) Contribution Increase Calculator | 401kcalc",
    description:
      "Contribution increase calculator: measure what a higher 401(k) contribution rate could add to your retirement balance and monthly income.",
    url: `${siteConfig.url}/401k-contribution-calculator`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "401(k) Contribution Increase Calculator",
    description:
      "Estimate the impact of increasing your 401(k) contribution rate without rebuilding your whole retirement plan.",
  },
};

export default function ContributionCalculatorPage() {
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "401(k) Contribution Increase Calculator",
    operatingSystem: "Web",
    applicationCategory: "FinanceApplication",
    url: `${siteConfig.url}/401k-contribution-calculator`,
    description:
      "401(k) contribution increase calculator. Estimate what raising your contribution rate could add by retirement. Compare 1-year, 5-year, and until-retirement scenarios. See monthly retirement income and paycheck impact.",
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
      "Contribution increase impact by retirement",
      "1-year, 5-year, and until-retirement comparisons",
      "Monthly retirement income estimate",
      "Paycheck impact today",
      "Traditional vs Roth split for the increase",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "401(k) Contribution Increase Calculator",
        item: `${siteConfig.url}/401k-contribution-calculator`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: contributionFaqs.map((faq) => ({
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <IntroSection>
        <Container>
          <IntroStack>
            <PageIntro
              eyebrow="Increase Contributions"
              title="What raising your 401(k) contribution could add"
              description="See how an extra 1%, 2%, 3% ... 10% of salary could compound into real monthly retirement income."
            />
          </IntroStack>
        </Container>
      </IntroSection>

      <CalculatorSection>
        <Container>
          <ContributionImpactExperience />
        </Container>
      </CalculatorSection>

      <SupportingContentSection>
        <Container>
          <SupportingContentStack>
            <SectionHeader>
              <SectionTitle>How this tool works</SectionTitle>
              <SectionSubtitle>
                A focused answer to one question: what does a higher savings rate add on its own?
              </SectionSubtitle>
            </SectionHeader>

            <HighlightGrid>
              {contributionHighlights.map((highlight) => (
                <HighlightCard key={highlight.title}>
                  <CardTitle>{highlight.title}</CardTitle>
                  <CardBody>{highlight.body}</CardBody>
                </HighlightCard>
              ))}
            </HighlightGrid>

            <ContentBlock>
              <SectionTitle as="h2">What to do next</SectionTitle>
              <SectionSubtitle>
                Common next steps after testing a higher savings rate.
              </SectionSubtitle>

              <BridgeGrid>
                {bridgeCards.map((card) => (
                  <BridgeCard key={card.href}>
                    <CardEyebrow>{card.eyebrow}</CardEyebrow>
                    <CardTitle>{card.title}</CardTitle>
                    <CardBody>{card.body}</CardBody>
                    <InlineLink href={card.href}>Open this next →</InlineLink>
                  </BridgeCard>
                ))}
              </BridgeGrid>
            </ContentBlock>

            <ContentBlock>
              <SectionTitle as="h2">401(k) contribution increase calculator FAQ</SectionTitle>
              <SectionSubtitle>
                Assumptions and tradeoffs most likely to come up while using this page.
              </SectionSubtitle>
              <FaqList>
                {contributionFaqs.map((faq) => (
                  <FaqItem key={faq.question}>
                    <FaqSummary>{faq.question}</FaqSummary>
                    <FaqAnswer>
                      <p>{faq.answer}</p>
                      <InlineLink href={faq.href}>{faq.label} →</InlineLink>
                    </FaqAnswer>
                  </FaqItem>
                ))}
              </FaqList>
            </ContentBlock>
          </SupportingContentStack>
        </Container>
      </SupportingContentSection>
    </>
  );
}

const IntroSection = styled(Section)`
  padding-top: 28px;
  padding-bottom: 20px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 48px;
    padding-bottom: 24px;
  }
`;

const IntroStack = styled.div`
  display: grid;
  gap: 16px;
`;

const CalculatorSection = styled(Section)`
  padding-top: 0;
  padding-bottom: 20px;
`;

const SupportingContentSection = styled(Section)`
  padding-top: 0;
  padding-bottom: 72px;
`;

const SupportingContentStack = styled.div`
  display: grid;
  gap: 24px;
`;

const SectionHeader = styled.div`
  display: grid;
  gap: 8px;
  max-width: 780px;
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

const ContentBlock = styled.div`
  display: grid;
  gap: 14px;
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

const CardEyebrow = styled.p`
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${theme.colors.mutedText};
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 640;
  line-height: 1.35;
`;

const CardBody = styled.p`
  font-size: 0.9rem;
  line-height: 1.65;
  color: ${theme.colors.mutedTextStrong};
`;

const InlineLink = styled(Link)`
  font-size: 0.88rem;
  font-weight: 600;
  color: ${theme.colors.accent};
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;

const FaqList = styled.div`
  display: grid;
  gap: 12px;
`;

const FaqItem = styled.details`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surface};
  padding: 16px 18px;
`;

const FaqSummary = styled.summary`
  cursor: pointer;
  font-size: 0.96rem;
  font-weight: 640;
  color: ${theme.colors.text};
`;

const FaqAnswer = styled.div`
  padding-top: 12px;
  display: grid;
  gap: 10px;
  font-size: 0.9rem;
  line-height: 1.65;
  color: ${theme.colors.mutedTextStrong};
`;
