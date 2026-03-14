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
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease,
    box-shadow 150ms ease, transform 150ms ease;

  ${({ $variant }) =>
    $variant === "primary"
      ? css`
          border-color: ${theme.colors.accent};
          background: ${theme.colors.accent};
          color: #ffffff;
          box-shadow: 0 1px 3px rgba(37, 99, 235, 0.25);

          &:hover {
            background: ${theme.colors.accentHover};
            box-shadow: 0 3px 8px rgba(37, 99, 235, 0.3);
            transform: translateY(-1px);
          }
        `
      : css`
          border-color: ${theme.colors.borderStrong};
          background: ${theme.colors.surface};
          color: ${theme.colors.text};
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

          &:hover {
            border-color: #B0B0B0;
            background: #F5F5F5;
          }
        `}
`;
