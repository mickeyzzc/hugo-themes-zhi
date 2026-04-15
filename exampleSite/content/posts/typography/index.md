---
title: "Typography Test"
date: 2024-03-10
categories: ["test"]
tags: ["typography", "test"]
description: "Comprehensive typography test covering headings, paragraphs, lists, blockquotes, tables, and inline elements"
---

## Headings

### H3 Heading

This section tests third-level headings and their visual appearance in the TOC.

#### H4 Heading

Fourth-level headings provide additional document structure. The TOC should respect `maxDepth` configuration.

## Paragraphs

This is a standard paragraph with **bold text**, *italic text*, `inline code`, and a [hyperlink](https://example.com). These are the most common inline formatting elements used in technical writing.

A second paragraph to verify spacing. Hugo normalizes Markdown content using Goldmark, which follows the CommonMark specification. Paragraphs separated by blank lines receive proper `<p>` tags.

A paragraph with ~~strikethrough~~ text and superscript^2^ and subscript~n~ notation for technical content.

## Unordered Lists

- First item in the list
- Second item with more detail
  - Nested item under second
  - Another nested item
    - Deeply nested at level three
- Third item
- Fourth item with `inline code` reference

## Ordered Lists

1. First ordered item
2. Second ordered item with a longer description that might wrap to multiple lines to test line height and spacing
3. Third item
   1. Nested ordered item
   2. Another nested ordered item
4. Fourth item

## Mixed Lists

1. Ordered item one
   - Unordered nested under ordered
   - Another unordered nested item
2. Ordered item two
   1. Ordered nested under ordered
   2. Second nested ordered

## Blockquotes

> This is a simple blockquote. It tests the styling of quoted content in the theme.

> This is a blockquote with **bold** and *italic* text inside, plus `inline code`.

> Nested blockquotes:
> > This is a nested blockquote at level two.
> > > And this is level three, which should be styled distinctly.

> Blockquote with a list:
> - Item one in blockquote
> - Item two in blockquote
> - Item three in blockquote

## Inline Elements

Here are all the inline elements in one paragraph: **bold**, *italic*, ***bold italic***, `code`, ~~strikethrough~~, [link](https://example.com).

An auto-linked URL: https://example.com

## Horizontal Rule

---

A horizontal rule separates sections visually.

## Table

| Feature       | Status    | Notes                          |
|---------------|-----------|--------------------------------|
| Dark mode     | ✅ Active  | Toggle via header button       |
| MathJax       | ✅ Active  | Auto-detect `$...$` syntax     |
| Mermaid       | ✅ Active  | Auto-detect `mermaid` blocks   |
| Code copy     | ✅ Active  | Copy button on all code blocks |
| Lightbox      | ✅ Active  | Click-to-zoom images           |
| Search        | ✅ Active  | Local XML-based search         |

### Aligned Table

| Left align | Center align | Right align |
|:-----------|:------------:|------------:|
| Left       | Center       | Right       |
| Text       | Text         | Text        |
| 100        | 200          | 300         |

## Definition List via HTML

<dl>
  <dt>Hugo</dt>
  <dd>A fast static site generator written in Go.</dd>
  <dt>Goldmark</dt>
  <dd>The Markdown renderer used by Hugo, compliant with CommonMark.</dd>
  <dt>Chroma</dt>
  <dd>Syntax highlighting engine used by Hugo for code blocks.</dd>
</dl>

## Abbreviations

HTML stands for <abbr title="HyperText Markup Language">HTML</abbr>, and CSS stands for <abbr title="Cascading Style Sheets">CSS</abbr>.

## Footnote-style Content

This is a paragraph that references additional information[^1]. The Zhi theme uses standard Markdown rendering via Goldmark[^2].

[^1]: This would be additional information referenced from the text.
[^2]: Goldmark is the default Markdown renderer in Hugo since version 0.60.
