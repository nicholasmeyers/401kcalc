"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { useThemeMode } from "@/contexts/theme-context";
import { navigation, siteConfig } from "@/lib/site";
import { theme } from "@/styles/theme";

export const HEADER_HEIGHT = 64;

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useThemeMode();

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
            <Image
              src={resolvedTheme === "dark" ? "/images/logo-white.png" : "/images/logo.png"}
              alt={siteConfig.name}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 'auto', height: 18 }}
              priority
            />
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

          <RightControls>
            <ThemeToggleButton
              type="button"
              aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleTheme}
            >
              {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
            </ThemeToggleButton>

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
          </RightControls>
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
  background: ${theme.colors.backgroundTranslucent};
  backdrop-filter: blur(8px);
  transition: background 200ms ease, border-color 200ms ease;
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

const DesktopNav = styled.nav`
  margin-left: auto;
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

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const ThemeToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.surface};
  color: ${theme.colors.mutedTextStrong};
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease, background 150ms ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    color: ${theme.colors.text};
    border-color: ${theme.colors.borderStrong};
  }
`;

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
