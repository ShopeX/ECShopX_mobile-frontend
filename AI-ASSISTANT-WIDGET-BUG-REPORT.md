# AI 助手 Widget 鉴权问题 Bug 报告

> 反馈对象：AI 助手 widget 团队 / AI 助手后端团队
> 反馈方：ecshopx-vshop 接入方
> 时间：2026-04-27

---

## 一、问题摘要

ecshopx-vshop（H5 商城）已按照接入文档完成 widget 注入和 `setEcshopxAuth()` 调用，但 **AI 助手始终把已登录用户识别为「游客」**，且伴随 SSE 探测接口的重试风暴。

经过完整端到端排查，问题不在 vshop 接入侧，而在 **`widget-h5.js` 自身的 HTTP 请求实现**：token 虽然被写入 `sessionStorage.ecshopx_token`，但发起 `/api/chat` 请求时没有把 token 拼到任何后端可识别的位置。

---

## 二、环境信息

| 项 | 值 |
|---|---|
| widget 脚本 | `http://assistant.test/ai-assistant-embed/widget-h5.js` |
| 后端 API | `https://ai-dev-assistantapi.shopex123.com` |
| tenant_app_id | `2dde541b38a511f1929d0242ac170002` |
| company_id | `38` |
| distributor_id | `129` |
| 接入页面 Origin | `http://127.0.0.1:10087` |
| 用户身份 | 已登录会员（user_id=1170, company_id=38），持有有效 ecshopx JWT |

---

## 三、Bug A：`/api/chat/stream/probe` 缺少 `tenant_app_id` query 参数 → 400 重试风暴

### 现象

打开 widget、点击任意快捷提示后，DevTools Network 持续刷出：

```
GET https://ai-dev-assistantapi.shopex123.com/api/chat/stream/probe  400 (Bad Request)
```

且因为前端无重试上限保护，会在短时间内发出数百次相同请求。

### 复现 curl

**实际 widget 发出的请求（不带 query）：**

```bash
curl -i 'https://ai-dev-assistantapi.shopex123.com/api/chat/stream/probe' \
  -H 'Origin: http://127.0.0.1:10087'
```

返回：

```http
HTTP/1.1 400
{"code":400,
 "message":"tenant_app_id is required (or enable ai-assistant.workspace-security.single-tenant-fallback-enabled for single-tenant mode)",
 "reason":"missing_tenant_id"}
```

**带上 query 后正常：**

```bash
curl -i 'https://ai-dev-assistantapi.shopex123.com/api/chat/stream/probe?tenant_app_id=2dde541b38a511f1929d0242ac170002' \
  -H 'Origin: http://127.0.0.1:10087'
```

返回：

```http
HTTP/1.1 200
X-SSE-Enabled: true

{"sse":true}
```

### 期望修复

`widget-h5.js` 的 `isSseEnabled()` 在 GET probe 时，应从 `sessionStorage.ai_assistant_tenant_id` 读取 tenant_app_id，并以 query 形式拼接。同时建议在 widget 内置 SSE 探测重试上限和退避机制，避免在后端持续报错时形成重试风暴。

---

## 四、Bug B（核心）：`/api/chat` 后端永远把已登录用户识别为「游客」

### 现象

ecshopx-vshop 已按文档完成接入：

```js
window.__AI_ASSISTANT_EMBED__.setEcshopxAuth(jwt, {
  tenantId: '2dde541b38a511f1929d0242ac170002',
  companyId: '38',
  distributorId: '129',
});
```

注入后，sessionStorage 中均已正确写入：

```
sessionStorage.ecshopx_token         = <626 字符的纯 JWT>
sessionStorage.ai_assistant_tenant_id = 2dde541b38a511f1929d0242ac170002
sessionStorage.ecshopx_company_id    = 38
sessionStorage.ecshopx_distributor_id = 129
```

但任何对话都会得到回复：

> "您当前是未登录游客（系统返回 404）..."

### 浏览器抓到的 widget 实际请求

通过 fetch hook 抓取，widget 实际发出的请求结构为：

