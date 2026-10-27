# QA checklist

## Checks completed
- Node.js syntax validation passed for `script.js`.
- CSS tokens completely consolidated to `--lilac`, `--lilac-bright`, `--lilac-soft`, and `--lilac-dim`. No legacy red or cream literals remain.
- Jiyaa's authentic portrait (`assets/jiyaa-portrait.jpg`) installed in the hero frame with custom bicubic crop and balanced framing. Placeholder warning removed.
- All 15 local images, thumbnails, and SVG references resolve on disk and return HTTP 200 OK on live server `http://localhost:8080`.
- All 17 element IDs are unique and each internal hash link has a valid target.
- All 8 writing archive rows are populated with real published articles, original blog thumbnails, and verified live URLs (Newz24India & Medium).
- Featured story connects directly to the published article on Newz24India, with dialog preview accessible.
- Headless Chromium rendering confirmed at 320, 375, 390, 768, 1024, and 1440 CSS pixels with zero horizontal overflow.
- Mobile navigation menu, keyboard focus, and native dialog modal verified.
- Responsive snapshots generated across 5 viewport configurations.
- `prefers-reduced-motion` styles and visible focus outlines verified.

## Ready for launch
- The website is completely functional, responsive, and running locally at `http://localhost:8080`.
- Port 3000 left undisturbed.
- Complete delivery package updated at `jiyaa-portfolio-complete.zip` (1.3 MB).
