# Guide Images

Each guide has a **custom hero image** used for:

- **In-article hero** – displayed at the top of the guide
- **Open Graph / Twitter** – social sharing previews
- **Article schema** – structured data for search

Guides without `imageUrl` fall back to a **dynamic OG image** (title, category, excerpt on a branded background).

## Current mapping

| Guide | Image |
|-------|-------|
| How Much Should I Have in My 401k at 30? | `sprout.png` |
| How Much Should I Have in My 401k at 40? | `chart.svg` |
| How Much Should I Have in My 401k at 50? | `make-plan.png` |
| How Much Should I Have in My 401k at 60? | `senior-beach.png` |
| Roth vs Traditional 401k: How to Choose | `vector-plan.png` |
| 401k Employer Match Explained | `dollars-stacks.png` |
| 401k Contribution Limits for 2026 | `close-up-100-dollar-bill.png` |
| How Much Should I Contribute to My 401k? | `hundos.png` |
| What to Do With Your 401k When You Leave a Job | `vector-plan.png` |
| Self-Employed 401k: Solo 401k vs SEP IRA | `savings.png` |
| Backdoor Roth IRA: How It Works | `vector-plan.png` |

## Image location and display

Images live in `public/images/guide-images/` as raster images (`.png`) or vector images (`.svg`). Hero images are displayed with:

- **Max height:** 400px (default), 500px at `lg` (1024px+)
- **Object fit:** cover (image fills the frame, may crop)
- **Object position:** optional per-guide focus point

To add or change a guide image:

1. Add the image file to `public/images/guide-images/`.
2. Set `imageUrl: "/images/guide-images/your-image.png"` or `imageUrl: "/images/guide-images/your-image.svg"` on the guide in `lib/guides/guides.ts`.
3. Optionally set `imagePosition` to focus the crop: `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"`, or `"center"` (default).

## Converting AVIF to PNG

If you add AVIF images, convert them with:

```bash
node scripts/convert-guide-images.mjs
```

Or install ffmpeg and run:

```bash
for f in public/images/guide-images/*.avif; do
  ffmpeg -i "$f" "${f%.avif}.png"
done
```
