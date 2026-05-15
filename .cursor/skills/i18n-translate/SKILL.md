---
name: i18n-translate
description: 按计划文件顺序逐文件完成 i18n（哈希键 + @/i18n 的 $t/ti，禁止页面使用 globalThis.$t），维护 subpages/i18n/locales 三语，并在对应 plan 中更新进度与统计。用户说「按计划做 i18n」「继续翻译 plans」时触发。
---

# i18n Translate

## Overview

本技能有两层含义：

1. **执行方式（主流程）**：严格按 `.cursor/skills/i18n-translate/plans/` 下各 Markdown **计划文件**的顺序，**逐个**处理其中 **「未翻译完」** 列表里的源文件；每完成一个文件，**立即**在同一份计划里更新进度（列表迁移 + 统计表）。
2. **翻译规则（技术细节）**：将 `src/` 下面向用户的中文替换为 **脚本生成的哈希键**，接入 **i18next + react-i18next**（`@/i18n`），并维护 **zhcn / en / ar** 三份 locale；具体规则见下文「翻译规则与技术步骤」。

**本仓库为 Taro + React**：文案资源在 **`src/subpages/i18n/locales/*.json`**，运行时用 `syncI18nLanguage` 等与 Taro 存储 `lang`（`zhcn` | `en` | `ar`）对齐并注入 i18next（见 `src/i18n/instance.js`）。**新代码一律用 `@/i18n`，不要在页面/组件里写 `globalThis.$t`**；`src/lang/index.js` 里对 `globalThis.$t` 的挂载仅作历史兼容，不作为本技能推荐的取词方式。

---

## 主流程：按计划顺序翻译并回写进度

### 1) 计划文件顺序

- 范围：`.cursor/skills/i18n-translate/plans/` 下所有 **`*.md`** 计划文件（不含子目录若有则同样纳入；通常仅一层）。
- **顺序**：按文件名的 **字典序升序**（例如 `batch-1-1_*.md` → `batch-1-2_*.md` → … → `batch-7-15_*.md`）。不要跳号、不要凭主观挑批次。
- 对每个计划文件 **从头到尾**处理完其「未翻译完」队列后，再进入 **下一个**计划文件。

### 2) 从计划文件中读取信息

每个计划 Markdown 顶部通常包含：

- **`**扫描目录**:`** 后接绝对路径（或可复制到本机的路径）——这是列表里相对路径的 **根目录**。
- **`**报告文件**:`** 当前文件名，便于自检。

列表中的条目形如 `` `components/foo.js` ``，**相对路径相对于「扫描目录」**。磁盘上的源文件路径为：

`{扫描目录规范化后}/{列表中的相对路径}`

（路径拼接时去掉重复斜杠；Windows 环境按本机实际分隔符处理。）

### 3) 工作队列：只处理「未翻译完」

- 仅处理 `## 未翻译完` 小节下的条目，**按文件中出现的先后顺序**（从上到下）**一次一个源文件**。
- 不要打乱顺序去先挑「简单的文件」；用户要求的是 **顺序逐个**完成。
- `## 已翻译`、`## 无需翻译` 仅作记录，**不要**把其中的文件再次当作待译任务，除非用户明确要求复查。

### 4) 单文件完成后：更新**同一份**计划 Markdown

每当你确认某个源文件已按本技能「翻译规则与技术步骤」完成（用户可见中文已走 `$t`/`ti` 等，locale 已写），**必须**立刻编辑 **当前正在执行的那份** `plans/*.md`：

1. **从 `## 未翻译完`** 中 **删除**对应那一行（整行 `- \`path\``）。
2. **向 `## 已翻译`** 中 **追加**同一相对路径的一行，格式与原有列表一致：`- \`path\``。
3. 若 `## 已翻译` 原先仅有「（无）」占位，删除「（无）」，改为正常的 bullet 列表。
4. **重算 `## 统计` 表格**：
   - `未翻译完`、`已翻译`、`无需翻译` 的数量 = 各小节下有效条目数（排除空行、排除单独的「（无）」）。
   - `合计` = 三者之和。
   - `占比` = 该项数量 / 合计 × 100%，保留一位小数，与现有表格风格一致（如 `44.8%`）。

**不要**只改代码而不改计划文件；**不要**把已完成文件仍留在「未翻译完」里。

### 5) 会话与续跑

- 用户说「继续翻译」「接着 plans」时：从 **字典序第一个**仍含有「未翻译完」条目的计划文件开始；在该文件内从 **仍列在未翻译完中的第一条**做起。
- 若某个计划文件的「未翻译完」已空，跳过该文件，进入下一个计划文件。

### 6) 与扫描/重新生成计划的关系

- 计划文件由扫描脚本生成或人工维护；**本技能默认以计划为权威队列**。
- 若代码变更导致「已译/未译」与计划不一致，完成当前文件后应以 **实际代码状态**为准更新计划列表与统计，并在必要时注明（用户可见的简短说明即可）。

