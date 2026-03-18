"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import styled, { css } from "styled-components";

import { ButtonLink } from "@/components/ui/button-link";
import {
  DEFAULT_RETIREMENT_AGE_SELECTOR_AGE,
  MAX_RETIREMENT_AGE_SELECTOR_AGE,
  MIN_RETIREMENT_AGE_SELECTOR_AGE,
  RETIREMENT_AGE_SELECTOR_AGES,
  getRetirementAgeSelection,
  snapRetirementAgeSelectorAge,
} from "@/lib/retirement-benchmarks/age-selector";
import { theme } from "@/styles/theme";

type RetirementAgeBenchmarkSelectorProps = {
  selectedAge?: number;
  defaultAge?: number;
  onAgeChange?: (age: number) => void;
  headingAs?: "h1" | "h2";
  layout?: "compact" | "full";
  styleVariant?: "default" | "planner";
  showVisualHeader?: boolean;
  description?: string;
  showCalculatorLink?: boolean;
  calculatorHref?: string;
  secondaryCtaMode?: "guideOrCalculator" | "calculator";
};

export function RetirementAgeBenchmarkSelector({
  selectedAge: selectedAgeProp,
  defaultAge = DEFAULT_RETIREMENT_AGE_SELECTOR_AGE,
  onAgeChange,
  headingAs = "h2",
  layout = "compact",
  styleVariant = "default",
  showVisualHeader,
  description = "See common 401(k) savings benchmarks by age, then jump into the full calculator or age-specific guide.",
  showCalculatorLink = false,
  calculatorHref = "/401k-calculator",
  secondaryCtaMode = "guideOrCalculator",
}: RetirementAgeBenchmarkSelectorProps) {
  const isControlled = selectedAgeProp !== undefined;
  const [internalAge, setInternalAge] = useState(snapRetirementAgeSelectorAge(defaultAge));
  const selectedAge = isControlled
    ? snapRetirementAgeSelectorAge(selectedAgeProp)
    : internalAge;
  const selection = useMemo(() => getRetirementAgeSelection(selectedAge), [selectedAge]);
  const sliderId = useId();
  const progress = ((selection.selectedAge - MIN_RETIREMENT_AGE_SELECTOR_AGE) /
    (MAX_RETIREMENT_AGE_SELECTOR_AGE - MIN_RETIREMENT_AGE_SELECTOR_AGE)) * 100;
  const shouldShowVisualHeader = showVisualHeader ?? layout !== "compact";
  const secondaryHref =
    secondaryCtaMode === "calculator" ? calculatorHref : selection.guideHref ?? calculatorHref;
  const secondaryLabel =
    secondaryCtaMode === "calculator"
      ? "Open full calculator"
      : selection.guideHref
        ? `Read guide for age ${selection.selectedAge}`
        : "Open full calculator";

  function handleAgeUpdate(nextAge: number) {
    const snappedAge = snapRetirementAgeSelectorAge(nextAge);

    if (!isControlled) {
      setInternalAge(snappedAge);
    }

    onAgeChange?.(snappedAge);
  }

  return (
    <Card $layout={layout} $styleVariant={styleVariant}>
      <ContentColumn>
        <TextStack>
          <Eyebrow>Retirement by age</Eyebrow>
          <Heading as={headingAs} $layout={layout}>
            How much should you have in your 401(k) at {selection.selectedAge}?
          </Heading>
          <Description>{description}</Description>
        </TextStack>

        <ControlPanel>
          <ControlHeader>
            <ControlLabel htmlFor={sliderId}>Choose your age</ControlLabel>
            <AgeBadge aria-live="polite">{selection.selectedAge}</AgeBadge>
          </ControlHeader>

          <Slider
            id={sliderId}
            type="range"
            min={MIN_RETIREMENT_AGE_SELECTOR_AGE}
            max={MAX_RETIREMENT_AGE_SELECTOR_AGE}
            step={5}
            value={selection.selectedAge}
            onChange={(event) => handleAgeUpdate(Number(event.target.value))}
            aria-label="Choose your age benchmark"
            aria-valuetext={`Age ${selection.selectedAge}`}
            $progress={progress}
          />

          <TickRow aria-hidden="true">
            {RETIREMENT_AGE_SELECTOR_AGES.map((age) => (
              <TickLabel key={age} $isActive={age === selection.selectedAge}>
                {age}
              </TickLabel>
            ))}
          </TickRow>
        </ControlPanel>

        <SummaryBlock aria-live="polite">
          <PrimarySummary>
            Typical benchmark at age {selection.selectedAge}:{" "}
            <SummaryValue>{selection.currentMilestone.benchmarkLabel}</SummaryValue>
          </PrimarySummary>
          <SecondarySummary>
            {selection.nextMilestone
              ? `Next checkpoint: age ${selection.nextMilestone.age} (${selection.nextMilestone.benchmarkLabel})`
              : `Final checkpoint reached: age ${selection.finalMilestone.age} (${selection.finalMilestone.benchmarkLabel})`}
          </SecondarySummary>
        </SummaryBlock>

        <ActionRow>
          <ButtonLink href={selection.currentMilestone.benchmarkHref}>
            See age {selection.selectedAge} benchmark
          </ButtonLink>
          <ButtonLink href={secondaryHref} variant="secondary">
            {secondaryLabel}
          </ButtonLink>
        </ActionRow>

        {showCalculatorLink && selection.guideHref ? (
          <CalculatorLink href={calculatorHref}>Open full calculator &rarr;</CalculatorLink>
        ) : null}
      </ContentColumn>

      <VisualColumn>
        <VisualCard $layout={layout} $styleVariant={styleVariant}>
          {shouldShowVisualHeader ? (
            <VisualHeader>
              <VisualEyebrow>Milestone view</VisualEyebrow>
              <VisualCaption>Selected age stays centered in the benchmark story.</VisualCaption>
            </VisualHeader>
          ) : null}

          <BarGrid role="img" aria-label={`Benchmark milestone chart for age ${selection.selectedAge}`}>
            {selection.chartMilestones.map((milestone) => {
              const height = getBarHeight(milestone.chartMultiple);
              const isSelected = milestone.age === selection.selectedAge;
              const isFuture = milestone.age > selection.selectedAge;
              const isFinal = milestone.age === selection.finalMilestone.age;

              return (
                <BarColumn key={milestone.age}>
                  <BarValueLabel $isSelected={isSelected}>
                    {milestone.benchmarkLabel}
                  </BarValueLabel>
                  <BarTrack>
                    <Bar
                      style={{ height: `${height}px` }}
                      $isSelected={isSelected}
                      $isFuture={isFuture}
                      $isFinal={isFinal}
                    />
                  </BarTrack>
                  <BarAgeLabel $isSelected={isSelected}>
                    Age {milestone.age}
                  </BarAgeLabel>
                </BarColumn>
              );
            })}
          </BarGrid>
        </VisualCard>
      </VisualColumn>
    </Card>
  );
}

