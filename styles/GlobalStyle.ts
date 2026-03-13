import { createGlobalStyle } from "styled-components";

import { theme } from "@/styles/theme";

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    overflow-x: clip;
  }

  body {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    font-family: var(--font-sans), "Avenir Next", "Segoe UI", sans-serif;
    line-height: 1.5;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  p {
    margin: 0;
    color: ${theme.colors.textSecondary};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    color: ${theme.colors.text};
    letter-spacing: -0.02em;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  main {
    display: block;
    flex: 1 0 auto;
  }

  footer {
    flex-shrink: 0;
  }

  ::selection {
    background: rgba(37, 99, 235, 0.18);
  }
`;
