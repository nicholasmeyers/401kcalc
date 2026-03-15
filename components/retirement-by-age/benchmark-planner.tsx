"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled, { css } from "styled-components";

import { formatCurrency } from "@/lib/calculator/format";
import {
  calculatePlannerProjection,
  type PlannerInputs,
  type PlannerResult,
} from "@/lib/retirement-benchmarks/planner";
import { MilestoneComparison } from "@/components/retirement-by-age/milestone-comparison";
import { PlannerChart } from "@/components/retirement-by-age/planner-chart";
import { theme } from "@/styles/theme";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type BenchmarkPlannerProps = {
  initialAge: number;
  onAgeChange?: (age: number) => void;
};

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_CONTRIBUTION = 10;
const DEFAULT_MATCH = 4;
const DEFAULT_RETURN = 7;
const DEFAULT_ESCALATION = 0;
const MAX_SUGGESTED_ESCALATION = 10;
const MAX_MILESTONES = 3;

const AGE_DEFAULTS: Record<number, { salary: number; balance: number }> = {
  25: { salary: 75_000, balance: 50_000 },
  30: { salary: 90_000, balance: 150_000 },
  35: { salary: 125_000, balance: 275_000 },
  40: { salary: 150_000, balance: 325_000 },
  45: { salary: 165_000, balance: 375_000 },
  50: { salary: 175_000, balance: 450_000 },
  55: { salary: 200_000, balance: 550_000 },
  60: { salary: 175_000, balance: 700_000 },
  65: { salary: 150_000, balance: 1_000_000 },
  70: { salary: 100_000, balance: 1_500_000 },
};

function getDefaultsForAge(age: number): { salary: number; balance: number } {
  if (AGE_DEFAULTS[age]) return AGE_DEFAULTS[age];

  const keys = Object.keys(AGE_DEFAULTS).map(Number).sort((a, b) => a - b);
  let lower = keys[0];
  for (const k of keys) {
    if (k <= age) lower = k;
  }
  return AGE_DEFAULTS[lower] ?? { salary: 90_000, balance: 50_000 };
}

// ---------------------------------------------------------------------------
// Input helpers
// ---------------------------------------------------------------------------

function parseNum(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDollarDisplay(value: number): string {
  return Math.round(Math.max(0, value)).toLocaleString("en-US");
}

function formatPointValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}


function handleDollarChange(
  e: ChangeEvent<HTMLInputElement>,
  setter: (v: string) => void
) {
  const input = e.target;
  const raw = input.value;
  const cursorPos = input.selectionStart ?? raw.length;

  const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, "").length;
  const digitsOnly = raw.replace(/\D/g, "");

  if (digitsOnly === "") {
    setter("");
    return;
  }

  const num = Number.parseInt(digitsOnly, 10);
  const formatted = Number.isFinite(num) ? num.toLocaleString("en-US") : "";
  setter(formatted);

  let seen = 0;
  let newCursor = formatted.length;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen++;
      if (seen === digitsBeforeCursor) {
        newCursor = i + 1;
        break;
      }
    }
  }

  requestAnimationFrame(() => {
    input.setSelectionRange(newCursor, newCursor);
  });
}

function handleDollarBlur(rawValue: string, setter: (v: string) => void) {
  const parsed = parseNum(rawValue);
  setter(formatDollarDisplay(parsed));
}

function handleNumericChange(
  e: ChangeEvent<HTMLInputElement>,
  setter: (v: string) => void
) {
  const filtered = e.target.value.replace(/[^0-9.,]/g, "");
  setter(filtered);
}

function handleNumericBlur(rawValue: string, setter: (v: string) => void) {
  if (rawValue.trim() === "") {
    setter("0");
    return;
  }
  const parsed = parseNum(rawValue);
  setter(String(parsed));
}

type InputKind = "dollar" | "age" | "percent";

