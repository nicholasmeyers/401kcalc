import {
  CATCH_UP_CONTRIBUTION_LIMIT,
  COMPENSATION_LIMIT,
  EMPLOYEE_CONTRIBUTION_LIMIT,
  SUPER_CATCH_UP_CONTRIBUTION_LIMIT,
  TOTAL_CONTRIBUTION_LIMIT,
} from "@/lib/calculator/defaults";
import { getRetirementBenchmarkAges } from "@/lib/retirement-benchmarks/benchmarks";
import { getCheckpointMultipliers, type CheckpointMultiplier } from "@/lib/retirement-benchmarks/checkpoint-calculator";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PlannerInputs = {
  currentAge: number;
  annualSalary: number;
  currentBalance: number;
  contributionPercent: number;
  employerMatchPercent: number;
  annualReturnPercent: number;
  annualContributionIncreasePercent: number;
};

export type PlannerYearEntry = {
  age: number;
  balance: number;
  adjustedBalance: number;
  benchmarkTarget: number | null;
  employeeContribution: number;
  employerContribution: number;
  contributionPercent: number;
  wasCapped: boolean;
};

export type CheckpointComparison = {
  age: number;
  benchmarkTarget: number;
  benchmarkLabel: string;
  currentPathBalance: number;
  adjustedPathBalance: number;
  currentGapOrSurplus: number;
  adjustedGapOrSurplus: number;
  currentPercentOfTarget: number;
  adjustedPercentOfTarget: number;
  yearsAway: number;
};

export type PlannerRecommendation = {
  text: string;
  kind: "on-track" | "action" | "context";
};

export type PlannerResult = {
  currentCheckpoint: CheckpointComparison | null;
  nextCheckpoints: CheckpointComparison[];
  currentPath: PlannerYearEntry[];
  adjustedPath: PlannerYearEntry[];
  benchmarkCurve: { age: number; target: number }[];
  recommendations: PlannerRecommendation[];
  effectiveContributionLimit: number;
};

// ---------------------------------------------------------------------------
// IRS contribution cap (reuses constants from calculator/defaults)
// ---------------------------------------------------------------------------

const CATCH_UP_AGE = 50;
const SUPER_CATCH_UP_MIN = 60;
const SUPER_CATCH_UP_MAX = 63;

function getEmployeeDeferralLimit(age: number): number {
  if (age >= SUPER_CATCH_UP_MIN && age <= SUPER_CATCH_UP_MAX) {
    return EMPLOYEE_CONTRIBUTION_LIMIT + SUPER_CATCH_UP_CONTRIBUTION_LIMIT;
  }
  if (age >= CATCH_UP_AGE) {
    return EMPLOYEE_CONTRIBUTION_LIMIT + CATCH_UP_CONTRIBUTION_LIMIT;
  }
  return EMPLOYEE_CONTRIBUTION_LIMIT;
}

// ---------------------------------------------------------------------------
// Benchmark multiplier table for the planner chart
// ---------------------------------------------------------------------------

const CHART_BENCHMARKS: readonly [number, number][] = [
  [30, 1],
  [35, 2],
  [40, 3],
  [45, 4],
  [50, 6],
  [55, 7],
  [60, 8],
  [65, 10],
  [70, 12],
];

function interpolateBenchmarkMultiplier(age: number): number {
  const first = CHART_BENCHMARKS[0];
  const last = CHART_BENCHMARKS[CHART_BENCHMARKS.length - 1];

  if (age <= first[0]) {
    const [a1, m1] = first;
    const [a2, m2] = CHART_BENCHMARKS[1];
    const slope = (m2 - m1) / (a2 - a1);
    return Math.max(0, m1 + slope * (age - a1));
  }

  if (age >= last[0]) {
    return last[1];
  }

  for (let i = 0; i < CHART_BENCHMARKS.length - 1; i++) {
    const [a1, m1] = CHART_BENCHMARKS[i];
    const [a2, m2] = CHART_BENCHMARKS[i + 1];
    if (age >= a1 && age <= a2) {
      const t = (age - a1) / (a2 - a1);
      return m1 + t * (m2 - m1);
    }
  }

  return last[1];
}

// ---------------------------------------------------------------------------
// Projection engine
// ---------------------------------------------------------------------------

const MAX_PROJECTION_AGE = 70;

