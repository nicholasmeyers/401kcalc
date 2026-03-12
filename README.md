# 401kcalc

Next.js 15 + TypeScript retirement planning site with a 401(k) calculator, guides, and benchmark content.

## Local development

```bash
npm run dev
```

## Analytics configuration

This project uses Plausible event tracking when configured.

Required for production analytics:

```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=www.401kcalc.com
```

Optional for self-hosted Plausible:

```bash
NEXT_PUBLIC_PLAUSIBLE_API_HOST=https://plausible.yourdomain.com
```

Tracked launch events:
- `calculator_view`
- `calculator_input_change`
- `projection_updated`
- `retirement_marker_dragged`
- `target_spending_changed`
- `guide_view`
- `retirement_by_age_view`
- `methodology_view`

## Launch checklist

See [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md).
