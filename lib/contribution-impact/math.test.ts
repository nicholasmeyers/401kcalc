import { describe, expect, it } from "vitest";

import {
  ESTIMATED_TRADITIONAL_TAX_OFFSET_RATE_PERCENT,
  RETIREMENT_INCOME_WITHDRAWAL_RATE_PERCENT,
  defaultContributionImpactInputs,
} from "@/lib/contribution-impact/defaults";
import {
  ContributionImpactInputError,
  calculateContributionImpact,
} from "@/lib/contribution-impact/math";
import type { ContributionImpactInputs } from "@/lib/contribution-impact/types";
import { getAnnualEmployeeContributionLimit } from "@/lib/calculator/math";

const makeInputs = (overrides: Partial<ContributionImpactInputs> = {}): Partial<ContributionImpactInputs> => ({
  ...defaultContributionImpactInputs,
  ...overrides,
});

describe("calculateContributionImpact", () => {
  it("returns the expected result shape for valid inputs", () => {
    const result = calculateContributionImpact(makeInputs());

    expect(result).toEqual(
      expect.objectContaining({
        currentAge: expect.any(Number),
        retirementAge: expect.any(Number),
        annualSalary: expect.any(Number),
        contributionPercent: expect.any(Number),
        increaseContributionPercent: expect.any(Number),
        effectiveIncreaseContributionPercent: expect.any(Number),
        rothIncreaseAllocationPercent: expect.any(Number),
        annualReturnPercent: expect.any(Number),
        yearsToRetirement: expect.any(Number),
        additionalAnnualContribution: expect.any(Number),
        estimatedAnnualPayReduction: expect.any(Number),
        estimatedMonthlyPayReduction: expect.any(Number),
        scenarios: expect.any(Array),
        chartRows: expect.any(Array),
      })
    );

    expect(result.scenarios).toHaveLength(3);
    expect(result.chartRows).toHaveLength(
      defaultContributionImpactInputs.retirementAge - defaultContributionImpactInputs.currentAge + 1
    );
  });

  it("shows more impact when the increase is kept longer", () => {
    const result = calculateContributionImpact(makeInputs());
    const oneYear = result.scenarios.find((scenario) => scenario.key === "one-year");
    const fiveYears = result.scenarios.find((scenario) => scenario.key === "five-years");
    const untilRetirement = result.scenarios.find((scenario) => scenario.key === "until-retirement");

    expect(oneYear?.additionalBalanceAtRetirement ?? 0).toBeGreaterThan(0);
    expect(fiveYears?.additionalBalanceAtRetirement ?? 0).toBeGreaterThan(oneYear?.additionalBalanceAtRetirement ?? 0);
    expect(untilRetirement?.additionalBalanceAtRetirement ?? 0).toBeGreaterThan(
      fiveYears?.additionalBalanceAtRetirement ?? 0
    );
  });

  it("caps the added contribution when the current rate is already at the IRS limit", () => {
    const result = calculateContributionImpact(
      makeInputs({
        currentAge: 45,
        retirementAge: 50,
        annualSalary: 400_000,
        contributionPercent: 20,
        increaseContributionPercent: 5,
        annualReturnPercent: 0,
      })
    );

    expect(result.additionalAnnualContribution).toBe(0);
    expect(result.estimatedAnnualPayReduction).toBe(0);
    expect(result.increaseClampedByLimit).toBe(true);
    expect(result.compensationLimitApplied).toBe(true);
  });

  it("freezes the employee contribution cap at the current age", () => {
    const result = calculateContributionImpact(
      makeInputs({
        currentAge: 48,
        retirementAge: 55,
        annualSalary: 240_000,
        contributionPercent: 9.8,
        increaseContributionPercent: 4,
        annualReturnPercent: 0,
      })
    );

    expect(result.currentContributionLimit).toBe(getAnnualEmployeeContributionLimit(48));
    expect(result.futureCatchUpExcluded).toBe(true);
    expect(result.currentAgeCatchUpEligible).toBe(false);
    expect(result.additionalAnnualContribution).toBe(980);
    expect(result.effectiveIncreaseContributionPercent).toBeCloseTo(980 / 240_000 * 100, 8);
    expect(result.scenarios.find((scenario) => scenario.key === "until-retirement")?.totalAdditionalContributions).toBe(
      980 * (55 - 48)
    );
  });

  it("uses the current-age catch-up limit immediately when already eligible", () => {
    const result = calculateContributionImpact(
      makeInputs({
        currentAge: 55,
        retirementAge: 60,
        annualSalary: 300_000,
        contributionPercent: 10,
        increaseContributionPercent: 5,
        annualReturnPercent: 0,
      })
    );

    expect(result.currentAgeCatchUpEligible).toBe(true);
    expect(result.futureCatchUpExcluded).toBe(false);
    expect(result.currentContributionLimit).toBe(getAnnualEmployeeContributionLimit(55));
    expect(result.currentAnnualContribution).toBe(30_000);
    expect(result.additionalAnnualContribution).toBe(2_500);
    expect(result.totalAnnualContribution).toBe(getAnnualEmployeeContributionLimit(55));
  });

  it("returns zero added impact when there is no runway to retirement", () => {
    const result = calculateContributionImpact(
      makeInputs({
        currentAge: 65,
        retirementAge: 65,
        increaseContributionPercent: 5,
      })
    );

    expect(result.yearsToRetirement).toBe(0);
    expect(result.scenarios.every((scenario) => scenario.additionalBalanceAtRetirement === 0)).toBe(true);
  });

  it("uses the configured withdrawal-rate estimate for retirement income", () => {
    const result = calculateContributionImpact(
      makeInputs({
        currentAge: 35,
        retirementAge: 36,
        annualSalary: 100_000,
        contributionPercent: 10,
        increaseContributionPercent: 2,
        annualReturnPercent: 0,
      })
    );

    const untilRetirement = result.scenarios.find((scenario) => scenario.key === "until-retirement");
    expect(untilRetirement).toBeDefined();
    expect(untilRetirement?.additionalAnnualRetirementIncome).toBe(
      (untilRetirement?.additionalBalanceAtRetirement ?? 0) * (RETIREMENT_INCOME_WITHDRAWAL_RATE_PERCENT / 100)
    );
  });

  it("adjusts paycheck impact based on Roth versus traditional allocation", () => {
    const result = calculateContributionImpact(
      makeInputs({
        currentAge: 35,
        retirementAge: 65,
        annualSalary: 100_000,
        contributionPercent: 10,
        increaseContributionPercent: 2,
        rothIncreaseAllocationPercent: 25,
        annualReturnPercent: 0,
      })
    );

    expect(result.traditionalAdditionalContribution).toBe(1_500);
    expect(result.rothAdditionalContribution).toBe(500);
    expect(result.estimatedAnnualPayReduction).toBe(
      500 + 1_500 * (1 - ESTIMATED_TRADITIONAL_TAX_OFFSET_RATE_PERCENT / 100)
    );
  });

  it("throws on invalid inputs", () => {
    expect(() =>
      calculateContributionImpact(
        makeInputs({
          retirementAge: 20,
          currentAge: 30,
        })
      )
    ).toThrow(ContributionImpactInputError);
  });
});
