// .cursor/skills/hooks/continue-translate.js（由 .cursor/hooks.json 引用）
// 作为 Cursor stop hook 运行时：从 stdin 读入 stop 的 input，向 stdout 输出 { followup_message } 后 Cursor 会自动把该消息作为下一条用户消息提交，继续会话。

const fs = require('fs')

function main() {
  let input = { status: 'completed', loop_count: 0 }
  try {
    const raw = fs.readFileSync(0, 'utf-8')
    if (raw && raw.trim()) {
      input = JSON.parse(raw)
    }
  } catch (e) {
    // 非 hook 调用时 stdin 可能为空，忽略
  }

  // Cursor stop hook 约定：输出 { "followup_message": "..." } 时，会自动将该内容作为下一条用户消息提交，继续会话
  const response = {
    followup_message: '请继续翻译。'
  }

  console.log(JSON.stringify(response))
  process.exit(0)
}

main()
