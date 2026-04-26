# 功能

> 主题 UI 功能和组件。

## 目录

- [主题切换](#主题切换)
- [侧边栏](#侧边栏)
- [搜索](#搜索)
- [图片灯箱](#图片灯箱)
- [回到顶部](#回到顶部)
- [阅读进度](#阅读进度)
- [目录](#目录)
- [标签云](#标签云)
- [问候语](#问候语)
- [页脚](#页脚)
- [分页](#分页)

---

## 主题切换

深色/浅色主题切换功能，支持系统偏好检测和 localStorage 持久化。

### 配置

```toml
[params.features]
  themeSwitch = true          # 启用主题切换按钮

[params.theme]
  default = "auto"            # "auto", "light", 或 "dark"
```

### 用法

主题切换按钮位于页面头部。系统会自动检测用户的操作系统偏好，并将选择保存到 localStorage 中以便下次访问时保持一致。

---

## 侧边栏

侧边栏功能，显示头像、社交链接和可选模块（如标签云、目录等）。

### 配置

```toml
[params.features]
  sidebar = true          # 启用侧边栏

[params.sidebar]
  position = "left"       # "left" 或 "right"
  width    = "256px"      # 侧边栏宽度

  # 社交链接（每个条目需要 name 和 url）
  [[params.sidebar.socialLinks]]
    name = "GitHub"
    url  = "https://github.com/yourusername"
    icon = "github"       # 可选：内置图标（github, twitter/x, email, rss, linkedin, mastodon）
```

### 用法

启用后，侧边栏将在页面侧边显示。可以通过 `params.sidebar.position` 调整位置，通过 `params.sidebar.width` 调整宽度。
社交链接通过 `params.sidebar.socialLinks` 配置。

---

## 搜索

本地搜索功能，使用 XML 索引和搜索界面，无需外部服务。

### 配置

```toml
[params.features]
  search = true          # 启用本地搜索
```

### 用法

启用后，系统会自动生成搜索索引（search.xml），并在页面顶部显示搜索框。用户可以输入关键词进行全站搜索。

---

## 图片灯箱

图片灯箱功能，点击文章内的图片可查看大图 overlay。

### 配置

```toml
[params.features]
  lightbox = true          # 启用图片灯箱
```

### 用法

在文章中使用标准 Markdown 图片语法即可自动启用灯箱效果：

![描述文字](/path/to/image.jpg)

系统会自动为文章中的图片添加点击事件，弹出灯箱显示原始大小图片。

---

## 回到顶部

浮动回到顶部按钮，便于页面导航。

### 配置

```toml
[params.features]
  backToTop = true

[params.backToTop]
  scrollPercent = true
```

### 用法

按钮在页面向下滚动后自动出现。当 `scrollPercent` 启用时，它会显示滚动百分比。

---

## 阅读进度

阅读进度条功能，在文章页面顶部或底部显示一个细条，表示当前阅读进度。

### 配置

```toml
[params.features]
  readingProgress = true          # 启用阅读进度条

[params.readingProgress]
  position = "top"                # "top" 或 "bottom"
  color    = ""                   # CSS 颜色，空值使用 --accent 变量
  height   = "3px"                # 条高度
```

### 用法

启用后，阅读进度条将仅在文章单页（single/post）显示，不在首页或列表页显示。
进度条基于页面滚动位置动态更新，显示已读内容的百分比。

---

## 目录

目录功能，在文章页面的侧边栏中显示文章标题结构。

### 配置

```toml
[params.features]
  toc = true          # 启用目录

[params.toc]
  maxDepth  = 3       # 标题深度（1=H1, 3=H3）
  numbering = true    # 是否显示编号
  collapse  = true    # 是否默认折叠子级标题（H3+）
```

### 用法

启用后，目录将在文章页面的侧边栏中显示（如果侧边栏也启用）。目录基于文章中的标题（H2, H3, etc.）生成。

---

## 标签云

标签云功能，在侧边栏中显示所有标签，字体大小根据使用频率变化。

### 配置

```toml
[params.features]
  tagCloud = true          # 启用标签云
```

### 用法

启用后，标签云将自动显示在侧边栏中（如果侧边栏也启用）。标签云基于站点的所有标签生成，使用频率较高的标签显示得更大。

---

## 问候语

基于时间的问候语功能，根据访问时间显示不同的问候（早上好/中午好/下午好/晚上好），仅在侧边栏启用时显示。

### 配置

```toml
[params.features]
  sidebar = true          # 侧边栏必须启用才能显示问候语
```

### 用法

当侧边栏启用时，问候语会自动显示在侧边栏头部。问候语根据访问者的本地时间动态切换：
- 凌晨 0:00 - 11:59：早上好
- 中午 12:00 - 13:59：中午好
- 下午 14:00 - 17:59：下午好
- 晚上 18:00 - 23:59：晚上好

该功能使用 i18n 键实现，可在 `i18n/zh-cn.toml` 中自定义文本。

---

## 页脚

自定义页脚部分，包括 ICP 备案、公安备案、版权信息和社交链接。

### 配置

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

### 用法

设置 `beian` 为 ICP 许可证号（中国），`gongan` 为公安备案号（中国）。
将 `poweredBy` 设置为 false 以隐藏 Hugo 和主题致谢。
设置 `copyright` 为自定义版权文本。
`socialLinks` 数组遵循与侧边栏社交链接相同的 schema。
如果未设置 `footer.socialLinks`，则回退到 `params.social`。

---

## 分页

列表页面的上一页/下一页导航。

### 配置

```toml
paginate = 10
```

### 用法

在站点配置中设置 `paginate` 以控制每页的项目数量。
主题使用 i18n 键来设置上一页和下一页导航标签。
