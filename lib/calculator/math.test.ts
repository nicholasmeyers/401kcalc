import { describe, expect, it } from "vitest";

import {
  CATCH_UP_CONTRIBUTION_LIMIT,
  DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT,
  defaultCalculatorInputs,
} from "@/lib/calculator/defaults";
import {
  CalculatorInputError,
  calculateRetirementProjection,
  normalizeInputs,
} from "@/lib/calculator/math";
import type { CalculatorInputs } from "@/lib/calculator/types";

const makeInputs = (overrides: Partial<CalculatorInputs> = {}): Partial<CalculatorInputs> => ({
  ...defaultCalculatorInputs,
  ...overrides,
});

const captureInputError = (overrides: Partial<CalculatorInputs>): CalculatorInputError => {
  try {
    calculateRetirementProjection(makeInputs(overrides));
  } catch (error) {
    expect(error).toBeInstanceOf(CalculatorInputError);
    return error as CalculatorInputError;
  }

  throw new Error("Expected CalculatorInputError to be thrown.");
};

describe("calculateRetirementProjection", () => {
  it("returns an expected result shape and positive totals for normal inputs", () => {
    const result = calculateRetirementProjection(makeInputs());

    expect(result).toEqual(
      expect.objectContaining({
        currentAge: expect.any(Number),
        retirementAge: expect.any(Number),
        lifeExpectancy: expect.any(Number),
        targetRetirementSpending: expect.any(Number),
        finalBalance: expect.any(Number),
        inflationAdjustedBalance: expect.any(Number),
        annualEmployeeContributionLimit: expect.any(Number),
        catchUpContributionLimit: expect.any(Number),
        employeeContributionCapped: expect.any(Boolean),
        catchUpContributionApplied: expect.any(Boolean),
        totalRequestedEmployeeContributions: expect.any(Number),
        totalEmployeeContributions: expect.any(Number),
        totalEmployerContributions: expect.any(Number),
        totalWindfallContributions: expect.any(Number),
        totalInvestmentGrowth: expect.any(Number),
        estimatedAnnualRetirementIncome: expect.any(Number),
        peakBalance: expect.any(Number),
        peakBalanceAge: expect.any(Number),
        portfolioLastsUntilAge: expect.any(Number),
        retirementSuccessful: expect.any(Boolean),
        yearlyProjection: expect.any(Array),
        targetSpendingProjection: expect.any(Array),
        targetSpendingRetirementSuccessful: expect.any(Boolean),
        targetSpendingPortfolioLastsUntilAge: expect.any(Number),
        targetSpendingPeakBalance: expect.any(Number),
        targetSpendingPeakBalanceAge: expect.any(Number),
      })
    );

    expect(result.yearlyProjection).toHaveLength(
      defaultCalculatorInputs.lifeExpectancy - defaultCalculatorInputs.currentAge
    );
    expect(result.finalBalance).toBeGreaterThan(defaultCalculatorInputs.currentBalance);
    expect(result.totalEmployeeContributions).toBeGreaterThan(0);
    expect(result.totalRequestedEmployeeContributions).toBeGreaterThan(0);
    expect(result.totalEmployerContributions).toBeGreaterThan(0);
    expect(result.totalWindfallContributions).toBe(0);
    expect(result.totalInvestmentGrowth).toBeGreaterThan(0);
    expect(result.targetSpendingProjection).toHaveLength(
      defaultCalculatorInputs.lifeExpectancy - defaultCalculatorInputs.currentAge
    );
    const firstRetirementRow = result.yearlyProjection.find((entry) => entry.isRetired);
    expect(firstRetirementRow).toBeDefined();
    expect(result.estimatedAnnualRetirementIncome).toBeCloseTo(firstRetirementRow!.withdrawalAmount, 10);
  });

  it("increasing contribution percent increases final balance", () => {
    const lowContributionResult = calculateRetirementProjection(makeInputs({ contributionPercent: 5 }));
    const highContributionResult = calculateRetirementProjection(makeInputs({ contributionPercent: 15 }));

    expect(highContributionResult.finalBalance).toBeGreaterThan(lowContributionResult.finalBalance);
  });

  it("caps employee contributions at the configured annual limit when requested contribution is too high", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 64,
        retirementAge: 66,
        lifeExpectancy: 66,
        currentBalance: 0,
        annualSalary: 300_000,
        contributionPercent: 20,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        withdrawalRatePercent: 0,
      })
    );

    const annualLimitWithCatchUp = DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT + CATCH_UP_CONTRIBUTION_LIMIT;

    expect(result.annualEmployeeContributionLimit).toBe(DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT);
    expect(result.catchUpContributionLimit).toBe(CATCH_UP_CONTRIBUTION_LIMIT);
    expect(result.employeeContributionCapped).toBe(true);
    expect(result.catchUpContributionApplied).toBe(true);
    expect(result.totalRequestedEmployeeContributions).toBe(60_000);
    expect(result.totalEmployeeContributions).toBe(annualLimitWithCatchUp);
    expect(result.finalBalance).toBe(annualLimitWithCatchUp);
    expect(result.yearlyProjection[0]?.requestedEmployeeContribution).toBe(60_000);
    expect(result.yearlyProjection[0]?.annualEmployeeContributionLimit).toBe(annualLimitWithCatchUp);
    expect(result.yearlyProjection[0]?.employeeContribution).toBe(annualLimitWithCatchUp);
    expect(result.yearlyProjection[0]?.employeeContributionCapped).toBe(true);
    expect(result.yearlyProjection[0]?.catchUpContributionApplied).toBe(true);
  });

  it("does not mark employee contributions as capped when requested contribution stays below the limit", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 64,
        retirementAge: 66,
        lifeExpectancy: 66,
        currentBalance: 0,
        annualSalary: 100_000,
        contributionPercent: 10,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        withdrawalRatePercent: 0,
      })
    );

    expect(result.employeeContributionCapped).toBe(false);
    expect(result.catchUpContributionApplied).toBe(true);
    expect(result.totalRequestedEmployeeContributions).toBe(10_000);
    expect(result.totalEmployeeContributions).toBe(10_000);
    expect(result.yearlyProjection[0]?.requestedEmployeeContribution).toBe(10_000);
    expect(result.yearlyProjection[0]?.employeeContribution).toBe(10_000);
    expect(result.yearlyProjection[0]?.employeeContributionCapped).toBe(false);
    expect(result.yearlyProjection[0]?.catchUpContributionApplied).toBe(true);
  });

  it("applies catch-up contribution limits beginning with projection years at age 50 and older", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 48,
        retirementAge: 52,
        lifeExpectancy: 52,
        currentBalance: 0,
        annualSalary: 300_000,
        contributionPercent: 20,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
      })
    );

    expect(result.yearlyProjection.map((entry) => entry.age)).toEqual([49, 50, 51, 52]);
    expect(result.yearlyProjection.map((entry) => entry.annualEmployeeContributionLimit)).toEqual([
      DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT,
      DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT + CATCH_UP_CONTRIBUTION_LIMIT,
      DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT + CATCH_UP_CONTRIBUTION_LIMIT,
      DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT + CATCH_UP_CONTRIBUTION_LIMIT,
    ]);
    expect(result.yearlyProjection.map((entry) => entry.catchUpContributionApplied)).toEqual([false, true, true, false]);
    expect(result.totalEmployeeContributions).toBe(
      DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT +
        (DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT + CATCH_UP_CONTRIBUTION_LIMIT) * 2
    );
    expect(result.yearlyProjection[3]?.isRetired).toBe(true);
    expect(result.yearlyProjection[3]?.employeeContribution).toBe(0);
  });

  it("applies a one-time windfall at the configured age", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 40,
        retirementAge: 43,
        lifeExpectancy: 43,
        currentBalance: 0,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        withdrawalRatePercent: 0,
        windfallAge: 42,
        windfallAmount: 50_000,
      })
    );

    expect(result.totalWindfallContributions).toBe(50_000);
    expect(result.finalBalance).toBe(50_000);
    expect(result.yearlyProjection.map((entry) => entry.windfallAmount)).toEqual([0, 50_000, 0]);
  });

  it("increasing annual return increases final balance", () => {
    const lowReturnResult = calculateRetirementProjection(makeInputs({ annualReturnPercent: 3 }));
    const highReturnResult = calculateRetirementProjection(makeInputs({ annualReturnPercent: 9 }));

    expect(highReturnResult.finalBalance).toBeGreaterThan(lowReturnResult.finalBalance);
  });

  it("increasing employer match percent increases employer contributions and final balance", () => {
    const lowMatchResult = calculateRetirementProjection(makeInputs({ employerMatchPercent: 0 }));
    const highMatchResult = calculateRetirementProjection(makeInputs({ employerMatchPercent: 8 }));

    expect(highMatchResult.totalEmployerContributions).toBeGreaterThan(lowMatchResult.totalEmployerContributions);
    expect(highMatchResult.finalBalance).toBeGreaterThan(lowMatchResult.finalBalance);
  });

  it("increasing inflation lowers the inflation-adjusted balance", () => {
    const lowInflationResult = calculateRetirementProjection(makeInputs({ inflationPercent: 0 }));
    const highInflationResult = calculateRetirementProjection(makeInputs({ inflationPercent: 6 }));

    expect(highInflationResult.inflationAdjustedBalance).toBeLessThan(lowInflationResult.inflationAdjustedBalance);
  });

  it("throws a CalculatorInputError when retirementAge is not greater than currentAge", () => {
    expect(() =>
      calculateRetirementProjection(makeInputs({ currentAge: 40, retirementAge: 40 }))
    ).toThrowError(CalculatorInputError);

    const error = captureInputError({ currentAge: 40, retirementAge: 40 });

    expect(error.issues).toEqual(expect.arrayContaining([expect.objectContaining({ field: "retirementAge" })]));
  });

  it("throws a CalculatorInputError when lifeExpectancy is below retirementAge", () => {
    const error = captureInputError({ currentAge: 40, retirementAge: 65, lifeExpectancy: 64 });

    expect(error.issues).toEqual(expect.arrayContaining([expect.objectContaining({ field: "lifeExpectancy" })]));
  });

  it("throws a CalculatorInputError for negative current balance", () => {
    const error = captureInputError({ currentBalance: -1 });

    expect(error.issues).toEqual(expect.arrayContaining([expect.objectContaining({ field: "currentBalance" })]));
  });

  it("throws a CalculatorInputError for negative target retirement spending", () => {
    const error = captureInputError({ targetRetirementSpending: -1 });

    expect(error.issues).toEqual(expect.arrayContaining([expect.objectContaining({ field: "targetRetirementSpending" })]));
  });

  it("throws when windfall amount is positive and windfall age is not in the projection window", () => {
    const error = captureInputError({
      windfallAmount: 10_000,
      windfallAge: defaultCalculatorInputs.lifeExpectancy + 1,
    });

    expect(error.issues).toEqual(expect.arrayContaining([expect.objectContaining({ field: "windfallAge" })]));
  });

  it.each([
    ["annualSalaryGrowthPercent", { annualSalaryGrowthPercent: -100 }],
    ["annualReturnPercent", { annualReturnPercent: -100 }],
    ["inflationPercent", { inflationPercent: -100 }],
  ] as const)("throws for %s values <= -100", (field, overrides) => {
    const error = captureInputError(overrides);

    expect(error.issues).toEqual(expect.arrayContaining([expect.objectContaining({ field })]));
  });

  it("falls back to defaults for malformed numeric inputs during normalization", () => {
    const baseline = calculateRetirementProjection(makeInputs());
    const malformedInputResult = calculateRetirementProjection({
      ...makeInputs(),
      annualSalary: Number.NaN as unknown as number,
      contributionPercent: Number.POSITIVE_INFINITY as unknown as number,
    });

    expect(malformedInputResult.finalBalance).toBeCloseTo(baseline.finalBalance, 10);
    expect(malformedInputResult.totalEmployeeContributions).toBeCloseTo(baseline.totalEmployeeContributions, 10);
  });

  it("handles zero current balance", () => {
    const result = calculateRetirementProjection(makeInputs({ currentBalance: 0 }));

    expect(result.yearlyProjection[0]?.startingBalance).toBe(0);
    expect(result.finalBalance).toBeGreaterThan(0);
  });

  it("handles zero contribution percent", () => {
    const result = calculateRetirementProjection(makeInputs({ contributionPercent: 0 }));

    expect(result.totalEmployeeContributions).toBe(0);
  });

  it("handles zero employer match percent", () => {
    const result = calculateRetirementProjection(makeInputs({ employerMatchPercent: 0 }));

    expect(result.totalEmployerContributions).toBe(0);
  });

  it("handles zero salary growth", () => {
    const result = calculateRetirementProjection(makeInputs({ annualSalaryGrowthPercent: 0 }));
    const salaries = result.yearlyProjection.filter((entry) => !entry.isRetired).map((entry) => entry.salary);

    expect(new Set(salaries).size).toBe(1);
    expect(salaries[0]).toBe(defaultCalculatorInputs.annualSalary);
  });

  it("handles zero inflation", () => {
    const result = calculateRetirementProjection(makeInputs({ inflationPercent: 0 }));

    expect(result.inflationAdjustedBalance).toBeCloseTo(result.finalBalance, 10);
    for (const row of result.yearlyProjection) {
      expect(row.inflationAdjustedEndingBalance).toBeCloseTo(row.endingBalance, 10);
    }
  });

  it("handles zero return", () => {
    const result = calculateRetirementProjection(makeInputs({ annualReturnPercent: 0 }));

    expect(result.totalInvestmentGrowth).toBe(0);
    for (const row of result.yearlyProjection) {
      expect(row.investmentGrowth).toBe(0);
    }
  });

  it("supports a one-year projection", () => {
    const result = calculateRetirementProjection(makeInputs({ currentAge: 64, retirementAge: 65, lifeExpectancy: 65 }));

    expect(result.yearlyProjection).toHaveLength(1);
    expect(result.yearlyProjection[0]?.age).toBe(65);
    expect(result.finalBalance).toBeCloseTo(result.yearlyProjection[0]!.endingBalance, 10);
  });

  it("applies yearly withdrawals after retirement and caps withdrawal at the remaining balance", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 64,
        retirementAge: 65,
        lifeExpectancy: 66,
        currentBalance: 100_000,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        withdrawalRatePercent: 10,
      })
    );

    expect(result.yearlyProjection).toHaveLength(2);
    expect(result.yearlyProjection[0]?.withdrawalAmount).toBe(10_000);
    expect(result.yearlyProjection[0]?.endingBalance).toBe(90_000);
    expect(result.yearlyProjection[1]?.withdrawalAmount).toBe(9_000);
    expect(result.yearlyProjection[1]?.endingBalance).toBe(81_000);
  });

  it("switches from accumulation to retirement behavior at retirement age", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 63,
        retirementAge: 65,
        lifeExpectancy: 65,
        currentBalance: 0,
        annualSalary: 100_000,
        contributionPercent: 10,
        employerMatchPercent: 4,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        withdrawalRatePercent: 10,
      })
    );

    const accumulationYear = result.yearlyProjection[0];
    const retirementYear = result.yearlyProjection[1];

    expect(accumulationYear?.age).toBe(64);
    expect(accumulationYear?.isRetired).toBe(false);
    expect(accumulationYear?.employeeContribution).toBe(10_000);
    expect(accumulationYear?.employerContribution).toBe(4_000);
    expect(accumulationYear?.withdrawalAmount).toBe(0);

    expect(retirementYear?.age).toBe(65);
    expect(retirementYear?.isRetired).toBe(true);
    expect(retirementYear?.employeeContribution).toBe(0);
    expect(retirementYear?.employerContribution).toBe(0);
    expect(retirementYear?.withdrawalAmount).toBe(1_400);
  });

  it("keeps estimated annual retirement income anchored to the first retirement year", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 64,
        retirementAge: 65,
        lifeExpectancy: 67,
        currentBalance: 0,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        withdrawalRatePercent: 100,
        windfallAge: 66,
        windfallAmount: 5_000,
      })
    );

    expect(result.yearlyProjection.map((entry) => entry.withdrawalAmount)).toEqual([0, 5_000, 0]);
    expect(result.estimatedAnnualRetirementIncome).toBe(0);
  });

  it("detects portfolio depletion and marks retirement as unsuccessful when depletion is before life expectancy", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 64,
        retirementAge: 65,
        lifeExpectancy: 67,
        currentBalance: 1_000,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        withdrawalRatePercent: 100,
      })
    );

    expect(result.depletionAge).toBe(65);
    expect(result.portfolioLastsUntilAge).toBe(65);
    expect(result.retirementSuccessful).toBe(false);
    expect(result.yearlyProjection[0]?.withdrawalAmount).toBe(1_000);
    expect(result.yearlyProjection[0]?.endingBalance).toBe(0);
  });

  it("models fixed annual target retirement spending withdrawals and caps to available balance", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 64,
        retirementAge: 65,
        lifeExpectancy: 66,
        currentBalance: 100_000,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        withdrawalRatePercent: 1,
        targetRetirementSpending: 60_000,
      })
    );

    expect(result.targetSpendingProjection).toHaveLength(2);
    expect(result.targetSpendingProjection[0]?.withdrawalAmount).toBe(60_000);
    expect(result.targetSpendingProjection[0]?.endingBalance).toBe(40_000);
    expect(result.targetSpendingProjection[1]?.withdrawalAmount).toBe(40_000);
    expect(result.targetSpendingProjection[1]?.endingBalance).toBe(0);
    expect(result.targetSpendingDepletionAge).toBe(66);
    expect(result.targetSpendingPortfolioLastsUntilAge).toBe(66);
  });

  it("marks target spending as unsuccessful when fixed spending exceeds sustainable retirement income", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 64,
        retirementAge: 65,
        lifeExpectancy: 68,
        currentBalance: 200_000,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        withdrawalRatePercent: 4,
        targetRetirementSpending: 120_000,
      })
    );

    expect(result.estimatedAnnualRetirementIncome).toBe(8_000);
    expect(result.retirementSuccessful).toBe(true);
    expect(result.targetSpendingRetirementSuccessful).toBe(false);
    expect(result.targetSpendingPortfolioLastsUntilAge).toBe(66);
    expect(result.targetSpendingDepletionAge).toBe(66);
  });

  it("applies windfalls to the fixed-spending target projection path", () => {
    const baseResult = calculateRetirementProjection(
      makeInputs({
        currentAge: 40,
        retirementAge: 41,
        lifeExpectancy: 44,
        currentBalance: 25_000,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        withdrawalRatePercent: 0,
        targetRetirementSpending: 10_000,
      })
    );
    const windfallResult = calculateRetirementProjection(
      makeInputs({
        currentAge: 40,
        retirementAge: 41,
        lifeExpectancy: 44,
        currentBalance: 25_000,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        withdrawalRatePercent: 0,
        targetRetirementSpending: 10_000,
        windfallAge: 42,
        windfallAmount: 30_000,
      })
    );

    expect(baseResult.targetSpendingProjection.map((entry) => entry.endingBalance)).toEqual([15_000, 5_000, 0, 0]);
    expect(windfallResult.targetSpendingProjection.map((entry) => entry.endingBalance)).toEqual([
      15_000, 35_000, 25_000, 15_000,
    ]);
    expect(windfallResult.targetSpendingPortfolioLastsUntilAge).toBe(44);
    expect(windfallResult.targetSpendingRetirementSuccessful).toBe(true);
  });

  it("marks retirement as successful when depletion happens at life expectancy", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 64,
        retirementAge: 65,
        lifeExpectancy: 65,
        currentBalance: 1_000,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        withdrawalRatePercent: 100,
      })
    );

    expect(result.depletionAge).toBe(65);
    expect(result.portfolioLastsUntilAge).toBe(65);
    expect(result.retirementSuccessful).toBe(true);
  });
});

