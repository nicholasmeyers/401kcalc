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
  /** Hero/OG image path (e.g. /images/guide-images/sprout.png) */
  imageUrl?: string;
  /** Focus point when image is cropped: which area stays visible (default: center) */
  imagePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
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
    title: "How Much Should I Have in My 401k at 30?",
    description:
      "Use realistic age-30 401k benchmarks, contribution targets, and action steps to build momentum early.",
    excerpt:
      "A practical benchmark and action plan for hitting your first serious 401k milestone by age 30.",
    authorId: "founder",
    category: "401k Milestones",
    imageUrl: "/images/guide-images/sprout.png",
    publishedAt: "2026-03-01",
    reviewedAt: "2026-03-01",
    readingTime: "3 min read",
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
        links: [{ label: "401k Employer Match Explained", href: "/guides/401k-employer-match-explained" }],
      },
      {
        heading: "Choose tax treatment with intention",
        paragraphs: [
          "Early-career savers often default without evaluating Roth vs Traditional. If your current tax bracket is relatively low, Roth contributions can be compelling because qualified withdrawals are tax-free later.",
          "If current cash flow is the main constraint, Traditional contributions can reduce taxable income now and make higher contribution rates easier to sustain.",
        ],
        links: [{ label: "Roth vs Traditional 401k", href: "/guides/roth-vs-traditional-401k" }],
      },
      {
        heading: "Run scenarios instead of guessing",
        paragraphs: [
          "Use a projection tool to compare your current contribution rate with a slightly higher one. The gap over 30-plus years is often much larger than expected.",
          "Model at least two scenarios: your current path and an improved path with a modest increase. Then commit to the version you can maintain.",
        ],
        links: [{ label: "Model your plan with the 401k calculator", href: "/401k-calculator" }],
      },
    ],
  },
  {
    slug: "how-much-should-i-have-in-my-401k-at-40",
    title: "How Much Should I Have in My 401k at 40?",
    description:
      "Understand age-40 retirement savings targets and the most effective ways to close gaps in your 401k.",
    excerpt:
      "A focused framework for checking your 401k progress at 40 and improving your plan without overreacting.",
    authorId: "founder",
    category: "401k Milestones",
    imageUrl: "/images/guide-images/chart.svg",
    publishedAt: "2026-03-02",
    reviewedAt: "2026-03-02",
    readingTime: "3 min read",
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
        links: [{ label: "How to decide Roth vs Traditional 401k", href: "/guides/roth-vs-traditional-401k" }],
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
    title: "How Much Should I Have in My 401k at 50?",
    description:
      "Evaluate your age-50 401k progress, close savings gaps, and use catch-up years effectively.",
    excerpt:
      "How to assess your 401k at 50, prioritize the right levers, and strengthen your final accumulation decade.",
    authorId: "founder",
    category: "401k Milestones",
    imageUrl: "/images/guide-images/make-plan.png",
    publishedAt: "2026-03-03",
    reviewedAt: "2026-03-03",
    updatedAt: "2026-03-15",
    readingTime: "3 min read",
    relatedSlugs: ["how-much-should-i-have-in-my-401k-at-40", "how-much-should-i-have-in-my-401k-at-60", "roth-vs-traditional-401k"],
    content: [
      {
        heading: "A common age-50 reference range is 5x to 6x salary",
        paragraphs: [
          "Around age 50, many planners use a benchmark near 5x to 6x salary saved. Your exact target depends on retirement age, desired spending, and expected non-401k income.",
          "Being below that range is not a dead end. It means your next decade decisions around contribution rate and retirement timing become especially important.",
        ],
      },
      {
        heading: "Catch-up years are powerful, but only if you use them consistently",
        paragraphs: [
          "IRS catch-up rules can significantly increase what you can save in your 50s. In 2026, workers 50 and older can contribute an additional $8,000 beyond the standard 401(k) limit, and ages 60 through 63 qualify for an even higher $11,250 catch-up under the newer super catch-up rules.",
          "If maxing out is unrealistic, define a step-up schedule and make contributions automatic so progress does not depend on monthly willpower. Even a 1 to 2 percentage-point increase per year can materially improve your age-60 position.",
        ],
        bullets: [
          "Confirm annual contribution limits and catch-up rules each year.",
          "Prioritize full employer match before optional investing accounts.",
          "Treat salary increases as an opportunity to raise deferral rates.",
        ],
        links: [{ label: "401k Contribution Limits for 2026", href: "/guides/401k-contribution-limits" }],
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
        links: [{ label: "How Much Should I Have in My 401k at 60?", href: "/guides/how-much-should-i-have-in-my-401k-at-60" }],
      },
    ],
  },
  {
    slug: "how-much-should-i-have-in-my-401k-at-60",
    title: "How Much Should I Have in My 401k at 60?",
    description:
      "Assess your age-60 401k readiness with practical benchmarks, withdrawal-aware planning, and final pre-retirement checks.",
    excerpt:
      "A practical age-60 readiness review to tighten your retirement plan before distribution decisions begin.",
    authorId: "founder",
    category: "401k Milestones",
    imageUrl: "/images/guide-images/senior-beach.png",
    publishedAt: "2026-03-04",
    reviewedAt: "2026-03-04",
    updatedAt: "2026-03-09",
    readingTime: "4 min read",
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
        links: [{ label: "Project withdrawals with the 401k calculator", href: "/401k-calculator" }],
      },
      {
        heading: "Tax planning becomes a central retirement lever",
        paragraphs: [
          "By 60, account-type diversification can reduce future tax friction. Households with only pre-tax savings often have fewer withdrawal options when managing taxable income in retirement.",
          "If your plan allows Roth contributions, evaluate whether shifting some new savings to Roth improves long-term flexibility.",
        ],
        links: [{ label: "Roth vs Traditional 401k decision guide", href: "/guides/roth-vs-traditional-401k" }],
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
        links: [{ label: "401k Employer Match Explained", href: "/guides/401k-employer-match-explained" }],
      },
    ],
  },
  {
    slug: "roth-vs-traditional-401k",
    title: "Roth vs Traditional 401k: How to Choose",
    description:
      "A practical framework for deciding between Roth and Traditional 401k contributions based on tax timing and flexibility.",
    excerpt:
      "How to choose between Roth and Traditional 401k contributions without guesswork or tax myths.",
    authorId: "founder",
    category: "Tax Strategy",
    imageUrl: "/images/guide-images/vector-plan.png",
    publishedAt: "2026-03-05",
    reviewedAt: "2026-03-08",
    updatedAt: "2026-03-15",
    readingTime: "4 min read",
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
          "Revisit your split whenever income, filing status, or tax policy shifts materially. Starting in 2026, some higher earners age 50 and older may also need to make catch-up contributions as Roth rather than pre-tax, which makes annual review more important.",
        ],
        bullets: [
          "Keep contributing enough to capture full employer match.",
          "Adjust Roth/Traditional split when your tax bracket changes.",
          "Review your setup at least once per year.",
        ],
        links: [
          { label: "401k Employer Match Explained", href: "/guides/401k-employer-match-explained" },
          { label: "401k Contribution Limits for 2026", href: "/guides/401k-contribution-limits" },
        ],
      },
      {
        heading: "Catch-up contributions can change the tax-choice conversation",
        paragraphs: [
          "Beginning in 2026, workers age 50 and older with prior-year FICA wages above $145,000 generally must make catch-up contributions as Roth. That means the catch-up dollars no longer reduce taxable income today, even if the rest of your 401(k) contributions are Traditional.",
          "If you are near or above that threshold, review your pay stub and W-2 assumptions rather than assuming you still control the tax treatment of every contribution dollar.",
        ],
        links: [{ label: "401k Contribution Limits for 2026", href: "/guides/401k-contribution-limits" }],
      },
      {
        heading: "Model both choices before you commit",
        paragraphs: [
          "Use projections to compare the long-term outcome of different contribution splits under conservative assumptions. Scenario analysis usually surfaces the right default faster than debating edge cases.",
          "Focus on the plan you can sustain for the next decade, not the one that is theoretically perfect for one tax year.",
        ],
        links: [{ label: "Compare scenarios in the 401k calculator", href: "/401k-calculator" }],
      },
    ],
  },
  {
    slug: "401k-employer-match-explained",
    title: "401k Employer Match Explained",
    description:
      "Learn how 401k match formulas, vesting schedules, and payroll timing rules affect your total compensation.",
    excerpt:
      "A straightforward breakdown of employer match mechanics so you can avoid leaving compensation behind.",
    authorId: "founder",
    category: "Employer Benefits",
    imageUrl: "/images/guide-images/dollars-stacks.png",
    imagePosition: "top-left",
    publishedAt: "2026-03-06",
    reviewedAt: "2026-03-09",
    updatedAt: "2026-03-15",
    readingTime: "3 min read",
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
          "Different plans use different caps and percentages, so confirm your exact summary plan description before setting your deferral rate. Running a quick example usually makes the formula much easier to understand.",
        ],
        bullets: [
          "50% match on the first 6%: contribute 6% to receive a 3% employer contribution.",
          "100% match on the first 4%: contribute 4% to receive a 4% employer contribution.",
          "25% match on the first 8%: contribute 8% to receive a 2% employer contribution.",
        ],
        links: [{ label: "How Much Should I Contribute to My 401k?", href: "/guides/how-much-should-i-contribute-to-my-401k" }],
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
          { label: "Roth vs Traditional 401k", href: "/guides/roth-vs-traditional-401k" },
          { label: "Use the 401k calculator", href: "/401k-calculator" },
        ],
      },
    ],
  },
  {
    slug: "401k-contribution-limits",
    title: "401k Contribution Limits for 2026",
    description:
      "2026 401k contribution limits, catch-up amounts, super catch-up for ages 60 to 63, and the new Roth catch-up rule.",
    excerpt:
      "The 2026 401k limits, catch-up amounts, and paycheck planning math in plain English.",
    authorId: "founder",
    category: "Tax Strategy",
    imageUrl: "/images/guide-images/close-up-100-dollar-bill.png",
    publishedAt: "2026-03-15",
    reviewedAt: "2026-03-15",
    updatedAt: "2026-03-15",
    readingTime: "5 min read",
    relatedSlugs: [
      "401k-employer-match-explained",
      "how-much-should-i-contribute-to-my-401k",
      "how-much-should-i-have-in-my-401k-at-50",
    ],
    content: [
      {
        heading: "2026 401k limits at a glance",
        paragraphs: [
          "The standard 401(k) elective deferral limit for 2026 is $24,500. If you are 50 or older by year-end, you can contribute more through catch-up contributions.",
          "The biggest new detail is the higher super catch-up for workers ages 60 through 63. That group can contribute more than the standard age-50-plus catch-up amount in 2026.",
        ],
        bullets: [
          "Under age 50: up to $24,500.",
          "Ages 50 to 59 and 64+: up to $32,500 total ($24,500 + $8,000 catch-up).",
          "Ages 60 to 63: up to $35,750 total ($24,500 + $11,250 higher catch-up).",
        ],
      },
      {
        heading: "Your deferral limit is not the same as the total plan limit",
        paragraphs: [
          "There are two numbers readers often mix up: your elective deferral limit and the plan's total annual additions limit. In 2026, the total annual additions limit is $72,000 before catch-up contributions are counted.",
          "That means employer match and employer profit-sharing do not reduce your $24,500 employee deferral limit. They count toward the larger $72,000 plan-level cap instead.",
        ],
        bullets: [
          "Your salary deferrals count toward the $24,500 employee limit.",
          "Employer match counts toward the $72,000 total annual additions limit.",
          "Catch-up contributions sit on top of the $72,000 limit.",
        ],
        links: [{ label: "401k Employer Match Explained", href: "/guides/401k-employer-match-explained" }],
      },
      {
        heading: "The new Roth catch-up rule matters for higher earners",
        paragraphs: [
          "Starting in 2026, workers age 50 and older with prior-year FICA wages above $145,000 generally must make catch-up contributions as Roth instead of pre-tax. The threshold is based on Medicare wages, not taxable wages after pre-tax deductions.",
          "Below that threshold, you can usually still choose whether catch-up dollars are Traditional or Roth if your plan supports both. Above it, the tax treatment of your catch-up dollars may be decided for you.",
        ],
        bullets: [
          "The rule applies to catch-up dollars, not your entire 401(k) contribution.",
          "The wage test uses prior-year FICA wages.",
          "Check whether your employer plan supports Roth contributions before assuming catch-up flexibility.",
        ],
        links: [{ label: "Roth vs Traditional 401k", href: "/guides/roth-vs-traditional-401k" }],
      },
      {
        heading: "Turn the annual limit into a paycheck target",
        paragraphs: [
          "The annual limit is only useful if you know what it means per paycheck. On a biweekly payroll, maxing a standard 2026 contribution limit means about $942 per paycheck. The age-50 catch-up total is about $1,250 per paycheck, and the ages-60-to-63 super catch-up total is about $1,375 per paycheck.",
          "You can also translate the limit into a salary percentage. For example, $24,500 is 24.5% of a $100,000 salary, while $24,500 is about 16.3% of a $150,000 salary. A 61-year-old earning $150,000 would need about 23.8% to hit the full $35,750 super catch-up total.",
        ],
        bullets: [
          "Biweekly max for under 50: about $942 per paycheck.",
          "Biweekly max for ages 50 to 59 and 64+: about $1,250 per paycheck.",
          "Biweekly max for ages 60 to 63: about $1,375 per paycheck.",
        ],
      },
      {
        heading: "Avoid front-loading mistakes",
        paragraphs: [
          "If your plan matches contributions each pay period, maxing out too early can cost you employer match later in the year unless the plan has a true-up provision. That is a common mistake for high savers who set an aggressive percentage and stop contributing by fall.",
          "Use the calculator to project your contribution rate, then confirm with payroll whether your match is per-paycheck or includes a year-end true-up. A steady contribution schedule is often safer than front-loading if the match rules are unclear.",
        ],
        links: [
          { label: "How Much Should I Contribute to My 401k?", href: "/guides/how-much-should-i-contribute-to-my-401k" },
          { label: "Run scenarios in the 401k calculator", href: "/401k-calculator" },
        ],
      },
    ],
  },
  {
    slug: "how-much-should-i-contribute-to-my-401k",
    title: "How Much Should I Contribute to My 401k?",
    description:
      "How much to contribute to your 401k, from match-first minimums to stronger long-term savings targets.",
    excerpt:
      "A practical guide to choosing a 401k contribution percentage that fits your budget and goals.",
    authorId: "founder",
    category: "Contribution Strategy",
    imageUrl: "/images/guide-images/hundos.png",
    imagePosition: "top-left",
    publishedAt: "2026-03-15",
    reviewedAt: "2026-03-15",
    updatedAt: "2026-03-15",
    readingTime: "5 min read",
    relatedSlugs: [
      "401k-employer-match-explained",
      "401k-contribution-limits",
      "how-much-should-i-have-in-my-401k-at-30",
    ],
    content: [
      {
        heading: "Start with the full employer match, then set a realistic target",
        paragraphs: [
          "The first step is to contribute enough to capture your full employer match. That is effectively free compensation; not taking it usually means leaving money on the table.",
          "Once you are capturing full match, the next question is how much more you can sustainably contribute. A common rule of thumb is around 15% of salary toward retirement, including employer contributions, but your target depends on when you started, your retirement age, and your current balance.",
        ],
        bullets: [
          "Minimum strong default: contribute enough to capture the full match.",
          "Common long-term target: around 15% of salary including match.",
          "Late starters often need a higher rate than early starters.",
        ],
        links: [{ label: "401k Employer Match Explained", href: "/guides/401k-employer-match-explained" }],
      },
      {
        heading: "Use ranges instead of looking for one magic number",
        paragraphs: [
          "A contribution rate you can keep for years beats a high rate you abandon when life gets expensive. Start at a level that fits your budget, then plan automatic increases when you get raises or bonuses.",
          "For many workers, 6% to 10% of salary is a reasonable early target if they are also getting a match. Moving toward 10% to 15% is stronger for long-term retirement readiness, and many late starters will need 15% or more.",
        ],
        bullets: [
          "6% to 10%: often a realistic starting range if you are early in your career.",
          "10% to 15%: stronger range for many mid-career savers.",
          "15%+: often necessary for people who started late or want a more aggressive catch-up plan.",
        ],
        links: [
          { label: "How Much Should I Have in My 401k at 30?", href: "/guides/how-much-should-i-have-in-my-401k-at-30" },
          { label: "How Much Should I Have in My 401k at 50?", href: "/guides/how-much-should-i-have-in-my-401k-at-50" },
        ],
      },
      {
        heading: "Translate your percentage into dollars",
        paragraphs: [
          "A percentage feels abstract until you turn it into dollars. On an $80,000 salary, 6% is $4,800 per year, 10% is $8,000, and 15% is $12,000 before any employer match is added.",
          "Use the calculator to compare your current rate with a slightly higher one. A 2 percentage-point increase sustained for decades can add meaningfully to your retirement balance, and seeing the annual dollar amount makes the tradeoff easier to understand.",
        ],
        bullets: [
          "6% of $80,000 salary = $4,800 per year.",
          "10% of $80,000 salary = $8,000 per year.",
          "15% of $80,000 salary = $12,000 per year.",
        ],
        links: [{ label: "401k calculator", href: "/401k-calculator" }],
      },
      {
        heading: "Increase contributions when life changes, not just when you feel motivated",
        paragraphs: [
          "Salary increases, debt payoff, and expense changes are natural times to bump your contribution. Do not wait for a perfect moment; a modest increase now is usually better than a large one later.",
          "Many savers increase by 1 to 2 percentage points per year until they reach their target. If you are getting close to the annual contribution limit, confirm the current limits and adjust your percentage so you do not cap out early and miss employer match later in the year.",
        ],
        links: [
          { label: "401k Contribution Limits for 2026", href: "/guides/401k-contribution-limits" },
          { label: "How Much Should I Have in My 401k at 30?", href: "/guides/how-much-should-i-have-in-my-401k-at-30" },
          { label: "How Much Should I Have in My 401k at 40?", href: "/guides/how-much-should-i-have-in-my-401k-at-40" },
        ],
      },
    ],
  },
  {
    slug: "what-to-do-with-your-401k-when-you-leave-a-job",
    title: "What to Do With Your 401k When You Leave a Job",
    description:
      "Your 401k options after leaving a job: roll over to a new 401k, roll to an IRA, leave it, or cash out.",
    excerpt:
      "A clear rollover-vs-IRA-vs-leave-it decision guide for your old 401k.",
    authorId: "founder",
    category: "Life Events",
    imageUrl: "/images/guide-images/vector-plan.png",
    publishedAt: "2026-03-15",
    reviewedAt: "2026-03-15",
    updatedAt: "2026-03-15",
    readingTime: "5 min read",
    relatedSlugs: [
      "401k-employer-match-explained",
      "self-employed-401k-vs-sep-ira",
      "backdoor-roth-ira",
    ],
    content: [
      {
        heading: "For most people, a direct rollover is the cleanest default",
        paragraphs: [
          "Moving your old 401(k) into your new employer's plan or an IRA keeps your retirement savings consolidated and under your control. A direct rollover, also called trustee-to-trustee transfer, avoids withholding, taxes, and penalties.",
          "For many people, the main decision is new employer 401k versus IRA. A new employer plan can be cleaner if you want to preserve backdoor Roth flexibility, while an IRA often wins on investment choice and convenience.",
        ],
        bullets: [
          "Roll to new 401k: often best if you value backdoor Roth flexibility or like the new plan.",
          "Roll to IRA: often best if you want wider investment choices and easier account control.",
          "Use a direct rollover whenever possible.",
        ],
      },
      {
        heading: "Leaving the money in the old plan can still make sense sometimes",
        paragraphs: [
          "You can leave your balance in your former employer's plan if the plan allows it. That can work if you like the investment options and fees, but you will have multiple accounts to manage.",
          "There are a few legitimate reasons to leave it behind temporarily. Consider vesting if you have unvested employer match, and consider age-55 withdrawal rules if you separate from service in or after the year you turn 55.",
        ],
        links: [{ label: "401k Employer Match Explained", href: "/guides/401k-employer-match-explained" }],
      },
      {
        heading: "Cashing out is almost always costly",
        paragraphs: [
          "Withdrawing the balance before age 59½ typically triggers income tax plus a 10% early withdrawal penalty. Unless you are in a severe financial emergency, cashing out usually erodes retirement security significantly.",
          "If you cash out $50,000 early, the 10% penalty alone could cost $5,000 before ordinary income taxes are added. If you must access funds, explore hardship withdrawal rules or loans from your new plan first. Both have drawbacks, but they are often less destructive than a full cash-out.",
        ],
      },
      {
        heading: "Rollover to IRA: watch the pro-rata rule if you use backdoor Roth",
        paragraphs: [
          "Rolling into a Traditional IRA is fine for most people. But if you expect to use a backdoor Roth IRA conversion in the future, pre-tax IRA balances can trigger the pro-rata rule and increase your tax bill.",
          "In that case, rolling into your new employer's 401(k) instead of an IRA may keep your backdoor Roth strategy cleaner.",
        ],
        links: [{ label: "Backdoor Roth IRA: How It Works", href: "/guides/backdoor-roth-ira" }],
      },
      {
        heading: "Action checklist",
        paragraphs: [
          "Before leaving, confirm vesting status and any outstanding 401(k) loans. After your last paycheck, request a direct rollover instead of a check made out to you personally. If you roll to an IRA, choose a provider with low fees and invest the money promptly instead of leaving it in cash.",
        ],
        bullets: [
          "Confirm vesting and loan status before leaving.",
          "Ask whether the old plan allows direct rollover by check or electronic transfer.",
          "Use a direct rollover to avoid taxes and penalties.",
          "If you may use backdoor Roth, consider rolling to the new 401k instead of an IRA.",
          "Confirm the money arrived and was actually invested in the new account.",
        ],
        links: [{ label: "Self-Employed 401k: Solo 401k vs SEP IRA", href: "/guides/self-employed-401k-vs-sep-ira" }],
      },
    ],
  },
  {
    slug: "self-employed-401k-vs-sep-ira",
    title: "Self-Employed 401k: Solo 401k vs SEP IRA",
    description:
      "Solo 401k vs SEP IRA for self-employed workers, freelancers, contractors, and side-income earners.",
    excerpt:
      "How to choose between a Solo 401k and SEP IRA, plus when SIMPLE IRA belongs in the conversation.",
    authorId: "founder",
    category: "Life Events",
    imageUrl: "/images/guide-images/savings.png",
    publishedAt: "2026-03-15",
    reviewedAt: "2026-03-15",
    updatedAt: "2026-03-15",
    readingTime: "5 min read",
    relatedSlugs: [
      "what-to-do-with-your-401k-when-you-leave-a-job",
      "401k-contribution-limits",
      "roth-vs-traditional-401k",
    ],
    content: [
      {
        heading: "Who this applies to",
        paragraphs: [
          "If you freelance, consult, run a single-member business, or earn meaningful side income, you are not limited to a standard IRA. Self-employed savers often use Solo 401(k)s or SEP-IRAs to unlock much higher contribution potential.",
          "The right choice depends on your income, whether you have employees, whether you want Roth contributions, and how much administrative complexity you are willing to tolerate.",
        ],
      },
      {
        heading: "Solo 401k: usually strongest when you have no employees",
        paragraphs: [
          "A Solo 401(k) lets you contribute as both employee and employer. In 2026, that means up to $24,500 of employee deferrals, plus employer contributions, up to the overall annual additions limit of $72,000 before catch-up amounts are counted.",
          "That structure often makes the Solo 401k the most powerful option for self-employed people with no employees. It can also offer Roth contributions, which SEP-IRAs do not.",
        ],
        bullets: [
          "Elective deferrals use the same annual limit as a workplace 401(k).",
          "Catch-up contributions apply if you are 50 or older.",
          "Roth employee contributions may be available depending on the provider.",
          "Generally best when you have no common-law employees.",
        ],
        links: [{ label: "401k Contribution Limits for 2026", href: "/guides/401k-contribution-limits" }],
      },
      {
        heading: "SEP-IRA: simpler, but with fewer planning levers",
        paragraphs: [
          "A SEP-IRA is easier to set up and maintain than a Solo 401(k). You contribute only as the employer, up to a percentage of net self-employment income, with a higher dollar cap than a Traditional IRA.",
          "If you have employees, you must generally contribute the same percentage for them. That can make a SEP-IRA less attractive if you want to maximize your own savings without employer obligations. It is often best when simplicity matters more than squeezing out every last contribution advantage.",
        ],
      },
      {
        heading: "Related option: SIMPLE IRA",
        paragraphs: [
          "A SIMPLE IRA can also fit small businesses that want lower administrative complexity and do not need the highest contribution limits. It is usually less powerful than a Solo 401(k) for a one-person business, but it can be easier to understand and maintain.",
          "If your main goal is maximum savings flexibility, the Solo 401k usually wins. If your goal is low friction, a SIMPLE IRA or SEP-IRA may be worth considering.",
        ],
        links: [{ label: "Roth vs Traditional 401k", href: "/guides/roth-vs-traditional-401k" }],
      },
      {
        heading: "Think about deadlines, employees, and coordination with other plans",
        paragraphs: [
          "If you also have a workplace 401(k), remember that your employee deferral limit is shared across 401k plans. You cannot make a full employee deferral to both a day-job 401k and a Solo 401k in the same year.",
          "Also think ahead about plan setup deadlines and whether you may add employees in the future. A Solo 401k becomes more complicated once you are no longer truly solo.",
        ],
        links: [
          { label: "401k calculator", href: "/401k-calculator" },
          { label: "401k Contribution Limits for 2026", href: "/guides/401k-contribution-limits" },
        ],
      },
    ],
  },
  {
    slug: "backdoor-roth-ira",
    title: "Backdoor Roth IRA: How It Works",
    description:
      "How a backdoor Roth IRA works, when the pro-rata rule creates taxes, and who should consider using it.",
    excerpt:
      "A plain-English backdoor Roth IRA guide with conversion steps and a pro-rata example.",
    authorId: "founder",
    category: "Life Events",
    imageUrl: "/images/guide-images/vector-plan.png",
    publishedAt: "2026-03-15",
    reviewedAt: "2026-03-15",
    updatedAt: "2026-03-15",
    readingTime: "5 min read",
    relatedSlugs: [
      "roth-vs-traditional-401k",
      "what-to-do-with-your-401k-when-you-leave-a-job",
      "401k-contribution-limits",
    ],
    content: [
      {
        heading: "The backdoor Roth works around income limits",
        paragraphs: [
          "Roth IRA contributions are phased out at higher income levels. The backdoor Roth strategy lets you make a non-deductible contribution to a Traditional IRA and then convert that amount to a Roth IRA.",
          "In 2026, the standard IRA contribution limit is $7,500. When done correctly, the strategy can still give high earners Roth IRA exposure, but only if the conversion tax math works in your favor.",
        ],
      },
      {
        heading: "The pro-rata rule is the main trap",
        paragraphs: [
          "If you have other pre-tax IRA balances (Traditional, SEP, SIMPLE), the IRS treats all IRAs as one when taxing the conversion. You cannot convert only the non-deductible portion; a portion of the conversion is taxed based on the ratio of pre-tax to total IRA assets.",
          "That often means paying more tax than expected. For example, if you already have $60,000 of pre-tax IRA money and make a new $7,500 non-deductible contribution, only about 11% of a $7,500 conversion would be tax-free. To avoid that problem, some people roll pre-tax IRA balances into a 401(k) before doing the backdoor conversion, leaving only the new non-deductible contribution in the IRA.",
        ],
        links: [{ label: "What to Do With Your 401k When You Leave a Job", href: "/guides/what-to-do-with-your-401k-when-you-leave-a-job" }],
      },
      {
        heading: "Execute in the right order",
        paragraphs: [
          "The typical backdoor flow: contribute to a Traditional IRA (non-deductible), then convert to Roth. Do both in the same year or split across years depending on your plan.",
          "Some providers offer a streamlined process. Document the contribution and conversion for tax purposes; you will report basis and conversion details on Form 8606.",
        ],
        bullets: [
          "Contribute non-deductible amount to Traditional IRA.",
          "Convert to Roth IRA (often immediately to minimize gains).",
          "File Form 8606 with your tax return.",
        ],
      },
      {
        heading: "When it makes sense",
        paragraphs: [
          "The backdoor Roth is most useful when you have maxed out your 401(k) contributions and HSA, want additional Roth exposure, and have no pre-tax IRA balances (or can move them to a 401k).",
          "If you have significant pre-tax IRA money, the pro-rata tax may outweigh the benefit. It is usually worth pausing before you proceed if you have SEP or SIMPLE IRA balances, uncertain tax reporting, or a recent rollover that changed your IRA mix.",
        ],
        links: [{ label: "Roth vs Traditional 401k", href: "/guides/roth-vs-traditional-401k" }],
      },
      {
        heading: "Tax law can change",
        paragraphs: [
          "Backdoor Roth conversions have been discussed in tax reform proposals. The strategy is valid under current law, but future legislation could limit or eliminate it.",
          "If you are eligible and the math works, executing sooner rather than later may reduce regulatory risk.",
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
