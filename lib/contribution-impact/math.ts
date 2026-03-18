import { COMPENSATION_LIMIT } from "@/lib/calculator/defaults";
import { calculateEmployeeContribution, getAnnualEmployeeContributionLimit } from "@/lib/calculator/math";
import {
  ESTIMATED_TRADITIONAL_TAX_OFFSET_RATE_PERCENT,
  RETIREMENT_INCOME_WITHDRAWAL_RATE_PERCENT,
  defaultContributionImpactInputs,
} from "@/lib/contribution-impact/defaults";
import type {
  ContributionImpactField,
  ContributionImpactInputs,
  ContributionImpactResult,
  ContributionImpactScenarioKey,
  ContributionImpactScenarioResult,
  ContributionImpactValidationIssue,
  ContributionImpactYearEntry,
  NormalizedContributionImpactInputs,
} from "@/lib/contribution-impact/types";

const PERCENT_SCALE = 100;
const MIDPOINT_CONTRIBUTION_FACTOR = 0.5;
const MIN_RATE_PERCENT = -100;
const CURRENCY_EPSILON = 0.01;
const CATCH_UP_ELIGIBLE_AGE = 50;

const INPUT_FIELDS: ContributionImpactField[] = [
  "currentAge",
  "retirementAge",
  "annualSalary",
  "contributionPercent",
  "increaseContributionPercent",
  "rothIncreaseAllocationPercent",
  "annualReturnPercent",
];

const SCENARIO_CONFIGS: ReadonlyArray<{
  key: ContributionImpactScenarioKey;
  label: string;
  contributionYears: number | "until-retirement";
}> = [
  { key: "one-year", label: "Increase for 1 year", contributionYears: 1 },
  { key: "five-years", label: "Increase for 5 years", contributionYears: 5 },
  { key: "until-retirement", label: "Increase until retirement", contributionYears: "until-retirement" },
] as const;

export class ContributionImpactInputError extends Error {
  readonly issues: ContributionImpactValidationIssue[];

  constructor(issues: ContributionImpactValidationIssue[]) {
    super(`Invalid contribution impact input: ${issues.map((issue) => issue.message).join("; ")}`);
    this.name = "ContributionImpactInputError";
    this.issues = issues;
  }
}

const toFiniteNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const toRate = (percent: number): number => percent / PERCENT_SCALE;

const assertInputsAreValid = (inputs: NormalizedContributionImpactInputs): void => {
  const issues = validateContributionImpactInputs(inputs);
  if (issues.length > 0) {
    throw new ContributionImpactInputError(issues);
  }
};

export const normalizeContributionImpactInputs = (
  rawInputs: Partial<ContributionImpactInputs> = {}
): NormalizedContributionImpactInputs => ({
  currentAge: toFiniteNumber(rawInputs.currentAge, defaultContributionImpactInputs.currentAge),
  retirementAge: toFiniteNumber(rawInputs.retirementAge, defaultContributionImpactInputs.retirementAge),
  annualSalary: toFiniteNumber(rawInputs.annualSalary, defaultContributionImpactInputs.annualSalary),
  contributionPercent: toFiniteNumber(rawInputs.contributionPercent, defaultContributionImpactInputs.contributionPercent),
  increaseContributionPercent: toFiniteNumber(
    rawInputs.increaseContributionPercent,
    defaultContributionImpactInputs.increaseContributionPercent
  ),
  rothIncreaseAllocationPercent: toFiniteNumber(
    rawInputs.rothIncreaseAllocationPercent,
    defaultContributionImpactInputs.rothIncreaseAllocationPercent
  ),
  annualReturnPercent: toFiniteNumber(rawInputs.annualReturnPercent, defaultContributionImpactInputs.annualReturnPercent),
});

