# 变更摘要：内购授权页邀请自动进入与分享落地页加载态

## 涉及文件

- `src/pages/purchase/auth.js`
- `src/pages/purchase/auth.scss`
- `src/pages/share-land.js`
- `src/subpages/i18n/lang/index.json`

## 功能与样式

1. **`purchase/auth`（口令落地 / 邀请场景）**
   - 新增 **`isAutoEntering`** 与 **`inviteAutoEnterRef`**：在已勾选协议、已登录、具备 **`invite_code` / `activity_id` / `enterprise_id`** 且未执行过自动逻辑时，若用户为 **亲友**（`userInfo.is_relative`）则 **`enterInviteActivity`**；若为 **新用户且非亲友** 则先 **`validateRelativeBind`**。
   - 自动流程期间 **`SpPage` `loading={isAutoEntering}`**；**`handlePasscodeLandingStart`** 在自动进入中直接 return，避免重复触发。
   - **`userInfo`** 从 selector 解构时不再带默认 `{}`，与 effect 里 `!userInfo` 判断一致。

2. **`purchase/auth.scss`**
   - 口令落地容器 **去掉默认绿色渐变背景**（与 `--with-bg` 等场景由背景图承担视觉一致）。

3. **`share-land.js`**
   - 跳转前由 **`return null`** 改为 **`SpPage` + `loading`**，避免白屏并统一加载表现。

4. **`subpages/i18n/lang/index.json`**
   - 新增若干 **zh-cn** 词条键（如商家标签、类目/说明类文案等），供组件或配置引用。

## 自检

- Lint：`auth.js`、`share-land.js` 无新增告警。
- 建议在小程序验证：带邀请参数登录后自动进入、协议未勾选不自动进入、分享落地页跳转前 loading 可见。
