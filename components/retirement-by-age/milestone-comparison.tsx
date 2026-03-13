"use client";

import styled from "styled-components";

import { formatCurrency } from "@/lib/calculator/format";
import type { CheckpointComparison } from "@/lib/retirement-benchmarks/planner";
import { theme } from "@/styles/theme";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type MilestoneComparisonProps = {
  checkpoints: CheckpointComparison[];
  showAdjusted: boolean;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MilestoneComparison({ checkpoints, showAdjusted }: MilestoneComparisonProps) {
  if (checkpoints.length === 0) return null;

  const maxValue = Math.max(
    ...checkpoints.flatMap((c) => [
      c.benchmarkTarget,
      c.currentPathBalance,
      showAdjusted ? c.adjustedPathBalance : 0,
    ])
  );

  return (
    <Wrapper>
      {checkpoints.map((cp) => (
        <CheckpointBlock key={cp.age}>
          <CheckpointHeader>
            <CheckpointAge>Age {cp.age}</CheckpointAge>
            <CheckpointLabel>{cp.benchmarkLabel}</CheckpointLabel>
          </CheckpointHeader>

          <BarGroup>
            <BarRow>
              <BarLabel>Benchmark</BarLabel>
              <BarTrack>
                <Bar
                  style={{ width: pct(cp.benchmarkTarget, maxValue) }}
                  $variant="benchmark"
                />
              </BarTrack>
              <BarValue>{formatCurrency(Math.round(cp.benchmarkTarget))}</BarValue>
            </BarRow>

            <BarRow>
              <BarLabel>Current path</BarLabel>
              <BarTrack>
                <Bar
                  style={{ width: pct(cp.currentPathBalance, maxValue) }}
                  $variant="current"
                />
              </BarTrack>
              <BarValue>{formatCurrency(Math.round(cp.currentPathBalance))}</BarValue>
            </BarRow>

            {showAdjusted && (
              <BarRow>
                <BarLabel>Improved path</BarLabel>
                <BarTrack>
                  <Bar
                    style={{ width: pct(cp.adjustedPathBalance, maxValue) }}
                    $variant="improved"
                  />
                </BarTrack>
                <BarValue>{formatCurrency(Math.round(cp.adjustedPathBalance))}</BarValue>
              </BarRow>
            )}
          </BarGroup>

          <GapMessages>
            <GapLine $positive={cp.currentGapOrSurplus >= 0}>
              {formatGap(cp.currentGapOrSurplus)} on current path
            </GapLine>
            {showAdjusted && (
              <GapLine $positive={cp.adjustedGapOrSurplus >= 0}>
                {formatGap(cp.adjustedGapOrSurplus)} with improved contributions
              </GapLine>
            )}
          </GapMessages>
        </CheckpointBlock>
      ))}
    </Wrapper>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pct(value: number, max: number): string {
  if (max <= 0) return "0%";
  return `${Math.min((value / max) * 100, 100)}%`;
}

function formatGap(gap: number): string {
  const abs = formatCurrency(Math.abs(Math.round(gap)));
  if (gap >= 0) return `${abs} ahead of the benchmark`;
  return `${abs} below the benchmark`;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
`;

const CheckpointBlock = styled.div`
  display: grid;
  gap: 10px;
  padding: 18px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surface};
`;

const CheckpointHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
`;

const CheckpointAge = styled.span`
  font-size: 0.96rem;
  font-weight: 640;
`;

const CheckpointLabel = styled.span`
  font-size: 0.82rem;
  color: ${theme.colors.mutedText};
`;

const BarGroup = styled.div`
  display: grid;
  gap: 8px;
`;

const BarRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  gap: 10px;
`;

const BarLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${theme.colors.mutedTextStrong};
  text-align: right;
`;

const BarTrack = styled.div`
  height: 16px;
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
`;

const Bar = styled.div<{ $variant: "benchmark" | "current" | "improved" }>`
  height: 100%;
  border-radius: ${theme.radii.pill};
  transition: width 400ms ease;
  background: ${({ $variant }) =>
    $variant === "benchmark"
      ? theme.colors.chartBenchmark
      : $variant === "current"
        ? theme.colors.chartMain
        : theme.colors.chartImproved};
`;

const BarValue = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${theme.colors.text};
  min-width: 72px;
  text-align: right;
`;

const GapMessages = styled.div`
  display: grid;
  gap: 4px;
`;

const GapLine = styled.p<{ $positive: boolean }>`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? theme.colors.successText : theme.colors.dangerText)};
`;
