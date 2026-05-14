---
name: commit-summary
description: Summarize current code changes and optionally commit. Use when the user asks to summarize what changed, record changes, commit with a message, or "总结这次改了什么并提交"/"帮我 commit".
---

# 变更总结与提交 (Commit Summary)

在用户提出「总结这次改了什么」「记录一下变更」「帮我提交」等请求时，按本流程执行：先查看变更、写出总结、可选地执行 commit。

## 何时触发

- 用户说：总结这次改了什么、记录变更、帮我提交、直接 commit、总结并提交
- 用户说：我改完了，帮我写 commit message 并提交

## 流程

### 1) 获取变更范围

在项目根目录执行：

```bash
git status -sb
git diff --stat
git diff
```

若存在已暂存内容，再执行 `git diff --cached` 查看 staged 变更。根据 `git status` 决定总结的是「未暂存」还是「已暂存」的变更。

### 2) 写出总结（中文）

按下面结构写一段**本次变更总结**，并**生成新的总结文档**（不覆盖旧文档）：

**文档命名**：`YYYY-MM-DD-{tb号}.md`，保存到 `.cursor/commit-summary/` 目录。
- 示例：`2026-03-06-ECX-8058.md`
- 若用户当次对话中提供了 Teambition/需求单号（如 ECX-xxxx），则用该 tb 号作为文件名后半部分。
- 若未提供 tb 号，则使用 `YYYY-MM-DD-summary.md`，或根据「一句话概括」生成简短英文标识（如 `coupon-list-i18n`）。

**总结文档结构**：

```markdown
## 本次变更总结

**时间**: YYYY-MM-DD

**涉及文件**:
- 路径1 (新增/修改/删除)
- 路径2 (修改)
- ...

**主要改动**:
- 模块/功能1：简要说明
- 模块/功能2：简要说明
- ...

**一句话概括**: （用作 commit message 的简短描述）
```

- 总结要基于实际 diff，不要编造。
- 若用户有特殊要求（如按「功能/修复/文档」分类），按用户要求组织。
- 每次总结都写入**新文件**，便于按日期和 tb 号追溯；可同时更新 `last-summary.md` 为本次内容（便于「最近一次」查看）。

### 3) 是否执行提交

- **仅总结、不提交**：用户只说「总结」「记录」时，只输出总结并（可选）写入 `last-summary.md`，不执行 `git add` / `git commit`。可追问：「需要我帮你直接提交吗？」
- **总结并提交**：用户明确说「并提交」「直接 commit」「帮我 commit」时，继续执行步骤 4。

### 4) 执行提交（仅在用户要求提交时）

1. **暂存**：  
   - 若用户未指定文件：`git add -A` 或 `git add .`（按项目习惯）。  
   - 若用户指定了文件或目录：只 `git add` 指定路径。
2. **Commit message**：  
   - 使用总结里的「一句话概括」作为 commit 标题（首行 ≤50 字）。  
   - 若变更较多，可在 commit body 中粘贴「主要改动」列表（`git commit -m "标题" -m "正文"` 或多行 -m）。
3. **执行**：  
   `git commit -m "..."`（或带 -m body），在项目根目录执行。
4. **确认**：提交成功后，简短回复「已提交」并附上本次总结的要点或 commit hash。

## Commit Message 约定（可选）

- 首行：简短说明，不超过 50 字。
- 可选用前缀：`feat:`, `fix:`, `refactor:`, `i18n:`, `chore:` 等，若项目已有规范则遵循项目规范。
- 若项目根目录有 `.cursor/commit-summary/commit-convention.md`，优先按该文件约定生成 message。

## 注意事项

- 不执行 `git push`，除非用户明确说「并 push」或「提交并推送」。
- 提交前若发现存在未跟踪的敏感文件（如 .env、密钥），在总结中提醒用户，并避免将其加入暂存。
- 所有 git 命令在**项目根目录**（即 git 仓库根目录）执行。

## 示例对话

- 用户：「帮我总结这次改了什么并提交」→ 获取 diff → 写总结 → **新建** `.cursor/commit-summary/YYYY-MM-DD-{tb号}.md`（无 tb 号则用 `YYYY-MM-DD-summary.md`）→ 可选更新 last-summary.md → git add → git commit。
- 用户：「先总结一下我改了啥」→ 只执行获取 diff 与写总结，并生成新的日期+tb号总结文档，不 commit，可问「需要我帮你直接提交吗？」。
- 用户：「记录一下然后 commit」→ 写总结、生成新总结文档并执行 commit。