function handleArrowKey(
  e: KeyboardEvent<HTMLInputElement>,
  rawValue: string,
  setter: (v: string) => void,
  kind: InputKind
) {
  if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
  e.preventDefault();

  const current = parseNum(rawValue);
  const delta = e.key === "ArrowUp" ? 1 : -1;

  if (kind === "dollar") {
    const next = Math.max(0, current + delta * 1000);
    setter(formatDollarDisplay(next));
  } else if (kind === "age") {
    const next = Math.max(18, Math.min(70, Math.round(current) + delta));
    setter(String(next));
  } else {
    const next = Math.max(0, current + delta);
    setter(String(next));
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BenchmarkPlanner({ initialAge, onAgeChange }: BenchmarkPlannerProps) {
  const router = useRouter();

  const ageDefaults = getDefaultsForAge(initialAge);
  const [age, setAge] = useState(String(initialAge));
  const [salary, setSalary] = useState(formatDollarDisplay(ageDefaults.salary));
  const [balance, setBalance] = useState(formatDollarDisplay(ageDefaults.balance));
  const [contribution, setContribution] = useState(String(DEFAULT_CONTRIBUTION));
  const [match, setMatch] = useState(String(DEFAULT_MATCH));
  const [returnPct, setReturnPct] = useState(String(DEFAULT_RETURN));
  const [escalation, setEscalation] = useState(String(DEFAULT_ESCALATION));

  useEffect(() => {
    setAge(String(initialAge));
  }, [initialAge]);

  const prevAgeRef = useRef(initialAge);
  useEffect(() => {
    if (!onAgeChange) return;
    const parsed = Math.round(parseNum(age));
    if (parsed >= 25 && parsed <= 70 && parsed !== prevAgeRef.current) {
      prevAgeRef.current = parsed;
      onAgeChange(parsed);
    }
  }, [age, onAgeChange]);

  const inputs: PlannerInputs | null = useMemo(() => {
    const currentAge = Math.round(parseNum(age));
    const annualSalary = parseNum(salary);
    if (currentAge < 18 || currentAge > 70 || annualSalary <= 0) return null;

    return {
      currentAge,
      annualSalary,
      currentBalance: Math.max(0, parseNum(balance)),
      contributionPercent: Math.max(0, Math.min(100, parseNum(contribution))),
      employerMatchPercent: Math.max(0, Math.min(100, parseNum(match))),
      annualReturnPercent: parseNum(returnPct),
      annualContributionIncreasePercent: Math.max(0, parseNum(escalation)),
    };
  }, [age, salary, balance, contribution, match, returnPct, escalation]);

  const result: PlannerResult | null = useMemo(() => {
    if (!inputs) return null;
    return calculatePlannerProjection(inputs);
  }, [inputs]);

  const showAdjusted = (inputs?.annualContributionIncreasePercent ?? 0) > 0;

  const handleAgeBlur = useCallback(() => {
    const parsed = Math.round(parseNum(age));
    if (parsed >= 18 && parsed <= 70 && parsed !== initialAge) {
      if (onAgeChange) {
        onAgeChange(parsed);
      } else {
        router.push(`/retirement-by-age/${parsed}`, { scroll: false });
      }
    }
  }, [age, initialAge, router, onAgeChange]);

  const displayCheckpoints = result
    ? result.nextCheckpoints.slice(0, MAX_MILESTONES)
    : [];

  type SuggestionState =
    | { kind: "on-track"; targetAge: number; currentAmount: number }
    | { kind: "increase"; targetAge: number; currentAmount: number; recommendedAmount: number; delta: number }
    | { kind: "fallback"; targetAge: number; currentAmount: number; recommendedAmount: number; delta: number; pctOfAge70: number }
    | { kind: "maxed"; targetAge: number; currentAmount: number; pctOfAge70: number }
    | { kind: "none" };

  const suggestion = useMemo<SuggestionState>(() => {
    if (!inputs || !result) return { kind: "none" };
    if (inputs.currentAge >= 70) return { kind: "none" };

    const currentAmount = Math.max(0, Math.min(MAX_SUGGESTED_ESCALATION, Math.round(inputs.annualContributionIncreasePercent)));
    const targetAge = inputs.currentAge < 60 ? 60 : 70;
    const targetMultiple = targetAge === 60 ? 8 : 12;
    const benchmark = inputs.annualSalary * targetMultiple;

    const activePath = currentAmount > 0 ? result.adjustedPath : result.currentPath;
    const activeEntry = activePath.find((e) => e.age === targetAge);
    if (activeEntry && activeEntry.balance >= benchmark) {
      return { kind: "on-track", targetAge, currentAmount };
    }

    for (let inc = Math.max(1, currentAmount + 1); inc <= MAX_SUGGESTED_ESCALATION; inc++) {
      const trial = calculatePlannerProjection({ ...inputs, annualContributionIncreasePercent: inc });
      const entry = trial.adjustedPath.find((e) => e.age === targetAge);
      if (entry && entry.balance >= benchmark) {
        return {
          kind: "increase",
          targetAge,
          currentAmount,
          recommendedAmount: inc,
          delta: inc - currentAmount,
        };
      }
    }

    const benchmarkAt70 = inputs.annualSalary * 12;
    const maxTrial = calculatePlannerProjection({ ...inputs, annualContributionIncreasePercent: MAX_SUGGESTED_ESCALATION });
    const entryAt70 = maxTrial.adjustedPath.find((e) => e.age === 70);
    const pct = entryAt70 && benchmarkAt70 > 0
      ? Math.round((entryAt70.balance / benchmarkAt70) * 100)
      : 0;

    if (currentAmount >= MAX_SUGGESTED_ESCALATION) {
      return { kind: "maxed", targetAge, currentAmount, pctOfAge70: pct };
    }

    return {
      kind: "fallback",
      targetAge,
      currentAmount,
      recommendedAmount: MAX_SUGGESTED_ESCALATION,
      delta: MAX_SUGGESTED_ESCALATION - currentAmount,
      pctOfAge70: pct,
    };
  }, [inputs, result]);

  const handleApplySuggestion = useCallback(() => {
    if (suggestion.kind === "increase") {
      setEscalation(String(suggestion.recommendedAmount));
    } else if (suggestion.kind === "fallback") {
      setEscalation(String(suggestion.recommendedAmount));
    }
  }, [suggestion]);

  const calculatorUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (inputs) {
      params.set("currentAge", String(inputs.currentAge));
      params.set("annualSalary", String(inputs.annualSalary));
      params.set("currentBalance", String(inputs.currentBalance));
      params.set("contributionPercent", String(inputs.contributionPercent));
      params.set("employerMatchPercent", String(inputs.employerMatchPercent));
      params.set("annualReturnPercent", String(inputs.annualReturnPercent));
    }
    return `/401k-calculator?${params.toString()}`;
  }, [inputs]);

  return (
    <Wrapper>
      {/* ---- Input section ---- */}
      <InputSection>
        <InputGrid>
          <Field>
            <Label htmlFor="bp-age">Current age</Label>
            <InputWrapper>
              <Input
                id="bp-age"
                type="text"
                inputMode="numeric"
                value={age}
                onChange={(e) => handleNumericChange(e, setAge)}
                onBlur={() => { handleNumericBlur(age, setAge); handleAgeBlur(); }}
                onKeyDown={(e) => handleArrowKey(e, age, setAge, "age")}
              />
            </InputWrapper>
          </Field>

          <Field>
            <Label htmlFor="bp-salary">Annual salary</Label>
            <InputWrapper>
              <InputPrefix>$</InputPrefix>
              <Input
                id="bp-salary"
                type="text"
                inputMode="numeric"
                placeholder="90,000"
                value={salary}
                onChange={(e) => handleDollarChange(e, setSalary)}
                onBlur={() => handleDollarBlur(salary, setSalary)}
                onKeyDown={(e) => handleArrowKey(e, salary, setSalary, "dollar")}
              />
            </InputWrapper>
          </Field>

          <Field>
            <Label htmlFor="bp-balance">Current 401(k) balance</Label>
            <InputWrapper>
              <InputPrefix>$</InputPrefix>
              <Input
                id="bp-balance"
                type="text"
                inputMode="numeric"
                placeholder="50,000"
                value={balance}
                onChange={(e) => handleDollarChange(e, setBalance)}
                onBlur={() => handleDollarBlur(balance, setBalance)}
                onKeyDown={(e) => handleArrowKey(e, balance, setBalance, "dollar")}
              />
            </InputWrapper>
          </Field>

          <Field>
            <Label htmlFor="bp-contrib">Employee contribution %</Label>
            <InputWrapper>
              <Input
                id="bp-contrib"
                type="text"
                inputMode="decimal"
                value={contribution}
                onChange={(e) => handleNumericChange(e, setContribution)}
                onBlur={() => handleNumericBlur(contribution, setContribution)}
                onKeyDown={(e) => handleArrowKey(e, contribution, setContribution, "percent")}
              />
              <InputSuffix>%</InputSuffix>
            </InputWrapper>
          </Field>

          <Field>
            <Label htmlFor="bp-match">Employer match %</Label>
            <InputWrapper>
              <Input
                id="bp-match"
                type="text"
                inputMode="decimal"
                value={match}
                onChange={(e) => handleNumericChange(e, setMatch)}
                onBlur={() => handleNumericBlur(match, setMatch)}
                onKeyDown={(e) => handleArrowKey(e, match, setMatch, "percent")}
              />
              <InputSuffix>%</InputSuffix>
            </InputWrapper>
          </Field>

          <Field>
            <Label htmlFor="bp-return">Annual return %</Label>
            <InputWrapper>
              <Input
                id="bp-return"
                type="text"
                inputMode="decimal"
                value={returnPct}
                onChange={(e) => handleNumericChange(e, setReturnPct)}
                onBlur={() => handleNumericBlur(returnPct, setReturnPct)}
                onKeyDown={(e) => handleArrowKey(e, returnPct, setReturnPct, "percent")}
              />
              <InputSuffix>%</InputSuffix>
            </InputWrapper>
          </Field>

          <EscalationRow>
            <Field>
              <Label htmlFor="bp-escalation">Annual contribution increase %</Label>
              <InputWrapper>
                <Input
                  id="bp-escalation"
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={escalation}
                  onChange={(e) => handleNumericChange(e, setEscalation)}
                  onBlur={() => handleNumericBlur(escalation, setEscalation)}
                  onKeyDown={(e) => handleArrowKey(e, escalation, setEscalation, "percent")}
                />
                <InputSuffix>%</InputSuffix>
              </InputWrapper>
              <FieldHint>Raise contribution % by this amount each year</FieldHint>
            </Field>

            {suggestion.kind === "on-track" && (
              <SuggestionBlock>
                <SuggestionText>
                  &#x1f4a1; {suggestion.currentAmount > 0
                    ? `You're now modeling a ${formatPointValue(suggestion.currentAmount)}-point yearly increase and you're on track for the age-${suggestion.targetAge} benchmark.`
                    : `You're on track for the age-${suggestion.targetAge} benchmark at your current rate.`}
                </SuggestionText>
              </SuggestionBlock>
            )}

            {suggestion.kind === "increase" && (
              <SuggestionBlock>
                <SuggestionText>
                  &#x1f4a1; {suggestion.currentAmount > 0
                    ? <>Add <strong>{formatPointValue(suggestion.delta)} more points</strong>/yr to reach the age-{suggestion.targetAge} benchmark. That would set your yearly increase to <strong>{formatPointValue(suggestion.recommendedAmount)}%</strong>.</>
                    : <>Raise your rate by <strong>{formatPointValue(suggestion.recommendedAmount)} points</strong>/yr to reach the age-{suggestion.targetAge} benchmark.</>}
                </SuggestionText>
                <ApplyButton type="button" onClick={handleApplySuggestion}>
                  {suggestion.currentAmount > 0 ? `Set to ${formatPointValue(suggestion.recommendedAmount)}%` : `Apply +${formatPointValue(suggestion.recommendedAmount)}`}
                </ApplyButton>
              </SuggestionBlock>
            )}

            {suggestion.kind === "fallback" && (
              <SuggestionBlock>
                <SuggestionText>
                  &#x1f4a1; {suggestion.currentAmount > 0
                    ? <>Try <strong>{formatPointValue(suggestion.delta)} more points</strong>/yr and set your yearly increase to <strong>{formatPointValue(suggestion.recommendedAmount)}%</strong>. You may still miss the age-{suggestion.targetAge} benchmark, but you could reach <strong>{suggestion.pctOfAge70}%</strong> of the age-70 benchmark.</>
                    : <>Raising your rate by <strong>{formatPointValue(suggestion.recommendedAmount)} points</strong>/yr may still miss the age-{suggestion.targetAge} benchmark, but it could reach <strong>{suggestion.pctOfAge70}%</strong> of the age-70 benchmark.</>}
                </SuggestionText>
                <ApplyButton type="button" onClick={handleApplySuggestion}>
                  {suggestion.currentAmount > 0 ? `Set to ${formatPointValue(suggestion.recommendedAmount)}%` : `Apply +${formatPointValue(suggestion.recommendedAmount)}`}
                </ApplyButton>
              </SuggestionBlock>
            )}

            {suggestion.kind === "maxed" && (
              <SuggestionBlock>
                <SuggestionText>
                  &#x1f4a1; You&apos;re already modeling a <strong>{formatPointValue(suggestion.currentAmount)}-point</strong> yearly increase. Compare the green path below to see how much ground that closes by age 70: about <strong>{suggestion.pctOfAge70}%</strong> of the age-70 benchmark.
                </SuggestionText>
              </SuggestionBlock>
            )}
          </EscalationRow>
        </InputGrid>

        {result && (
          <LimitNote>
            IRS employee deferral limit for age {inputs?.currentAge}:{" "}
            <strong>{formatCurrency(result.effectiveContributionLimit)}</strong>/yr
          </LimitNote>
        )}
      </InputSection>

      {/* ---- Results ---- */}
      {result && inputs && (
        <>
          {/* Benchmark summary */}
          {result.currentCheckpoint && (
            <SummarySection>
              <SectionHeading>Your checkpoint snapshot</SectionHeading>
              <SummaryGrid>
                <SummaryCard>
                  <SummaryLabel>Age-{result.currentCheckpoint.age} benchmark</SummaryLabel>
                  <SummaryValue>
                    {formatCurrency(Math.round(result.currentCheckpoint.benchmarkTarget))}
                  </SummaryValue>
                  <SummaryMeta>{result.currentCheckpoint.benchmarkLabel}</SummaryMeta>
                </SummaryCard>

                <SummaryCard>
                  <SummaryLabel>Your balance</SummaryLabel>
                  <SummaryValue>{formatCurrency(Math.round(inputs.currentBalance))}</SummaryValue>
                </SummaryCard>

                <SummaryCard>
                  <SummaryLabel>Gap / surplus</SummaryLabel>
                  <SummaryValue
                    $positive={result.currentCheckpoint.currentGapOrSurplus >= 0}
                  >
                    {result.currentCheckpoint.currentGapOrSurplus >= 0 ? "+" : ""}
                    {formatCurrency(Math.abs(Math.round(result.currentCheckpoint.currentGapOrSurplus)))}
                  </SummaryValue>
                  <SummaryMeta>
                    {Math.round(result.currentCheckpoint.currentPercentOfTarget)}% of target
                  </SummaryMeta>
                </SummaryCard>
              </SummaryGrid>
              <Disclaimer>
                Benchmarks are general planning references, not absolute targets. Your ideal savings depends on your spending plans, other assets, and retirement timeline.
              </Disclaimer>
            </SummarySection>
          )}

          {/* Projection chart */}
          <ChartSection>
            <ChartHeader>
              <SectionHeading>Projected savings path</SectionHeading>
              {suggestion.kind === "increase" && (
                <ChartNudge onClick={handleApplySuggestion}>
                  &#x1f4a1; {suggestion.currentAmount > 0
                    ? `Add ${formatPointValue(suggestion.delta)} more pts/yr to reach age-${suggestion.targetAge} — set to ${formatPointValue(suggestion.recommendedAmount)}%`
                    : `Raise your rate by ${formatPointValue(suggestion.recommendedAmount)} pts/yr to reach age-${suggestion.targetAge} — Apply +${formatPointValue(suggestion.recommendedAmount)}`}
                </ChartNudge>
              )}
              {suggestion.kind === "fallback" && (
                <ChartNudge onClick={handleApplySuggestion}>
                  &#x1f4a1; {suggestion.currentAmount > 0
                    ? `Set to ${formatPointValue(suggestion.recommendedAmount)}% to test a stronger path — up to ${suggestion.pctOfAge70}% of age-70 benchmark`
                    : `Raise your rate by ${formatPointValue(suggestion.recommendedAmount)} pts/yr to test a stronger path — up to ${suggestion.pctOfAge70}% of age-70 benchmark`}
                </ChartNudge>
              )}
              {suggestion.kind === "on-track" && suggestion.currentAmount > 0 && (
                <ChartStatus>
                  &#x1f4a1; Your current increase is already modeled and puts you on track for age-{suggestion.targetAge}.
                </ChartStatus>
              )}
              {suggestion.kind === "maxed" && (
                <ChartStatus>
                  &#x1f4a1; You&apos;re already modeling the strongest yearly increase shown here. Compare the green path against your current path.
                </ChartStatus>
              )}
            </ChartHeader>
            <PlannerChart
              currentPath={result.currentPath}
              adjustedPath={result.adjustedPath}
              benchmarkCurve={result.benchmarkCurve}
              showAdjusted={showAdjusted}
              currentAge={inputs.currentAge}
            />
          </ChartSection>

          {/* Milestone comparison */}
          {displayCheckpoints.length > 0 && (
            <MilestoneSection>
              <SectionHeading>Checkpoint comparison</SectionHeading>
              <SectionDescription>
                How your projected balance compares to the next benchmark checkpoints.
              </SectionDescription>
              <MilestoneComparison
                checkpoints={displayCheckpoints}
                showAdjusted={showAdjusted}
              />
            </MilestoneSection>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <RecommendationsSection>
              <SectionHeading>Key takeaways</SectionHeading>
              <RecommendationList>
                {result.recommendations.map((rec, i) => (
                  <Recommendation key={i} $kind={rec.kind}>
                    {rec.text}
                  </Recommendation>
                ))}
              </RecommendationList>
            </RecommendationsSection>
          )}

          <CalculatorCta>
            <CtaHeading>Want a full retirement projection?</CtaHeading>
            <CtaText>
              Run a complete projection with spending goals, inflation, and withdrawal modeling &mdash; pre-filled with your numbers.
            </CtaText>
            <CtaLink href={calculatorUrl}>
              Open 401(k) calculator with these inputs &rarr;
            </CtaLink>
          </CalculatorCta>
        </>
      )}
    </Wrapper>
  );
}

