# AGENTS.md — Hugo Theme Zhi

## What This Is

Hugo blog theme (Zhi). Pure Hugo + Hugo Pipes — no webpack, rollup, vite, or npm build step. Features: dark/light theme, MathJax, Mermaid, Bilibili/YouTube video shortcodes, image lightbox, code copy, sidebar, search, TOC, reading progress, back-to-top, busuanzi, donation, friend links, CC license, archives.

Hugo ≥ **0.146.0** (non-extended is fine).

## Commands

```bash
hugo server                  # Dev server with live reload
hugo --minify                # Production build
npx playwright test          # E2E tests (see Tests caveat below)
```

## Structure

```
layouts/
├── _default/           # baseof.html, single.html, list.html, 404.html, _markup/
├── _partials/          # ALL partials live here (Hugo 0.120+ convention)
│   ├── head/           # css.html, seo.html, favicons.html, analytics.html
│   ├── post/           # card.html, meta.html, footer.html, cc-license.html
│   └── inline/menu/    # walk.html — recursive menu builder
├── shortcodes/         # video.html, note.html, quote.html
├── archives/           # list.html
├── flinks/             # single.html (friend links page)
├── home.html, section.html, taxonomy.html, term.html

assets/
├── css/
│   ├── main.css        # Aggregator — @import "components/X.css"
│   └── components/     # 24 per-feature CSS modules (theme.css has CSS vars)
└── js/                 # 12 individual scripts, no bundler
    ├── main.js         # Orchestrator: MathJax + Mermaid lazy-load (themeVars: lines 10-51, initMermaid: lines 53-102)
    ├── theme-toggle.js, code-copy.js, lightbox.js
    ├── video-geo-switch.js, sidebar.js, search.js, toc.js
    ├── reading-progress.js, back-to-top.js, donation.js, analytics.js

i18n/                   # en.toml, zh.toml — translations via {{ i18n "key" }}
exampleSite/            # Self-contained demo site with full config schema
```

## Key Architecture

- **Asset pipeline**: CSS via `css.Build` (source maps in dev, fingerprint in prod). JS via `resources.Get | minify | fingerprint`. No external build tools.
- **Feature flags**: `site.Params.features.*` toggles which JS/CSS/partial components load. The `features.html` partial serializes these as JSON into `<body data-features='...'>`; JS reads this to conditionally initialize (MathJax, Mermaid, etc.).
- **CSS theme system**: CSS variables in `components/theme.css` — `:root` (light) and `[data-theme="dark"]` overrides. FOUC prevention via inline `<script>` in `head.html`.
- **Conditional loading**: MathJax only if `$...$`/`$$...$$` detected. Mermaid only if `code.language-mermaid` elements exist (uses `base` theme + custom themeVariables for dark/light).
- **CSS layout**: body max-width `1200px`, sidebar via `params.sidebar`.

## Feature Flags

Controlled via `hugo.toml` → `[params.features]`. All default to `true` except `analytics`.

| Flag | Controls |
|------|----------|
| `codeHighlight` | Hugo Chroma syntax highlighting |
| `themeSwitch` | Dark/light toggle button |
| `mathJax` | MathJax 3 lazy-load |
| `mermaid` | Mermaid diagram lazy-load (uses `base` theme + custom themeVariables for dark/light, CSS only for layout)
| `lightbox` | Click-to-zoom images |
| `search` | Local search (XML index + search.js) |
| `sidebar` | Sidebar with avatar + social links |
| `toc` | Table of contents on post pages |
| `readingProgress` | Thin progress bar |
| `backToTop` | Floating scroll-to-top button |
| `analytics` | Custom analytics endpoint |

Additional toggles outside `features`: `params.donation.enable`, `params.analytics.busuanzi`, `params.creativeCommons.enable`.

## Where to Look

| Task | Location | Notes |
|------|----------|-------|
| Add page layout | `layouts/_default/` | Must define `{{ define "main" }}` block |
| Add/modify partial | `layouts/_partials/` | ONLY location for partials |
| Add shortcode | `layouts/shortcodes/` | Access params via `.Get "name"` |
| Add CSS | `assets/css/components/` | Must add `@import` in `assets/css/main.css` |
| Add JS | `assets/js/` | Must add `<script>` in `layouts/_default/baseof.html` |
| Toggle features | `hugo.toml` → `[params.features]` | Also update `features.html` partial if adding new flags |
| Code block rendering | `layouts/_default/_markup/render-codeblock.html` | Hugo render hook |
| Video embedding | `layouts/shortcodes/video.html` + `assets/js/video-geo-switch.js` | Default platform: bilibili |
| Translations | `i18n/en.toml`, `i18n/zh.toml` | Use `{{ i18n "key" }}` in templates |
| Full config schema | `exampleSite/hugo.toml` | Documented reference with all params |

## Conventions

- **Partials**: ALWAYS use `layouts/_partials/`. The `layouts/partials/` directory no longer exists.
- **Adding a new feature flag**: Must update THREE places: (1) `hugo.toml [params.features]`, (2) `features.html` partial to include it in the JSON map, (3) `baseof.html` to conditionally load the JS.
- **Adding CSS**: Create `components/X.css`, add `@import "components/X.css"` in `main.css` (order matters for cascade).
- **Adding JS**: Create `assets/js/X.js`, add Hugo Pipes block + `<script>` in `baseof.html` (with feature flag guard if applicable).
- **Config schema reference**: `exampleSite/hugo.toml` is the documented schema with 17 sections — consult it before adding params.

## Tests

Playwright E2E tests in `tests/`. **Caveat**: `video.spec.ts` has a hardcoded Mac path (`/Users/mickey/...`). Tests won't run on other machines without updating that path. `footer.spec.ts` may have similar issues.

## Gotchas

- **`hugo.toml` is a site config, not a theme config**: It has `baseURL`, menus, and content settings. When used as a theme module, the user's site config overrides everything. Do not modify `baseURL`/`title`/menus as theme defaults.
- **`exampleSite/` has its own `hugo.toml`**: That's the comprehensive reference config (282 lines). The root `hugo.toml` is a simpler working config.
- **No linter/formatter configured**: No ESLint, Stylelint, Prettier, or EditorConfig.
- **No CI/CD pipeline**.
- **No `theme.toml`**: This theme lacks standard Hugo theme metadata.
