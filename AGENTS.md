# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-06
**Commit:** 651a9fa
**Branch:** main

## OVERVIEW

Hugo blog theme (Zhi) — pure Hugo + Hugo Pipes, no external build tools. Features: dark/light theme, MathJax, Mermaid diagrams, Bilibili/YouTube video shortcodes, image lightbox, code copy, custom analytics.

## STRUCTURE

```
.
├── layouts/              # Hugo templates (Go template language)
│   ├── _default/         # baseof.html (base), single.html, list.html, _markup/
│   ├── _partials/        # Hugo 0.120+ convention (ACTIVE)
│   ├── partials/         # Legacy partials (mathjax.html, mermaid.html only used here)
│   └── shortcodes/       # video.html (bilibili/youtube embed)
├── assets/               # Hugo Pipes source assets
│   ├── css/              # main.css → @import components/*.css
│   └── js/               # Individual feature scripts (no bundler)
├── content/              # Example site content (used for dev/testing)
├── archetypes/           # Content scaffolds (default.md, post.md)
├── static/               # Pass-through files (favicon.ico only)
├── i18n/                 # Empty — i18n not yet implemented
├── data/                 # Empty — no data files
├── tests/                # Playwright E2E tests (2 specs)
├── public/               # Hugo build output (gitignored)
└── hugo.toml             # Site config (NOT pure theme config — has baseURL, menus)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add a page layout | `layouts/_default/` | Must define `{{ define "main" }}` block |
| Add/modify a partial | `layouts/_partials/` | Hugo 0.120+ `_partials/` takes priority over `partials/` |
| Add a shortcode | `layouts/shortcodes/` | Access params via `.Get "name"` |
| Add CSS styling | `assets/css/components/` | Import new file in `assets/css/main.css` |
| Add JS feature | `assets/js/` | Must also add `<script>` in `layouts/_default/baseof.html` |
| Toggle features | `hugo.toml` → `[params.features]` | Feature flags: codeHighlight, mathJax, mermaid, themeSwitch, lightbox, analytics |
| Modify code block rendering | `layouts/_default/_markup/render-codeblock.html` | Hugo render hook |
| E2E testing | `tests/*.spec.ts` | Playwright, spawns `hugo server` per test file |
| Video embedding | `layouts/shortcodes/video.html` + `assets/js/video-geo-switch.js` | Default platform: bilibili, configurable per-shortcode |

## CONVENTIONS

- **Asset pipeline**: All CSS/JS processed via Hugo Pipes (`resources.Get` → `minify` → `fingerprint`). No webpack/rollup/vite.
- **CSS architecture**: `main.css` aggregates via `@import "components/X.css"`. Each component is self-contained with CSS variables.
- **Theme system**: CSS variables in `components/theme.css` — `:root` (light) and `[data-theme="dark"]` overrides. No CSS framework.
- **Feature flags**: Controlled via `site.Params.features.*` in `hugo.toml`. Templates check these before loading resources.
- **Conditional loading**: MathJax loads only if `$...$` or `$$...$$` detected in page content. Mermaid loads only if `code.language-mermaid` elements exist.
- **JS loading**: Scripts loaded in `baseof.html` via Hugo Pipes with `defer`. Some also loaded via `_partials/head/js.html` (dual path — see ANTI-PATTERNS).
- **Menu system**: Recursive nested menu via `inline/menu/walk.html` partial. Supports `aria-current` and active class.

## ANTI-PATTERNS (THIS PROJECT)

- **DO NOT** add files to `layouts/partials/` — use `layouts/_partials/` (Hugo 0.120+ convention). `partials/` is legacy and lower priority.
- **DO NOT** modify `hugo.toml` baseURL/title/menus as theme defaults — these are site-level config that should be overridden by the user's site.
- **header.html uses escaped Hugo syntax** (`{{ \`{{\` }}`) — this is likely a bug/leftover from code generation. The nav/menu does not render properly.
- **JS dual-loading risk**: `baseof.html` loads all JS via `resources.Get | minify | fingerprint`, AND `_partials/head/js.html` also processes `main.js` and `code-copy.js`. This causes duplicate script loading.
- **404.html is standalone** — does NOT inherit `baseof.html`. Any style changes to baseof won't affect the 404 page.

## COMMANDS

```bash
# Dev server
hugo server

# Production build
hugo --minify

# Run E2E tests (requires @playwright/test installed globally or via npx)
npx playwright test
```

## NOTES

- Hugo minimum version: **0.146.0** (non-extended is fine)
- `public/` contains build artifacts — do not edit directly
- No `theme.toml` — this theme lacks standard Hugo theme metadata
- `i18n/` and `data/` directories exist but are empty (stubs for future use)
- No CI/CD pipeline configured
- No linter/formatter configured (no ESLint, Stylelint, Prettier, EditorConfig)
