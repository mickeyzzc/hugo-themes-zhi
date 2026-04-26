# MathJax

数学公式渲染功能，使用 MathJax 3 自动加载行内和块级公式。

## 配置

```toml
[params.features]
  mathJax = true          # 启用 MathJax
```

## 用法

- 行内公式：`$E = mc^2$`
- 块级公式：
  $$
  \int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
  $$
- 系统会自动检测页面中的 `$...$` 和 `$$...$$` 并加载 MathJax。

## 相关链接

- [代码高亮](../en/code-highlight.md)
- [Mermaid](../en/mermaid.md)