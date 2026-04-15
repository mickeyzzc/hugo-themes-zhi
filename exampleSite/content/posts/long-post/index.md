---
title: "Long Content Test"
date: 2024-07-01
categories: ["test"]
tags: ["long", "toc", "test"]
description: "A long-form post to test table of contents, reading progress bar, and back-to-top button"
---

This is a long-form test post designed to exercise several theme features simultaneously: the table of contents (TOC) sidebar, the reading progress bar at the top of the page, and the floating back-to-top button. Each section below contains substantive content to ensure the page scrolls far enough to trigger all three features.

## Getting Started with Static Sites

Static site generators have transformed the way developers build and deploy websites. Unlike traditional content management systems that generate pages on every request, static site generators pre-build all pages at deploy time. This approach offers significant performance advantages because the server only needs to serve static files — no database queries, no server-side rendering, no runtime computation.

Hugo stands out among static site generators for its extraordinary build speed. Written in Go, Hugo can build thousands of pages in seconds. This performance matters not just for deployment pipelines but also for the developer experience: fast builds mean fast feedback loops during development, which leads to higher productivity.

The architecture of a Hugo site is straightforward. Content lives in Markdown files under the `content/` directory, organized into sections that map to URL paths. Templates in the `layouts/` directory define how content is rendered. Static assets go in the `static/` directory, and everything is configured through a single configuration file — typically `hugo.toml`, `hugo.yaml`, or `config.yaml`.

## Theme Architecture

A Hugo theme is a self-contained collection of templates, assets, and configuration defaults. Themes live in the `themes/` directory and can be installed via Git submodules, Go modules, or direct cloning. The theme system uses Hugo's template lookup order, which means user-provided templates always override theme templates of the same name and path.

The Zhi theme follows a modular architecture. CSS is organized into component files under `assets/css/components/`, each handling a specific feature: theme variables, header styling, code block rendering, video player layout, and more. JavaScript features are similarly isolated — each feature has its own script file that's loaded conditionally based on page content and configuration flags.

This separation of concerns makes the theme easy to understand, modify, and extend. Want to change how code blocks look? Edit `assets/css/components/code.css`. Need to modify the video player behavior? Look at `assets/js/video-geo-switch.js`. Each file has a single responsibility.

## CSS Custom Properties

CSS custom properties (also called CSS variables) are the foundation of the Zhi theme's theming system. Defined in `:root` for light mode and overridden in `[data-theme="dark"]` for dark mode, these variables control every color in the theme:

- `--bg` controls the background color
- `--text` controls the primary text color
- `--accent` controls links, buttons, and highlights
- `--code-bg` controls code block backgrounds
- `--border` controls border colors throughout

This approach means that changing the entire color scheme requires editing only a few variables rather than hunting through hundreds of CSS rules. It also enables the smooth dark/light toggle — when the user clicks the theme switch button, JavaScript sets the `data-theme` attribute on the document element, and all CSS variables update instantly.

The theme toggle persists the user's choice in `localStorage`, so returning visitors see their preferred theme immediately. When no preference is stored, the theme respects the operating system's preference via the `prefers-color-scheme` media query.

## JavaScript Loading Strategy

Performance is a core concern in the Zhi theme. Not every page needs every JavaScript feature, so the theme employs a conditional loading strategy:

MathJax loads only when the page content contains `$...$` or `$$...$$` patterns. This check happens at template render time, not at runtime — the Hugo template examines `.Content` for math delimiters and only includes the MathJax script tag when needed. Pages without math equations don't pay the cost of loading and initializing the MathJax library.

Similarly, Mermaid diagrams load only when fenced code blocks with the `mermaid` language identifier exist on the page. The Mermaid library is sizable, so this conditional loading can save hundreds of kilobytes on pages that don't use diagrams.

The code copy button script, however, loads on every page because code blocks can appear anywhere. The lightbox script also loads universally since any image might be clicked. These are small scripts whose overhead is negligible.

## Template Lookup Order

Hugo's template lookup order determines which template file is used to render a given page. Understanding this order is essential for theme customization because it explains where to place overriding templates.

