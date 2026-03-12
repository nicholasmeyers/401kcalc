"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import styled, { css } from "styled-components";

import type { CalculatorFieldConfig } from "@/components/calculator/field-config";
import { ContextualInfoTooltip } from "@/components/ui/info-tooltip";
import {
  formatMoneyInputWithCursor,
  isAllowedMoneyInputCharacter,
  parseLooseNumber,
} from "@/lib/calculator/input";
import type { InputField } from "@/lib/calculator/types";
import { theme } from "@/styles/theme";

type CalculatorFieldProps = {
  config: CalculatorFieldConfig;
  value: string;
  error?: string;
  note?: string;
  onValueChange: (field: InputField, nextValue: string) => void;
};

const currencyInputPattern = "[0-9.,]*";
const percentInputPattern = "[0-9.,%\\s-]*";
const ageInputPattern = "[0-9]*";

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(value, max));

export function CalculatorField({ config, value, error, note, onValueChange }: CalculatorFieldProps) {
  const id = `calculator-field-${config.field}`;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const noteId = `${id}-note`;
  const hasError = Boolean(error);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextSelectionRef = useRef<number | null>(null);
  const sliderValue = useMemo(() => {
    if (!config.slider) {
      return null;
    }

    const parsedValue = parseLooseNumber(value);

    if (parsedValue === null) {
      return config.slider.min;
    }

    return clamp(parsedValue, config.slider.min, config.slider.max);
  }, [config.slider, value]);
  const describedBy = [descriptionId, note ? noteId : null, hasError ? errorId : null].filter(Boolean).join(" ");

  useLayoutEffect(() => {
    if (nextSelectionRef.current === null || !inputRef.current || document.activeElement !== inputRef.current) {
      return;
    }

    const nextSelection = Math.max(0, Math.min(nextSelectionRef.current, value.length));
    inputRef.current.setSelectionRange(nextSelection, nextSelection);
    nextSelectionRef.current = null;
  }, [value]);

  return (
    <Field>
      <LabelRow>
        <Label id={labelId} htmlFor={id}>
          {config.label}
        </Label>
        <ContextualInfoTooltip label={config.label} content={config.tooltip} />
      </LabelRow>
      <Description id={descriptionId}>{config.description}</Description>
      <InputShell $hasError={hasError}>
        {config.kind === "currency" ? <Adornment>$</Adornment> : null}
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={handleInputChange}
          onBeforeInput={handleBeforeInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          inputMode={config.kind === "age" ? "numeric" : "decimal"}
          pattern={
            config.kind === "currency"
              ? currencyInputPattern
              : config.kind === "percent"
                ? percentInputPattern
                : ageInputPattern
          }
          aria-invalid={hasError}
          aria-describedby={describedBy}
          $hasLeadingAdornment={config.kind === "currency"}
        />
        {config.kind === "percent" ? <Adornment>%</Adornment> : null}
      </InputShell>
      {config.slider && sliderValue !== null ? (
        <SliderShell>
          <Slider
            type="range"
            min={config.slider.min}
            max={config.slider.max}
            step={config.slider.step}
            value={sliderValue}
            aria-labelledby={labelId}
            aria-describedby={describedBy}
            onChange={(event) => onValueChange(config.field, event.target.value)}
          />
          <SliderScale>
            <span>{config.slider.min}%</span>
            <span>{config.slider.max}%</span>
          </SliderScale>
        </SliderShell>
      ) : null}
      {note ? <NoteText id={noteId}>{note}</NoteText> : null}
      {hasError ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </Field>
  );

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (config.kind !== "currency") {
      onValueChange(config.field, event.target.value);
      return;
    }

    const rawValue = event.target.value;
    const selectionStart = event.target.selectionStart ?? rawValue.length;
    const formatted = formatMoneyInputWithCursor(rawValue, selectionStart);

    nextSelectionRef.current = formatted.nextCursor;
    onValueChange(config.field, formatted.nextValue);
  }

  function handleBeforeInput(event: FormEvent<HTMLInputElement>) {
    if (config.kind !== "currency") {
      return;
    }

    const nativeEvent = event.nativeEvent as InputEvent;
    const insertedText = nativeEvent.data;

    if (!insertedText) {
      return;
    }

    for (const character of insertedText) {
      if (!isAllowedMoneyInputCharacter(character)) {
        event.preventDefault();
        return;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (config.kind !== "currency" || event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) {
      return;
    }

    if (!isAllowedMoneyInputCharacter(event.key)) {
      event.preventDefault();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    if (config.kind !== "currency") {
      return;
    }

    const pastedText = event.clipboardData.getData("text");

    if (!pastedText) {
      return;
    }

    event.preventDefault();

    const input = event.currentTarget;
    const selectionStart = input.selectionStart ?? input.value.length;
    const selectionEnd = input.selectionEnd ?? selectionStart;
    const nextRawValue = `${input.value.slice(0, selectionStart)}${pastedText}${input.value.slice(selectionEnd)}`;
    const formatted = formatMoneyInputWithCursor(nextRawValue, selectionStart + pastedText.length);

    nextSelectionRef.current = formatted.nextCursor;
    onValueChange(config.field, formatted.nextValue);
  }
}

const Field = styled.div`
  display: grid;
  gap: 8px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.76rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  color: ${theme.colors.mutedTextStrong};
  text-transform: uppercase;
`;

const Description = styled.p`
  font-size: 0.82rem;
  color: ${theme.colors.mutedText};
`;

const InputShell = styled.div<{ $hasError: boolean }>`
  display: flex;
  align-items: center;
  min-height: 56px;
  padding-inline: 14px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.surface};
  transition: border-color 140ms ease, box-shadow 140ms ease;

  ${(props) =>
    props.$hasError
      ? css`
          border-color: #dc2626;
        `
      : null}

  &:focus-within {
    border-color: ${theme.colors.borderStrong};
    box-shadow: 0 0 0 3px ${theme.colors.focusRing};
  }
`;

const Adornment = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.mutedTextStrong};
`;

const Input = styled.input<{ $hasLeadingAdornment: boolean }>`
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1.02rem;
  font-weight: 580;
  color: ${theme.colors.text};
  padding-left: ${(props) => (props.$hasLeadingAdornment ? "6px" : "0")};

  &::placeholder {
    color: ${theme.colors.mutedText};
  }
`;

const SliderShell = styled.div`
  display: grid;
  gap: 5px;
  padding-inline: 2px;
`;

const Slider = styled.input`
  width: 100%;
  height: 24px;
  margin: 0;
  accent-color: ${theme.colors.text};
  touch-action: pan-y;
`;

const SliderScale = styled.p`
  display: flex;
  justify-content: space-between;
  font-size: 0.74rem;
  color: ${theme.colors.mutedText};
`;

const NoteText = styled.p`
  font-size: 0.8rem;
  line-height: 1.45;
  color: ${theme.colors.mutedTextStrong};
`;

const ErrorText = styled.p`
  font-size: 0.8rem;
  color: ${theme.colors.dangerText};
`;
