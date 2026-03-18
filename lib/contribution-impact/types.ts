export type ContributionImpactInputs = {
  currentAge: number;
  retirementAge: number;
  annualSalary: number;
  contributionPercent: number;
  increaseContributionPercent: number;
  rothIncreaseAllocationPercent: number;
  annualReturnPercent: number;
};

export type NormalizedContributionImpactInputs = ContributionImpactInputs;

export type ContributionImpactField =
  | "currentAge"
  | "retirementAge"
  | "annualSalary"
  | "contributionPercent"
  | "increaseContributionPercent"
  | "rothIncreaseAllocationPercent"
  | "annualReturnPercent";

export type ContributionImpactValidationIssue = {
  field: ContributionImpactField | "general";
  message: string;
};

export type ContributionImpactScenarioKey = "one-year" | "five-years" | "until-retirement";

export type ContributionImpactYearEntry = {
  age: number;
  yearIndex: number;
  oneYearBalance: number;
  fiveYearBalance: number;
  untilRetirementBalance: number;
};

export type ContributionImpactScenarioResult = {
  key: ContributionImpactScenarioKey;
  label: string;
  contributionYears: number;
  contributionEndsAge: number | null;
  totalAdditionalContributions: number;
  totalInvestmentGrowth: number;
  additionalBalanceAtRetirement: number;
  additionalAnnualRetirementIncome: number;
  additionalMonthlyRetirementIncome: number;
};

export type ContributionImpactResult = {
  currentAge: number;
  retirementAge: number;
  annualSalary: number;
  contributionPercent: number;
  increaseContributionPercent: number;
  effectiveIncreaseContributionPercent: number;
  rothIncreaseAllocationPercent: number;
  traditionalIncreaseAllocationPercent: number;
  annualReturnPercent: number;
  yearsToRetirement: number;
  compensationLimit: number;
  currentContributionLimit: number;
  compensationLimitApplied: boolean;
  increaseClampedByLimit: boolean;
  currentAgeCatchUpEligible: boolean;
  futureCatchUpExcluded: boolean;
  currentAnnualContribution: number;
  requestedAdditionalContribution: number;
  additionalAnnualContribution: number;
  totalAnnualContribution: number;
  remainingContributionRoom: number;
  traditionalAdditionalContribution: number;
  rothAdditionalContribution: number;
  estimatedAnnualPayReduction: number;
  estimatedMonthlyPayReduction: number;
  estimatedTraditionalTaxOffsetRatePercent: number;
  retirementIncomeWithdrawalRatePercent: number;
  scenarios: ContributionImpactScenarioResult[];
  chartRows: ContributionImpactYearEntry[];
};
