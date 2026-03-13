import type { Metadata } from "next";
import styled from "styled-components";

import { ButtonLink } from "@/components/ui/button-link";
import { GuidesFilteredList } from "@/components/guides/guides-filtered-list";
import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { SurfaceCard } from "@/components/ui/primitives";
import { formatGuideDate, getAllGuides, getGuideCategories } from "@/lib/guides/guides";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

const guides = getAllGuides();
const categories = getGuideCategories();

export const metadata: Metadata = {
  title: "401(k) Retirement Planning Guides",
  description:
    "Decision-first 401(k) guides on age-based savings milestones, Roth vs Traditional strategy, and employer match optimization.",
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    title: "401(k) Guides | 401kcalc",
    description:
      "Explore practical 401(k) guides built to support contribution strategy, tax choices, and retirement planning confidence.",
    url: `${siteConfig.url}/guides`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "401(k) Retirement Planning Guides",
    description:
      "Explore practical 401(k) guides on savings milestones, tax strategy, and employer match optimization.",
  },
};

export default function GuidesPage() {
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "401(k) Retirement Planning Guides",
    url: `${siteConfig.url}/guides`,
    description:
      "Decision-first 401(k) guides on age-based savings milestones, Roth vs Traditional strategy, and employer match optimization.",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteConfig.url}/guides/${guide.slug}`,
        name: guide.title,
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
              eyebrow="Guides"
              title="Simple guides for common 401(k) decisions"
              description="Learn how savings checkpoints by age, tax choices, and employer match rules affect your retirement plan."
            />
            <TopicOverview>
              <TopicItem>
                <TopicItemTitle>401(k) Milestones</TopicItemTitle>
                <TopicItemDescription>
                  Savings checkpoints by age, how to judge your progress, and what to do if you&apos;re behind.
                </TopicItemDescription>
              </TopicItem>
              <TopicItem>
                <TopicItemTitle>Tax Strategy</TopicItemTitle>
                <TopicItemDescription>
                  How to think about Roth vs. Traditional contributions and when each may make more sense.
                </TopicItemDescription>
              </TopicItem>
              <TopicItem>
                <TopicItemTitle>Employer Benefits</TopicItemTitle>
                <TopicItemDescription>
                  How employer match works, what plan formulas mean, and how to avoid missing available match.
                </TopicItemDescription>
              </TopicItem>
            </TopicOverview>
          </HeroCard>
        </Container>
      </HeroSection>

      <GuidesFilteredList
        guides={guides.map((guide) => ({
          slug: guide.slug,
          title: guide.title,
          excerpt: guide.excerpt,
          category: guide.category,
          readingTime: guide.readingTime,
          formattedDate: formatGuideDate(guide.publishedAt) ?? "Recently updated",
        }))}
        categories={categories}
      />

      <CalculatorSection>
        <Container>
          <CalculatorCard>
            <CalculatorTitle>Ready to turn guidance into a plan?</CalculatorTitle>
            <CalculatorBody>
              Use the <strong>401(k) calculator</strong> to test contribution, return, and timeline assumptions based on the strategies from these guides.
            </CalculatorBody>
            <ButtonLink href="/401k-calculator">Go to 401(k) Calculator</ButtonLink>
          </CalculatorCard>
        </Container>
      </CalculatorSection>
    </>
  );
}

const HeroSection = styled(Section)`
  padding-top: 52px;
  padding-bottom: 30px;
`;

const HeroCard = styled(SurfaceCard)`
  padding: 34px;
  display: grid;
  gap: 24px;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 58%),
    ${theme.colors.surface};

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 44px;
    gap: 28px;
  }
`;

const TopicOverview = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }
`;

const TopicItem = styled.div`
  display: grid;
  gap: 4px;
`;

const TopicItemTitle = styled.h3`
  font-size: 0.92rem;
  font-weight: 640;
`;

const TopicItemDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.58;
  color: ${theme.colors.textSecondary};
`;

const CalculatorSection = styled(Section)`
  padding-top: 16px;
`;

const CalculatorCard = styled(SurfaceCard)`
  padding: 30px;
  max-width: 760px;
  display: grid;
  gap: 14px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 34px;
  }
`;

const CalculatorTitle = styled.h2`
  font-size: clamp(1.4rem, 2.8vw, 1.9rem);
  font-weight: 640;
`;

const CalculatorBody = styled.p`
  max-width: 58ch;
  font-size: 1rem;
  line-height: 1.72;
`;
