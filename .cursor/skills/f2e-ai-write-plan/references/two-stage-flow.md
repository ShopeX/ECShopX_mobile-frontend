# Two-Stage Planning Flow

## Handbook 预对齐

- 若检测到 `.f2e-ai/handbook/`，必须先读取并提炼约束（技术栈、目录、命名、测试、脚本）
- 阶段一测试用例与阶段二计划都要显式对齐 handbook
- 若与 handbook 冲突，先向用户确认再落盘

## 阶段一：TDD

- 先从 `requirement.md` 与补充文档中提炼验收场景
- 输出可映射到 Playwright 的测试用例
- 用户确认前，不得写入 `test.spec.ts`
- 用户确认后，写入 `.f2e-ai/requirements/<id>/test.spec.ts`

## 阶段二：开发计划

- 在阶段一确认后生成详细开发计划
- 计划应明确改哪些文件、如何实现、如何验证
- 用户确认前，不得写入 `plan.md`
- 用户确认后，写入 `.f2e-ai/requirements/<id>/plan.md`
