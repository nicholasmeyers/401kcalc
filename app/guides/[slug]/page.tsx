import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import styled from "styled-components";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SurfaceCard } from "@/components/ui/primitives";
import { getAuthorById } from "@/lib/authors/authors";
import {
  formatGuideDate,
  getGuideBySlug,
  getGuideDateObject,
  getGuideModifiedDate,
  getGuideReviewedDate,
  getGuideSlugs,
  getRelatedGuides,
} from "@/lib/guides/guides";
import { getRetirementBenchmarkByAge } from "@/lib/retirement-benchmarks/benchmarks";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

const MILESTONE_SLUG_RE = /^how-much-should-i-have-in-my-401k-at-(\d+)$/;

const IMAGE_POSITION_MAP: Record<string, string> = {
  "top-left": "top left",
  "top-right": "top right",
  "bottom-left": "bottom left",
  "bottom-right": "bottom right",
  center: "center",
};

function getMilestoneAge(slug: string): number | undefined {
  const match = MILESTONE_SLUG_RE.exec(slug);
  if (!match) return undefined;
  const age = Number.parseInt(match[1], 10);
  return getRetirementBenchmarkByAge(age) ? age : undefined;
}

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Guide Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const author = getAuthorById(guide.authorId);
  const publishedTime = getGuideDateObject(guide.publishedAt ?? getGuideReviewedDate(guide))?.toISOString();
  const modifiedTime = getGuideDateObject(getGuideModifiedDate(guide))?.toISOString();

  const ogImages = guide.imageUrl
    ? [{ url: `${siteConfig.url}${guide.imageUrl}`, width: 1200, height: 630, alt: guide.title }]
    : undefined;

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    openGraph: {
      title: `${guide.title} | 401kcalc`,
      description: guide.description,
      url: `${siteConfig.url}/guides/${guide.slug}`,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: [author.name],
      ...(ogImages && { images: ogImages }),
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      ...(guide.imageUrl && { images: [`${siteConfig.url}${guide.imageUrl}`] }),
    },
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedGuides = getRelatedGuides(guide.slug);
  const milestoneAge = getMilestoneAge(guide.slug);
  const author = getAuthorById(guide.authorId);
  const reviewedSourceDate = getGuideReviewedDate(guide);
  const reviewedDate = formatGuideDate(reviewedSourceDate);
  const lastUpdatedDate = formatGuideDate(guide.updatedAt);
  const showLastUpdated = Boolean(guide.updatedAt && guide.updatedAt !== reviewedSourceDate);

  const guideUrl = `${siteConfig.url}/guides/${guide.slug}`;
  const publishedDateIso =
    getGuideDateObject(guide.publishedAt ?? reviewedSourceDate)?.toISOString() ??
    getGuideDateObject(getGuideModifiedDate(guide))?.toISOString();
  const modifiedDateIso = getGuideDateObject(getGuideModifiedDate(guide))?.toISOString() ?? publishedDateIso;

  const articleImageUrl = guide.imageUrl
    ? `${siteConfig.url}${guide.imageUrl}`
    : `${siteConfig.url}/guides/${guide.slug}/opengraph-image`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: guideUrl,
    image: articleImageUrl,
    author: {
      "@type": "Person",
      name: author.name,
    },
    datePublished: publishedDateIso,
    dateModified: modifiedDateIso,
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    articleSection: guide.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": guideUrl,
    },
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
        name: "Guides",
        item: `${siteConfig.url}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: guideUrl,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <IntroSection>
        <Container>
          <IntroArticle>
            <BreadCrumbRow aria-label="Breadcrumb">
              <BreadCrumb href="/">Home</BreadCrumb>
              <BreadCrumbDivider>/</BreadCrumbDivider>
              <BreadCrumb href="/guides">Guides</BreadCrumb>
            </BreadCrumbRow>
            {guide.imageUrl ? (
              <HeroImageWrapper>
                <Image
                  src={guide.imageUrl}
                  alt={guide.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 760px"
                  style={{
                    objectFit: "cover",
                    objectPosition: IMAGE_POSITION_MAP[guide.imagePosition ?? "center"] ?? "center",
                  }}
                />
              </HeroImageWrapper>
            ) : null}
            <Title>{guide.title}</Title>
            <Summary>{guide.description}</Summary>
            <MetaRow>
              {guide.category ? <MetaPill>{guide.category}</MetaPill> : null}
              {guide.readingTime ? <MetaPill>{guide.readingTime}</MetaPill> : null}
              {guide.publishedAt ? <MetaPill>{formatGuideDate(guide.publishedAt)}</MetaPill> : null}
            </MetaRow>
            <AuthorCard>
              <AuthorName>{author.name}</AuthorName>
              <AuthorTitle>{author.title}</AuthorTitle>
              <AuthorBio>{author.bio}</AuthorBio>
              {author.credentials ? <AuthorCredential>{author.credentials}</AuthorCredential> : null}
              <AuthorDates>
                {reviewedDate ? <AuthorDateLine>Reviewed / Updated: {reviewedDate}</AuthorDateLine> : null}
                {showLastUpdated && lastUpdatedDate ? <AuthorDateLine>Last updated: {lastUpdatedDate}</AuthorDateLine> : null}
              </AuthorDates>
            </AuthorCard>
          </IntroArticle>
        </Container>
      </IntroSection>

      <BodySection>
        <Container>
          <BodyCard as="article">
            {guide.content.map((section, sectionIndex) => (
              <React.Fragment key={`${guide.slug}-${section.heading}-${sectionIndex}`}>
                <ContentBlock>
                  <Heading>{section.heading}</Heading>
                  <ParagraphWrap>
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <Copy key={`${guide.slug}-${section.heading}-paragraph-${paragraphIndex}`}>{paragraph}</Copy>
                    ))}
                  </ParagraphWrap>
                  {section.bullets?.length ? (
                    <List>
                      {section.bullets.map((bullet, bulletIndex) => (
                        <ListItem key={`${guide.slug}-${section.heading}-bullet-${bulletIndex}`}>{bullet}</ListItem>
                      ))}
                    </List>
                  ) : null}
                  {section.links?.length ? (
                    <InlineLinkRow>
                      {section.links.map((sectionLink, linkIndex) => (
                        <InlineLink key={`${guide.slug}-${section.heading}-link-${linkIndex}`} href={sectionLink.href}>
                          {sectionLink.label}
                        </InlineLink>
                      ))}
                    </InlineLinkRow>
                  ) : null}
                </ContentBlock>

                {sectionIndex === 1 && milestoneAge != null && (
                  <BenchmarkCta>
                    <CtaTitle>See the age {milestoneAge} retirement benchmark</CtaTitle>
                    <CtaText>
                      Compare your savings against common age-{milestoneAge} milestones, model catch-up strategies, and build a personalized plan with the
                      retirement benchmark planner.
                    </CtaText>
                    <ButtonLink href={`/retirement-by-age/${milestoneAge}`}>Open Age {milestoneAge} Benchmark Planner</ButtonLink>
                  </BenchmarkCta>
                )}
              </React.Fragment>
            ))}

            <CalculatorCta>
              <CtaTitle>Run the numbers on your own plan</CtaTitle>
              <CtaText>
                Open the calculator and test the exact assumptions from this guide. A small change in contribution rate or retirement age can have a meaningful
                long-term impact.
              </CtaText>
              <ButtonLink href="/401k-calculator">Open 401(k) Calculator</ButtonLink>
            </CalculatorCta>
          </BodyCard>
        </Container>
      </BodySection>

      {relatedGuides.length ? (
        <RelatedSection>
          <Container>
            <RelatedCard>
              <RelatedTitle>Related guides</RelatedTitle>
              <RelatedGrid>
                {relatedGuides.map((relatedGuide) => (
                  <RelatedGuideLink key={relatedGuide.slug} href={`/guides/${relatedGuide.slug}`}>
                    {relatedGuide.category ? <RelatedCategory>{relatedGuide.category}</RelatedCategory> : null}
                    <RelatedGuideTitle>{relatedGuide.title}</RelatedGuideTitle>
                    <RelatedExcerpt>{relatedGuide.excerpt}</RelatedExcerpt>
                  </RelatedGuideLink>
                ))}
              </RelatedGrid>
            </RelatedCard>
          </Container>
        </RelatedSection>
      ) : null}
    </>
  );
}

const IntroSection = styled(Section)`
  padding-top: 24px;
  padding-bottom: 20px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 48px;
    padding-bottom: 26px;
  }