For a single page, Hugo looks for templates in this order: `layouts/{section}/{layout}.html`, `layouts/{section}/single.html`, `layouts/_default/{layout}.html`, `layouts/_default/single.html`. If a theme is active, Hugo also checks the theme's `layouts/` directory after checking the project's `layouts/` directory.

This means that a user can override a specific theme template by creating a file at the same path in their project's `layouts/` directory. For example, to customize the single page template, create `layouts/_default/single.html` in the project root — it will take precedence over the theme's version.

List pages, taxonomy pages, and term pages follow similar lookup orders with their respective template names. The section template handles section list pages, the taxonomy template handles taxonomy overview pages, and the term template handles individual taxonomy term pages.

## Hugo Pipes Asset Processing

Hugo Pipes is Hugo's built-in asset processing pipeline. It handles CSS minification, JavaScript minification, fingerprinting (for cache busting), and even SCSS/SASS compilation when using Hugo Extended. The Zhi theme uses Hugo Pipes extensively:

CSS files are loaded with `resources.Get`, then minified and fingerprinted. Fingerprinting adds a content hash to the filename, which enables aggressive caching while ensuring that cached files are invalidated when content changes. The resulting URL looks like `main.a1b2c3d4.css`.

JavaScript files follow the same pattern: loaded with `resources.Get`, minified, fingerprinted, and served with a far-future cache header. The `defer` attribute on script tags ensures that JavaScript doesn't block page rendering.

The key advantage of Hugo Pipes over external build tools like webpack or Vite is zero configuration. There's no `webpack.config.js` to maintain, no plugin versions to reconcile, no build scripts to debug. Hugo handles everything natively, and the asset pipeline runs as part of the normal `hugo` build command.

## Responsive Design Patterns

The Zhi theme uses a mobile-first responsive design approach. The base CSS targets mobile screens, and media queries progressively enhance the layout for larger screens. The content area has a maximum width of 768px, which provides comfortable reading line lengths on desktop while remaining fully responsive on smaller screens.

On mobile devices, the sidebar collapses and becomes accessible via a toggle button. Navigation menus adapt to smaller screens with a hamburger menu pattern. Code blocks use horizontal scrolling rather than wrapping, which preserves code readability. Tables similarly scroll horizontally when their content exceeds the viewport width.

Typography scales are carefully chosen for readability. Body text uses a comfortable line height (1.6 for Latin text, 1.8 for CJK text), and font sizes follow a modular scale that creates visual hierarchy without overwhelming the reader. Heading sizes decrease proportionally from H2 through H4, creating a clear document structure.

## Search Implementation

Local search in the Zhi theme works without any server-side components. During the build, Hugo generates an XML index file containing the text content of all published pages. The search UI loads this index into the browser and performs client-side matching using JavaScript.

The search index uses Hugo's custom output format feature. The configuration defines a `SearchIndexes` output format with the `application/xml` media type, and the home page is configured to produce this format in addition to HTML and RSS. A corresponding template generates the XML structure.

When the user types in the search box, JavaScript filters the index in real time, matching against page titles and content. Results are displayed as a dropdown with page titles and excerpts. Clicking a result navigates to the page. This approach works entirely offline and requires no external search service.

## Code Highlighting

Syntax highlighting in Hugo is handled by Chroma, a fast syntax highlighter written in Go. Chroma supports hundreds of programming languages and comes with dozens of color themes. The Zhi theme uses the Monokai theme, which provides good contrast for both light and dark mode viewing.

Code blocks get additional features beyond basic highlighting. A language label appears in the top-left corner, identifying the programming language. A copy button in the top-right corner lets readers copy the entire code block to their clipboard with a single click. Line numbers can be enabled via Hugo configuration.

The code block render hook in `layouts/_default/_markup/render-codeblock.html` controls this enhanced rendering. Hugo calls this hook for every fenced code block in Markdown content, passing the code text, language identifier, and highlighting options. The hook wraps the highlighted code in a container div with the language label and copy button.

## Mermaid Diagram Theming

Mermaid diagrams adapt to the active theme (light or dark). When the theme toggle switches modes, Mermaid diagrams re-render with appropriate colors. This is achieved by passing theme configuration to Mermaid's initialization:

