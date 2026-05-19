---
name: i18n-page-title
description: 按用户指定目录扫描并翻译页面标题（navigationBarTitleText、SpPage title、setNavigationBarTitle）。用户说「翻译页面 title」「目录下 title 没翻译」「i18n page title」时触发。
---

# i18n Page Title

## 适用场景

Taro 页面标题常出现在 **3 处**，只改一处会导致切换语言后仍显示中文：

| 位置 | 典型写法 | 处理方式 |
|------|----------|----------|
| `*.config.js` | `navigationBarTitleText: '中文'` | 改为 `''`（与项目多数页面一致） |
| `*.js` / `*.jsx` | `setNavigationBarTitle($t('key'))` | 保留；无则按模板补齐 |
| `SpPage` 等自定义导航 | `title='中文'` | 改为 `title={$t('key')}`，**key 与上一行一致** |

`navigationStyle: 'custom'` 时，用户看到的是 **SpPage `title`**，不是 config 里的 `navigationBarTitleText`。

## 输入

用户给出 **扫描目录**（相对仓库根），例如：

- `src/subpages/store`
- `src/subpages/item`

可选：只处理某个子路径、或「仅扫描不修改」。

## 工作流

### 1) 扫描

在仓库根执行：

```bash
python3 .cursor/skills/i18n-page-title/scripts/scan_page_titles.py --dir "src/subpages/store"
```

脚本输出三类问题：

- **config-hardcoded**：`*.config.js` 里 `navigationBarTitleText` 含中文
- **sppage-hardcoded**：`SpPage` / 同类组件 `title='中文'`
- **missing-locale**：代码已用 `$t('xxx.yyy')` 但 `zhcn.json` 无该键（顺带列出 en/ar 缺失）

也可手动：

```bash
rg -n "navigationBarTitleText:\s*'[^']*[\u4e00-\u9fff]" <目录> --glob '*.config.js'
rg -n "title=['\"][^'\"]*[\u4e00-\u9fff]" <目录> --glob '*.{js,jsx}'
rg -n "setNavigationBarTitle\([^$]" <目录>
```

### 2) 生成或复用 key

键格式：`{file_hash}.{text_hash}`（与 `i18n-translate` 一致）

- `file_hash` = `md5(相对路径)` 前 8 位，路径以 `src/` 开头
- `text_hash` = `md5(中文标题)` 前 6 位

```bash
python3 .cursor/skills/i18n-page-title/scripts/gen_i18n_key.py \
  --path "src/subpages/store/list.js" --text "店铺列表"
```

**主 key 来源**：优先用 **页面 `*.js`**（如 `list.js`），`setNavigationBarTitle` 与 `SpPage title` 共用同一 key。

若代码里已存在 `$t('…')` 且三语 locale 已有该键，**直接复用**，不要为同一文案再生成新键。

历史代码可能用 `*.config.js` 路径生成的 key（如 `5cfe28e8.a4d703` 来自 `list.config.js`）：只要 locale 齐全，可继续用，不必强行改成 `list.js` 的 hash。

### 3) 改页面代码

**`*.config.js`**

```javascript
export default {
  navigationBarTitleText: '',
  // ...
}
```

**`*.js` — 动态标题（无则添加）**

```javascript
import { useTranslation, $t, i18n } from '@/i18n'
import { useNavigation } from '@/hooks'

function Page() {
  useTranslation()
  const { setNavigationBarTitle } = useNavigation()

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('xxxxxxxx.yyyyyy'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle])

  return (
    <SpPage title={$t('xxxxxxxx.yyyyyy')}>
```

- 必须 `useTranslation()`，保证语言切换后 `$t` 更新。
- `SpPage` 的 `title` 与 `setNavigationBarTitle` 使用 **相同 key**。

**不要**在 `*.config.js` 写 `$t()`（编译期不支持）。

### 4) 更新 locale

写入（键已存在则只校对译文）：

- `src/subpages/i18n/locales/zhcn.json` — 中文原文
- `src/subpages/i18n/locales/en.json`
- `src/subpages/i18n/locales/ar.json`

`en` / `ar` 可先在同文件或全库 `rg` 搜相同中文是否已有译法，再落键。

### 5) 验收

对目录内已改页面：

- [ ] 无 `navigationBarTitleText: '中文'`
- [ ] 无 `title='中文'` / `title="中文"`（SpPage 等）
- [ ] 有 `setNavigationBarTitle($t(...))` + `languageChanged` 监听
- [ ] `SpPage title={$t(...)}` 与导航栏 key 一致
- [ ] 三语 json 均含该 key

## 与 `i18n-translate` 的关系

- **本技能**：只处理 **页面标题** 相关点位，按目录批量扫。
- **`i18n-translate`**：整文件 UI 文案，按计划 `plans/*.md` 执行。

目录内除 title 外还有大量中文时，title 用本技能修完后，其余仍走 `i18n-translate`。

## 示例：`subpages/store/list`

问题：`list.js` 已 `setNavigationBarTitle($t('5cfe28e8.a4d703'))`，但 `SpPage title='店铺列表'` 未译。

修复：

1. `list.config.js` → `navigationBarTitleText: ''`
2. `list.js` → `title={$t('5cfe28e8.a4d703')}`
3. 确认 `5cfe28e8.a4d703` 在三语 locale 中存在

## 输出给用户

完成后简要列出：

- 扫描目录
- 修改的文件列表
- 新增/复用的 key 及三语译文
- 是否仍有硬编码 title（应无）
