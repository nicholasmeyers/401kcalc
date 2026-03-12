import type { Metadata } from "next";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { SurfaceCard } from "@/components/ui/primitives";
import { siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

export const metadata: Metadata = {
  title: "About 401kcalc",
  description: "Learn the philosophy behind 401kcalc and how we approach retirement planning clarity.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About 401kcalc",
    description: "Learn the principles and trust commitments behind 401kcalc retirement planning tools.",
    url: `${siteConfig.url}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About 401kcalc",
    description: "Learn the principles and trust commitments behind 401kcalc.",
  },
};

const principles = [
  {
    title: "Clarity over complexity",
    body: "Retirement planning tools should explain assumptions directly so decisions can be reviewed and trusted.",
  },
  {
    title: "Practical realism",
    body: "Models should reflect how people actually save over time: changing salaries, contribution rates, and employer benefits.",
  },
  {
    title: "Trust through transparency",
    body: "Methodology and limitations should be visible, with no hidden logic that obscures tradeoffs.",
  },
];

export default function AboutPage() {
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About 401kcalc",
    url: `${siteConfig.url}/about`,
    description: "Learn the philosophy behind 401kcalc and how we approach retirement planning clarity.",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />

      <IntroSection>
        <Container>
          <PageIntro
            eyebrow="About"
            title="Designed to make retirement planning clearer."
            description="401kcalc is built around one principle: better retirement decisions come from transparent assumptions, focused analysis, and calm user experience."
          />
        </Container>
      </IntroSection>

      <ContentSection>
        <Container>
          <Panel>
            <PanelTitle>How we approach methodology</PanelTitle>
            <PanelCopy>
              We prioritize conservative defaults, understandable calculations, and clear communication of uncertainty. This foundation is meant for planning,
              scenario comparison, and better conversations, not certainty theater.
            </PanelCopy>
            <PrinciplesGrid>
              {principles.map((item) => (
                <PrincipleCard key={item.title}>
                  <PrincipleTitle>{item.title}</PrincipleTitle>
                  <PrincipleCopy>{item.body}</PrincipleCopy>
                </PrincipleCard>
              ))}
            </PrinciplesGrid>
          </Panel>
        </Container>
      </ContentSection>
    </>
  );
}

const IntroSection = styled(Section)`
  padding-top: 52px;
  padding-bottom: 34px;
`;

const ContentSection = styled(Section)`
  padding-top: 16px;
`;

const Panel = styled(SurfaceCard)`
  padding: 32px;
`;

const PanelTitle = styled.h2`
  font-size: 1.7rem;
  font-weight: 640;
  color: ${theme.colors.text};
`;

const PanelCopy = styled.p`
  margin-top: 16px;
  max-width: 760px;
  font-size: 1rem;
  line-height: 1.72;
`;

const PrinciplesGrid = styled.div`
  margin-top: 32px;
  display: grid;
  gap: 20px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const PrincipleCard = styled.article`
  border: 1px solid ${theme.colors.border};
  border-radius: 16px;
  background: ${theme.colors.surfaceMuted};
  padding: 20px;
  display: grid;
  gap: 10px;
`;

const PrincipleTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 630;
  color: ${theme.colors.text};
`;

const PrincipleCopy = styled.p`
  font-size: 0.94rem;
  line-height: 1.66;
`;
