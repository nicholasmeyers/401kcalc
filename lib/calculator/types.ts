export type CalculatorInputs = {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentBalance: number;
  annualSalary: number;
  contributionPercent: number;
  employerMatchPercent: number;
  annualSalaryGrowthPercent: number;
  annualReturnPercent: number;
  inflationPercent: number;
  withdrawalRatePercent: number;
  targetRetirementSpending: number;
  windfallAge: number;
  windfallAmount: number;
};

export type NormalizedCalculatorInputs = CalculatorInputs;

export type InputField = keyof CalculatorInputs;

export type ValidationIssue = {
  field: InputField | "general";
  message: string;
};

export type YearlyProjectionEntry = {
  age: number;
  yearIndex: number;
  salary: number;
  startingBalance: number;
  annualEmployeeContributionLimit: number;
  requestedEmployeeContribution: number;
  employeeContribution: number;
  employeeContributionCapped: boolean;
  catchUpContributionApplied: boolean;
  employerContribution: number;
  windfallAmount: number;
  totalContribution: number;
  investmentGrowth: number;
  withdrawalAmount: number;
  endingBalance: number;
  inflationAdjustedEndingBalance: number;
  isRetired: boolean;
};

export type RetirementProjectionResult = {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  targetRetirementSpending: number;
  finalBalance: number;
  inflationAdjustedBalance: number;
  annualEmployeeContributionLimit: number;
  catchUpContributionLimit: number;
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
  targetSpendingProjection: YearlyProjectionEntry[];
  targetSpendingRetirementSuccessful: boolean;
  targetSpendingDepletionAge?: number;
  targetSpendingPortfolioLastsUntilAge: number;
  targetSpendingPeakBalance: number;
  targetSpendingPeakBalanceAge: number;
};