`;

const IntroArticle = styled.article`
  max-width: 760px;
  margin-inline: auto;
  display: grid;
  gap: 14px;
`;

const HeroImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  max-height: 400px;
  margin-bottom: 4px;
  border-radius: ${theme.radii.lg};
  overflow: hidden;
  border: 1px solid ${theme.colors.border};

  @media (min-width: ${theme.breakpoints.lg}) {
    height: 500px;
    max-height: 500px;
  }
`;

const BreadCrumbRow = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BreadCrumb = styled(Link)`
  width: fit-content;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.colors.mutedText};
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.text};
  }
`;

const BreadCrumbDivider = styled.span`
  font-size: 0.76rem;
  color: ${theme.colors.mutedText};
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4.4vw, 2.8rem);
  font-weight: 650;
  line-height: 1.12;
  text-wrap: balance;
`;

const Summary = styled.p`
  max-width: 64ch;
  font-size: clamp(1rem, 2vw, 1.14rem);
  line-height: 1.66;
  color: ${theme.colors.mutedTextStrong};
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const MetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding-inline: 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.pill};
  background: rgba(255, 255, 255, 0.72);
  font-size: 0.82rem;
  font-weight: 600;
  color: ${theme.colors.mutedTextStrong};
`;

const AuthorCard = styled(SurfaceCard)`
  margin-top: 4px;
  padding: 16px 18px;
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surfaceMuted};
  display: grid;
  gap: 6px;
`;

