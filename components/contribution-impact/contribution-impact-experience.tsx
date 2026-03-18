"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styled, { css } from "styled-components";

import { ContributionImpactForm } from "@/components/contribution-impact/contribution-impact-form";
import { ContributionImpactResults } from "@/components/contribution-impact/contribution-impact-results";
import { SurfaceCard } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/calculator/format";
import { defaultContributionImpactInputs } from "@/lib/contribution-impact/defaults";
import {
  calculateContributionImpact,
  normalizeContributionImpactInputs,
  validateContributionImpactInputs,
} from "@/lib/contribution-impact/math";
import type {
  ContributionImpactField,
  ContributionImpactInputs,
  ContributionImpactValidationIssue,
} from "@/lib/contribution-impact/types";
import { formatMoneyInput, parseLooseNumber } from "@/lib/calculator/input";
import { theme } from "@/styles/theme";

type InputStringState = Record<ContributionImpactField, string>;
type FieldErrorMap = Partial<Record<ContributionImpactField, string>>;

const fieldMessageMap: Record<string, string> = {
  "currentAge must be a whole number >= 0.": "Use a whole age of 0 or higher.",
  "retirementAge must be a whole number > 0.": "Use a whole retirement age above 0.",
  "retirementAge must be greater than or equal to currentAge.": "Retirement age must be at or after current age.",
  "annualSalary must be >= 0.": "Salary cannot be negative.",
  "contributionPercent must be between 0 and 100.": "Use a current contribution rate between 0% and 100%.",
  "increaseContributionPercent must be between 0 and 100.": "Use an increase between 0% and 100%.",
  "rothIncreaseAllocationPercent must be between 0 and 100.": "Use a Roth split between 0% and 100%.",
  "annualReturnPercent must be greater than -100.": "Annual return must be greater than -100%.",
};

const initialInputStrings: InputStringState = {
  currentAge: String(defaultContributionImpactInputs.currentAge),
  retirementAge: String(defaultContributionImpactInputs.retirementAge),
  annualSalary: defaultContributionImpactInputs.annualSalary.toLocaleString("en-US"),
  contributionPercent: String(defaultContributionImpactInputs.contributionPercent),
  increaseContributionPercent: String(defaultContributionImpactInputs.increaseContributionPercent),
  rothIncreaseAllocationPercent: String(defaultContributionImpactInputs.rothIncreaseAllocationPercent),
  annualReturnPercent: String(defaultContributionImpactInputs.annualReturnPercent),
};

const toFriendlyIssueMessage = (issue: ContributionImpactValidationIssue): string =>
  fieldMessageMap[issue.message] ?? "Check this value.";

const clampPercent = (value: number): number => Math.max(0, Math.min(100, value));

const formatPercentInputValue = (value: number): string => {
  const roundedValue = Math.round(value * 10) / 10;
  return Number.isInteger(roundedValue) ? String(roundedValue) : roundedValue.toFixed(1);
};

type CompactInputProps = {
  field: ContributionImpactField;
  label: string;
  value: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  onValueChange: (field: ContributionImpactField, nextValue: string) => void;
};

function CompactInput({ field, label, value, error, prefix, suffix, onValueChange }: CompactInputProps) {
  return (
    <CompactField>
      <CompactLabel htmlFor={`contribution-impact-${field}`}>{label}</CompactLabel>
      <CompactInputShell $invalid={Boolean(error)}>
        {prefix ? <CompactAdornment>{prefix}</CompactAdornment> : null}
        <CompactTextInput
          id={`contribution-impact-${field}`}
          type="text"
          inputMode="decimal"
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `contribution-impact-${field}-error` : undefined}
          onChange={(event) => onValueChange(field, event.target.value)}
        />
        {suffix ? <CompactAdornment>{suffix}</CompactAdornment> : null}
      </CompactInputShell>
      {error ? <CompactError id={`contribution-impact-${field}-error`}>{error}</CompactError> : null}
    </CompactField>
  );
}