describe("normalizeInputs", () => {
  it("returns defaults when no input is provided", () => {
    expect(normalizeInputs()).toEqual(defaultCalculatorInputs);
  });

  it("merges defaults and preserves provided values", () => {
    const normalized = normalizeInputs({ currentAge: 45, contributionPercent: 12, inflationPercent: 3 });

    expect(normalized.currentAge).toBe(45);
    expect(normalized.contributionPercent).toBe(12);
    expect(normalized.inflationPercent).toBe(3);
    expect(normalized.retirementAge).toBe(defaultCalculatorInputs.retirementAge);
    expect(normalized.annualSalary).toBe(defaultCalculatorInputs.annualSalary);
  });

  it("uses defaults for non-finite or malformed numeric values", () => {
    const normalized = normalizeInputs({
      annualSalary: Number.NaN as unknown as number,
      annualReturnPercent: Number.NEGATIVE_INFINITY as unknown as number,
      inflationPercent: "2.5" as unknown as number,
      targetRetirementSpending: Number.POSITIVE_INFINITY as unknown as number,
    });

    expect(normalized.annualSalary).toBe(defaultCalculatorInputs.annualSalary);
    expect(normalized.annualReturnPercent).toBe(defaultCalculatorInputs.annualReturnPercent);
    expect(normalized.inflationPercent).toBe(defaultCalculatorInputs.inflationPercent);
    expect(normalized.targetRetirementSpending).toBe(defaultCalculatorInputs.targetRetirementSpending);
  });
});
