import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styled, { css } from "styled-components";

import { theme } from "@/styles/theme";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ children, variant = "primary", ...props }: ButtonLinkProps) {
  return (
    <StyledLink $variant={variant} {...props}>
      {children}
    </StyledLink>
  );
}

const StyledLink = styled(Link)<{ $variant: "primary" | "secondary" }>`
  height: 44px;
  border-radius: ${theme.radii.pill};
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-inline: 24px;
  font-size: 0.92rem;
  font-weight: 600;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;

  ${({ $variant }) =>
    $variant === "primary"
      ? css`
          border-color: ${theme.colors.accent};
          background: ${theme.colors.accent};
          color: #ffffff;

          &:hover {
            background: ${theme.colors.accentHover};
          }
        `
      : css`
          border-color: ${theme.colors.border};
          background: ${theme.colors.surface};
          color: ${theme.colors.text};

          &:hover {
            border-color: ${theme.colors.borderStrong};
          }
        `}
`;
