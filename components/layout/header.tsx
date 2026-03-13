"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { navigation, siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

export const HEADER_HEIGHT = 64;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const toggle = useCallback(() => setMenuOpen((o) => !o), []);

  return (
    <>
      <Wrapper>
        <Inner as="div">
          <Brand href="/" aria-label={siteConfig.name}>
            <Image src="/images/logo.png" alt={siteConfig.name} width={0} height={0} sizes="100vw" style={{ width: 'auto', height: 18 }} priority />
          </Brand>

          <DesktopNav aria-label="Primary">
            <NavList>
              {navigation.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    $active={pathname === item.href}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </NavList>
          </DesktopNav>

          <HamburgerButton
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={toggle}
          >
            <HamburgerIcon $open={menuOpen}>
              <span />
              <span />
              <span />
            </HamburgerIcon>
          </HamburgerButton>
        </Inner>
      </Wrapper>

      <MobileOverlay $open={menuOpen} onClick={() => setMenuOpen(false)} />
      <MobileDrawer $open={menuOpen} aria-label="Mobile navigation">
        {navigation.map((item) => (
          <MobileNavLink
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            $active={pathname === item.href}
          >
            {item.label}
          </MobileNavLink>
        ))}
      </MobileDrawer>
    </>
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
  min-height: ${HEADER_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

/* Desktop nav — hidden on mobile */
const DesktopNav = styled.nav`
  overflow-x: auto;

  @media (max-width: calc(${theme.breakpoints.md} - 1px)) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 20px;
  color: ${theme.colors.textSecondary};
  font-size: 0.92rem;
  min-width: max-content;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  transition: color 120ms ease;
  color: ${({ $active }) => ($active ? theme.colors.text : "inherit")};
  font-weight: ${({ $active }) => ($active ? 600 : "inherit")};

  &:hover {
    color: ${theme.colors.text};
  }
`;

/* Hamburger button — visible only on mobile */
const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  @media (min-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const HamburgerIcon = styled.div<{ $open: boolean }>`
  width: 20px;
  height: 14px;
  position: relative;

  span {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    border-radius: 1px;
    background: ${theme.colors.text};
    transition: transform 200ms ease, opacity 200ms ease;

    &:nth-child(1) {
      top: 0;
      ${({ $open }) => $open && "transform: translateY(6px) rotate(45deg);"}
    }

    &:nth-child(2) {
      top: 6px;
      ${({ $open }) => $open && "opacity: 0;"}
    }

    &:nth-child(3) {
      top: 12px;
      ${({ $open }) => $open && "transform: translateY(-6px) rotate(-45deg);"}
    }
  }
`;

/* Mobile overlay + drawer */
const MobileOverlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: ${HEADER_HEIGHT}px 0 0 0;
  z-index: 38;
  background: rgba(0, 0, 0, 0.25);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: opacity 220ms ease;

  @media (min-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileDrawer = styled.nav<{ $open: boolean }>`
  position: fixed;
  top: ${HEADER_HEIGHT}px;
  right: 0;
  z-index: 39;
  width: 260px;
  max-width: 80vw;
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  background: ${theme.colors.surface};
  border-left: 1px solid ${theme.colors.border};
  transform: translateX(${({ $open }) => ($open ? "0" : "100%")});
  transition: transform 260ms cubic-bezier(0.4, 0, 0.2, 1);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;

  @media (min-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)<{ $active: boolean }>`
  display: block;
  padding: 12px 4px;
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? 640 : 540)};
  color: ${({ $active }) => ($active ? theme.colors.text : theme.colors.textSecondary)};
  border-bottom: 1px solid ${theme.colors.border};
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.text};
  }
`;
