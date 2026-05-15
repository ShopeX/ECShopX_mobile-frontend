# i18n 扫描结果

**扫描目录**: `/Users/lukaijie/workspace/work/shopex/smallP/ecshopx-platform/ecshopx-vshop/src/pages/cart`
**报告文件**: `batch-2-2_src_pages_cart.md`

## 统计

| 状态 | 数量 | 占比 |
|------|------|------|
| 未翻译完 | 0 | 0.0% |
| 已翻译 | 18 | 64.3% |
| 无需翻译 | 10 | 35.7% |
| **合计** | **28** | 100% |

## 未翻译完

（无）

## 已翻译

- `add-personnel.js`
- `cashier-alipay.js`
- `cashier-result.js`
- `cashier-weapp.js`
- `comps/cart-item.js`
- `comps/comp-deliver.js`
- `comps/comp-goodsitem.js`
- `comps/comp-medication-personnel.js`
- `comps/comp-paymentpicker.js`
- `comps/comp-pointuse.js`
- `comps/comp-selectpackage.js`
- `comps/deliver.js`
- `comps/payment-picker.js`
- `comps/point-use.js`
- `espier-checkout.js`
- `espier-index.js`
- `offline-transfer.js`
- `prescription-information.js`

## 无需翻译

- `add-personnel.config.js`
- `cashier-alipay.config.js`
- `cashier-result.config.js`
- `cashier-weapp.config.js`
- `checkout-items.js`
- `const/index.js`
- `espier-checkout.config.js`
- `espier-index.config.js`
- `offline-transfer.config.js`
- `prescription-information.config.js`

## 说明

- `espier-index.js`（主包购物车）：`SpPage` 标题「购物车」→ `$t('21544271.c017be')`；店铺名缺省「自营」→ `$t('f9ef9536.491c0c')`。
- `espier-checkout.js`：补全 `useTranslation()` 并解构 `i18n`，与 `useEffect(..., [i18n.language])` 中 `setNavigationBarTitle` 一致，避免运行时 `i18n` 未定义。
- `offline-transfer.js`：面向用户文案已走 `$t('1fdf726d.*')` 等键。
