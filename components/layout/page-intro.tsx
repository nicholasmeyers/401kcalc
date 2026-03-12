import type { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "@/styles/theme";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageIntro({ eyebrow, title, description, children }: PageIntroProps) {
  return (
    <Wrapper>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Title>{title}</Title>
      <Description>{description}</Description>
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 780px;
  display: grid;
  gap: 14px;
`;

const Eyebrow = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  color: ${theme.colors.mutedText};
  text-transform: uppercase;
  letter-spacing: 0.16em;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 650;
  line-height: 1.12;
  text-wrap: balance;
`;

const Description = styled.p`
  color: ${theme.colors.mutedTextStrong};
  font-size: clamp(1rem, 2vw, 1.125rem);
`;
