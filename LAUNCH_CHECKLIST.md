# MVP Launch Checklist

## In-repo checks

- [x] Analytics integration added (Plausible script + event tracking hooks)
- [x] Metadata audited across key public routes
- [x] Structured data added or verified on key public routes
- [x] `sitemap.ts` includes homepage, calculator, guides, guide detail pages, retirement-by-age index/detail pages, methodology, and about
- [x] `robots.ts` includes sitemap and explicit crawl rules
- [x] Default social image endpoints added (`/opengraph-image`, `/twitter-image`)
- [x] Favicon/app icon assets added (`/icon.svg`, `/apple-icon`)
- [x] Production analytics env vars documented in `README.md`

## Pre-launch manual checks

- [ ] Plausible domain is configured and receiving events in production
- [ ] Google Search Console property is verified
- [ ] Submit `https://www.401kcalc.com/sitemap.xml` in Search Console
- [ ] Confirm production canonical URLs resolve correctly
- [ ] Validate rich results/schema with Google Rich Results Test
- [ ] Verify social previews for homepage, calculator, guide detail, and retirement-by-age detail pages
- [ ] Run Lighthouse on key pages and confirm acceptable performance scores
