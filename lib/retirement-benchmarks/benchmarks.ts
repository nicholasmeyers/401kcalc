export type RetirementScenario = {
  label: string;
  assumptions: string;
  projectedOutcome: string;
};

export type RetirementLink = {
  label: string;
  href: string;
};

export type RetirementBenchmark = {
  age: number;
  recommendedMultiple: string;
  benchmarkSummary: string;
  benchmarkGuidance: string[];
  exampleScenarios: RetirementScenario[];
  influences: string[];
  strategies: string[];
  relatedGuides: RetirementLink[];
  metaDescription: string;
};

const benchmarks: RetirementBenchmark[] = [
  {
    age: 30,
    recommendedMultiple: "1x salary",
    benchmarkSummary: "Most planning frameworks use around 1x salary saved by age 30 as an early milestone.",
    benchmarkGuidance: [
      "A 1x salary target by 30 is a common checkpoint, not a pass/fail score. Early-career income volatility, debt payoff, and late starts can shift your pace.",
      "What matters most at 30 is your direction: a contribution rate that is sustainable, captures employer match, and increases when income rises.",
      "If you are below this benchmark, small consistent increases over the next five years can close ground faster than one-time aggressive changes.",
    ],
    exampleScenarios: [
      {
        label: "Early consistency path",
        assumptions: "$70k salary, 10% employee contribution, 4% match, 6.5% long-term return.",
        projectedOutcome: "Often tracks toward roughly 8x-10x salary by late 60s if contribution rate remains stable.",
      },
      {
        label: "Late-start path",
        assumptions: "$70k salary, 5% employee contribution, 3% match, 6.5% return.",
        projectedOutcome: "Can land closer to 5x-7x salary without contribution step-ups.",
      },
      {
        label: "Step-up path",
        assumptions: "Start at 8% contribution and raise by 1% annually to 15%, with 4% match.",
        projectedOutcome: "Typically outpaces flat-rate saving and can materially improve retirement income flexibility.",
      },
    ],
    influences: [
      "Savings rate and whether annual increases are automated.",
      "Employer match formula and whether full match is captured.",
      "Student debt, housing costs, and income growth pace.",
      "Investment cost drag and portfolio allocation discipline.",
    ],
    strategies: [
      "Capture full employer match before optimizing smaller details.",
      "Set a calendar-based annual contribution increase.",
      "Use raises and bonuses to lock in higher deferral rates.",
      "Review Roth vs Traditional mix as tax bracket changes.",
    ],
    relatedGuides: [
      {
        label: "How Much Should I Have in My 401(k) at 30?",
        href: "/guides/how-much-should-i-have-in-my-401k-at-30",
      },
      {
        label: "401(k) Employer Match Explained",
        href: "/guides/401k-employer-match-explained",
      },
      {
        label: "Roth vs Traditional 401(k): How to Choose",
        href: "/guides/roth-vs-traditional-401k",
      },
    ],
    metaDescription:
      "Benchmark retirement savings at age 30 using a common 1x salary target, projection examples, and practical contribution strategies.",
  },
  {
    age: 35,
    recommendedMultiple: "2x salary",
    benchmarkSummary: "By 35, many benchmark frameworks target roughly 2x salary saved for retirement.",
    benchmarkGuidance: [
      "Age 35 often marks the transition from accumulation habit to accumulation acceleration. A common reference point is about 2x salary saved.",
      "This checkpoint reflects whether your contribution process is keeping pace with mid-career income growth, not whether your plan is perfect.",
      "If you are behind, the highest-leverage move is usually raising contribution rate over several years while preserving emergency liquidity.",
    ],
    exampleScenarios: [
      {
        label: "On-track path",
        assumptions: "$90k salary, 12% employee contribution, 4% match, 6.5% return.",
        projectedOutcome: "Can maintain a trajectory consistent with common age-60 and age-67 readiness ranges.",
      },
      {
        label: "Flat-rate path",
        assumptions: "$90k salary, 7% employee contribution, 3% match, 6.5% return.",
        projectedOutcome: "May leave a meaningful gap that needs either higher contributions or later retirement timing.",
      },
      {
        label: "Catch-up acceleration path",
        assumptions: "Raise contributions from 8% to 14% over four years while keeping match fully captured.",
        projectedOutcome: "Can narrow gaps without relying on unrealistic one-year savings jumps.",
      },
    ],
    influences: [
      "Career progression and salary compounding in the 30s.",
      "Household fixed-cost commitments and debt service load.",
      "Plan contribution automation and behavioral consistency.",
      "Whether investment strategy is steady during volatility.",
    ],
    strategies: [
      "Move toward a combined employee+match savings rate near retirement target needs.",
      "Schedule annual deferral increases before lifestyle spending expands.",
      "Re-evaluate fund lineup costs and rebalance process annually.",
      "Model a baseline and improved path in the calculator every year.",
    ],
    relatedGuides: [
      {
        label: "How Much Should I Have in My 401(k) at 30?",
        href: "/guides/how-much-should-i-have-in-my-401k-at-30",
      },
      {
        label: "How Much Should I Have in My 401(k) at 40?",
        href: "/guides/how-much-should-i-have-in-my-401k-at-40",
      },
      {
        label: "401(k) Employer Match Explained",
        href: "/guides/401k-employer-match-explained",
      },
    ],
    metaDescription:
      "See age-35 retirement savings benchmarks with a common 2x salary target, practical examples, and contribution strategy ideas.",
  },
  {
    age: 40,
    recommendedMultiple: "3x salary",
    benchmarkSummary: "Age 40 benchmarks commonly reference around 3x salary saved for retirement.",
    benchmarkGuidance: [
      "Many retirement planning frameworks use roughly 3x salary by age 40 as a directional benchmark.",
      "At this stage, contribution consistency, match capture, and realistic retirement timing assumptions have a bigger impact than short-term return chasing.",
      "If you are below benchmark, define a multi-year contribution ramp now rather than relying on future catch-up pressure.",
    ],
    exampleScenarios: [
      {
        label: "Steady saver path",
        assumptions: "$110k salary, 12% employee contribution, 4% match, 6.25% return.",
        projectedOutcome: "Often supports a stronger path toward age-60 readiness without major plan disruption.",
      },
      {
        label: "Moderate saver path",
        assumptions: "$110k salary, 8% employee contribution, 3% match, 6.25% return.",
        projectedOutcome: "Can require either later retirement or higher withdrawal risk in retirement.",
      },
      {
        label: "Rebound path",
        assumptions: "Increase contribution rate by 2 to 4 percentage points over two years.",
        projectedOutcome: "Frequently closes a substantial share of the age-50 benchmark gap.",
      },
    ],
    influences: [
      "Income growth vs rising household expenses in peak earning years.",
      "Tax treatment choices across Traditional and Roth contributions.",
      "Plan fees, asset mix, and time invested in market.",
      "Retirement age target and expected spending level.",
    ],
    strategies: [
      "Translate retirement age target into a required savings rate.",
      "Use automatic escalation so contribution growth does not depend on manual action.",
      "Preserve contribution discipline during market drawdowns.",
      "Review tax-bucket mix yearly to keep future withdrawal flexibility.",
    ],
    relatedGuides: [
      {
        label: "How Much Should I Have in My 401(k) at 40?",
        href: "/guides/how-much-should-i-have-in-my-401k-at-40",
      },
      {
        label: "Roth vs Traditional 401(k): How to Choose",
        href: "/guides/roth-vs-traditional-401k",
      },
      {
        label: "401(k) Employer Match Explained",
        href: "/guides/401k-employer-match-explained",
      },
    ],
    metaDescription:
      "Use the age-40 retirement benchmark of about 3x salary, review projection examples, and improve your contribution strategy.",
  },
  {
    age: 45,
    recommendedMultiple: "4x salary",
    benchmarkSummary: "A common age-45 checkpoint is around 4x salary saved, depending on retirement age and spending goals.",
    benchmarkGuidance: [
      "Age 45 is a practical midpoint between the 40 and 50 milestones. Many planners use around 4x salary as a useful reference.",
      "This checkpoint helps identify whether your current trajectory supports your target retirement date without over-reliance on late-stage catch-up.",
      "Decision quality at 45 usually comes from scenario testing: contributions, retirement age, and expected spending should all be stress-tested together.",
    ],
    exampleScenarios: [
      {
        label: "Balanced path",
        assumptions: "$125k salary, 13% employee contribution, 4% match, 6.0% return.",
        projectedOutcome: "Can remain aligned with age-50 and age-60 benchmark ranges with continued consistency.",
      },
      {
        label: "Contribution plateau path",
        assumptions: "$125k salary, 8% employee contribution, 3% match, 6.0% return.",
        projectedOutcome: "Often produces a visible shortfall unless retirement timing is extended.",
      },
      {
        label: "Mid-career reset path",
        assumptions: "Raise contribution rate 1% per year for four years and trim portfolio fees.",
        projectedOutcome: "Can improve projected retirement income durability without extreme assumptions.",
      },
    ],
    influences: [
      "Whether contributions have kept pace with peak-earnings years.",
      "Household spending commitments and debt reduction progress.",
      "Portfolio cost efficiency and allocation drift over time.",
      "Future healthcare and education funding obligations.",
    ],
    strategies: [
      "Prioritize stable contribution percentage over irregular lump sums.",
      "Use bonus periods to step up annual savings targets.",
      "Compare retirement at multiple ages to quantify timing tradeoffs.",
      "Coordinate 401(k) strategy with broader household cash-flow planning.",
    ],
    relatedGuides: [
      {
        label: "How Much Should I Have in My 401(k) at 40?",
        href: "/guides/how-much-should-i-have-in-my-401k-at-40",
      },
      {
        label: "How Much Should I Have in My 401(k) at 50?",
        href: "/guides/how-much-should-i-have-in-my-401k-at-50",
      },
      {
        label: "Roth vs Traditional 401(k): How to Choose",
        href: "/guides/roth-vs-traditional-401k",
      },
    ],
    metaDescription:
      "Benchmark retirement savings by age 45 with a common 4x salary reference, projection examples, and practical next-step strategies.",
  },
  {
    age: 50,
    recommendedMultiple: "6x salary",
    benchmarkSummary: "Age 50 planning frameworks commonly reference around 6x salary saved.",
    benchmarkGuidance: [
      "By age 50, many benchmark sets point to roughly 6x salary saved for retirement. Your specific target can vary by retirement age and expected spending.",
      "The 50s are high-impact years because contribution decisions and retirement timing assumptions directly shape withdrawal flexibility later.",
      "If benchmark gaps exist, a structured catch-up plan and realistic retirement age modeling are usually more effective than aggressive return assumptions.",
    ],
    exampleScenarios: [
      {
        label: "High-consistency path",
        assumptions: "$140k salary, 14% employee contribution, 4% match, 5.75% return.",
        projectedOutcome: "Can support stronger age-60 readiness and lower pressure on withdrawal rate assumptions.",
      },
      {
        label: "Under-saving path",
        assumptions: "$140k salary, 8% employee contribution, 3% match, 5.75% return.",
        projectedOutcome: "May require meaningful plan changes, including higher contributions or a later retirement date.",
      },
      {
        label: "Catch-up path",
        assumptions: "Use available catch-up contributions and increase total savings in phases.",
        projectedOutcome: "Can materially improve projected balance durability in the final accumulation decade.",
      },
    ],
    influences: [
      "Use of catch-up contribution limits and consistency year to year.",
      "Retirement timing choices and expected bridge years before Social Security.",
      "Portfolio risk level relative to sequence-of-returns risk.",
      "Tax diversification across pre-tax and Roth assets.",
    ],
    strategies: [
      "Confirm and use annual contribution limit updates, including catch-up room.",
      "Stress-test retirement at multiple ages under conservative return assumptions.",
      "Avoid pausing contributions during volatile market periods.",
      "Align spending expectations with projected sustainable income.",
    ],
    relatedGuides: [
      {
        label: "How Much Should I Have in My 401(k) at 50?",
        href: "/guides/how-much-should-i-have-in-my-401k-at-50",
      },
      {
        label: "How Much Should I Have in My 401(k) at 60?",
        href: "/guides/how-much-should-i-have-in-my-401k-at-60",
      },
      {
        label: "Roth vs Traditional 401(k): How to Choose",
        href: "/guides/roth-vs-traditional-401k",
      },
    ],
    metaDescription:
      "Use age-50 retirement benchmarks around 6x salary, with example projections and contribution strategies for catch-up years.",
  },
  {
    age: 55,
    recommendedMultiple: "7x salary",
    benchmarkSummary: "Around age 55, many benchmark paths land near 7x salary as a checkpoint before age-60 readiness.",
    benchmarkGuidance: [
      "Age 55 is often a transition point from pure accumulation to accumulation plus withdrawal planning. A common benchmark reference is around 7x salary.",
      "At this stage, planning quality depends on contribution consistency, tax flexibility, and realistic retirement timing assumptions.",
      "If you are below target, multi-year catch-up execution plus spending plan calibration can still materially improve outcomes.",
    ],
    exampleScenarios: [
      {
        label: "Disciplined final-decade path",
        assumptions: "$150k salary, 15% employee contribution, 4% match, 5.5% return.",
        projectedOutcome: "Can improve income durability and reduce pressure on withdrawal rates after retirement.",
      },
      {
        label: "Static contribution path",
        assumptions: "$150k salary, 9% employee contribution, 3% match, 5.5% return.",
        projectedOutcome: "Often leaves less buffer for inflation and market variability in early retirement.",
      },
      {
        label: "Late-stage optimization path",
        assumptions: "Use catch-up limits, lower fee drag, and model retirement at 62/65/67.",
        projectedOutcome: "Provides clearer tradeoffs between working longer and increasing annual savings.",
      },
    ],
    influences: [
      "Catch-up contribution usage and salary peak years.",
      "Healthcare cost planning and retirement start timing.",
      "Tax planning for future withdrawal sequencing.",
      "Portfolio mix resilience as retirement approaches.",
    ],
    strategies: [
      "Maximize feasible catch-up contributions while preserving liquidity.",
      "Run side-by-side scenarios for retirement age and spending level.",
      "Plan for tax-efficient withdrawals before retirement begins.",
      "Keep contributions automated through final earning years.",
    ],
    relatedGuides: [
      {
        label: "How Much Should I Have in My 401(k) at 50?",
        href: "/guides/how-much-should-i-have-in-my-401k-at-50",
      },
      {
        label: "How Much Should I Have in My 401(k) at 60?",
        href: "/guides/how-much-should-i-have-in-my-401k-at-60",
      },
      {
        label: "Roth vs Traditional 401(k): How to Choose",
        href: "/guides/roth-vs-traditional-401k",
      },
    ],
    metaDescription:
      "Review age-55 retirement benchmark guidance near 7x salary, with projection examples and focused contribution strategies.",
  },
  {
    age: 60,
    recommendedMultiple: "8x-10x salary",
    benchmarkSummary: "By age 60, many widely cited benchmark ranges are around 8x to 10x salary saved.",
    benchmarkGuidance: [
      "A common age-60 benchmark range is about 8x-10x salary. Use this as context while prioritizing expected spending and income durability.",
      "At 60, planning should evaluate both remaining accumulation years and distribution strategy quality.",
      "If you are below benchmark, meaningful levers still include contribution continuation, retirement timing, and spending assumptions.",
    ],
    exampleScenarios: [
      {
        label: "Resilient path",
        assumptions: "$160k salary, 15% employee contribution, 4% match, 5.25% return, retire at 67.",
        projectedOutcome: "Typically improves portfolio longevity compared with early retirement under lower balances.",
      },
      {
        label: "Early-retire path",
        assumptions: "$160k salary, 10% employee contribution, 3% match, 5.25% return, retire at 62.",
        projectedOutcome: "Can create a tighter withdrawal margin and higher plan sensitivity to inflation.",
      },
      {
        label: "Flex-date path",
        assumptions: "Model retirement at 62, 65, and 67 with the same spending target.",
        projectedOutcome: "Clarifies the tradeoff between working years, sustainable withdrawals, and lifestyle flexibility.",
      },
    ],
    influences: [
      "Retirement start age and expected claim timing for Social Security.",
      "Projected withdrawal rate relative to spending needs.",
      "Inflation sensitivity and healthcare cost assumptions.",
      "Tax-bucket mix and withdrawal sequencing flexibility.",
    ],
    strategies: [
      "Run pre-retirement and post-retirement scenarios under conservative returns.",
      "Keep contributing while still employed, including catch-up where allowed.",
      "Define a fallback spending adjustment plan before retirement starts.",
      "Use a diversified tax withdrawal strategy when possible.",
    ],
    relatedGuides: [
      {
        label: "How Much Should I Have in My 401(k) at 60?",
        href: "/guides/how-much-should-i-have-in-my-401k-at-60",
      },
      {
        label: "Roth vs Traditional 401(k): How to Choose",
        href: "/guides/roth-vs-traditional-401k",
      },
      {
        label: "401(k) Employer Match Explained",
        href: "/guides/401k-employer-match-explained",
      },
    ],
    metaDescription:
      "Benchmark age-60 retirement savings using common 8x-10x salary guidance, illustrative projections, and practical contribution strategies.",
  },
];

const benchmarkLookup = new Map<number, RetirementBenchmark>(benchmarks.map((benchmark) => [benchmark.age, benchmark]));

export function getAllRetirementBenchmarks(): RetirementBenchmark[] {
  return benchmarks;
}

export function getRetirementBenchmarkAges(): number[] {
  return benchmarks.map((benchmark) => benchmark.age);
}

export function getRetirementBenchmarkByAge(age: number): RetirementBenchmark | undefined {
  return benchmarkLookup.get(age);
}
