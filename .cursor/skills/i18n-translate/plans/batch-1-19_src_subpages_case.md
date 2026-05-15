# i18n 扫描结果

**扫描目录**: `/Users/lukaijie/workspace/work/shopex/smallP/ecshopx-platform/ecshopx-vshop/src/subpages/case`
**报告文件**: `batch-1-19_src_subpages_case.md`

## 统计

| 状态 | 数量 | 占比 |
|------|------|------|
| 未翻译完 | 0 | 0.0% |
| 已翻译 | 6 | 100.0% |
| 无需翻译 | 0 | 0.0% |
| **合计** | **6** | 100% |

## 未翻译完

（无）

## 已翻译

- `detail.config.js`
- `detail.js`
- `list.config.js`
- `list.js`
- `view-case.config.js`
- `view-case.js`

## 无需翻译

（无）

## 说明

- `detail.js` 中与接口返回值比对的中文（户型/风格/面积）未改为键，避免破坏接口约定。
- `list.js` 请求参数仍使用中文城市名（如「全国」「杭州市」）；界面展示通过 `formatLocationLabel` 走 i18n。
- 标签项支持 `tagNameKey` + `tagName`（接口标签仍展示服务端原文）。
- 「全部」「重置」「确认」复用已有键 `f1d3181c.a8b0c2`、`986be21d.4b9c32`、`61e2d21a.e83a25`。
