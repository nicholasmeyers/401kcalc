import Link from "next/link";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { navigation } from "@/lib/site";
import { theme } from "@/styles/theme";

const primaryFooterLinks = navigation.filter((item) => item.href !== "/about");
const trustLinks = [
  { label: "About", href: "/about" },
  { label: "Methodology", href: "/methodology" },
];

export function Footer() {
  return (
    <Wrapper>
      <Inner as="div">
        <Copy>
          <Title>401kcalc</Title>
          <Text>Structured tools and practical guidance for clearer retirement planning decisions.</Text>
        </Copy>
        <RightColumn>
          <LinkGrid>
            <LinkGroup>
              <GroupLabel>Explore</GroupLabel>
              <Nav aria-label="Footer primary links">
                {primaryFooterLinks.map((item) => (
                  <NavLink key={item.href} href={item.href}>
                    {item.label}
                  </NavLink>
                ))}
              </Nav>
            </LinkGroup>
            <LinkGroup>
              <GroupLabel>Trust</GroupLabel>
              <Nav aria-label="Footer trust links">
                {trustLinks.map((item) => (
                  <NavLink key={item.href} href={item.href}>
                    {item.label}
                  </NavLink>
                ))}
              </Nav>
            </LinkGroup>
          </LinkGrid>
          <Disclaimer>Calculator outputs are educational estimates and not financial, tax, or investment advice.</Disclaimer>
        </RightColumn>
      </Inner>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  border-top: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
`;

const Inner = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-block: 40px;

  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 40px;
  }
`;

const Copy = styled.div`
  max-width: 520px;
  display: grid;
  gap: 8px;
`;

const Title = styled.p`
  font-size: 0.94rem;
  font-weight: 700;
  color: ${theme.colors.text};
`;

const Text = styled.p`
  font-size: 0.92rem;
`;

const RightColumn = styled.div`
  display: grid;
  gap: 12px;
`;

const LinkGrid = styled.div`
  display: grid;
  gap: 18px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, auto));
    gap: 24px;
  }
`;

const LinkGroup = styled.div`
  display: grid;
  gap: 8px;
`;

const GroupLabel = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.mutedText};
`;

const Nav = styled.nav`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  color: ${theme.colors.textSecondary};
  font-size: 0.92rem;
`;

const NavLink = styled(Link)`
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.text};
  }
`;

const Disclaimer = styled.p`
  font-size: 0.78rem;
  color: ${theme.colors.mutedText};
  max-width: 420px;
  line-height: 1.55;
`;
