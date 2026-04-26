# Typography

Customize fonts for heading, body, and code.

## Configuration

```toml
[params.typography]
  headingFont = ""
  bodyFont = ""
  codeFont = ""
  lineScale = 1.6
  cjkLineScale = 1.8
```

## Usage

Set the font variables to your desired font family (e.g., "Arial", "'Helvetica Neue'", etc.).
An empty string uses the system font stack.
Adjust `lineScale` and `cjkLineScale` for line height (default 1.6 for Latin, 1.8 for CJK).

## Related

- [Theme Configuration](../en/theme-configuration.md)