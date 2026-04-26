# 侧边栏

侧边栏功能，显示头像、社交链接和可选模块（如标签云、目录等）。

## 配置

```toml
[params.features]
  sidebar = true          # 启用侧边栏

[params.sidebar]
  position = "left"       # "left" 或 "right"
  width    = "256px"      # 侧边栏宽度

  # 社交链接（每个条目需要 name 和 url）
  [[params.sidebar.socialLinks]]
    name = "GitHub"
    url  = "https://github.com/yourusername"
    icon = "github"       # 可选：内置图标（github, twitter/x, email, rss, linkedin, mastodon）
```

## 用法

启用后，侧边栏将在页面侧边显示。可以通过 `params.sidebar.position` 调整位置，通过 `params.sidebar.width` 调整宽度。
社交链接通过 `params.sidebar.socialLinks` 配置。

## 相关链接

- [主题切换](../en/theme-switch.md)
- [标签云](../en/tag-cloud.md)
- [目录](../en/toc.md)