# 配置

> 站点配置和元数据功能。

## 目录

- [网站分析](#网站分析)
- [SEO 元标签](#seo-元标签)
- [归档页面](#归档页面)
- [友链](#友链)
- [打赏](#打赏)
- [知识共享许可协议](#知识共享许可协议)

---

## 网站分析

集成各种分析提供商，支持 Do Not Track (DNT)。

### 配置

```toml
[params.features]
  analytics = false

[params.analytics]
  # 自定义端点（使用 sendBeacon）
  endpoint = ""
  # Cloudflare Web Analytics
  cloudflareToken = ""
  # Microsoft Clarity
  clarityProjectId = ""
  # Busuanzi 页面浏览量
  busuanzi = false
  # 采样率 (1-100)
  sampleRate = 100
```

### 用法

所有分析服务独立运行，可同时使用。自定义端点尊重 DNT。
将 `sampleRate` 设置为 1 到 100 之间的值以启用采样（例如，50 表示 50%）。

---

## SEO 元标签

自动生成 OpenGraph 和 Twitter Card 元标签。

### 配置

```toml
[params.seo]
  openGraph = true
  twitterCard = true
  twitterCardType = "summary_large_image"
```

### 用法

通过将相应的标志设置为 true 来启用 OpenGraph 和/或 Twitter Card。
选择 Twitter Card 类型（summary, summary_large_image, app, player）。

---

## 归档页面

按日期分组显示所有文章的时间线布局。

### 配置

无需特殊配置。只需为归档页面添加菜单条目。

### 用法

创建指向 `/archives/` 的菜单条目以访问归档页面。
该页面会自动按年、月、日列出所有文章。

---

## 友链

创建专门的友链页面。

### 配置

```toml
[[params.links]]
  name = "示例"
  url = "https://example.com"
  desc = "一个示例网站"
```

### 用法

在配置中添加多个 `[[params.links]]` 条目。每个链接将显示名称、URL和可选描述。
该页面默认可通过 `/flinks/` 访问。

---

## 打赏

在文章页面底部显示微信支付和支付宝打赏二维码。

### 配置

```toml
[params.donation]
  enable = false
  comment = "支持作者"
  wechatPay = "/images/wechatpay.png"
  alipay = "/images/alipay.png"
```

### 用法

将 `enable` 设置为 true 并提供微信支付和支付宝二维码的图片 URL。
该部分将出现在每篇文章页面的底部。

---

## 知识共享许可协议

显示知识共享许可证徽章。

### 配置

```toml
[params.creativeCommons]
  enable = false
  license = "by-nc-sa"
  size = "normal"
```

### 用法

将 `enable` 设置为 true。可选择的许可证有：by, by-sa, by-nc, by-nc-sa, by-nd, by-nc-nd。
将 `size` 设置为 "normal" 或 "big"。


---

## 多语言 / i18n

标准 Hugo 多语言配置，支持完整的 i18n 集成和语言切换 UI。

### 配置

```toml
[languages.en]
languageName = "English"
title = "My Blog"
weight = 1

[languages.zh-cn]
languageName = "简体中文"
title = "我的博客"
weight = 2

# 当配置 2+ 种语言时自动渲染语言切换器
[params.features]
  i18n = true
```

### 用法

在 Hugo 配置中设置 `languages` 表来启用多语言支持。
当配置了 2+ 种语言时，系统会自动在页面头部渲染语言切换器。
每种语言需要有自己的 i18n 文件，主题提供 `i18n/en.toml` 和 `i18n/zh-cn.toml`。
双语内容约定：文章文件 `post.md`（默认语言）+ `post.en.md`（英文版本）。
系列名称使用语言特定的 taxonomy 术语。

---

## 系列分类法

系列分类法配置，支持时间线布局和排序切换功能。

### 配置

```toml
[taxonomies]
  series = "series"

[params.features]
  series = true  # 默认：true
```

### 用法

在 Hugo 配置中启用 `series` 分类法。
文章 front matter 示例：
```yaml
---
title: "文章标题"
date: 2024-01-15
weight: 1  # 值越小越靠前
series:
- "系列名称"
---
```
#BN
双语系列命名使用语言特定名称：
```yaml
# 中文文章
series:
- "eBPF 可观测性系列"

# 英文文章
series:
- "eBPF Observability Series"
```
#BN
系统会自动创建系列列表页 (/series/) 和系列详情页 (/series/系列名称/)。
详情页支持排序切换：默认倒序（最新在前），可切换为正序（阅读顺序）。
用户偏好通过 localStorage 持久化。
