# i18n src 目录 Todolist

> **扫描说明**（生成时规则）：统计 `src/` 下后缀为 `.js`、`.jsx`、`.tsx`、`.vue` 的文件；**不包含** `src/i18n/locales/*.json`（翻译结果文件）。**合计 1327 个文件**。

---

## 第一优先级: subpages/ 目录 (681 文件)

- [completed] **batch-1-1** — subpages/salesman/ (102) — `scan_i18n_status.py` 目录扫描：未翻译完 0、`batch-1-1_src_subpages_salesman.md` 已更新；`cancel.js` / `comps/comp-shop-list.js` / `comps/comp-tradecancel.js` / `distribution/shop-home.js` 已处理（接口 `cancel_reason` 仍为中文语义，源码用 Unicode 转义 + `AtTag.name` 用 i18n key）
- [in_progress] **batch-1-2** — subpages/guide/ (87) — 已清空 9 个页面 `*.config.js` 导航标题并在页内 `Taro.setNavigationBarTitle` + `$t`；`item/list.js` 筛选项与 `item/package-list.js` 加载/空态文案已接 i18n；`item/espier-detail.js` 导航与 `fetch` 空数据保护已调整。详见 `batch-1-2_src_subpages_guide.md`（未翻译完约 46）
- [pending] **batch-1-3** — subpages/community/ (72)
- [pending] **batch-1-4** — subpages/mdugc/ (53)
- [pending] **batch-1-5** — subpages/purchase/ (52)
- [pending] **batch-1-6** — subpages/dianwu/ (50)
- [pending] **batch-1-7** — subpages/trade/ (36)
- [pending] **batch-1-8** — subpages/store/ (33)
- [pending] **batch-1-9** — subpages/components/ (31)
- [pending] **batch-1-10** — subpages/delivery/ (27)
- [pending] **batch-1-11** — subpages/auth/ (22)
- [pending] **batch-1-12** — subpages/member/ (19)
- [pending] **batch-1-13** — subpages/item/ (18)
- [pending] **batch-1-14** — subpages/merchant/ (17)
- [pending] **batch-1-15** — subpages/marketing/ (16)
- [pending] **batch-1-16** — subpages/ecshopx/ (10)
- [pending] **batch-1-17** — subpages/pointshop/ (10)
- [pending] **batch-1-18** — subpages/game-activity/ (9)
- [pending] **batch-1-19** — subpages/case/ (6)
- [pending] **batch-1-20** — subpages/prescription/ (5)
- [pending] **batch-1-21** — subpages/doc/ (4)
- [pending] **batch-1-22** — subpages/i18n/ (2)

## 第二优先级: pages/ 目录 (129 文件)

- [pending] **batch-2-1** — pages/home/ (55)
- [pending] **batch-2-2** — pages/cart/ (28)
- [pending] **batch-2-3** — pages/category/ (12)
- [pending] **batch-2-4** — pages/purchase/ (5)
- [pending] **batch-2-5** — pages/member/ (4)
- [pending] **batch-2-6** — pages/recommend/ (4)
- [pending] **batch-2-7** — pages/floorguide/ (3)
- [pending] **batch-2-8** — pages/article/、chat/、custom/、index/、item/、liveroom/、landing/ 及 pages 根目录零散文件 (18)

## 第三优先级: marketing/ 目录 (135 文件)

- [pending] **batch-3-1** — marketing/pages/

## 第四优先级: components/ 目录 (142 文件)

- [pending] **batch-4-1** — components/

## 第五优先级: api/ 目录 (41 文件)

- [pending] **batch-5-1** — api/

## 第六优先级: subpage/ 目录 (46 文件)

- [pending] **batch-6-1** — subpage/pages/

## 第七优先级: 基础设施与其它 (153 文件)

- [pending] **batch-7-1** — utils/ (30)
- [pending] **batch-7-2** — others/ (22)
- [pending] **batch-7-3** — hooks/ (19)
- [pending] **batch-7-4** — doc/ (17)
- [pending] **batch-7-5** — store/ (15)
- [pending] **batch-7-6** — boost/ (14)
- [pending] **batch-7-7** — service/ (9)
- [pending] **batch-7-8** — plugin/ (8)
- [pending] **batch-7-9** — hocs/ (7)
- [pending] **batch-7-10** — consts/ (3)
- [pending] **batch-7-11** — groupBy/ (2)
- [pending] **batch-7-12** — i18n/（源码，不含 locales）(2)
- [pending] **batch-7-13** — lang/ (2)
- [pending] **batch-7-14** — spx/ (1)
- [pending] **batch-7-15** — src 根目录（如 app.js、app.config.js）(2)

## 收尾

- [pending] **final-verify** — 最终验证：`npm run i18n:check`、抽测中英文阿切换、补全 `src/i18n/locales` 缺失 key

---

## 状态说明

- `[in_progress]` — 进行中
- `[pending]` — 未开始
- `[completed]` — 已完成

## 数量校验

681 + 129 + 135 + 142 + 41 + 46 + 153 = **1327**
