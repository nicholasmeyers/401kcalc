import { describe, expect, it } from "vitest";

import {
  CATCH_UP_CONTRIBUTION_LIMIT,
  COMPENSATION_LIMIT,
  DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT,
  SUPER_CATCH_UP_CONTRIBUTION_LIMIT,
  TOTAL_CONTRIBUTION_LIMIT,
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
  it("returns the expected result shape for valid inputs", () => {
    const result = calculateRetirementProjection(makeInputs());

    expect(result).toEqual(
      expect.objectContaining({
        currentAge: expect.any(Number),
        retirementAge: expect.any(Number),
        lifeExpectancy: expect.any(Number),
        retirementStartAge: expect.any(Number),
        targetRetirementSpending: expect.any(Number),
        retirementSpendingInflationAdjusted: expect.any(Boolean),
        ageBasedSpendingEnabled: expect.any(Boolean),
        spendingPhasePercents: expect.any(Object),
        currentRothBalance: expect.any(Number),
        rothContributionPercent: expect.any(Number),
        projectedBalanceAtRetirement: expect.any(Number),
        projectedTraditionalBalanceAtRetirement: expect.any(Number),
        projectedRothBalanceAtRetirement: expect.any(Number),
        inflationAdjustedBalanceAtRetirement: expect.any(Number),
        projectedBalanceAtLifeExpectancy: expect.any(Number),
        projectedBalanceAtLifeExpectancyTodayDollars: expect.any(Number),
        finalBalance: expect.any(Number),
        inflationAdjustedBalance: expect.any(Number),
        annualEmployeeContributionLimit: expect.any(Number),
        catchUpContributionLimit: expect.any(Number),
        superCatchUpContributionLimit: expect.any(Number),
        totalContributionLimit: expect.any(Number),
        compensationLimit: expect.any(Number),
        employeeContributionCapped: expect.any(Boolean),
        catchUpContributionApplied: expect.any(Boolean),
        compensationLimitApplied: expect.any(Boolean),
        totalContributionLimitApplied: expect.any(Boolean),
        totalRequestedEmployeeContributions: expect.any(Number),
        totalEmployeeContributions: expect.any(Number),
        totalTraditionalEmployeeContributions: expect.any(Number),
        totalRothEmployeeContributions: expect.any(Number),
        totalEmployerContributions: expect.any(Number),
        totalWindfallContributions: expect.any(Number),
        totalInvestmentGrowth: expect.any(Number),
        supportsSpendingGoal: expect.any(Boolean),
        lastsThroughLifeExpectancy: expect.any(Boolean),
        portfolioLastsUntilAge: expect.any(Number),
        retirementYearsFunded: expect.any(Number),
        totalRetirementYears: expect.any(Number),
        minimumPostRetirementBalance: expect.any(Number),
        finalShortfallAmount: expect.any(Number),
        projectedAnnualSpendAvailable: expect.any(Number),
        projectedAnnualTraditionalIncome: expect.any(Number),
        projectedAnnualRothIncome: expect.any(Number),
        yearlyProjection: expect.any(Array),
        yearlyRetirementWithdrawals: expect.any(Array),
      })
    );

    expect(result.yearlyProjection).toHaveLength(
      defaultCalculatorInputs.lifeExpectancy - defaultCalculatorInputs.currentAge + 1
    );
    expect(result.projectedBalanceAtRetirement).toBeGreaterThanOrEqual(defaultCalculatorInputs.currentBalance);
    expect(result.projectedBalanceAtLifeExpectancy).toBe(result.finalBalance);
    expect(result.projectedBalanceAtLifeExpectancyTodayDollars).toBe(result.inflationAdjustedBalance);
    expect(result.yearlyProjection[0]).toEqual(
      expect.objectContaining({
        age: defaultCalculatorInputs.currentAge,
        yearIndex: 0,
        endingBalance: defaultCalculatorInputs.currentBalance,
      })
    );
  });

  it("caps employee contributions at IRS limits and applies catch-up limits at age 50+", () => {
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
        targetRetirementSpending: 0,
      })
    );

    const annualLimitWithCatchUp = DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT + CATCH_UP_CONTRIBUTION_LIMIT;
    const firstAccumulationYear = result.yearlyProjection[1];

    expect(result.annualEmployeeContributionLimit).toBe(DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT);
    expect(result.catchUpContributionLimit).toBe(CATCH_UP_CONTRIBUTION_LIMIT);
    expect(result.employeeContributionCapped).toBe(true);
    expect(result.catchUpContributionApplied).toBe(true);
    expect(result.totalRequestedEmployeeContributions).toBe(60_000);
    expect(result.totalEmployeeContributions).toBe(annualLimitWithCatchUp);
    expect(result.finalBalance).toBe(annualLimitWithCatchUp);
    expect(firstAccumulationYear?.requestedEmployeeContribution).toBe(60_000);
    expect(firstAccumulationYear?.annualEmployeeContributionLimit).toBe(annualLimitWithCatchUp);
    expect(firstAccumulationYear?.employeeContribution).toBe(annualLimitWithCatchUp);
    expect(firstAccumulationYear?.employeeContributionCapped).toBe(true);
    expect(firstAccumulationYear?.catchUpContributionApplied).toBe(true);
  });

  it("does not mark contributions as capped when requested amounts are below IRS limits", () => {
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
        targetRetirementSpending: 0,
      })
    );

    expect(result.employeeContributionCapped).toBe(false);
    expect(result.catchUpContributionApplied).toBe(true);
    expect(result.totalRequestedEmployeeContributions).toBe(10_000);
    expect(result.totalEmployeeContributions).toBe(10_000);
    expect(result.yearlyProjection[1]?.employeeContributionCapped).toBe(false);
  });

  it("applies catch-up limits beginning in projection years at age 50 and older", () => {
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
        targetRetirementSpending: 0,
      })
    );

    expect(result.yearlyProjection.map((entry) => entry.age)).toEqual([48, 49, 50, 51, 52]);
    expect(result.yearlyProjection.slice(1).map((entry) => entry.annualEmployeeContributionLimit)).toEqual([
      DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT,
      DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT + CATCH_UP_CONTRIBUTION_LIMIT,
      DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT + CATCH_UP_CONTRIBUTION_LIMIT,
      DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT + CATCH_UP_CONTRIBUTION_LIMIT,
    ]);
    expect(result.yearlyProjection.slice(1).map((entry) => entry.catchUpContributionApplied)).toEqual([
      false,
      true,
      true,
      false,
    ]);
    expect(result.totalEmployeeContributions).toBe(
      DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT +
        (DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT + CATCH_UP_CONTRIBUTION_LIMIT) * 2
    );
  });

  it("applies the super catch-up tier for ages 60 through 63", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 59,
        retirementAge: 64,
        lifeExpectancy: 64,
        currentBalance: 0,
        annualSalary: 300_000,
        contributionPercent: 20,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        targetRetirementSpending: 0,
      })
    );

    const annualLimitWithSuperCatchUp =
      DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT + SUPER_CATCH_UP_CONTRIBUTION_LIMIT;

    expect(result.superCatchUpContributionLimit).toBe(SUPER_CATCH_UP_CONTRIBUTION_LIMIT);
    expect(result.yearlyProjection.slice(1, 5).map((entry) => entry.age)).toEqual([60, 61, 62, 63]);
    expect(result.yearlyProjection.slice(1, 5).map((entry) => entry.annualEmployeeContributionLimit)).toEqual([
      annualLimitWithSuperCatchUp,
      annualLimitWithSuperCatchUp,
      annualLimitWithSuperCatchUp,
      annualLimitWithSuperCatchUp,
    ]);
    expect(result.yearlyProjection.slice(1, 5).map((entry) => entry.employeeContributionCapReason)).toEqual([
      "super-catch-up-limit",
      "super-catch-up-limit",
      "super-catch-up-limit",
      "super-catch-up-limit",
    ]);
    expect(result.totalEmployeeContributions).toBe(annualLimitWithSuperCatchUp * 4);
  });

  it("applies the IRS compensation cap to contribution calculations", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 40,
        retirementAge: 42,
        lifeExpectancy: 42,
        currentBalance: 0,
        annualSalary: 500_000,
        contributionPercent: 10,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        targetRetirementSpending: 0,
      })
    );

    expect(result.compensationLimitApplied).toBe(true);
    expect(result.totalRequestedEmployeeContributions).toBe(50_000);
    expect(result.totalEmployeeContributions).toBe(DEFAULT_ANNUAL_EMPLOYEE_CONTRIBUTION_LIMIT);
    expect(result.yearlyProjection[1]?.salary).toBe(500_000);
    expect(result.yearlyProjection[1]?.salaryUsedForContributionCalculations).toBe(COMPENSATION_LIMIT);
    expect(result.yearlyProjection[1]?.compensationLimitApplied).toBe(true);
    expect(result.yearlyProjection[1]?.employeeContributionCapReason).toBe("base-limit");
  });

  it("enforces the annual employee + employer total contribution cap", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 45,
        retirementAge: 47,
        lifeExpectancy: 47,
        currentBalance: 0,
        annualSalary: 360_000,
        contributionPercent: 40,
        employerMatchPercent: 20,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        targetRetirementSpending: 0,
      })
    );

    expect(result.totalContributionLimit).toBe(TOTAL_CONTRIBUTION_LIMIT);
    expect(result.totalContributionLimitApplied).toBe(true);
    expect(result.totalEmployeeContributions).toBe(0);
    expect(result.totalEmployerContributions).toBe(TOTAL_CONTRIBUTION_LIMIT);
    expect(result.yearlyProjection[1]?.employeeContributionCapReason).toBe("total-limit");
    expect(result.yearlyProjection[1]?.totalContributionLimitApplied).toBe(true);
    expect(result.yearlyProjection[1]?.totalContribution).toBe(TOTAL_CONTRIBUTION_LIMIT);
  });

  it("applies one-time windfalls at the configured age, including retirement years", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 40,
        retirementAge: 41,
        lifeExpectancy: 43,
        currentBalance: 0,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        targetRetirementSpending: 0,
        windfallAge: 42,
        windfallAmount: 50_000,
      })
    );

    expect(result.totalWindfallContributions).toBe(50_000);
    expect(result.finalBalance).toBe(50_000);
    expect(result.yearlyProjection.map((entry) => entry.windfallAmount)).toEqual([0, 0, 50_000, 0]);
  });

  it("simulates flat retirement spending year by year and identifies depletion age", () => {
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
        retirementSpendingInflationAdjusted: false,
        targetRetirementSpending: 60_000,
      })
    );

    expect(result.yearlyProjection).toHaveLength(3);
    expect(result.yearlyProjection[1]?.requestedWithdrawalAmount).toBe(60_000);
    expect(result.yearlyProjection[1]?.withdrawalAmount).toBe(60_000);
    expect(result.yearlyProjection[1]?.endingBalance).toBe(40_000);
    expect(result.yearlyProjection[2]?.requestedWithdrawalAmount).toBe(60_000);
    expect(result.yearlyProjection[2]?.withdrawalAmount).toBe(40_000);
    expect(result.yearlyProjection[2]?.spendingShortfall).toBe(true);
    expect(result.yearlyProjection[2]?.spendingShortfallAmount).toBe(20_000);
    expect(result.supportsSpendingGoal).toBe(false);
    expect(result.lastsThroughLifeExpectancy).toBe(false);
    expect(result.depletionAge).toBe(66);
    expect(result.portfolioLastsUntilAge).toBe(66);
    expect(result.finalShortfallAmount).toBe(20_000);
  });

  it("applies inflation adjustments to retirement spending when enabled", () => {
    const inflationAdjusted = calculateRetirementProjection(
      makeInputs({
        currentAge: 64,
        retirementAge: 65,
        lifeExpectancy: 67,
        currentBalance: 100_000,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 10,
        retirementSpendingInflationAdjusted: true,
        targetRetirementSpending: 10_000,
      })
    );

    const flatSpending = calculateRetirementProjection(
      makeInputs({
        currentAge: 64,
        retirementAge: 65,
        lifeExpectancy: 67,
        currentBalance: 100_000,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 10,
        retirementSpendingInflationAdjusted: false,
        targetRetirementSpending: 10_000,
      })
    );

    expect(
      inflationAdjusted.yearlyProjection
        .filter((entry) => entry.isRetired && entry.yearIndex > 0)
        .map((entry) => Math.round(entry.requestedWithdrawalAmount))
    ).toEqual([10_000, 11_000, 12_100]);
    expect(
      flatSpending.yearlyProjection
        .filter((entry) => entry.isRetired && entry.yearIndex > 0)
        .map((entry) => Math.round(entry.requestedWithdrawalAmount))
    ).toEqual([10_000, 10_000, 10_000]);
  });

  it("supports age-based retirement spending phases", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 73,
        retirementAge: 74,
        lifeExpectancy: 76,
        currentBalance: 100_000,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        retirementSpendingInflationAdjusted: false,
        ageBasedSpendingEnabled: true,
        earlyRetirementSpendingPercent: 100,
        midRetirementSpendingPercent: 50,
        lateRetirementSpendingPercent: 50,
        targetRetirementSpending: 20_000,
      })
    );

    const retirementRows = result.yearlyProjection.filter((entry) => entry.isRetired && entry.yearIndex > 0);

    expect(retirementRows.map((entry) => entry.requestedWithdrawalAmount)).toEqual([20_000, 10_000, 10_000]);
    expect(retirementRows.map((entry) => entry.spendingPhaseMultiplier)).toEqual([1, 0.5, 0.5]);
    expect(result.supportsSpendingGoal).toBe(true);
    expect(result.lastsThroughLifeExpectancy).toBe(true);
    expect(result.depletionAge).toBeNull();
  });

  it("allows retirement age equal to current age", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 40,
        retirementAge: 40,
        lifeExpectancy: 42,
        currentBalance: 100_000,
        annualSalary: 80_000,
        contributionPercent: 12,
        employerMatchPercent: 4,
        annualSalaryGrowthPercent: 3,
        annualReturnPercent: 0,
        inflationPercent: 0,
        targetRetirementSpending: 10_000,
      })
    );

    const retirementRows = result.yearlyProjection.filter((entry) => entry.isRetired && entry.yearIndex > 0);

    expect(result.projectedBalanceAtRetirement).toBe(100_000);
    expect(result.yearlyProjection[0]?.age).toBe(40);
    expect(retirementRows.map((entry) => entry.withdrawalAmount)).toEqual([10_000, 10_000]);
    expect(result.totalEmployeeContributions).toBe(0);
    expect(result.totalEmployerContributions).toBe(0);
  });

  it("treats a zero spending goal as fully funded through the horizon", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 64,
        retirementAge: 65,
        lifeExpectancy: 67,
        currentBalance: 5_000,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: -50,
        inflationPercent: 0,
        targetRetirementSpending: 0,
      })
    );

    expect(result.supportsSpendingGoal).toBe(true);
    expect(result.lastsThroughLifeExpectancy).toBe(true);
    expect(result.depletionAge).toBeNull();
    expect(result.finalShortfallAmount).toBe(0);
  });

  it("keeps inflation-adjusted balances consistent with nominal values", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 50,
        retirementAge: 52,
        lifeExpectancy: 53,
        currentBalance: 100_000,
        annualSalary: 0,
        contributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 5,
        targetRetirementSpending: 0,
      })
    );

    for (const entry of result.yearlyProjection) {
      const expected = entry.yearIndex <= 0 ? entry.endingBalance : entry.endingBalance / Math.pow(1.05, entry.yearIndex);
      expect(entry.inflationAdjustedEndingBalance).toBeCloseTo(expected, 6);
    }
  });

  it("throws for invalid spending-phase settings when age-based mode is enabled", () => {
    const error = captureInputError({
      ageBasedSpendingEnabled: true,
      earlyRetirementSpendingPercent: 0,
      midRetirementSpendingPercent: 0,
      lateRetirementSpendingPercent: 0,
    });

    expect(error.issues).toEqual(expect.arrayContaining([expect.objectContaining({ field: "lateRetirementSpendingPercent" })]));
  });

  it("throws a CalculatorInputError when retirementAge is less than currentAge", () => {
    expect(() =>
      calculateRetirementProjection(makeInputs({ currentAge: 40, retirementAge: 39 }))
    ).toThrowError(CalculatorInputError);

    const error = captureInputError({ currentAge: 40, retirementAge: 39 });

    expect(error.issues).toEqual(expect.arrayContaining([expect.objectContaining({ field: "retirementAge" })]));
  });

  it("throws for invalid rate assumptions <= -100", () => {
    const annualReturnError = captureInputError({ annualReturnPercent: -100 });
    expect(annualReturnError.issues).toEqual(expect.arrayContaining([expect.objectContaining({ field: "annualReturnPercent" })]));

    const inflationError = captureInputError({ inflationPercent: -100 });
    expect(inflationError.issues).toEqual(expect.arrayContaining([expect.objectContaining({ field: "inflationPercent" })]));

    const salaryGrowthError = captureInputError({ annualSalaryGrowthPercent: -100 });
    expect(salaryGrowthError.issues).toEqual(expect.arrayContaining([expect.objectContaining({ field: "annualSalaryGrowthPercent" })]));
  });

  it("produces identical results when rothContributionPercent is 0", () => {
    const withoutRoth = calculateRetirementProjection(makeInputs({ rothContributionPercent: 0 }));

    expect(withoutRoth.rothContributionPercent).toBe(0);
    expect(withoutRoth.projectedRothBalanceAtRetirement).toBe(0);
    expect(withoutRoth.projectedTraditionalBalanceAtRetirement).toBe(withoutRoth.projectedBalanceAtRetirement);
    expect(withoutRoth.totalRothEmployeeContributions).toBe(0);
    expect(withoutRoth.totalTraditionalEmployeeContributions).toBe(withoutRoth.totalEmployeeContributions);
    expect(withoutRoth.projectedAnnualRothIncome).toBe(0);
    expect(withoutRoth.projectedAnnualTraditionalIncome).toBe(withoutRoth.projectedAnnualSpendAvailable);

    for (const entry of withoutRoth.yearlyProjection) {
      expect(entry.rothBalance).toBe(0);
      expect(entry.traditionalBalance).toBeCloseTo(entry.endingBalance, 2);
      expect(entry.rothEmployeeContribution).toBe(0);
      expect(entry.traditionalEmployeeContribution).toBe(entry.employeeContribution);
    }
  });

  it("splits employee contributions by roth percentage", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 30,
        retirementAge: 32,
        lifeExpectancy: 32,
        currentBalance: 0,
        annualSalary: 100_000,
        contributionPercent: 10,
        rothContributionPercent: 30,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        targetRetirementSpending: 0,
      })
    );

    expect(result.totalEmployeeContributions).toBe(10_000);
    expect(result.totalRothEmployeeContributions).toBeCloseTo(3_000, 2);
    expect(result.totalTraditionalEmployeeContributions).toBeCloseTo(7_000, 2);
    expect(result.yearlyProjection[1]?.rothEmployeeContribution).toBeCloseTo(3_000, 2);
    expect(result.yearlyProjection[1]?.traditionalEmployeeContribution).toBeCloseTo(7_000, 2);
  });

  it("sends all employee contributions to roth when rothContributionPercent is 100", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 30,
        retirementAge: 32,
        lifeExpectancy: 32,
        currentBalance: 0,
        annualSalary: 100_000,
        contributionPercent: 10,
        rothContributionPercent: 100,
        employerMatchPercent: 5,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        targetRetirementSpending: 0,
      })
    );

    expect(result.totalRothEmployeeContributions).toBe(10_000);
    expect(result.totalTraditionalEmployeeContributions).toBe(0);
    expect(result.totalEmployerContributions).toBe(5_000);
    expect(result.projectedRothBalanceAtRetirement).toBeGreaterThan(0);
    expect(result.projectedTraditionalBalanceAtRetirement).toBeGreaterThan(0);
  });

  it("keeps traditional + roth balances consistent with total ending balance", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 30,
        retirementAge: 65,
        lifeExpectancy: 90,
        rothContributionPercent: 40,
      })
    );

    for (const entry of result.yearlyProjection) {
      expect(entry.traditionalBalance + entry.rothBalance).toBeCloseTo(entry.endingBalance, 0);
    }
  });

  it("splits retirement income proportionally based on balance ratio at retirement", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 30,
        retirementAge: 65,
        lifeExpectancy: 90,
        currentBalance: 0,
        annualSalary: 100_000,
        contributionPercent: 15,
        rothContributionPercent: 50,
        employerMatchPercent: 5,
        annualSalaryGrowthPercent: 3,
        annualReturnPercent: 7,
        inflationPercent: 2.5,
        targetRetirementSpending: 50_000,
      })
    );

    expect(result.projectedAnnualSpendAvailable).toBeGreaterThan(0);
    expect(result.projectedAnnualTraditionalIncome + result.projectedAnnualRothIncome).toBeCloseTo(
      result.projectedAnnualSpendAvailable,
      0
    );
    expect(result.projectedAnnualRothIncome).toBeGreaterThan(0);
    expect(result.projectedAnnualTraditionalIncome).toBeGreaterThan(0);
  });

  it("initializes traditional and roth balances from currentRothBalance", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 30,
        retirementAge: 32,
        lifeExpectancy: 32,
        currentBalance: 100_000,
        currentRothBalance: 40_000,
        annualSalary: 0,
        contributionPercent: 0,
        rothContributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        targetRetirementSpending: 0,
      })
    );

    expect(result.yearlyProjection[0]?.traditionalBalance).toBe(60_000);
    expect(result.yearlyProjection[0]?.rothBalance).toBe(40_000);
    expect(result.projectedTraditionalBalanceAtRetirement).toBe(60_000);
    expect(result.projectedRothBalanceAtRetirement).toBe(40_000);
    expect(result.currentRothBalance).toBe(40_000);
  });

  it("grows existing roth balance alongside traditional using the same return rate", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 30,
        retirementAge: 32,
        lifeExpectancy: 32,
        currentBalance: 100_000,
        currentRothBalance: 50_000,
        annualSalary: 0,
        contributionPercent: 0,
        rothContributionPercent: 0,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 10,
        inflationPercent: 0,
        targetRetirementSpending: 0,
      })
    );

    expect(result.projectedBalanceAtRetirement).toBeCloseTo(110_000, 0);
    expect(result.projectedTraditionalBalanceAtRetirement).toBeCloseTo(55_000, 0);
    expect(result.projectedRothBalanceAtRetirement).toBeCloseTo(55_000, 0);
  });

  it("preserves default behavior when currentRothBalance is 0", () => {
    const result = calculateRetirementProjection(
      makeInputs({ currentRothBalance: 0 })
    );

    expect(result.currentRothBalance).toBe(0);
    expect(result.yearlyProjection[0]?.rothBalance).toBe(0);
    expect(result.yearlyProjection[0]?.traditionalBalance).toBe(result.yearlyProjection[0]?.endingBalance);
  });

  it("throws when currentRothBalance exceeds currentBalance", () => {
    const error = captureInputError({
      currentBalance: 50_000,
      currentRothBalance: 60_000,
    });

    expect(error.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "currentRothBalance" })])
    );
  });

  it("throws when currentRothBalance is negative", () => {
    const error = captureInputError({ currentRothBalance: -1 });

    expect(error.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "currentRothBalance" })])
    );
  });

  it("combines existing roth balance with future roth contributions", () => {
    const result = calculateRetirementProjection(
      makeInputs({
        currentAge: 30,
        retirementAge: 33,
        lifeExpectancy: 33,
        currentBalance: 50_000,
        currentRothBalance: 20_000,
        annualSalary: 100_000,
        contributionPercent: 10,
        rothContributionPercent: 50,
        employerMatchPercent: 0,
        annualSalaryGrowthPercent: 0,
        annualReturnPercent: 0,
        inflationPercent: 0,
        targetRetirementSpending: 0,
      })
    );

    expect(result.totalRothEmployeeContributions).toBeCloseTo(10_000, 0);
    expect(result.totalTraditionalEmployeeContributions).toBeCloseTo(10_000, 0);
    expect(result.projectedRothBalanceAtRetirement).toBeCloseTo(30_000, 0);
    expect(result.projectedTraditionalBalanceAtRetirement).toBeCloseTo(40_000, 0);
    expect(result.projectedBalanceAtRetirement).toBeCloseTo(70_000, 0);
  });

  it("throws for rothContributionPercent outside 0-100 range", () => {
    const errorOver = captureInputError({ rothContributionPercent: 101 });
    expect(errorOver.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "rothContributionPercent" })])
    );

    const errorUnder = captureInputError({ rothContributionPercent: -1 });
    expect(errorUnder.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "rothContributionPercent" })])
    );
  });
});

