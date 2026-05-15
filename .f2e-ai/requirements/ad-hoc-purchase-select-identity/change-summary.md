# change-summary

## 需求与计划摘要

本地迭代，无对应 `plan.md`。企业购「选择身份」页：在用户选定企业时把当前企业名称写入 Redux，供后续页面展示；并暂时下线「添加身份」入口（逻辑与 UI 注释保留便于恢复）。

## 改动范围

| 文件 | 说明 |
|------|------|
| `src/subpages/purchase/select-identity.js` | 引入并 `dispatch(updateCurEnterpriseName(...))`：单身份自动跳转分支写入 `_identity[0]?.name`；列表点击分支从 `handleItemClick` 解构 `name` 并写入。`onAddIdentityChange` 与底部「添加身份」区块改为注释。 |

## 关键逻辑或接口变化

- 依赖 `@/store/slices/purchase` 已有 `updateCurEnterpriseName` reducer（本次未改 slice）。
- 列表项需传入 `name`（与现有 `enterprise_id` 一并来自 identity 数据）。

## 测试与验收情况

- 未跑自动化测试；建议在「多企业 → 选一项进活动列表」与「仅一个企业自动跳转」两条路径确认活动页等消费 `curEnterpriseName` 的展示正确。
- 确认产品侧接受暂时隐藏「添加身份」入口。

## 遗留问题与后续建议

- 「添加身份」为注释代码，若长期不需要可删除并清理样式类引用，避免死代码堆积。

---

## 2026-05-09：小程序真机列表区域不展示

### 原因简述

内层 `scroll-view` 使用 `flex: 1` + `height: 0` 在微信真机上易被算成高度为 0，列表看起来像样式未生效。

### 改动范围

| 文件 | 说明 |
|------|------|
| `src/subpages/purchase/select-identity.js` | 移除内层 `ScrollView`，列表由普通 `View` 承载，滚动交给 `SpPage` 外层。 |
| `src/subpages/purchase/select-identity.scss` | 删除 `.select-identity__scroll`；`.select-identity__inner` 改为仅宽度与内边距，不再用 `flex:1`/`min-height:0` 配合内层滚动。 |

### 行为变化

- 企业较多时：标题栏「选择企业」会随页面一起滚动；底部「确认」仍为 `fixed`。

### 测试

- 未跑自动化；建议在小程序真机确认多企业列表可见、可滚动、确认按钮可点。

---

## 2026-05-09：活动信息入 Redux、口令页校验与发邮件参数

### 改动范围

| 文件 | 说明 |
|------|------|
| `src/store/slices/purchase.js` | 新增 `curActivityInfo` 与 `updateCurActivityInfo`。 |
| `src/pages/purchase/auth.js` | 拉取活动详情后 `dispatch(updateCurActivityInfo(data))`。 |
| `src/subpages/purchase/select-company-passcode.js` | 用 `getEmployeeActivitydata` 校验 `passphrase_user_verified`，已验证则 `redirectTo` 活动首页；加载态 `SpLoading`；拉取后写入 `updateCurActivityInfo`；缺参时结束 loading 避免白屏转圈。 |
| `src/subpages/purchase/select-company-email.js` | 发验证码参数改为带 `enterprise_id`（格式修正）。 |

### 自检补充（Agent）

- 口令页仅用 Redux 展示海报时需在本次请求的回调里 `dispatch(updateCurActivityInfo)`，否则直连口令页无背景图。
- `activity_id` / `enterprise_id` 缺失时需 `setLoading(false)`，否则会一直 Loading。