export function ContributionImpactExperience() {
  const [inputValues, setInputValues] = useState<InputStringState>(initialInputStrings);
  const [lastValidResult, setLastValidResult] = useState(() =>
    calculateContributionImpact(defaultContributionImpactInputs)
  );

  const derivedState = useMemo(() => {
    const numericValues: Partial<ContributionImpactInputs> = {};
    const parseErrors: FieldErrorMap = {};

    for (const [field, rawValue] of Object.entries(inputValues) as Array<[ContributionImpactField, string]>) {
      const parsed = parseLooseNumber(rawValue);

      if (parsed === null) {
        parseErrors[field] = "Enter a valid number.";
        continue;
      }

      numericValues[field] = parsed;
    }

    const normalizedInputs = normalizeContributionImpactInputs(numericValues);
    const validationIssues = validateContributionImpactInputs(normalizedInputs);
    const fieldErrors: FieldErrorMap = { ...parseErrors };

    for (const issue of validationIssues) {
      if (issue.field === "general" || fieldErrors[issue.field]) {
        continue;
      }

      fieldErrors[issue.field] = toFriendlyIssueMessage(issue);
    }

    const hasFieldErrors = Object.keys(fieldErrors).length > 0;
    const liveResult = hasFieldErrors ? null : calculateContributionImpact(normalizedInputs);

    return {
      fieldErrors,
      liveResult,
    };
  }, [inputValues]);

  useEffect(() => {
    if (derivedState.liveResult) {
      setLastValidResult(derivedState.liveResult);
    }
  }, [derivedState.liveResult]);

  const displayedResult = derivedState.liveResult ?? lastValidResult;

  const handleFieldChange = (field: ContributionImpactField, nextValue: string) => {
    setInputValues((current) => ({
      ...current,
      [field]: field === "annualSalary" ? formatMoneyInput(nextValue) : nextValue,
    }));
  };

  const handleIncreaseStep = (delta: number) => {
    setInputValues((current) => {
      const currentValue = parseLooseNumber(current.increaseContributionPercent) ?? 0;
      const nextValue = clampPercent(currentValue + delta);
      return {
        ...current,
        increaseContributionPercent: formatPercentInputValue(nextValue),
      };
    });
  };

  const handleAllocationChange = (nextRothPercent: number) => {
    setInputValues((current) => ({
      ...current,
      rothIncreaseAllocationPercent: String(clampPercent(nextRothPercent)),
    }));
  };

  return (
    <ExperienceStack>
      <AssumptionsCard>
        <AssumptionsTitle>Assumptions</AssumptionsTitle>

        <AssumptionsGrid>
          <CompactInput
            field="currentAge"
            label="Current age"
            value={inputValues.currentAge}
            error={derivedState.fieldErrors.currentAge}
            onValueChange={handleFieldChange}
          />
          <CompactInput
            field="retirementAge"
            label="Retirement age"
            value={inputValues.retirementAge}
            error={derivedState.fieldErrors.retirementAge}
            onValueChange={handleFieldChange}
          />
          <CompactInput
            field="annualSalary"
            label="Salary"
            value={inputValues.annualSalary}
            error={derivedState.fieldErrors.annualSalary}
            prefix="$"
            onValueChange={handleFieldChange}
          />
          <CompactInput
            field="annualReturnPercent"
            label="Annual return"
            value={inputValues.annualReturnPercent}
            error={derivedState.fieldErrors.annualReturnPercent}
            suffix="%"
            onValueChange={handleFieldChange}
          />
        </AssumptionsGrid>
      </AssumptionsCard>

      <MainGrid>
        <ControlsColumn>
          <ContributionImpactForm
            values={inputValues}
            errors={derivedState.fieldErrors}
            result={displayedResult}
            onFieldChange={handleFieldChange}
            onIncreaseStep={handleIncreaseStep}
            onAllocationChange={handleAllocationChange}
          />
        </ControlsColumn>

        <ResultsColumn aria-live="polite">
          <ContributionImpactResults result={displayedResult} />
        </ResultsColumn>

        <GuidanceColumn>
          <GuidanceStack>
            <GuidanceSectionLabel>Guidance</GuidanceSectionLabel>

            <GuidanceCard>
              <GuidanceTitle>Capture the full employer match first</GuidanceTitle>
              <GuidanceBody>
                Leaving match dollars on the table usually matters more than optimizing the next 1%–5%.
              </GuidanceBody>
              <GuidanceLink href="/guides/401k-employer-match-explained">Employer match explained →</GuidanceLink>
            </GuidanceCard>

            {displayedResult.increaseClampedByLimit ? (
              <GuidanceCard>
                <GuidanceTitle>IRS cap limits this increase</GuidanceTitle>
                <GuidanceBody>
                  The employee contribution limit is frozen at your current age. Extra dollars stop once the model hits that cap.
                </GuidanceBody>
              </GuidanceCard>
            ) : null}

            {displayedResult.currentAgeCatchUpEligible ? (
              <GuidanceCard>
                <GuidanceTitle>Catch-up room already included</GuidanceTitle>
                <GuidanceBody>
                  Your current-age cap includes catch-up room, and the projection holds that cap fixed throughout.
                </GuidanceBody>
              </GuidanceCard>
            ) : null}

            {displayedResult.futureCatchUpExcluded ? (
              <GuidanceCard>
                <GuidanceTitle>Future catch-up room excluded</GuidanceTitle>
                <GuidanceBody>
                  Turning 50 later does not raise the modeled cap. The projection stays anchored to the current-age limit.
                </GuidanceBody>
              </GuidanceCard>
            ) : null}

            {displayedResult.compensationLimitApplied ? (
              <GuidanceCard>
                <GuidanceTitle>Salary cap applied</GuidanceTitle>
                <GuidanceBody>
                  Contribution percentages apply to up to {formatCurrency(displayedResult.compensationLimit)} of pay, matching the IRS compensation limit.
                </GuidanceBody>
              </GuidanceCard>
            ) : null}

            <GuidanceCard>
              <GuidanceTitle>Keep liquidity ahead of optimization</GuidanceTitle>
              <GuidanceBody>
                A higher rate works best when emergency savings and high-interest debt are in a healthy place.
              </GuidanceBody>
            </GuidanceCard>
          </GuidanceStack>
        </GuidanceColumn>
      </MainGrid>
    </ExperienceStack>
  );
}