```
POST https://ai-dev-assistantapi.shopex123.com/api/chat
Headers:
  Content-Type: application/json
   ←  没有任何 Authorization / X-Token / Cookie 等鉴权头
Body:
  {
    "token": "<完整 JWT>",
    "tenant_app_id": "2dde541b38a511f1929d0242ac170002",
    "company_id": "38",
    "distributor_id": "129",
    "source_system": "ecshopx",
    "message": "..."
  }
```

也就是说 **token 仅出现在 JSON body 里，HTTP 头部没有任何鉴权信息**。

### 后端实际行为：body 里的 token 完全被忽略

下面是穷举测试，全部使用同一个有效 JWT，仅改变 token 的传递位置，看后端是否识别为已登录会员：

| # | 测试姿势 | 后端识别 |
|---|---|---|
| 1 | body 带正确 token（widget 当前实现） | ❌ 游客 |
| 2 | body 不带 token | ❌ 游客 |
| 3 | body token 为空字符串 | ❌ 游客 |
| 4 | `Authorization: Bearer <jwt>` | ❌ 游客 |
| 5 | `Authorization: <jwt>` 裸值 | ❌ 游客 |
| 6 | `X-Token: <jwt>` | ❌ 游客 |
| 7 | `X-Auth-Token: <jwt>` | ❌ 游客 |
| 8 | `token: <jwt>` | ❌ 游客 |
| 9 | `Cookie: ecshopx_token=<jwt>` | ❌ 游客 |
| 10 | `X-Ecshopx-Token: <jwt>` | ❌ 游客 |

**结论：1～3 证明后端没读 body 里的 `token` 字段；4～10 证明常见 header / cookie 命名也不通。**

测试 1 的 curl（精确还原 widget 当前请求）：

```bash
TOKEN='<有效 ecshopx JWT>'
curl 'https://ai-dev-assistantapi.shopex123.com/api/chat?tenant_app_id=2dde541b38a511f1929d0242ac170002' \
  -H 'Origin: http://127.0.0.1:10087' \
  -H 'Content-Type: application/json' \
  --data-binary "{\"token\":\"$TOKEN\",\"tenant_app_id\":\"2dde541b38a511f1929d0242ac170002\",\"company_id\":\"38\",\"distributor_id\":\"129\",\"source_system\":\"ecshopx\",\"message\":\"我登录了吗\"}"
```

返回的 LLM 回复明确说 `get_member_info` 返回 404（未登录）。

### 推断的根因

1. AI 助手后端（或其调用的 ecshopx 业务后端 `get_member_info` tool）期望从 **HTTP Header** 拿 token；
2. 但 `widget-h5.js` 在发起 `/api/chat` 时只把 token 放进了 body 字段；
3. 协议两端对不上，导致后端永远拿不到身份。

### 期望修复（任一方修复即可，但建议 widget 侧）

**方案 A（推荐，widget 侧修）：**
`widget-h5.js` 在发起所有 `/api/chat` 及相关后端请求时，把 `sessionStorage.ecshopx_token` 同步设置到 HTTP 请求头，例如：

```http
Authorization: Bearer <jwt>
```

或后端约定的任何统一头名。**body 里的 `token` 字段建议保留以兼容旧版，但 header 必须带上**。

**方案 B（后端侧修）：**
后端在鉴权过滤器里增加从 JSON body 的 `token` 字段读取 token 的能力，作为 Header 缺失时的兜底。

我们倾向 A，因为：
- 标准 RESTful 鉴权惯例都是 Header；
- 后端如果走 Spring Security 这类标准框架，从 body 读 token 需要预读流，改动成本远高于 widget 侧。

---

## 五、ecshopx-vshop 接入侧已确认正确

为避免来回扯皮，下面是 vshop 这一侧的接入实现和验证证据。

### 注入代码 (src/components/sp-ai-assistant-fab/index.jsx)

