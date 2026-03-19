import Link from "next/link";
import styled from "styled-components";

import { SectionSubtitle, SectionTitle, SurfaceCard } from "@/components/ui/primitives";
import { getGuideBySlug } from "@/lib/guides/guides";
import type { RetirementBenchmark } from "@/lib/retirement-benchmarks/benchmarks";
import { theme } from "@/styles/theme";

const contributionGuide = getGuideBySlug("how-much-should-i-contribute-to-my-401k");
const employerMatchGuide = getGuideBySlug("401k-employer-match-explained");
const rothGuide = getGuideBySlug("roth-vs-traditional-401k");

const plannerHighlights = [
  {
    title: "What retirement-by-age benchmarks are good for",
    body:
      "Benchmarks give you a fast directional check. They help answer whether your savings pace looks broadly in line with common checkpoints before you build a full retirement projection.",
  },
  {
    title: "What these milestones do not do",
    body:
      "A salary multiple is not a personal guarantee of retirement readiness. Spending needs, retirement age, other assets, and contribution consistency still matter more than hitting a round number exactly.",
  },
  {
    title: "Best way to use this planner",
    body:
      "Use the benchmark planner to spot whether you look ahead, close, or behind for your age. Then jump into the full 401(k) calculator to test how contribution changes, employer match, and retirement timing affect the long-term path.",
  },
];

const plannerBridgeCards = [
  {
    eyebrow: "Full projection",
    title: "Run the complete 401k calculator",
    body:
      "If you want more than a checkpoint, use the full calculator to model retirement age, spending, Roth balance mix, and year-by-year drawdown.",
    href: "/401k-calculator",
    label: "Open the full calculator",
  },
  {
    eyebrow: "Contribution rate",
    title: contributionGuide?.title ?? "How Much Should I Contribute to My 401k?",
    body:
      contributionGuide?.excerpt ??
      "A practical guide to choosing a contribution rate you can sustain and improve over time.",
    href: contributionGuide?.slug ? `/guides/${contributionGuide.slug}` : "/guides/how-much-should-i-contribute-to-my-401k",
    label: "Read the contribution guide",
  },
  {
    eyebrow: "Employer match",
    title: employerMatchGuide?.title ?? "401k Employer Match Explained",
    body:
      employerMatchGuide?.excerpt ??
      "Use this if you need help deciding how match should influence your savings target and your calculator assumptions.",
    href: employerMatchGuide?.slug ? `/guides/${employerMatchGuide.slug}` : "/guides/401k-employer-match-explained",
    label: "See match examples",
  },
  {
    eyebrow: "Tax treatment",
    title: rothGuide?.title ?? "Roth vs Traditional 401k",
    body:
      rothGuide?.excerpt ??
      "Benchmark pages tell you whether you may be on track. This guide helps with the separate question of where the next contribution dollar should go.",
    href: rothGuide?.slug ? `/guides/${rothGuide.slug}` : "/guides/roth-vs-traditional-401k",
    label: "Compare Roth vs Traditional",
  },
];

export const retirementByAgeFaqs = [
  {
    question: "How much should I have in my 401k at my age?",
    answer:
      "There is no single number that fits everyone, but age-based salary multiples are a common way to benchmark progress. Use this planner for a directional checkpoint, then move into the full calculator to test whether your actual savings plan supports the retirement lifestyle you want.",
    href: "/401k-calculator",
    label: "Run a full projection",
  },
  {
    question: "Are retirement benchmarks exact targets?",
    answer:
      "No. They are reference points, not pass-or-fail scores. A useful benchmark should start better questions about savings rate, retirement age, and spending needs rather than act like a universal rule.",
    href: "/methodology",
    label: "See how 401kcalc frames assumptions",
  },
  {
    question: "What should I do if I am behind for my age?",
    answer:
      "Usually the highest-leverage moves are contribution increases, full employer-match capture, and realistic retirement timing. The best next step is to compare your current path against one or two better savings scenarios instead of reacting to the benchmark alone.",
    href: contributionGuide?.slug ? `/guides/${contributionGuide.slug}` : "/guides/how-much-should-i-contribute-to-my-401k",
    label: "Read the contribution guide",
  },
  {
    question: "Should I use this benchmark planner or the full 401k calculator?",
    answer:
      "Use this page when your question is whether your balance looks directionally on track for your age. Use the full calculator when you want to test retirement age, annual spending, Roth vs Traditional balances, or step-up contributions over time.",
    href: "/401k-calculator",
    label: "Open the full calculator",
  },
];

