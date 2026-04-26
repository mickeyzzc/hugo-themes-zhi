# Friend Links

Create a dedicated page for friend links.

## Configuration

```toml
[[params.links]]
  name = "Example"
  url = "https://example.com"
  desc = "An example website"
```

## Usage

Add multiple `[[params.links]]` entries in your config. Each link will show the name, URL, and optional description.
The page is accessible at `/flinks/` by default.

## Related

- [Theme Configuration](../en/theme-configuration.md)
- [Menus](../en/menus.md)