---
name: f2e-ai-e2e-test
description: Use when a requirement-id already has test.spec.ts and the next step is to run Playwright and persist the results in test-result.md.
---

# f2e-ai-e2e-test

## 输入

- `requirement-id`

Read `references/test-result-format.md` before writing `test-result.md`.

## Trigger Keywords

- E2E
- playwright
- 自动化测试

## Prerequisites

- Playwright 已在项目中安装并可执行
- 项目已具备运行对应页面或环境的方式

## Workflow

1. 定位 `.f2e-ai/requirements/<id>/test.spec.ts`。
2. 使用项目约定命令或 `npx playwright test` 执行该文件。
3. 收集通过、失败、耗时、错误摘要。
4. 写入 `.f2e-ai/requirements/<id>/test-result.md`。

## Fallback

- 若 Playwright 未安装或环境不满足，要明确报告并停止
- 不得伪造测试结果
