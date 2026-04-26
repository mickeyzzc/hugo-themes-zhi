# 目录

目录功能，在文章页面的侧边栏中显示文章标题结构。

## 配置

```toml
[params.features]
  toc = true          # 启用目录

[params.toc]
  maxDepth  = 3       # 标题深度（1=H1, 3=H3）
  numbering = true    # 是否显示编号
  collapse  = true    # 是否默认折叠子级标题（H3+）
```

## 用法

启用后，目录将在文章页面的侧边栏中显示（如果侧边栏也启用）。目录基于文章中的标题（H2, H3, etc.）生成。

## 相关链接

- [侧边栏](../en/sidebar.md)
- [标签云](../en/tag-cloud.md)