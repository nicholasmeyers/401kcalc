"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { HEADER_HEIGHT } from "@/components/layout/header";
import { Section } from "@/components/layout/section";
import { theme } from "@/styles/theme";

type GuideEntry = {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  readingTime?: string;
  formattedDate: string;
};

type GuidesFilteredListProps = {
  guides: GuideEntry[];
  categories: string[];
  /** Controlled: topic to highlight (e.g. from hero section click) */
  activeTopic?: string | null;
  /** Controlled: called when user changes topic via chips */
  onTopicChange?: (topic: string | null) => void;
};

export function GuidesFilteredList({ guides, categories, activeTopic: controlledTopic, onTopicChange }: GuidesFilteredListProps) {
  const [internalTopic, setInternalTopic] = useState<string | null>(null);
  const activeTopic = controlledTopic !== undefined ? controlledTopic : internalTopic;
  const setActiveTopic = onTopicChange ?? setInternalTopic;

  const sortedGuides = useMemo(() => {
    if (!activeTopic) return guides;
    const matching = guides.filter((guide) => guide.category === activeTopic);
    const rest = guides.filter((guide) => guide.category !== activeTopic);
    return [...matching, ...rest];
  }, [guides, activeTopic]);

  return (
    <>
      <TopicsSection id="browse-by-topic">
        <Container>
          <TopicsLabel>Browse by topic</TopicsLabel>
          <TopicChips aria-label="Filter guides by topic">
            {categories.map((category) => (
              <TopicChipButton
                key={category}
                type="button"
                $active={activeTopic === category}
                onClick={() => setActiveTopic(activeTopic === category ? null : category)}
              >
                {category}
              </TopicChipButton>
            ))}
          </TopicChips>
        </Container>
      </TopicsSection>

      <GuidesSection id="guides">
        <Container>
          <GuideGrid>
            {sortedGuides.map((guide) => {
              const isMatch = !activeTopic || guide.category === activeTopic;
              return (
                <GuideCard key={guide.slug} href={`/guides/${guide.slug}`} $highlighted={activeTopic !== null && isMatch} $dimmed={activeTopic !== null && !isMatch}>
                  <GuideMetaRow>
                    {guide.category ? <GuideCategory>{guide.category}</GuideCategory> : null}
                    <GuideReadTime>{guide.readingTime ?? "Guide"}</GuideReadTime>
                  </GuideMetaRow>
                  <GuideTitle>{guide.title}</GuideTitle>
                  <GuideExcerpt>{guide.excerpt}</GuideExcerpt>
                  <GuideFooter>
                    <GuideDate>{guide.formattedDate}</GuideDate>
                    <GuideCta>Read guide</GuideCta>
                  </GuideFooter>
                </GuideCard>
              );
            })}
          </GuideGrid>
        </Container>
      </GuidesSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Topics
// ---------------------------------------------------------------------------

const TopicsSection = styled(Section)`
  padding-top: 16px;
  padding-bottom: 12px;
  scroll-margin-top: ${HEADER_HEIGHT}px;
`;

const TopicsLabel = styled.h2`
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

const TopicChipButton = styled.button<{ $active: boolean }>`
  height: 34px;
  display: inline-flex;
  align-items: center;
  border-radius: ${theme.radii.pill};
  padding-inline: 14px;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease;

  border: 1px solid ${({ $active }) => ($active ? theme.colors.successBorder : theme.colors.border)};
  background: ${({ $active }) => ($active ? theme.colors.successSurface : "rgba(var(--surface-rgb), 0.72)")};
  color: ${({ $active }) => ($active ? theme.colors.successText : theme.colors.textSecondary)};

  &:hover {
    border-color: ${({ $active }) => ($active ? theme.colors.successBorder : theme.colors.borderStrong)};
  }
`;

// ---------------------------------------------------------------------------
// Guide grid
// ---------------------------------------------------------------------------

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

const GuideCard = styled(Link)<{ $highlighted: boolean; $dimmed: boolean }>`
  display: grid;
  gap: 14px;
  border-radius: ${theme.radii.lg};
  padding: 24px;
  transition: border-color 140ms ease, transform 120ms ease, background 140ms ease, opacity 140ms ease;

  border: 1px solid
    ${({ $highlighted, $dimmed }) => {
      if ($highlighted) return theme.colors.successBorder;
      if ($dimmed) return theme.colors.border;
      return theme.colors.border;
    }};
  background: ${({ $highlighted }) => ($highlighted ? theme.colors.successSurface : theme.colors.surface)};
  opacity: ${({ $dimmed }) => ($dimmed ? 0.55 : 1)};

  &:hover {
    border-color: ${({ $highlighted }) => ($highlighted ? theme.colors.successBorder : theme.colors.borderStrong)};
    transform: translateY(-1px);
    opacity: 1;
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
