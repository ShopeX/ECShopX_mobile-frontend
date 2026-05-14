# change-summary

## 需求与计划摘要

企业购分包内一批页面的 i18n 补齐：`comp-skuselect`、`订单演示`、`分享亲友` 等与 `@/i18n` 对齐；为多页面补充 **`$t` / `ti` / `useTranslation` / `i18n`** 导入，避免运行时未定义。

## 改动范围

| 文件 | 说明 |
|------|------|
| `src/subpages/purchase/comps/comp-skuselect.js` | 引入 **`useTranslation`、`$t`、`ti`**；SKU 摘要用语 **`ti('47ac6066.aa995b', [...])`** / **`$t('46dc5ce5.4fd966')`** 写入 **`skuText`** 并与 **`onChange`** 对齐；移除未用的 **`useMemo`** import；解构 **`skuText`**。 |
| `src/subpages/purchase/espier-checkout.js` | **`ti`** 与 **`useTranslation`/`$t`** 一并从 `@/i18n` 导入。 |
| `src/subpages/purchase/espier-index.js` | 同上。 |
| `src/subpages/purchase/espier-detail.js` | 补充 **`$t`** 导入。 |
| `src/subpages/purchase/select-company-email.js` | 补充 **`$t`** 导入。 |
| `src/subpages/purchase/select-company-phone.js` | 补充 **`$t`** 导入。 |
| `src/subpages/purchase/share.js` | 补充 **`$t`、`i18n`**（导航标题与 **`languageChanged`** 监听）。 |
| `src/subpages/purchase/neigou-order.js` | 演示订单数据由内嵌常量改写：文案字段改为中文占位，经 **`mockText`** / **`statusLabel`** 映射到 **`$t`**；按钮区根据 **`待支付`** 分支。 |

## 测试与验收建议

- 构建小程序后打开：内购 SKU 弹窗、分享亲友页（切换语言）、内购订单演示列表。
- 切换语言后确认 **`share`** 导航标题随 **`languageChanged`** 更新。

## 遗留问题

- **`neigou-order`** 仍为演示数据；若上线需接真实接口并去掉 **`mockText`** 硬编码映射。
