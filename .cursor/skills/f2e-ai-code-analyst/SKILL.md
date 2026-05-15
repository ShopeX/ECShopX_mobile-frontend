---
name: f2e-ai-code-analyst
description: Use when analyzing a frontend codebase, onboarding into an existing project, or documenting stack, structure, configs, and coding conventions into .f2e-ai/handbook/.
---

# f2e-ai-code-analyst

## Purpose

分析当前工作区根目录下的前端项目，产出可供新人和后续 AI 技能复用的项目手册。

Read `references/output-files.md` before writing the handbook.

## When To Use

- 用户要求分析项目、熟悉技术栈、梳理目录结构或代码规范
- 开始新需求前需要建立项目上下文
- 需要补全 `.f2e-ai/handbook/`

## Trigger Keywords

- 代码分析
- 技术栈
- 项目结构
- 熟悉项目

## Output Contract

必须写入：

- `.f2e-ai/handbook/index.md`
- `.f2e-ai/handbook/tech-stack.md`
- `.f2e-ai/handbook/structure.md`
- `.f2e-ai/handbook/configs.md`
- `.f2e-ai/handbook/conventions.md`

## Execution

1. 将当前工作区根目录视为分析目标。
2. 读取 `package.json`、关键配置文件和主要源码目录。
3. 输出技术栈总览，至少覆盖框架、语言、构建工具、UI 库、状态管理、样式、测试、i18n、HTTP。
4. 输出目录结构说明，包含关键目录用途和建议排除目录。
5. 输出配置与命令摘要，包含常用 scripts、路径别名和重要工程约束。
6. 结合代表性文件归纳命名、导入导出、样式、模块划分等代码规范。
7. 将结论写入 `.f2e-ai/handbook/`。

## Constraints

- 仅读取项目并生成文档，不修改业务源码和配置
- 输出中文，技术术语可保留英文
- 信息不足时写“未检测到”或“待补充”，不要伪造
