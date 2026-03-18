"use client";

import styled, { css } from "styled-components";

import { SurfaceCard } from "@/components/ui/primitives";
import { INCREASE_ALLOCATION_PRESETS } from "@/lib/contribution-impact/defaults";
import type { ContributionImpactField, ContributionImpactResult } from "@/lib/contribution-impact/types";
import { formatCurrency, formatPercent } from "@/lib/calculator/format";
import { parseLooseNumber } from "@/lib/calculator/input";
import { theme } from "@/styles/theme";

type ContributionImpactFormProps = {
  values: Record<ContributionImpactField, string>;
  errors: Partial<Record<ContributionImpactField, string>>;
  result: ContributionImpactResult;
  onFieldChange: (field: ContributionImpactField, nextValue: string) => void;
  onIncreaseStep: (delta: number) => void;
  onAllocationChange: (nextRothPercent: number) => void;
};

const toAllocationPresetLabel = (rothPercent: number): string => {
  if (rothPercent === 0) {
    return "Trad 100";
  }

  if (rothPercent === 100) {
    return "Roth 100";
  }

  return `${100 - rothPercent}/${rothPercent}`;
};

export function ContributionImpactForm({
  values,
  errors,
  result,
  onFieldChange,
  onIncreaseStep,
  onAllocationChange,
}: ContributionImpactFormProps) {
  const increaseValue = parseLooseNumber(values.increaseContributionPercent) ?? 0;
  const rothAllocation = parseLooseNumber(values.rothIncreaseAllocationPercent) ?? 0;

  return (
    <FormStack>
      <HeroCard>
        <HeroHeader>
          <HeroEyebrow>Your increase</HeroEyebrow>
          <HeroTitle>Raise your contribution rate and see what it could add.</HeroTitle>
        </HeroHeader>

        <InlineFieldBlock>
          <InlineFieldLabel htmlFor="contribution-impact-current-rate">Current contribution</InlineFieldLabel>
          <InlineFieldShell $invalid={Boolean(errors.contributionPercent)}>
            <InlineFieldInput
              id="contribution-impact-current-rate"
              type="text"
              inputMode="decimal"
              value={values.contributionPercent}
              aria-invalid={Boolean(errors.contributionPercent)}
              aria-describedby={errors.contributionPercent ? "contribution-impact-current-rate-error" : undefined}
              onChange={(event) => onFieldChange("contributionPercent", event.target.value)}
            />
            <InlineFieldSuffix>%</InlineFieldSuffix>
          </InlineFieldShell>
          {errors.contributionPercent ? (
            <InlineFieldError id="contribution-impact-current-rate-error">{errors.contributionPercent}</InlineFieldError>
          ) : null}
        </InlineFieldBlock>

        <IncreaseControl>
          <IncreaseLabel>Increase contribution by</IncreaseLabel>

          <IncreaseControlRow>
            <AdjustButton
              type="button"
              aria-label="Decrease contribution increase"
              disabled={increaseValue <= 0}
              onClick={() => onIncreaseStep(-1)}
            >
              -
            </AdjustButton>

            <IncreaseValueShell $invalid={Boolean(errors.increaseContributionPercent)}>
              <IncreaseValueInput
                type="text"
                inputMode="decimal"
                value={values.increaseContributionPercent}
                aria-label="Increase contribution by percent"
                aria-invalid={Boolean(errors.increaseContributionPercent)}
                aria-describedby={errors.increaseContributionPercent ? "contribution-impact-increase-error" : undefined}
                onChange={(event) => onFieldChange("increaseContributionPercent", event.target.value)}
              />
              <IncreaseValueSuffix>%</IncreaseValueSuffix>
            </IncreaseValueShell>

            <AdjustButton
              type="button"
              aria-label="Increase contribution increase"
              disabled={increaseValue >= 100}
              onClick={() => onIncreaseStep(1)}
            >
              +
            </AdjustButton>
          </IncreaseControlRow>

          {errors.increaseContributionPercent ? (
            <InlineFieldError id="contribution-impact-increase-error">{errors.increaseContributionPercent}</InlineFieldError>
          ) : null}
        </IncreaseControl>
      </HeroCard>

      <BreakdownCard>
        <SectionHeader>
          <SectionTitle>Your yearly contribution</SectionTitle>
          {result.increaseClampedByLimit ? <LimitBadge>Limited by IRS cap</LimitBadge> : null}
        </SectionHeader>

        <BreakdownList>
          <BreakdownRow>
            <BreakdownLabel>Current</BreakdownLabel>
            <BreakdownValue>{formatCurrency(result.currentAnnualContribution)} / yr</BreakdownValue>
          </BreakdownRow>

          <BreakdownRow $highlight>
            <BreakdownLabel>+ Increase</BreakdownLabel>
            <BreakdownValue>{formatCurrency(result.additionalAnnualContribution)} / yr</BreakdownValue>
          </BreakdownRow>

          <BreakdownDivider />

          <BreakdownRow>
            <BreakdownLabel>Total</BreakdownLabel>
            <BreakdownValue $bold>{formatCurrency(result.totalAnnualContribution)} / yr</BreakdownValue>
          </BreakdownRow>

          <BreakdownRow>
            <BreakdownLabel>IRS limit (age {result.currentAge})</BreakdownLabel>
            <BreakdownValue>{formatCurrency(result.currentContributionLimit)} / yr</BreakdownValue>
          </BreakdownRow>

          <BreakdownRow>
            <BreakdownLabel>Remaining room</BreakdownLabel>
            <BreakdownValue>{formatCurrency(result.remainingContributionRoom)} / yr</BreakdownValue>
          </BreakdownRow>
        </BreakdownList>

        {!result.increaseClampedByLimit && result.additionalAnnualContribution > 0 ? (
          <RoomContext $tight={result.remainingContributionRoom < result.currentContributionLimit * 0.15}>
            {result.remainingContributionRoom < result.currentContributionLimit * 0.15
              ? `Only ${formatCurrency(result.remainingContributionRoom)} of IRS cap remaining.`
              : `${formatCurrency(result.remainingContributionRoom)} of IRS cap remaining.`}
          </RoomContext>
        ) : null}

        {result.increaseClampedByLimit ? (
          <WarningCallout>
            Requested {formatPercent(result.increaseContributionPercent)} becomes {formatPercent(result.effectiveIncreaseContributionPercent)} — the model stops at the current-age IRS cap.
          </WarningCallout>
        ) : null}
      </BreakdownCard>

      <AllocationCard>
        <SectionHeader>
          <SectionTitle>Split: Traditional vs. Roth</SectionTitle>
        </SectionHeader>

        <AllocationIntro>Choose how to allocate the extra dollars above your current rate.</AllocationIntro>

        <AllocationScaleHeader>
          <AllocationSide>
            <AllocationSideLabel>Traditional</AllocationSideLabel>
            <AllocationSideValue>{formatPercent(result.traditionalIncreaseAllocationPercent)}</AllocationSideValue>
          </AllocationSide>
          <AllocationSide $alignEnd>
            <AllocationSideLabel>Roth</AllocationSideLabel>
            <AllocationSideValue>{formatPercent(result.rothIncreaseAllocationPercent)}</AllocationSideValue>
          </AllocationSide>
        </AllocationScaleHeader>

        <AllocationRange
          type="range"
          min="0"
          max="100"
          step="5"
          value={rothAllocation}
          aria-label="Roth allocation for the increase"
          onChange={(event) => onAllocationChange(Number(event.target.value))}
        />

        <AllocationCards>
          <AllocationStatCard>
            <AllocationStatLabel>Traditional increase</AllocationStatLabel>
            <AllocationStatValue>{formatCurrency(result.traditionalAdditionalContribution)} / year</AllocationStatValue>
          </AllocationStatCard>

          <AllocationStatCard>
            <AllocationStatLabel>Roth increase</AllocationStatLabel>
            <AllocationStatValue>{formatCurrency(result.rothAdditionalContribution)} / year</AllocationStatValue>
          </AllocationStatCard>
        </AllocationCards>

        <AllocationPresetRow>
          {INCREASE_ALLOCATION_PRESETS.map((value) => (
            <AllocationPresetButton
              key={value}
              type="button"
              $active={Math.abs(rothAllocation - value) < 0.001}
              onClick={() => onAllocationChange(value)}
            >
              {toAllocationPresetLabel(value)}
            </AllocationPresetButton>
          ))}
        </AllocationPresetRow>
      </AllocationCard>
    </FormStack>
  );
}

