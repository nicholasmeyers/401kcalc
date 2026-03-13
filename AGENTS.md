# AGENTS.md

## JSX Text

Use `&apos;` instead of literal apostrophes (`'`) in JSX text content. The ESLint rule `react/no-unescaped-entities` will fail the build otherwise.

```tsx
// bad
<p>Here's a tip</p>

// good
<p>Here&apos;s a tip</p>
```

## Styling

This project uses **styled-components** (not Tailwind). All styled components should use the shared theme from `styles/theme.ts` via the `ThemeProvider`. Do not introduce Tailwind or inline style objects.

## Framework

- Next.js 15 with the **App Router** (`app/` directory). Do not create pages in a `pages/` directory.
- React 19.
- TypeScript in strict mode.

## Testing

Tests use **Vitest** and live alongside source files in `lib/` as `*.test.ts` files.
