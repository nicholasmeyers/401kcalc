import type { Metadata } from "next";
import styled from "styled-components";

import { ButtonLink } from "@/components/ui/button-link";
import { GuidesHeroWithTopics } from "@/components/guides/guides-hero-with-topics";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SurfaceCard } from "@/components/ui/primitives";
import { formatGuideDate, getAllGuides, getGuideCategories } from "@/lib/guides/guides";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

const guides = getAllGuides();
const categories = getGuideCategories();

export const metadata: Metadata = {
  title: "401k Retirement Planning Guides",
  description:
    "Decision-first 401k guides on age-based savings milestones, Roth vs Traditional strategy, and employer match optimization.",
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    title: "401k Guides | 401kcalc",
    description:
      "Explore practical 401k guides built to support contribution strategy, tax choices, and retirement planning confidence.",
    url: `${siteConfig.url}/guides`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "401k Retirement Planning Guides",
    description:
      "Explore practical 401k guides on savings milestones, tax strategy, and employer match optimization.",
  },
};

export default function GuidesPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${siteConfig.url}/guides` },
    ],
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "401k Retirement Planning Guides",
    url: `${siteConfig.url}/guides`,
    description:
      "Decision-first 401k guides on age-based savings milestones, Roth vs Traditional strategy, and employer match optimization.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />

      <GuidesHeroWithTopics
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
              Use the <strong>401k calculator</strong> to test contribution, return, and timeline assumptions based on the strategies from these guides.
            </CalculatorBody>
            <ButtonLink href="/401k-calculator">Go to 401k Calculator</ButtonLink>
          </CalculatorCard>
        </Container>
      </CalculatorSection>
    </>
  );
}

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
