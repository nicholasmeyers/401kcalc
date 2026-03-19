import type { InputField } from "@/lib/calculator/types";

export type FieldKind = "age" | "currency" | "percent";

export type FieldSliderConfig = {
  min: number;
  max: number;
  step: number;
};

export type CalculatorFieldConfig<TField extends string = InputField> = {
  field: TField;
  label: string;
  description: string;
  kind: FieldKind;
  slider?: FieldSliderConfig;
  tooltip?: string;
};

export const retirementGoalFieldConfigs: CalculatorFieldConfig<InputField>[] = [
  {
    field: "currentAge",
    label: "Current age",
    description: "",
    kind: "age",
  },
  {
    field: "retirementAge",
    label: "Retirement age",
    description: "",
    kind: "age",
  },
  {
    field: "lifeExpectancy",
    label: "Life expectancy",
    description: "",
    kind: "age",
    tooltip: "The calculator checks whether your savings last through this age.",
  },
  {
    field: "targetRetirementSpending",
    label: "Annual retirement spending goal",
    description: "Target spending per year in retirement.",
    kind: "currency",
    tooltip:
      "Annual amount you want to spend in retirement in today's dollars. When inflation adjustment is on, withdrawals grow each year.",
  },
];

export const balanceFieldConfigs: CalculatorFieldConfig<InputField>[] = [
  {
    field: "currentBalance",
    label: "Total 401k balance",
    description: "Total current 401k balance across all accounts.",
    kind: "currency",
  },
  {
    field: "currentRothBalance",
    label: "Roth 401k balance",
    description: "Portion of total that is already in a Roth 401k.",
    kind: "currency",
    tooltip:
      "If part of your existing 401k is in a Roth account, enter that amount here. The rest is treated as traditional (pre-tax).",
  },
];

export const incomeFieldConfigs: CalculatorFieldConfig<InputField>[] = [
  {
    field: "annualSalary",
    label: "Annual salary",
    description: "Pre-tax salary for contribution estimates.",
    kind: "currency",
  },
];

export const contributionFieldConfigs: CalculatorFieldConfig<InputField>[] = [
  {
    field: "contributionPercent",
    label: "Contribution percent",
    description: "Percentage of salary you contribute each year.",
    kind: "percent",
    slider: {
      min: 0,
      max: 40,
      step: 1,
    },
  },
  {
    field: "employerMatchPercent",
    label: "Employer match percent",
    description: "Estimated employer contribution as a % of salary.",
    kind: "percent",
  },
];

export const rothStrategyFieldConfigs: CalculatorFieldConfig<InputField>[] = [
  {
    field: "rothContributionPercent",
    label: "Roth contribution %",
    description: "What percentage of your 401k contributions go to Roth instead of traditional.",
    kind: "percent",
    slider: {
      min: 0,
      max: 100,
      step: 1,
    },
    tooltip:
      "Traditional contributions reduce taxes now; Roth contributions create tax-free income in retirement.",
  },
];

export const advancedFieldConfigs: CalculatorFieldConfig<InputField>[] = [
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
    description: "Average annual investment return used in the projection.",
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
    description: "Average annual inflation used to adjust values to today's dollars.",
    kind: "percent",
    slider: {
      min: -2,
      max: 10,
      step: 0.1,
    },
  },
];

export const ageBasedSpendingFieldConfigs: CalculatorFieldConfig<InputField>[] = [
  {
    field: "earlyRetirementSpendingPercent",
    label: "Early retirement spending",
    description: "Percent of your base target spending used through age 74.",
    kind: "percent",
    slider: {
      min: 0,
      max: 150,
      step: 1,
    },
  },
  {
    field: "midRetirementSpendingPercent",
    label: "Mid retirement spending",
    description: "Percent of your base target spending used from ages 75 to 84.",
    kind: "percent",
    slider: {
      min: 0,
      max: 150,
      step: 1,
    },
  },
  {
    field: "lateRetirementSpendingPercent",
    label: "Late retirement spending",
    description: "Percent of your base target spending used from age 85 onward.",
    kind: "percent",
    slider: {
      min: 0,
      max: 150,
      step: 1,
    },
  },
];

export const allFieldConfigs: CalculatorFieldConfig<InputField>[] = [
  ...retirementGoalFieldConfigs,
  ...balanceFieldConfigs,
  ...incomeFieldConfigs,
  ...contributionFieldConfigs,
  ...rothStrategyFieldConfigs,
  ...advancedFieldConfigs,
  ...ageBasedSpendingFieldConfigs,
];

export const allInputFields: InputField[] = allFieldConfigs.map((config) => config.field);
