# Website Analytics

Integrate various analytics providers with Do Not Track (DNT) support.

## Configuration

```toml
[params.features]
  analytics = false

[params.analytics]
  # Custom endpoint (uses sendBeacon)
  endpoint = ""
  # Cloudflare Web Analytics
  cloudflareToken = ""
  # Microsoft Clarity
  clarityProjectId = ""
  # Busuanzi page views
  busuanzi = false
  # Sampling rate (1-100)
  sampleRate = 100
```

## Usage

All providers are independent and can be used simultaneously. The custom endpoint respects DNT.
Set `sampleRate` to a value between 1 and 100 to enable sampling (e.g., 50 for 50%).

## Related

- [Theme Configuration](../en/theme-configuration.md)
- [Privacy Features](../en/privacy.md)