# Reading Progress

Thin progress bar showing reading progress through the article. Only appears on single/post pages.

## Overview

This feature adds a thin progress bar at the top or bottom of the page that shows the user's reading progress through the article. It updates dynamically as the user scrolls and only appears on single/post pages.

## Configuration

```toml
[params.features]
  readingProgress = true  # Default: true

[params.readingProgress]
  position = "top"        # "top" | "bottom" (default: "top")
  color    = ""           # CSS color. Empty = use --accent (default: "")
  height   = "3px"        # CSS value for bar height (default: "3px")
```

## Usage

This feature requires no special markup in content. It automatically:
- Shows a thin progress bar at the top or bottom of the page
- Updates as user scrolls through the article content
- Only appears on single/post pages (not home, list, or taxonomy pages)
- Uses CSS variable `--accent` for color when `color` is empty

## Related

- [Theme Switch](../en/theme-switch.md)
- [Sidebar](../en/sidebar.md)