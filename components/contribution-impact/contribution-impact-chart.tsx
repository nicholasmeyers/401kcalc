"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";

import { formatCurrency } from "@/lib/calculator/format";
import type { ContributionImpactYearEntry } from "@/lib/contribution-impact/types";
import { useHasMounted } from "@/lib/use-has-mounted";
import { theme } from "@/styles/theme";

type ContributionImpactChartProps = {
  data: ContributionImpactYearEntry[];
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

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const seriesMeta: Record<string, { label: string; color: string; dash?: string }> = {
  oneYearBalance: { label: "1-year increase", color: theme.colors.chartBenchmark, dash: "8 6" },
  fiveYearBalance: { label: "5-year increase", color: theme.colors.chartTarget },
  untilRetirementBalance: { label: "Increase until retirement", color: theme.colors.chartImproved },
};

const tooltipOrder = ["oneYearBalance", "fiveYearBalance", "untilRetirementBalance"];

function ContributionImpactTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const valuesByKey = new Map<string, number>();

  for (const entry of payload) {
    const key = String(entry.dataKey ?? "");
    if (entry.value == null) continue;
    const numericValue = typeof entry.value === "number" ? entry.value : Number(entry.value);
    if (Number.isFinite(numericValue)) {
      valuesByKey.set(key, numericValue);
    }
  }

  const rows = tooltipOrder
    .filter((key) => valuesByKey.has(key))
    .map((key) => ({ key, meta: seriesMeta[key], value: valuesByKey.get(key)! }));

  if (rows.length === 0) {
    return null;
  }

  return (
    <TooltipCard>
      <TooltipLabel>Age {label}</TooltipLabel>
      {rows.map((row) => (
        <TooltipRow key={row.key}>
          <TooltipSwatch $color={row.meta.color} />
          <TooltipText>
            {row.meta.label}: {formatCurrency(row.value)}
          </TooltipText>
        </TooltipRow>
      ))}
    </TooltipCard>
  );
}

export function ContributionImpactChart({ data }: ContributionImpactChartProps) {
  const hasMounted = useHasMounted();

  if (data.length <= 1) {
    return <EmptyState>Increase the years to retirement to see how the extra dollars compound over time.</EmptyState>;
  }

  return (
    <ChartWrapper>
      <LegendRow>
        {tooltipOrder.map((key) => (
          <LegendItem key={key}>
            {seriesMeta[key].dash ? (
              <LegendSwatchDashed $color={seriesMeta[key].color} />
            ) : (
              <LegendSwatch $color={seriesMeta[key].color} />
            )}
            <LegendLabel>{seriesMeta[key].label}</LegendLabel>
          </LegendItem>
        ))}
      </LegendRow>

      <ChartViewport>
        {hasMounted ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid stroke={theme.colors.chartGrid} strokeDasharray="3 6" vertical={false} />
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
                width={68}
                tick={{ fill: theme.colors.mutedTextStrong, fontSize: 12 }}
                tickFormatter={(value) => compactCurrency.format(value)}
              />
              <Tooltip content={<ContributionImpactTooltip />} cursor={{ stroke: theme.colors.chartCursor, strokeWidth: 1 }} />

              <Line
                type="monotone"
                dataKey="oneYearBalance"
                stroke={seriesMeta.oneYearBalance.color}
                strokeDasharray={seriesMeta.oneYearBalance.dash}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: seriesMeta.oneYearBalance.color }}
                animationDuration={300}
              />

              <Line
                type="monotone"
                dataKey="fiveYearBalance"
                stroke={seriesMeta.fiveYearBalance.color}
                strokeWidth={2.2}
                dot={false}
                activeDot={{ r: 3, fill: seriesMeta.fiveYearBalance.color }}
                animationDuration={300}
              />

              <Line
                type="monotone"
                dataKey="untilRetirementBalance"
                stroke={seriesMeta.untilRetirementBalance.color}
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 3, fill: seriesMeta.untilRetirementBalance.color }}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ChartPlaceholder aria-hidden="true" />
        )}
      </ChartViewport>
    </ChartWrapper>
  );
}

const ChartWrapper = styled.div`
  display: grid;
  gap: 12px;
`;

const LegendRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
`;

const LegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const LegendSwatch = styled.span<{ $color: string }>`
  width: 18px;
  height: 3px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

const LegendSwatchDashed = styled.span<{ $color: string }>`
  width: 18px;
  height: 3px;
  border-radius: 999px;
  background:
    repeating-linear-gradient(
      90deg,
      ${({ $color }) => $color} 0,
      ${({ $color }) => $color} 6px,
      transparent 6px,
      transparent 10px
    );
`;

const LegendLabel = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${theme.colors.mutedTextStrong};
`;

const ChartViewport = styled.div`
  min-height: 320px;
`;

const ChartPlaceholder = styled.div`
  min-height: 320px;
  border-radius: ${theme.radii.lg};
  background: linear-gradient(180deg, rgba(var(--surface-rgb), 0.9), rgba(var(--surface-rgb), 0.96));
  border: 1px dashed ${theme.colors.border};
`;

const EmptyState = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.mutedTextStrong};
`;

const TooltipCard = styled.div`
  display: grid;
  gap: 8px;
  min-width: 180px;
  padding: 12px 14px;
  border: 1px solid ${theme.colors.elevatedBorder};
  border-radius: ${theme.radii.md};
  background: rgba(var(--surface-rgb), 0.98);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
`;

const TooltipLabel = styled.p`
  font-size: 0.8rem;
  font-weight: 640;
  color: ${theme.colors.text};
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TooltipSwatch = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

const TooltipText = styled.p`
  font-size: 0.8rem;
  color: ${theme.colors.mutedTextStrong};
`;