In light mode, Mermaid uses its `default` theme with a white background and dark text. In dark mode, it switches to the `dark` theme with a dark background and light text. The transition happens automatically when the user toggles the theme, and the diagrams maintain their structural integrity while adopting the new color scheme.

The Mermaid initialization script checks the current theme before rendering diagrams. If the theme changes after initial render, the script re-initializes Mermaid with the new theme configuration. This ensures that diagrams always match the surrounding content's visual style.

## Image Lightbox

The lightbox feature enhances the image viewing experience. When enabled, clicking any image in a post opens a full-screen overlay showing the image at its original resolution. The overlay includes a close button and responds to the Escape key and click-outside-to-close patterns.

The lightbox script scans the page for images within article content and attaches click event handlers. It creates the overlay dynamically, avoiding the need for additional HTML in every template. CSS animations provide smooth open and close transitions.

Performance is maintained through lazy initialization — the lightbox doesn't set up handlers until the page finishes loading. Images that are added dynamically (for example, by Mermaid rendering) are also handled through a MutationObserver that watches for new image elements.

## Back to Top Button

The back-to-top button appears as a floating element in the bottom-right corner of the viewport. It becomes visible after the user scrolls past a threshold (typically one viewport height) and smoothly scrolls the page back to the top when clicked.

The button can optionally display the current scroll percentage, giving readers a sense of how far they've progressed through the article. This percentage updates in real time as the user scrolls, providing continuous feedback about reading progress.

The animation uses the browser's native `scrollTo` method with `behavior: 'smooth'`, which provides a natural scrolling animation without requiring any JavaScript animation library. The button fades in and out using CSS transitions, maintaining visual polish.

## Reading Progress Bar

The reading progress bar provides a thin colored indicator at the top (or bottom, depending on configuration) of the viewport. It fills from left to right as the reader scrolls through the article, reaching 100% at the end of the content.

The bar's position is fixed relative to the viewport, so it remains visible even as the reader scrolls. Its width is calculated based on the scroll position relative to the total scrollable height of the article content. The calculation accounts for the viewport height, so the bar reaches 100% precisely when the reader reaches the bottom of the content.

The color of the progress bar can be customized via configuration. By default, it uses the theme's accent color, which provides visual consistency with links and other interactive elements. The height is configurable as a CSS value, defaulting to 3px — subtle enough to be unobtrusive but visible enough to be useful.

## Content Organization Best Practices

Organizing content effectively is crucial for a maintainable Hugo site. The Zhi theme supports several organizational patterns:

Section-based organization uses Hugo's content sections, where each subdirectory under `content/` becomes a section with its own list page. This is the most common pattern and works well for blogs with distinct categories. The theme's section template renders these list pages automatically.

Taxonomy-based organization uses Hugo's taxonomy system (categories and tags by default) to create cross-cutting content relationships. Readers can browse all posts in a category or with a specific tag, regardless of which section the posts live in. The theme provides templates for taxonomy overview pages and individual term pages.

Date-based archives are supported through the archives page template, which groups posts by year and month. This provides a chronological browsing experience that complements section and taxonomy navigation. The archive template sorts posts in reverse chronological order, with the most recent posts first.

## Future Considerations

The Zhi theme is designed to be a solid foundation that can be extended in many directions. Some areas for future development include:

Internationalization support through Hugo's i18n system would allow the theme to serve multilingual audiences. The `i18n/` directory already exists as a stub, ready for translation files to be added. Hugo's template functions like `i18n` and `Lang` make it straightforward to build multilingual templates.

Comment system integration could bring conversation to blog posts. The theme's modular architecture means that a comment partial could be added to `layouts/_partials/` and included in the single page template without modifying existing files. Services like Giscus (GitHub Discussions-based) or Utterances (GitHub Issues-based) are natural fits for a developer-oriented blog.

SEO enhancements like structured data (JSON-LD) could improve search engine visibility. Hugo's template system makes it easy to generate structured data from front matter and content, and the SEO section in the configuration already supports OpenGraph and Twitter Card meta tags.
