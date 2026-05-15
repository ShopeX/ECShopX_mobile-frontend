# 变更摘要：内购活动列表与活动信息刷新

## 涉及文件

- `src/components/sp-purchase-enterprise-bar/index.js`
- `src/subpages/purchase/activity-list.js`
- `src/subpages/purchase/comps/comp-purchase-actionbar.js`
- `src/subpages/purchase/espier-index.js`
- `src/subpages/purchase/index.js`

## 行为说明

1. **企业条「更多活动」**（`SpPurchaseEnterpriseBar`）  
   跳转活动列表时 **去掉 `is_redirt=1`**，进入列表页后不再因「仅一条活动」被自动 `redirectTo` 进活动首页，用户可稳定看到列表。

2. **活动列表**（`activity-list.js`）  
   保留「仅一条且 URL 带 **`is_redirt`**」时的自动进入活动首页逻辑（供其它入口显式传参使用）。

3. **底部操作栏**（`comp-purchase-actionbar.js`）  
   增加 **`useDidShow`** 中调用 **`loadActivity()`**，从其它页返回时刷新活动数据，「分享亲友」等依赖活动的展示与活动页一致。

4. **内购购物车页**（`espier-index.js`）  
   抽取 **`loadActivityInfo`**（`useCallback`），在 **`useDidShow`** 与登录态变化后的展示路径中刷新分享活动信息；去掉调试 **`console.log`**。

5. **内购首页**（`purchase/index.js`）  
   **`fetchActivity`**：无 `activity_id` / `enterprise_id` 或接口失败时 **清空 `activityInfo`**。  
   **`useDidShow`**：合并隐私协议检查与 **`ensurePurchaseContext` + `fetchActivity`**，返回页面时重新拉取活动上下文与活动信息。

## 自检

- 未跑自动化测试；建议在小程序中验证：企业条进列表、带 `is_redirt` 的单活动跳转、首页/购物车返回后活动条与分享开关是否与后台一致。
