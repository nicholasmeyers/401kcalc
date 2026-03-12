"use client";

import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type DotProps,
  type MouseHandlerDataParam,
} from "recharts";
import styled from "styled-components";

import { formatCurrency } from "@/lib/calculator/format";
import type { YearlyProjectionEntry } from "@/lib/calculator/types";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { theme } from "@/styles/theme";

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

type ProjectionChartProps = {
  data: YearlyProjectionEntry[];
  targetSpendingData: YearlyProjectionEntry[];
  retirementAge: number;
  onRetirementAgeChange?: (nextRetirementAge: number) => void;
};

type ChartRow = YearlyProjectionEntry & {
  targetSpendingEndingBalance: number | null;
};

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(value, max));
const chartTooltipContentStyle = {
  border: `1px solid ${theme.colors.borderStrong}`,
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.96)",
  padding: "10px 12px",
};
const chartTooltipLabelStyle = {
  fontSize: "0.78rem",
  fontWeight: 640,
  color: theme.colors.mutedText,
};
const chartTooltipItemStyle = {
  fontSize: "0.84rem",
  color: theme.colors.textSecondary,
  paddingBlock: "3px",
};

const toNumericAge = (label: MouseHandlerDataParam["activeLabel"]): number | null => {
  if (typeof label === "number" && Number.isFinite(label)) {
    return label;
  }

  if (typeof label === "string") {
    const parsed = Number(label);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export function ProjectionChart({ data, targetSpendingData, retirementAge, onRetirementAgeChange }: ProjectionChartProps) {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [isDraggingRetirementMarker, setIsDraggingRetirementMarker] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const {
    chartRows,
    windfallRows,
    depletionRow,
    targetSpendingDepletionRow,
    shouldRenderTargetSpendingDepletion,
    minAge,
    maxAge,
    retirementMarkerBalance,
  } = useMemo(() => {
    if (data.length === 0) {
      return {
        chartRows: [] as ChartRow[],
        windfallRows: [] as YearlyProjectionEntry[],
        depletionRow: undefined,
        targetSpendingDepletionRow: undefined,
        shouldRenderTargetSpendingDepletion: false,
        minAge: retirementAge,
        maxAge: retirementAge,
        retirementMarkerBalance: 0,
      };
    }

    const targetSpendingRowsByAge = new Map(targetSpendingData.map((entry) => [entry.age, entry]));
    const nextChartRows: ChartRow[] = data.map((entry) => ({
      ...entry,
      targetSpendingEndingBalance: targetSpendingRowsByAge.get(entry.age)?.endingBalance ?? null,
    }));
    const nextWindfallRows = data.filter((entry) => entry.windfallAmount > 0);
    const nextDepletionRow = data.find((entry) => entry.endingBalance <= 0);
    const nextTargetSpendingDepletionRow = targetSpendingData.find((entry) => entry.endingBalance <= 0);
    const nextShouldRenderTargetSpendingDepletion =
      nextTargetSpendingDepletionRow !== undefined && nextTargetSpendingDepletionRow.age !== nextDepletionRow?.age;
    const nextMinAge = nextChartRows[0]?.age ?? retirementAge;
    const nextMaxAge = nextChartRows[nextChartRows.length - 1]?.age ?? retirementAge;
    const nearestRetirementRow = nextChartRows.reduce((closest, row) => {
      const currentDistance = Math.abs(row.age - retirementAge);
      const nextDistance = Math.abs(closest.age - retirementAge);
      return currentDistance < nextDistance ? row : closest;
    }, nextChartRows[0]);

    return {
      chartRows: nextChartRows,
      windfallRows: nextWindfallRows,
      depletionRow: nextDepletionRow,
      targetSpendingDepletionRow: nextTargetSpendingDepletionRow,
      shouldRenderTargetSpendingDepletion: nextShouldRenderTargetSpendingDepletion,
      minAge: nextMinAge,
      maxAge: nextMaxAge,
      retirementMarkerBalance: nearestRetirementRow?.endingBalance ?? 0,
    };
  }, [data, targetSpendingData, retirementAge]);

  const lineAnimationDuration = isDraggingRetirementMarker ? 110 : 240;
  const legendHint = onRetirementAgeChange ? "Drag the retirement marker on the chart to explore ages." : undefined;
  const legendDescription =
    "Dark line: main projection in future dollars. Gray dashed line: same path in today's dollars. Teal dashed line: target-spending projection.";

  const handleRetirementAgeUpdate = useCallback(
    (activeLabel: MouseHandlerDataParam["activeLabel"]) => {
      if (!onRetirementAgeChange) {
        return;
      }

      const numericAge = toNumericAge(activeLabel);

      if (numericAge === null) {
        return;
      }

      const boundedAge = clamp(Math.round(numericAge), minAge, maxAge);

      if (boundedAge !== retirementAge) {
        onRetirementAgeChange(boundedAge);
      }
    },
    [maxAge, minAge, onRetirementAgeChange, retirementAge]
  );

  const handleChartPointerMove = useCallback(
    (nextState: MouseHandlerDataParam) => {
      if (!isDraggingRetirementMarker) {
        return;
      }

      handleRetirementAgeUpdate(nextState.activeLabel);
    },
    [handleRetirementAgeUpdate, isDraggingRetirementMarker]
  );

  const stopDraggingRetirementMarker = useCallback(() => {
    setIsDraggingRetirementMarker(false);
  }, []);

  const startDraggingRetirementMarker = useCallback(() => {
    if (!onRetirementAgeChange) {
      return;
    }

    setHoveredMarkerId("retirement");
    setIsDraggingRetirementMarker(true);
  }, [onRetirementAgeChange]);

  const handleRetirementMarkerKeyDown = useCallback(
    (dotProps: DotProps, event: KeyboardEvent<SVGCircleElement>) => {
      void dotProps;

      if (!onRetirementAgeChange) {
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        onRetirementAgeChange(clamp(retirementAge - 1, minAge, maxAge));
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        onRetirementAgeChange(clamp(retirementAge + 1, minAge, maxAge));
      }
    },
    [maxAge, minAge, onRetirementAgeChange, retirementAge]
  );

  const getDotLabel = (
    markerId: string,
    label: string,
    position: "top" | "bottom" = "top"
  ): { value: string; fill: string; fontSize: number; position: "top" | "bottom" } | undefined =>
    hoveredMarkerId === markerId || (markerId === "retirement" && isDraggingRetirementMarker)
      ? { value: label, fill: theme.colors.mutedTextStrong, fontSize: 11, position }
      : undefined;

  const handleMarkerHover = (markerId: string, hovered: boolean) => {
    setHoveredMarkerId((current) => {
      if (hovered) {
        return markerId;
      }

      return current === markerId ? null : current;
    });
  };

  const getMarkerRadius = (markerId: string, defaultRadius = 3.5): number => {
    if (hoveredMarkerId === markerId || (markerId === "retirement" && isDraggingRetirementMarker)) {
      return defaultRadius + 1.4;
    }

    return defaultRadius;
  };

  const markerEvents = (markerId: string) => ({
    onMouseEnter: () => handleMarkerHover(markerId, true),
    onMouseLeave: () => handleMarkerHover(markerId, false),
    onFocus: () => handleMarkerHover(markerId, true),
    onBlur: () => handleMarkerHover(markerId, false),
  });

  if (chartRows.length === 0) {
    return <EmptyState>Projection data appears here once all assumptions are valid.</EmptyState>;
  }

  return (
    <ChartWrapper>
      <LegendRow>
        <LegendItem>
          <LegendSwatch $kind="nominal" /> Main projection (future dollars)
        </LegendItem>
        <LegendItem>
          <LegendSwatch $kind="inflation" /> Main projection (today&apos;s dollars)
        </LegendItem>
        <LegendItem>
          <LegendSwatch $kind="target" /> Target-spending projection
        </LegendItem>
        <LegendItem>
          <LegendSwatch $kind="event" /> Timeline markers
        </LegendItem>
      </LegendRow>
      <LegendDescription>{legendDescription}</LegendDescription>
      {legendHint ? <LegendHint>{legendHint}</LegendHint> : null}
      <ChartViewport $dragging={isDraggingRetirementMarker}>
        <ResponsiveContainer width="100%" height="100%" minHeight={286}>
          <LineChart
            data={chartRows}
            margin={{ top: 12, right: 8, left: 0, bottom: 8 }}
            onMouseMove={handleChartPointerMove}
            onMouseUp={stopDraggingRetirementMarker}
            onMouseLeave={stopDraggingRetirementMarker}
            onTouchMove={handleChartPointerMove}
            onTouchEnd={stopDraggingRetirementMarker}
            onClick={(nextState) => handleRetirementAgeUpdate(nextState.activeLabel)}
          >
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
              width={66}
              tick={{ fill: theme.colors.mutedTextStrong, fontSize: 12 }}
              tickFormatter={(value) => compactCurrency.format(value)}
            />
            <Tooltip
              formatter={(value, name) => {
                const numericValue = typeof value === "number" ? value : Number(value);
                return [formatCurrency(Number.isFinite(numericValue) ? numericValue : 0), name];
              }}
              labelFormatter={(label) => `Age ${label}`}
              contentStyle={chartTooltipContentStyle}
              labelStyle={chartTooltipLabelStyle}
              itemStyle={chartTooltipItemStyle}
              cursor={{ stroke: theme.colors.chartCursor, strokeWidth: 1 }}
            />
            <ReferenceLine
              x={retirementAge}
              stroke={theme.colors.chartEvent}
              strokeDasharray="4 4"
              strokeWidth={1.2}
              ifOverflow="visible"
            />
            <ReferenceDot
              x={retirementAge}
              y={retirementMarkerBalance}
              r={getMarkerRadius("retirement", 7)}
              fill={theme.colors.chartMain}
              stroke={theme.colors.surface}
              strokeWidth={2}
              cursor={onRetirementAgeChange ? (isDraggingRetirementMarker ? "grabbing" : "grab") : "default"}
              ifOverflow="visible"
              tabIndex={onRetirementAgeChange ? 0 : -1}
              role={onRetirementAgeChange ? "slider" : undefined}
              aria-valuemin={onRetirementAgeChange ? minAge : undefined}
              aria-valuemax={onRetirementAgeChange ? maxAge : undefined}
              aria-valuenow={onRetirementAgeChange ? retirementAge : undefined}
              aria-valuetext={onRetirementAgeChange ? `Age ${retirementAge}` : undefined}
              aria-label={
                onRetirementAgeChange
                  ? "Retirement age marker. Drag left or right, tap chart to reposition, or use arrow keys."
                  : undefined
              }
              label={getDotLabel("retirement", "Retirement age", "top")}
              onMouseDown={(dotProps: DotProps, event) => {
                void dotProps;
                event.preventDefault();
                startDraggingRetirementMarker();
              }}
              onTouchStart={(dotProps: DotProps, event) => {
                void dotProps;
                event.preventDefault();
                startDraggingRetirementMarker();
              }}
              onKeyDown={handleRetirementMarkerKeyDown}
              {...markerEvents("retirement")}
            />
            {windfallRows.map((entry) => {
              const markerId = `windfall-${entry.yearIndex}`;

              return (
                <ReferenceDot
                  key={markerId}
                  x={entry.age}
                  y={entry.endingBalance}
                  r={getMarkerRadius(markerId)}
                  fill={theme.colors.chartWindfall}
                  stroke={theme.colors.surface}
                  strokeWidth={1.4}
                  ifOverflow="visible"
                  tabIndex={0}
                  role="img"
                  aria-label={`Windfall contribution marker at age ${entry.age}`}
                  label={getDotLabel(markerId, `Windfall at age ${entry.age}`, "top")}
                  {...markerEvents(markerId)}
                />
              );
            })}
            {depletionRow ? (
              <ReferenceDot
                x={depletionRow.age}
                y={depletionRow.endingBalance}
                r={getMarkerRadius("depletion")}
                fill={theme.colors.chartDepletion}
                stroke={theme.colors.surface}
                strokeWidth={1.4}
                ifOverflow="visible"
                tabIndex={0}
                role="img"
                aria-label={`Sustainable scenario depletion marker at age ${depletionRow.age}`}
                label={getDotLabel("depletion", `Portfolio depleted at age ${depletionRow.age}`, "bottom")}
                {...markerEvents("depletion")}
              />
            ) : null}
            {targetSpendingDepletionRow && shouldRenderTargetSpendingDepletion ? (
              <ReferenceDot
                x={targetSpendingDepletionRow.age}
                y={targetSpendingDepletionRow.endingBalance}
                r={getMarkerRadius("target-depletion")}
                fill={theme.colors.chartTarget}
                stroke={theme.colors.surface}
                strokeWidth={1.4}
                ifOverflow="visible"
                tabIndex={0}
                role="img"
                aria-label={`Target-spending scenario depletion marker at age ${targetSpendingDepletionRow.age}`}
                label={getDotLabel("target-depletion", `Target depleted at age ${targetSpendingDepletionRow.age}`, "top")}
                {...markerEvents("target-depletion")}
              />
            ) : null}
            <Line
              type="monotone"
              dataKey="endingBalance"
              name="Main projection (future dollars)"
              stroke={theme.colors.chartMain}
              strokeWidth={2.4}
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={lineAnimationDuration}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="inflationAdjustedEndingBalance"
              name="Main projection (today's dollars)"
              stroke={theme.colors.chartInflation}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={lineAnimationDuration}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="targetSpendingEndingBalance"
              name="Target-spending projection"
              stroke={theme.colors.chartTarget}
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={false}
              activeDot={{ r: 3 }}
              connectNulls={false}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={lineAnimationDuration}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartViewport>
    </ChartWrapper>
  );
}

const ChartWrapper = styled.div`
  width: 100%;
  display: grid;
  gap: 12px;
`;

const ChartViewport = styled.div<{ $dragging: boolean }>`
  width: 100%;
  min-width: 0;
  min-height: 286px;
  height: clamp(286px, 56vw, 336px);
  overflow: visible;
  touch-action: ${(props) => (props.$dragging ? "none" : "pan-y")};
`;

const LegendRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
`;

const LegendItem = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.76rem;
  color: ${theme.colors.mutedTextStrong};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.pill};
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.8);
  min-width: 0;
`;

const LegendSwatch = styled.span<{ $kind: "nominal" | "inflation" | "target" | "event" }>`
  width: ${(props) => (props.$kind === "event" ? "8px" : "24px")};
  height: ${(props) => (props.$kind === "event" ? "8px" : "0")};
  border-radius: ${(props) => (props.$kind === "event" ? "999px" : "0")};
  border-top: ${(props) => (props.$kind === "event" ? "none" : "2px solid")};
  border-top-color: ${(props) =>
    props.$kind === "nominal"
      ? theme.colors.chartMain
      : props.$kind === "inflation"
        ? theme.colors.chartInflation
        : props.$kind === "target"
          ? theme.colors.chartTarget
          : "transparent"};
  border-top-style: ${(props) => (props.$kind === "nominal" ? "solid" : "dashed")};
  background: ${(props) => (props.$kind === "event" ? theme.colors.chartEvent : "transparent")};
`;

const LegendHint = styled.p`
  font-size: 0.77rem;
  color: ${theme.colors.mutedTextStrong};
  padding-left: 2px;
`;

const LegendDescription = styled.p`
  font-size: 0.78rem;
  color: ${theme.colors.mutedText};
  line-height: 1.45;
  padding-left: 2px;
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
