import type { AuthorId } from "@/lib/authors/authors";

export type GuideLink = {
  label: string;
  href: string;
};

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  links?: GuideLink[];
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  authorId: AuthorId;
  category?: string;
  publishedAt?: string;
  reviewedAt?: string;
  updatedAt?: string;
  readingTime?: string;
  relatedSlugs?: string[];
  content: GuideSection[];
};

const guides: Guide[] = [
  {
    slug: "how-much-should-i-have-in-my-401k-at-30",
    title: "How Much Should I Have in My 401(k) at 30?",
    description:
      "Use realistic age-30 401(k) benchmarks, contribution targets, and action steps to build momentum early.",
    excerpt:
      "A practical benchmark and action plan for hitting your first serious 401(k) milestone by age 30.",
    authorId: "founder",
    category: "401(k) Milestones",
    publishedAt: "2026-03-01",
    reviewedAt: "2026-03-01",
    readingTime: "7 min read",
    relatedSlugs: ["how-much-should-i-have-in-my-401k-at-40", "roth-vs-traditional-401k", "401k-employer-match-explained"],
    content: [
      {
        heading: "Use the 30 benchmark as a directional check, not a verdict",
        paragraphs: [
          "A common rule of thumb is to have about 1x your salary saved for retirement by age 30. That can be useful context, but it is not a universal pass-or-fail line.",
          "Your path depends on when you started working, whether you had debt payoff years, and how much your income has changed. What matters most is that your savings rate is now on a sustainable trajectory.",
        ],
      },
      {
        heading: "The biggest lever in your 20s is contribution rate consistency",
        paragraphs: [
          "At 30, compounding has decades to work, but only if you consistently feed the account. A steady contribution habit usually matters more than trying to time markets or chase the perfect fund mix.",
          "If your budget is tight, start at a workable rate and pre-plan automatic increases when you get raises or bonuses.",
        ],
        bullets: [
          "Capture your full employer match first.",
          "Set automatic contribution increases at least once per year.",
          "Revisit your rate after any major salary change.",
        ],
        links: [{ label: "401(k) Employer Match Explained", href: "/guides/401k-employer-match-explained" }],
      },
      {
        heading: "Choose tax treatment with intention",
        paragraphs: [
          "Early-career savers often default without evaluating Roth vs Traditional. If your current tax bracket is relatively low, Roth contributions can be compelling because qualified withdrawals are tax-free later.",
          "If current cash flow is the main constraint, Traditional contributions can reduce taxable income now and make higher contribution rates easier to sustain.",
        ],
        links: [{ label: "Roth vs Traditional 401(k)", href: "/guides/roth-vs-traditional-401k" }],
      },
      {
        heading: "Run scenarios instead of guessing",
        paragraphs: [
          "Use a projection tool to compare your current contribution rate with a slightly higher one. The gap over 30-plus years is often much larger than expected.",
          "Model at least two scenarios: your current path and an improved path with a modest increase. Then commit to the version you can maintain.",
        ],
        links: [{ label: "Model your plan with the 401(k) calculator", href: "/401k-calculator" }],
      },
    ],
  },
  {
    slug: "how-much-should-i-have-in-my-401k-at-40",
    title: "How Much Should I Have in My 401(k) at 40?",
    description:
      "Understand age-40 retirement savings targets and the most effective ways to close gaps in your 401(k).",
    excerpt:
      "A focused framework for checking your 401(k) progress at 40 and improving your plan without overreacting.",
    authorId: "founder",
    category: "401(k) Milestones",
    publishedAt: "2026-03-02",
    reviewedAt: "2026-03-02",
    readingTime: "8 min read",
    relatedSlugs: ["how-much-should-i-have-in-my-401k-at-30", "how-much-should-i-have-in-my-401k-at-50", "roth-vs-traditional-401k"],
    content: [
      {
        heading: "A common 40 benchmark is around 3x salary",
        paragraphs: [
          "Many planning frameworks point to roughly 3x salary saved by age 40. Treat this as a reference point, not an absolute requirement.",
          "High housing costs, childcare years, or career transitions can delay savings early on. The key at 40 is whether your current savings rate can still get you to your retirement target.",
        ],
      },
      {
        heading: "At 40, the plan needs to be precise and durable",
        paragraphs: [
          "You still have meaningful compounding runway, but the margin for procrastination narrows. Small contribution upgrades now can materially improve outcomes by your 50s and 60s.",
          "A stable, repeatable process beats short bursts of aggressive saving followed by pullbacks.",
        ],
        bullets: [
          "Align contribution rate with your retirement age target.",
          "Avoid pausing contributions during market volatility.",
          "Increase savings when fixed expenses drop.",
        ],
      },
      {
        heading: "Use account-type mix to support flexibility later",
        paragraphs: [
          "By this stage, many households benefit from diversifying future tax exposure. A blend of Traditional and Roth savings can create better withdrawal flexibility in retirement.",
          "Revisit tax assumptions annually instead of locking in a one-time decision from years ago.",
        ],
        links: [{ label: "How to decide Roth vs Traditional 401(k)", href: "/guides/roth-vs-traditional-401k" }],
      },
      {
        heading: "Turn your benchmark gap into a concrete action plan",
        paragraphs: [
          "If you are below a benchmark, avoid all-or-nothing thinking. A 1 to 3 percentage-point contribution increase, maintained for years, can close significant ground.",
          "Project your next decade with realistic raises, contribution increases, and expected returns so your plan is anchored to numbers, not anxiety.",
        ],
        links: [{ label: "Run your age-40 scenarios in the calculator", href: "/401k-calculator" }],
      },
    ],
  },
  {
    slug: "how-much-should-i-have-in-my-401k-at-50",
    title: "How Much Should I Have in My 401(k) at 50?",
    description:
      "Evaluate your age-50 401(k) progress, close savings gaps, and use catch-up years effectively.",
    excerpt:
      "How to assess your 401(k) at 50, prioritize the right levers, and strengthen your final accumulation decade.",
    authorId: "founder",
    category: "401(k) Milestones",
    publishedAt: "2026-03-03",
    reviewedAt: "2026-03-03",
    readingTime: "8 min read",
    relatedSlugs: ["how-much-should-i-have-in-my-401k-at-40", "how-much-should-i-have-in-my-401k-at-60", "roth-vs-traditional-401k"],
    content: [
      {
        heading: "A common age-50 reference range is 5x to 6x salary",
        paragraphs: [
          "Around age 50, many planners use a benchmark near 5x to 6x salary saved. Your exact target depends on retirement age, desired spending, and expected non-401(k) income.",
          "Being below that range is not a dead end. It means your next decade decisions around contribution rate and retirement timing become especially important.",
        ],
      },
      {
        heading: "Catch-up years are powerful, but only if you use them consistently",
        paragraphs: [
          "IRS catch-up rules can significantly increase what you can save in your 50s. The value comes from steady execution over multiple years, not one strong year.",
          "If maxing out is unrealistic, define a step-up schedule and make contributions automatic so progress does not depend on monthly willpower.",
        ],
        bullets: [
          "Confirm annual contribution limits each year.",
          "Prioritize full employer match before optional investing accounts.",
          "Treat salary increases as an opportunity to raise deferral rates.",
        ],
      },
      {
        heading: "Stress-test retirement timing and spending assumptions",
        paragraphs: [
          "At 50, the most useful planning work is scenario testing: retiring at 62 vs 65, adjusting contribution rates, and modeling conservative return assumptions.",
          "This is where a calculator can reveal whether you need a higher savings rate, a later retirement age, or both.",
        ],
        links: [{ label: "Run retirement timing scenarios", href: "/401k-calculator" }],
      },
      {
        heading: "Balance growth with downside resilience",
        paragraphs: [
          "Portfolio risk still matters, but sequence-of-returns risk starts becoming more relevant as retirement gets closer. A strategy that is too aggressive can create avoidable downside if a major decline hits late in your working years.",
          "Use your allocation as part of the plan, not as a substitute for contribution discipline.",
        ],
        links: [{ label: "How Much Should I Have in My 401(k) at 60?", href: "/guides/how-much-should-i-have-in-my-401k-at-60" }],
      },
    ],
  },
  {
    slug: "how-much-should-i-have-in-my-401k-at-60",
    title: "How Much Should I Have in My 401(k) at 60?",
    description:
      "Assess your age-60 401(k) readiness with practical benchmarks, withdrawal-aware planning, and final pre-retirement checks.",
    excerpt:
      "A practical age-60 readiness review to tighten your retirement plan before distribution decisions begin.",
    authorId: "founder",
    category: "401(k) Milestones",
    publishedAt: "2026-03-04",
    reviewedAt: "2026-03-04",
    updatedAt: "2026-03-09",
    readingTime: "9 min read",
    relatedSlugs: ["how-much-should-i-have-in-my-401k-at-50", "roth-vs-traditional-401k", "401k-employer-match-explained"],
    content: [
      {
        heading: "Age-60 benchmarks often land near 8x to 10x salary",
        paragraphs: [
          "A common planning checkpoint around 60 is roughly 8x to 10x salary saved. This is useful as context, but your retirement spending target and expected Social Security timing matter more than any single multiple.",
          "At this stage, small plan adjustments can still help, but your strategy should now include both accumulation and distribution planning.",
        ],
      },
      {
        heading: "Shift from account balance to income durability",
        paragraphs: [
          "A large balance is only meaningful if it supports your expected withdrawal needs. Model how long the portfolio lasts under conservative returns and different retirement start dates.",
          "Run scenarios with higher-than-expected inflation to verify that your plan is resilient, not just optimistic.",
        ],
        links: [{ label: "Project withdrawals with the 401(k) calculator", href: "/401k-calculator" }],
      },
      {
        heading: "Tax planning becomes a central retirement lever",
        paragraphs: [
          "By 60, account-type diversification can reduce future tax friction. Households with only pre-tax savings often have fewer withdrawal options when managing taxable income in retirement.",
          "If your plan allows Roth contributions, evaluate whether shifting some new savings to Roth improves long-term flexibility.",
        ],
        links: [{ label: "Roth vs Traditional 401(k) decision guide", href: "/guides/roth-vs-traditional-401k" }],
      },
      {
        heading: "Final pre-retirement checklist",
        paragraphs: [
          "Confirm beneficiary designations, vesting status for any recent employer match dollars, and your intended retirement date assumptions in writing.",
          "A clean, documented transition plan reduces preventable mistakes during the first years of withdrawals.",
        ],
        bullets: [
          "Document target withdrawal rate and fallback adjustments.",
          "Coordinate pension, Social Security, and 401(k) timing assumptions.",
          "Re-run projections annually until retirement begins.",
        ],
        links: [{ label: "401(k) Employer Match Explained", href: "/guides/401k-employer-match-explained" }],
      },
    ],
  },
  {
    slug: "roth-vs-traditional-401k",
    title: "Roth vs Traditional 401(k): How to Choose",
    description:
      "A practical framework for deciding between Roth and Traditional 401(k) contributions based on tax timing and flexibility.",
    excerpt:
      "How to choose between Roth and Traditional 401(k) contributions without guesswork or tax myths.",
    authorId: "founder",
    category: "Tax Strategy",
    publishedAt: "2026-03-05",
    reviewedAt: "2026-03-08",
    updatedAt: "2026-03-10",
    readingTime: "9 min read",
    relatedSlugs: [
      "how-much-should-i-have-in-my-401k-at-40",
      "how-much-should-i-have-in-my-401k-at-50",
      "401k-employer-match-explained",
    ],
    content: [
      {
        heading: "The core decision is tax timing, not tax elimination",
        paragraphs: [
          "Traditional 401(k) contributions typically reduce taxable income now, while Roth contributions are taxed now but can be withdrawn tax-free in retirement if qualified.",
          "The question is whether your marginal tax rate is likely higher today or later when you start drawing income.",
        ],
      },
      {
        heading: "When Roth tends to be more attractive",
        paragraphs: [
          "Roth often looks stronger when you are early in your career, currently in a lower tax bracket, or expect materially higher retirement income later.",
          "It can also help if you value predictable tax-free income streams in retirement and want more flexibility when managing taxable withdrawals.",
        ],
      },
      {
        heading: "When Traditional tends to be more attractive",
        paragraphs: [
          "Traditional often appeals during peak earning years when your current marginal tax rate is high and tax deductions today improve cash flow.",
          "For many households, the tax savings can be redirected into additional investing, increasing total savings capacity.",
        ],
      },
      {
        heading: "A split strategy can be the most practical answer",
        paragraphs: [
          "You do not need a permanent all-or-nothing position. Many savers use a blended contribution approach so retirement withdrawals can be drawn from both tax buckets.",
          "Revisit your split whenever income, filing status, or tax policy shifts materially.",
        ],
        bullets: [
          "Keep contributing enough to capture full employer match.",
          "Adjust Roth/Traditional split when your tax bracket changes.",
          "Review your setup at least once per year.",
        ],
        links: [{ label: "401(k) Employer Match Explained", href: "/guides/401k-employer-match-explained" }],
      },
      {
        heading: "Model both choices before you commit",
        paragraphs: [
          "Use projections to compare the long-term outcome of different contribution splits under conservative assumptions. Scenario analysis usually surfaces the right default faster than debating edge cases.",
          "Focus on the plan you can sustain for the next decade, not the one that is theoretically perfect for one tax year.",
        ],
        links: [{ label: "Compare scenarios in the 401(k) calculator", href: "/401k-calculator" }],
      },
    ],
  },
  {
    slug: "401k-employer-match-explained",
    title: "401(k) Employer Match Explained",
    description:
      "Learn how 401(k) match formulas, vesting schedules, and payroll timing rules affect your total compensation.",
    excerpt:
      "A straightforward breakdown of employer match mechanics so you can avoid leaving compensation behind.",
    authorId: "founder",
    category: "Employer Benefits",
    publishedAt: "2026-03-06",
    reviewedAt: "2026-03-09",
    updatedAt: "2026-03-10",
    readingTime: "7 min read",
    relatedSlugs: ["roth-vs-traditional-401k", "how-much-should-i-have-in-my-401k-at-30", "how-much-should-i-have-in-my-401k-at-40"],
    content: [
      {
        heading: "Match is part of your compensation package",
        paragraphs: [
          "Employer match is effectively additional pay tied to your 401(k) contributions. Not capturing it usually means leaving guaranteed compensation on the table.",
          "Your first planning priority is to understand exactly how your plan formula works in practice.",
        ],
      },
      {
        heading: "Translate the formula into your required contribution rate",
        paragraphs: [
          "A common formula is 50% match on the first 6% you contribute. In that case, contributing at least 6% is required to receive the full match.",
          "Different plans use different caps and percentages, so confirm your exact summary plan description before setting your deferral rate.",
        ],
      },
      {
        heading: "Pay-period rules and true-up provisions matter",
        paragraphs: [
          "Some plans apply match limits per paycheck. If you front-load contributions and stop later in the year, you could miss match dollars unless the plan includes a true-up.",
          "Steady payroll contributions across the year are usually safer when true-up behavior is unclear.",
        ],
      },
      {
        heading: "Vesting determines how much of the match you keep",
        paragraphs: [
          "Your own contributions are always yours, but employer match may vest over time. If you might switch jobs, vesting schedules can materially change the value you retain.",
          "Always check vesting policy before making assumptions about total account ownership.",
        ],
      },
      {
        heading: "Optimization checklist",
        paragraphs: [
          "Once you know the formula, set a contribution rate that reliably captures full match, then evaluate whether additional savings should go to Traditional or Roth based on tax context.",
          "After this baseline is locked in, run long-term projections to determine your next contribution target.",
        ],
        bullets: [
          "Confirm your plan's match formula and cap.",
          "Contribute enough each pay period to receive full match.",
          "Review vesting schedule if a job change is possible.",
        ],
        links: [
          { label: "Roth vs Traditional 401(k)", href: "/guides/roth-vs-traditional-401k" },
          { label: "Use the 401(k) calculator", href: "/401k-calculator" },
        ],
      },
    ],
  },
];

