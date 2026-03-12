import styled from "styled-components";

import { theme } from "@/styles/theme";

export const SurfaceCard = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  background: ${theme.colors.surface};
`;

export const SectionTitle = styled.h2`
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  font-weight: 600;
  line-height: 1.2;
`;

export const SectionSubtitle = styled.p`
  max-width: 40rem;
  margin-top: 0.75rem;
  font-size: 1rem;
`;
