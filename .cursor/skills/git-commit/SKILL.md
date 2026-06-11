---
name: git-commit
description: 按 TB 号格式提交 Git 变更并在对话中总结。用户说「提交」「提交并总结」「帮我 commit」「记录并提交」时使用；不写 .cursor/commit-summary 文件。
---

# Git 提交（TB 号格式）

## 何时触发

- 「提交并总结」「帮我 commit」「直接提交」「记录并提交」
- 「总结这次改了什么并提交」（只对话总结 + commit，不写 md 文件）

## Commit Message 格式

```
{type}({TB号}): {改动总结}
```

**示例：**
- `feat(LAXZE-7377): 天猫自助修改SKU，响应优化`
- `fix(LAXZC-145): 修复京东换货订单赠品标签错误`
- `style(ECX-8754): 赠品缩进改为固定 20px`

### type 选用

| type | 场景 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构，不改行为 |
| `style` | 纯样式 |
| `chore` | 构建、依赖、配置 |

用户指定 type 时以用户为准。

### TB 号

- 括号内填任务号，如 `ECX-8754`、`LAXZE-7377`
- **用户未提供 TB 号时必须先询问**，禁止猜测或使用 `TB-xxx` 占位符

### 改动总结

- 一行中文，≤50 字
- 写「做了什么」，不要堆文件路径列表

## 流程

### 1. 获取变更

在项目根目录执行：

```bash
git status -sb
git diff --stat
git diff
```

若有 staged 变更，再执行 `git diff --cached`。

### 2. 对话总结（不写文件）

用中文简要说明：
- 涉及哪些文件/模块
- 主要改了什么
- 拟用的 commit message（含 TB 号）

**禁止**创建或更新 `.cursor/commit-summary/` 下任何 md 文件。

**发现不合理代码时**：只指出问题与建议，**不得擅自修改**；先询问用户是否需要一并处理，待确认后再动代码。

### 3. 是否提交

| 用户意图 | 动作 |
|----------|------|
| 仅「总结」「看看改了啥」 | 只输出总结，不 `git add` / `git commit` |
| 「并提交」「直接 commit」 | 继续步骤 4 |

### 4. 执行提交

1. **只提交已有 diff**：不得顺带改代码；有问题在提交前说明
2. **不改无关代码**：diff 或上下文里发现不合理/有问题代码，先向用户说明并询问是否处理，**禁止擅自改动**
3. **暂存**：未指定文件时用 `git add` 暂存相关变更；用户指定路径则只 add 指定项
4. **排除敏感文件**：`.env`、密钥等勿加入暂存，并提醒用户
5. **提交**：

```bash
git commit -m "$(cat <<'EOF'
{type}({TB号}): {改动总结}
EOF
)"
```

6. **确认**：回复「已提交」+ commit hash + 一句话总结
7. **不 push**：除非用户明确要求

## 代码改动边界

- 提交、总结、review 过程中发现不合理代码：**先问用户，再改**
- 可以说明问题、影响和建议方案，但默认不扩大改动范围
- 用户未确认前，不得把「顺手修复」混进本次 commit

## 安全约束

- 不修改 git config
- 不执行 destructive 命令（force push、hard reset 等），除非用户明确要求
- 不 skip hooks（`--no-verify` 等），除非用户明确要求
- 不用 `git commit --amend`，除非用户规则允许且条件满足

## 示例对话

**用户**：`提交 ECX-8754，赠品缩进改 20px`

**Agent**：
1. 查看 diff → 3 个 trade scss 文件
2. 总结：订单列表/结算/详情赠品 margin-left 改为 20px
3. `git add` 三个 scss → `git commit -m "style(ECX-8754): 赠品缩进改为固定 20px"`
4. 回复：已提交 `01ada58db`

**用户**：`先总结我改了啥`

**Agent**：只输出 diff 总结，不 commit，并问是否需要提交及 TB 号。
