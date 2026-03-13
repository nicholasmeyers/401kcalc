"use client";

import dynamic from "next/dynamic";
import styled from "styled-components";

import { AnimatedNumber } from "@/components/calculator/animated-number";
import { CalculatorSummaryCard } from "@/components/calculator/calculator-summary-card";
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
  if (state === "positive") return "On track";
  if (state === "caution") return "Tight margin";
  return "Needs changes";
};

const getOutcomeState = (
  projectedAnnualSpendAvailable: number,
  goalAnnualSpend: number
): OutcomeState => {
  if (goalAnnualSpend <= 0) return "positive";
  if (projectedAnnualSpendAvailable >= goalAnnualSpend * 1.05) return "positive";
  if (projectedAnnualSpendAvailable >= goalAnnualSpend) return "caution";
  return "negative";
};

const getHeroSupportingCopy = (
  state: OutcomeState,
  projectedAnnualSpendAvailable: number,
  goalAnnualSpend: number
): string => {
  if (goalAnnualSpend <= 0) {
    return "Set a retirement spending goal to see whether your plan is on track.";
  }

  const goalFormatted = formatCurrency(goalAnnualSpend);

  if (state === "positive") {
    const cushion = Math.round(
      ((projectedAnnualSpendAvailable - goalAnnualSpend) / goalAnnualSpend) * 100
    );
    return `You will meet your goal of ${goalFormatted} a year with a ${cushion}% cushion.`;
  }

  if (state === "caution") {
    return `You are close to your goal of ${goalFormatted} a year, but your plan has limited cushion.`;
  }

  const shortfall = Math.round(
    ((goalAnnualSpend - projectedAnnualSpendAvailable) / goalAnnualSpend) * 100
  );
  return `Your plan falls ${shortfall}% short of your goal of ${goalFormatted} a year.`;
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

  const outlookState = getOutcomeState(
    result.projectedAnnualSpendAvailable,
    result.targetRetirementSpending
  );

  const heroSupportingCopy = getHeroSupportingCopy(
    outlookState,
    result.projectedAnnualSpendAvailable,
    result.targetRetirementSpending
  );

  const endingBalanceSupportingCopy =
    `${result.retirementYearsFunded} of ${result.totalRetirementYears} retirement years are fully funded.`;

  const additionalDetailCards = [
    { label: "Employee contributions", value: result.totalEmployeeContributions },
    { label: "Employer match contributions", value: result.totalEmployerContributions },
    { label: "Total contributions", value: totalContributions },
    { label: "Total investment growth", value: result.totalInvestmentGrowth },
  ];

  if (result.totalWindfallContributions > 0) {
    additionalDetailCards.splice(2, 0, { label: "Windfall contributions", value: result.totalWindfallContributions });
  }

  return (
    <ResultsStack>
      {statusMessage ? <StatusBanner>{statusMessage}</StatusBanner> : null}

      <HighlightsGrid>
        <HeroCard $state={outlookState}>
          <HeroLabelRow>
            <HeroLabel>Projected annual spend available</HeroLabel>
            <OutcomePill $state={outlookState}>{getOutcomeStateLabel(outlookState)}</OutcomePill>
          </HeroLabelRow>
          <HeroValue>
            <AnimatedNumber value={result.projectedAnnualSpendAvailable} formatValue={formatCurrency} />
          </HeroValue>
          <HeroCopy>{heroSupportingCopy}</HeroCopy>
        </HeroCard>

        <CalculatorSummaryCard
          label={`Projected balance at retirement age ${result.retirementAge}`}
          value={toAnimatedCurrencyValue(result.projectedBalanceAtRetirement)}
          supportingCopy="Estimated portfolio value when you retire."
        />

        <CalculatorSummaryCard
          label={`Projected balance at age ${result.lifeExpectancy}`}
          value={toAnimatedCurrencyValue(result.projectedBalanceAtLifeExpectancy)}
          supportingCopy={endingBalanceSupportingCopy}
        />
      </HighlightsGrid>

      <SectionLabel>Breakdown</SectionLabel>
      <BreakdownGrid>
        {additionalDetailCards.map((card) => (
          <CalculatorSummaryCard key={card.label} label={card.label} value={formatCurrency(card.value)} />
        ))}
      </BreakdownGrid>

      <ChartCard>
        <ChartHeader>
          <ChartTitle>Projection chart</ChartTitle>
          <ChartSubtitle>
            Shows projected balance and projected balance in today&apos;s dollars year by year through retirement.
          </ChartSubtitle>
        </ChartHeader>
        <ProjectionChart
          data={result.yearlyProjection}
          retirementAge={result.retirementAge}
          onRetirementAgeChange={onRetirementAgeChange}
        />
      </ChartCard>

      <Methodology>
        These estimates assume yearly contributions and investment returns based on your inputs. Employee
        contributions follow IRS limits (including catch-up limits), and employer match is estimated as a flat
        percentage of salary up to a compensation cap of {formatCurrency(result.compensationLimit)}.
        {" "}
        Spending is simulated year by year from retirement age through age {result.lifeExpectancy}
        {result.ageBasedSpendingEnabled
          ? ` using age-based spending phases (${result.spendingPhasePercents.earlyRetirement}% through age 74, ${result.spendingPhasePercents.midRetirement}% ages 75-84, ${result.spendingPhasePercents.lateRetirement}% age 85+).`
          : " using a fixed annual spending amount."}
        {result.retirementSpendingInflationAdjusted
          ? " The annual spending goal is treated in today's dollars and increases with inflation each retirement year."
          : " Spending stays flat year to year."}
        {" "}Taxes are not included.
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

const HighlightsGrid = styled.div`
  display: grid;
  gap: 14px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const HeroCard = styled.article<{ $state: OutcomeState }>`
  border: 1px solid ${(props) => outcomePalettes[props.$state].border};
  border-radius: ${theme.radii.lg};
  background: ${(props) => outcomePalettes[props.$state].surface};
  padding: 22px;
  display: grid;
  gap: 10px;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-column: span 2;
  }

  &:hover,
  &:focus-within {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  }
`;

const HeroLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const HeroLabel = styled.p`
  font-size: 0.78rem;
  font-weight: 640;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const HeroValue = styled.p`
  color: ${theme.colors.text};
  font-size: clamp(1.95rem, 4vw, 2.7rem);
  line-height: 1.12;
  font-weight: 660;
  letter-spacing: -0.02em;
`;

const HeroCopy = styled.p`
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.45;
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

const SectionLabel = styled.h3`
  font-size: 0.78rem;
  font-weight: 640;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
  padding-left: 2px;
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