const AuthorName = styled.p`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${theme.colors.text};
`;

const AuthorTitle = styled.p`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
`;

const AuthorBio = styled.p`
  margin-top: 2px;
  font-size: 0.86rem;
  line-height: 1.55;
  color: ${theme.colors.textSecondary};
`;

const AuthorCredential = styled.p`
  font-size: 0.81rem;
  line-height: 1.52;
  color: ${theme.colors.mutedTextStrong};
`;

const AuthorDates = styled.div`
  margin-top: 2px;
  display: grid;
  gap: 3px;
`;

const AuthorDateLine = styled.p`
  font-size: 0.78rem;
  color: ${theme.colors.mutedText};
`;

const BodySection = styled(Section)`
  padding-top: 14px;
`;

const BodyCard = styled(SurfaceCard)`
  max-width: 780px;
  margin-inline: auto;
  padding: 30px;
  display: grid;
  gap: 34px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 38px 42px;
    gap: 38px;
  }
`;

const ContentBlock = styled.section`
  display: grid;
  gap: 14px;
`;

const Heading = styled.h2`
  font-size: clamp(1.35rem, 3vw, 1.72rem);
  font-weight: 640;
  line-height: 1.24;
`;

const ParagraphWrap = styled.div`
  display: grid;
  gap: 12px;
`;

const Copy = styled.p`
  max-width: 66ch;
  font-size: 1rem;
  line-height: 1.76;
`;

const List = styled.ul`
  margin-top: 2px;
  list-style: disc;
  padding-left: 20px;
  display: grid;
  gap: 8px;
`;

const ListItem = styled.li`
  max-width: 66ch;
  font-size: 0.97rem;
  line-height: 1.68;
  color: ${theme.colors.textSecondary};
`;

const InlineLinkRow = styled.div`
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const InlineLink = styled(Link)`
  font-size: 0.92rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;

const CalculatorCta = styled(SurfaceCard)`
  padding: 24px;
  border-radius: ${theme.radii.md};
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 58%),
    ${theme.colors.surfaceMuted};
  display: grid;
  gap: 12px;
`;

const BenchmarkCta = styled(SurfaceCard)`
  padding: 24px;
  border-radius: ${theme.radii.md};
  background:
    radial-gradient(circle at top right, rgba(22, 163, 74, 0.08), transparent 58%),
    ${theme.colors.surfaceMuted};
  display: grid;
  gap: 12px;
`;

const CtaTitle = styled.h2`
  font-size: clamp(1.3rem, 2.8vw, 1.6rem);
  font-weight: 640;
`;

const CtaText = styled.p`
  max-width: 60ch;
  font-size: 0.98rem;
  line-height: 1.72;
`;

const RelatedSection = styled(Section)`
  padding-top: 14px;
`;

const RelatedCard = styled(SurfaceCard)`
  padding: 28px;
  display: grid;
  gap: 20px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 34px;
  }
`;

const RelatedTitle = styled.h2`
  font-size: clamp(1.3rem, 2.8vw, 1.72rem);
  font-weight: 640;
`;

const RelatedGrid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const RelatedGuideLink = styled(Link)`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surface};
  padding: 18px;
  display: grid;
  gap: 10px;
  transition: border-color 120ms ease;

  &:hover {
    border-color: ${theme.colors.borderStrong};
  }
`;

const RelatedCategory = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  color: ${theme.colors.mutedText};
  text-transform: uppercase;
  letter-spacing: 0.11em;
`;

const RelatedGuideTitle = styled.h3`
  font-size: 1.06rem;
  font-weight: 630;
  line-height: 1.32;
`;

const RelatedExcerpt = styled.p`
  font-size: 0.9rem;
  line-height: 1.62;
`;
