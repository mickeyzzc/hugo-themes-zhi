# Configuration

> Site configuration and metadata features.

## Table of Contents

- [Analytics](#analytics)
- [SEO](#seo)
- [Archives](#archives)
- [Friend Links](#friend-links)
- [Donation](#donation)
- [Creative Commons](#creative-commons)
- [Multilingual / i18n](#multilingual--i18n)
- [Series Taxonomy](#series-taxonomy)

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

---

## Multilingual / i18n

Standard Hugo multilingual configuration with automatic language switcher rendering.

### Configuration

```toml
defaultContentLanguage = "zh-cn"

[languages.en]
  languageName = "English"
  weight = 10

[languages.zh-cn]
  languageName = "简体中文"
  weight = 20
```

### Usage

Configure multiple languages in hugo.toml. The language switcher automatically renders when 2+ languages are configured:
- Each language needs its own i18n file (theme provides en.toml and zh-cn.toml)
- Follow bilingual content convention: post.md (default lang) + post.en.md (English)
- Use language-specific series names for proper taxonomy

---

## Series Taxonomy

Configuration for series taxonomy with weight-based ordering and bilingual naming support.

### Configuration

```toml
[taxonomies]
  series = "series"

[params.features]
  series = true  # Default: true
```

### Post Front Matter Example

```yaml
---
title: "My Post"
date: 2026-06-13
weight: 1
series:
  - "My Series"
---
```

### Usage

The series taxonomy requires:
1. Add `series = "series"` to taxonomies section
2. Set `params.features.series = true` (default: true)
3. Add `weight` and `series` front matter to posts

**Bilingual Series Naming:** Use language-specific series names:
- Chinese post: `series: ["eBPF 可观测性系列"]`
- English post: `series: ["eBPF Observability Series"]`

This creates separate taxonomy terms for each language, keeping series pages language-specific.
