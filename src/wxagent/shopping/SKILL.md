# 购物 SKILL（ECShopX 商城）

帮助用户在对话内用自然语言完成端到端购物：「找商品 → 看详情 → 选/填收货地址 → 生成订单 → 微信支付 → 支付成功」。下单与支付**全部在客户端运行时内完成**（对应运行机制：createOrder 建单 → 渲染订单卡 → payOrder 调 wx.requestPayment → 渲染支付结果）。

## 业务流程图

```
用户购物意图
  │
  ├─ 明确商品词（"拿铁""矿泉水"）──→ searchGoods → 商品列表卡片
  │                                                  │
  │                              用户点选某商品（卡片 sendFollowUpMessage 传 itemId）
  │                                                  ↓
  │                                          getGoodsDetail → 商品详情卡片
  │                                                  │
  │                          ┌───────────────────────┤
  │                          ↓                       ↓
  │                  无规格：用户点"立即购买"   有规格：点右上角进小程序详情页选规格
  │                          ↓
  │                     createOrder（需已有地址）→ 订单确认卡片（order-confirm-card）
  │                          │（缺地址则报错 → chooseAddress → 再 createOrder）
  │                          ↓
  │                  用户点卡片"确认支付" → payOrder（wx.requestPayment）
  │                          ↓
  │                     支付成功卡片（pay-success-card）
  │
  └─ 收货地址意图
       ├─ "我的收货地址" ──→ listAddresses → 地址卡片（选已有）
       └─ "换/填地址" ────→ chooseAddress（唤起系统地址选择器，存为默认）→ 地址卡片
```

> **Agent 不能凭空拿 itemId 直接 createOrder，也不能凭空拿 orderId 直接 payOrder。**
> **orderId 必须来自 createOrder 真实返回；payOrder 成功前禁止宣称「已支付/购买成功」。**

## 原子接口依赖关系

| 接口 | 作用 | 组件 | 前置条件 |
|------|------|------|----------|
| searchGoods | 按关键词搜索在售商品 | goods-list-card | 用户给出商品关键词 |
| getGoodsDetail | 查看商品详情与是否有规格 | goods-detail-card | 已有 itemId（来自 searchGoods） |
| listAddresses | 查看已有收货地址 | address-card | 已登录（自动登录） |
| chooseAddress | 系统选择器选/填地址并存为默认 | address-card | 已登录；用户需新增/更换地址 |
| createOrder | 建 fastbuy 购物车并**真实创建订单** | order-confirm-card | 已确认 itemId/数量；**用户已有收货地址** |
| payOrder | 取微信支付参数并 **wx.requestPayment 支付** | pay-success-card | 已有来自 createOrder 的真实 orderId |

## 业务约束（跨接口铁律）

### 1. 输出形态
- 成功返回（isError=false）且绑定组件的接口，**必须展示卡片**，禁止把商品/价格/地址/订单详情以 markdown 列表展开。
- 可附一句简短引导话术（如「订单已生成，点『确认支付』完成支付」），详情数据交给卡片。

### 2. 执行顺序与成单/支付边界
- `getGoodsDetail` 必须在拿到 `searchGoods` 的 itemId 后调用；`createOrder` 必须在确认具体 itemId 后调用；`payOrder` 必须在 `createOrder` 返回真实 orderId 后调用。
- `createOrder` / `payOrder` 属动作类接口，不要并发；一次处理一笔。
- **成单与支付分两步**：`createOrder` 成功 = 订单已创建但**未支付**；只有 `payOrder` 成功（wx.requestPayment 成功）才算支付完成。**在 `payOrder` 成功返回前，任何情况下禁止宣称「已支付 / 购买成功 / 已为您买好」。**
- `payOrder` 是真实交易，**禁止 mock 成功**；用户取消或失败时接口返回 isError，应引导用户重新点「确认支付」。

### 3. 数据来源
- `itemId` 取自 `searchGoods`/`getGoodsDetail` 真实返回；`orderId` 取自 `createOrder` 真实返回；`addressId` 取自 `listAddresses`/`chooseAddress`。一律禁止从用户措辞推断或编造。
- 上下文无可用 itemId 时，先 `searchGoods` 让用户从卡片点选。

### 4. 规格商品
- `getGoodsDetail` 返回 `hasSku=true` 时，须先让用户选规格：引导用户点卡片右上角进入小程序商品详情页选规格下单；不要用未选规格的代表 itemId 直接 `createOrder`。

### 5. 地址处理（createOrder 的硬前置）
- ECShopX 创建订单必须带收货地址。`createOrder` 不传 `addressId` 时用默认地址；**用户没有任何地址时 `createOrder` 会报错**——此时先调 `chooseAddress`（唤起系统地址选择器并存为默认），再重试 `createOrder`，不要在无地址时反复重试。
- 用户想从已有地址里挑 → `listAddresses`，把所选 `addressId` 传给 `createOrder`。

### 6. 库存
- `createOrder` 会校验库存，库存不足返回 isError，引导用户减少数量或换商品。

### 7. 支付方式（运行时自适应）
- `createOrder` 会按门店实时拉取 `/trade/payment/list`（platform=wxMiniProgram）解析可用微信支付方式（兼容原生 wxpay 与 adapay/bspay 聚合的 wx_lite 渠道），并把 `payType/payChannel` 透传给订单卡片 → `payOrder`。Agent 无需关心支付渠道细节。
- `isNostores` 字段按部署版本自适应：平台版（APP_PLATFORM=platform）不传，其余版本传 0。

## 用户意图分流

### 直接意图（触发本 SKILL）
- 「我想买…」「有没有…」「…多少钱」「来一份…」「看看…」「下单」「买它」「付款/支付」
- 「我的收货地址」「换个地址」「寄到…」

### 意图分流规则
- 用户说出具体商品词/品类 → `searchGoods`。
- 用户从列表卡片点选或说「看第一个/要那个矿泉水」→ `getGoodsDetail`（itemId 由卡片 sendFollowUpMessage 传入）。
- 商品无规格且用户确认购买 → `createOrder`（无地址则先 `chooseAddress`）。
- 用户点订单卡「确认支付」或说「去支付」→ `payOrder`（orderId 由卡片传入）。
- 「我的地址」→ `listAddresses`；「换/填地址」→ `chooseAddress`。
- 表达歧义（「那个」「之前那款」）且上下文无可用 itemId/orderId → 先反问澄清，禁止猜测。

## content 写法
原子接口返回的 `content` 面向模型，采用「先陈述事实、再给下一步动作」两段式，例如「订单已生成 → 接下来展示订单卡片引导用户确认支付」。不要写缺少上下文的裸指令，也不要重复卡片里已有的明细。
