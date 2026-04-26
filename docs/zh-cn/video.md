# 视频嵌入

视频短代码功能，支持 Bilibili 和 YouTube，自动根据时区选择平台并提供手动切换。

## 配置

```toml
[params.video]
  defaultPlatform = "bilibili"   # "bilibili" 或 "youtube"
  showSwitch      = true         # 显示平台切换按钮
```

## 用法

使用短代码嵌入视频：

{{</* video bilibili="BV1xx411c7mD" youtube="dQw4w9WgXcQ" title="Demo Video" */>}}

- 当同时提供 bilibili 和 youtube ID 时，根据访问者的时区自动选择（中国大陆使用 Bilibili，否则使用默认平台）。
- 用户可以通过切换按钮手动选择平台。

## 相关链接

- [主题切换](../en/theme-switch.md)
- [侧边栏](../en/sidebar.md)