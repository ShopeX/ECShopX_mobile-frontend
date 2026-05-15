---
name: f2e-ai-i18n-translate
description: Use when a confirmed requirement-id has changed files that contain Chinese text and the project requires i18n replacement plus locale updates.
---

# f2e-ai-i18n-translate

## Purpose

本技能主要实现文件的多语言翻译：扫描给到的文件中的中文，生成对应的多语言 key，替换文件中需要翻译的地方，并将多语言写入到语言包中。

## 输入

- `requirement-id`

Read `scripts/extract_i18n.py` before running the localization workflow.
Read `scripts/generate_i18n_key.py` before generating new locale keys.
Read `references/file-type-rules.md` before editing source files.

## Trigger Keywords

- i18n
- 翻译
- 多语言

## Required Reads

- `.f2e-ai/requirements/<id>/plan.md`
- 可选 `.f2e-ai/requirements/<id>/i18n-notes.md`
- 项目当前语言包目录和 i18n 约定

## Workflow

1. 从 `plan.md` 提取本次修改或新增的文件。
2. 调用本 skill `scripts/` 下的 Python 脚本扫描这些文件中的中文。
3. 对每一条新增翻译内容，使用 `scripts/generate_i18n_key.py` 生成 key。
   - 规则：`md5(当前文件相对路径)` 前 8 位 + `'.'` + `md5(翻译内容)` 前 6 位
   - 示例格式：`8位hex.6位hex`
4. 替换文件中需要翻译的地方。
5. 按文件类型处理：
    - JS/TS 使用项目约定的 `t(...)` 或 `$t(...)`
    - Template 使用模板语法的 i18n 调用
    - 其他静态文件按项目约定处理
6. 将多语言写入到语言包中。
7. 必要时更新 `.f2e-ai/requirements/<id>/i18n-notes.md`。

## Constraints

- 仅处理本次计划涉及的文件
- 若项目未启用 i18n，要明确告知并停止自动替换
- 不能假设固定的 locales 目录名
