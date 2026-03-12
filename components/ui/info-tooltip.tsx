"use client";

import { useId, useState, type FocusEvent, type KeyboardEvent } from "react";
import styled from "styled-components";

import { theme } from "@/styles/theme";

type InfoTooltipProps = {
  content: string;
  ariaLabel?: string;
  className?: string;
};

export function InfoTooltip({ content, ariaLabel = "More information", className }: InfoTooltipProps) {
  const tooltipId = useId();
  const [isOpen, setIsOpen] = useState(false);

  const openTooltip = () => {
    setIsOpen(true);
  };

  const closeTooltip = () => {
    setIsOpen(false);
  };

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    const nextFocusedElement = event.relatedTarget as Node | null;

    if (!nextFocusedElement || !event.currentTarget.contains(nextFocusedElement)) {
      closeTooltip();
    }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeTooltip();
    }
  };

  return (
    <TooltipRoot className={className} onMouseEnter={openTooltip} onMouseLeave={closeTooltip} onBlur={handleBlur}>
      <TriggerButton
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-controls={tooltipId}
        onFocus={openTooltip}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        <Icon aria-hidden="true">i</Icon>
      </TriggerButton>
      <TooltipBubble id={tooltipId} role="tooltip" $open={isOpen}>
        {content}
      </TooltipBubble>
    </TooltipRoot>
  );
}

const TooltipRoot = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const TriggerButton = styled.button`
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1px solid ${theme.colors.borderStrong};
  background: ${theme.colors.surface};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.mutedTextStrong};
  padding: 0;
  cursor: help;
  transition: border-color 140ms ease, color 140ms ease, box-shadow 140ms ease;

  &:hover,
  &:focus-visible {
    border-color: ${theme.colors.elevatedBorderHover};
    color: ${theme.colors.text};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${theme.colors.focusRing};
  }
`;

const Icon = styled.span`
  font-size: 0.64rem;
  font-weight: 650;
  line-height: 1;
  transform: translateY(-0.3px);
`;

const TooltipBubble = styled.span<{ $open: boolean }>`
  position: absolute;
  z-index: 12;
  left: 50%;
  bottom: calc(100% + 8px);
  width: min(240px, 75vw);
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid ${theme.colors.elevatedBorder};
  background: rgba(255, 255, 255, 0.98);
  color: ${theme.colors.textSecondary};
  font-size: 0.74rem;
  line-height: 1.4;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translate(-50%, 4px);
  transition: opacity 140ms ease, transform 140ms ease, visibility 140ms ease;

  opacity: ${(props) => (props.$open ? 1 : 0)};
  visibility: ${(props) => (props.$open ? "visible" : "hidden")};
  transform: ${(props) => (props.$open ? "translate(-50%, 0)" : "translate(-50%, 4px)")};
`;

type ContextualInfoTooltipProps = {
  label: string;
  content?: string;
  className?: string;
};

export function ContextualInfoTooltip({ label, content, className }: ContextualInfoTooltipProps) {
  if (!content) {
    return null;
  }

  return <InfoTooltip className={className} content={content} ariaLabel={`${label}: explanation`} />;
}
