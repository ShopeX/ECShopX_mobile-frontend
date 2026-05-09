# change-summary

## 需求与计划摘要

本地迭代，无 `plan.md`。首页挂件「图片热区」纵向/横向展示与样式结构调整。

## 改动范围

| 文件 | 说明 |
|------|------|
| `src/pages/home/wgts/imghot-zone/index.jsx` | 去掉纵向时 `outerStyle` 对宽度与左 padding 的特殊计算；`bodyStyle` 在 **纵向** 且配置 `imgHeight` 时设置高度；根节点不再挂横/竖 class，改为内层 **`wgt-imghot-zone__body-img-wrapper`** 区分 `__vertical` / `__horizontal`；`SpImage` **mode** 与 `isVertical` 对应关系调整为横向 `widthFix`、纵向 `heightFix`。 |
| `src/pages/home/wgts/imghot-zone/index.scss` | 样式随 wrapper 拆分：横向下图片 `width: 100%`；纵向 wrapper 横向滚动 + snap，图片 `height: 100%`、`width: min-content`；`__body` 统一宽高与 `box-sizing`。 |

## 测试与验收情况

- 未跑自动化测试；建议在首页分别验证横版、竖版图片热区与热区点击区域是否对齐。

## 遗留问题与后续建议

- `index.scss` 末尾若缺少换行符，可按团队规范补 EOF 换行（本次未改）。
