# Note Shortcode

Display styled note boxes with different types and optional titles.

## Configuration

No special configuration required. The shortcode is available by default.

## Usage

```markdown
{{</* note info "Title" */>}}
Content here
{{</* /note */>}}
```

Types: info, tip, success, warning, danger. Each type has a unique SVG icon.
The title is optional and defaults to the type name if not provided.

## Related

- [Shortcodes](../en/shortcodes.md)
- [Shortcode Quote](../en/shortcodes-quote.md)