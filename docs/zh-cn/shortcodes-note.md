# Note 短代码

显示带有不同类型和可选标题的样式化笔记框。

## 配置

无需特殊配置。该短代码默认可用。

## 用法

```markdown
{{</* note info "标题" */>}}
内容这里
{{</* /note */>}}
```

类型：info, tip, success, warning, danger。每种类型都有独特的 SVG 图标。
标题是可选的，如果未提供则默认为类型名称。

## 相关链接

- [短代码](../en/shortcodes.md)
- [Quote 短代码](../en/shortcodes-quote.md)