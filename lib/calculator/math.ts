import {
  CATCH_UP_CONTRIBUTION_LIMIT,
  DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT,
  defaultCalculatorInputs,
} from "@/lib/calculator/defaults";
import type {
  CalculatorInputs,
  InputField,
  NormalizedCalculatorInputs,
  RetirementProjectionResult,
  ValidationIssue,
  YearlyProjectionEntry,
} from "@/lib/calculator/types";

const PERCENT_SCALE = 100;
const MIDPOINT_CONTRIBUTION_FACTOR = 0.5;
const MIN_RATE_PERCENT = -100;
const CATCH_UP_ELIGIBLE_AGE = 50;

const INPUT_FIELDS: InputField[] = [
  "currentAge",
  "retirementAge",
  "lifeExpectancy",
  "currentBalance",
  "annualSalary",
  "contributionPercent",
  "employerMatchPercent",
  "annualSalaryGrowthPercent",
  "annualReturnPercent",
  "inflationPercent",
  "withdrawalRatePercent",
  "targetRetirementSpending",
  "windfallAge",
  "windfallAmount",
];

export class CalculatorInputError extends Error {
  readonly issues: ValidationIssue[];

  constructor(issues: ValidationIssue[]) {
    super(`Invalid calculator input: ${issues.map((issue) => issue.message).join("; ")}`);
    this.name = "CalculatorInputError";
    this.issues = issues;
  }
}

const toFiniteNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const toRate = (percent: number): number => percent / PERCENT_SCALE;

const assertInputsAreValid = (inputs: NormalizedCalculatorInputs): void => {
  const issues = validateInputs(inputs);
  if (issues.length > 0) {
    throw new CalculatorInputError(issues);
  }
};

export const normalizeInputs = (rawInputs: Partial<CalculatorInputs> = {}): NormalizedCalculatorInputs => ({
  currentAge: toFiniteNumber(rawInputs.currentAge, defaultCalculatorInputs.currentAge),
  retirementAge: toFiniteNumber(rawInputs.retirementAge, defaultCalculatorInputs.retirementAge),
  lifeExpectancy: toFiniteNumber(rawInputs.lifeExpectancy, defaultCalculatorInputs.lifeExpectancy),
  currentBalance: toFiniteNumber(rawInputs.currentBalance, defaultCalculatorInputs.currentBalance),
  annualSalary: toFiniteNumber(rawInputs.annualSalary, defaultCalculatorInputs.annualSalary),
  contributionPercent: toFiniteNumber(rawInputs.contributionPercent, defaultCalculatorInputs.contributionPercent),
  employerMatchPercent: toFiniteNumber(rawInputs.employerMatchPercent, defaultCalculatorInputs.employerMatchPercent),
  annualSalaryGrowthPercent: toFiniteNumber(
    rawInputs.annualSalaryGrowthPercent,
    defaultCalculatorInputs.annualSalaryGrowthPercent
  ),
  annualReturnPercent: toFiniteNumber(rawInputs.annualReturnPercent, defaultCalculatorInputs.annualReturnPercent),
  inflationPercent: toFiniteNumber(rawInputs.inflationPercent, defaultCalculatorInputs.inflationPercent),
  withdrawalRatePercent: toFiniteNumber(rawInputs.withdrawalRatePercent, defaultCalculatorInputs.withdrawalRatePercent),
  targetRetirementSpending: toFiniteNumber(
    rawInputs.targetRetirementSpending,
    defaultCalculatorInputs.targetRetirementSpending
  ),
  windfallAge: toFiniteNumber(rawInputs.windfallAge, defaultCalculatorInputs.windfallAge),
  windfallAmount: toFiniteNumber(rawInputs.windfallAmount, defaultCalculatorInputs.windfallAmount),
});

