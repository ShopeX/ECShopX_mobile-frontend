# Execution Boundaries

## 读取范围

- `plan.md`
- `requirement.md`
- 可选 `ui-notes.md`
- 可选 `api-notes.md`
- 若存在，必须读取 `.f2e-ai/handbook/`

## Handbook 执行要求

- 执行前提炼检查清单：目录/命名/样式/测试/脚本
- 每个计划步骤完成后都要按清单复核
- `plan.md` 与 handbook 冲突时，先暂停并请用户确认
- handbook 缺失时，按项目现有代码约定执行并明确告知

## 修改范围

- 项目业务源码
- 测试代码
- 与计划相关的实现文件

## 不应修改

- `requirement.md`
- `plan.md`
- `ui-notes.md`
- `api-notes.md`

## 完成后

- 优先依赖 `.cursor/hooks`
- 兜底执行 lint/format