// ---------------------------------------------------------------------------
// Styles – Wrapper
// ---------------------------------------------------------------------------

const Wrapper = styled.div`
  display: grid;
  gap: 36px;
`;

// ---------------------------------------------------------------------------
// Input section
// ---------------------------------------------------------------------------

const InputSection = styled.div`
  display: grid;
  gap: 16px;
  padding: 18px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  background: ${theme.colors.surface};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 24px;
  }
`;

const InputGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Field = styled.div`
  display: grid;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 0.82rem;
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
    border-color: ${theme.colors.borderStrong};
    box-shadow: 0 0 0 3px ${theme.colors.focusRing};
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
  font-size: 1rem;
  font-weight: 500;
  color: ${theme.colors.text};
  outline: none;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 0.95rem;
  }

  &::placeholder {
    color: ${theme.colors.mutedText};
    font-weight: 400;
  }
`;

const FieldHint = styled.span`
  font-size: 0.74rem;
  color: ${theme.colors.mutedText};
  line-height: 1.3;
`;

const LimitNote = styled.p`
  font-size: 0.8rem;
  color: ${theme.colors.mutedTextStrong};
`;

// ---------------------------------------------------------------------------
// Summary section
// ---------------------------------------------------------------------------

const SummarySection = styled.div`
  display: grid;
  gap: 14px;
`;

