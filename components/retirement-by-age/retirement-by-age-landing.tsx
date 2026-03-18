"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import styled from "styled-components";

import { BenchmarkPlanner } from "@/components/retirement-by-age/benchmark-planner";
import { theme } from "@/styles/theme";

type Milestone = { age: number; multiple: number };

const MILESTONES: Milestone[] = [
  { age: 30, multiple: 1 },
  { age: 35, multiple: 2 },
  { age: 40, multiple: 3 },
  { age: 45, multiple: 4 },
  { age: 50, multiple: 6 },
  { age: 55, multiple: 7 },
  { age: 60, multiple: 8 },
  { age: 65, multiple: 10 },
  { age: 70, multiple: 12 },
];

const BAR_MIN_PX = 0;
const BAR_MAX_PX = 168;
const MAX_MULTIPLE = 12;
const MIN_AGE = 25;
const MAX_AGE = 70;
const DEFAULT_AGE = 35;

function barHeight(multiple: number): number {
  const t = multiple / MAX_MULTIPLE;
  return Math.round(BAR_MIN_PX + (BAR_MAX_PX - BAR_MIN_PX) * Math.sqrt(t));
}

type HeroBar = {
  milestone: Milestone;
  isPast: boolean;
  isActive: boolean;
  isReference: boolean;
};

const CONTEXT_MILESTONES = MILESTONES.slice(0, -1);
const REFERENCE_MILESTONE = MILESTONES[MILESTONES.length - 1];

function getFourBars(age: number): HeroBar[] {
  let actualCurrentAge = MILESTONES[0].age;
  for (const m of MILESTONES) {
    if (m.age <= age) actualCurrentAge = m.age;
  }

  let currentIdx = -1;
  for (let i = CONTEXT_MILESTONES.length - 1; i >= 0; i--) {
    if (CONTEXT_MILESTONES[i].age <= age) {
      currentIdx = i;
      break;
    }
  }

  let startIdx: number;
  if (currentIdx <= 0) {
    startIdx = 0;
  } else if (currentIdx >= CONTEXT_MILESTONES.length - 1) {
    startIdx = CONTEXT_MILESTONES.length - 3;
  } else {
    startIdx = currentIdx - 1;
  }
  startIdx = Math.max(0, Math.min(startIdx, CONTEXT_MILESTONES.length - 3));

  const bars: HeroBar[] = [0, 1, 2].map((offset) => {
    const m = CONTEXT_MILESTONES[startIdx + offset];
    return {
      milestone: m,
      isPast: m.age <= age,
      isActive: m.age === actualCurrentAge,
      isReference: false,
    };
  });

  bars.push({
    milestone: REFERENCE_MILESTONE,
    isPast: REFERENCE_MILESTONE.age <= age,
    isActive: REFERENCE_MILESTONE.age === actualCurrentAge,
    isReference: true,
  });

  return bars;
}

function getCurrentMilestone(age: number): Milestone {
  let current = MILESTONES[0];
  for (const m of MILESTONES) {
    if (m.age <= age) current = m;
  }
  return current;
}

function getNextMilestone(age: number): Milestone | null {
  return MILESTONES.find((m) => m.age > age) ?? null;
}

type RetirementByAgeLandingProps = {
  initialAge?: number;
};

