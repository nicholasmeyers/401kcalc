import type { InputField } from "@/lib/calculator/types";

export type FieldKind = "age" | "currency" | "percent";

export type FieldSliderConfig = {
  min: number;
  max: number;
  step: number;
};

export type CalculatorFieldConfig = {
  field: InputField;
  label: string;
  description: string;
  kind: FieldKind;
  slider?: FieldSliderConfig;
  tooltip?: string;
};

export const primaryFieldConfigs: CalculatorFieldConfig[] = [
  {
    field: "currentAge",
    label: "Current age",
    description: "Age today.",
    kind: "age",
  },
  {
    field: "retirementAge",
    label: "Retirement age",
    description: "Target age to stop full-time work.",
    kind: "age",
  },
  {
    field: "lifeExpectancy",
    label: "Life expectancy",
    description: "Age through which retirement withdrawals are modeled.",
    kind: "age",
    tooltip:
      "Age the calculator tests your plan through. If savings run out before this age, the plan falls short.",
  },
  {
    field: "currentBalance",
    label: "Current 401(k) balance",
    description: "Current invested account balance.",
    kind: "currency",
  },
  {
    field: "annualSalary",
    label: "Annual salary",
    description: "Pre-tax salary for contribution estimates.",
    kind: "currency",
  },
  {
    field: "contributionPercent",
    label: "Contribution percent",
    description: "Annual employee contribution rate.",
    kind: "percent",
    slider: {
      min: 0,
      max: 40,
      step: 0.1,
    },
  },
  {
    field: "employerMatchPercent",
    label: "Employer match percent",
    description: "Simplified flat match as a percent of salary.",
    kind: "percent",
  },
];

export const advancedFieldConfigs: CalculatorFieldConfig[] = [
  {
    field: "windfallAge",
    label: "Windfall age",
    description: "Age when a one-time windfall is added (optional if amount is 0).",
    kind: "age",
  },
  {
    field: "windfallAmount",
    label: "Windfall amount",
    description: "One-time additional contribution at the windfall age.",
    kind: "currency",
  },
  {
    field: "annualSalaryGrowthPercent",
    label: "Annual salary growth",
    description: "Expected yearly salary increase.",
    kind: "percent",
  },
  {
    field: "annualReturnPercent",
    label: "Annual return",
    description: "Expected long-run annual investment return.",
    kind: "percent",
    slider: {
      min: -5,
      max: 15,
      step: 0.1,
    },
  },
  {
    field: "inflationPercent",
    label: "Inflation",
    description: "Average yearly inflation assumption.",
    kind: "percent",
    slider: {
      min: -2,
      max: 10,
      step: 0.1,
    },
  },
  {
    field: "withdrawalRatePercent",
    label: "Withdrawal rate",
    description: "Percent withdrawn annually in retirement.",
    kind: "percent",
    tooltip:
      "Percent of your portfolio withdrawn each retirement year in the main projection scenario.",
    slider: {
      min: 0,
      max: 10,
      step: 0.1,
    },
  },
  {
    field: "targetRetirementSpending",
    label: "Target retirement spending",
    description: "Annual spending goal in retirement.",
    kind: "currency",
    tooltip: "Annual spending goal tested in the target-spending projection scenario.",
  },
];

export const allFieldConfigs: CalculatorFieldConfig[] = [...primaryFieldConfigs, ...advancedFieldConfigs];

export const allInputFields: InputField[] = allFieldConfigs.map((config) => config.field);
