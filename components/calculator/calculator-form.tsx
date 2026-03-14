"use client";

import { useMemo, type ReactNode } from "react";
import styled from "styled-components";

import { CalculatorField } from "@/components/calculator/calculator-field";
import {
  advancedFieldConfigs,
  ageBasedSpendingFieldConfigs,
  balanceFieldConfigs,
  contributionFieldConfigs,
  incomeFieldConfigs,
  retirementGoalFieldConfigs,
  rothStrategyFieldConfigs,
  type CalculatorFieldConfig,
} from "@/components/calculator/field-config";
import { formatCurrency } from "@/lib/calculator/format";
import { parseLooseNumber } from "@/lib/calculator/input";
import type { InputField } from "@/lib/calculator/types";
import { SurfaceCard } from "@/components/ui/primitives";
import { theme } from "@/styles/theme";

type CalculatorFormProps = {
  values: Record<InputField, string>;
  errors: Partial<Record<InputField, string>>;
  fieldNotes?: Partial<Record<InputField, ReactNode>>;
  ageBasedSpendingEnabled: boolean;
  retirementSpendingInflationAdjusted: boolean;
  retirementAge: number;
  onFieldChange: (field: InputField, nextValue: string) => void;
  onAgeBasedSpendingEnabledChange: (enabled: boolean) => void;
  onRetirementSpendingInflationAdjustedChange: (enabled: boolean) => void;
};

const withPhaseDescriptions = (
  retirementAge: number,
  configs: CalculatorFieldConfig[]
): CalculatorFieldConfig[] =>
  configs.map((config) => {
    if (config.field === "earlyRetirementSpendingPercent") {
      return {
        ...config,
        description:
          retirementAge <= 74
            ? `Percent of target spending used from age ${retirementAge} through age 74.`
            : "Used if retirement starts before age 75.",
      };
    }

    if (config.field === "midRetirementSpendingPercent") {
      return {
        ...config,
        description:
          retirementAge <= 84
            ? `Percent of target spending used from age ${Math.max(75, retirementAge)} through age 84.`
            : "Used if retirement starts before age 85.",
      };
    }

    return config;
  });

export function CalculatorForm({
  values,
  errors,
  fieldNotes,
  ageBasedSpendingEnabled,
  retirementSpendingInflationAdjusted,
  retirementAge,
  onFieldChange,
  onAgeBasedSpendingEnabledChange,
  onRetirementSpendingInflationAdjustedChange,
}: CalculatorFormProps) {
  const renderFieldList = (fieldConfigs: CalculatorFieldConfig[]) =>
    fieldConfigs.map((config) => (
      <CalculatorField
        key={config.field}
        config={config}
        value={values[config.field]}
        error={errors[config.field]}
        note={fieldNotes?.[config.field]}
        onValueChange={onFieldChange}
      />
    ));

  const totalBalanceDisplay = useMemo(() => {
    const total = parseLooseNumber(values.currentBalance);
    const roth = parseLooseNumber(values.currentRothBalance);
    if (total === null) return null;
    const rothValue = roth ?? 0;
    const traditionalValue = Math.max(0, total - rothValue);
    return {
      total: formatCurrency(total),
      traditional: formatCurrency(traditionalValue),
      roth: formatCurrency(rothValue),
      hasRoth: rothValue > 0,
    };
  }, [values.currentBalance, values.currentRothBalance]);

  return (
    <FormPanel>
      <Header>
        <Title>Assumptions</Title>
        <Subtitle>
          Adjust inputs to see projected balances and whether your annual retirement spending goal is supported.
        </Subtitle>
      </Header>

      <Section>
        <SectionLabel>Retirement Goal</SectionLabel>
        <FieldStack>{renderFieldList(retirementGoalFieldConfigs)}</FieldStack>
      </Section>

      <Section>
        <SectionLabel>Current 401(k) Balances</SectionLabel>
        <FieldStack>
          {renderFieldList(balanceFieldConfigs)}
          {totalBalanceDisplay ? (
            <DerivedRow>
              {totalBalanceDisplay.hasRoth ? (
                <>
                  <span>Traditional: {totalBalanceDisplay.traditional}</span>
                  <DerivedSeparator>&middot;</DerivedSeparator>
                  <span>Roth: {totalBalanceDisplay.roth}</span>
                  <DerivedSeparator>&middot;</DerivedSeparator>
                </>
              ) : null}
              <span>Total 401(k): {totalBalanceDisplay.total}</span>
            </DerivedRow>
          ) : null}
        </FieldStack>
      </Section>

      <Section>
        <SectionLabel>Income</SectionLabel>
        <FieldStack>{renderFieldList(incomeFieldConfigs)}</FieldStack>
      </Section>

      <Section>
        <SectionLabel>Contribution Strategy</SectionLabel>
        <FieldStack>{renderFieldList(contributionFieldConfigs)}</FieldStack>
      </Section>

      <Section>
        <SectionLabel>Roth Strategy</SectionLabel>
        <FieldStack>{renderFieldList(rothStrategyFieldConfigs)}</FieldStack>
      </Section>

      <AdvancedAssumptions>
        <AdvancedSummary>
          <AdvancedSummaryTitle>Advanced assumptions</AdvancedSummaryTitle>
          <SummaryHint>Windfall, salary growth, investment return, inflation, and spending settings</SummaryHint>
        </AdvancedSummary>
        <AdvancedFields>
          {renderFieldList(advancedFieldConfigs)}

          <SpendingPatternPanel>
            <SpendingPatternHeader>
              <SpendingPatternTitle>Retirement spending pattern</SpendingPatternTitle>
              <SpendingPatternCopy>
                Spending can change over time. Use these settings to test different retirement spending phases.
              </SpendingPatternCopy>
            </SpendingPatternHeader>

            <ToggleRow>
              <ToggleCheckbox
                id="retirement-spending-inflation-adjusted"
                type="checkbox"
                checked={retirementSpendingInflationAdjusted}
                onChange={(event) => onRetirementSpendingInflationAdjustedChange(event.currentTarget.checked)}
              />
              <ToggleLabel>Adjust retirement spending for inflation each year</ToggleLabel>
            </ToggleRow>

            <ToggleRow>
              <ToggleCheckbox
                id="age-based-spending-enabled"
                type="checkbox"
                checked={ageBasedSpendingEnabled}
                onChange={(event) => onAgeBasedSpendingEnabledChange(event.currentTarget.checked)}
              />
              <ToggleLabel>Use age-based spending changes (early, mid, late retirement)</ToggleLabel>
            </ToggleRow>

            {ageBasedSpendingEnabled ? (
              <AgePhaseFields>{renderFieldList(withPhaseDescriptions(retirementAge, ageBasedSpendingFieldConfigs))}</AgePhaseFields>
            ) : null}
          </SpendingPatternPanel>
        </AdvancedFields>
      </AdvancedAssumptions>
    </FormPanel>
  );
}