describe("normalizeInputs", () => {
  it("returns defaults when no inputs are provided", () => {
    expect(normalizeInputs()).toEqual(defaultCalculatorInputs);
  });

  it("merges provided inputs with defaults", () => {
    const normalized = normalizeInputs({
      currentAge: 45,
      contributionPercent: 12,
      inflationPercent: 3,
      ageBasedSpendingEnabled: true,
      retirementSpendingInflationAdjusted: false,
    });

    expect(normalized.currentAge).toBe(45);
    expect(normalized.contributionPercent).toBe(12);
    expect(normalized.inflationPercent).toBe(3);
    expect(normalized.ageBasedSpendingEnabled).toBe(true);
    expect(normalized.retirementSpendingInflationAdjusted).toBe(false);
    expect(normalized.retirementAge).toBe(defaultCalculatorInputs.retirementAge);
  });

  it("falls back to defaults for malformed numeric values and booleans", () => {
    const normalized = normalizeInputs({
      annualSalary: Number.NaN as unknown as number,
      annualReturnPercent: Number.NEGATIVE_INFINITY as unknown as number,
      inflationPercent: "2.5" as unknown as number,
      targetRetirementSpending: Number.POSITIVE_INFINITY as unknown as number,
      ageBasedSpendingEnabled: "yes" as unknown as boolean,
      retirementSpendingInflationAdjusted: 0 as unknown as boolean,
    });

    expect(normalized.annualSalary).toBe(defaultCalculatorInputs.annualSalary);
    expect(normalized.annualReturnPercent).toBe(defaultCalculatorInputs.annualReturnPercent);
    expect(normalized.inflationPercent).toBe(defaultCalculatorInputs.inflationPercent);
    expect(normalized.targetRetirementSpending).toBe(defaultCalculatorInputs.targetRetirementSpending);
    expect(normalized.ageBasedSpendingEnabled).toBe(defaultCalculatorInputs.ageBasedSpendingEnabled);
    expect(normalized.retirementSpendingInflationAdjusted).toBe(false);
  });
});