const BAR_MIN_HEIGHT = 54;
const BAR_MAX_HEIGHT = 176;
const MAX_CHART_MULTIPLE = 12;

function getBarHeight(chartMultiple: number): number {
  const normalized = Math.max(0, Math.min(1, chartMultiple / MAX_CHART_MULTIPLE));
  return Math.round(BAR_MIN_HEIGHT + (BAR_MAX_HEIGHT - BAR_MIN_HEIGHT) * Math.sqrt(normalized));
}

const Card = styled.div<{ $layout: "compact" | "full"; $styleVariant: "default" | "planner" }>`
  display: grid;
  gap: 24px;
  padding: ${({ $styleVariant }) => ($styleVariant === "planner" ? "22px" : "24px")};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  background:
    radial-gradient(
      circle at top right,
      ${({ $styleVariant }) =>
          $styleVariant === "planner" ? "rgba(22, 163, 74, 0.06)" : "rgba(37, 99, 235, 0.08)"}
        ,
      transparent 44%
    ),
    linear-gradient(
      180deg,
      ${({ $styleVariant }) =>
          $styleVariant === "planner" ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.98)"}
        ,
      ${({ $styleVariant }) =>
          $styleVariant === "planner" ? "rgba(250, 252, 255, 0.96)" : "rgba(248, 250, 252, 0.94)"}
    ),
    ${theme.colors.surface};

  @media (min-width: ${theme.breakpoints.md}) {
    padding: ${({ $layout, $styleVariant }) =>
      $layout === "full"
        ? $styleVariant === "planner"
          ? "38px 42px"
          : "36px"
        : "30px"};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: ${({ $layout, $styleVariant }) =>
      $layout === "full"
        ? $styleVariant === "planner"
          ? "minmax(0, 1fr) 340px"
          : "minmax(0, 1.2fr) minmax(300px, 360px)"
        : "minmax(0, 1.1fr) minmax(280px, 330px)"};
    align-items: start;
    gap: ${({ $layout, $styleVariant }) =>
      $layout === "full"
        ? $styleVariant === "planner"
          ? "40px"
          : "34px"
        : "28px"};
  }
`;