function projectPath(inputs: PlannerInputs, useEscalation: boolean): PlannerYearEntry[] {
  const years = Math.max(0, MAX_PROJECTION_AGE - inputs.currentAge);
  if (years <= 0) return [];

  const entries: PlannerYearEntry[] = [];
  let balance = inputs.currentBalance;
  let contribPct = inputs.contributionPercent;
  const returnRate = inputs.annualReturnPercent / 100;
  const matchRate = inputs.employerMatchPercent / 100;
  const escalation = useEscalation ? inputs.annualContributionIncreasePercent : 0;

  for (let y = 0; y <= years; y++) {
    const age = inputs.currentAge + y;
    const benchmarkMultiplier = getCheckpointMultipliers(age);
    const benchmarkTarget = benchmarkMultiplier
      ? inputs.annualSalary * midpoint(benchmarkMultiplier)
      : null;

    if (y === 0) {
      entries.push({
        age,
        balance,
        adjustedBalance: balance,
        benchmarkTarget,
        employeeContribution: 0,
        employerContribution: 0,
        contributionPercent: contribPct,
        wasCapped: false,
      });
      continue;
    }

    const effectiveContribPct = Math.min(contribPct, 100);
    const salary = Math.min(inputs.annualSalary, COMPENSATION_LIMIT);
    const requestedEmployee = salary * (effectiveContribPct / 100);
    const deferalLimit = getEmployeeDeferralLimit(age);
    const employeeContrib = Math.min(requestedEmployee, deferalLimit);
    const wasCapped = requestedEmployee > deferalLimit;
    const employerContrib = salary * matchRate;

    let totalContrib = employeeContrib + employerContrib;
    if (totalContrib > TOTAL_CONTRIBUTION_LIMIT) {
      totalContrib = TOTAL_CONTRIBUTION_LIMIT;
    }

    const growthBase = balance + totalContrib * 0.5;
    const growth = growthBase * returnRate;
    balance = balance + totalContrib + growth;

    entries.push({
      age,
      balance,
      adjustedBalance: balance,
      benchmarkTarget,
      employeeContribution: employeeContrib,
      employerContribution: employerContrib,
      contributionPercent: effectiveContribPct,
      wasCapped,
    });

    if (escalation > 0 && y < years) {
      contribPct = Math.min(contribPct + escalation, 100);
    }
  }

  return entries;
}

function midpoint(m: CheckpointMultiplier): number {
  return m.low === m.high ? m.low : (m.low + m.high) / 2;
}

// ---------------------------------------------------------------------------
// Benchmark curve (interpolated for every year)
// ---------------------------------------------------------------------------

function buildBenchmarkCurve(
  salary: number,
  startAge: number
): { age: number; target: number }[] {
  const points: { age: number; target: number }[] = [];

  for (let age = startAge; age <= MAX_PROJECTION_AGE; age++) {
    points.push({
      age,
      target: Math.round(salary * interpolateBenchmarkMultiplier(age)),
    });
  }

  return points;
}

// ---------------------------------------------------------------------------
// Checkpoint comparisons
// ---------------------------------------------------------------------------

function buildCheckpointComparisons(
  currentAge: number,
  salary: number,
  currentPath: PlannerYearEntry[],
  adjustedPath: PlannerYearEntry[]
): CheckpointComparison[] {
  const sortedAges = getRetirementBenchmarkAges().slice().sort((a, b) => a - b);

  let nearestPriorAge: number | null = null;
  for (const a of sortedAges) {
    if (a <= currentAge) nearestPriorAge = a;
  }

  const comparisons: CheckpointComparison[] = [];

  for (const checkAge of sortedAges) {
    if (checkAge < currentAge && checkAge !== nearestPriorAge) continue;

    const m = getCheckpointMultipliers(checkAge);
    if (!m) continue;

    const target = salary * midpoint(m);
    const label = m.low === m.high ? `${m.low}x salary` : `${m.low}x\u2013${m.high}x salary`;

    const currentEntry = currentPath.find((e) => e.age === checkAge);
    const adjustedEntry = adjustedPath.find((e) => e.age === checkAge);

    const startBalance = currentPath[0]?.balance ?? 0;
    const currentBal = currentEntry?.balance ?? (checkAge <= currentAge ? startBalance : 0);
    const adjustedBal = adjustedEntry?.balance ?? (checkAge <= currentAge ? startBalance : 0);

    comparisons.push({
      age: checkAge,
      benchmarkTarget: target,
      benchmarkLabel: label,
      currentPathBalance: currentBal,
      adjustedPathBalance: adjustedBal,
      currentGapOrSurplus: currentBal - target,
      adjustedGapOrSurplus: adjustedBal - target,
      currentPercentOfTarget: target > 0 ? (currentBal / target) * 100 : 0,
      adjustedPercentOfTarget: target > 0 ? (adjustedBal / target) * 100 : 0,
      yearsAway: Math.max(0, checkAge - currentAge),
    });
  }

  return comparisons;
}

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------

