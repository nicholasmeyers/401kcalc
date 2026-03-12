"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import styled from "styled-components";

import { CalculatorForm } from "@/components/calculator/calculator-form";
import { allInputFields } from "@/components/calculator/field-config";
import { CalculatorResults } from "@/components/calculator/calculator-results";
import {
  COMPENSATION_LIMIT,
  defaultCalculatorInputs,
} from "@/lib/calculator/defaults";
import { parseLooseNumber } from "@/lib/calculator/input";
import {
  CalculatorInputError,
  calculateRetirementProjection,
  normalizeInputs,
  validateInputs,
} from "@/lib/calculator/math";
import { formatCurrency } from "@/lib/calculator/format";
import { trackEvent } from "@/lib/analytics";
import type { CalculatorInputs, InputField, RetirementProjectionResult, ValidationIssue } from "@/lib/calculator/types";
import { theme } from "@/styles/theme";

type InputStringState = Record<InputField, string>;
type FieldErrorMap = Partial<Record<InputField, string>>;
type DerivedCalculatorState = {
  fieldErrors: FieldErrorMap;
  validationIssues: ValidationIssue[];
  hasFieldErrors: boolean;
  liveResult: RetirementProjectionResult | null;
  salaryCapNote?: string;
  windfallNote?: string;
};

const fieldMessageMap: Record<string, string> = {
  "currentAge must be a whole number >= 0.": "Use a whole age of 0 or higher.",
  "retirementAge must be a whole number > 0.": "Use a whole retirement age above 0.",
  "retirementAge must be greater than or equal to currentAge.": "Retirement age must be at or after current age.",
  "lifeExpectancy must be a whole number > 0.": "Use a whole life expectancy above 0.",
  "lifeExpectancy must be greater than currentAge.": "Life expectancy must be greater than current age.",
  "lifeExpectancy must be greater than or equal to retirementAge.":
    "Life expectancy must be at or after retirement age.",
  "currentBalance must be >= 0.": "Balance cannot be negative.",
  "annualSalary must be >= 0.": "Salary cannot be negative.",
  "contributionPercent must be between 0 and 100.": "Contribution rate must be between 0% and 100%.",
  "employerMatchPercent must be between 0 and 100.": "Employer match must be between 0% and 100%.",
  "targetRetirementSpending must be >= 0.": "Target retirement spending cannot be negative.",
  "earlyRetirementSpendingPercent must be between 0 and 200.": "Early retirement phase must be between 0% and 200%.",
  "midRetirementSpendingPercent must be between 0 and 200.": "Mid retirement phase must be between 0% and 200%.",
  "lateRetirementSpendingPercent must be between 0 and 200.": "Late retirement phase must be between 0% and 200%.",
  "At least one retirement spending phase percent must be above 0.": "Use at least one phase above 0%.",
  "windfallAge must be a whole number >= 0.": "Windfall age must be a whole number of 0 or higher.",
  "windfallAmount must be >= 0.": "Windfall amount cannot be negative.",
  "windfallAge must be greater than currentAge when windfallAmount is > 0.":
    "Windfall age must be greater than current age when amount is above $0.",
  "windfallAge must be less than or equal to lifeExpectancy when windfallAmount is > 0.":
    "Windfall age must be at or before life expectancy.",
  "annualSalaryGrowthPercent must be greater than -100.": "Salary growth must be greater than -100%.",
  "annualReturnPercent must be greater than -100.": "Annual return must be greater than -100%.",
  "inflationPercent must be greater than -100.": "Inflation must be greater than -100%.",
};

const CONTRIBUTION_LIMITS_DISCLOSURE = (
  <details className="calculator-disclosure">
    <summary>
      <span>IRS contribution limits apply.</span>
      <span className="calculator-disclosure-toggle calculator-disclosure-toggle--closed">Show limits</span>
      <span className="calculator-disclosure-toggle calculator-disclosure-toggle--open">Hide limits</span>
    </summary>
    <div className="calculator-disclosure-content">
      <p>Employee 401(k) contributions are capped by IRS annual limits:</p>
      <ul>
        <li>Under 50: $24,500</li>
        <li>Ages 50-59 and 64+: $32,500</li>
        <li>Ages 60-63: $35,750</li>
      </ul>
      <p>If your selected percentage exceeds the limit, the calculator will cap it automatically.</p>
    </div>
  </details>
);

