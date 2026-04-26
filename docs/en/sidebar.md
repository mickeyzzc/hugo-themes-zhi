# Sidebar

Sidebar with avatar + social links. Only rendered when `params.features.sidebar = true`.

## Overview

This feature adds a sidebar to your site that can display your avatar, site information, social links, menu items, and on post pages, a table of contents and taxonomies. The sidebar can be positioned on the left or right side of the content.

## Configuration

```toml
[params.features]
  sidebar = true  # Default: true

[params.sidebar]
  position = "left"   # "left" | "right" (default: "left")
  width    = "256px"  # CSS value for sidebar width (default: "256px")

  # Social links in sidebar. Each entry requires name + url.
  # Optional: icon — theme has built-in icons for github, twitter/x,
  #           email, rss, linkedin, mastodon. Omit icon for text-only link.
  [[params.sidebar.socialLinks]]
    name = "GitHub"
    url  = "https://github.com/yourusername"
    icon = "github"

  [[params.sidebar.socialLinks]]
    name = "Email"
    url  = "mailto:you@example.com"
    icon = "email"
```

## Usage

This feature requires no special markup in content. It automatically:
- Displays the sidebar on all pages when enabled
- Shows avatar (from `params.avatar`) at the top
- Displays site title and description below avatar
- Renders social links from `params.sidebar.socialLinks`
- Shows menu items from `menus.main` below social links
- On post pages, also shows table of contents (if enabled) and categories/tags

## Related

- [Theme Switch](../en/theme-switch.md)
- [Greeting](../en/greeting.md)
- [Tag Cloud](../en/tag-cloud.md)
- [Table of Contents](../en/toc.md)