function generateRecommendations(
  inputs: PlannerInputs,
  currentCheckpoint: CheckpointComparison | null,
  nextCheckpoints: CheckpointComparison[]
): PlannerRecommendation[] {
  const recs: PlannerRecommendation[] = [];
  const next = nextCheckpoints[0];

  if (currentCheckpoint) {
    const pct = Math.round(currentCheckpoint.currentPercentOfTarget);
    if (pct >= 100) {
      recs.push({
        text: `You\u2019re at ${pct}% of the age-${currentCheckpoint.age} benchmark \u2014 you\u2019re ahead of this checkpoint.`,
        kind: "on-track",
      });
    } else {
      recs.push({
        text: `You\u2019re at ${pct}% of the age-${currentCheckpoint.age} benchmark. The gap is ${formatCompact(Math.abs(currentCheckpoint.currentGapOrSurplus))}.`,
        kind: "action",
      });
    }
  }

  if (next) {
    const pct = Math.round(next.currentPercentOfTarget);
    recs.push({
      text: `At your current pace, you may reach ${pct}% of the age-${next.age} benchmark.`,
      kind: pct >= 90 ? "on-track" : "action",
    });
  }

  if (inputs.annualContributionIncreasePercent > 0 && next) {
    const adjPct = Math.round(next.adjustedPercentOfTarget);
    if (adjPct >= 100) {
      recs.push({
        text: `Raising contributions by ${inputs.annualContributionIncreasePercent}% per year could put you on track to reach the age-${next.age} benchmark.`,
        kind: "on-track",
      });
    } else {
      recs.push({
        text: `Even with a ${inputs.annualContributionIncreasePercent}% annual increase, you may reach about ${adjPct}% of the age-${next.age} benchmark. A higher increase or additional savings may help close the gap.`,
        kind: "action",
      });
    }
  }

  recs.push({
    text: "Salary-based benchmarks use current salary. They may overstate the gap for people whose income rose sharply in recent years.",
    kind: "context",
  });

  return recs;
}

function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const m = abs / 1_000_000;
    return `$${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    const k = Math.round(abs / 1_000);
    return `$${k}K`;
  }
  return `$${Math.round(abs)}`;
}

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

export function calculatePlannerProjection(inputs: PlannerInputs): PlannerResult {
  const currentPath = projectPath(inputs, false);
  const adjustedPath =
    inputs.annualContributionIncreasePercent > 0 ? projectPath(inputs, true) : currentPath;

  const benchmarkCurve = buildBenchmarkCurve(inputs.annualSalary, inputs.currentAge);

  const allComparisons = buildCheckpointComparisons(
    inputs.currentAge,
    inputs.annualSalary,
    currentPath,
    adjustedPath
  );

  let currentCheckpoint: CheckpointComparison | null = null;
  for (const c of allComparisons) {
    if (c.age <= inputs.currentAge) currentCheckpoint = c;
  }

  const nextCheckpoints = allComparisons.filter((c) => c.age > inputs.currentAge);

  const effectiveContributionLimit = getEmployeeDeferralLimit(inputs.currentAge);

  const recommendations = generateRecommendations(inputs, currentCheckpoint, nextCheckpoints);

  return {
    currentCheckpoint,
    nextCheckpoints,
    currentPath,
    adjustedPath,
    benchmarkCurve,
    recommendations,
    effectiveContributionLimit,
  };
}

// Re-export for convenience
export { getRetirementBenchmarkAges } from "@/lib/retirement-benchmarks/benchmarks";
export { getCheckpointMultipliers } from "@/lib/retirement-benchmarks/checkpoint-calculator";