const initialInputStrings: InputStringState = {
  currentAge: String(defaultCalculatorInputs.currentAge),
  retirementAge: String(defaultCalculatorInputs.retirementAge),
  lifeExpectancy: String(defaultCalculatorInputs.lifeExpectancy),
  currentBalance: defaultCalculatorInputs.currentBalance.toLocaleString("en-US"),
  annualSalary: defaultCalculatorInputs.annualSalary.toLocaleString("en-US"),
  contributionPercent: String(defaultCalculatorInputs.contributionPercent),
  employerMatchPercent: String(defaultCalculatorInputs.employerMatchPercent),
  annualSalaryGrowthPercent: String(defaultCalculatorInputs.annualSalaryGrowthPercent),
  annualReturnPercent: String(defaultCalculatorInputs.annualReturnPercent),
  inflationPercent: String(defaultCalculatorInputs.inflationPercent),
  targetRetirementSpending: defaultCalculatorInputs.targetRetirementSpending.toLocaleString("en-US"),
  earlyRetirementSpendingPercent: String(defaultCalculatorInputs.earlyRetirementSpendingPercent),
  midRetirementSpendingPercent: String(defaultCalculatorInputs.midRetirementSpendingPercent),
  lateRetirementSpendingPercent: String(defaultCalculatorInputs.lateRetirementSpendingPercent),
  windfallAge: String(defaultCalculatorInputs.windfallAge),
  windfallAmount: defaultCalculatorInputs.windfallAmount.toLocaleString("en-US"),
};

const toFriendlyIssueMessage = (issue: ValidationIssue): string => fieldMessageMap[issue.message] ?? "Check this value.";

