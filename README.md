# 401kcalc

Next.js 15 + TypeScript retirement planning site with a 401(k) calculator, guides, and benchmark content.

## Local development

```bash
npm run dev
```

## Analytics

This project uses [Plausible](https://plausible.io/) for privacy-friendly analytics. The site-specific tracking script is loaded directly — no environment variables are required.

Custom events tracked:
- `calculator_view`
- `calculator_input_change`
- `projection_updated`
- `retirement_marker_dragged`
- `target_spending_changed`
- `guide_view`
- `retirement_by_age_view`
- `methodology_view`

## Planning docs

- [Future Roadmap](./docs/planning/FUTURE_ROADMAP.md)
- [Growth And Monetization](./docs/planning/GROWTH_AND_MONETIZATION.md)
- [Guide Images](./docs/GUIDE_IMAGES.md)

## Launch checklist

See [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md).