const ContentColumn = styled.div`
  display: grid;
  gap: 24px;
  min-width: 0;
`;

const TextStack = styled.div`
  display: grid;
  gap: 12px;
`;

const Eyebrow = styled.p`
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  color: ${theme.colors.mutedText};
  text-transform: uppercase;
  letter-spacing: 0.16em;
`;

const Heading = styled.h2<{ $layout: "compact" | "full" }>`
  margin: 0;
  font-size: ${({ $layout }) =>
    $layout === "full"
      ? "clamp(1.9rem, 4vw, 2.7rem)"
      : "clamp(1.55rem, 3vw, 2.15rem)"};
  font-weight: 650;
  line-height: 1.08;
  text-wrap: balance;
`;

const Description = styled.p`
  margin: 0;
  max-width: 60ch;
  font-size: 0.98rem;
  line-height: 1.68;
  color: ${theme.colors.mutedTextStrong};
`;

const ControlPanel = styled.div`
  display: grid;
  gap: 14px;
`;

const ControlHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const ControlLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${theme.colors.text};
`;

const AgeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 58px;
  min-height: 40px;
  padding-inline: 14px;
  border-radius: ${theme.radii.pill};
  border: 1px solid ${theme.colors.borderStrong};
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  font-size: 1.05rem;
  font-weight: 700;
  color: ${theme.colors.chartImproved};
`;

const Slider = styled.input<{ $progress: number }>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    ${theme.colors.accent} 0%,
    ${theme.colors.accent} ${({ $progress }) => $progress}%,
    ${theme.colors.border} ${({ $progress }) => $progress}%,
    ${theme.colors.border} 100%
  );
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 3px solid ${theme.colors.surface};
    background: ${theme.colors.chartImproved};
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.18);
    transition: transform 120ms ease;
  }

  &::-webkit-slider-thumb:active {
    transform: scale(1.06);
  }

  &::-moz-range-track {
    height: 8px;
    border-radius: 999px;
    background: ${theme.colors.border};
  }

  &::-moz-range-progress {
    height: 8px;
    border-radius: 999px;
    background: ${theme.colors.accent};
  }

  &::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 3px solid ${theme.colors.surface};
    background: ${theme.colors.chartImproved};
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.18);
  }
`;

const TickRow = styled.div`
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 4px;
`;

const TickLabel = styled.span<{ $isActive: boolean }>`
  justify-self: center;
  font-size: 0.73rem;
  line-height: 1;
  color: ${({ $isActive }) => ($isActive ? theme.colors.text : theme.colors.mutedText)};
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 500)};
  transition: color 120ms ease;
`;

const SummaryBlock = styled.div`
  display: grid;
  gap: 6px;
`;

const PrimarySummary = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.55;
  color: ${theme.colors.text};
`;

