# 页脚

自定义页脚部分，包括 ICP 备案、公安备案、版权信息和社交链接。

## 配置

```toml
[params.footer]
  beian = ""
  gongan = ""
  poweredBy = true
  copyright = ""
  # 社交链接（与侧边栏相同的 schema）
  [[params.footer.socialLinks]]
    name = "GitHub"
    url = "https://github.com/username"
    icon = "github"
```

## 用法

设置 `beian` 为 ICP 许可证号（中国），`gongan` 为公安备案号（中国）。
将 `poweredBy` 设置为 false 以隐藏 Hugo 和主题致谢。
设置 `copyright` 为自定义版权文本。
`socialLinks` 数组遵循与侧边栏社交链接相同的 schema。
如果未设置 `footer.socialLinks`，则回退到 `params.social`。

## 相关链接

- [主题配置](../en/theme-configuration.md)
- [社交链接](../en/social.md)