export const validateInputs = (inputs: NormalizedCalculatorInputs): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

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

  if (inputs.retirementAge <= inputs.currentAge) {
    issues.push({ field: "retirementAge", message: "retirementAge must be greater than currentAge." });
  }

  if (!Number.isInteger(inputs.lifeExpectancy) || inputs.lifeExpectancy <= 0) {
    issues.push({ field: "lifeExpectancy", message: "lifeExpectancy must be a whole number > 0." });
  }

  if (inputs.lifeExpectancy <= inputs.currentAge) {
    issues.push({ field: "lifeExpectancy", message: "lifeExpectancy must be greater than currentAge." });
  }

  if (inputs.lifeExpectancy < inputs.retirementAge) {
    issues.push({ field: "lifeExpectancy", message: "lifeExpectancy must be greater than or equal to retirementAge." });
  }

  if (inputs.currentBalance < 0) {
    issues.push({ field: "currentBalance", message: "currentBalance must be >= 0." });
  }

  if (inputs.annualSalary < 0) {
    issues.push({ field: "annualSalary", message: "annualSalary must be >= 0." });
  }

  if (inputs.contributionPercent < 0 || inputs.contributionPercent > PERCENT_SCALE) {
    issues.push({ field: "contributionPercent", message: "contributionPercent must be between 0 and 100." });
  }

  if (inputs.employerMatchPercent < 0 || inputs.employerMatchPercent > PERCENT_SCALE) {
    issues.push({ field: "employerMatchPercent", message: "employerMatchPercent must be between 0 and 100." });
  }

  if (inputs.withdrawalRatePercent < 0 || inputs.withdrawalRatePercent > PERCENT_SCALE) {
    issues.push({ field: "withdrawalRatePercent", message: "withdrawalRatePercent must be between 0 and 100." });
  }

  if (inputs.targetRetirementSpending < 0) {
    issues.push({ field: "targetRetirementSpending", message: "targetRetirementSpending must be >= 0." });
  }

  if (!Number.isInteger(inputs.windfallAge) || inputs.windfallAge < 0) {
    issues.push({ field: "windfallAge", message: "windfallAge must be a whole number >= 0." });
  }

  if (inputs.windfallAmount < 0) {
    issues.push({ field: "windfallAmount", message: "windfallAmount must be >= 0." });
  }

  if (inputs.windfallAmount > 0 && inputs.windfallAge <= inputs.currentAge) {
    issues.push({
      field: "windfallAge",
      message: "windfallAge must be greater than currentAge when windfallAmount is > 0.",
    });
  }

  if (inputs.windfallAmount > 0 && inputs.windfallAge > inputs.lifeExpectancy) {
    issues.push({
      field: "windfallAge",
      message: "windfallAge must be less than or equal to lifeExpectancy when windfallAmount is > 0.",
    });
  }

  if (inputs.annualSalaryGrowthPercent <= MIN_RATE_PERCENT) {
    issues.push({
      field: "annualSalaryGrowthPercent",
      message: "annualSalaryGrowthPercent must be greater than -100.",
    });
  }

  if (inputs.annualReturnPercent <= MIN_RATE_PERCENT) {
    issues.push({ field: "annualReturnPercent", message: "annualReturnPercent must be greater than -100." });
  }

  if (inputs.inflationPercent <= MIN_RATE_PERCENT) {
    issues.push({ field: "inflationPercent", message: "inflationPercent must be greater than -100." });
  }

  return issues;
};

export const calculateEmployerContribution = (salary: number, employerMatchRate: number): number => salary * employerMatchRate;

export const getAnnualEmployeeContributionLimit = (
  age: number,
  baseLimit = DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT,
  catchUpLimit = CATCH_UP_CONTRIBUTION_LIMIT
): number => baseLimit + (age >= CATCH_UP_ELIGIBLE_AGE ? catchUpLimit : 0);

export const calculateEmployeeContribution = (
  salary: number,
  contributionRate: number,
  annualEmployeeContributionLimit = DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT
): { requestedContribution: number; effectiveContribution: number; capped: boolean } => {
  const requestedContribution = salary * contributionRate;
  const effectiveContribution = Math.min(requestedContribution, annualEmployeeContributionLimit);

  return {
    requestedContribution,
    effectiveContribution,
    capped: requestedContribution > annualEmployeeContributionLimit,
  };
};

export const calculateInflationAdjustedValue = (value: number, annualInflationRate: number, yearIndex: number): number => {
  if (yearIndex <= 0) {
    return value;
  }

  const inflationFactor = Math.pow(1 + annualInflationRate, yearIndex);
  return value / inflationFactor;
};

type ProjectionScenarioResult = {
  finalBalance: number;
  inflationAdjustedBalance: number;
  employeeContributionCapped: boolean;
  catchUpContributionApplied: boolean;
  totalRequestedEmployeeContributions: number;
  totalEmployeeContributions: number;
  totalEmployerContributions: number;
  totalWindfallContributions: number;
  totalInvestmentGrowth: number;
  estimatedAnnualRetirementIncome: number;
  peakBalance: number;
  peakBalanceAge: number;
  depletionAge?: number;
  portfolioLastsUntilAge: number;
  retirementSuccessful: boolean;
  yearlyProjection: YearlyProjectionEntry[];
};

type RequestedWithdrawalResolver = (params: {
  age: number;
  isRetired: boolean;
  preWithdrawalBalance: number;
}) => number;

