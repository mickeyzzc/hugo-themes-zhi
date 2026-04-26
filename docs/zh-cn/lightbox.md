# 图片灯箱

图片灯箱功能，点击文章内的图片可查看大图 overlay。

## 配置

```toml
[params.features]
  lightbox = true          # 启用图片灯箱
```

## 用法

在文章中使用标准 Markdown 图片语法即可自动启用灯箱效果：

![描述文字](/path/to/image.jpg)

系统会自动为文章中的图片添加点击事件，弹出灯箱显示原始大小图片。

## 相关链接

- [主题切换](../en/theme-switch.md)
- [侧边栏](../en/sidebar.md)