export function RetirementByAgeLanding({ initialAge }: RetirementByAgeLandingProps) {
  const [selectedAge, setSelectedAge] = useState(initialAge ?? DEFAULT_AGE);
  const deferredAge = useDeferredValue(selectedAge);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAge(Number(e.target.value));
  }, []);

  const handleAgeInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") return;
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isNaN(parsed)) {
      setSelectedAge(Math.min(MAX_AGE, Math.max(MIN_AGE, parsed)));
    }
  }, []);

  const handleAgeChange = useCallback((age: number) => {
    setSelectedAge(age);
  }, []);

  const current = useMemo(() => getCurrentMilestone(selectedAge), [selectedAge]);
  const next = useMemo(() => getNextMilestone(selectedAge), [selectedAge]);
  const bars = useMemo(() => getFourBars(selectedAge), [selectedAge]);

  return (
    <Wrapper>
      <HeroCard>
        <HeroColumns>
          <HeroLeft>
            <Eyebrow>Retirement by age</Eyebrow>
            <Title>How much should you have in your 401k at {selectedAge}?</Title>
            <Subtitle>
              Viewing age <strong>{selectedAge}</strong> benchmarks. <br />Explore other ages or compare your savings below.
            </Subtitle>

            <SliderSection>
              <SliderLabel>
                Your age{" "}
                <AgeInput
                  type="number"
                  min={MIN_AGE}
                  max={MAX_AGE}
                  value={selectedAge}
                  onChange={handleAgeInputChange}
                  aria-label="Your age"
                />
              </SliderLabel>
              <Slider
                type="range"
                min={MIN_AGE}
                max={MAX_AGE}
                step={1}
                value={selectedAge}
                onChange={handleSliderChange}
                aria-label="Select your age"
              />
              <SliderRangeSpacer aria-hidden="true" />
              <SliderRange>
                <span>{MIN_AGE}</span>
                <span>{MAX_AGE}</span>
              </SliderRange>
            </SliderSection>

            <DynamicText>
              <BenchmarkLine>
                Typical benchmark at age {current.age}:{" "}
                <BenchmarkValue>{current.multiple}&times; salary</BenchmarkValue>
              </BenchmarkLine>
              {next && (
                <NextLine>
                  Next checkpoint: age {next.age} ({next.multiple}&times; salary)
                </NextLine>
              )}
            </DynamicText>
          </HeroLeft>

          <HeroRight>
            <BarGroup>
              {bars.map((bar, index) => {
                const height = barHeight(bar.milestone.multiple);
                const delayMs = index * 40;
                return (
                  <BarSlot key={`bar-${index}-${bar.milestone.age}`}>
                    {bar.isReference && <BarDivider />}
                    <BarColumn $isActive={bar.isActive}>
                      <BarTopLabel $isPast={bar.isPast} $isActive={bar.isActive}>
                        {bar.milestone.multiple}&times;
                      </BarTopLabel>
                      <BarTrack>
                        <Bar
                          style={{
                            height: `${height}px`,
                            transitionDelay: `${delayMs}ms`,
                          }}
                          $isPast={bar.isPast}
                          $isActive={bar.isActive}
                        />
                      </BarTrack>
                      <BarBottomLabel $isPast={bar.isPast} $isActive={bar.isActive}>
                        Age {bar.milestone.age}
                      </BarBottomLabel>
                    </BarColumn>
                  </BarSlot>
                );
              })}
            </BarGroup>
          </HeroRight>
        </HeroColumns>
      </HeroCard>

      <BenchmarkPlanner initialAge={deferredAge} onAgeChange={handleAgeChange} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  gap: 32px;
`;

const HeroCard = styled.div`
  padding: 22px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  background:
    radial-gradient(circle at top right, rgba(22, 163, 74, 0.05), transparent 58%),
    ${theme.colors.surface};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 30px;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 38px 42px;
  }
`;

const HeroColumns = styled.div`
  display: grid;
  gap: 32px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr 280px;
    align-items: center;
    gap: 40px;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr 340px;
  }
`;

const HeroLeft = styled.div`
  display: grid;
  gap: 18px;
  align-content: start;
  align-self: start;
`;

const HeroRight = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 24px 16px 20px;
  height: 265px;
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  align-self: center;
`;

const Eyebrow = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  color: ${theme.colors.mutedText};
  text-transform: uppercase;
  letter-spacing: 0.16em;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 650;
  line-height: 1.12;
  text-wrap: balance;
`;

const Subtitle = styled.p`
  max-width: 52ch;
  font-size: clamp(0.95rem, 1.8vw, 1.06rem);
  line-height: 1.66;
  color: ${theme.colors.mutedTextStrong};
`;

const SliderSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0px 10px;
  max-width: 420px;
  align-items: center;
`;

