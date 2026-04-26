# 阅读进度条

阅读进度条功能，在文章页面顶部或底部显示一个细条，表示当前阅读进度。

## 配置

```toml
[params.features]
  readingProgress = true          # 启用阅读进度条

[params.readingProgress]
  position = "top"                # "top" 或 "bottom"
  color    = ""                   # CSS 颜色，空值使用 --accent 变量
  height   = "3px"                # 条高度
```

## 用法

启用后，阅读进度条将仅在文章单页（single/post）显示，不在首页或列表页显示。
进度条基于页面滚动位置动态更新，显示已读内容的百分比。

## 相关链接

- [主题切换](../en/theme-switch.md)
- [侧边栏](../en/sidebar.md)