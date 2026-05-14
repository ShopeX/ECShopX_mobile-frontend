# i18n 扫描结果

**扫描目录**: `/Users/lukaijie/workspace/work/shopex/smallP/ecshopx-platform/ecshopx-vshop/src/pages/purchase`
**报告文件**: `batch-2-4_src_pages_purchase.md`

## 统计

| 状态 | 数量 | 占比 |
|------|------|------|
| 未翻译完 | 0 | 0.0% |
| 已翻译 | 5 | 83.3% |
| 无需翻译 | 1 | 16.7% |
| **合计** | **6** | 100% |

## 未翻译完

（无）

## 已翻译

- `auth.js`
- `comps/comp-tabbar.js`
- `comps/comp-purchase-nav.js`
- `index.config.js`
- `index.js`

## 无需翻译

- `auth.config.js`

## 说明

- `index.js`（活动列表入口）：`SpPage` 加载态标题「企业购」→ `$t('c2581d4c.6fb7d0')`。
- `auth.js`：手机验证成功 Toast、亲友绑定失败弹窗确认按钮 → `$t('ace75665.45001d')`、`$t('ace75665.fe0337')`；企业已关闭弹窗（标题「提示」`ace75665.02d981`、正文 `ace75665.3cd788`）、落地页「开始选购」`ace75665.ccd765`；`useTranslation()` 保证切语言后按钮文案刷新。
- `index.config.js`：导航标题改为空字符串，与 `auth.config` 等一致，实际标题由页面内 `setNavigationBarTitle($t('e32a7439.dc7202'))` 设置。
- `comp-tabbar.js`：面向用户文案已走 `$t` / 键引用。
- `comps/comp-purchase-nav.js`：默认标题 `c2581d4c.6fb7d0`（企业购）、客服文案 `e15eed5a.e7dea7`；父级传入 `title` 时仍优先展示传入值。
