---
name: f2e-ai-write-plan
description: Use when a confirmed requirement-id needs test-first planning, explicit user confirmation, and a detailed implementation plan written into test.spec.ts and plan.md.
---

# f2e-ai-write-plan

## 输入

- `requirement-id`

Read `references/two-stage-flow.md` before writing any plan artifact.

## Trigger Keywords

- 写计划
- 开发计划
- TDD
- plan

## Required Reads

- `.f2e-ai/requirements/<id>/requirement.md`
- 可选 `ui-notes.md`
- 可选 `api-notes.md`
- 可选 `i18n-notes.md`
- 若存在，必须读取 `.f2e-ai/handbook/`

在生成测试用例和开发计划前，应读取并使用 `api-notes.md` 中已有的接口路径、参数说明、请求数据结构体、响应数据结构体。
当项目存在 `.f2e-ai/handbook/` 时，必须先做 handbook 预对齐，再输出测试与计划。

## 阶段一：TDD

1. 从需求与补充文档中提炼验收场景。
2. 先生成可映射为 Playwright 的测试用例，包含：
   - 用例标题
   - 前置条件
   - 操作步骤
   - 预期结果
3. 必须先向用户展示测试用例并等待确认。
4. 用户未确认前，不得写入 `test.spec.ts`。
5. 用户确认后，写入 `.f2e-ai/requirements/<id>/test.spec.ts`。

## 阶段二：生成开发计划

1. 只有阶段一确认完成后，才能进入阶段二。
2. 生成详细、可执行的开发计划，明确改哪些文件、做什么、如何验证。
3. 必须先向用户展示计划全文并等待确认。
4. 用户未确认前，不得写入 `plan.md`。
5. 用户确认后，写入 `.f2e-ai/requirements/<id>/plan.md`。

## Handbook 预对齐约束

1. 若存在 `.f2e-ai/handbook/`，必须读取并提炼约束：技术栈、目录约定、命名规则、代码风格、测试与脚本约定。
2. 阶段一测试用例与阶段二开发计划都必须显式对齐这些约束，避免后续执行阶段大幅返工。
3. 若需求与 handbook 冲突（例如目录规范、组件命名、测试入口不一致），先向用户确认再落盘。
4. `plan.md` 必须包含一个“与 handbook 对齐”小节，说明将遵循的关键约束。

## Output Contract

- `.f2e-ai/requirements/<id>/test.spec.ts`
- `.f2e-ai/requirements/<id>/plan.md`

## Constraints

- 两个阶段都要显式确认
- 计划必须能映射回测试用例和验收标准
- 不直接修改业务源码
- handbook 存在时不得跳过，且必须在写入 `plan.md` 前完成对齐