export function CalculatorExperience() {
  const [inputValues, setInputValues] = useState<InputStringState>(initialInputStrings);
  const [retirementSpendingInflationAdjusted, setRetirementSpendingInflationAdjusted] = useState(
    defaultCalculatorInputs.retirementSpendingInflationAdjusted
  );
  const [ageBasedSpendingEnabled, setAgeBasedSpendingEnabled] = useState(defaultCalculatorInputs.ageBasedSpendingEnabled);
  const lastValidResultRef = useRef<RetirementProjectionResult>(
    calculateRetirementProjection(defaultCalculatorInputs)
  );
  const inputTrackingTimeoutsRef = useRef<Partial<Record<InputField, ReturnType<typeof setTimeout>>>>({});
  const lastProjectionSignatureRef = useRef<string>("");
  const projectionTrackingInitializedRef = useRef(false);

  const derivedState = useMemo<DerivedCalculatorState>(() => {
    const numericValues: Partial<CalculatorInputs> = {};
    const parseErrors: FieldErrorMap = {};

    for (const field of allInputFields) {
      const parsed = parseLooseNumber(inputValues[field]);

      if (parsed === null) {
        parseErrors[field] = "Enter a valid number.";
        continue;
      }

      numericValues[field] = parsed;
    }

    const normalizedInputs = normalizeInputs({
      ...numericValues,
      retirementSpendingInflationAdjusted,
      ageBasedSpendingEnabled,
    });
    const validationIssues = validateInputs(normalizedInputs);
    const fieldErrors: FieldErrorMap = { ...parseErrors };

    for (const issue of validationIssues) {
      if (issue.field === "general" || fieldErrors[issue.field]) {
        continue;
      }

      fieldErrors[issue.field] = toFriendlyIssueMessage(issue);
    }

    const allValuesAreParsed = allInputFields.every((field) => numericValues[field] !== undefined);
    const hasFieldErrors = Object.keys(fieldErrors).length > 0;

    let liveResult: RetirementProjectionResult | null = null;

    if (allValuesAreParsed && !hasFieldErrors) {
      try {
        liveResult = calculateRetirementProjection(normalizedInputs);
      } catch (error) {
        if (!(error instanceof CalculatorInputError)) {
          throw error;
        }
      }
    }

    const firstCompensationLimitYear = liveResult?.yearlyProjection.find(
      (entry) => entry.yearIndex > 0 && !entry.isRetired && entry.compensationLimitApplied
    );
    const salaryCapNote = firstCompensationLimitYear
      ? `IRS compensation cap applied at age ${firstCompensationLimitYear.age}: contribution percentages use up to ${formatCurrency(
          COMPENSATION_LIMIT
        )} of pay. Your modeled salary of ${formatCurrency(
          firstCompensationLimitYear.salary
        )} is adjusted to ${formatCurrency(firstCompensationLimitYear.salaryUsedForContributionCalculations)}.`
      : undefined;

    const windfallNote =
      numericValues.windfallAmount !== undefined &&
      numericValues.windfallAge !== undefined &&
      numericValues.windfallAmount > 0 &&
      numericValues.windfallAge >= 0
        ? `Adds a one-time ${formatCurrency(numericValues.windfallAmount)} contribution at age ${Math.floor(
            numericValues.windfallAge
          )}.`
        : undefined;

    return {
      fieldErrors,
      validationIssues,
      hasFieldErrors,
      liveResult,
      salaryCapNote,
      windfallNote,
    };
  }, [ageBasedSpendingEnabled, inputValues, retirementSpendingInflationAdjusted]);

  const fieldNotes = useMemo<Partial<Record<InputField, ReactNode>>>(
    () => ({
      contributionPercent: CONTRIBUTION_LIMITS_DISCLOSURE,
      ...(derivedState.salaryCapNote ? { annualSalary: derivedState.salaryCapNote } : {}),
      ...(derivedState.windfallNote ? { windfallAmount: derivedState.windfallNote } : {}),
    }),
    [derivedState.salaryCapNote, derivedState.windfallNote]
  );

  const statusMessage =
    derivedState.liveResult || (!derivedState.hasFieldErrors && derivedState.validationIssues.length === 0)
      ? undefined
      : "Showing the latest valid projection while you complete highlighted assumptions.";

  if (derivedState.liveResult) {
    lastValidResultRef.current = derivedState.liveResult;
  }

  const displayedResult = derivedState.liveResult ?? lastValidResultRef.current;

  useEffect(() => {
    const timeoutStore = inputTrackingTimeoutsRef.current;

    return () => {
      for (const timeout of Object.values(timeoutStore)) {
        if (timeout) {
          clearTimeout(timeout);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!derivedState.liveResult) {
      return;
    }

    const signature = [
      derivedState.liveResult.retirementAge,
      derivedState.liveResult.lifeExpectancy,
      Math.round(derivedState.liveResult.projectedBalanceAtLifeExpectancy),
      Math.round(derivedState.liveResult.projectedBalanceAtLifeExpectancyTodayDollars),
      Math.round(derivedState.liveResult.targetRetirementSpending),
      derivedState.liveResult.supportsSpendingGoal ? 1 : 0,
      derivedState.liveResult.ageBasedSpendingEnabled ? 1 : 0,
      derivedState.liveResult.retirementSpendingInflationAdjusted ? 1 : 0,
    ].join("|");

    if (!projectionTrackingInitializedRef.current) {
      projectionTrackingInitializedRef.current = true;
      lastProjectionSignatureRef.current = signature;
      return;
    }

    if (lastProjectionSignatureRef.current === signature) {
      return;
    }

    lastProjectionSignatureRef.current = signature;

    trackEvent("projection_updated", {
      retirement_age: derivedState.liveResult.retirementAge,
      life_expectancy: derivedState.liveResult.lifeExpectancy,
    });
  }, [derivedState.liveResult]);

  const scheduleInputTrackingEvent = useCallback((field: InputField) => {
    const existingTimeout = inputTrackingTimeoutsRef.current[field];

    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    inputTrackingTimeoutsRef.current[field] = setTimeout(() => {
      trackEvent("calculator_input_change", { field });

      if (field === "targetRetirementSpending") {
        trackEvent("target_spending_changed");
      }
    }, 500);
  }, []);

  const handleFieldChange = useCallback((field: InputField, nextValue: string) => {
    let hasChanged = false;

    setInputValues((current) => {
      if (current[field] === nextValue) {
        return current;
      }

      hasChanged = true;
      return { ...current, [field]: nextValue };
    });

    if (hasChanged) {
      scheduleInputTrackingEvent(field);
    }
  }, [scheduleInputTrackingEvent]);

  const handleRetirementAgeChange = useCallback((nextRetirementAge: number) => {
    let previousRetirementAge: number | null = null;
    let nextTrackedAge: number | null = null;

    setInputValues((current) => {
      const parsedCurrentAge = parseLooseNumber(current.currentAge);
      const parsedLifeExpectancy = parseLooseNumber(current.lifeExpectancy);
      const parsedRetirementAge = parseLooseNumber(current.retirementAge);
      const fallbackResult = lastValidResultRef.current;
      const minimumAge = Math.floor(parsedCurrentAge ?? fallbackResult.currentAge);
      const maximumAge = Math.floor(parsedLifeExpectancy ?? fallbackResult.lifeExpectancy);
      const boundedAge = Math.max(minimumAge, Math.min(Math.floor(nextRetirementAge), maximumAge));
      const nextRetirementAgeValue = String(boundedAge);
      previousRetirementAge = Math.floor(parsedRetirementAge ?? fallbackResult.retirementAge);

      if (current.retirementAge === nextRetirementAgeValue) {
        return current;
      }

      nextTrackedAge = boundedAge;
      return { ...current, retirementAge: nextRetirementAgeValue };
    });

    if (
      previousRetirementAge !== null &&
      nextTrackedAge !== null &&
      previousRetirementAge !== nextTrackedAge
    ) {
      trackEvent("retirement_marker_dragged", {
        from_age: previousRetirementAge,
        to_age: nextTrackedAge,
      });
    }
  }, []);

  const handleAgeBasedSpendingEnabledChange = useCallback((enabled: boolean) => {
    setAgeBasedSpendingEnabled(enabled);
    trackEvent("calculator_input_change", { field: "ageBasedSpendingEnabled" });
  }, []);

  const handleRetirementSpendingInflationAdjustedChange = useCallback((enabled: boolean) => {
    setRetirementSpendingInflationAdjusted(enabled);
    trackEvent("calculator_input_change", { field: "retirementSpendingInflationAdjusted" });
  }, []);

  return (
    <Layout>
      <FormColumn>
        <CalculatorForm
          values={inputValues}
          errors={derivedState.fieldErrors}
          fieldNotes={fieldNotes}
          ageBasedSpendingEnabled={ageBasedSpendingEnabled}
          retirementSpendingInflationAdjusted={retirementSpendingInflationAdjusted}
          retirementAge={displayedResult.retirementAge}
          onFieldChange={handleFieldChange}
          onAgeBasedSpendingEnabledChange={handleAgeBasedSpendingEnabledChange}
          onRetirementSpendingInflationAdjustedChange={handleRetirementSpendingInflationAdjustedChange}
        />
      </FormColumn>
      <ResultsColumn aria-live="polite">
        <CalculatorResults
          result={displayedResult}
          statusMessage={statusMessage}
          onRetirementAgeChange={handleRetirementAgeChange}
        />
      </ResultsColumn>
    </Layout>
  );
}

const Layout = styled.div`
  display: grid;
  gap: 20px;
  grid-template-areas:
    "results"
    "form";

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
    grid-template-areas: "form results";
    gap: 24px;
    align-items: start;
  }
`;

const FormColumn = styled.aside`
  grid-area: form;
`;

const ResultsColumn = styled.section`
  grid-area: results;
  display: grid;
  gap: 18px;
`;
