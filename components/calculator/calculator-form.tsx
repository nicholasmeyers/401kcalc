"use client";

import styled from "styled-components";

import { CalculatorField } from "@/components/calculator/calculator-field";
import {
  advancedFieldConfigs,
  primaryFieldConfigs,
  type CalculatorFieldConfig,
} from "@/components/calculator/field-config";
import type { InputField } from "@/lib/calculator/types";
import { SurfaceCard } from "@/components/ui/primitives";
import { theme } from "@/styles/theme";

type CalculatorFormProps = {
  values: Record<InputField, string>;
  errors: Partial<Record<InputField, string>>;
  fieldNotes?: Partial<Record<InputField, string>>;
  onFieldChange: (field: InputField, nextValue: string) => void;
};

export function CalculatorForm({ values, errors, fieldNotes, onFieldChange }: CalculatorFormProps) {
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

  return (
    <FormPanel>
      <Header>
        <Title>Assumptions</Title>
        <Subtitle>Adjust a few inputs to see how your retirement trajectory shifts in real time.</Subtitle>
      </Header>

      <FieldStack>{renderFieldList(primaryFieldConfigs)}</FieldStack>

      <AdvancedAssumptions>
        <AdvancedSummary>
          <SummaryTitle>Advanced assumptions</SummaryTitle>
          <SummaryHint>Windfall event, growth, return, inflation, withdrawal rate, and target spending</SummaryHint>
        </AdvancedSummary>
        <AdvancedFields>{renderFieldList(advancedFieldConfigs)}</AdvancedFields>
      </AdvancedAssumptions>
    </FormPanel>
  );
}

const FormPanel = styled(SurfaceCard)`
  padding: 24px;
  display: grid;
  gap: 20px;

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

const FieldStack = styled.div`
  display: grid;
  gap: 18px;
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

const SummaryTitle = styled.p`
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
