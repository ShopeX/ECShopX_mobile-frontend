# Requirement Analyst Stages

## 阶段一：需求澄清

- 目标是在落盘前得到详细、精准、可执行的需求摘要
- 一次只问一个问题或一个主题下的少量选项
- 覆盖：目标、范围、约束、成功标准、UI、API、优先级、依赖
- 用户未确认前，不得创建目录或写文件

## 阶段二：落盘

- 用户确认后，生成 requirement-id
- 在 `.f2e-ai/requirements/<id>/requirement.md` 写入结构化需求内容
- requirement-id 规则：
  - `YYYYMMDD-<任务号去掉连字符后的值>`
  - `YYYYMMDD-HHMM`
- Teambition 任务号要先去掉连字符再拼接
- 示例：`ECX-8074` -> `20260305-ECX8074`

## 阶段三（可选）：UI 与 API 补充

- Figma MCP -> `ui-notes.md`
- `ui-notes.md` 需要结合当前项目分析组件拆分
- `ui-notes.md` 需要整理可复用组件建议
- `ui-notes.md` 需要整理新建组件建议
- Apifox/API MCP -> `api-notes.md`
- `api-notes.md` 需要整理接口路径、方法、参数说明
- `api-notes.md` 需要整理请求数据结构体
- `api-notes.md` 需要整理响应数据结构体
- 失败时写明“未通过 MCP 拉取，建议后续补充”
