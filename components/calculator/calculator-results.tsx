"use client";

import dynamic from "next/dynamic";
import styled from "styled-components";

import { AnimatedNumber } from "@/components/calculator/animated-number";
import { CalculatorSummaryCard } from "@/components/calculator/calculator-summary-card";
import { ContextualInfoTooltip } from "@/components/ui/info-tooltip";
import { SurfaceCard } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/calculator/format";
import type { RetirementProjectionResult } from "@/lib/calculator/types";
import { theme } from "@/styles/theme";

type CalculatorResultsProps = {
  result: RetirementProjectionResult;
  statusMessage?: string;
  onRetirementAgeChange?: (nextRetirementAge: number) => void;
};

type OutcomeState = "positive" | "caution" | "negative";
type OutcomePalette = { surface: string; border: string; text: string };
type SummaryHighlightCard = {
  label: string;
  value: number;
  tone?: "default" | "hero";
  tooltip?: string;
  supportingCopy?: string;
};
type SummaryBreakdownCard = {
  label: string;
  value: number;
};

const formatAge = (value: number) => String(Math.max(0, Math.round(value)));
const outcomePalettes: Record<OutcomeState, OutcomePalette> = {
  positive: {
    surface: theme.colors.successSurface,
    border: theme.colors.successBorder,
    text: theme.colors.successText,
  },
  caution: {
    surface: theme.colors.warningSurface,
    border: theme.colors.warningBorder,
    text: theme.colors.warningText,
  },
  negative: {
    surface: theme.colors.dangerSurface,
    border: theme.colors.dangerBorder,
    text: theme.colors.dangerText,
  },
};

const getOutcomeStateLabel = (state: OutcomeState): string => {
  if (state === "positive") {
    return "On track";
  }

  if (state === "caution") {
    return "Narrow buffer";
  }

  return "Runs out early";
};

const getOutcomeState = (isSuccessful: boolean, bufferYears: number): OutcomeState => {
  if (!isSuccessful) {
    return "negative";
  }

  if (bufferYears < 2) {
    return "caution";
  }

  return "positive";
};

const toAnimatedCurrencyValue = (value: number) => <AnimatedNumber value={value} formatValue={formatCurrency} />;

const ProjectionChart = dynamic(
  () => import("@/components/calculator/projection-chart").then((module) => module.ProjectionChart),
  {
    ssr: false,
    loading: () => <ChartLoading>Loading interactive projection chart…</ChartLoading>,
  }
);

