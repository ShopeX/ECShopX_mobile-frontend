# change-summary

## 需求与计划摘要

修复语言码与 i18n 资源加载的兼容问题，统一 lang 存储归一化，并让隐私相关组件在切换语言后实时更新文案。

## 改动范围

| 文件 | 说明 |
|------|------|
| src/i18n/instance.js | 新增 normalizeStorageLang 与别名映射（zh-cn/zh_cn/zh、en-us、ar-sa 等）；在读取 storage、加载资源、syncI18nLanguage 中统一归一化，并在同语言首次补资源时主动 emit languageChanged。 |
| src/i18n/index.js | 导出 normalizeStorageLang 供业务层复用。 |
| src/app.js | 初始化与 languageChanged 回调统一走 normalizeStorageLang，确保 lang 写回 storage。 |
| src/api/req.js | 请求参数 lang 改为归一化后再映射 country_code，避免异常语言码。 |
| src/subpages/member/settings.jsx | 读取当前语言时增加 normalizeStorageLang 与默认值兜底。 |
| src/components/privacy-confirm-modal/index.js | 监听 i18n.languageChanged 并 forceUpdate，保证弹窗文案实时切换。 |
| src/components/sp-wx-privacy/index.js | 抽取 getPrivacyTextData，attached 时绑定 languageChanged 并在 detached 解除。 |
| src/components/sp-privacy-modal/index.js | 标题/按钮文案改为  key。 |

## 测试与验收建议

- 在设置页切换语言后，检查隐私弹窗与微信隐私组件按钮文案是否即时更新。
- 校验首屏首请求与接口参数中的 country_code 与所选语言一致。

## 遗留问题

- 若后续新增语言码，需同步维护 STORAGE_LANG_ALIASES。
