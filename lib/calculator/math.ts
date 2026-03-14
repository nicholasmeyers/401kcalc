import {
  CATCH_UP_CONTRIBUTION_LIMIT,
  COMPENSATION_LIMIT,
  DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT,
  SUPER_CATCH_UP_CONTRIBUTION_LIMIT,
  TOTAL_CONTRIBUTION_LIMIT,
  defaultCalculatorInputs,
} from "@/lib/calculator/defaults";
import type {
  CalculatorInputs,
  EmployeeContributionCapReason,
  EmployeeContributionLimitKind,
  InputField,
  NormalizedCalculatorInputs,
  RetirementWithdrawalEntry,
  RetirementProjectionResult,
  ValidationIssue,
  YearlyProjectionEntry,
} from "@/lib/calculator/types";

const PERCENT_SCALE = 100;
const MIDPOINT_CONTRIBUTION_FACTOR = 0.5;
const MIN_RATE_PERCENT = -100;
const CATCH_UP_ELIGIBLE_AGE = 50;
const SUPER_CATCH_UP_MIN_AGE = 60;
const SUPER_CATCH_UP_MAX_AGE = 63;
const EARLY_RETIREMENT_PHASE_END_AGE = 74;
const MID_RETIREMENT_PHASE_END_AGE = 84;
const CURRENCY_EPSILON = 0.01;
const BINARY_SEARCH_PRECISION = 1;
const MAX_BINARY_SEARCH_ITERATIONS = 50;