const SummaryGrid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SummaryCard = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
  align-content: start;
  gap: 4px;
  padding: 18px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surface};
`;

const SummaryLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${theme.colors.mutedText};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const SummaryValue = styled.span<{ $positive?: boolean }>`
  font-size: 1.3rem;
  font-weight: 640;
  line-height: 1.2;
  color: ${({ $positive }) =>
    $positive === true
      ? theme.colors.successText
      : $positive === false
        ? theme.colors.dangerText
        : theme.colors.text};
`;

const SummaryMeta = styled.span`
  font-size: 0.82rem;
  color: ${theme.colors.mutedTextStrong};
`;

const Disclaimer = styled.p`
  font-size: 0.8rem;
  line-height: 1.56;
  color: ${theme.colors.mutedText};
  max-width: 72ch;
`;

// ---------------------------------------------------------------------------
// Section headings
// ---------------------------------------------------------------------------

const SectionHeading = styled.h2`
  font-size: clamp(1.15rem, 2.6vw, 1.4rem);
  font-weight: 640;
  line-height: 1.24;
`;

const SectionDescription = styled.p`
  font-size: 0.92rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 60ch;
`;

// ---------------------------------------------------------------------------
// Chart section
// ---------------------------------------------------------------------------

const ChartSection = styled.div`
  display: grid;
  gap: 16px;
  padding: 18px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  background: ${theme.colors.surface};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 24px;
  }
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const ChartNudge = styled.button`
  padding: 6px 12px;
  border: 1px solid ${theme.colors.successBorder};
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.successSurface};
  color: ${theme.colors.successText};
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;
  outline: none;
  text-align: left;
  line-height: 1.4;

  &:hover {
    background: ${theme.colors.successBorder};
    border-color: ${theme.colors.chartImproved};
  }
`;

