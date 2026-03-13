import Link from "next/link";
import styled from "styled-components";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/primitives";
import { theme } from "@/styles/theme";

export default function NotFoundPage() {
  return (
    <NotFoundSection>
      <Container>
        <Card>
          <Code>404</Code>
          <Title>Page not found</Title>
          <Copy>The page you requested does not exist or has moved to a different URL.</Copy>
          <Actions>
            <ButtonLink href="/">Go to homepage</ButtonLink>
            <GuideLink href="/guides">Browse guides</GuideLink>
          </Actions>
        </Card>
      </Container>
    </NotFoundSection>
  );
}

const NotFoundSection = styled(Section)`
  padding-top: 96px;
  padding-bottom: 120px;
`;

const Card = styled(SurfaceCard)`
  max-width: 620px;
  padding: 32px;
  display: grid;
  gap: 14px;
`;

const Code = styled.p`
  font-size: 0.74rem;
  font-weight: 700;
  color: ${theme.colors.mutedText};
  text-transform: uppercase;
  letter-spacing: 0.14em;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 640;
`;

const Copy = styled.p`
  font-size: 1rem;
  line-height: 1.65;
`;

const Actions = styled.div`
  margin-top: 2px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const GuideLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-size: 0.92rem;
  font-weight: 600;
  color: #374151;
  transition: color 120ms ease;

  &:hover {
    color: ${theme.colors.text};
  }
`;
