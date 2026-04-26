# Tag Cloud

Sidebar tag cloud displaying tags in varying sizes based on frequency. Only works when sidebar is enabled.

## Overview

This feature adds a tag cloud to the sidebar that displays all tags used across your site, with font sizes varying based on tag frequency. More frequently used tags appear larger, providing a visual representation of your content's topics.

## Configuration

```toml
[params.features]
  tagCloud = true  # Default: true
```

## Usage

This feature requires no special markup in content. It automatically:
- Displays a tag cloud in the sidebar (below categories and table of contents)
- Shows all tags used across the site
- Font size of each tag corresponds to its usage frequency
- Only appears when the sidebar feature is enabled

## Related

- [Sidebar](../en/sidebar.md)
- [Greeting](../en/greeting.md)