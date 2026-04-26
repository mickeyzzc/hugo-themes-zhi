# Video

Bilibili/YouTube video shortcode with automatic geo-switching (timezone-based) and manual toggle.

## Overview

This feature provides a video shortcode that embeds Bilibili or YouTube videos with automatic geo-switching based on the user's timezone (China → Bilibili, else → configured default). Users can manually switch platforms if enabled.

## Configuration

```toml
[params.video]
  defaultPlatform = "bilibili"   # "auto" | "bilibili" | "youtube" (default: "bilibili")
  showSwitch      = true         # Show platform toggle button in video player (default: true)
```

## Usage

Use the video shortcode in content:

```markdown
{{</* video bilibili="BV1xx" youtube="dQw4w9WgXcQ" title="Demo Video" */>}}
```

- When both `bilibili` and `youtube` IDs are provided:
  - Auto-selects based on timezone (China → Bilibili, else → `defaultPlatform`)
  - User can manually switch platforms if `showSwitch = true`
- When only one ID is provided, that platform is used
- Optional `title` parameter for video title

## Related

- [Theme Switch](../en/theme-switch.md)
- [Code Highlight](../en/code-highlight.md)