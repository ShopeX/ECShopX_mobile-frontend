# change-summary

## 需求与计划摘要

本次为本地迭代，仓库内无对应 `plan.md`。改动聚焦：秒杀商品挂件数据映射字段补全与命名对齐，以及子包中文案 i18n 词条批量入库。

## 改动范围

| 文件 | 说明 |
|------|------|
| `src/doc/goods.js` | `WGT_SPEEDKILL_GOODS`：新增 `marketPrice`（分转元）；`discount_var` 重命名为 `discountRate`，与 `compact-card.jsx`、`hero-card.jsx` 中 `info.discountRate` 消费侧一致。 |
| `src/subpages/i18n/lang/index.json` | 新增多条 `zh-cn` 文案键值（企业购、活动口令、限购、亲友购、同城配送等场景），其他语言暂为空字符串。 |

## 关键逻辑或接口变化

- **marketPrice**：从接口 `market_price` 映射为元（除以 100），供展示划线价等用途。
- **discountRate**：仍为十分位折扣字符串（`discount_rate/10` 保留一位小数）；仅字段名从 `discount_var` 改为与渲染层一致的 `discountRate`。

## 测试与验收情况

- 未运行自动化测试；建议在首页/秒杀挂件场景手动确认价格、折扣标签展示正常。
- 新增 i18n 键需在引用处校验 key 与业务一致（本次仅更新语言包文件）。

## 遗留问题与后续建议

- 新增词条的 `en`、`zh-tw`、`ar` 为空，若上线多语言需补译。
- 建议在后续需求中补齐 `.f2e-ai/requirements/<id>/plan.md`，便于与提交技能流程对齐。
