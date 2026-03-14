export type CalculatorInputs = {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentBalance: number;
  annualSalary: number;
  contributionPercent: number;
  rothContributionPercent: number;
  employerMatchPercent: number;
  annualSalaryGrowthPercent: number;
  annualReturnPercent: number;
  inflationPercent: number;
  targetRetirementSpending: number;
  retirementSpendingInflationAdjusted: boolean;
  ageBasedSpendingEnabled: boolean;
  earlyRetirementSpendingPercent: number;
  midRetirementSpendingPercent: number;
  lateRetirementSpendingPercent: number;
  windfallAge: number;
  windfallAmount: number;
};

export type NormalizedCalculatorInputs = CalculatorInputs;

export type InputField =
  | "currentAge"
  | "retirementAge"
  | "lifeExpectancy"
  | "currentBalance"
  | "annualSalary"
  | "contributionPercent"
  | "rothContributionPercent"
  | "employerMatchPercent"
  | "annualSalaryGrowthPercent"
  | "annualReturnPercent"
  | "inflationPercent"
  | "targetRetirementSpending"
  | "earlyRetirementSpendingPercent"
  | "midRetirementSpendingPercent"
  | "lateRetirementSpendingPercent"
  | "windfallAge"
  | "windfallAmount";

export type ValidationIssue = {
  field: InputField | "general";
  message: string;
};

export type EmployeeContributionLimitKind = "base" | "catch-up" | "super-catch-up";

export type EmployeeContributionCapReason =
  | "none"
  | "base-limit"
  | "catch-up-limit"
  | "super-catch-up-limit"
  | "total-limit";

export type YearlyProjectionEntry = {
  age: number;
  yearIndex: number;
  salary: number;
  salaryUsedForContributionCalculations: number;
  compensationLimitApplied: boolean;
  startingBalance: number;
  annualEmployeeContributionLimit: number;
  employeeContributionLimitKind: EmployeeContributionLimitKind;
  requestedEmployeeContribution: number;
  employeeContribution: number;
  employeeContributionCapped: boolean;
  employeeContributionCapReason: EmployeeContributionCapReason;
  catchUpContributionApplied: boolean;
  requestedEmployerContribution: number;
  employerContribution: number;
  employerContributionCapped: boolean;
  totalContributionLimitApplied: boolean;
  traditionalEmployeeContribution: number;
  rothEmployeeContribution: number;
  windfallAmount: number;
  totalContribution: number;
  investmentGrowth: number;
  requestedWithdrawalAmount: number;
  withdrawalAmount: number;
  spendingShortfall: boolean;
  spendingShortfallAmount: number;
  spendingPhaseMultiplier: number;
  retirementYearIndex: number | null;
  endingBalance: number;
  inflationAdjustedEndingBalance: number;
  traditionalBalance: number;
  rothBalance: number;
  isRetired: boolean;
};

export type RetirementWithdrawalEntry = {
  age: number;
  retirementYearIndex: number;
  requestedWithdrawalAmount: number;
  withdrawalAmount: number;
  spendingShortfall: boolean;
  spendingShortfallAmount: number;
};

export type RetirementSpendingPhasePercents = {
  earlyRetirement: number;
  midRetirement: number;
  lateRetirement: number;
};

export type RetirementProjectionResult = {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  retirementStartAge: number;
  targetRetirementSpending: number;
  retirementSpendingInflationAdjusted: boolean;
  ageBasedSpendingEnabled: boolean;
  spendingPhasePercents: RetirementSpendingPhasePercents;
  rothContributionPercent: number;
  projectedBalanceAtRetirement: number;
  projectedTraditionalBalanceAtRetirement: number;
  projectedRothBalanceAtRetirement: number;
  inflationAdjustedBalanceAtRetirement: number;
  projectedBalanceAtLifeExpectancy: number;
  projectedBalanceAtLifeExpectancyTodayDollars: number;
  finalBalance: number;
  inflationAdjustedBalance: number;
  annualEmployeeContributionLimit: number;
  catchUpContributionLimit: number;
  superCatchUpContributionLimit: number;
  totalContributionLimit: number;
  compensationLimit: number;
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
  supportsSpendingGoal: boolean;
  depletionAge: number | null;
  lastsThroughLifeExpectancy: boolean;
  portfolioLastsUntilAge: number;
  retirementYearsFunded: number;
  totalRetirementYears: number;
  minimumPostRetirementBalance: number;
  finalShortfallAmount: number;
  projectedAnnualSpendAvailable: number;
  projectedAnnualTraditionalIncome: number;
  projectedAnnualRothIncome: number;
  yearlyProjection: YearlyProjectionEntry[];
  yearlyRetirementWithdrawals: RetirementWithdrawalEntry[];
};
