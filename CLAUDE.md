# Portfolio website — project notes

Stefanie Chan's UX design portfolio. Plain HTML / CSS / JS, no build step, no frameworks. Hosted on GitHub Pages.

This file is committed to a public repo, so it contains no personal data, contact details or private links.

## Site map

- `index.html` — homepage. One page with three states (Work, Play, About) switched by the URL hash: `#work`, `#play`, `#about`. Work is the default.
- Work tiles lead to **Case Study** pages (several, one per project): `case-study/koin.html`, `case-study/knit-people.html`. Not built yet.
- Play tiles lead to **Showcase** pages (several): `showcase/sketches.html`, `showcase/small-talk.html`. Not built yet.
- `404.html` — "Page coming soon". GitHub Pages serves it for any missing address, so unbuilt pages above show it.

## Files

- `css/styles.css` — all homepage styles, tokens at the top (`:root`), motion section, mobile section last
- `css/404.css` — 404 page only (it also loads `styles.css` for tokens, fonts and footer)
- `js/main.js` — state switching, opening animation timeline, scroll-down hint, email reveal
- `assets/fonts/` self-hosted woff2 (Lateef 300/400, Mona Sans variable), `assets/icons/` SVGs, `assets/images/` WebP/PNG
- `assets/originals/` — full-size source images; kept out of git on purpose

## Run locally

```bash
python3 -m http.server 8000     # then open http://localhost:8000/index.html
```

That server shows a plain "File not found" for missing pages. To see `404.html` the way GitHub Pages serves it, use a server that returns `404.html` (with status 404) for missing paths.

## Design system (from the Figma visual ID guidelines)

- Desktop baseline is 1280px. `--u` scales desktop measurements between 900px and 1280px. Below 900px the mobile layout applies.
- Colours: page `#FCFFF7`, primary green `#2F9A67`, body black `#0D0D0D`, philosophy green `#1F6B45`, section headings `#444444`, inactive nav `rgba(67,67,67,.5)`, borders `#A8D5BA`. Work image panels: primary green at 15%. Philosophy cards: `#E2F0E8` at 40%.
- Fonts: Lateef for display (greeting, nav, headings, project titles), Mona Sans for body text. Bookman JF was tried and rejected.
- Image tiles: 395 × 353, 32px corners, shadow `0 4px 30px 10px rgba(0,0,0,.05)`. Second tile sits 40px lower.
- One shared left rail at x71 and content area x384–1190.

## Conventions to keep

- **Routing:** hash-based on the homepage. Don't rely on server rewrites (GitHub Pages has none).
- **Linking home from other pages:** use `index.html?skip-intro#work` (relative path as needed, e.g. `../index.html?skip-intro#work`). That shows the finished homepage without replaying the opening animation. The homepage also skips the opening automatically when the visitor arrives from another page of this site; a refresh replays it.
- **404 page paths:** it can be served at any depth, so a small script in its `<head>` sets `<base>` to the site root (or `/portfolio-website/` if hosted as a project site). Keep paths on that page relative to the root.
- **No email address in HTML.** The contact email is assembled in `js/main.js` when the mail icon is clicked, to keep scrapers from finding it. Keep it that way.
- **Opening animation timings:** the timeline is documented at the top of the "Opening sequence" block in `css/styles.css` and at `OPENING_HOLD` in `js/main.js`. Change both together.
- **Motion:** respect `prefers-reduced-motion`. Hover and focus states use the shared ease and green accent.
- **Images:** use WebP for photos and large images; give every `<img>` width/height and meaningful alt text.
- **Cache busting:** `index.html` and `404.html` link CSS/JS with `?v=N`; bump it when those files change (no build step).
- **Branches:** one feature branch per page (e.g. `homepage`, `case-study-koin`), merged into `main` after review. `main` is what GitHub Pages publishes.