const guideLookup = new Map(guides.map((guide) => [guide.slug, guide]));

const guideDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function getAllGuides(): Guide[] {
  return guides;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guideLookup.get(slug);
}

export function getGuideSlugs(): string[] {
  return guides.map((guide) => guide.slug);
}

export function getGuideCategories(): string[] {
  return Array.from(new Set(guides.map((guide) => guide.category).filter((category): category is string => Boolean(category))));
}

export function getRelatedGuides(slug: string, limit = 3): Guide[] {
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return [];
  }

  const explicitRelated = (guide.relatedSlugs ?? [])
    .map((relatedSlug) => getGuideBySlug(relatedSlug))
    .filter((relatedGuide): relatedGuide is Guide => Boolean(relatedGuide));

  const alreadyIncluded = new Set([slug, ...explicitRelated.map((relatedGuide) => relatedGuide.slug)]);

  const sameCategory = guides.filter(
    (candidate) => candidate.category === guide.category && !alreadyIncluded.has(candidate.slug),
  );

  const sameCategorySlugs = new Set(sameCategory.map((candidate) => candidate.slug));
  const fallback = guides.filter((candidate) => !alreadyIncluded.has(candidate.slug) && !sameCategorySlugs.has(candidate.slug));

  return [...explicitRelated, ...sameCategory, ...fallback].slice(0, limit);
}

export function formatGuideDate(date?: string): string | undefined {
  if (!date) {
    return undefined;
  }

  const parsedDate = new Date(`${date}T12:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return guideDateFormatter.format(parsedDate);
}

export function getGuideDateObject(date?: string): Date | undefined {
  if (!date) {
    return undefined;
  }

  const parsedDate = new Date(`${date}T12:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
}

export function getGuideReviewedDate(guide: Guide): string | undefined {
  return guide.reviewedAt ?? guide.updatedAt ?? guide.publishedAt;
}

export function getGuideModifiedDate(guide: Guide): string | undefined {
  return guide.updatedAt ?? guide.reviewedAt ?? guide.publishedAt;
}