```js
const syncMemberTokenToAssistantWidget = () => {
  const rawToken = Spx.getAuthToken();
  const pureJwt = extractPureJwt(rawToken); // 已剥掉 {"data":"..."} 包装
  const tenantId = process.env.APP_AI_TENANT_ID;
  const companyId = process.env.APP_COMPANY_ID;
  const distributorId = window?.distributor_info?.distributor_id;

  if (window.__AI_ASSISTANT_EMBED__?.setEcshopxAuth && pureJwt) {
    window.__AI_ASSISTANT_EMBED__.setEcshopxAuth(pureJwt, {
      tenantId, companyId, distributorId,
    });
  }
};
```

### 浏览器实测（已登录状态）

```js
> localStorage.token
{"data":"eyJ0eXAiOiJKV1Q...sw"}

> sessionStorage.ecshopx_token
"eyJ0eXAiOiJKV1Q...sw"   ← 纯 JWT，无 wrapper，长度 626

> sessionStorage.ai_assistant_tenant_id
"2dde541b38a511f1929d0242ac170002"

> sessionStorage.ecshopx_company_id
"38"

> sessionStorage.ecshopx_distributor_id
"129"

> Object.keys(window.__AI_ASSISTANT_EMBED__)
['setEcshopxAuth', 'setAssistantTenantId', 'setAssistantAgentId',
 'setAssistantContextPassthrough', 'clearEcshopxAuth',
 'EVENT_TENANT_UNAVAILABLE', 'EVENT_TOKEN_QUOTA_EXCEEDED',
 'EVENT_ECSHOPX_AUTH_UPDATED']
```

vshop tenant_app_id 全部正确写入 widget 的 sessionStorage。

---

## 六、需要 widget / AI 助手后端团队回复的问题

1. **`/api/chat` 期望的 token 传递位置是？**
   Header 名？query 名？还是其他？请给出明确的请求示例（curl 或 fetch 代码）。

2. **`/api/chat/stream/probe` 为什么不带 tenant_app_id 时返回 400？**
   widget 当前实现没拼 query，是 widget bug 还是后端配置问题（`single-tenant-fallback-enabled` 是否需要打开）？

3. **`widget-h5.js` 是否有最新版本？**
   我们使用的是 `http://assistant.test/ai-assistant-embed/widget-h5.js`，请确认是否为生产 / 最新版本，是否已经修复上述两个问题。

4. **是否有 widget 调用与后端通信的协议文档？**
   方便我们核对 vshop 这一侧是否还有其他可以协助修复的点（虽然目前看下来不是 vshop 的问题）。

---

## 附录：完整 curl 测试脚本

```bash
#!/bin/bash
TOKEN='<在浏览器执行 sessionStorage.ecshopx_token 拷出>'
PAYLOAD='{"tenant_app_id":"2dde541b38a511f1929d0242ac170002","company_id":"38","distributor_id":"129","source_system":"ecshopx","message":"我登录了吗？只答\"已登录\"或\"游客\""}'

run() {
  local label="$1"; shift
  echo "=== $label ==="
  curl -s "https://ai-dev-assistantapi.shopex123.com/api/chat?tenant_app_id=2dde541b38a511f1929d0242ac170002" \
    -H 'Origin: http://127.0.0.1:10087' \
    -H 'Content-Type: application/json' \
    "$@" \
    --data-binary "$PAYLOAD" \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['message'][:120])"
  echo ""
}

run "[1] body 带 token" --data-binary "{\"token\":\"$TOKEN\",\"tenant_app_id\":\"2dde541b38a511f1929d0242ac170002\",\"company_id\":\"38\",\"distributor_id\":\"129\",\"source_system\":\"ecshopx\",\"message\":\"我登录了吗\"}"
run "[2] Authorization Bearer"   -H "Authorization: Bearer $TOKEN"
run "[3] Authorization 裸值"     -H "Authorization: $TOKEN"
run "[4] X-Token"                -H "X-Token: $TOKEN"
run "[5] X-Auth-Token"           -H "X-Auth-Token: $TOKEN"
run "[6] token header"           -H "token: $TOKEN"
run "[7] Cookie"                 -H "Cookie: ecshopx_token=$TOKEN"
run "[8] X-Ecshopx-Token"        -H "X-Ecshopx-Token: $TOKEN"
```