const FormStack = styled.div`
  display: grid;
  gap: 16px;
`;

const cardBase = css`
  padding: 20px;
  display: grid;
  gap: 16px;
`;

const HeroCard = styled(SurfaceCard)`
  ${cardBase};
  background:
    radial-gradient(circle at top right, rgba(22, 163, 74, 0.12), transparent 42%),
    linear-gradient(180deg, #ffffff 0%, #fbfffc 100%);
  border-color: ${theme.colors.successBorder};
`;

const BreakdownCard = styled(SurfaceCard)`
  ${cardBase};
`;

const AllocationCard = styled(SurfaceCard)`
  ${cardBase};
`;

const HeroHeader = styled.header`
  display: grid;
  gap: 6px;
`;

const HeroEyebrow = styled.p`
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.successText};
`;

const HeroTitle = styled.h2`
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  line-height: 1.1;
  font-weight: 680;
  letter-spacing: -0.02em;
`;

const InlineFieldBlock = styled.div`
  display: grid;
  gap: 6px;
`;

const InlineFieldLabel = styled.label`
  font-size: 0.78rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const InlineFieldShell = styled.div<{ $invalid: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 52px;
  padding: 0 14px;
  border-radius: ${theme.radii.md};
  border: 1px solid ${({ $invalid }) => ($invalid ? theme.colors.dangerBorder : theme.colors.borderStrong)};
  background: ${({ $invalid }) => ($invalid ? theme.colors.dangerSurface : theme.colors.surfaceMuted)};

  &:focus-within {
    box-shadow: 0 0 0 3px ${theme.colors.focusRing};
    border-color: ${theme.colors.elevatedBorderHover};
    background: ${theme.colors.surface};
  }
`;

const InlineFieldInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  font-weight: 650;
  color: ${theme.colors.text};

  &:focus {
    outline: none;
  }
`;

const InlineFieldSuffix = styled.span`
  font-size: 0.96rem;
  font-weight: 650;
  color: ${theme.colors.mutedTextStrong};
`;

const InlineFieldError = styled.p`
  font-size: 0.78rem;
  color: ${theme.colors.dangerText};
`;

const IncreaseControl = styled.div`
  display: grid;
  gap: 12px;
`;

const IncreaseLabel = styled.h3`
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const IncreaseControlRow = styled.div`
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr) 62px;
  gap: 12px;
  align-items: center;
`;

const AdjustButton = styled.button`
  height: 62px;
  border-radius: ${theme.radii.md};
  border: 1px solid ${theme.colors.chartImproved};
  background: ${theme.colors.chartImproved};
  color: #ffffff;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  transition: transform 140ms ease, filter 140ms ease, opacity 140ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(0.96);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const IncreaseValueShell = styled.div<{ $invalid: boolean }>`
  height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 18px;
  border-radius: ${theme.radii.lg};
  border: 1px solid ${({ $invalid }) => ($invalid ? theme.colors.dangerBorder : theme.colors.successBorder)};
  background:
    radial-gradient(circle at top right, rgba(22, 163, 74, 0.08), transparent 54%),
    ${({ $invalid }) => ($invalid ? theme.colors.dangerSurface : theme.colors.successSurface)};

  &:focus-within {
    box-shadow: 0 0 0 3px ${theme.colors.focusRing};
  }
