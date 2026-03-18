"use client";

import styled, { css } from "styled-components";

import { AnimatedNumber } from "@/components/calculator/animated-number";
import { ContributionImpactChart } from "@/components/contribution-impact/contribution-impact-chart";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/calculator/format";
import type {
  ContributionImpactResult,
  ContributionImpactScenarioKey,
  ContributionImpactScenarioResult,
} from "@/lib/contribution-impact/types";
import { theme } from "@/styles/theme";

type ContributionImpactResultsProps = {
  result: ContributionImpactResult;
};

const scenarioOrder: ContributionImpactScenarioKey[] = ["one-year", "five-years", "until-retirement"];

const getScenario = (
  scenarios: ContributionImpactScenarioResult[],
  key: ContributionImpactScenarioKey
): ContributionImpactScenarioResult => {
  const scenario = scenarios.find((entry) => entry.key === key);

  if (!scenario) {
    throw new Error(`Missing contribution impact scenario: ${key}`);
  }

  return scenario;
};

const toAnimatedCurrencyValue = (value: number) => <AnimatedNumber value={value} formatValue={formatCurrency} />;

export function ContributionImpactResults({ result }: ContributionImpactResultsProps) {
  const primaryScenario = getScenario(result.scenarios, "until-retirement");
  const scenarioCards = scenarioOrder.map((key) => getScenario(result.scenarios, key));
  const benchmarkAge = Math.max(18, Math.min(70, result.currentAge));

  return (
    <ResultsStack>
      <PrimaryImpactCard>
        <PrimaryLabel>Added balance by age {result.retirementAge}</PrimaryLabel>
        <PrimaryValue>{toAnimatedCurrencyValue(primaryScenario.additionalBalanceAtRetirement)}</PrimaryValue>
        {primaryScenario.additionalMonthlyRetirementIncome > 0 ? (
          <IncomeBridge>
            That could mean roughly {formatCurrency(primaryScenario.additionalMonthlyRetirementIncome)}/mo in retirement income — from this one change.
          </IncomeBridge>
        ) : null}
        <PrimaryCopy>
          {result.additionalAnnualContribution > 0
            ? "From the increase alone — your existing 401(k) balance is not included."
            : "This increase does not add new contribution room at the current salary and IRS cap."}
        </PrimaryCopy>

        <PrimaryMetaGrid>
          <PrimaryMetaCard>
            <PrimaryMetaLabel>Extra contribution</PrimaryMetaLabel>
            <PrimaryMetaValue>{formatCurrency(result.additionalAnnualContribution)}/year</PrimaryMetaValue>
          </PrimaryMetaCard>
          <PrimaryMetaCard>
            <PrimaryMetaLabel>Total contribution</PrimaryMetaLabel>
            <PrimaryMetaValue>{formatCurrency(result.totalAnnualContribution)}/year</PrimaryMetaValue>
          </PrimaryMetaCard>
          <PrimaryMetaCard>
            <PrimaryMetaLabel>Increase split</PrimaryMetaLabel>
            <PrimaryMetaValue>
              {formatCurrency(result.traditionalAdditionalContribution)} Traditional <br />
              {formatCurrency(result.rothAdditionalContribution)} Roth
            </PrimaryMetaValue>
          </PrimaryMetaCard>
        </PrimaryMetaGrid>
      </PrimaryImpactCard>

      <MetricGrid>
        <MetricCard>
          <MetricLabel>Extra monthly retirement income</MetricLabel>
          <MetricValue>{toAnimatedCurrencyValue(primaryScenario.additionalMonthlyRetirementIncome)}</MetricValue>
          <MetricCopy>Based on a {result.retirementIncomeWithdrawalRatePercent}% withdrawal rate.</MetricCopy>
        </MetricCard>

        <MetricCard>
          <MetricLabel>Extra yearly retirement income</MetricLabel>
          <MetricValue>{toAnimatedCurrencyValue(primaryScenario.additionalAnnualRetirementIncome)}</MetricValue>
          <MetricCopy>The monthly estimate annualized.</MetricCopy>
        </MetricCard>

        <MetricCard>
          <MetricLabel>Monthly pay reduction</MetricLabel>
          <MetricValue>-{toAnimatedCurrencyValue(result.estimatedMonthlyPayReduction)}/mo</MetricValue>
          <MetricCopy>
            Estimated reduction in your take-home pay.</MetricCopy>
        </MetricCard>
      </MetricGrid>

      <SectionLabel>What this increase adds over time</SectionLabel>
      <ScenarioGrid>
        {scenarioCards.map((scenario) => (
          <ScenarioCard key={scenario.key} $featured={scenario.key === "until-retirement"}>
            <ScenarioTitle>{scenario.label}</ScenarioTitle>
            <ScenarioPrimaryLabel>Added balance at retirement</ScenarioPrimaryLabel>
            <ScenarioValue>{formatCurrency(scenario.additionalBalanceAtRetirement)}</ScenarioValue>
            <ScenarioStats>
              <ScenarioStat>
                <ScenarioStatLabel>Extra yearly retirement income</ScenarioStatLabel>
                <ScenarioStatValue>{formatCurrency(scenario.additionalAnnualRetirementIncome)}</ScenarioStatValue>
              </ScenarioStat>
              <ScenarioStat>
                <ScenarioStatLabel>Total extra contributions</ScenarioStatLabel>
                <ScenarioStatValue>{formatCurrency(scenario.totalAdditionalContributions)}</ScenarioStatValue>
              </ScenarioStat>
            </ScenarioStats>
          </ScenarioCard>
        ))}
      </ScenarioGrid>

      <ChartCard>
        <ChartHeader>
          <ChartTitle>How your increase compounds</ChartTitle>
          <ChartSubtitle>
            Only the extra dollars from your increase — not your full 401(k).
          </ChartSubtitle>
        </ChartHeader>
        <ContributionImpactChart data={result.chartRows} />
      </ChartCard>

      <ActionCard>
        <ActionText>
          Ready to see the full picture? Layer this increase onto your current balance, Roth strategy, and full retirement plan.
        </ActionText>
        <ActionRow>
          <ButtonLink href="/401k-calculator">Open Full 401(k) Calculator</ButtonLink>
          <ButtonLink href={`/retirement-by-age/${benchmarkAge}`} variant="secondary">
            Check Your Age Benchmark
          </ButtonLink>
        </ActionRow>
      </ActionCard>

      <Methodology>
        Models only extra dollars from the increase. Uses flat salary, midpoint contributions, fixed annual return, a {result.retirementIncomeWithdrawalRatePercent}% withdrawal-rate income estimate, the current-age IRS cap for the full projection, and a {result.estimatedTraditionalTaxOffsetRatePercent}% tax offset for traditional dollars.
      </Methodology>
    </ResultsStack>
  );
}