const FormPanel = styled(SurfaceCard)`
  padding: 24px;
  display: grid;
  gap: 24px;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 20px;
  }
`;

const Header = styled.header`
  display: grid;
  gap: 6px;
`;

const Title = styled.h2`
  font-size: 1.08rem;
  font-weight: 640;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.mutedTextStrong};
`;

const Section = styled.section`
  display: grid;
  gap: 14px;
`;

const SectionLabel = styled.h3`
  font-size: 0.8rem;
  font-weight: 640;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.mutedTextStrong};
  padding-bottom: 2px;
  border-bottom: 1px solid ${theme.colors.border};
`;

const FieldStack = styled.div`
  display: grid;
  gap: 18px;
`;

const DerivedRow = styled.p`
  font-size: 0.82rem;
  font-weight: 560;
  color: ${theme.colors.mutedTextStrong};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 0;
`;

const DerivedSeparator = styled.span`
  margin-inline: 6px;
  color: ${theme.colors.mutedText};
`;

const AdvancedAssumptions = styled.details`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surfaceMuted};
  overflow: hidden;

  &[open] {
    border-color: ${theme.colors.borderStrong};
  }
`;

const AdvancedSummary = styled.summary`
  display: grid;
  gap: 4px;
  padding: 14px 16px 13px;
  cursor: pointer;
  user-select: none;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }
`;

const AdvancedSummaryTitle = styled.p`
  font-size: 0.84rem;
  font-weight: 640;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.mutedTextStrong};
`;

const SummaryHint = styled.p`
  font-size: 0.84rem;
  color: ${theme.colors.mutedText};
`;

const AdvancedFields = styled.div`
  padding: 8px 16px 16px;
  display: grid;
  gap: 18px;
`;

const SpendingPatternPanel = styled.section`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surface};
  padding: 14px 14px 15px;
  display: grid;
  gap: 12px;
`;

const SpendingPatternHeader = styled.header`
  display: grid;
  gap: 5px;
`;

const SpendingPatternTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 640;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.mutedTextStrong};
`;

const SpendingPatternCopy = styled.p`
  font-size: 0.82rem;
  color: ${theme.colors.mutedText};
  line-height: 1.45;
`;

const ToggleRow = styled.label`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 9px;
  color: ${theme.colors.textSecondary};
`;

const ToggleCheckbox = styled.input`
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: ${theme.colors.text};
`;

const ToggleLabel = styled.span`
  font-size: 0.84rem;
  line-height: 1.45;
`;

const AgePhaseFields = styled.div`
  padding-top: 2px;
  display: grid;
  gap: 14px;
`;
