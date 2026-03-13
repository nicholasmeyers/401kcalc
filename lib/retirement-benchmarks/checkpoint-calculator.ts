import { getRetirementBenchmarkAges, getRetirementBenchmarkByAge } from "@/lib/retirement-benchmarks/benchmarks";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CheckpointMultiplier = {
  low: number;
  high: number;
};

export type CheckpointTarget = {
  low: number;
  high: number;
  midpoint: number;
  isRange: boolean;
  label: string;
};

export type CheckpointInputs = {
  age: number;
  annualSalary: number;
  currentBalance: number;
  contributionPercent: number;
  employerMatchPercent: number;
  annualReturnPercent: number;
};

export type NextCheckpoint = {
  age: number;
  targetLow: number;
  targetHigh: number;
  targetMidpoint: number;
  isRange: boolean;
  yearsUntil: number;
  projectedBalance: number;
};

export type CheckpointResult = {
  target: CheckpointTarget;
  currentBalance: number;
  differenceToTargetMidpoint: number;
  percentOfTarget: number;
  aboveTarget: boolean;
  annualEmployeeContribution: number;
  annualEmployerContribution: number;
  annualTotalContribution: number;
  totalSavingsRatePercent: number;
  nextCheckpoint: NextCheckpoint | null;
};

// ---------------------------------------------------------------------------
// Multiplier lookup
// ---------------------------------------------------------------------------

// For the "8x-10x salary" range at age 60 we store both bounds and display
// both a low and high target. The progress bar and "percent of target" use
// the midpoint so the user sees a single intuitive number while still
// understanding the range.
const MULTIPLIER_MAP: ReadonlyMap<number, CheckpointMultiplier> = new Map([
  [30, { low: 1, high: 1 }],
  [35, { low: 2, high: 2 }],
  [40, { low: 3, high: 3 }],
  [45, { low: 4, high: 4 }],
  [50, { low: 6, high: 6 }],
  [55, { low: 7, high: 7 }],
  [60, { low: 8, high: 10 }],
]);

export function getCheckpointMultipliers(age: number): CheckpointMultiplier | undefined {
  return MULTIPLIER_MAP.get(age);
}

// ---------------------------------------------------------------------------
// Next-checkpoint age
// ---------------------------------------------------------------------------

const SORTED_AGES = getRetirementBenchmarkAges().slice().sort((a, b) => a - b);

export function getNextBenchmarkAge(age: number): number | undefined {
  return SORTED_AGES.find((candidateAge) => candidateAge > age);
}

// ---------------------------------------------------------------------------
// Core calculation
// ---------------------------------------------------------------------------

function buildCheckpointTarget(salary: number, multiplier: CheckpointMultiplier, age: number): CheckpointTarget {
  const low = salary * multiplier.low;
  const high = salary * multiplier.high;
  const isRange = multiplier.low !== multiplier.high;
  const midpoint = isRange ? (low + high) / 2 : low;

  const benchmark = getRetirementBenchmarkByAge(age);
  const label = benchmark ? benchmark.recommendedMultiple : `${multiplier.low}x salary`;

  return { low, high, midpoint, isRange, label };
}

/**
 * Future-value calculation: lump sum + level annuity with end-of-year
 * contributions, compounded annually. Used for the "projected balance at
 * next checkpoint" estimate.
 *
 *   FV = PV * (1+r)^n  +  C * ((1+r)^n - 1) / r
 *
 * When r === 0 the annuity term simplifies to C * n.
 */
function futureValue(presentValue: number, annualContribution: number, annualRate: number, years: number): number {
  if (years <= 0) return presentValue;

  const compoundFactor = Math.pow(1 + annualRate, years);
  const annuityFactor = annualRate === 0 ? years : (compoundFactor - 1) / annualRate;

  return presentValue * compoundFactor + annualContribution * annuityFactor;
}

export function calculateCheckpoint(inputs: CheckpointInputs): CheckpointResult | undefined {
  const multiplier = getCheckpointMultipliers(inputs.age);
  if (!multiplier) return undefined;

  const target = buildCheckpointTarget(inputs.annualSalary, multiplier, inputs.age);

  const referenceTarget = target.midpoint;
  const differenceToTargetMidpoint = inputs.currentBalance - referenceTarget;
  const percentOfTarget = referenceTarget > 0 ? (inputs.currentBalance / referenceTarget) * 100 : 0;
  const aboveTarget = inputs.currentBalance >= referenceTarget;

  const contributionRate = inputs.contributionPercent / 100;
  const employerMatchRate = inputs.employerMatchPercent / 100;
  const annualReturnRate = inputs.annualReturnPercent / 100;

  const annualEmployeeContribution = inputs.annualSalary * contributionRate;
  const annualEmployerContribution = inputs.annualSalary * employerMatchRate;
  const annualTotalContribution = annualEmployeeContribution + annualEmployerContribution;
  const totalSavingsRatePercent = inputs.annualSalary > 0 ? (annualTotalContribution / inputs.annualSalary) * 100 : 0;

  let nextCheckpoint: NextCheckpoint | null = null;
  const nextAge = getNextBenchmarkAge(inputs.age);

  if (nextAge) {
    const nextMultiplier = getCheckpointMultipliers(nextAge);
    if (nextMultiplier) {
      const yearsUntil = nextAge - inputs.age;
      const nextTarget = buildCheckpointTarget(inputs.annualSalary, nextMultiplier, nextAge);
      const projectedBalance = futureValue(inputs.currentBalance, annualTotalContribution, annualReturnRate, yearsUntil);

      nextCheckpoint = {
        age: nextAge,
        targetLow: nextTarget.low,
        targetHigh: nextTarget.high,
        targetMidpoint: nextTarget.midpoint,
        isRange: nextTarget.isRange,
        yearsUntil,
        projectedBalance,
      };
    }
  }

  return {
    target,
    currentBalance: inputs.currentBalance,
    differenceToTargetMidpoint,
    percentOfTarget,
    aboveTarget,
    annualEmployeeContribution,
    annualEmployerContribution,
    annualTotalContribution,
    totalSavingsRatePercent,
    nextCheckpoint,
  };
}
