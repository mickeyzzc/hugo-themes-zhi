# Code Highlight

Syntax highlighting via Hugo's built-in Chroma with copy button and language label. Uses Monokai style by default.

## Overview

This feature provides syntax highlighting for code blocks using Hugo's built-in Chroma highlighter. It includes a copy button and language label for each code block.

## Configuration

```toml
[params.features]
  codeHighlight = true  # Default: true

[markup.highlight]
  codeFences       = true
  noClasses        = false
  lineNumbersInTable = true
  style            = "monokai"
  tabWidth         = 2
```

## Usage

This feature requires no special markup in content. All fenced code blocks automatically get:
- Language label (top-left)
- Copy button (top-right)
- Hugo Chroma syntax highlighting

```markdown
```python
def hello():
    print("Hello, World!")
```
```

## Related

- [Theme Switch](../en/theme-switch.md)
- [Reading Progress](../en/reading-progress.md)