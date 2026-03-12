"use client";

import type { ReactNode } from "react";
import styled, { css } from "styled-components";

import { ContextualInfoTooltip } from "@/components/ui/info-tooltip";
import { theme } from "@/styles/theme";

type CalculatorSummaryCardProps = {
  label: string;
  value: ReactNode;
  tone?: "default" | "hero";
  tooltip?: string;
  supportingCopy?: string;
};

export function CalculatorSummaryCard({
  label,
  value,
  tone = "default",
  tooltip,
  supportingCopy,
}: CalculatorSummaryCardProps) {
  return (
    <Card $tone={tone}>
      <LabelRow>
        <Label>{label}</Label>
        <ContextualInfoTooltip label={label} content={tooltip} />
      </LabelRow>
      <Value $tone={tone}>{value}</Value>
      {supportingCopy ? <SupportingCopy>{supportingCopy}</SupportingCopy> : null}
    </Card>
  );
}

const Card = styled.article<{ $tone: "default" | "hero" }>`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  background: ${theme.colors.surface};
  padding: 18px;
  display: grid;
  gap: 8px;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;

  ${(props) =>
    props.$tone === "hero"
      ? css`
          padding: 22px;
          background: ${theme.colors.elevatedGradient};
          border-color: ${theme.colors.elevatedBorder};
          gap: 10px;
        `
      : null}

  &:hover,
  &:focus-within {
    border-color: ${theme.colors.elevatedBorderHover};
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
    transform: translateY(-1px);
  }
`;

const Label = styled.p`
  font-size: 0.75rem;
  font-weight: 640;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Value = styled.p<{ $tone: "default" | "hero" }>`
  color: ${theme.colors.text};
  font-size: ${(props) => (props.$tone === "hero" ? "clamp(1.95rem, 4vw, 2.7rem)" : "clamp(1.2rem, 2.4vw, 1.8rem)")};
  line-height: 1.12;
  font-weight: ${(props) => (props.$tone === "hero" ? 660 : 620)};
  letter-spacing: -0.02em;
`;

const SupportingCopy = styled.p`
  font-size: 0.8rem;
  line-height: 1.45;
  color: ${theme.colors.mutedTextStrong};
`;