const SummaryValue = styled.strong`
  color: ${theme.colors.chartImproved};
`;

const SecondarySummary = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: ${theme.colors.mutedTextStrong};
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const CalculatorLink = styled(Link)`
  width: fit-content;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;

const VisualColumn = styled.div`
  min-width: 0;
`;

const VisualCard = styled.div<{ $layout: "compact" | "full"; $styleVariant: "default" | "planner" }>`
  display: grid;
  gap: 18px;
  padding: ${({ $layout }) => ($layout === "compact" ? "14px 14px 12px" : "18px")};
  border: 1px solid
    ${({ $styleVariant }) =>
      $styleVariant === "planner" ? theme.colors.border : theme.colors.elevatedBorder};
  border-radius: ${theme.radii.md};
  background:
    radial-gradient(
      circle at top right,
      ${({ $styleVariant }) =>
          $styleVariant === "planner" ? "rgba(37, 99, 235, 0.06)" : "rgba(22, 163, 74, 0.08)"}
        ,
      transparent 46%
    ),
    ${({ $styleVariant }) => ($styleVariant === "planner" ? theme.colors.surfaceMuted : "rgba(255, 255, 255, 0.9)")};
  min-height: ${({ $layout, $styleVariant }) =>
    $layout === "compact" ? "220px" : $styleVariant === "planner" ? "265px" : "100%"};
`;

const VisualHeader = styled.div`
  display: grid;
  gap: 6px;
`;

const VisualEyebrow = styled.span`
  font-size: 0.74rem;
  font-weight: 700;
  color: ${theme.colors.mutedText};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

const VisualCaption = styled.p`
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.55;
  color: ${theme.colors.mutedTextStrong};
`;

const BarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  align-items: end;

  @media (max-width: calc(${theme.breakpoints.sm} - 1px)) {
    gap: 10px;
  }
`;

const BarColumn = styled.div`
  display: grid;
  gap: 10px;
  align-items: end;
  justify-items: center;
`;

const sharedBarLabelStyles = css<{ $isSelected: boolean }>`
  text-align: center;
  transition: color 140ms ease, transform 140ms ease;
  color: ${({ $isSelected }) => ($isSelected ? theme.colors.text : theme.colors.mutedTextStrong)};
`;

const BarValueLabel = styled.span<{ $isSelected: boolean }>`
  ${sharedBarLabelStyles};
  min-height: 36px;
  font-size: ${({ $isSelected }) => ($isSelected ? "0.8rem" : "0.74rem")};
  font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 600)};
  line-height: 1.35;
`;

const BarTrack = styled.div`
  width: 100%;
  min-height: ${BAR_MAX_HEIGHT}px;
  display: flex;
  align-items: end;
`;

const Bar = styled.div<{ $isSelected: boolean; $isFuture: boolean; $isFinal: boolean }>`
  width: 100%;
  min-height: 18px;
  border-radius: 14px 14px 6px 6px;
  transition:
    height 220ms ease,
    transform 220ms ease,
    background 220ms ease,
    opacity 220ms ease;
  background: ${({ $isSelected, $isFuture, $isFinal }) =>
    $isSelected
      ? theme.colors.chartImproved
      : $isFinal
        ? theme.colors.accent
        : $isFuture
          ? "rgba(148, 163, 184, 0.35)"
          : "rgba(37, 99, 235, 0.22)"};
  opacity: ${({ $isSelected, $isFuture }) => ($isSelected ? 1 : $isFuture ? 0.8 : 0.9)};
  transform: ${({ $isSelected }) => ($isSelected ? "scaleY(1.02)" : "none")};
  box-shadow: ${({ $isSelected }) =>
    $isSelected ? "0 16px 32px rgba(22, 163, 74, 0.18)" : "inset 0 0 0 1px rgba(15, 23, 42, 0.04)"};
`;

const BarAgeLabel = styled.span<{ $isSelected: boolean }>`
  ${sharedBarLabelStyles};
  font-size: 0.78rem;
  font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 600)};
`;
