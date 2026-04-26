# Lightbox

Image lightbox overlay. Click any article image to view full-size overlay with dimmed background.

## Overview

This feature adds a lightbox overlay to all images in article content. When users click on an image, it displays the full-size image in an overlay with a dimmed background, providing an enhanced viewing experience for images.

## Configuration

```toml
[params.features]
  lightbox = true  # Default: true
```

## Usage

This feature requires no special markup in content. It automatically:
- Applies to all images in article content (Markdown or HTML)
- Shows full-size image in overlay when clicked
- Supports keyboard navigation (arrow keys) and ESC to close
- Works with responsive images

![Example image](/posts/example/images/example.jpg)

## Related

- [Theme Switch](../en/theme-switch.md)
- [Code Highlight](../en/code-highlight.md)