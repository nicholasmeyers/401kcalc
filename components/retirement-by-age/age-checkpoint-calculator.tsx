"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import styled, { css } from "styled-components";

import { calculateCheckpoint, type CheckpointInputs, type CheckpointResult } from "@/lib/retirement-benchmarks/checkpoint-calculator";
import { formatCurrency } from "@/lib/calculator/format";
import { theme } from "@/styles/theme";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type AgeCheckpointCalculatorProps = {
  age: number;
  recommendedMultiple: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_CONTRIBUTION_PERCENT = 10;
const DEFAULT_EMPLOYER_MATCH_PERCENT = 4;
const DEFAULT_RETURN_PERCENT = 7;
const PROGRESS_VISUAL_CAP = 150;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseNumericInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clampPercent(value: number): string {
  return `${Math.min(Math.max(value, 0), PROGRESS_VISUAL_CAP)}%`;
}

function formatPct(value: number): string {
  return `${Math.round(value)}%`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AgeCheckpointCalculator({ age, recommendedMultiple }: AgeCheckpointCalculatorProps) {
  const [salary, setSalary] = useState("");
  const [balance, setBalance] = useState("");
  const [contributionPercent, setContributionPercent] = useState(String(DEFAULT_CONTRIBUTION_PERCENT));
  const [employerMatchPercent, setEmployerMatchPercent] = useState(String(DEFAULT_EMPLOYER_MATCH_PERCENT));
  const [returnPercent, setReturnPercent] = useState(String(DEFAULT_RETURN_PERCENT));
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const inputs: CheckpointInputs | null = useMemo(() => {
    const annualSalary = parseNumericInput(salary);
    const currentBalance = parseNumericInput(balance);
    if (annualSalary <= 0) return null;

    return {
      age,
      annualSalary,
      currentBalance,
      contributionPercent: parseNumericInput(contributionPercent),
      employerMatchPercent: parseNumericInput(employerMatchPercent),
      annualReturnPercent: parseNumericInput(returnPercent),
    };
  }, [age, salary, balance, contributionPercent, employerMatchPercent, returnPercent]);

  const result: CheckpointResult | null = useMemo(() => {
    if (!inputs) return null;
    return calculateCheckpoint(inputs) ?? null;
  }, [inputs]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (inputs) setHasSubmitted(true);
    },
    [inputs],
  );

  const showResults = hasSubmitted && result;

  return (
    <Wrapper>
      <Header>
        <HeaderTitle>Check your progress</HeaderTitle>
        <HeaderDescription>
          Compare your balance to the age-{age} checkpoint ({recommendedMultiple}).
        </HeaderDescription>
      </Header>

      <Form onSubmit={handleSubmit}>
        <PrimaryFields>
          <Field>
            <Label htmlFor="ck-salary">Annual salary</Label>
            <InputWrapper>
              <InputPrefix>$</InputPrefix>
              <Input
                id="ck-salary"
                type="text"
                inputMode="numeric"
                placeholder="90,000"
                value={salary}
                onChange={(event) => {
                  setSalary(event.target.value);
                  setHasSubmitted(false);
                }}
              />
            </InputWrapper>
          </Field>

          <Field>
            <Label htmlFor="ck-balance">Current 401k balance</Label>
            <InputWrapper>
              <InputPrefix>$</InputPrefix>
              <Input
                id="ck-balance"
                type="text"
                inputMode="numeric"
                placeholder="50,000"
                value={balance}
                onChange={(event) => {
                  setBalance(event.target.value);
                  setHasSubmitted(false);
                }}
              />
            </InputWrapper>
          </Field>
        </PrimaryFields>

        <SecondaryFields>
          <CompactField>
            <Label htmlFor="ck-contribution">Your contribution</Label>
            <InputWrapper>
              <Input
                id="ck-contribution"
                type="text"
                inputMode="decimal"
                placeholder="10"
                value={contributionPercent}
                onChange={(event) => {
                  setContributionPercent(event.target.value);
                  setHasSubmitted(false);
                }}
              />
              <InputSuffix>%</InputSuffix>
            </InputWrapper>
          </CompactField>

          <CompactField>
            <Label htmlFor="ck-match">Employer match</Label>
            <InputWrapper>
              <Input
                id="ck-match"
                type="text"
                inputMode="decimal"
                placeholder="4"
                value={employerMatchPercent}
                onChange={(event) => {
                  setEmployerMatchPercent(event.target.value);
                  setHasSubmitted(false);
                }}
              />
              <InputSuffix>%</InputSuffix>
            </InputWrapper>
          </CompactField>

          <CompactField>
            <Label htmlFor="ck-return">Annual return</Label>
            <InputWrapper>
              <Input
                id="ck-return"
                type="text"
                inputMode="decimal"
                placeholder="7"
                value={returnPercent}
                onChange={(event) => {
                  setReturnPercent(event.target.value);
                  setHasSubmitted(false);
                }}
              />
              <InputSuffix>%</InputSuffix>
            </InputWrapper>
          </CompactField>
        </SecondaryFields>

        <SubmitButton type="submit" disabled={!inputs}>
          Check my progress
        </SubmitButton>
      </Form>

      {showResults ? <ResultsPanel result={result} age={age} /> : null}
    </Wrapper>
  );
}

// ---------------------------------------------------------------------------
// Results sub-component
// ---------------------------------------------------------------------------

function ResultsPanel({ result, age }: { result: CheckpointResult; age: number }) {
  const { target, currentBalance, differenceToTargetMidpoint, percentOfTarget, aboveTarget, nextCheckpoint } = result;
  const progressWidth = clampPercent(percentOfTarget);
  const isOverTarget = percentOfTarget > 100;

  return (
    <Results>
      <ResultHeading>Your age-{age} checkpoint</ResultHeading>

      <StatGrid>
        <StatRow>
          <StatLabel>{target.isRange ? "Reference target (range)" : `Age-${age} reference target`}</StatLabel>
          <StatValue>
            {target.isRange ? (
              <>
                {formatCurrency(target.low)}&nbsp;&ndash;&nbsp;{formatCurrency(target.high)}
              </>
            ) : (
              formatCurrency(target.midpoint)
            )}
          </StatValue>
        </StatRow>

        <StatRow>
          <StatLabel>Your current 401k</StatLabel>
          <StatValue>{formatCurrency(currentBalance)}</StatValue>
        </StatRow>

        <StatRow>
          <StatLabel>Difference to target</StatLabel>
          <StatValue $positive={aboveTarget}>
            {aboveTarget ? "+" : ""}
            {formatCurrency(Math.abs(differenceToTargetMidpoint))}
            {aboveTarget ? " ahead" : " below"}
          </StatValue>
        </StatRow>
      </StatGrid>

      <BarSection>
        <BarTrack>
          <BarFill style={{ width: progressWidth }} $over={isOverTarget} />
          {!isOverTarget && <BarTargetMarker style={{ left: "100%" }} />}
        </BarTrack>
        <BarLabel>
          <strong>{formatPct(percentOfTarget)}</strong> of this checkpoint
        </BarLabel>
      </BarSection>

      <ContributionBlock>
        <ContributionHeading>Estimated annual savings</ContributionHeading>
        <ContributionRow>
          <ContributionLabel>Your contribution</ContributionLabel>
          <ContributionValue>{formatCurrency(result.annualEmployeeContribution)}</ContributionValue>
        </ContributionRow>
        <ContributionRow>
          <ContributionLabel>Employer contribution</ContributionLabel>
          <ContributionValue>{formatCurrency(result.annualEmployerContribution)}</ContributionValue>
        </ContributionRow>
        <ContributionRow $highlight>
          <ContributionLabel>Total savings rate</ContributionLabel>
          <ContributionValue>{formatPct(result.totalSavingsRatePercent)} of salary</ContributionValue>
        </ContributionRow>
      </ContributionBlock>

      {nextCheckpoint ? (
        <ProjectionBlock>
          <ProjectionHeading>If you keep this pace&hellip;</ProjectionHeading>
          <ProjectionCompare>
            <ProjectionBar>
              <ProjectionBarSegment $type="current" style={{ flex: currentBalance }}>
                <ProjectionBarLabel>Now</ProjectionBarLabel>
              </ProjectionBarSegment>
              <ProjectionBarSegment $type="projected" style={{ flex: Math.max(0, nextCheckpoint.projectedBalance - currentBalance) }}>
                <ProjectionBarLabel>Age {nextCheckpoint.age}</ProjectionBarLabel>
              </ProjectionBarSegment>
            </ProjectionBar>
            <ProjectionStats>
              <ProjectionStatRow>
                <ProjectionStatLabel>Projected at age {nextCheckpoint.age}</ProjectionStatLabel>
                <ProjectionStatValue>{formatCurrency(Math.round(nextCheckpoint.projectedBalance))}</ProjectionStatValue>
              </ProjectionStatRow>
              <ProjectionStatRow>
                <ProjectionStatLabel>
                  Age-{nextCheckpoint.age} target
                  {nextCheckpoint.isRange ? " (range)" : ""}
                </ProjectionStatLabel>
                <ProjectionStatValue>
                  {nextCheckpoint.isRange ? (
                    <>
                      {formatCurrency(nextCheckpoint.targetLow)}&ndash;{formatCurrency(nextCheckpoint.targetHigh)}
                    </>
                  ) : (
                    formatCurrency(nextCheckpoint.targetMidpoint)
                  )}
                </ProjectionStatValue>
              </ProjectionStatRow>
            </ProjectionStats>
          </ProjectionCompare>
          <ProjectionNote>
            Assumes constant salary and contribution rate over {nextCheckpoint.yearsUntil} years &mdash; actual results will vary.
          </ProjectionNote>
        </ProjectionBlock>
      ) : null}

      <CtaRow>
        <CtaLink href="/401k-calculator">Run a full retirement projection &rarr;</CtaLink>
      </CtaRow>
    </Results>
  );
}

// ---------------------------------------------------------------------------
// Styled components – Wrapper & Header
// ---------------------------------------------------------------------------

const Wrapper = styled.div`
  display: grid;
  gap: 24px;
`;

const Header = styled.div`
  display: grid;
  gap: 6px;
`;

const HeaderTitle = styled.h2`
  font-size: clamp(1.35rem, 3vw, 1.72rem);
  font-weight: 640;
  line-height: 1.24;
`;

const HeaderDescription = styled.p`
  max-width: 56ch;
  font-size: 0.97rem;
  line-height: 1.68;
  color: ${theme.colors.textSecondary};
`;

// ---------------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------------

const Form = styled.form`
  display: grid;
  gap: 18px;
`;

const PrimaryFields = styled.div`
  display: grid;
  gap: 14px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const SecondaryFields = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
`;

const CompactField = styled(Field)``;

const Label = styled.label`
  font-size: 0.84rem;
  font-weight: 600;
  color: ${theme.colors.mutedTextStrong};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surface};
  overflow: hidden;
  transition: border-color 120ms ease;

  &:focus-within {
    border-color: ${theme.colors.accent};
  }
`;

const InputPrefix = styled.span`
  padding-left: 12px;
  font-size: 0.92rem;
  color: ${theme.colors.mutedText};
  user-select: none;
`;

const InputSuffix = styled.span`
  padding-right: 12px;
  font-size: 0.92rem;
  color: ${theme.colors.mutedText};
  user-select: none;
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  padding-inline: 10px;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${theme.colors.text};
  outline: none;

  &::placeholder {
    color: ${theme.colors.mutedText};
    font-weight: 400;
  }
`;

const SubmitButton = styled.button`
  justify-self: start;
  height: 42px;
  padding-inline: 24px;
  border: 1px solid ${theme.colors.accent};
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.accent};
  color: #ffffff;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease, opacity 120ms ease;

  &:hover {
    background: ${theme.colors.accentHover};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

const Results = styled.div`
  display: grid;
  gap: 22px;
  padding-top: 6px;
  border-top: 1px solid ${theme.colors.border};
`;

const ResultHeading = styled.h3`
  font-size: 1.08rem;
  font-weight: 640;
`;

// ---------------------------------------------------------------------------
// Stat grid
// ---------------------------------------------------------------------------

const StatGrid = styled.div`
  display: grid;
  gap: 10px;
`;

const StatRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const StatLabel = styled.span`
  font-size: 0.92rem;
  color: ${theme.colors.textSecondary};
`;

const StatValue = styled.span<{ $positive?: boolean }>`
  font-size: 0.95rem;
  font-weight: 640;
  color: ${({ $positive }) => ($positive ? theme.colors.successText : theme.colors.text)};
`;

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

const BarSection = styled.div`
  display: grid;
  gap: 8px;
`;

const BarTrack = styled.div`
  position: relative;
  height: 14px;
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
`;

const BarFill = styled.div<{ $over: boolean }>`
  height: 100%;
  border-radius: ${theme.radii.pill};
  transition: width 400ms ease;
  background: ${({ $over }) => ($over ? theme.colors.chartTarget : theme.colors.accent)};
`;

const BarTargetMarker = styled.div`
  position: absolute;
  top: -2px;
  bottom: -2px;
  width: 2px;
  background: ${theme.colors.chartMain};
  transform: translateX(-50%);
`;

const BarLabel = styled.p`
  font-size: 0.88rem;
  color: ${theme.colors.textSecondary};
`;

// ---------------------------------------------------------------------------
// Contribution block
// ---------------------------------------------------------------------------

const ContributionBlock = styled.div`
  display: grid;
  gap: 8px;
  padding: 16px;
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border};
`;

const ContributionHeading = styled.h4`
  font-size: 0.9rem;
  font-weight: 640;
  margin-bottom: 2px;