export function getAgeBenchmarkFaqs(age: number, benchmark?: RetirementBenchmark) {
  return [
    {
      question: `What does the age-${age} benchmark mean?`,
      answer: benchmark
        ? `${benchmark.recommendedMultiple} by age ${age} is a common planning checkpoint, not a guaranteed retirement target. It is most useful as a quick way to compare your current balance with a widely used milestone and decide whether your savings rate may need adjusting.`
        : `This page helps you compare your age-${age} situation with nearby benchmark checkpoints. It is a directional planning tool, especially useful for seeing whether your current balance and savings pace seem close to common milestone ranges.`,
      href: "/retirement-by-age",
      label: "View the full benchmark planner",
    },
    {
      question: `What if I am below the benchmark at age ${age}?`,
      answer:
        "Being below a benchmark does not mean your plan has failed. It usually means your next move should be practical: capture full employer match, increase contributions gradually, and run a full projection to see how much a few realistic changes improve the long-term result.",
      href: "/401k-calculator",
      label: "Run the full calculator",
    },
    {
      question: `Should I use this age-${age} page or a full retirement calculator?`,
      answer:
        "Use this page for a quick checkpoint. Use the full calculator when you want a decision tool that includes retirement age, annual spending, employer match, and year-by-year projection details.",
      href: "/401k-calculator",
      label: "Open the full calculator",
    },
  ];
}

export function RetirementByAgeSupportingContent() {
  return (
    <ContentStack>
      <SectionHeader>
        <SectionTitle>How to use retirement-by-age benchmarks</SectionTitle>
        <SectionSubtitle>
          This planner helps you translate a broad savings checkpoint into an action plan. Use it to see whether your
          balance looks directionally on track, then use the next-step links below to test real changes.
        </SectionSubtitle>
      </SectionHeader>

      <HighlightGrid>
        {plannerHighlights.map((highlight) => (
          <HighlightCard key={highlight.title}>
            <CardTitle>{highlight.title}</CardTitle>
            <CardBody>{highlight.body}</CardBody>
          </HighlightCard>
        ))}
      </HighlightGrid>

      <ContentBlock>
        <SectionTitle as="h2">Bridge from benchmark to action</SectionTitle>
        <SectionSubtitle>
          People searching retirement-by-age usually want one of these next answers right after checking the
          benchmark.
        </SectionSubtitle>

        <BridgeGrid>
          {plannerBridgeCards.map((card) => (
            <BridgeCard key={card.href}>
              <CardEyebrow>{card.eyebrow}</CardEyebrow>
              <CardTitle>{card.title}</CardTitle>
              <CardBody>{card.body}</CardBody>
              <InlineLink href={card.href}>{card.label} →</InlineLink>
            </BridgeCard>
          ))}
        </BridgeGrid>
      </ContentBlock>

      <ContentBlock>
        <SectionTitle as="h2">Retirement-by-age FAQ</SectionTitle>
        <SectionSubtitle>
          Focused answers for the most common questions people have while using this benchmark planner.
        </SectionSubtitle>
        <FaqList>
          {retirementByAgeFaqs.map((faq) => (
            <FaqItem key={faq.question}>
              <FaqSummary>{faq.question}</FaqSummary>
              <FaqAnswer>
                <p>{faq.answer}</p>
                <InlineLink href={faq.href}>{faq.label} →</InlineLink>
              </FaqAnswer>
            </FaqItem>
          ))}
        </FaqList>
      </ContentBlock>
    </ContentStack>
  );
}

type AgeSupportingContentProps = {
  age: number;
  benchmark?: RetirementBenchmark;
};

