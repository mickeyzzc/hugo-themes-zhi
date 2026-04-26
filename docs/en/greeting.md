# Greeting

Sidebar greeting message that changes based on time of day (morning/noon/afternoon/evening). Only works when sidebar is enabled.

## Overview

This feature displays a time-based greeting in the sidebar (below the avatar) that changes according to the user's local time. It shows different greetings for morning, noon, afternoon, and evening, sourced from the theme's internationalization files.

## Configuration

This feature is tied to the sidebar feature. No additional configuration is required beyond enabling the sidebar.

```toml
[params.features]
  sidebar = true  # Must be true for greeting to appear
```

The greeting text is sourced from the theme's i18n files (en.toml):
- goodMorning
- goodNoon
- goodAfternoon
- goodEvening

## Usage

This feature requires no special markup in content. It automatically:
- Displays a time-based greeting in the sidebar (below the avatar)
- Uses the user's local time to determine the greeting:
  - Morning: 5:00 AM - 11:59 AM
  - Noon: 12:00 PM - 12:59 PM
  - Afternoon: 1:00 PM - 5:59 PM
  - Evening: 6:00 PM - 4:59 AM
- Loaded via `greeting.js` when the sidebar is enabled

## Related

- [Sidebar](../en/sidebar.md)
- [Tag Cloud](../en/tag-cloud.md)