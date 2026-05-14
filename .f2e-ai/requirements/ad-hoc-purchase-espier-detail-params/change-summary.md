# 变更摘要：内购详情 espier-detail（商品参数与相关 UI）

## 范围

- `src/subpages/purchase/espier-detail.js`
- `src/subpages/purchase/espier-detail.scss`

## 功能与逻辑

1. **商品参数（对齐普通商品 espier-detail）**
   - 引入 `AtFloatLayout`、`AtButton`；状态增加 `isParameter`，`handleGoodsParamsFlatClose` 切换浮层。
   - 规格/配送区块下方展示 **`goods-params-flat`**（横向参数 + 箭头），点击打开 **「商品参数」** 浮层，列表 +「确认」关闭。
   - **`displayItemParams`**：`useMemo` 从 `info.itemParams` 过滤，仅保留 **`attribute_value_name` 有有效内容**（非空、非纯空格）的项；横条与浮层均以该列表为准，**无有效项时不展示整块参数 UI**。

2. **图下标题区**
   - 主标题改为与普通商详一致的 **`goods-name-wrap` / `goods-name` / `title`** 结构；有 **`info.brief`** 时在标题下展示 **`brief`**。
   - 样式侧补充 **`espier-detail-hero-info__subtitle`**（说明类副标题，与 `.goods-name .brief` 区分用途）。

3. **规格卡片（内购）**
   - 去掉相邻 `SpCell` 之间的底部分割线（`:not(:last-child)` border）。
   - 规格行右侧值区域：**左对齐**（`justify-content: flex-start`），去掉值文本右对齐，与选择类 Cell 展示一致。

4. **样式**
   - **`goods-params-flat`**：与内购页左右 **32px** 边距统一（`margin: 0 32px 24px`、`width: calc(100% - 64px)`）；参数项 **`.attribute`** 不再写死 `width: 160px`，避免与弹性布局冲突。
   - 浮层内 **`.product-parameter`** 等与商详一致的列表样式。

## 自检

- Lint：`espier-detail.js` 无新增告警（以 IDE 为准）。
- 未跑 E2E；建议在小程序端确认：有/无 `itemParams`、全部无 `attribute_value_name`、部分有值时的横条与浮层行为。
