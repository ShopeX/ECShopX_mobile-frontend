# AI 助手嵌入静态资源（已迁出）

小程序 web-view 与 H5 挂件所需的 **`index.html`**、**`widget-h5.js`** 现由 **ai-assistant-server** 同源提供：

- `{APP_AI_BASE_URL}/ai-assistant-embed/index.html`
- `{APP_AI_BASE_URL}/ai-assistant-embed/widget-h5.js`

请在商城 `.env` 配置 **`APP_AI_BASE_URL`**（指向助手后端根 URL，无尾斜杠），详见 ai-assistant 仓库 README「商城集成」一节。本目录仅保留说明，避免在 `src/files` 中重复提交大体积 JS。
