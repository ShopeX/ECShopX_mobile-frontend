# change-summary

## 需求与计划摘要

本地迭代，无 `plan.md`。本次提交为已暂存变更：选择身份页硬编码中文改为 `$t`，分包 `resources` 补充对应多语言键，并恢复/纳入 `subpages/i18n/lang/index.json`。

## 改动范围

| 文件 | 说明 |
|------|------|
| `src/subpages/purchase/select-identity.js` | 无资格弹窗 `confirmText`、顶栏 `title`、副标题「选择企业」、底部「确认」均改为 `$t('c2581d4c.*')` 系列 key。 |
| `src/subpages/i18n/resources.js` | 在 `zhcn` / `en` / `ar` 中补充与上述 key 一致的文案（含「返回」「选择企业」「确认」「企业购」及既有无资格句等，以实际 diff 为准）。 |
| `src/subpages/i18n/lang/index.json` | 新增/恢复完整语言包 JSON（体量较大，用于与其它分包/工具链对齐）。 |

## 测试与验收情况

- 未跑自动化测试；建议在小程序切换 en/ar 后验证选择身份页顶栏、副标题、底部按钮与无资格弹窗文案。

## 遗留问题与后续建议

- 若 `lang/index.json` 与 `resources.js` 双轨并存，需团队约定生成/同步流程，避免漏译或键不一致。
