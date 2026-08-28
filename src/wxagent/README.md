# 微信小程序 AI 开发模式（购物 SKILL）联调说明

本目录是「微信小程序 AI 开发模式（beta）」的原生 SKILL 代码，**不经过 Taro/webpack 编译**，由 `config/index.js` 在 weapp 构建时原样拷贝进 `dist/wxagent`。仅当环境变量 `APP_WX_AGENT=true` 时才参与构建，默认产物与正式包完全一致。

## 一、出包

```bash
# 在项目根目录（ecshopx-vshop）执行
APP_WX_AGENT=true APP_PLATFORM=standard APP_BASE_URL=https://你的域名/api/h5app/wxapp \
  npm run build:weapp
```

- `APP_WX_AGENT=true`：开启 AI SKILL 拷贝与 `app.json` 的 `agent` 声明（不开则一切照旧）。
- `APP_PLATFORM`：部署版本（standard / platform / b2c …）。构建期注入 `wxagent/shopping/lib/config.js`，决定 `createOrder` 是否传 `isNostores`（platform 版不传）。
- `APP_BASE_URL`：ecshopx-api 基地址（含 `/wxapp` 前缀，无尾斜杠）。构建期注入同一文件，作为原子接口请求根地址。

> 未注入 `APP_BASE_URL` 时，`lib/config.js` 兜底为 `https://demo-ecshopx.ishopex.cn/api/h5app/wxapp`，仅供本地临时联调，正式出包务必显式传入。

## 二、验证

1. 用**微信开发者工具**打开 `dist/`，确认 `dist/wxagent/` 已生成，且 `dist/app.json` 含 `agent` 字段与独立分包 `wxagent`。
2. 进入小程序 AI 开发模式调试，按对话链路逐步验证：
   - 「我想买矿泉水」→ `searchGoods` → 商品列表卡片
   - 点某商品 → `getGoodsDetail` → 商品详情卡片 →「立即购买」
   - 无地址时 `createOrder` 报错 → `chooseAddress` 选地址 → 重试 `createOrder` → 订单确认卡片
   - 点「确认支付」→ `payOrder` 调起微信收银台 → 支付成功卡片
3. `company_id` / `appid` 来自 `src/ext.json`（`wx.getExtConfigSync`），登录态与小程序共用 storage 的 `token` 键。

## 三、链路与后端接口（全部复用现有 ecshopx-api）

| 原子接口 | 后端接口 | 说明 |
|----------|----------|------|
| searchGoods | `GET /goods/items` | 关键词搜索 |
| getGoodsDetail | `GET /goods/items/{id}` | 商品详情/规格 |
| listAddresses | `GET /member/addresslist` | 已有地址 |
| chooseAddress | `wx.chooseAddress` + `POST /member/address` | 系统选择器选址并存为默认 |
| createOrder | `POST /cart`(fastbuy) + `POST /order_new` | 真实建单；支付方式由 `GET /trade/payment/list` 实时解析 |
| payOrder | `POST /payment` + `wx.requestPayment` | 取微信支付参数并拉起收银台 |

> 支付为真实交易，禁止 mock；`createOrder` 仅代表订单已创建未支付，`payOrder` 成功才算支付完成。

## 四、回退

不带 `APP_WX_AGENT=true` 出包即可：不拷贝本目录、不声明 `agent`，对正式审核版本零影响。
