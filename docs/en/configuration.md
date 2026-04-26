# Configuration

> Site configuration and metadata features.

## Table of Contents

- [Analytics](#analytics)
- [SEO](#seo)
- [Archives](#archives)
- [Friend Links](#friend-links)
- [Donation](#donation)
- [Creative Commons](#creative-commons)

---

## Analytics

Integrate various analytics providers with Do Not Track (DNT) support.

### Configuration

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

### Usage

All providers are independent and can be used simultaneously. The custom endpoint respects DNT.
Set `sampleRate` to a value between 1 and 100 to enable sampling (e.g., 50 for 50%).

---

## SEO

Automatically generate OpenGraph and Twitter Card meta tags.

### Configuration

```toml
[params.seo]
  openGraph = true
  twitterCard = true
  twitterCardType = "summary_large_image"
```

### Usage

Enable OpenGraph and/or Twitter Card by setting the respective flags to true.
Choose the Twitter Card type (summary, summary_large_image, app, player).

---

## Archives

A timeline-style layout showing all posts grouped by date.

### Configuration

No special configuration required. Just add a menu entry for the archives page.

### Usage

Create a menu entry linking to `/archives/` to access the archives page.
The page automatically lists all posts grouped by year, month, and day.

---

## Friend Links

Create a dedicated page for friend links.

### Configuration

```toml
[[params.links]]
  name = "Example"
  url = "https://example.com"
  desc = "An example website"
```

### Usage

Add multiple `[[params.links]]` entries in your config. Each link will show the name, URL, and optional description.
The page is accessible at `/flinks/` by default.

---

## Donation

Display donation QR codes for WeChat Pay and Alipay at the bottom of post pages.

### Configuration

```toml
[params.donation]
  enable = false
  comment = "Support the author"
  wechatPay = "/images/wechatpay.png"
  alipay = "/images/alipay.png"
```

### Usage

Set `enable` to true and provide the image URLs for WeChat Pay and Alipay QR codes.
The section will appear at the bottom of each post page.

---

## Creative Commons

Display a Creative Commons license badge.

### Configuration

```toml
[params.creativeCommons]
  enable = false
  license = "by-nc-sa"
  size = "normal"
```

### Usage

Set `enable` to true. Choose a license from: by, by-sa, by-nc, by-nc-sa, by-nd, by-nc-nd.
Set `size` to either "normal" or "big".
