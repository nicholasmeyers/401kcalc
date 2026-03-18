import type { CalculatorFieldConfig } from "@/components/calculator/field-config";
import type { ContributionImpactField } from "@/lib/contribution-impact/types";

export const timelineFieldConfigs: CalculatorFieldConfig<ContributionImpactField>[] = [
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
];

export const incomeFieldConfigs: CalculatorFieldConfig<ContributionImpactField>[] = [
  {
    field: "annualSalary",
    label: "Annual salary",
    description: "Pre-tax salary used to estimate the extra contribution dollars.",
    kind: "currency",
  },
];

export const contributionFieldConfigs: CalculatorFieldConfig<ContributionImpactField>[] = [
  {
    field: "contributionPercent",
    label: "Current contribution %",
    description: "Your current employee 401(k) contribution rate.",
    kind: "percent",
    slider: {
      min: 0,
      max: 30,
      step: 1,
    },
  },
  {
    field: "increaseContributionPercent",
    label: "Increase contribution by",
    description: "Only the extra percentage points are modeled in this calculator.",
    kind: "percent",
    slider: {
      min: 0,
      max: 10,
      step: 1,
    },
    tooltip: "A 2% increase means moving from 10% to 12%, not contributing 2% total.",
  },
];

export const assumptionFieldConfigs: CalculatorFieldConfig<ContributionImpactField>[] = [
  {
    field: "annualReturnPercent",
    label: "Annual return",
    description: "Average annual return assumption applied only to the extra dollars.",
    kind: "percent",
    slider: {
      min: -5,
      max: 15,
      step: 0.1,
    },
  },
];

export const allContributionImpactFields: ContributionImpactField[] = [
  ...timelineFieldConfigs.map((config) => config.field),
  ...incomeFieldConfigs.map((config) => config.field),
  ...contributionFieldConfigs.map((config) => config.field),
  ...assumptionFieldConfigs.map((config) => config.field),
];
