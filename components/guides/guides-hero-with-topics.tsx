"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import styled from "styled-components";

import { GuidesFilteredList } from "@/components/guides/guides-filtered-list";
import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { SurfaceCard } from "@/components/ui/primitives";
import { theme } from "@/styles/theme";

type GuidesHeroWithTopicsProps = {
  guides: Array<{
    slug: string;
    title: string;
    excerpt: string;
    category?: string;
    readingTime?: string;
    formattedDate: string;
  }>;
  categories: string[];
};

export function GuidesHeroWithTopics({ guides, categories }: GuidesHeroWithTopicsProps) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const scrollToBrowse = useCallback(() => {
    document.getElementById("browse-by-topic")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleTopicClick = useCallback(
    (category: string) => {
      setActiveTopic((prev) => (prev === category ? null : category));
      scrollToBrowse();
    },
    [scrollToBrowse]
  );

  return (
    <>
      <HeroSection>
        <Container>
          <HeroCard>
            <HeroContent>
              <PageIntro
                eyebrow="Guides"
                title="Simple guides for common 401k decisions"
                description="Learn how savings checkpoints by age, tax choices, and major life events affect your retirement plan."
              />
              <HeroImage>
                <Image
                  src="/images/guide-images/guides-hero.svg"
                  alt="401k savings growth illustration"
                  width={160}
                  height={140}
                  style={{ width: "100%", height: "auto" }}
                />
              </HeroImage>
            </HeroContent>
            <TopicOverview>
              <TopicItemButton type="button" onClick={() => handleTopicClick("401k Milestones")}>
                <TopicItemTitle>401k Milestones</TopicItemTitle>
                <TopicItemDescription>
                  Savings checkpoints by age, how to judge your progress, and what to do if you&apos;re behind.
                </TopicItemDescription>
              </TopicItemButton>
              <TopicItemButton type="button" onClick={() => handleTopicClick("Tax Strategy")}>
                <TopicItemTitle>Tax Strategy</TopicItemTitle>
                <TopicItemDescription>
                  How to think about Roth vs. Traditional contributions and when each may make more sense.
                </TopicItemDescription>
              </TopicItemButton>
              <TopicItemButton type="button" onClick={() => handleTopicClick("Life Events")}>
                <TopicItemTitle>Life Events</TopicItemTitle>
                <TopicItemDescription>
                  What to do when changing jobs, saving while self-employed, and using strategies like backdoor Roth.
                </TopicItemDescription>
              </TopicItemButton>
            </TopicOverview>
          </HeroCard>
        </Container>
      </HeroSection>

      <GuidesFilteredList
        guides={guides}
        categories={categories}
        activeTopic={activeTopic}
        onTopicChange={setActiveTopic}
      />
    </>
  );
}

const HeroSection = styled(Section)`
  padding-top: 28px;
  padding-bottom: 20px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 48px;
    padding-bottom: 24px;
  }
`;

const HeroCard = styled(SurfaceCard)`
  padding: 22px;
  display: grid;
  gap: 24px;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 58%),
    ${theme.colors.surface};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 34px;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 44px;
    gap: 28px;
  }
`;

const HeroContent = styled.div`
  display: grid;
  gap: 24px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: 2fr 1fr;
    align-items: center;
    gap: 40px;
  }
`;

const HeroImage = styled.div`
  max-width: 200px;
  margin-inline: auto;

  @media (min-width: ${theme.breakpoints.md}) {
    margin-inline: 0;
    max-width: none;
    width: 100%;
    min-width: 0;
  }
`;

const TopicOverview = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }
`;

const TopicItemButton = styled.button`
  display: grid;
  gap: 4px;
  text-align: left;
  padding: 10px 12px;
  margin: -10px -12px;
  border: none;
  border-radius: ${theme.radii.md};
  background: transparent;
  cursor: pointer;
  transition: background 160ms ease;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const TopicItemTitle = styled.h3`
  font-size: 0.92rem;
  font-weight: 640;
  color: ${theme.colors.text};
`;

const TopicItemDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.58;
  color: ${theme.colors.textSecondary};
`;
