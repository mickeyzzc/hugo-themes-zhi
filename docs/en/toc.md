# Table of Contents

Table of contents that appears in the sidebar on article pages (and categories on other pages). Only rendered when `params.features.toc = true` and the page has headings.

## Configuration

```toml
[params.features]
  toc = true  # Default: true

[params.toc]
  maxDepth  = 3   # Heading depth to include (1 = H1, 3 = H3) (default: 3)
  numbering = true  # Prepend counter to each heading in TOC (default: true)
  collapse  = true  # Collapse sub-levels (H3+) by default (default: true)
```

## Usage

This feature requires no special markup in content. It automatically:
- Generates a table of contents based on headings (H2-H4 by default) in the page content
- Appears in the sidebar on single/post pages when enabled
- On other pages (home, section, taxonomy), shows categories instead of TOC
- Supports auto-numbering of headings when `numbering = true`
- Can collapse sub-levels (H3 and below) when `collapse = true`