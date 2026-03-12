import Link from "next/link";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { navigation, siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

export function Header() {
  return (
    <Wrapper>
      <Inner as="div">
        <Brand href="/">{siteConfig.name}</Brand>
        <NavWrap aria-label="Primary">
          <NavList>
            {navigation.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </NavList>
        </NavWrap>
      </Inner>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid ${theme.colors.border};
  background: rgba(247, 247, 247, 0.92);
  backdrop-filter: blur(8px);
`;

const Inner = styled(Container)`
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

const Brand = styled(Link)`
  font-size: 0.94rem;
  font-weight: 700;
  color: ${theme.colors.text};
  letter-spacing: -0.02em;
`;

const NavWrap = styled.nav`
  overflow-x: auto;
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 20px;
  color: ${theme.colors.textSecondary};
  font-size: 0.92rem;
  min-width: max-content;
`;

const NavLink = styled(Link)`
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.text};
  }
`;
