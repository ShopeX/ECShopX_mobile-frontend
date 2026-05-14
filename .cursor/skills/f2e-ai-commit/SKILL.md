---
name: f2e-ai-commit
description: Use when a requirement-id is ready for delivery and the next step is to summarize Git changes, write change-summary.md, commit, push, and prepare a PR.
---

# f2e-ai-commit

## 输入

- `requirement-id`

Read `references/change-summary-format.md` before writing `change-summary.md`.

## Trigger Keywords

- commit
- 提交
- PR

## Required Reads

- `.f2e-ai/requirements/<id>/plan.md`
- 当前 Git 改动
- 可选 `test-result.md`

## Workflow

1. 读取 `plan.md` 了解本次需求范围。
2. 汇总 Git 改动并生成简短 commit message。
3. 写入 `.f2e-ai/requirements/<id>/change-summary.md`。
4. 执行 `git add`、`git commit`、`git push`。
5. 环境允许时创建 PR。

## Output Contract

- 简短 commit 信息
- 详细 `change-summary.md`

## Fallback

- 若远程、权限或 PR CLI 不可用，要明确说明并给出手动后续
- `change-summary.md` 仍然是必需产物
