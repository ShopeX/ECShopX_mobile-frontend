---
name: f2e-ai-execute-plan
description: Use when a confirmed requirement-id already has plan.md and the next step is to implement that plan in project code without expanding scope.
---

# f2e-ai-execute-plan

## 输入

- `requirement-id`

Read `references/execution-boundaries.md` before modifying project files.

## Trigger Keywords

- 执行计划
- implement
- execute plan

## Required Reads

- `.f2e-ai/requirements/<id>/plan.md`
- 相关 `requirement.md`
- 可选 `ui-notes.md`
- 可选 `api-notes.md`
- 若存在，必须读取 `.f2e-ai/handbook/`

当存在 `ui-notes.md` 时，应将其中的组件拆分、复用建议和新建组件建议作为后续实现输入。
当本次需求涉及 Figma UI 还原时，必须同时通过 Figma MCP 查看设计稿，并以此作为 1:1 还原的真值来源，不能只依赖 `ui-notes.md`。

## Execution Contract

1. 必须先确认 `plan.md` 存在。
2. 只按确认后的计划执行，不擅自扩大范围。
3. 按计划顺序逐项修改源码、测试和相关文件。
4. 当执行 Figma UI 还原时，使用 `ui-notes.md` 作为拆分指导，使用 Figma MCP 复核布局、层级、文案、间距、状态，做 1:1 实现。
5. 需要用户决策时暂停确认。
6. 测试失败、编译失败、联调失败时，应尝试修复或与用户确认后继续。

## Handbook 执行约束

1. 若存在 `.f2e-ai/handbook/`，执行前必须提炼出“执行检查清单”：目录/文件放置、命名、样式、测试与脚本约定。
2. 每完成一个计划步骤，必须用该清单复核一次，发现偏差立即纠正。
3. 当 `plan.md` 与 handbook 冲突时，不得直接实现；先暂停并请用户确认是调整计划还是按例外处理。
4. 若 handbook 不存在，退回到项目既有代码约定，并在回复中明确“本次未检测到 handbook，按代码现状执行”。

## Lint And Format Contract

- 优先依赖项目内 `.cursor/hooks`
- 若环境无法自动触发 hooks，应手动执行项目约定的 lint/format 兜底命令
- 不依赖 IDE 全局“保存时格式化”

## Boundaries

- 读取 `.f2e-ai` 文档
- 修改对象是项目业务源码与测试
- 不回写 `requirement.md`、`plan.md`、`api-notes.md`、`ui-notes.md`
- handbook 存在时，执行结果必须与 handbook 约定一致
