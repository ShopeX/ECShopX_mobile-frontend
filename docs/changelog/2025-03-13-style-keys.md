# 样式 key 统一为 kebab-case

## 变更摘要

- **helper.js**：`getGlobalBaseStyle` 中边距样式由 camelCase 改为 kebab-case（`paddingTop` → `padding-top` 等）。
- **location-module**：导航项内联样式 `borderRadius`、`backgroundColor`、`paddingLeft`/`paddingRight` 改为 `border-radius`、`background-color`、`padding-left`/`padding-right`。

便于小程序等环境正确解析内联样式。
