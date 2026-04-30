# AI 助手嵌入静态资源（已本地化）

为避开 `widget-h5.js` 跨域加载（远端 nginx 不一定回 `Access-Control-Allow-Origin`），脚本现已本地化进 vshop。

构建路径：

| 源文件 | H5 构建产物路径（由 `src/files` → `dist` 复制规则提供） |
|---|---|
| `src/files/ai-assistant-embed/widget-h5.js` | `<H5站点根>/ai-assistant-embed/widget-h5.js` |

加载逻辑见 `src/components/ai-assistant-fab/index.jsx`：默认走 **同源相对路径** `/ai-assistant-embed/widget-h5.js`；如需切到远端调试，在 `.env*` 设置 `APP_AI_WIDGET_SCRIPT_URL=<完整 URL>` 即可覆盖。

## 同步最新构建

```bash
# ai-assistant-widget 重新打包后执行
npm run sync:ai-widget
```

脚本会从 `~/data/httpd/ecx/Java/ai-assistant/ai-assistant-widget/dist/widget-h5.js` 复制到本目录。如果上游路径不同，按机器实际改 `package.json` 里的 `sync:ai-widget`。

## 注意

本地化只解决**脚本加载**的跨域；脚本内部对 `${APP_AI_ASSISTANT_BACKEND_URL}/api/...` 的 fetch 仍是跨域请求，必须 AI 助手后端 nginx 在 `/api/*` 返回正确的 CORS 响应头（`Access-Control-Allow-Origin`、`Access-Control-Allow-Headers` 等）才能正常通信。