export function CalculatorResults({ result, statusMessage, onRetirementAgeChange }: CalculatorResultsProps) {
  const totalContributions =
    result.totalEmployeeContributions + result.totalEmployerContributions + result.totalWindfallContributions;
  const targetSpendingFinalBalance = result.targetSpendingProjection.at(-1)?.endingBalance ?? 0;
  const sustainableBufferYears =
    result.estimatedAnnualRetirementIncome > 0
      ? result.finalBalance / result.estimatedAnnualRetirementIncome
      : Number.POSITIVE_INFINITY;
  const targetBufferYears =
    result.targetRetirementSpending > 0
      ? targetSpendingFinalBalance / result.targetRetirementSpending
      : Number.POSITIVE_INFINITY;

  const sustainableOutcomeState = getOutcomeState(result.retirementSuccessful, sustainableBufferYears);
  const targetOutcomeState = getOutcomeState(result.targetSpendingRetirementSuccessful, targetBufferYears);
  const highlightCards: SummaryHighlightCard[] = [
    {
      label: `Projected balance at age ${result.lifeExpectancy}`,
      value: result.finalBalance,
      tone: "hero",
      supportingCopy: "Main projection in future dollars.",
    },
    {
      label: `Balance in today's dollars at age ${result.lifeExpectancy}`,
      value: result.inflationAdjustedBalance,
      tooltip: "The value of your savings expressed in today's dollars after accounting for inflation.",
    },
    {
      label: "Estimated first-year retirement income from savings",
      value: result.estimatedAnnualRetirementIncome,
      tooltip: "Estimated withdrawal amount from savings in your first retirement year under the withdrawal-rate scenario.",
    },
  ];
  const breakdownCards: SummaryBreakdownCard[] = [
    { label: "Total contributions made", value: totalContributions },
    { label: "Employer match contributions", value: result.totalEmployerContributions },
    { label: "Total investment growth", value: result.totalInvestmentGrowth },
  ];

  if (result.totalWindfallContributions > 0) {
    breakdownCards.splice(2, 0, { label: "Windfall contributions", value: result.totalWindfallContributions });
  }

  return (
    <ResultsStack>
      {statusMessage ? <StatusBanner>{statusMessage}</StatusBanner> : null}

      <OutcomeCard $state={sustainableOutcomeState}>
        <OutcomeTitleRow>
          <OutcomeTitle>Retirement outlook</OutcomeTitle>
          <OutcomePill $state={sustainableOutcomeState}>{getOutcomeStateLabel(sustainableOutcomeState)}</OutcomePill>
        </OutcomeTitleRow>
        <OutcomeText>
          Your savings are projected to {result.retirementSuccessful ? "last through age " : "run out around age "}
          <AnimatedNumber value={result.portfolioLastsUntilAge} formatValue={formatAge} />.
        </OutcomeText>
        <OutcomeSubtext>
          This view uses your withdrawal-rate plan with annual withdrawals estimated at
          {" "}
          <AnimatedNumber value={result.estimatedAnnualRetirementIncome} formatValue={formatCurrency} />
          {" "}
          in the first retirement year.
        </OutcomeSubtext>
      </OutcomeCard>

      <OutcomeCard $state={targetOutcomeState}>
        <OutcomeTitleRow>
          <OutcomeTitle>Target spending outcome</OutcomeTitle>
          <OutcomePill $state={targetOutcomeState}>{getOutcomeStateLabel(targetOutcomeState)}</OutcomePill>
          <ContextualInfoTooltip
            label="Target spending outcome"
            content="Shows how long savings last when you withdraw your target annual spending each retirement year."
          />
        </OutcomeTitleRow>
        <OutcomeText>
          At
          {" "}
          <AnimatedNumber value={result.targetRetirementSpending} formatValue={formatCurrency} />
          {" "}
          per year, savings are projected to
          {" "}
          {result.targetSpendingRetirementSuccessful ? "last through age " : "run out around age "}
          <AnimatedNumber value={result.targetSpendingPortfolioLastsUntilAge} formatValue={formatAge} />.
        </OutcomeText>
        <OutcomeSubtext>
          This scenario tests a fixed annual spending amount instead of a percentage-based withdrawal.
        </OutcomeSubtext>
      </OutcomeCard>

      <PeakSummaryCard>
        <PeakTitle>Peak portfolio summary</PeakTitle>
        <PeakValue>
          <AnimatedNumber value={result.peakBalance} formatValue={formatCurrency} />
        </PeakValue>
        <PeakCopy>
          Main projection peaks near age {result.peakBalanceAge}. Under target spending, the peak is
          {" "}
          {formatCurrency(result.targetSpendingPeakBalance)} at age {result.targetSpendingPeakBalanceAge}.
        </PeakCopy>
      </PeakSummaryCard>

      <SectionLabel>Key summary</SectionLabel>
      <HighlightsGrid>
        {highlightCards.map((card) => (
          <CalculatorSummaryCard
            key={card.label}
            tone={card.tone}
            label={card.label}
            value={toAnimatedCurrencyValue(card.value)}
            tooltip={card.tooltip}
            supportingCopy={card.supportingCopy}
          />
        ))}
      </HighlightsGrid>

      <BreakdownGrid>
        {breakdownCards.map((card) => (
          <CalculatorSummaryCard key={card.label} label={card.label} value={formatCurrency(card.value)} />
        ))}
      </BreakdownGrid>

      <ChartCard>
        <ChartHeader>
          <ChartTitle>Projection chart</ChartTitle>
          <ChartSubtitle>
            Compare your main projection, inflation-adjusted purchasing power, and target-spending scenario over time.
          </ChartSubtitle>
        </ChartHeader>
        <ProjectionChart
          data={result.yearlyProjection}
          targetSpendingData={result.targetSpendingProjection}
          retirementAge={result.retirementAge}
          onRetirementAgeChange={onRetirementAgeChange}
        />
      </ChartCard>

      <Methodology>
        Deterministic annual projection with midpoint contribution timing. Employer match is modeled as a flat percent
        of salary, employee contributions follow configured IRS limits, and windfalls are applied at the chosen age.
        Retirement withdrawals start at retirement age under either a withdrawal-rate plan or a fixed target-spending
        plan. Taxes are not modeled.
      </Methodology>
    </ResultsStack>
  );
}

