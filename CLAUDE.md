# Portfolio website — project notes

Stefanie Chan's UX design portfolio. Plain HTML / CSS / JS, no build step, no frameworks. Hosted on GitHub Pages.

This file is committed to a public repo, so it contains no personal data, contact details or private links.

## Site map

- `index.html` — homepage. One page with three states (Work, Play, About) switched by the URL hash: `#work`, `#play`, `#about`. Work is the default.
- Work tiles lead to **Case Study** pages (several, one per project): `case-study/koin.html` (built, on branch `case-study-koin`), `case-study/knit-people.html` (placeholder that redirects to `404.html`).
- Play tiles lead to **Showcase** pages (several): `showcase/sketches.html`, `showcase/small-talk.html`. Not built yet: each is a placeholder file that redirects to `404.html` (the "Page coming soon" design). Replace the placeholder file when the page is built, keeping the address.
- `404.html` — "Page coming soon". GitHub Pages serves it for any missing address, so any other missing address shows it too. The unbuilt pages above are placeholder files that redirect there, so they also work on servers that don't serve `404.html` (such as the local one below).

## Files

- `css/styles.css` — all homepage styles, tokens at the top (`:root`), motion section, mobile section last
- `css/404.css` — 404 page only (it also loads `styles.css` for tokens, fonts and footer)
- `css/case-study.css` — all case study pages (it also loads `styles.css` for `--u`, fonts and footer); tokens at the top, mobile section last
- `js/main.js` — state switching, opening animation timeline, scroll-down hint, email reveal
- `js/case-study.js` — case study divider behaviour: the logomark turns with scroll
- `assets/images/koin/`, `assets/icons/koin/` — images and divider/logo SVGs for the Koin page
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

## Case study design system (separate from the homepage one)

- Page `#FCF9F5`, cards white with 8px corners, text black `#000`, captions `#5E5E5E`, phase titles the homepage primary green `#2F9A67`, divider line the homepage divider colour `#A8D5BA`, callout paragraph the philosophy green `#1F6B45`. Same fonts as the homepage.
- Type: page title Lateef 80/70; card and label titles Lateef 28/40; narrative headings Mona Sans SemiBold 20/40; body 16/32 (card copy 16/28); captions Mona Sans regular 14/32 (no italics).
- Widths on the 1280 canvas: narrative 1002, section dividers 1150, card grids 1201 or 1062. Section gap 96, heading to body 24, grid gap 32, card padding 40.
- Footer: the shared green bar plus WORK / PLAY / ABOUT links back to the homepage states (`../index.html?skip-intro#work|play|about`), in `css/case-study.css`. Copyright 64 from the left; links turn `#444444` on hover; on mobile the links are 32px in one row spread across the width, with the copyright centred below. The footer links use `index.html?skip-intro&to=content#work|play|about`: `to=content` makes the homepage open scrolled to just below the divider line, so the chosen section is on screen (without it the page opens at the top, as for the logomark link).
- Tap to enlarge: the matrix, workshop board and the three testing images are links (`data-zoom`) that `js/case-study.js` opens in a full-screen `<dialog>` viewer (image at least 1400px wide, scroll or pinch to pan). Without JavaScript the link opens the image file.
- Back to top: a floating green circle (32px, 44px on mobile) bottom right, shown after one screen of scrolling and hidden near the footer; it is built in `js/case-study.js` and `css/case-study.css` and documented in the Figma guidelines ("Back to top").
- Figures are full-bleed white bands; keep each figure's own crop, caption position and offsets. A caption always sits above its image (collage images follow their caption, so they move down if it wraps).
- Card shadow is the guideline one, `0 4px 30px 10px rgba(0,0,0,.05)`, on every card and figure.
- Dividers are full-width `position: sticky` bars pinned at the top with a solid page-colour background, the same on desktop and mobile: horizontal green phase title, the divider line after it, and a small spinning logomark at the right (it replaces the Figma star; the line stops about 8px short of it). Everything else scrolls under the bar. The logomark rotation is in `js/case-study.js`.

## Conventions to keep

- **Routing:** hash-based on the homepage. Don't rely on server rewrites (GitHub Pages has none).
- **Linking home from other pages:** use `index.html?skip-intro#work` (relative path as needed, e.g. `../index.html?skip-intro#work`). That shows the finished homepage without replaying the opening hero animation; the Work / Play / About tiles and sections still fade in. The homepage also skips the opening automatically when the visitor arrives from another page of this site; a refresh replays it.
- **404 page paths:** it can be served at any depth, so a small script in its `<head>` sets `<base>` to the site root (or `/portfolio-website/` if hosted as a project site). Keep paths on that page relative to the root.
- **No email address in HTML.** The contact email is assembled in `js/main.js` when the mail icon is clicked, to keep scrapers from finding it. Keep it that way.
- **Opening animation timings:** the timeline is documented at the top of the "Opening sequence" block in `css/styles.css` and at `OPENING_HOLD` in `js/main.js`. Change both together.
- **Motion:** respect `prefers-reduced-motion`. Hover and focus states use the shared ease and green accent.
- **Images:** use WebP for photos and large images; give every `<img>` width/height and meaningful alt text.
- **Cache busting:** `index.html` and `404.html` link CSS/JS with `?v=N`; bump it when those files change (no build step).
- **Branches:** one feature branch per page (e.g. `homepage`, `case-study-koin`), merged into `main` after review. `main` is what GitHub Pages publishes.
