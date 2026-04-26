# 友链

创建专门的友链页面。

## 配置

```toml
[[params.links]]
  name = "示例"
  url = "https://example.com"
  desc = "一个示例网站"
```

## 用法

在配置中添加多个 `[[params.links]]` 条目。每个链接将显示名称、URL和可选描述。
该页面默认可通过 `/flinks/` 访问。

## 相关链接

- [主题配置](../en/theme-configuration.md)
- [菜单](../en/menus.md)