const calculateScenarioProjection = (
  inputs: NormalizedCalculatorInputs,
  yearsToLifeExpectancy: number,
  contributionRate: number,
  employerMatchRate: number,
  salaryGrowthRate: number,
  annualReturnRate: number,
  inflationRate: number,
  requestedWithdrawalResolver: RequestedWithdrawalResolver
): ProjectionScenarioResult => {
  const yearlyProjection: YearlyProjectionEntry[] = [];

  let salary = inputs.annualSalary;
  let balance = inputs.currentBalance;
  let employeeContributionCapped = false;
  let catchUpContributionApplied = false;
  let totalRequestedEmployeeContributions = 0;
  let totalEmployeeContributions = 0;
  let totalEmployerContributions = 0;
  let totalWindfallContributions = 0;
  let totalInvestmentGrowth = 0;
  let estimatedAnnualRetirementIncome: number | undefined;
  let peakBalance = inputs.currentBalance;
  let peakBalanceAge = inputs.currentAge;
  let depletionAge: number | undefined;

  for (let yearIndex = 0; yearIndex < yearsToLifeExpectancy; yearIndex += 1) {
    const age = inputs.currentAge + yearIndex + 1;
    const isRetired = age >= inputs.retirementAge;
    const startingBalance = balance;
    const annualEmployeeContributionLimit = getAnnualEmployeeContributionLimit(age);
    const annualCatchUpContributionApplied = !isRetired &&
      annualEmployeeContributionLimit > DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT;
    const salaryForYear = isRetired ? 0 : salary;

    const employeeContributionDetails = isRetired
      ? { requestedContribution: 0, effectiveContribution: 0, capped: false }
      : calculateEmployeeContribution(salaryForYear, contributionRate, annualEmployeeContributionLimit);

    const requestedEmployeeContribution = employeeContributionDetails.requestedContribution;
    const employeeContribution = employeeContributionDetails.effectiveContribution;
    const annualContributionWasCapped = employeeContributionDetails.capped;
    const employerContribution = isRetired ? 0 : calculateEmployerContribution(salaryForYear, employerMatchRate);
    const windfallAmount = inputs.windfallAmount > 0 && age === inputs.windfallAge ? inputs.windfallAmount : 0;
    const totalContribution = employeeContribution + employerContribution + windfallAmount;
    const growthBase = startingBalance + totalContribution * MIDPOINT_CONTRIBUTION_FACTOR;
    const investmentGrowth = growthBase * annualReturnRate;
    const preWithdrawalBalance = startingBalance + totalContribution + investmentGrowth;
    const requestedWithdrawal = requestedWithdrawalResolver({ age, isRetired, preWithdrawalBalance });
    const withdrawalAmount = Math.min(Math.max(0, requestedWithdrawal), preWithdrawalBalance);
    const endingBalance = Math.max(0, preWithdrawalBalance - withdrawalAmount);
    const inflationAdjustedEndingBalance = calculateInflationAdjustedValue(endingBalance, inflationRate, yearIndex + 1);

    yearlyProjection.push({
      age,
      yearIndex: yearIndex + 1,
      salary: salaryForYear,
      startingBalance,
      annualEmployeeContributionLimit,
      requestedEmployeeContribution,
      employeeContribution,
      employeeContributionCapped: annualContributionWasCapped,
      catchUpContributionApplied: annualCatchUpContributionApplied,
      employerContribution,
      windfallAmount,
      totalContribution,
      investmentGrowth,
      withdrawalAmount,
      endingBalance,
      inflationAdjustedEndingBalance,
      isRetired,
    });

    employeeContributionCapped ||= annualContributionWasCapped;
    catchUpContributionApplied ||= annualCatchUpContributionApplied;
    totalRequestedEmployeeContributions += requestedEmployeeContribution;
    totalEmployeeContributions += employeeContribution;
    totalEmployerContributions += employerContribution;
    totalWindfallContributions += windfallAmount;
    totalInvestmentGrowth += investmentGrowth;

    if (isRetired && estimatedAnnualRetirementIncome === undefined) {
      estimatedAnnualRetirementIncome = withdrawalAmount;
    }

    if (endingBalance > peakBalance) {
      peakBalance = endingBalance;
      peakBalanceAge = age;
    }

    if (isRetired && depletionAge === undefined && endingBalance <= 0) {
      depletionAge = age;
    }

    if (!isRetired) {
      salary *= 1 + salaryGrowthRate;
    }

    balance = endingBalance;
  }

  const finalBalance = yearlyProjection.at(-1)?.endingBalance ?? inputs.currentBalance;
  const inflationAdjustedBalance = calculateInflationAdjustedValue(finalBalance, inflationRate, yearsToLifeExpectancy);
  const portfolioLastsUntilAge = depletionAge ?? inputs.lifeExpectancy;
  const retirementSuccessful = depletionAge === undefined || depletionAge >= inputs.lifeExpectancy;

  return {
    finalBalance,
    inflationAdjustedBalance,
    employeeContributionCapped,
    catchUpContributionApplied,
    totalRequestedEmployeeContributions,
    totalEmployeeContributions,
    totalEmployerContributions,
    totalWindfallContributions,
    totalInvestmentGrowth,
    estimatedAnnualRetirementIncome: estimatedAnnualRetirementIncome ?? 0,
    peakBalance,
    peakBalanceAge,
    depletionAge,
    portfolioLastsUntilAge,
    retirementSuccessful,
    yearlyProjection,
  };
};

