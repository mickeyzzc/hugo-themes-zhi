# MathJax

MathJax 3 for rendering LaTeX math expressions. Auto-loaded when `$...$` or `$$...$$` detected in page content.

## Overview

This feature automatically loads MathJax 3 when it detects LaTeX math expressions in your content (either inline `$...$` or display `$$...$$`). It enables beautiful mathematical typesetting without any special configuration.

## Configuration

```toml
[params.features]
  mathJax = true  # Default: true
```

## Usage

This feature requires no special markup in content. It automatically:
- Loads MathJax 3 when inline `$...$` or display `$$...$$` math is detected
- Supports both inline and display math modes
- Works with Hugo's Markdown rendering

Inline: `$E = mc^2$`

Display:
```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## Related

- [Theme Switch](../en/theme-switch.md)
- [Code Highlight](../en/code-highlight.md)