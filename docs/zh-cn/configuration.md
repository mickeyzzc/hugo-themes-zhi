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
