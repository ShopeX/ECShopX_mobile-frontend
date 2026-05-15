# 变更摘要：活动列表进入活动支持 redirectTo

## 文件

- `src/subpages/purchase/activity-list.js`

## 说明

- **`onClickChange(item, type)`** 增加可选第二参数；在拼好目标 `url`（口令校验分支与首页分支统一）后，若 **`type === 'redirectTo'`** 则 **`Taro.redirectTo`**，否则 **`Taro.navigateTo`**。
- 与列表首屏「仅一条活动且带 `is_redirt`」时调用 **`onClickChange(_list[0], 'redirectTo')`** 的行为一致，避免栈底仍保留活动列表导致返回路径不符合预期。

## 自检

- 建议在小程序中验证：普通点击活动为 `navigateTo`；单活动自动进入为 `redirectTo`；开启口令且未验证时跳转口令页两种入口均正常。
