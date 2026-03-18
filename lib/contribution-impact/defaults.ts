import {
  DEFAULT_ANNUAL_RETURN_PERCENT,
  DEFAULT_ANNUAL_SALARY,
  DEFAULT_CONTRIBUTION_PERCENT,
  DEFAULT_CURRENT_AGE,
  DEFAULT_RETIREMENT_AGE,
} from "@/lib/calculator/defaults";
import type { ContributionImpactInputs } from "@/lib/contribution-impact/types";

export const DEFAULT_CONTRIBUTION_INCREASE_PERCENT = 2;
export const DEFAULT_ROTH_INCREASE_ALLOCATION_PERCENT = 0;
export const RETIREMENT_INCOME_WITHDRAWAL_RATE_PERCENT = 4;
export const ESTIMATED_TRADITIONAL_TAX_OFFSET_RATE_PERCENT = 22;
export const CONTRIBUTION_INCREASE_QUICK_SELECTS = [1, 2, 3, 5] as const;
export const INCREASE_ALLOCATION_PRESETS = [0, 25, 50, 75, 100] as const;

export const defaultContributionImpactInputs: ContributionImpactInputs = {
  currentAge: DEFAULT_CURRENT_AGE,
  retirementAge: DEFAULT_RETIREMENT_AGE,
  annualSalary: DEFAULT_ANNUAL_SALARY,
  contributionPercent: DEFAULT_CONTRIBUTION_PERCENT,
  increaseContributionPercent: DEFAULT_CONTRIBUTION_INCREASE_PERCENT,
  rothIncreaseAllocationPercent: DEFAULT_ROTH_INCREASE_ALLOCATION_PERCENT,
  annualReturnPercent: DEFAULT_ANNUAL_RETURN_PERCENT,
};