`;

const ContributionRow = styled.div<{ $highlight?: boolean }>`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;

  ${({ $highlight }) =>
    $highlight &&
    css`
      padding-top: 8px;
      border-top: 1px solid ${theme.colors.border};
    `}
`;

const ContributionLabel = styled.span`
  font-size: 0.88rem;
  color: ${theme.colors.textSecondary};
`;

const ContributionValue = styled.span`
  font-size: 0.88rem;
  font-weight: 600;
`;

// ---------------------------------------------------------------------------
// Projection block
// ---------------------------------------------------------------------------

const ProjectionBlock = styled.div`
  display: grid;
  gap: 12px;
`;

const ProjectionHeading = styled.h4`
  font-size: 0.96rem;
  font-weight: 640;
`;

const ProjectionCompare = styled.div`
  display: grid;
  gap: 10px;
`;

const ProjectionBar = styled.div`
  display: flex;
  height: 28px;
  border-radius: ${theme.radii.md};
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
`;

const ProjectionBarSegment = styled.div<{ $type: "current" | "projected" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  background: ${({ $type }) => ($type === "current" ? theme.colors.accent : theme.colors.chartTarget)};
`;

const ProjectionBarLabel = styled.span`
  font-size: 0.74rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
`;

const ProjectionStats = styled.div`
  display: grid;
  gap: 6px;
`;

const ProjectionStatRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const ProjectionStatLabel = styled.span`
  font-size: 0.88rem;
  color: ${theme.colors.textSecondary};
`;

const ProjectionStatValue = styled.span`
  font-size: 0.9rem;
  font-weight: 640;
`;

const ProjectionNote = styled.p`
  font-size: 0.8rem;
  color: ${theme.colors.mutedText};
  line-height: 1.5;
`;

// ---------------------------------------------------------------------------
// CTA
// ---------------------------------------------------------------------------

const CtaRow = styled.div`
  padding-top: 4px;
`;

const CtaLink = styled(Link)`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.accent};
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;
