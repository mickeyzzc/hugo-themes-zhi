[English](README.md) | **中文**

# Zhi

一个极简的 Hugo 博客主题，支持深色/浅色主题、MathJax、Mermaid 图表、哔哩哔哩/YouTube 视频短代码、图片灯箱和代码复制 —— 使用纯 Hugo Pipes 构建，零外部构建工具。

![Hugo](https://img.shields.io/badge/Hugo-Extended%20%E2%89%A50.146.0-blue?logo=hugo&logoColor=white) ![License: MIT](https://img.shields.io/github/license/mickeyzzc/hugo-themes-zhi?color=green) ![Release](https://img.shields.io/github/v/release/mickeyzzc/hugo-themes-zhi) ![Stars](https://img.shields.io/github/stars/mickeyzzc/hugo-themes-zhi?style=social) ![Last Commit](https://img.shields.io/github/last-commit/mickeyzzc/hugo-themes-zhi?color=orange) ![Repo Size](https://img.shields.io/github/repo-size/mickeyzzc/hugo-themes-zhi?color=lightgray)

## 功能特性

- **深色 / 浅色主题** — 系统偏好检测 + `localStorage` 持久化 → [文档](docs/zh-cn/features.md#主题切换)
- **语法高亮** — Hugo 内置 Chroma，支持复制按钮和语言标签 → [文档](docs/zh-cn/content.md#代码高亮)
- **MathJax 3** — 检测到 `$...$` 或 `$$...$$` 时自动加载 → [文档](docs/zh-cn/content.md#mathjax)
- **Mermaid v11+ 图表** — 检测到 ` ```mermaid ` 代码块时自动加载；支持扩展节点形状（`@{ shape: ... }`）、`classDef` 样式、ELK 布局、架构/看板图；自适应深色/浅色 → [文档](docs/zh-cn/content.md#mermaid-图表)
- **视频短代码** — 嵌入哔哩哔哩或 YouTube，基于时区自动切换，支持手动切换 → [文档](docs/zh-cn/content.md#视频嵌入)
- **图片灯箱** — 点击文章图片查看大图 → [文档](docs/zh-cn/features.md#图片灯箱)
- **响应式设计** — 移动优先，内容区最大宽度 `768px`
- **网站分析** — 可配置端点，支持采样率 → [文档](docs/zh-cn/configuration.md#网站分析)
- **Hugo Pipes** — 所有 CSS/JS 通过 `resources.Get` → `minify` → `fingerprint` 处理，无需 webpack/vite
- **多语言 / i18n** — 语言切换器与自动翻译链接 → [文档](docs/zh-cn/features.md#语言切换器)
- **系列（Series）** — 带步骤布局的系列文章，排序切换，基于权重的排序 → [文档](docs/zh-cn/features.md#系列)

## 环境要求

- Hugo **≥ 0.146.0**（非 Extended 版本即可）

## 快速开始

### 作为 Hugo 主题模块（推荐）

在你的 `hugo.toml` 中：

```toml
[module]
  [[module.imports]]
    path = "github.com/mickeyzzc/hugo-theme-zhi"
```

### 作为 Git Clone

```bash
git clone https://github.com/mickeyzzc/hugo-theme-zhi.git themes/zhi
```

然后在你的 `hugo.toml` 中：

```toml
theme = 'zhi'
```

## 配置

```toml
[params.features]
  codeHighlight = true   # 语法高亮
  mathJax       = true   # 数学公式 ($...$, $$...$$)
  mermaid       = true   # Mermaid 图表
  themeSwitch   = true   # 深色/浅色切换按钮
  lightbox      = true   # 点击图片放大
  analytics     = true   # 自定义分析端点
  series       = true   # 带排序切换的系列文章
[params.analytics]
  provider   = "custom"
  endpoint   = "/metrics"
  siteId     = ""
  sampleRate = 100

[params.video]
  defaultPlatform = "bilibili"   # "bilibili" 或 "youtube"
  showSwitch      = true         # 显示平台切换按钮

[params.theme]
  default = "auto"   # "auto"、"light" 或 "dark"
}

[taxonomies]
  series = "series"
```

## 文档

所有功能的完整双语文档：

| 分类 | English | 中文 |
|------|---------|------|
| 功能 | [docs](docs/en/features.md) | [文档](docs/zh-cn/features.md) |
| 内容 | [docs](docs/en/content.md) | [文档](docs/zh-cn/content.md) |
| 配置 | [docs](docs/en/configuration.md) | [文档](docs/zh-cn/configuration.md) |

## 用法

> 完整文档请参阅[文档](#文档)。

### 视频短代码

```markdown
{{</* video bilibili="BV1xx411c7mD" youtube="dQw4w9WgXcQ" title="演示视频" */>}}
```

嵌入哔哩哔哩和/或 YouTube 视频。当同时提供两个 ID 时，播放器根据时区自动选择（中国 → 哔哩哔哩，其他 → 配置默认值）。用户可手动切换平台。

### Mermaid 图表（v11+）

使用 `mermaid` 语言的围栏代码块。支持所有 Mermaid v11+ 功能，包括扩展节点形状和 `classDef` 样式：

~~~markdown
```mermaid
graph TD
    A@{ shape: doc, label: "文档" } --> B@{ shape: diam, label: "判断" }
    B -->|是| C@{ shape: hex, label: "处理" }
    B -->|否| D@{ shape: cyl, label: "数据库" }

    classDef primary fill:#e1f5fe,stroke:#0288d1
    classDef warn fill:#fff3e0,stroke:#ef6c00
    class A,C primary
    class B,D warn
```
~~~

支持的图表类型：`flowchart`、`sequence`、`class`、`state`、`ER`、`gantt`、`pie`、`mindmap`、`timeline`、`gitgraph`、`architecture`（v11.1+）、`kanban`（v11.0+）等。

### 数学公式 / LaTeX

行内公式：`$E = mc^2$`

块级公式：
```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 代码块

所有围栏代码块自动具备：
- 语言标签（左上角）
- 复制按钮（右上角）
- Hugo Chroma 语法高亮

```markdown
```python
def hello():
    print("Hello, World!")
```
```

### 菜单

```toml
[[menus.main]]
  name = '首页'
  pageRef = '/'
  weight = 10

[[menus.main]]
  name = '文章'
  pageRef = '/posts'
  weight = 20

[[menus.main]]
  name = '系列'
  pageRef = '/series'
  weight = 30
```

### 社交链接

```toml
[[params.social]]
  name = "GitHub"
  url = "https://github.com/yourusername"

[[params.social]]
  name = "Twitter"
  url = "https://twitter.com/yourusername"
```

## 项目结构

```
layouts/
├── _default/          # baseof.html、single.html、list.html、_markup/
├── _partials/         # Hugo 0.120+ partials（head、header、footer、menu、terms、lang-switch、greeting、tag-cloud）
├── partials/          # 旧版（mathjax.html、mermaid.html）
├── shortcodes/        # video.html
├── archives/           # 归档页面
├── flinks/             # 友情链接页面
├── series/             # 系列分类页面
├── home.html, section.html, taxonomy.html, term.html

assets/
├── css/
│   ├── main.css               # 通过 @import 聚合
│   └── components/            # 按功能划分的 CSS 模块
│       ├── theme.css          # CSS 变量（浅色 + 深色）
│       ├── header.css
│       ├── footer.css
│       ├── code.css
│       ├── video.css
│       ├── lightbox.css
│       ├── mermaid.css
│       ├── math.css
│       ├── lang-switch.css
│       ├── series.css
│       ├── greeting.css
│       └── tag-cloud.css
└── js/
    ├── main.js               # 编排器（MathJax + Mermaid 懒加载）
    ├── code-copy.js           # 代码块复制按钮
    ├── theme-toggle.js        # 深色/浅色切换及持久化
    ├── video-geo-switch.js    # 哔哩哔哩/YouTube 地域切换
    ├── lightbox.js            # 图片灯箱
    ├── sidebar.js
    ├── greeting.js
    ├── search.js
    ├── toc.js
    ├── reading-progress.js
    ├── back-to-top.js
    ├── donation.js
    ├── analytics.js
    └── series-sort.js
```

## 开发

```bash
# 启动开发服务器（支持热重载）
hugo server

# 生产构建
hugo --minify

# 运行 E2E 测试
npx playwright test
```

## 主题系统

主题颜色通过 `assets/css/components/theme.css` 中的 CSS 自定义属性定义：

```css
:root {
  --bg: #ffffff;
  --text: #222222;
  --accent: #0066cc;
  /* ... */
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #e0e0e0;
  --accent: #4da6ff;
  /* ... */
}
```

在你自己的站点 CSS 中覆盖这些变量即可自定义颜色。

## 许可证

MIT