export const validateContributionImpactInputs = (
  inputs: NormalizedContributionImpactInputs
): ContributionImpactValidationIssue[] => {
  const issues: ContributionImpactValidationIssue[] = [];

  for (const field of INPUT_FIELDS) {
    if (!Number.isFinite(inputs[field])) {
      issues.push({ field, message: `${field} must be a finite number.` });
    }
  }

  if (!Number.isInteger(inputs.currentAge) || inputs.currentAge < 0) {
    issues.push({ field: "currentAge", message: "currentAge must be a whole number >= 0." });
  }

  if (!Number.isInteger(inputs.retirementAge) || inputs.retirementAge <= 0) {
    issues.push({ field: "retirementAge", message: "retirementAge must be a whole number > 0." });
  }

  if (inputs.retirementAge < inputs.currentAge) {
    issues.push({ field: "retirementAge", message: "retirementAge must be greater than or equal to currentAge." });
  }

  if (inputs.annualSalary < 0) {
    issues.push({ field: "annualSalary", message: "annualSalary must be >= 0." });
  }

  if (inputs.contributionPercent < 0 || inputs.contributionPercent > PERCENT_SCALE) {
    issues.push({ field: "contributionPercent", message: "contributionPercent must be between 0 and 100." });
  }

  if (inputs.increaseContributionPercent < 0 || inputs.increaseContributionPercent > PERCENT_SCALE) {
    issues.push({
      field: "increaseContributionPercent",
      message: "increaseContributionPercent must be between 0 and 100.",
    });
  }

  if (inputs.rothIncreaseAllocationPercent < 0 || inputs.rothIncreaseAllocationPercent > PERCENT_SCALE) {
    issues.push({
      field: "rothIncreaseAllocationPercent",
      message: "rothIncreaseAllocationPercent must be between 0 and 100.",
    });
  }

  if (inputs.annualReturnPercent <= MIN_RATE_PERCENT) {
    issues.push({ field: "annualReturnPercent", message: "annualReturnPercent must be greater than -100." });
  }

  return issues;
};

type ContributionYearDetails = {
  salaryUsedForContributionCalculations: number;
  requestedContribution: number;
  effectiveContribution: number;
  capped: boolean;
};

const getContributionYearDetails = (
  annualSalary: number,
  contributionPercent: number,
  annualLimit: number
): ContributionYearDetails => {
  const salaryUsedForContributionCalculations = Math.min(annualSalary, COMPENSATION_LIMIT);
  const contributionDetails = calculateEmployeeContribution(
    salaryUsedForContributionCalculations,
    toRate(contributionPercent),
    annualLimit
  );

  return {
    salaryUsedForContributionCalculations,
    requestedContribution: contributionDetails.requestedContribution,
    effectiveContribution: contributionDetails.effectiveContribution,
    capped: contributionDetails.capped,
  };
};

type ContributionIncreaseDetails = {
  annualLimit: number;
  salaryUsedForContributionCalculations: number;
  currentAnnualContribution: number;
  requestedAdditionalContribution: number;
  additionalAnnualContribution: number;
  totalAnnualContribution: number;
  remainingContributionRoom: number;
  effectiveIncreaseContributionPercent: number;
  increaseClampedByLimit: boolean;
  traditionalAdditionalContribution: number;
  rothAdditionalContribution: number;
  estimatedAnnualPayReduction: number;
};