export function AgeBenchmarkSupportingContent({ age, benchmark }: AgeSupportingContentProps) {
  const ageFaqs = getAgeBenchmarkFaqs(age, benchmark);
  const ageGuideHref =
    benchmark?.relatedGuides[0]?.href ??
    (contributionGuide?.slug ? `/guides/${contributionGuide.slug}` : "/guides/how-much-should-i-contribute-to-my-401k");
  const ageGuideLabel = benchmark?.relatedGuides[0]?.label ?? "How Much Should I Contribute to My 401k?";

  return (
    <ContentStack>
      <SectionHeader>
        <SectionTitle as="h2">How to interpret the age {age} checkpoint</SectionTitle>
        <SectionSubtitle>
          Use this page as a directional benchmark, then move into the full calculator if you want to test the tradeoff
          between savings rate, retirement age, and spending goals.
        </SectionSubtitle>
      </SectionHeader>

      <CompactGrid>
        <HighlightCard>
          <CardTitle>{benchmark ? `Typical checkpoint at age ${age}` : `How age ${age} fits the benchmark path`}</CardTitle>
          <CardBody>
            {benchmark?.benchmarkSummary ??
              `Not every age has a dedicated benchmark multiple. This page is still useful for comparing your current path with the nearest common checkpoints and deciding whether deeper scenario testing is worth doing.`}
          </CardBody>
        </HighlightCard>

        <HighlightCard>
          <CardTitle>{benchmark ? "What to do if you are below this benchmark" : "What to do next"}</CardTitle>
          <GuidanceList>
            {(benchmark?.benchmarkGuidance.slice(0, 2) ?? [
              "Use the benchmark as a directional check, not a verdict on whether you can retire successfully.",
              "If you want a more personalized answer, run the full 401k calculator with your current balance, contribution rate, and target retirement age.",
            ]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </GuidanceList>
        </HighlightCard>
      </CompactGrid>

      <CompactGrid>
        <BridgeCard>
          <CardEyebrow>Full projection</CardEyebrow>
          <CardTitle>Run the complete 401k calculator</CardTitle>
          <CardBody>
            Benchmarks answer whether you look roughly on pace. The calculator answers whether your plan may support
            your retirement lifestyle and spending target.
          </CardBody>
          <InlineLink href="/401k-calculator">Open the full calculator →</InlineLink>
        </BridgeCard>

        <BridgeCard>
          <CardEyebrow>Next step guide</CardEyebrow>
          <CardTitle>{ageGuideLabel}</CardTitle>
          <CardBody>
            Use a focused guide if you want help deciding what to change after seeing this age checkpoint.
          </CardBody>
          <InlineLink href={ageGuideHref}>Read the related guide →</InlineLink>
        </BridgeCard>
      </CompactGrid>

      <FaqList>
        {ageFaqs.map((faq) => (
          <FaqItem key={faq.question}>
            <FaqSummary>{faq.question}</FaqSummary>
            <FaqAnswer>
              <p>{faq.answer}</p>
              <InlineLink href={faq.href}>{faq.label} →</InlineLink>
            </FaqAnswer>
          </FaqItem>
        ))}
      </FaqList>
    </ContentStack>
  );
}

const ContentStack = styled.div`
  display: grid;
  gap: 24px;
`;

const SectionHeader = styled.div`
  display: grid;
  gap: 8px;
  max-width: 760px;
`;

const ContentBlock = styled.div`
  display: grid;
  gap: 14px;
`;

const HighlightGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const CompactGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const HighlightCard = styled(SurfaceCard)`
  padding: 22px;
  display: grid;
  gap: 10px;
`;

const BridgeGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const BridgeCard = styled(SurfaceCard)`
  padding: 22px;
  display: grid;
  gap: 10px;
`;

const CardEyebrow = styled.p`
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedText};
`;

const CardTitle = styled.h3`
  font-size: 1.04rem;
  font-weight: 650;
  line-height: 1.35;
`;

const CardBody = styled.p`
  font-size: 0.94rem;
  line-height: 1.6;
  color: ${theme.colors.mutedTextStrong};
`;

const GuidanceList = styled.ul`
  padding-left: 1.1rem;
  display: grid;
  gap: 8px;
  font-size: 0.94rem;
  line-height: 1.6;
  color: ${theme.colors.mutedTextStrong};
`;

const FaqList = styled.div`
  display: grid;
  gap: 12px;
`;

const FaqItem = styled.details`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  background: ${theme.colors.surface};
  overflow: hidden;
`;

const FaqSummary = styled.summary`
  cursor: pointer;
  list-style: none;
  padding: 18px 22px;
  font-size: 1rem;
  font-weight: 650;
  line-height: 1.45;

  &::-webkit-details-marker {
    display: none;
  }
`;

const FaqAnswer = styled.div`
  padding: 0 22px 20px;
  display: grid;
  gap: 10px;
  font-size: 0.94rem;
  line-height: 1.65;
  color: ${theme.colors.mutedTextStrong};
`;

const InlineLink = styled(Link)`
  width: fit-content;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;
