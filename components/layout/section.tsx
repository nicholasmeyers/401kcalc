import styled from "styled-components";

import { theme } from "@/styles/theme";

export const Section = styled.section`
  padding-block: ${theme.layout.sectionYMobile};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding-block: ${theme.layout.sectionYTablet};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    padding-block: ${theme.layout.sectionYDesktop};
  }
`;