const calculateContributionIncreaseDetails = (
  inputs: NormalizedContributionImpactInputs
): ContributionIncreaseDetails => {
  const annualLimit = getAnnualEmployeeContributionLimit(inputs.currentAge);
  const currentContribution = getContributionYearDetails(inputs.annualSalary, inputs.contributionPercent, annualLimit);
  const increasedContribution = getContributionYearDetails(
    inputs.annualSalary,
    inputs.contributionPercent + inputs.increaseContributionPercent,
    annualLimit
  );

  const requestedAdditionalContribution = Math.max(
    0,
    increasedContribution.requestedContribution - currentContribution.requestedContribution
  );
  const additionalAnnualContribution = Math.max(
    0,
    increasedContribution.effectiveContribution - currentContribution.effectiveContribution
  );
  const totalAnnualContribution = currentContribution.effectiveContribution + additionalAnnualContribution;
  const remainingContributionRoom = Math.max(0, annualLimit - totalAnnualContribution);
  const effectiveIncreaseContributionPercent =
    currentContribution.salaryUsedForContributionCalculations > CURRENCY_EPSILON
      ? (additionalAnnualContribution / currentContribution.salaryUsedForContributionCalculations) * PERCENT_SCALE
      : 0;
  const rothAdditionalContribution = additionalAnnualContribution * toRate(inputs.rothIncreaseAllocationPercent);
  const traditionalAdditionalContribution = Math.max(0, additionalAnnualContribution - rothAdditionalContribution);
  const traditionalTaxOffsetRate = toRate(ESTIMATED_TRADITIONAL_TAX_OFFSET_RATE_PERCENT);
  const estimatedAnnualPayReduction =
    rothAdditionalContribution + traditionalAdditionalContribution * (1 - traditionalTaxOffsetRate);

  return {
    annualLimit,
    salaryUsedForContributionCalculations: currentContribution.salaryUsedForContributionCalculations,
    currentAnnualContribution: currentContribution.effectiveContribution,
    requestedAdditionalContribution,
    additionalAnnualContribution,
    totalAnnualContribution,
    remainingContributionRoom,
    effectiveIncreaseContributionPercent,
    increaseClampedByLimit:
      inputs.increaseContributionPercent > 0 &&
      requestedAdditionalContribution > additionalAnnualContribution + CURRENCY_EPSILON,
    traditionalAdditionalContribution,
    rothAdditionalContribution,
    estimatedAnnualPayReduction,
  };
};

type ScenarioProjection = ContributionImpactScenarioResult & {
  balancesByYear: number[];
};

const calculateScenarioProjection = (
  inputs: NormalizedContributionImpactInputs,
  yearsToRetirement: number,
  annualAdditionalContribution: number,
  scenario: {
    key: ContributionImpactScenarioKey;
    label: string;
    contributionYears: number | "until-retirement";
  }
): ScenarioProjection => {
  const rawContributionYears =
    scenario.contributionYears === "until-retirement" ? yearsToRetirement : scenario.contributionYears;
  const contributionYearsApplied = Math.min(rawContributionYears, yearsToRetirement);
  const annualReturnRate = toRate(inputs.annualReturnPercent);
  let balance = 0;
  let totalAdditionalContributions = 0;
  let totalInvestmentGrowth = 0;
  const balancesByYear = [0];

  for (let yearIndex = 1; yearIndex <= yearsToRetirement; yearIndex += 1) {
    const additionalContribution = yearIndex <= contributionYearsApplied ? annualAdditionalContribution : 0;
    const investmentGrowth = (balance + additionalContribution * MIDPOINT_CONTRIBUTION_FACTOR) * annualReturnRate;

    balance += additionalContribution + investmentGrowth;
    totalAdditionalContributions += additionalContribution;
    totalInvestmentGrowth += investmentGrowth;
    balancesByYear.push(balance);
  }

  const additionalAnnualRetirementIncome =
    balance * (RETIREMENT_INCOME_WITHDRAWAL_RATE_PERCENT / PERCENT_SCALE);

  return {
    key: scenario.key,
    label: scenario.label,
    contributionYears: contributionYearsApplied,
    contributionEndsAge: contributionYearsApplied > 0 ? inputs.currentAge + contributionYearsApplied : null,
    totalAdditionalContributions,
    totalInvestmentGrowth,
    additionalBalanceAtRetirement: balance,
    additionalAnnualRetirementIncome,
    additionalMonthlyRetirementIncome: additionalAnnualRetirementIncome / 12,
    balancesByYear,
  };
};