const ExperienceStack = styled.div`
  display: grid;
  gap: 18px;
`;

const AssumptionsCard = styled(SurfaceCard)`
  padding: 18px;
  display: grid;
  gap: 16px;
  background:
    radial-gradient(circle at top right, rgba(22, 163, 74, 0.05), transparent 44%),
    ${theme.colors.surface};
`;

const AssumptionsTitle = styled.h2`
  font-size: 0.92rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const AssumptionsGrid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const MainGrid = styled.div`
  display: grid;
  gap: 18px;

  /* Mobile: Form, Results (incl. Action card), Guidance */
  grid-template-areas:
    "controls"
    "results"
    "guidance";

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: minmax(300px, 380px) minmax(0, 1fr);
    grid-template-areas:
      "controls results"
      "guidance results";
    align-items: start;
  }
`;

const ControlsColumn = styled.section`
  grid-area: controls;
  display: grid;
  gap: 18px;
`;

const ResultsColumn = styled.section`
  grid-area: results;
  display: grid;
  gap: 18px;
`;

const GuidanceColumn = styled.section`
  grid-area: guidance;
`;

const CompactField = styled.div`
  display: grid;
  gap: 6px;
`;

const CompactLabel = styled.label`
  font-size: 0.74rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const CompactInputShell = styled.div<{ $invalid: boolean }>`
  height: 50px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  border-radius: ${theme.radii.md};
  border: 1px solid ${theme.colors.borderStrong};
  background: ${theme.colors.surfaceMuted};
  transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;

  ${({ $invalid }) =>
    $invalid
      ? css`
          border-color: ${theme.colors.dangerBorder};
          background: ${theme.colors.dangerSurface};
        `
      : null}

  &:focus-within {
    border-color: ${theme.colors.elevatedBorderHover};
    background: ${theme.colors.surface};
    box-shadow: 0 0 0 3px ${theme.colors.focusRing};
  }
`;

const CompactTextInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: ${theme.colors.text};
  font-size: 1rem;
  font-weight: 600;

  &:focus {
    outline: none;
  }
`;

const CompactAdornment = styled.span`
  font-size: 0.94rem;
  font-weight: 600;
  color: ${theme.colors.mutedTextStrong};
`;

const CompactError = styled.p`
  font-size: 0.78rem;
  color: ${theme.colors.dangerText};
`;

const GuidanceStack = styled.div`
  display: grid;
  gap: 12px;
`;

const GuidanceSectionLabel = styled.h2`
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const GuidanceCard = styled(SurfaceCard)`
  padding: 16px;
  display: grid;
  gap: 6px;
`;

const GuidanceTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 650;
`;

const GuidanceBody = styled.p`
  font-size: 0.82rem;
  line-height: 1.6;
  color: ${theme.colors.mutedTextStrong};
`;

const GuidanceLink = styled(Link)`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${theme.colors.accent};
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;
