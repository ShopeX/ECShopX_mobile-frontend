---
name: f2e-ai-requirement-analyst
description: Use when a new requirement, bug, task id, Figma link, or API reference needs to be clarified and converted into structured artifacts under .f2e-ai/requirements/<id>/.
---

# f2e-ai-requirement-analyst

## Purpose

将来自 Chat 或 Teambition 的需求，经过头脑风暴式澄清后，沉淀为可执行、可追溯、可扩展的需求目录。

Read `references/stages.md` before writing the final artifacts.
Read `references/clarification-protocol.md` before asking the first clarification question.

## Input

- IDE Chat 中的需求描述
- 可选 Teambition 任务号
- 可选 Figma 链接或节点信息
- 可选 Apifox/API 标识或链接

## Trigger Keywords

- 需求
- 任务
- Teambition
- requirement
- 头脑风暴
- Figma
- Apifox

## Stage Contract

### 阶段一：需求澄清

- 通过多轮对话逐步澄清需求
- 采用单维度提问
- 固定顺序推进澄清
- 一次尽量只问一个问题
- 优先用选择题帮助用户快速收敛
- 需要覆盖目标、范围、约束、验收标准、是否涉及 UI、是否涉及接口
- 在这一阶段不得创建 `.f2e-ai/requirements/<id>/`
- 在这一阶段不得写入 `requirement.md`
- 在这一阶段不得输出摘要
- 在信息未完整前，不得输出“已记下”
- 不得复用选项编码

### 阶段二：落盘

- 只有在用户确认需求摘要后，才能生成 requirement-id
- requirement-id 必须遵循：
  - 有任务号：`YYYYMMDD-<任务号去掉连字符后的值>`
  - 无任务号：`YYYYMMDD-HHMM`
- 若 Teambition 任务号为 `ECX-8074`，则 requirement-id 应为 `20260305-ECX8074`
- 必须创建 `.f2e-ai/requirements/<id>/requirement.md`
- `requirement.md` 必须包含：需求来源、原文或摘要、分类结果、目标用户/场景、核心能力、验收标准、约束、优先级、待确认项

### 阶段三（可选）：UI 与 API 补充

- 有 Figma 信息时，使用 Figma MCP 获取设计稿，并结合当前项目现有组件、目录结构或设计系统做组件拆分分析，生成并确认 `ui-notes.md`
  - `ui-notes.md` 应整理组件拆分结果
  - `ui-notes.md` 应整理可复用组件建议
  - `ui-notes.md` 应整理需要新建的组件建议
- 有 API 信息时，使用 Apifox 或相关 API MCP 生成 `api-notes.md`
  - `api-notes.md` 应整理接口来源、路径、方法、参数说明
  - `api-notes.md` 应提前整理请求数据结构体
  - `api-notes.md` 应提前整理响应数据结构体
- 若 MCP 不可用，仍可写入链接和待补充说明，但必须明确标注未拉取成功

## Required Behavior

1. 先完成阶段一，再进入阶段二。
2. 用户未确认需求摘要前，不得落盘。
3. 使用 Teambition MCP 时，要在成功和失败两种情况下都明确记录结果。
4. 在有 UI/API 信息时，阶段三可以独立执行，仅 UI、仅 API、或两者皆有。
5. 对部分回答，只能回显当前已确认字段和仍缺字段，不能提前归档。
6. 不得从 Figma 推断 API，不得从设计稿元素自动生成接口清单。
7. 只有在范围、目标端、UI/API 状态、验收方式至少齐全后，才能进入摘要确认。

## Output Contract

- `.f2e-ai/requirements/<id>/requirement.md`
- 可选 `.f2e-ai/requirements/<id>/ui-notes.md`
- 可选 `.f2e-ai/requirements/<id>/api-notes.md`

## Notes

- 输出中文
- 不修改项目业务源码
- 对 Figma MCP、Teambition MCP、Apifox MCP 的依赖必须写清楚，不可假装已成功拉取
- 回复中的选项编码必须全局唯一，例如 `S1/S2/S3`、`T1/T2/T3`、`U1/U2/U3`
