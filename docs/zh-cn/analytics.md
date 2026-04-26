# 网站分析

集成各种分析提供商，支持 Do Not Track (DNT)。

## 配置

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

## 用法

所有分析服务独立运行，可同时使用。自定义端点尊重 DNT。
将 `sampleRate` 设置为 1 到 100 之间的值以启用采样（例如，50 表示 50%）。

## 相关链接

- [主题配置](../en/theme-configuration.md)
- [隐私功能](../en/privacy.md)