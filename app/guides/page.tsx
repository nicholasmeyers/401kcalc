import type { Metadata } from "next";
import Link from "next/link";
import styled from "styled-components";

import { ButtonLink } from "@/components/ui/button-link";
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
              title="Clear 401(k) guidance for high-impact retirement decisions"
              description="Use concise, numbers-aware guides to benchmark progress, improve contribution strategy, and make smarter tradeoffs around taxes and employer match."
            />
            <HeroActions>
              <ButtonLink href="/401k-calculator">Open 401(k) Calculator</ButtonLink>
              <ButtonLink href="/retirement-by-age" variant="secondary">
                Retirement by Age
              </ButtonLink>
              <ButtonLink href="/about" variant="secondary">
                About 401kcalc
              </ButtonLink>
            </HeroActions>
            <HeroMeta>
              <MetaPill>{guides.length} published guides</MetaPill>
              <MetaPill>{categories.length} core topics</MetaPill>
            </HeroMeta>
          </HeroCard>
        </Container>
      </HeroSection>

      <TopicsSection>
        <Container>
          <TopicsTitle>Browse by topic</TopicsTitle>
          <TopicChips aria-label="Guide topics">
            {categories.map((category) => (
              <TopicChip key={category}>{category}</TopicChip>
            ))}
          </TopicChips>
        </Container>
      </TopicsSection>

      <GuidesSection>
        <Container>
          <GuideGrid>
            {guides.map((guide) => (
              <GuideCard key={guide.slug} href={`/guides/${guide.slug}`}>
                <GuideMetaRow>
                  {guide.category ? <GuideCategory>{guide.category}</GuideCategory> : null}
                  <GuideReadTime>{guide.readingTime ?? "Guide"}</GuideReadTime>
                </GuideMetaRow>
                <GuideTitle>{guide.title}</GuideTitle>
                <GuideExcerpt>{guide.excerpt}</GuideExcerpt>
                <GuideFooter>
                  <GuideDate>{formatGuideDate(guide.publishedAt) ?? "Recently updated"}</GuideDate>
                  <GuideCta>Read guide</GuideCta>
                </GuideFooter>
              </GuideCard>
            ))}
          </GuideGrid>
        </Container>
      </GuidesSection>

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

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const HeroMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const MetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding-inline: 12px;
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border};
  font-size: 0.82rem;
  font-weight: 600;
  color: ${theme.colors.mutedTextStrong};
`;

const TopicsSection = styled(Section)`
  padding-top: 16px;
  padding-bottom: 12px;
`;

const TopicsTitle = styled.h2`
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${theme.colors.mutedText};
`;

const TopicChips = styled.div`
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const TopicChip = styled.span`
  height: 34px;
  display: inline-flex;
  align-items: center;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.pill};
  padding-inline: 14px;
  font-size: 0.84rem;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  background: rgba(255, 255, 255, 0.72);
`;

const GuidesSection = styled(Section)`
  padding-top: 20px;
`;

const GuideGrid = styled.div`
  display: grid;
  gap: 14px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

const GuideMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const GuideCategory = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  color: ${theme.colors.mutedText};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

const GuideReadTime = styled.p`
  font-size: 0.83rem;
  color: ${theme.colors.mutedText};
`;

const GuideTitle = styled.h3`
  font-size: clamp(1.14rem, 2.4vw, 1.38rem);
  font-weight: 640;
  line-height: 1.25;
`;

const GuideExcerpt = styled.p`
  max-width: 56ch;
  font-size: 0.98rem;
  line-height: 1.72;
`;

const GuideFooter = styled.div`
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const GuideDate = styled.p`
  font-size: 0.84rem;
  color: ${theme.colors.mutedText};
`;

const GuideCta = styled.p`
  font-size: 0.86rem;
  font-weight: 700;
  color: ${theme.colors.accent};
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
