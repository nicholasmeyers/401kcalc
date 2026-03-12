import styled from "styled-components";

import { theme } from "@/styles/theme";

export const Container = styled.div`
  width: 100%;
  max-width: ${theme.layout.maxWidth};
  margin-inline: auto;
  padding-inline: ${theme.layout.containerXMobile};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding-inline: ${theme.layout.containerXTablet};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    padding-inline: ${theme.layout.containerXDesktop};
  }
`;