const ChartStatus = styled.div`
  padding: 6px 12px;
  border: 1px solid ${theme.colors.successBorder};
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.successSurface};
  color: ${theme.colors.successText};
  font-size: 0.76rem;
  font-weight: 600;
  text-align: left;
  line-height: 1.4;
`;

// ---------------------------------------------------------------------------
// Milestone section
// ---------------------------------------------------------------------------

const MilestoneSection = styled.div`
  display: grid;
  gap: 14px;
`;

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------

const RecommendationsSection = styled.div`
  display: grid;
  gap: 14px;
`;

const RecommendationList = styled.div`
  display: grid;
  gap: 10px;
`;

const Recommendation = styled.p<{ $kind: "on-track" | "action" | "context" }>`
  font-size: 0.92rem;
  line-height: 1.64;
  padding: 14px 16px;
  border-radius: ${theme.radii.md};

  ${({ $kind }) =>
    $kind === "on-track" &&
    css`
      background: ${theme.colors.successSurface};
      border: 1px solid ${theme.colors.successBorder};
      color: ${theme.colors.successText};
    `}

  ${({ $kind }) =>
    $kind === "action" &&
    css`
      background: ${theme.colors.infoSurface};
      border: 1px solid ${theme.colors.infoBorder};
      color: ${theme.colors.infoText};
    `}

  ${({ $kind }) =>
    $kind === "context" &&
    css`
      background: ${theme.colors.warningSurface};
      border: 1px solid ${theme.colors.warningBorder};
      color: ${theme.colors.warningText};
    `}
`;

