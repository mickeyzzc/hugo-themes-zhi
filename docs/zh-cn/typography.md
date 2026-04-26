# 字体定制

自定义标题、正文和代码的字体。

## 配置

```toml
[params.typography]
  headingFont = ""
  bodyFont = ""
  codeFont = ""
  lineScale = 1.6
  cjkLineScale = 1.8
```

## 用法

将字体变量设置为您想要的字体系列（例如，"Arial"，"'Helvetica Neue'" 等）。
空字符串使用系统字体栈。
调整 `lineScale` 和 `cjkLineScale` 以设置行高（拉丁文默认为 1.6，CJK 默认为 1.8）。

## 相关链接

- [主题配置](../en/theme-configuration.md)