export const calculateContributionImpact = (
  rawInputs: Partial<ContributionImpactInputs>
): ContributionImpactResult => {
  const inputs = normalizeContributionImpactInputs(rawInputs);
  assertInputsAreValid(inputs);

  const yearsToRetirement = Math.max(0, inputs.retirementAge - inputs.currentAge);
  const contributionIncreaseDetails = calculateContributionIncreaseDetails(inputs);
  const scenarios = SCENARIO_CONFIGS.map((scenario) =>
    calculateScenarioProjection(inputs, yearsToRetirement, contributionIncreaseDetails.additionalAnnualContribution, scenario)
  );

  const scenarioMap = new Map(scenarios.map((scenario) => [scenario.key, scenario]));
  const chartRows: ContributionImpactYearEntry[] = Array.from({ length: yearsToRetirement + 1 }, (_, yearIndex) => ({
    age: inputs.currentAge + yearIndex,
    yearIndex,
    oneYearBalance: scenarioMap.get("one-year")?.balancesByYear[yearIndex] ?? 0,
    fiveYearBalance: scenarioMap.get("five-years")?.balancesByYear[yearIndex] ?? 0,
    untilRetirementBalance: scenarioMap.get("until-retirement")?.balancesByYear[yearIndex] ?? 0,
  }));

  return {
    currentAge: inputs.currentAge,
    retirementAge: inputs.retirementAge,
    annualSalary: inputs.annualSalary,
    contributionPercent: inputs.contributionPercent,
    increaseContributionPercent: inputs.increaseContributionPercent,
    effectiveIncreaseContributionPercent: contributionIncreaseDetails.effectiveIncreaseContributionPercent,
    rothIncreaseAllocationPercent: inputs.rothIncreaseAllocationPercent,
    traditionalIncreaseAllocationPercent: PERCENT_SCALE - inputs.rothIncreaseAllocationPercent,
    annualReturnPercent: inputs.annualReturnPercent,
    yearsToRetirement,
    compensationLimit: COMPENSATION_LIMIT,
    currentContributionLimit: contributionIncreaseDetails.annualLimit,
    compensationLimitApplied:
      contributionIncreaseDetails.salaryUsedForContributionCalculations < inputs.annualSalary - CURRENCY_EPSILON,
    increaseClampedByLimit: contributionIncreaseDetails.increaseClampedByLimit,
    currentAgeCatchUpEligible: inputs.currentAge >= CATCH_UP_ELIGIBLE_AGE,
    futureCatchUpExcluded: inputs.currentAge < CATCH_UP_ELIGIBLE_AGE && inputs.retirementAge > CATCH_UP_ELIGIBLE_AGE,
    currentAnnualContribution: contributionIncreaseDetails.currentAnnualContribution,
    requestedAdditionalContribution: contributionIncreaseDetails.requestedAdditionalContribution,
    additionalAnnualContribution: contributionIncreaseDetails.additionalAnnualContribution,
    totalAnnualContribution: contributionIncreaseDetails.totalAnnualContribution,
    remainingContributionRoom: contributionIncreaseDetails.remainingContributionRoom,
    traditionalAdditionalContribution: contributionIncreaseDetails.traditionalAdditionalContribution,
    rothAdditionalContribution: contributionIncreaseDetails.rothAdditionalContribution,
    estimatedAnnualPayReduction: contributionIncreaseDetails.estimatedAnnualPayReduction,
    estimatedMonthlyPayReduction: contributionIncreaseDetails.estimatedAnnualPayReduction / 12,
    estimatedTraditionalTaxOffsetRatePercent: ESTIMATED_TRADITIONAL_TAX_OFFSET_RATE_PERCENT,
    retirementIncomeWithdrawalRatePercent: RETIREMENT_INCOME_WITHDRAWAL_RATE_PERCENT,
    scenarios: scenarios.map((scenario) => ({
      key: scenario.key,
      label: scenario.label,
      contributionYears: scenario.contributionYears,
      contributionEndsAge: scenario.contributionEndsAge,
      totalAdditionalContributions: scenario.totalAdditionalContributions,
      totalInvestmentGrowth: scenario.totalInvestmentGrowth,
      additionalBalanceAtRetirement: scenario.additionalBalanceAtRetirement,
      additionalAnnualRetirementIncome: scenario.additionalAnnualRetirementIncome,
      additionalMonthlyRetirementIncome: scenario.additionalMonthlyRetirementIncome,
    })),
    chartRows,
  };
};
