# 代码高亮

语法高亮功能，使用 Hugo 的 Chroma 实现，带复制按钮和语言标签。

## 配置

```toml
[params.features]
  codeHighlight = true          # 启用语法高亮

[markup]
  [markup.highlight]
    codeFences = true           # 启用代码围栏
    guessSyntax = true          # 猜测语法
    hl_Lines = ""               # 高亮行号
    lineNoStart = 1             # 行号起始值
    lineNos = true              # 显示行号
    lineNumbersInTable = true   # 使用表格显示行号
    noClasses = false           # 使用 CSS 类而非内联样式
    style = "monokai"           # 高亮样式（如 monokai, github）
    tabWidth = 2                # 制表符宽度
```

## 用法

所有围栏代码块（```language）自动获得：
- 语言标签（左上角）
- 复制按钮（右上角）
- 行号（如果启用）
- 主题样式（默认 Monokai）

```python
def hello():
    print("Hello, World!")
```
```

## 相关链接

- [主题切换](../en/theme-switch.md)
- [MathJax](../en/mathjax.md)