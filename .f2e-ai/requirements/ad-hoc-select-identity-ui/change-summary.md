# change-summary

## 需求与计划摘要

本地迭代，无 `plan.md`。企业购「选择身份」页：与活动首页等统一顶栏（`CompPurchaseNav`）、列表区按企业购 Figma 做卡片选择与底部确认，并补充无资格提示的 i18n 词条。

## 改动范围

| 文件 | 说明 |
|------|------|
| `src/subpages/purchase/select-identity.js` | `SpPage` 使用 `title='企业购'`、`pageConfig.navigateBackgroundColor`、`renderNavigation` 挂载 `CompPurchaseNav`；多企业时先选中再点「确认」跳转；无资格 `showModal` 后 `navigateBack`，按钮文案「返回」。 |
| `src/subpages/purchase/select-identity.config.js` | `navigationBarTitleText: '企业购'`，`navigationStyle: 'custom'` 与分包内企业购页一致。 |
| `src/subpages/purchase/select-identity.scss` | 页面灰底、内容区副标题「选择企业」、黑白卡片列表、固定底栏「确认」；`sp-page__body-children` 背景与页面对齐。 |
| `src/subpages/i18n/lang/index.json` | 新增 key `lvc9b0a`（zh-cn：抱歉，您没有内购资格），其他语言占位空串。 |

## 关键逻辑或接口变化

- 多企业：点击卡片仅更新 `selectedEnterpriseId`，确认后再 `dispatch` 并 `navigateTo` 活动页；单企业且 `is_redirt` 仍自动 `redirectTo`。
- 自定义导航依赖 `navigationStyle: 'custom'`，与 `CompPurchaseNav` 配套。

## 测试与验收情况

- 未跑自动化测试；建议在小程序端验证顶栏返回/首页/客服、列表选中态与确认跳转、无资格弹窗。

## 遗留问题与后续建议

- 无资格文案若需走 `$t('lvc9b0a')`，需在页面接入分包 i18n 调用链后替换字面量。

---

## 2026-05-07 补充提交（工作区已存在改动，仅记录）

| 文件 | 说明 |
|------|------|
| `src/subpages/purchase/select-identity.js` | 「选择企业」由 `section-title` 改回 `hd-bar` + `hd-text` 容器；`SpPage` 属性行格式微调。 |
| `src/subpages/purchase/select-identity.scss` | 恢复 `hd-bar` / `hd-text` 区块样式；去掉 `.sp-page__body-children` 背景覆盖；页底背景色写为 `#F9FAFB`；注释补 Figma 节点说明。 |