---

## 翻译规则与技术步骤

### A) Scope and Scan

- 默认只改 `src/` 下文件（计划中的路径已相对于各批次的扫描根目录）。
- 可用 `rg -n "[\u4e00-\u9fff]" <文件或目录>"` 辅助确认残留中文。
- **不要翻译注释**中的中文。忽略 `//`、`/* */`、`<!-- -->` 内的中文。
- 日志中的中文除非明确要求面向用户，否则不译。

### B) Decide What to Translate（跳过「代码登记」类中文）

**要译**：模板文案、按钮、占位与提示、校验与 `$message` / `$confirm` 文案、表格列标题与操作名等 UI 字符串。

**不译**：作标识符、枚举、后端码、接口参数字段、switch 比较值、数据集 key 等必须稳定的中文字符串；调试日志（除非产品要求）；品牌名等专有名词。

不确定时 **宁可不译**，可在对话中简短说明。

### C) Generate Keys（哈希规则）——必须用脚本

**禁止手搓哈希键。**

键格式：`{file_hash}.{text_hash}`

- `file_hash` = 源文件路径的 md5，取前 8 位十六进制  
- `text_hash` = 中文文本的 md5，取前 6 位十六进制  

在仓库根目录执行：

```bash
python3 .cursor/skills/i18n-translate/scripts/gen_i18n_key.py --path "src/..." --text "中文文本"
```

批量建议 JSONL：

```bash
cat << 'EOF' | python3 .cursor/skills/i18n-translate/scripts/gen_i18n_key.py --jsonl
{"path":"src/views/xxx.vue","text":"文本1"}
{"path":"src/views/xxx.vue","text":"文本2"}
EOF
```

### D) 代码中替换（新翻译方式：仅 `@/i18n`）

- **统一入口**：`import { useTranslation, $t, ti } from '@/i18n'`（按需增删命名导出）。需要随语言刷新时，在组件内调用 `const { i18n } = useTranslation()`。
- **展示文案**：一律 `$t('哈希键')` 或 `ti('哈希键', [arg0, arg1])`（占位符 `${0}`、`${1}`… 与数组下标对应）。**不要**在业务代码里使用 `globalThis.$t(key, 中文, 'lang')` 或任何 `globalThis.$t` 作为 UI 文案来源。
- **不要**为 i18next 的 `$t` 手写「展示用 defaultValue」凑中文；中文基准以 **`zhcn.json` 中该键的值**为准（见下节 E）。
- **导航栏标题**（`Taro.setNavigationBarTitle`）等与语言强相关的副作用，在 `useEffect` 中根据当前词条设置标题，并依赖 **`i18n.language`**，以便切换语言后标题同步更新，例如：

```javascript
const { i18n } = useTranslation()

useEffect(() => {
  Taro.setNavigationBarTitle({ title: $t('xxxxxxxx.yyyyyy') })
}, [i18n.language])
```

- **非 React 上下文**（极少数）：仍优先通过传入已解析的字符串或抽一层可测的纯函数解决；若必须全局取词，再评估是否沿用旧链，**默认不新增** `globalThis.$t` 依赖。

### E) 更新 Locale 文件

更新（键已存在则 **覆盖** 值），三语文件路径为：

- `src/subpages/i18n/locales/zhcn.json`（中文原文，与存储侧语言码 `zhcn` 对应；i18next 内部 lng 为 `zh-CN`，由 `src/i18n/instance.js` 映射）
- `src/subpages/i18n/locales/en.json`
- `src/subpages/i18n/locales/ar.json`

规则：`zhcn.json` = 原文；`en` / `ar` 可先在同键或同语义既有条目中检索 `locales/*.json` 是否已有译文；未命中再自行翻译。新键 **只写入** 上述三份 `locales/*.json`。

### F) Verify

- 对已改文件复查：用户可见中文应已走 i18n（允许注释等非 UI 中文仍存在）。
- 保持 diff 聚焦，避免无关重构。

---

## Resources

脚本目录：`.cursor/skills/i18n-translate/scripts/`（相对仓库根）。**若目录或脚本尚未纳入仓库**，键生成仍按上文 **C) 哈希规则** 执行，待脚本补齐后再改用命令行生成。

### gen_i18n_key.py（存在时使用）

```bash
python3 .cursor/skills/i18n-translate/scripts/gen_i18n_key.py --path <file> --text <chinese>
cat items.jsonl | python3 .cursor/skills/i18n-translate/scripts/gen_i18n_key.py --jsonl
```

### check_i18n_keys.py（存在时使用）

```bash
python3 .cursor/skills/i18n-translate/scripts/check_i18n_keys.py --src src --locales src/subpages/i18n/locales
```

可选：`--list`、`--clean`、`--no-fail`。