export const calculateRetirementProjection = (rawInputs: Partial<CalculatorInputs>): RetirementProjectionResult => {
  const inputs = normalizeInputs(rawInputs);
  assertInputsAreValid(inputs);

  const yearsToLifeExpectancy = Math.floor(inputs.lifeExpectancy - inputs.currentAge);
  const contributionRate = toRate(inputs.contributionPercent);
  const employerMatchRate = toRate(inputs.employerMatchPercent);
  const salaryGrowthRate = toRate(inputs.annualSalaryGrowthPercent);
  const annualReturnRate = toRate(inputs.annualReturnPercent);
  const inflationRate = toRate(inputs.inflationPercent);
  const withdrawalRate = toRate(inputs.withdrawalRatePercent);

  const sustainableProjection = calculateScenarioProjection(
    inputs,
    yearsToLifeExpectancy,
    contributionRate,
    employerMatchRate,
    salaryGrowthRate,
    annualReturnRate,
    inflationRate,
    ({ isRetired, preWithdrawalBalance }) => (isRetired ? preWithdrawalBalance * withdrawalRate : 0)
  );

  const targetSpendingProjection = calculateScenarioProjection(
    inputs,
    yearsToLifeExpectancy,
    contributionRate,
    employerMatchRate,
    salaryGrowthRate,
    annualReturnRate,
    inflationRate,
    ({ isRetired }) => (isRetired ? inputs.targetRetirementSpending : 0)
  );

  return {
    currentAge: inputs.currentAge,
    retirementAge: inputs.retirementAge,
    lifeExpectancy: inputs.lifeExpectancy,
    targetRetirementSpending: inputs.targetRetirementSpending,
    finalBalance: sustainableProjection.finalBalance,
    inflationAdjustedBalance: sustainableProjection.inflationAdjustedBalance,
    annualEmployeeContributionLimit: DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT,
    catchUpContributionLimit: CATCH_UP_CONTRIBUTION_LIMIT,
    employeeContributionCapped: sustainableProjection.employeeContributionCapped,
    catchUpContributionApplied: sustainableProjection.catchUpContributionApplied,
    totalRequestedEmployeeContributions: sustainableProjection.totalRequestedEmployeeContributions,
    totalEmployeeContributions: sustainableProjection.totalEmployeeContributions,
    totalEmployerContributions: sustainableProjection.totalEmployerContributions,
    totalWindfallContributions: sustainableProjection.totalWindfallContributions,
    totalInvestmentGrowth: sustainableProjection.totalInvestmentGrowth,
    estimatedAnnualRetirementIncome: sustainableProjection.estimatedAnnualRetirementIncome,
    peakBalance: sustainableProjection.peakBalance,
    peakBalanceAge: sustainableProjection.peakBalanceAge,
    depletionAge: sustainableProjection.depletionAge,
    portfolioLastsUntilAge: sustainableProjection.portfolioLastsUntilAge,
    retirementSuccessful: sustainableProjection.retirementSuccessful,
    yearlyProjection: sustainableProjection.yearlyProjection,
    targetSpendingProjection: targetSpendingProjection.yearlyProjection,
    targetSpendingRetirementSuccessful: targetSpendingProjection.retirementSuccessful,
    targetSpendingDepletionAge: targetSpendingProjection.depletionAge,
    targetSpendingPortfolioLastsUntilAge: targetSpendingProjection.portfolioLastsUntilAge,
    targetSpendingPeakBalance: targetSpendingProjection.peakBalance,
    targetSpendingPeakBalanceAge: targetSpendingProjection.peakBalanceAge,
  };
};