`;

const IncreaseValueInput = styled.input`
  width: 100%;
  min-width: 0;
  border: none;
  background: transparent;
  text-align: center;
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  color: ${theme.colors.text};

  &:focus {
    outline: none;
  }
`;

const IncreaseValueSuffix = styled.span`
  font-size: 1.35rem;
  font-weight: 700;
  color: ${theme.colors.mutedTextStrong};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h3`
  font-size: 0.86rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const LimitBadge = styled.span`
  padding: 6px 10px;
  border-radius: ${theme.radii.pill};
  border: 1px solid ${theme.colors.warningBorder};
  background: ${theme.colors.warningSurface};
  font-size: 0.76rem;
  font-weight: 650;
  color: ${theme.colors.warningText};
`;

const BreakdownList = styled.div`
  display: grid;
  gap: 12px;
`;

const BreakdownRow = styled.div<{ $highlight?: boolean }>`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;

  ${({ $highlight }) =>
    $highlight
      ? css`
          & > * {
            color: ${theme.colors.successText};
          }
        `
      : null}
`;

const BreakdownDivider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border};
  margin: 2px 0;
`;

const BreakdownLabel = styled.span`
  font-size: 0.88rem;
  color: ${theme.colors.mutedTextStrong};
`;

const BreakdownValue = styled.span<{ $bold?: boolean }>`
  text-align: right;
  font-size: 0.92rem;
  font-weight: ${({ $bold }) => ($bold ? "700" : "650")};
  color: ${theme.colors.text};
`;

const RoomContext = styled.p<{ $tight: boolean }>`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ $tight }) => ($tight ? theme.colors.warningText : theme.colors.mutedTextStrong)};
`;

const WarningCallout = styled.p`
  padding: 14px 16px;
  border-radius: ${theme.radii.md};
  border: 1px solid ${theme.colors.warningBorder};
  background: ${theme.colors.warningSurface};
  font-size: 0.84rem;
  line-height: 1.55;
  color: ${theme.colors.warningText};
`;

const AllocationIntro = styled.p`
  font-size: 0.84rem;
  color: ${theme.colors.mutedTextStrong};
`;

const AllocationScaleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const AllocationSide = styled.div<{ $alignEnd?: boolean }>`
  display: grid;
  gap: 2px;
  justify-items: ${({ $alignEnd }) => ($alignEnd ? "end" : "start")};
`;

const AllocationSideLabel = styled.span`
  font-size: 0.76rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const AllocationSideValue = styled.span`
  font-size: 1rem;
  font-weight: 680;
  color: ${theme.colors.text};
`;

const AllocationRange = styled.input`
  width: 100%;
  accent-color: ${theme.colors.chartImproved};
  cursor: pointer;
`;

const AllocationCards = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const AllocationStatCard = styled.div`
  padding: 14px 16px;
  border-radius: ${theme.radii.md};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surfaceMuted};
  display: grid;
  gap: 6px;
`;

const AllocationStatLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.colors.mutedTextStrong};
`;

const AllocationStatValue = styled.span`
  font-size: 1rem;
  font-weight: 680;
  color: ${theme.colors.text};
`;

const AllocationPresetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const AllocationPresetButton = styled.button<{ $active: boolean }>`
  min-width: 74px;
  height: 38px;
  padding: 0 12px;
  border-radius: ${theme.radii.pill};
  border: 1px solid ${({ $active }) => ($active ? theme.colors.accent : theme.colors.borderStrong)};
  background: ${({ $active }) => ($active ? theme.colors.elevatedGradient : theme.colors.surface)};
  color: ${theme.colors.text};
  font-size: 0.84rem;
  font-weight: 650;
  cursor: pointer;
  transition: border-color 140ms ease, transform 140ms ease;

  &:hover {
    border-color: ${theme.colors.accent};
    transform: translateY(-1px);
  }
`;