const ResultsStack = styled.div`
  display: grid;
  gap: 18px;
`;

const PrimaryImpactCard = styled(SurfaceCard)`
  padding: 24px;
  display: grid;
  gap: 12px;
  background:
    radial-gradient(circle at top right, rgba(22, 163, 74, 0.12), transparent 40%),
    linear-gradient(180deg, #ffffff 0%, #fbfffc 100%);
  border-color: ${theme.colors.successBorder};
`;

const PrimaryLabel = styled.p`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.successText};
`;

const PrimaryValue = styled.p`
  font-size: clamp(2.35rem, 5vw, 3.4rem);
  line-height: 1.02;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: ${theme.colors.text};
`;

const IncomeBridge = styled.p`
  font-size: 1.05rem;
  font-weight: 620;
  line-height: 1.5;
  color: ${theme.colors.successText};
`;

const PrimaryCopy = styled.p`
  max-width: 58ch;
  font-size: 0.92rem;
  line-height: 1.6;
  color: ${theme.colors.mutedTextStrong};
`;

const PrimaryMetaGrid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const PrimaryMetaCard = styled.div`
  padding: 14px 16px;
  border-radius: ${theme.radii.md};
  border: 1px solid ${theme.colors.successBorder};
  background: rgba(255, 255, 255, 0.78);
  display: grid;
  gap: 6px;
`;

const PrimaryMetaLabel = styled.span`
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const PrimaryMetaValue = styled.span`
  font-size: 0.96rem;
  font-weight: 650;
  line-height: 1.45;
  color: ${theme.colors.text};
`;

const MetricGrid = styled.div`
  display: grid;
  gap: 14px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const MetricCard = styled(SurfaceCard)`
  padding: 18px;
  display: grid;
  gap: 8px;
`;

const MetricLabel = styled.p`
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const MetricValue = styled.p`
  font-size: clamp(1.3rem, 2.8vw, 1.95rem);
  line-height: 1.08;
  font-weight: 680;
  letter-spacing: -0.02em;
  color: ${theme.colors.text};
`;

const MetricCopy = styled.p`
  font-size: 0.82rem;
  line-height: 1.55;
  color: ${theme.colors.mutedTextStrong};
`;

const SectionLabel = styled.h2`
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const ScenarioGrid = styled.div`
  display: grid;
  gap: 14px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const ScenarioCard = styled(SurfaceCard) <{ $featured: boolean }>`
  padding: 18px;
  display: grid;
  gap: 10px;

  ${({ $featured }) =>
    $featured
      ? css`
          border-color: ${theme.colors.successBorder};
          background:
            radial-gradient(circle at top right, rgba(22, 163, 74, 0.08), transparent 48%),
            ${theme.colors.surface};
        `
      : null}
`;

const ScenarioTitle = styled.h3`
  font-size: 0.94rem;
  font-weight: 650;
  line-height: 1.45;
`;

const ScenarioPrimaryLabel = styled.p`
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const ScenarioValue = styled.p`
  font-size: clamp(1.45rem, 2.7vw, 2rem);
  line-height: 1.08;
  font-weight: 690;
  letter-spacing: -0.03em;
`;

const ScenarioStats = styled.div`
  display: grid;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid ${theme.colors.border};
`;

const ScenarioStat = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

const ScenarioStatLabel = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.mutedTextStrong};
`;

const ScenarioStatValue = styled.span`
  text-align: right;
  font-size: 0.84rem;
  font-weight: 650;
  color: ${theme.colors.text};
`;

const ChartCard = styled(SurfaceCard)`
  padding: 20px;
  display: grid;
  gap: 16px;
`;

const ChartHeader = styled.div`
  display: grid;
  gap: 6px;
`;

const ChartTitle = styled.h3`
  font-size: 1.02rem;
  font-weight: 650;
`;

const ChartSubtitle = styled.p`
  font-size: 0.84rem;
  line-height: 1.55;
  color: ${theme.colors.mutedTextStrong};
`;

const ActionCard = styled(SurfaceCard)`
  padding: 20px;
  display: grid;
  gap: 16px;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.06), transparent 58%),
    ${theme.colors.surface};
`;

const ActionText = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${theme.colors.mutedTextStrong};
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Methodology = styled.p`
  font-size: 0.82rem;
  line-height: 1.6;
  color: ${theme.colors.mutedText};
`;
