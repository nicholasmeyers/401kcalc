import { getAllRetirementBenchmarks } from "@/lib/retirement-benchmarks/benchmarks";

export type RetirementAgeMilestone = {
  age: number;
  benchmarkLabel: string;
  chartMultiple: number;
  benchmarkHref: string;
  guideHref?: string;
};

export type RetirementAgeSelection = {
  selectedAge: number;
  currentMilestone: RetirementAgeMilestone;
  previousMilestone: RetirementAgeMilestone | null;
  nextMilestone: RetirementAgeMilestone | null;
  finalMilestone: RetirementAgeMilestone;
  chartMilestones: RetirementAgeMilestone[];
  guideHref?: string;
};

const GUIDE_SLUG_BY_AGE: Record<number, string> = {
  30: "how-much-should-i-have-in-my-401k-at-30",
  40: "how-much-should-i-have-in-my-401k-at-40",
  50: "how-much-should-i-have-in-my-401k-at-50",
  60: "how-much-should-i-have-in-my-401k-at-60",
};

export const RETIREMENT_AGE_SELECTOR_AGES = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70] as const;
export const MIN_RETIREMENT_AGE_SELECTOR_AGE = RETIREMENT_AGE_SELECTOR_AGES[0];
export const MAX_RETIREMENT_AGE_SELECTOR_AGE = RETIREMENT_AGE_SELECTOR_AGES[RETIREMENT_AGE_SELECTOR_AGES.length - 1];
export const DEFAULT_RETIREMENT_AGE_SELECTOR_AGE = 35;

function formatDisplayMultiple(label: string): string {
  return label.replaceAll("x", "×");
}

function buildGuideHref(age: number): string | undefined {
  const slug = GUIDE_SLUG_BY_AGE[age];
  return slug ? `/guides/${slug}` : undefined;
}

const benchmarkLookup = new Map(
  getAllRetirementBenchmarks().map((benchmark) => [benchmark.age, benchmark]),
);

const retirementAgeMilestones: RetirementAgeMilestone[] = RETIREMENT_AGE_SELECTOR_AGES.map((age) => {
  if (age === 25) {
    return {
      age,
      benchmarkLabel: "Working toward 1× salary",
      chartMultiple: 0.8,
      benchmarkHref: `/retirement-by-age/${age}`,
    };
  }

  if (age === 65) {
    return {
      age,
      benchmarkLabel: "10× salary",
      chartMultiple: 10,
      benchmarkHref: `/retirement-by-age/${age}`,
    };
  }

  if (age === 70) {
    return {
      age,
      benchmarkLabel: "12× salary",
      chartMultiple: 12,
      benchmarkHref: `/retirement-by-age/${age}`,
    };
  }

  const benchmark = benchmarkLookup.get(age);
  const benchmarkLabel = formatDisplayMultiple(benchmark?.recommendedMultiple ?? "1x salary");
  const chartMultiple = age === 60 ? 9 : Number.parseFloat((benchmark?.recommendedMultiple ?? "1").replace(/[^0-9.]/g, "")) || 1;

  return {
    age,
    benchmarkLabel,
    chartMultiple,
    benchmarkHref: `/retirement-by-age/${age}`,
    guideHref: buildGuideHref(age),
  };
});

const retirementAgeMilestoneLookup = new Map(
  retirementAgeMilestones.map((milestone) => [milestone.age, milestone]),
);

export function getRetirementAgeMilestones(): RetirementAgeMilestone[] {
  return retirementAgeMilestones;
}

export function snapRetirementAgeSelectorAge(
  age: number
): (typeof RETIREMENT_AGE_SELECTOR_AGES)[number] {
  const clamped = Math.min(
    MAX_RETIREMENT_AGE_SELECTOR_AGE,
    Math.max(MIN_RETIREMENT_AGE_SELECTOR_AGE, Math.round(age)),
  );

  let nearestAge: (typeof RETIREMENT_AGE_SELECTOR_AGES)[number] = RETIREMENT_AGE_SELECTOR_AGES[0];
  let smallestDifference = Number.POSITIVE_INFINITY;

  for (const candidateAge of RETIREMENT_AGE_SELECTOR_AGES) {
    const difference = Math.abs(candidateAge - clamped);

    if (difference < smallestDifference) {
      smallestDifference = difference;
      nearestAge = candidateAge;
    }
  }

  return nearestAge;
}

export function getRetirementAgeSelection(age: number): RetirementAgeSelection {
  const selectedAge = snapRetirementAgeSelectorAge(age);
  const selectedIndex = RETIREMENT_AGE_SELECTOR_AGES.findIndex((a) => a === selectedAge);
  const currentMilestone = retirementAgeMilestoneLookup.get(selectedAge) ?? retirementAgeMilestones[0];
  const previousMilestone = selectedIndex > 0
    ? retirementAgeMilestones[selectedIndex - 1] ?? null
    : null;
  const nextMilestone = selectedIndex < retirementAgeMilestones.length - 1
    ? retirementAgeMilestones[selectedIndex + 1] ?? null
    : null;
  const finalMilestone = retirementAgeMilestones[retirementAgeMilestones.length - 1];

  const chartMilestones = Array.from(
    new Map(
      [previousMilestone, currentMilestone, nextMilestone, finalMilestone]
        .filter((milestone): milestone is RetirementAgeMilestone => milestone !== null)
        .map((milestone) => [milestone.age, milestone]),
    ).values(),
  );

  return {
    selectedAge,
    currentMilestone,
    previousMilestone,
    nextMilestone,
    finalMilestone,
    chartMilestones,
    guideHref: currentMilestone.guideHref,
  };
}
