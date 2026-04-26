# 主题切换

深色/浅色主题切换功能，支持系统偏好检测和 localStorage 持久化。

## 配置

```toml
[params.features]
  themeSwitch = true          # 启用主题切换按钮

[params.theme]
  default = "auto"            # "auto", "light", 或 "dark"
```

## 用法

主题切换按钮位于页面头部。系统会自动检测用户的操作系统偏好，并将选择保存到 localStorage 中以便下次访问时保持一致。

## 相关链接

- [代码高亮](../en/code-highlight.md)
- [侧边栏](../en/sidebar.md)