// ---------------------------------------------------------------------------
// Suggestion block
// ---------------------------------------------------------------------------

const EscalationRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: start;
  gap: 20px;
  flex-wrap: wrap;

  & > div:first-child {
    flex: 0 0 auto;
    width: 200px;
    min-width: 160px;
  }
`;

const SuggestionBlock = styled.div.attrs({
  role: "status",
  "aria-live": "polite",
})`
  display: grid;
  gap: 8px;
  padding: 10px 12px;
  border-radius: ${theme.radii.md};
  background: ${theme.colors.successSurface};
  border: 1px solid ${theme.colors.successBorder};
  margin-top: 25px;
`;

const SuggestionText = styled.p`
  font-size: 0.78rem;
  line-height: 1.45;
  color: ${theme.colors.successText};
`;

const ApplyButton = styled.button`
  justify-self: start;
  height: 28px;
  padding-inline: 12px;
  border: 1px solid ${theme.colors.chartImproved};
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.chartImproved};
  color: #ffffff;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 120ms ease;
  outline: none;

  &:hover {
    background: #15803D;
  }
`;

// ---------------------------------------------------------------------------
// Calculator CTA
// ---------------------------------------------------------------------------

const CalculatorCta = styled.div`
  padding: 24px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.06), transparent 58%),
    ${theme.colors.surfaceMuted};
  display: grid;
  gap: 10px;
`;

const CtaHeading = styled.h3`
  font-size: 1.1rem;
  font-weight: 640;
`;

const CtaText = styled.p`
  max-width: 56ch;
  font-size: 0.92rem;
  line-height: 1.64;
  color: ${theme.colors.textSecondary};
`;

const CtaLink = styled(Link)`
  font-size: 0.92rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;