const SliderLabel = styled.label`
  font-size: 1.15rem;
  font-weight: 600;
  color: ${theme.colors.text};
`;

const SliderRangeSpacer = styled.div`
  min-width: 0;
`;

const AgeInput = styled.input`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${theme.colors.chartImproved};
  margin-left: 4px;
  width: 3ch;
  text-align: center;
  background: transparent;
  border: 2px solid ${theme.colors.border};
  border-radius: 6px;
  padding: 4px 2px;
  outline: none;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    border-color: ${theme.colors.border};
    border-bottom-color: ${theme.colors.chartImproved};
  }
`;

const Slider = styled.input`
  min-width: 0;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: ${theme.colors.border};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${theme.colors.chartImproved};
    border: 3px solid ${theme.colors.surface};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
    cursor: grab;
    transition: transform 100ms ease;
  }

  &::-webkit-slider-thumb:active {
    cursor: grabbing;
    transform: scale(1.12);
  }

  &::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${theme.colors.chartImproved};
    border: 3px solid ${theme.colors.surface};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
    cursor: grab;
  }

  &::-moz-range-thumb:active {
    cursor: grabbing;
  }
`;

const SliderRange = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.74rem;
  color: ${theme.colors.mutedText};
`;

const DynamicText = styled.div`
  display: grid;
  gap: 4px;
`;

const BenchmarkLine = styled.p`
  font-size: 0.95rem;
  color: ${theme.colors.text};
  line-height: 1.5;
`;

const BenchmarkValue = styled.strong`
  color: ${theme.colors.chartImproved};
  font-weight: 700;
`;

const NextLine = styled.p`
  font-size: 0.86rem;
  color: ${theme.colors.mutedTextStrong};
  line-height: 1.5;
`;

const PAST_GREEN = theme.colors.chartImproved;
const ACTIVE_GREEN = "#22C55E";
const FUTURE_GREEN = "#BBF7D0";

const BarGroup = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
  width: 100%;
`;

const BarSlot = styled.div`
  display: flex;
  align-items: flex-end;
`;

const BarDivider = styled.div`
  width: 1px;
  height: 60%;
  align-self: center;
  background: ${theme.colors.border};
  margin: 0 6px;
  flex-shrink: 0;
`;

const BarColumn = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: ${({ $isActive }) => ($isActive ? "60px" : "50px")};
  transition: width 250ms ease;
`;

const BarTrack = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const Bar = styled.div<{ $isPast: boolean; $isActive: boolean }>`
  width: 100%;
  min-height: 10px;
  border-radius: 6px 6px 2px 2px;
  transition:
    height 250ms ease-out,
    opacity 200ms ease,
    background 200ms ease;
  background: ${({ $isActive, $isPast }) =>
    $isActive ? ACTIVE_GREEN : $isPast ? PAST_GREEN : FUTURE_GREEN};
  opacity: ${({ $isActive, $isPast }) => ($isActive ? 1 : $isPast ? 0.7 : 0.5)};
  ${({ $isActive }) => $isActive && `box-shadow: 0 2px 8px rgba(22, 163, 74, 0.25);`}
`;

const BarTopLabel = styled.span<{ $isPast: boolean; $isActive: boolean }>`
  font-size: ${({ $isActive }) => ($isActive ? "0.82rem" : "0.74rem")};
  font-weight: 700;
  white-space: nowrap;
  transition: color 200ms ease, font-size 200ms ease;
  color: ${({ $isActive, $isPast }) =>
    $isActive
      ? theme.colors.chartImproved
      : $isPast
        ? theme.colors.mutedTextStrong
        : theme.colors.mutedText};
`;

const BarBottomLabel = styled.span<{ $isPast: boolean; $isActive: boolean }>`
  font-size: 0.72rem;
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 500)};
  white-space: nowrap;
  transition: color 200ms ease;
  color: ${({ $isActive, $isPast }) =>
    $isActive
      ? theme.colors.chartImproved
      : $isPast
        ? theme.colors.mutedTextStrong
        : theme.colors.mutedText};
`;