const ResultsStack = styled.div`
  display: grid;
  gap: 18px;
`;

const StatusBanner = styled.p`
  border: 1px solid ${theme.colors.infoBorder};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.infoSurface};
  color: ${theme.colors.infoText};
  font-size: 0.86rem;
  padding: 10px 14px;
`;

const OutcomeCard = styled(SurfaceCard)<{ $state: OutcomeState }>`
  padding: 18px;
  display: grid;
  gap: 10px;
  border-color: ${(props) => outcomePalettes[props.$state].border};
  background: ${(props) => outcomePalettes[props.$state].surface};
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;

  &:hover,
  &:focus-within {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  }
`;

const OutcomeTitle = styled.p`
  font-size: 0.78rem;
  font-weight: 640;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const OutcomeTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
`;

const OutcomeText = styled.p`
  font-size: 1rem;
  font-weight: 620;
  color: ${theme.colors.text};
`;

const OutcomeSubtext = styled.p`
  font-size: 0.88rem;
  color: ${theme.colors.mutedTextStrong};
`;

const OutcomePill = styled.span<{ $state: OutcomeState }>`
  padding: 3px 8px;
  border-radius: ${theme.radii.pill};
  font-size: 0.68rem;
  font-weight: 640;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border: 1px solid ${(props) => outcomePalettes[props.$state].border};
  color: ${(props) => outcomePalettes[props.$state].text};
  background: rgba(255, 255, 255, 0.72);
`;

const PeakSummaryCard = styled(SurfaceCard)`
  padding: 18px;
  display: grid;
  gap: 8px;
  border-color: ${theme.colors.elevatedBorder};
  background: ${theme.colors.elevatedGradient};
`;

const PeakTitle = styled.p`
  font-size: 0.78rem;
  font-weight: 640;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const PeakValue = styled.p`
  font-size: clamp(1.75rem, 3.4vw, 2.4rem);
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: ${theme.colors.text};
  font-weight: 650;
`;

const PeakCopy = styled.p`
  font-size: 0.86rem;
  line-height: 1.5;
  color: ${theme.colors.mutedTextStrong};
`;

const SectionLabel = styled.h3`
  font-size: 0.78rem;
  font-weight: 640;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
  padding-left: 2px;
`;

const HighlightsGrid = styled.div`
  display: grid;
  gap: 14px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const BreakdownGrid = styled.div`
  display: grid;
  gap: 14px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ChartCard = styled(SurfaceCard)`
  padding: 20px;
  display: grid;
  gap: 16px;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 16px;
  }

  &:hover,
  &:focus-within {
    border-color: ${theme.colors.elevatedBorderHover};
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.055);
    transform: translateY(-1px);
  }
`;

const ChartHeader = styled.header`
  display: grid;
  gap: 5px;
`;

const ChartTitle = styled.h3`
  font-size: 1rem;
  font-weight: 630;
`;

const ChartSubtitle = styled.p`
  font-size: 0.88rem;
  color: ${theme.colors.mutedText};
`;

const Methodology = styled.p`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surfaceMuted};
  padding: 14px 16px;
  font-size: 0.86rem;
  line-height: 1.6;
  color: ${theme.colors.mutedTextStrong};
`;

const ChartLoading = styled.p`
  min-height: 286px;
  border: 1px dashed ${theme.colors.border};
  border-radius: ${theme.radii.md};
  display: grid;
  place-items: center;
  text-align: center;
  color: ${theme.colors.mutedText};
  font-size: 0.86rem;
`;