const INPUT_FIELDS: InputField[] = [
  "currentAge",
  "retirementAge",
  "lifeExpectancy",
  "currentBalance",
  "currentRothBalance",
  "annualSalary",
  "contributionPercent",
  "rothContributionPercent",
  "employerMatchPercent",
  "annualSalaryGrowthPercent",
  "annualReturnPercent",
  "inflationPercent",
  "targetRetirementSpending",
  "earlyRetirementSpendingPercent",
  "midRetirementSpendingPercent",
  "lateRetirementSpendingPercent",
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

const toBoolean = (value: unknown, fallback: boolean): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value !== 0;
  }

  return fallback;
};

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
  currentRothBalance: toFiniteNumber(rawInputs.currentRothBalance, defaultCalculatorInputs.currentRothBalance),
  annualSalary: toFiniteNumber(rawInputs.annualSalary, defaultCalculatorInputs.annualSalary),
  contributionPercent: toFiniteNumber(rawInputs.contributionPercent, defaultCalculatorInputs.contributionPercent),
  rothContributionPercent: toFiniteNumber(
    rawInputs.rothContributionPercent,
    defaultCalculatorInputs.rothContributionPercent
  ),
  employerMatchPercent: toFiniteNumber(rawInputs.employerMatchPercent, defaultCalculatorInputs.employerMatchPercent),
  annualSalaryGrowthPercent: toFiniteNumber(
    rawInputs.annualSalaryGrowthPercent,
    defaultCalculatorInputs.annualSalaryGrowthPercent
  ),
  annualReturnPercent: toFiniteNumber(rawInputs.annualReturnPercent, defaultCalculatorInputs.annualReturnPercent),
  inflationPercent: toFiniteNumber(rawInputs.inflationPercent, defaultCalculatorInputs.inflationPercent),
  targetRetirementSpending: toFiniteNumber(
    rawInputs.targetRetirementSpending,
    defaultCalculatorInputs.targetRetirementSpending
  ),
  retirementSpendingInflationAdjusted: toBoolean(
    rawInputs.retirementSpendingInflationAdjusted,
    defaultCalculatorInputs.retirementSpendingInflationAdjusted
  ),
  ageBasedSpendingEnabled: toBoolean(rawInputs.ageBasedSpendingEnabled, defaultCalculatorInputs.ageBasedSpendingEnabled),
  earlyRetirementSpendingPercent: toFiniteNumber(
    rawInputs.earlyRetirementSpendingPercent,
    defaultCalculatorInputs.earlyRetirementSpendingPercent
  ),
  midRetirementSpendingPercent: toFiniteNumber(
    rawInputs.midRetirementSpendingPercent,
    defaultCalculatorInputs.midRetirementSpendingPercent
  ),
  lateRetirementSpendingPercent: toFiniteNumber(
    rawInputs.lateRetirementSpendingPercent,
    defaultCalculatorInputs.lateRetirementSpendingPercent
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

  if (inputs.retirementAge < inputs.currentAge) {
    issues.push({ field: "retirementAge", message: "retirementAge must be greater than or equal to currentAge." });
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

  if (inputs.currentRothBalance < 0) {
    issues.push({ field: "currentRothBalance", message: "currentRothBalance must be >= 0." });
  }

  if (inputs.currentRothBalance > inputs.currentBalance + CURRENCY_EPSILON) {
    issues.push({
      field: "currentRothBalance",
      message: "currentRothBalance cannot exceed currentBalance.",
    });
  }

  if (inputs.annualSalary < 0) {
    issues.push({ field: "annualSalary", message: "annualSalary must be >= 0." });
  }

  if (inputs.contributionPercent < 0 || inputs.contributionPercent > PERCENT_SCALE) {
    issues.push({ field: "contributionPercent", message: "contributionPercent must be between 0 and 100." });
  }

  if (inputs.rothContributionPercent < 0 || inputs.rothContributionPercent > PERCENT_SCALE) {
    issues.push({
      field: "rothContributionPercent",
      message: "rothContributionPercent must be between 0 and 100.",
    });
  }

  if (inputs.employerMatchPercent < 0 || inputs.employerMatchPercent > PERCENT_SCALE) {
    issues.push({ field: "employerMatchPercent", message: "employerMatchPercent must be between 0 and 100." });
  }

  if (inputs.targetRetirementSpending < 0) {
    issues.push({ field: "targetRetirementSpending", message: "targetRetirementSpending must be >= 0." });
  }

  if (inputs.earlyRetirementSpendingPercent < 0 || inputs.earlyRetirementSpendingPercent > 200) {
    issues.push({
      field: "earlyRetirementSpendingPercent",
      message: "earlyRetirementSpendingPercent must be between 0 and 200.",
    });
  }

  if (inputs.midRetirementSpendingPercent < 0 || inputs.midRetirementSpendingPercent > 200) {
    issues.push({
      field: "midRetirementSpendingPercent",
      message: "midRetirementSpendingPercent must be between 0 and 200.",
    });
  }

  if (inputs.lateRetirementSpendingPercent < 0 || inputs.lateRetirementSpendingPercent > 200) {
    issues.push({
      field: "lateRetirementSpendingPercent",
      message: "lateRetirementSpendingPercent must be between 0 and 200.",
    });
  }

  if (
    inputs.ageBasedSpendingEnabled &&
    inputs.earlyRetirementSpendingPercent <= 0 &&
    inputs.midRetirementSpendingPercent <= 0 &&
    inputs.lateRetirementSpendingPercent <= 0
  ) {
    issues.push({
      field: "lateRetirementSpendingPercent",
      message: "At least one retirement spending phase percent must be above 0.",
    });
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

type EmployeeContributionLimitDetails = {
  annualLimit: number;
  limitKind: EmployeeContributionLimitKind;
  catchUpAmount: number;
};

const getEmployeeContributionLimitDetails = (
  age: number,
  baseLimit = DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT,
  catchUpLimit = CATCH_UP_CONTRIBUTION_LIMIT,
  superCatchUpLimit = SUPER_CATCH_UP_CONTRIBUTION_LIMIT
): EmployeeContributionLimitDetails => {
  if (age >= SUPER_CATCH_UP_MIN_AGE && age <= SUPER_CATCH_UP_MAX_AGE) {
    return {
      annualLimit: baseLimit + superCatchUpLimit,
      limitKind: "super-catch-up",
      catchUpAmount: superCatchUpLimit,
    };
  }

  if (age >= CATCH_UP_ELIGIBLE_AGE) {
    return {
      annualLimit: baseLimit + catchUpLimit,
      limitKind: "catch-up",
      catchUpAmount: catchUpLimit,
    };
  }

  return {
    annualLimit: baseLimit,
    limitKind: "base",
    catchUpAmount: 0,
  };
};

export const getAnnualEmployeeContributionLimit = (
  age: number,
  baseLimit = DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT,
  catchUpLimit = CATCH_UP_CONTRIBUTION_LIMIT,
  superCatchUpLimit = SUPER_CATCH_UP_CONTRIBUTION_LIMIT
): number => getEmployeeContributionLimitDetails(age, baseLimit, catchUpLimit, superCatchUpLimit).annualLimit;

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

const getRetirementSpendingPhaseMultiplier = (inputs: NormalizedCalculatorInputs, age: number): number => {
  if (!inputs.ageBasedSpendingEnabled) {
    return 1;
  }

  if (age <= EARLY_RETIREMENT_PHASE_END_AGE) {
    return Math.max(0, inputs.earlyRetirementSpendingPercent) / PERCENT_SCALE;
  }

  if (age <= MID_RETIREMENT_PHASE_END_AGE) {
    return Math.max(0, inputs.midRetirementSpendingPercent) / PERCENT_SCALE;
  }

  return Math.max(0, inputs.lateRetirementSpendingPercent) / PERCENT_SCALE;
};

type ProjectionScenarioResult = {
  projectedBalanceAtRetirement: number;
  projectedTraditionalBalanceAtRetirement: number;
  projectedRothBalanceAtRetirement: number;
  inflationAdjustedBalanceAtRetirement: number;
  finalBalance: number;
  inflationAdjustedBalance: number;
  employeeContributionCapped: boolean;
  catchUpContributionApplied: boolean;
  compensationLimitApplied: boolean;
  totalContributionLimitApplied: boolean;
  totalRequestedEmployeeContributions: number;
  totalEmployeeContributions: number;
  totalTraditionalEmployeeContributions: number;
  totalRothEmployeeContributions: number;
  totalEmployerContributions: number;
  totalWindfallContributions: number;
  totalInvestmentGrowth: number;
  depletionAge: number | null;
  lastsThroughLifeExpectancy: boolean;
  portfolioLastsUntilAge: number;
  retirementYearsFunded: number;
  totalRetirementYears: number;
  minimumPostRetirementBalance: number;
  finalShortfallAmount: number;
  yearlyProjection: YearlyProjectionEntry[];
  yearlyRetirementWithdrawals: RetirementWithdrawalEntry[];
};

type RequestedWithdrawalResolver = (params: {
  age: number;
  isRetired: boolean;
  retirementYearIndex: number | null;
  preWithdrawalBalance: number;
  spendingPhaseMultiplier: number;
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

  const rothRate = inputs.rothContributionPercent / PERCENT_SCALE;

  const initialRothBalance = Math.min(Math.max(0, inputs.currentRothBalance), inputs.currentBalance);
  const initialTraditionalBalance = inputs.currentBalance - initialRothBalance;

  let salary = inputs.annualSalary;
  let balance = inputs.currentBalance;
  let traditionalBalance = initialTraditionalBalance;
  let rothBalance = initialRothBalance;
  let employeeContributionCapped = false;
  let catchUpContributionApplied = false;
  let compensationLimitApplied = false;
  let totalContributionLimitApplied = false;
  let totalRequestedEmployeeContributions = 0;
  let totalEmployeeContributions = 0;
  let totalTraditionalEmployeeContributions = 0;
  let totalRothEmployeeContributions = 0;
  let totalEmployerContributions = 0;
  let totalWindfallContributions = 0;
  let totalInvestmentGrowth = 0;
  let projectedBalanceAtRetirement: number | undefined =
    inputs.retirementAge === inputs.currentAge ? inputs.currentBalance : undefined;
  let projectedTraditionalBalanceAtRetirement: number | undefined =
    inputs.retirementAge === inputs.currentAge ? initialTraditionalBalance : undefined;
  let projectedRothBalanceAtRetirement: number | undefined =
    inputs.retirementAge === inputs.currentAge ? initialRothBalance : undefined;
  let firstSpendingShortfallAge: number | undefined;
  let firstSpendingShortfallAmount = 0;
  let firstDepletionAge: number | undefined;
  const firstRetirementSimulationAge = Math.max(inputs.retirementAge, inputs.currentAge + 1);

  const isCurrentlyRetired = inputs.currentAge >= inputs.retirementAge;
  const baselineContributionLimitDetails = getEmployeeContributionLimitDetails(inputs.currentAge);
  const baselineSalary = isCurrentlyRetired ? 0 : salary;
  const baselineSalaryUsedForContributionCalculations = isCurrentlyRetired ? 0 : Math.min(baselineSalary, COMPENSATION_LIMIT);
  const baselineCompensationLimitApplied =
    !isCurrentlyRetired && baselineSalary > COMPENSATION_LIMIT + CURRENCY_EPSILON;
  const baselineSpendingPhaseMultiplier = isCurrentlyRetired
    ? getRetirementSpendingPhaseMultiplier(inputs, inputs.currentAge)
    : 0;

  yearlyProjection.push({
    age: inputs.currentAge,
    yearIndex: 0,
    salary: baselineSalary,
    salaryUsedForContributionCalculations: baselineSalaryUsedForContributionCalculations,
    compensationLimitApplied: baselineCompensationLimitApplied,
    startingBalance: inputs.currentBalance,
    annualEmployeeContributionLimit: baselineContributionLimitDetails.annualLimit,
    employeeContributionLimitKind: baselineContributionLimitDetails.limitKind,
    requestedEmployeeContribution: 0,
    employeeContribution: 0,
    employeeContributionCapped: false,
    employeeContributionCapReason: "none",
    catchUpContributionApplied: false,
    requestedEmployerContribution: 0,
    employerContribution: 0,
    employerContributionCapped: false,
    totalContributionLimitApplied: false,
    traditionalEmployeeContribution: 0,
    rothEmployeeContribution: 0,
    windfallAmount: 0,
    totalContribution: 0,
    investmentGrowth: 0,
    requestedWithdrawalAmount: 0,
    withdrawalAmount: 0,
    spendingShortfall: false,
    spendingShortfallAmount: 0,
    spendingPhaseMultiplier: baselineSpendingPhaseMultiplier,
    retirementYearIndex: null,
    endingBalance: inputs.currentBalance,
    inflationAdjustedEndingBalance: inputs.currentBalance,
    traditionalBalance: initialTraditionalBalance,
    rothBalance: initialRothBalance,
    isRetired: isCurrentlyRetired,
  });

  for (let yearIndex = 1; yearIndex <= yearsToLifeExpectancy; yearIndex += 1) {
    const age = inputs.currentAge + yearIndex;
    const isRetired = age >= inputs.retirementAge;
    const retirementYearIndex = isRetired ? Math.max(0, age - firstRetirementSimulationAge) : null;
    const spendingPhaseMultiplier = isRetired ? getRetirementSpendingPhaseMultiplier(inputs, age) : 0;
    const startingBalance = balance;
    const annualEmployeeContributionLimitDetails = getEmployeeContributionLimitDetails(age);
    const annualEmployeeContributionLimit = annualEmployeeContributionLimitDetails.annualLimit;
    const annualEmployeeContributionLimitKind = annualEmployeeContributionLimitDetails.limitKind;
    const annualCatchUpContributionApplied = !isRetired && annualEmployeeContributionLimitDetails.catchUpAmount > 0;
    const salaryForYear = isRetired ? 0 : salary;
    const salaryUsedForContributionCalculations = isRetired ? 0 : Math.min(salaryForYear, COMPENSATION_LIMIT);
    const compensationLimitAppliedForYear = !isRetired && salaryForYear > COMPENSATION_LIMIT + CURRENCY_EPSILON;
    const requestedEmployeeContribution = isRetired ? 0 : salaryForYear * contributionRate;

    const employeeContributionDetails = isRetired
      ? { requestedContribution: 0, effectiveContribution: 0, capped: false }
      : calculateEmployeeContribution(
          salaryUsedForContributionCalculations,
          contributionRate,
          annualEmployeeContributionLimit
        );

    let employeeContribution = employeeContributionDetails.effectiveContribution;
    const requestedEmployerContribution = isRetired
      ? 0
      : calculateEmployerContribution(salaryUsedForContributionCalculations, employerMatchRate);
    let employerContribution = requestedEmployerContribution;
    const cappedByAnnualDeferralLimit = employeeContributionDetails.capped;
    let cappedByTotalContributionLimit = false;
    let employerContributionCapped = false;

    if (!isRetired && employeeContribution + employerContribution > TOTAL_CONTRIBUTION_LIMIT + CURRENCY_EPSILON) {
      const employeeAllowedByTotalLimit = Math.max(0, TOTAL_CONTRIBUTION_LIMIT - employerContribution);
      const adjustedEmployeeContribution = Math.min(employeeContribution, employeeAllowedByTotalLimit);

      cappedByTotalContributionLimit = adjustedEmployeeContribution + CURRENCY_EPSILON < employeeContribution;
      employeeContribution = adjustedEmployeeContribution;

      const employerAllowedByTotalLimit = Math.max(0, TOTAL_CONTRIBUTION_LIMIT - employeeContribution);
      const adjustedEmployerContribution = Math.min(employerContribution, employerAllowedByTotalLimit);

      employerContributionCapped = adjustedEmployerContribution + CURRENCY_EPSILON < employerContribution;
      employerContribution = adjustedEmployerContribution;
    }

    const annualContributionWasCapped = cappedByAnnualDeferralLimit || cappedByTotalContributionLimit;
    const annualTotalContributionLimitApplied = cappedByTotalContributionLimit || employerContributionCapped;
    const annualContributionCapReason: EmployeeContributionCapReason = cappedByTotalContributionLimit
      ? "total-limit"
      : cappedByAnnualDeferralLimit
        ? annualEmployeeContributionLimitKind === "super-catch-up"
          ? "super-catch-up-limit"
          : annualEmployeeContributionLimitKind === "catch-up"
            ? "catch-up-limit"
            : "base-limit"
        : "none";
    const rothEmployeeContribution = isRetired ? 0 : employeeContribution * rothRate;
    const traditionalEmployeeContribution = isRetired ? 0 : employeeContribution - rothEmployeeContribution;

    const windfallAmount = inputs.windfallAmount > 0 && age === inputs.windfallAge ? inputs.windfallAmount : 0;
    const totalContribution = employeeContribution + employerContribution + windfallAmount;
    const growthBase = startingBalance + totalContribution * MIDPOINT_CONTRIBUTION_FACTOR;
    const investmentGrowth = growthBase * annualReturnRate;
    const preWithdrawalBalance = startingBalance + totalContribution + investmentGrowth;
    const requestedWithdrawal = requestedWithdrawalResolver({
      age,
      isRetired,
      retirementYearIndex,
      preWithdrawalBalance,
      spendingPhaseMultiplier,
    });
    const withdrawalAmount = Math.min(Math.max(0, requestedWithdrawal), preWithdrawalBalance);
    const spendingShortfall = isRetired && requestedWithdrawal > withdrawalAmount + CURRENCY_EPSILON;
    const spendingShortfallAmount = spendingShortfall ? Math.max(0, requestedWithdrawal - withdrawalAmount) : 0;
    const endingBalance = Math.max(0, preWithdrawalBalance - withdrawalAmount);
    const inflationAdjustedEndingBalance = calculateInflationAdjustedValue(endingBalance, inflationRate, yearIndex);

    const traditionalContribThisYear = traditionalEmployeeContribution + employerContribution + windfallAmount;
    const rothContribThisYear = rothEmployeeContribution;
    const traditionalGrowth = (traditionalBalance + traditionalContribThisYear * MIDPOINT_CONTRIBUTION_FACTOR) * annualReturnRate;
    const rothGrowth = (rothBalance + rothContribThisYear * MIDPOINT_CONTRIBUTION_FACTOR) * annualReturnRate;
    const preWithdrawalTraditional = traditionalBalance + traditionalContribThisYear + traditionalGrowth;
    const preWithdrawalRoth = rothBalance + rothContribThisYear + rothGrowth;
    const preWithdrawalTotal = preWithdrawalTraditional + preWithdrawalRoth;
    const traditionalShare = preWithdrawalTotal > CURRENCY_EPSILON ? preWithdrawalTraditional / preWithdrawalTotal : 1;
    const traditionalWithdrawal = withdrawalAmount * traditionalShare;
    const rothWithdrawal = withdrawalAmount - traditionalWithdrawal;
    const endingTraditionalBalance = Math.max(0, preWithdrawalTraditional - traditionalWithdrawal);
    const endingRothBalance = Math.max(0, preWithdrawalRoth - rothWithdrawal);

    yearlyProjection.push({
      age,
      yearIndex,
      salary: salaryForYear,
      salaryUsedForContributionCalculations,
      compensationLimitApplied: compensationLimitAppliedForYear,
      startingBalance,
      annualEmployeeContributionLimit,
      employeeContributionLimitKind: annualEmployeeContributionLimitKind,
      requestedEmployeeContribution,
      employeeContribution,
      employeeContributionCapped: annualContributionWasCapped,
      employeeContributionCapReason: annualContributionCapReason,
      catchUpContributionApplied: annualCatchUpContributionApplied,
      requestedEmployerContribution,
      employerContribution,
      employerContributionCapped,
      totalContributionLimitApplied: annualTotalContributionLimitApplied,
      traditionalEmployeeContribution,
      rothEmployeeContribution,
      windfallAmount,
      totalContribution,
      investmentGrowth,
      requestedWithdrawalAmount: requestedWithdrawal,
      withdrawalAmount,
      spendingShortfall,
      spendingShortfallAmount,
      spendingPhaseMultiplier,
      retirementYearIndex,
      endingBalance,
      inflationAdjustedEndingBalance,
      traditionalBalance: endingTraditionalBalance,
      rothBalance: endingRothBalance,
      isRetired,
    });

    employeeContributionCapped ||= annualContributionWasCapped;
    catchUpContributionApplied ||= annualCatchUpContributionApplied;
    compensationLimitApplied ||= compensationLimitAppliedForYear;
    totalContributionLimitApplied ||= annualTotalContributionLimitApplied;
    totalRequestedEmployeeContributions += requestedEmployeeContribution;
    totalEmployeeContributions += employeeContribution;
    totalTraditionalEmployeeContributions += traditionalEmployeeContribution;
    totalRothEmployeeContributions += rothEmployeeContribution;
    totalEmployerContributions += employerContribution;
    totalWindfallContributions += windfallAmount;
    totalInvestmentGrowth += investmentGrowth;

    if (isRetired && projectedBalanceAtRetirement === undefined) {
      projectedBalanceAtRetirement = startingBalance;
      projectedTraditionalBalanceAtRetirement = traditionalBalance;
      projectedRothBalanceAtRetirement = rothBalance;
    }

    if (spendingShortfall && firstSpendingShortfallAge === undefined) {
      firstSpendingShortfallAge = age;
      firstSpendingShortfallAmount = spendingShortfallAmount;
    }

    if (isRetired && firstDepletionAge === undefined && endingBalance <= CURRENCY_EPSILON) {
      firstDepletionAge = age;
    }

    if (!isRetired) {
      salary *= 1 + salaryGrowthRate;
    }

    balance = endingBalance;
    traditionalBalance = endingTraditionalBalance;
    rothBalance = endingRothBalance;
  }

  const yearsToRetirement = Math.max(0, inputs.retirementAge - inputs.currentAge);
  const projectedRetirementBalance = projectedBalanceAtRetirement ?? inputs.currentBalance;
  const projectedTraditionalRetirementBalance = projectedTraditionalBalanceAtRetirement ?? initialTraditionalBalance;
  const projectedRothRetirementBalance = projectedRothBalanceAtRetirement ?? initialRothBalance;
  const inflationAdjustedBalanceAtRetirement = calculateInflationAdjustedValue(
    projectedRetirementBalance,
    inflationRate,
    yearsToRetirement
  );
  const finalBalance = yearlyProjection.at(-1)?.endingBalance ?? inputs.currentBalance;
  const inflationAdjustedBalance = calculateInflationAdjustedValue(finalBalance, inflationRate, yearsToLifeExpectancy);
  const lastsThroughLifeExpectancy = firstSpendingShortfallAge === undefined;
  const depletionAge = lastsThroughLifeExpectancy ? null : (firstDepletionAge ?? firstSpendingShortfallAge ?? null);
  const portfolioLastsUntilAge = firstSpendingShortfallAge ?? inputs.lifeExpectancy;
  const retirementRows = yearlyProjection.filter((entry) => entry.isRetired && entry.yearIndex > 0);
  const retirementYearsFunded = retirementRows.filter((entry) => !entry.spendingShortfall).length;
  const totalRetirementYears = retirementRows.length;
  const minimumPostRetirementBalance =
    retirementRows.length > 0
      ? retirementRows.reduce((minimum, entry) => Math.min(minimum, entry.endingBalance), Number.POSITIVE_INFINITY)
      : projectedRetirementBalance;
  const finalShortfallAmount = lastsThroughLifeExpectancy ? 0 : firstSpendingShortfallAmount;
  const yearlyRetirementWithdrawals: RetirementWithdrawalEntry[] = retirementRows.map((entry) => ({
    age: entry.age,
    retirementYearIndex: entry.retirementYearIndex ?? 0,
    requestedWithdrawalAmount: entry.requestedWithdrawalAmount,
    withdrawalAmount: entry.withdrawalAmount,
    spendingShortfall: entry.spendingShortfall,
    spendingShortfallAmount: entry.spendingShortfallAmount,
  }));

  return {
    projectedBalanceAtRetirement: projectedRetirementBalance,
    projectedTraditionalBalanceAtRetirement: projectedTraditionalRetirementBalance,
    projectedRothBalanceAtRetirement: projectedRothRetirementBalance,
    inflationAdjustedBalanceAtRetirement,
    finalBalance,
    inflationAdjustedBalance,
    employeeContributionCapped,
    catchUpContributionApplied,
    compensationLimitApplied,
    totalContributionLimitApplied,
    totalRequestedEmployeeContributions,
    totalEmployeeContributions,
    totalTraditionalEmployeeContributions,
    totalRothEmployeeContributions,
    totalEmployerContributions,
    totalWindfallContributions,
    totalInvestmentGrowth,
    depletionAge,
    lastsThroughLifeExpectancy,
    portfolioLastsUntilAge,
    retirementYearsFunded,
    totalRetirementYears,
    minimumPostRetirementBalance: Number.isFinite(minimumPostRetirementBalance)
      ? minimumPostRetirementBalance
      : projectedRetirementBalance,
    finalShortfallAmount,
    yearlyProjection,
    yearlyRetirementWithdrawals,
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

  const projectForBaseSpending = (annualBaseSpending: number) =>
    calculateScenarioProjection(
      inputs,
      yearsToLifeExpectancy,
      contributionRate,
      employerMatchRate,
      salaryGrowthRate,
      annualReturnRate,
      inflationRate,
      ({ isRetired, retirementYearIndex, spendingPhaseMultiplier }) => {
        if (!isRetired || retirementYearIndex === null) {
          return 0;
        }

        // The annual spending goal is interpreted in today's dollars.
        // When enabled, withdrawals grow with inflation to preserve purchasing power.
        const inflationMultiplier = inputs.retirementSpendingInflationAdjusted
          ? Math.pow(1 + inflationRate, retirementYearIndex)
          : 1;

        return Math.max(0, annualBaseSpending) * spendingPhaseMultiplier * inflationMultiplier;
      }
    );

  const goalProjection = projectForBaseSpending(inputs.targetRetirementSpending);

  // Binary search for the maximum annual base spending (in the same terms as
  // targetRetirementSpending) that keeps the portfolio solvent through lifeExpectancy.
  // This is the "projected annual spend available" shown in the results hero card.
  const findMaxSustainableSpending = (): number => {
    const retirementYears = inputs.lifeExpectancy - inputs.retirementAge;
    if (retirementYears <= 0 || goalProjection.projectedBalanceAtRetirement <= CURRENCY_EPSILON) {
      return 0;
    }

    let lo = 0;
    let hi = Math.max(goalProjection.projectedBalanceAtRetirement, inputs.targetRetirementSpending * 2, 1);

    while (projectForBaseSpending(hi).lastsThroughLifeExpectancy) {
      hi *= 2;
      if (hi > 1e15) break;
    }

    for (let i = 0; i < MAX_BINARY_SEARCH_ITERATIONS && hi - lo > BINARY_SEARCH_PRECISION; i++) {
      const mid = (lo + hi) / 2;
      if (projectForBaseSpending(mid).lastsThroughLifeExpectancy) {
        lo = mid;
      } else {
        hi = mid;
      }
    }

    return Math.floor(lo);
  };

  const projectedAnnualSpendAvailable = findMaxSustainableSpending();

  const rothRatio =
    goalProjection.projectedBalanceAtRetirement > CURRENCY_EPSILON
      ? goalProjection.projectedRothBalanceAtRetirement / goalProjection.projectedBalanceAtRetirement
      : 0;

  return {
    currentAge: inputs.currentAge,
    retirementAge: inputs.retirementAge,
    lifeExpectancy: inputs.lifeExpectancy,
    retirementStartAge: inputs.retirementAge,
    targetRetirementSpending: inputs.targetRetirementSpending,
    retirementSpendingInflationAdjusted: inputs.retirementSpendingInflationAdjusted,
    ageBasedSpendingEnabled: inputs.ageBasedSpendingEnabled,
    spendingPhasePercents: {
      earlyRetirement: inputs.earlyRetirementSpendingPercent,
      midRetirement: inputs.midRetirementSpendingPercent,
      lateRetirement: inputs.lateRetirementSpendingPercent,
    },
    currentRothBalance: inputs.currentRothBalance,
    rothContributionPercent: inputs.rothContributionPercent,
    projectedBalanceAtRetirement: goalProjection.projectedBalanceAtRetirement,
    projectedTraditionalBalanceAtRetirement: goalProjection.projectedTraditionalBalanceAtRetirement,
    projectedRothBalanceAtRetirement: goalProjection.projectedRothBalanceAtRetirement,
    inflationAdjustedBalanceAtRetirement: goalProjection.inflationAdjustedBalanceAtRetirement,
    projectedBalanceAtLifeExpectancy: goalProjection.finalBalance,
    projectedBalanceAtLifeExpectancyTodayDollars: goalProjection.inflationAdjustedBalance,
    finalBalance: goalProjection.finalBalance,
    inflationAdjustedBalance: goalProjection.inflationAdjustedBalance,
    annualEmployeeContributionLimit: DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT,
    catchUpContributionLimit: CATCH_UP_CONTRIBUTION_LIMIT,
    superCatchUpContributionLimit: SUPER_CATCH_UP_CONTRIBUTION_LIMIT,
    totalContributionLimit: TOTAL_CONTRIBUTION_LIMIT,
    compensationLimit: COMPENSATION_LIMIT,
    employeeContributionCapped: goalProjection.employeeContributionCapped,
    catchUpContributionApplied: goalProjection.catchUpContributionApplied,
    compensationLimitApplied: goalProjection.compensationLimitApplied,
    totalContributionLimitApplied: goalProjection.totalContributionLimitApplied,
    totalRequestedEmployeeContributions: goalProjection.totalRequestedEmployeeContributions,
    totalEmployeeContributions: goalProjection.totalEmployeeContributions,
    totalTraditionalEmployeeContributions: goalProjection.totalTraditionalEmployeeContributions,
    totalRothEmployeeContributions: goalProjection.totalRothEmployeeContributions,
    totalEmployerContributions: goalProjection.totalEmployerContributions,
    totalWindfallContributions: goalProjection.totalWindfallContributions,
    totalInvestmentGrowth: goalProjection.totalInvestmentGrowth,
    supportsSpendingGoal: goalProjection.lastsThroughLifeExpectancy,
    depletionAge: goalProjection.depletionAge,
    lastsThroughLifeExpectancy: goalProjection.lastsThroughLifeExpectancy,
    portfolioLastsUntilAge: goalProjection.portfolioLastsUntilAge,
    retirementYearsFunded: goalProjection.retirementYearsFunded,
    totalRetirementYears: goalProjection.totalRetirementYears,
    minimumPostRetirementBalance: goalProjection.minimumPostRetirementBalance,
    finalShortfallAmount: goalProjection.finalShortfallAmount,
    projectedAnnualSpendAvailable,
    projectedAnnualTraditionalIncome: Math.round(projectedAnnualSpendAvailable * (1 - rothRatio)),
    projectedAnnualRothIncome: Math.round(projectedAnnualSpendAvailable * rothRatio),
    yearlyProjection: goalProjection.yearlyProjection,
    yearlyRetirementWithdrawals: goalProjection.yearlyRetirementWithdrawals,
  };
};
