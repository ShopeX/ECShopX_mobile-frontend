# i18n 扫描结果

**扫描目录**: `/Users/lukaijie/workspace/work/shopex/smallP/ecshopx-platform/ecshopx-vshop/src/pages/article`
**报告文件**: `batch-2-8_src_pages_article.md`

## 统计

| 状态 | 数量 | 占比 |
|------|------|------|
| 未翻译完 | 0 | 0.0% |
| 已翻译 | 0 | 0.0% |
| 无需翻译 | 2 | 100.0% |
| **合计** | **2** | 100% |

## 未翻译完

（无）

## 已翻译

（无）

## 无需翻译

- `index.config.js`
- `index.js`

## 复查备注（2026-05-18）

- `index.js` 无硬编码中文：标题、正文、导航栏标题均来自 `api.article.detail` 接口字段（`info.title`、`info.content`），属动态内容，不在前端 i18n 范围。
- `index.config.js` 为空配置，无文案。
- 全目录 `rg` 无用户可见中文残留；维持「无需翻译」分类，无需改代码或 locale。
