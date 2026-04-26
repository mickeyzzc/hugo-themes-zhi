# Footer

Customize the footer section with Beian, Gongan, copyright, and social links.

## Configuration

```toml
[params.footer]
  beian = ""
  gongan = ""
  poweredBy = true
  copyright = ""
  # Social links (same schema as sidebar)
  [[params.footer.socialLinks]]
    name = "GitHub"
    url = "https://github.com/username"
    icon = "github"
```

## Usage

Set `beian` for ICP license number (China), `gongan` for public security bureau registration (China).
Set `poweredBy` to false to hide the Hugo and theme credits.
Set `copyright` for custom copyright text.
The `socialLinks` array follows the same schema as the sidebar social links.
If `footer.socialLinks` is not set, it falls back to `params.social`.

## Related

- [Theme Configuration](../en/theme-configuration.md)
- [Social Links](../en/social.md)