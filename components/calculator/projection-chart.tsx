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
  retirementAge: number;
  onRetirementAgeChange?: (nextRetirementAge: number) => void;
};

type ChartRow = YearlyProjectionEntry;

type ProjectionTooltipPayloadEntry = {
  dataKey?: string | number;
  value?: number | string | null;
};

type ProjectionTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: ProjectionTooltipPayloadEntry[];
};

type LegendKind = "nominal" | "inflation" | "event";

const chartSeries = [
  {
    key: "endingBalance",
    name: "Projected balance",
    color: theme.colors.chartMain,
    strokeWidth: 2.4,
  },
  {
    key: "inflationAdjustedEndingBalance",
    name: "Projected balance in today's dollars",
    color: theme.colors.chartInflation,
    strokeWidth: 2,
    strokeDasharray: "6 8",
  },
] as const;

const [mainSeries, inflationSeries] = chartSeries;
const legendItems: { kind: LegendKind; label: string; description: string }[] = [
  {
    kind: "nominal",
    label: mainSeries.name,
    description: "Estimated account balance each year based on your current assumptions.",
  },
  {
    kind: "inflation",
    label: inflationSeries.name,
    description: "Same estimate adjusted for inflation to show today's buying power.",
  },
  {
    kind: "event",
    label: "Retirement age marker",
    description: "Your selected retirement age on the timeline.",
  },
];

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(value, max));

const toFiniteNumber = (value: number | string | null | undefined): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
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

const ProjectionHoverTooltip = ({ active, label, payload }: ProjectionTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const valuesByKey = new Map<string, number>();

  for (const entry of payload) {
    if (typeof entry.dataKey !== "string") {
      continue;
    }

    const numericValue = toFiniteNumber(entry.value);

    if (numericValue === null) {
      continue;
    }

    valuesByKey.set(entry.dataKey, numericValue);
  }

  const tooltipRows = chartSeries.flatMap((series) => {
    const value = valuesByKey.get(series.key);

    if (value === undefined) {
      return [];
    }

    return [{ ...series, value }];
  });

  if (tooltipRows.length === 0) {
    return null;
  }

  return (
    <HoverTooltipCard>
      <HoverTooltipLabel>{label === undefined ? "Age" : `Age ${label}`}</HoverTooltipLabel>
      {tooltipRows.map((row) => (
        <HoverTooltipRow key={row.key}>
          <HoverTooltipSwatch viewBox="0 0 28 8" role="presentation" focusable="false" aria-hidden>
            <line
              x1="0"
              y1="4"
              x2="28"
              y2="4"
              stroke={row.color}
              strokeWidth={row.strokeWidth}
              strokeDasharray={"strokeDasharray" in row ? row.strokeDasharray : undefined}
              strokeLinecap="round"
            />
          </HoverTooltipSwatch>
          <HoverTooltipText>
            {row.name}: {formatCurrency(row.value)}
          </HoverTooltipText>
        </HoverTooltipRow>
      ))}
    </HoverTooltipCard>
  );
};

export function ProjectionChart({ data, retirementAge, onRetirementAgeChange }: ProjectionChartProps) {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [isDraggingRetirementMarker, setIsDraggingRetirementMarker] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const {
    chartRows,
    windfallRows,
    depletionRow,
    minAge,
    maxAge,
    retirementMarkerBalance,
  } = useMemo(() => {
    if (data.length === 0) {
      return {
        chartRows: [] as ChartRow[],
        windfallRows: [] as YearlyProjectionEntry[],
        depletionRow: undefined,
        minAge: retirementAge,
        maxAge: retirementAge,
        retirementMarkerBalance: 0,
      };
    }

    const nextChartRows: ChartRow[] = data;
    const nextWindfallRows = data.filter((entry) => entry.windfallAmount > 0);
    const nextDepletionRow = data.find((entry) => entry.isRetired && entry.yearIndex > 0 && entry.endingBalance <= 0);
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
      minAge: nextMinAge,
      maxAge: nextMaxAge,
      retirementMarkerBalance: nearestRetirementRow?.endingBalance ?? 0,
    };
  }, [data, retirementAge]);

  const lineAnimationDuration = isDraggingRetirementMarker ? 110 : 240;
  const legendHint = onRetirementAgeChange ? "Drag the retirement marker on the chart to explore ages." : undefined;

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
        {legendItems.map((item) => (
          <LegendItem key={item.label}>
            <LegendTitleRow>
              <LegendSwatch $kind={item.kind} />
              <LegendTitle>{item.label}</LegendTitle>
            </LegendTitleRow>
            <LegendDetail>{item.description}</LegendDetail>
          </LegendItem>
        ))}
      </LegendRow>
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
              content={<ProjectionHoverTooltip />}
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
                aria-label={`Projected balance depletion marker at age ${depletionRow.age}`}
                label={getDotLabel("depletion", `Portfolio depleted at age ${depletionRow.age}`, "bottom")}
                {...markerEvents("depletion")}
              />
            ) : null}
            <Line
              type="monotone"
              dataKey="endingBalance"
              name={mainSeries.name}
              stroke={mainSeries.color}
              strokeWidth={mainSeries.strokeWidth}
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={lineAnimationDuration}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="inflationAdjustedEndingBalance"
              name={inflationSeries.name}
              stroke={inflationSeries.color}
              strokeWidth={inflationSeries.strokeWidth}
              strokeDasharray={inflationSeries.strokeDasharray}
              dot={false}
              activeDot={{ r: 3 }}
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

  .recharts-wrapper:focus,
  .recharts-wrapper:focus-visible,
  .recharts-surface:focus,
  .recharts-surface:focus-visible {
    outline: none;
  }
`;

const LegendRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 8px;
`;

const LegendItem = styled.div`
  display: grid;
  gap: 6px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  padding: 9px 11px;
  background: rgba(255, 255, 255, 0.8);
  min-width: 0;
`;

const LegendTitleRow = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendTitle = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.mutedTextStrong};
`;

const LegendDetail = styled.p`
  font-size: 0.76rem;
  color: ${theme.colors.mutedText};
  line-height: 1.4;
`;

const LegendSwatch = styled.span<{ $kind: LegendKind }>`
  width: ${(props) => (props.$kind === "event" ? "8px" : "24px")};
  height: ${(props) => (props.$kind === "event" ? "8px" : "2px")};
  border-radius: ${(props) => (props.$kind === "event" ? "999px" : "2px")};
  background-color: ${(props) =>
    props.$kind === "event"
      ? theme.colors.chartEvent
      : props.$kind === "nominal"
        ? theme.colors.chartMain
        : "transparent"};
  background-image: ${(props) =>
    props.$kind === "inflation"
      ? `repeating-linear-gradient(to right, ${theme.colors.chartInflation} 0 6px, transparent 6px 14px)`
      : "none"};
`;

const HoverTooltipCard = styled.div`
  border: 1px solid ${theme.colors.borderStrong};
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.96);
  padding: 10px 12px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
`;

const HoverTooltipLabel = styled.p`
  font-size: 0.78rem;
  font-weight: 640;
  color: ${theme.colors.mutedText};
  margin-bottom: 4px;
`;

const HoverTooltipRow = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-block: 3px;
`;

const HoverTooltipSwatch = styled.svg`
  width: 28px;
  height: 8px;
  flex-shrink: 0;
`;

const HoverTooltipText = styled.span`
  font-size: 0.84rem;
  color: ${theme.colors.textSecondary};
`;

const LegendHint = styled.p`
  font-size: 0.77rem;
  color: ${theme.colors.mutedTextStrong};
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
