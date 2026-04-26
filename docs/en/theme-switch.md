# Theme Switch

Dark/light theme toggle with system preference detection and localStorage persistence. Automatically switches based on user's OS/browser theme preference and remembers the choice across sessions.

## Overview

This feature provides a toggle button in the header that allows users to switch between light and dark themes. It automatically detects the user's system preference and stores their choice in localStorage for persistence across sessions.

## Configuration

```toml
[params.features]
  themeSwitch = true  # Default: true

[params.theme]
  default = "auto"    # "auto" | "light" | "dark" (default: "auto")
```

## Usage

This feature requires no special markup in content. It automatically:
- Detects system preference via `window.matchMedia('(prefers-color-scheme: dark)')`
- Toggles theme when user clicks the switch button in header
- Persists choice in localStorage
- Falls back to `params.theme.default` when no preference detected

## Related

- [Reading Progress](../en/reading-progress.md)
- [Back to Top](../en/back-to-top.md)