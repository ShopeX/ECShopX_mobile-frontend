# 变更摘要：内购 SKU 限购与弹层同步

## 涉及文件

- `src/components/sp-float-layout/index.js`
- `src/doc/goods.js`
- `src/subpages/purchase/espier-detail.js`
- `src/subpages/purchase/espier-detail.scss`
- `src/subpages/purchase/comps/comp-skuselect.js`
- `src/subpages/purchase/comps/comp-skuselect.scss`
- `src/subpages/purchase/index.js`

## 功能与逻辑

1. **`SpFloatLayout`**：`renderFooter` 支持 **函数**（`() => ReactNode`）或节点；为函数时在每次布局渲染时调用，避免底部栏闭包陈旧。

2. **`doc/goods.js`**
   - **`itemParams`**：`item_params ?? itemParams`，`concat` 前保证为数组；`GOODS_INFO` 产地仅在 `regionText` 非空时追加。
   - **`specItems`**（`GOODS_INFO` / `ESPIER_DETAIL_GOODS_INFO`）：增加 **`limitFee: 'limit_fee'`**，供 SKU 维度限购金额。

3. **内购详情 `espier-detail.js`**
   - **`enrichEspierPurchaseDetail`**：`itemParams` 在映射为空时从 **`raw.item_params ?? raw.itemParams`** 兜底。
   - **`resolvePurchaseLimitQty`**：多规格且已选 SKU 时优先 **`curItem.limitNum`**。
   - **`resolvePurchaseLimitAmountLine(info, curItem)`**：多规格优先 **`curItem.limitFee`**；`useMemo` 依赖 **`curItem`**。
   - **`CompSkuSelect`** 传入 **`selectedItem={curItem}`**，打开弹层时与详情已选 SKU 对齐。

4. **`comp-skuselect.js`**
   - **`resolvePurchaseLimitQty(info, curItem, type)`**：统一算基础限购后，**`addcart` / `fastbuy`** 仍可用 **`purlimitByCart` / `purlimitByFastbuy`** 覆盖展示与步进上限。
   - **`init` / `calcDisabled`**：支持 **`selectedItem`** 恢复规格；**`commit`** 控制是否 **`onChange`**（避免仅打开弹层时误推父级）；**`info` 变化**时 `commit: true`；**`open`** 时用父级 `selectedItem` 同步内部选中。
   - **`computePurchaseQtyLimits`**：以 **`resolvePurchaseLimitQty(..., type)`** 为基准生成 **`limitTxt` / `max`**。
   - **`renderSkuFooter`**：作为函数传给 **`SpFloatLayout`**；限购区 **`key`** 随 **`itemId`** 变化；**`picker`** 点确定前 **`confirmSelection`** 校验并 **`onChange`**。

5. **样式**：详情页与 SKU 弹层限购双列 **不换行 / 左右分布**（`nowrap`、`flex`、`gap`），避免长文案挤压错位。

6. **`purchase/index.js`**：内购首页 SKU 弹层同样传入 **`selectedItem={curItem}`**。

## 自检

- Lint：上述 JS 文件无新增告警（以 IDE 为准）。
- 建议在小程序验证：切换 SKU 后详情与弹层限购数量/金额、打开弹层与详情已选一致、加购/立即购上限与文案。
