"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import styled from "styled-components";

import { formatCurrency } from "@/lib/calculator/format";
import type { PlannerYearEntry } from "@/lib/retirement-benchmarks/planner";
import { useHasMounted } from "@/lib/use-has-mounted";
import { theme } from "@/styles/theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PlannerChartProps = {
  currentPath: PlannerYearEntry[];
  adjustedPath: PlannerYearEntry[];
  benchmarkCurve: { age: number; target: number }[];
  showAdjusted: boolean;
  currentAge: number;
};

type ChartRow = {
  age: number;
  currentBalance: number;
  adjustedBalance: number | null;
  benchmarkTarget: number;
};

type TooltipPayloadEntry = {
  dataKey?: string | number;
  value?: number | string | null;
};

type ChartTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: TooltipPayloadEntry[];
};

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

const BENCHMARK_COLOR = theme.colors.chartBenchmark;
const CURRENT_COLOR = theme.colors.chartMain;
const IMPROVED_COLOR = theme.colors.chartImproved;

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

// ---------------------------------------------------------------------------
// Merge data for chart
// ---------------------------------------------------------------------------

function buildChartRows(
  currentPath: PlannerYearEntry[],
  adjustedPath: PlannerYearEntry[],
  benchmarkCurve: { age: number; target: number }[],
  showAdjusted: boolean
): ChartRow[] {
  const benchmarkMap = new Map(benchmarkCurve.map((b) => [b.age, b.target]));
  const adjustedMap = new Map(adjustedPath.map((e) => [e.age, e.balance]));

  return currentPath.map((entry) => ({
    age: entry.age,
    currentBalance: Math.round(entry.balance),
    adjustedBalance: showAdjusted
      ? Math.round(adjustedMap.get(entry.age) ?? entry.balance)
      : null,
    benchmarkTarget: benchmarkMap.get(entry.age) ?? 0,
  }));
}

// ---------------------------------------------------------------------------
// Custom tooltip
// ---------------------------------------------------------------------------

const seriesMeta: Record<string, { label: string; color: string }> = {
  benchmarkTarget: { label: "Benchmark", color: BENCHMARK_COLOR },
  currentBalance: { label: "Current path", color: CURRENT_COLOR },
  adjustedBalance: { label: "Improved path", color: IMPROVED_COLOR },
};

const seriesTooltipOrder = ["benchmarkTarget", "currentBalance", "adjustedBalance"];

function PlannerTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const valuesByKey = new Map<string, number>();
  for (const entry of payload) {
    const key = String(entry.dataKey ?? "");
    if (entry.value == null) continue;
    const num = typeof entry.value === "number" ? entry.value : Number(entry.value);
    if (Number.isFinite(num)) valuesByKey.set(key, num);
  }

  const rows = seriesTooltipOrder
    .filter((key) => valuesByKey.has(key))
    .map((key) => ({ key, meta: seriesMeta[key], value: valuesByKey.get(key)! }));

  if (rows.length === 0) return null;

  return (
    <TooltipCard>
      <TooltipLabel>Age {label}</TooltipLabel>
      {rows.map((row) => (
        <TooltipRow key={row.key}>
          <TooltipSwatch style={{ background: row.meta.color }} />
          <TooltipText>
            {row.meta.label}: {formatCurrency(row.value)}
          </TooltipText>
        </TooltipRow>
      ))}
    </TooltipCard>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PlannerChart({
  currentPath,
  adjustedPath,
  benchmarkCurve,
  showAdjusted,
  currentAge,
}: PlannerChartProps) {
  const hasMounted = useHasMounted();
  const rows = buildChartRows(currentPath, adjustedPath, benchmarkCurve, showAdjusted);

  if (rows.length === 0) {
    return <EmptyState>Enter your details above to see a projection chart.</EmptyState>;
  }

  return (
    <ChartWrapper>
      <LegendRow>
        <LegendItem>
          <LegendSwatchDashed $color={BENCHMARK_COLOR} />
          <LegendLabel>Benchmark</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendSwatch $color={CURRENT_COLOR} />
          <LegendLabel>Current path</LegendLabel>
        </LegendItem>
        {showAdjusted && (
          <LegendItem>
            <LegendSwatch $color={IMPROVED_COLOR} />
            <LegendLabel>Improved path</LegendLabel>
          </LegendItem>
        )}
      </LegendRow>

      <ChartViewport>
        {hasMounted ? (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <LineChart data={rows} margin={{ top: 12, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid
                stroke={theme.colors.chartGrid}
                strokeDasharray="3 6"
                vertical={false}
              />
              <XAxis
                dataKey="age"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: theme.colors.mutedTextStrong, fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={66}
                tick={{ fill: theme.colors.mutedTextStrong, fontSize: 12 }}
                tickFormatter={(value) => compactCurrency.format(value)}
              />
              <Tooltip
                content={<PlannerTooltip />}
                cursor={{ stroke: theme.colors.chartCursor, strokeWidth: 1 }}
              />
              <ReferenceLine
                x={currentAge}
                stroke={theme.colors.chartEvent}
                strokeDasharray="4 4"
                strokeWidth={1.2}
              />

              <Line
                type="linear"
                dataKey="benchmarkTarget"
                name="Benchmark"
                stroke={BENCHMARK_COLOR}
                strokeWidth={2}
                strokeDasharray="8 6"
                dot={false}
                activeDot={{ r: 4, fill: BENCHMARK_COLOR }}
                animationDuration={300}
              />

              <Line
                type="monotone"
                dataKey="currentBalance"
                name="Current path"
                stroke={CURRENT_COLOR}
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 3 }}
                animationDuration={300}
              />

              {showAdjusted && (
                <Line
                  type="monotone"
                  dataKey="adjustedBalance"
                  name="Improved path"
                  stroke={IMPROVED_COLOR}
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 3 }}
                  animationDuration={300}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ChartPlaceholder aria-hidden="true" />
        )}
      </ChartViewport>
    </ChartWrapper>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const ChartWrapper = styled.div`
  display: grid;
  gap: 12px;
`;

const CHART_HEIGHT = 320;

const ChartViewport = styled.div`
  width: 100%;
  min-width: 0;
  height: ${CHART_HEIGHT}px;

  *:focus,
  *:focus-visible {
    outline: none;
  }
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: ${theme.radii.md};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(248, 250, 252, 0.92)),
    repeating-linear-gradient(to right, transparent 0 58px, rgba(148, 163, 184, 0.08) 58px 59px),
    repeating-linear-gradient(to bottom, transparent 0 54px, rgba(148, 163, 184, 0.08) 54px 55px);
  border: 1px solid ${theme.colors.border};
`;

const LegendRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LegendSwatch = styled.span<{ $color: string }>`
  width: 18px;
  height: 3px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`;

const LegendSwatchDashed = styled.span<{ $color: string }>`
  width: 18px;
  height: 3px;
  border-radius: 2px;
  background-image: repeating-linear-gradient(
    to right,
    ${({ $color }) => $color} 0 5px,
    transparent 5px 9px
  );
`;

const LegendLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${theme.colors.mutedTextStrong};
`;

const EmptyState = styled.p`
  min-height: 180px;
  border: 1px dashed ${theme.colors.borderStrong};
  border-radius: ${theme.radii.md};
  display: grid;
  place-items: center;
  text-align: center;
  color: ${theme.colors.mutedText};
  font-size: 0.92rem;
`;

const TooltipCard = styled.div`
  border: 1px solid ${theme.colors.borderStrong};
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.96);
  padding: 10px 12px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
`;

const TooltipLabel = styled.p`
  font-size: 0.78rem;
  font-weight: 640;
  color: ${theme.colors.mutedText};
  margin-bottom: 4px;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-block: 2px;
`;

const TooltipSwatch = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
`;

const TooltipText = styled.span`
  font-size: 0.84rem;
  color: ${theme.colors.textSecondary};
`;
