import { createGlobalStyle } from "styled-components";

import { darkColors, lightColors, theme } from "@/styles/theme";

function cssVarBlock(colors: Record<string, string>): string {
  return Object.entries(colors)
    .map(([key, value]) => `--c-${key}: ${value};`)
    .join("\n    ");
}

export const GlobalStyle = createGlobalStyle`
  :root {
    ${cssVarBlock(lightColors)}
    --surface-rgb: 255, 255, 255;
    --background-rgb: 247, 247, 247;
    color-scheme: light;
  }

  [data-theme="dark"] {
    ${cssVarBlock(darkColors)}
    --surface-rgb: 26, 26, 26;
    --background-rgb: 13, 13, 13;
    color-scheme: dark;
  }

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
    transition: background 200ms ease, color 200ms ease;
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

  .calculator-disclosure > summary {
    cursor: pointer;
    list-style: none;
  }

  .calculator-disclosure > summary::-webkit-details-marker {
    display: none;
  }

  .calculator-disclosure .calculator-disclosure-toggle--open {
    display: none;
  }

  .calculator-disclosure[open] .calculator-disclosure-toggle--closed {
    display: none;
  }

  .calculator-disclosure[open] .calculator-disclosure-toggle--open {
    display: inline;
  }
`;
