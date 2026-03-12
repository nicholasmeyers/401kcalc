import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styled from "styled-components";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SurfaceCard } from "@/components/ui/primitives";
import {
  getRetirementBenchmarkAges,
  getRetirementBenchmarkByAge,
} from "@/lib/retirement-benchmarks/benchmarks";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

type RetirementByAgePageProps = {
  params: Promise<{ age: string }>;
};

function parseAgeParam(value: string): number | undefined {
  if (!/^\d+$/.test(value)) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : undefined;
}

function getRetirementByAgeTitle(age: number): string {
  return `How Much Should You Have Saved for Retirement by Age ${age}?`;
}

export function generateStaticParams() {
  return getRetirementBenchmarkAges().map((age) => ({ age: String(age) }));
}

export async function generateMetadata({ params }: RetirementByAgePageProps): Promise<Metadata> {
  const { age: ageParam } = await params;
  const age = parseAgeParam(ageParam);

  if (!age) {
    return {
      title: "Retirement Benchmark Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const benchmark = getRetirementBenchmarkByAge(age);

  if (!benchmark) {
    return {
      title: `Retirement Benchmark for Age ${age} Not Found`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = getRetirementByAgeTitle(age);
  const canonicalPath = `/retirement-by-age/${age}`;

  return {
    title,
    description: benchmark.metaDescription,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${title} | 401kcalc`,
      description: benchmark.metaDescription,
      url: `${siteConfig.url}${canonicalPath}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: benchmark.metaDescription,
    },
  };
}

export default async function RetirementByAgeDetailPage({ params }: RetirementByAgePageProps) {
  const { age: ageParam } = await params;
  const age = parseAgeParam(ageParam);

  if (!age) {
    notFound();
  }

  const benchmark = getRetirementBenchmarkByAge(age);

  if (!benchmark) {
    notFound();
  }

  const allAges = getRetirementBenchmarkAges();
  const otherAges = allAges.filter((candidateAge) => candidateAge !== benchmark.age);
  const pageTitle = getRetirementByAgeTitle(benchmark.age);
  const pageUrl = `${siteConfig.url}/retirement-by-age/${benchmark.age}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: benchmark.metaDescription,
    url: pageUrl,
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    about: `Retirement savings benchmark guidance for age ${benchmark.age}`,
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
        name: "Retirement By Age",
        item: `${siteConfig.url}/retirement-by-age`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Age ${benchmark.age}`,
        item: pageUrl,
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
              <BreadCrumb href="/retirement-by-age">Retirement by Age</BreadCrumb>
            </BreadCrumbRow>
            <Title>{pageTitle}</Title>
            <Summary>{benchmark.metaDescription}</Summary>
            <MetaRow>
              <MetaPill>Benchmark: {benchmark.recommendedMultiple}</MetaPill>
              <MetaPill>Illustrative projection examples</MetaPill>
            </MetaRow>
          </IntroArticle>
        </Container>
      </IntroSection>

      <BodySection>
        <Container>
          <BodyCard as="article">
            <ContentBlock>
              <Heading>Benchmark guidance</Heading>
              <Callout>{benchmark.benchmarkSummary}</Callout>
              <ParagraphWrap>
                {benchmark.benchmarkGuidance.map((paragraph, paragraphIndex) => (
                  <Copy key={`${benchmark.age}-benchmark-guidance-${paragraphIndex}`}>{paragraph}</Copy>
                ))}
              </ParagraphWrap>
            </ContentBlock>

            <ContentBlock>
              <Heading>Example retirement projections</Heading>
              <Copy>
                These scenarios are educational examples to show tradeoffs. Use your own assumptions in the calculator for personalized planning.
              </Copy>
              <ScenarioGrid>
                {benchmark.exampleScenarios.map((scenario, scenarioIndex) => (
                  <ScenarioCard key={`${benchmark.age}-${scenario.label}-${scenarioIndex}`}>
                    <ScenarioTitle>{scenario.label}</ScenarioTitle>
                    <ScenarioLine>
                      <strong>Assumptions:</strong> {scenario.assumptions}
                    </ScenarioLine>
                    <ScenarioLine>
                      <strong>Projected direction:</strong> {scenario.projectedOutcome}
                    </ScenarioLine>
                  </ScenarioCard>
                ))}
              </ScenarioGrid>
            </ContentBlock>

            <ContentBlock>
              <Heading>What influences retirement savings</Heading>
              <List>
                {benchmark.influences.map((influence, influenceIndex) => (
                  <ListItem key={`${benchmark.age}-influence-${influenceIndex}`}>{influence}</ListItem>
                ))}
              </List>
            </ContentBlock>

            <ContentBlock>
              <Heading>Contribution strategies</Heading>
              <OrderedList>
                {benchmark.strategies.map((strategy, strategyIndex) => (
                  <OrderedListItem key={`${benchmark.age}-strategy-${strategyIndex}`}>{strategy}</OrderedListItem>
                ))}
              </OrderedList>
            </ContentBlock>

            <ContentBlock>
              <Heading>Related planning links</Heading>
              <LinksGrid>
                <LinksColumn>
                  <LinksTitle>Related guides</LinksTitle>
                  <LinkList>
                    {benchmark.relatedGuides.map((guideLink) => (
                      <li key={`${benchmark.age}-${guideLink.href}`}>
                        <InlineLink href={guideLink.href}>{guideLink.label}</InlineLink>
                      </li>
                    ))}
                  </LinkList>
                </LinksColumn>

                <LinksColumn>
                  <LinksTitle>Other age benchmarks</LinksTitle>
                  <LinkList>
                    {otherAges.map((candidateAge) => (
                      <li key={`${benchmark.age}-other-age-${candidateAge}`}>
                        <InlineLink href={`/retirement-by-age/${candidateAge}`}>Retirement benchmark by age {candidateAge}</InlineLink>
                      </li>
                    ))}
                  </LinkList>
                </LinksColumn>
              </LinksGrid>
            </ContentBlock>

            <CalculatorCta>
              <Heading>Calculator CTA</Heading>
              <Copy>
                Use this age benchmark as context, then test your own salary, contribution rate, and retirement age assumptions directly.
              </Copy>
              <ButtonLink href="/401k-calculator">Run your own retirement projection {"\u2192"}</ButtonLink>
            </CalculatorCta>
          </BodyCard>
        </Container>
      </BodySection>
    </>
  );
}

const IntroSection = styled(Section)`
  padding-top: 52px;
  padding-bottom: 26px;
`;

const IntroArticle = styled.article`
  max-width: 760px;
  display: grid;
  gap: 14px;
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

const BodySection = styled(Section)`
  padding-top: 14px;
`;

const BodyCard = styled(SurfaceCard)`
  max-width: 780px;
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

const Callout = styled.p`
  border-left: 3px solid ${theme.colors.accent};
  padding-left: 12px;
  max-width: 66ch;
  font-size: 0.98rem;
  line-height: 1.72;
  color: ${theme.colors.textSecondary};
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

const ScenarioGrid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const ScenarioCard = styled(SurfaceCard)`
  height: 100%;
  padding: 18px;
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surfaceMuted};
  display: grid;
  align-content: start;
  gap: 10px;
`;

const ScenarioTitle = styled.h3`
  font-size: 1.02rem;
  font-weight: 640;
  line-height: 1.3;
`;

const ScenarioLine = styled.p`
  font-size: 0.9rem;
  line-height: 1.62;
  color: ${theme.colors.textSecondary};
`;

const List = styled.ul`
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

const OrderedList = styled.ol`
  list-style: decimal;
  padding-left: 20px;
  display: grid;
  gap: 8px;
`;

const OrderedListItem = styled.li`
  max-width: 66ch;
  font-size: 0.97rem;
  line-height: 1.68;
  color: ${theme.colors.textSecondary};
`;

const LinksGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const LinksColumn = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surface};
  padding: 16px;
  display: grid;
  gap: 10px;
`;

const LinksTitle = styled.h3`
  font-size: 1rem;
  font-weight: 640;
`;

const LinkList = styled.ul`
  display: grid;
  gap: 8px;
`;

const InlineLink = styled(Link)`
  font-size: 0.9rem;
  font-weight: 600;
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
