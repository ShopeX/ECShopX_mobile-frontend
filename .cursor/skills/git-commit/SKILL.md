---
name: git-commit
description: 按 GitLab TBID 强制校验规范提交 Git 变更并在对话中总结。提交信息必须以 [TBID:项目ID-任务编号] 开头。用户说「提交」「提交并总结」「帮我 commit」时使用；不写 .cursor/commit-summary 文件。
---

# Git 提交（TBID 规范）

**2026 年 6 月 12 日起**，GitLab 仓库开启 Commit Message 强制校验：**所有提交必须包含 `[TBID:项目ID-任务编号]`，否则推送将被拒绝。**

## 何时触发

- 「提交并总结」「帮我 commit」「直接提交」「记录并提交」
- 「总结这次改了什么并提交」（只对话总结 + commit，不写 md 文件）
- 「修正提交信息」「改 commit message」（按下方「错误提交修正」处理）

## Commit Message 格式（强制）

```
[TBID:项目ID-任务编号] <提交类型> <问题/功能简述>
```

类型后可加冒号（如 `feat:`），与不加冒号（如 `fix `）均可；推荐统一为 `type:` 后接简述。

**正确示例：**

```
[TBID:PROJ-1001] fix 解决用户登录超时问题
[TBID:PROJ-1002] feat: 新增用户注册验证码功能
[TBID:WA-641] style: 赠品缩进改为固定 20px
```

### [TBID:项目ID-任务编号]（必填，放开头）

- 格式固定：`[TBID:项目ID-任务编号]`，关联 Teambition 任务
- 示例：`[TBID:ECX-8754]`、`[TBID:WA-641]`、`[TBID:LAXZE-7377]`
- **用户未提供完整 TBID 时必须先询问**，禁止猜测或使用占位符

### 提交类型（必填）

| type | 说明 |
|------|------|
| `feat` | 新功能、新特性 |
| `fix` | 修改 bug |
| `perf` | 性能优化（不改变代码行为） |
| `refactor` | 代码重构（不改变行为与功能） |
| `docs` | 文档修改 |
| `style` | 代码格式修改（**非 CSS**；删多余行、缩进等） |
| `test` | 测试用例新增、修改 |
| `build` | 影响构建或依赖（如 pom 依赖） |
| `revert` | 恢复上一次提交 |
| `ci` | CI 相关（Dockerfile 等） |
| `chore` | 其他（不在上述类型中） |
| `release` | 发布新版本 |
| `workflow` | 工作流相关文件修改 |

用户指定 type 时以用户为准。

### 问题/功能简述（必填）

- 一句话描述本次提交，**不超过 50 字**
- 写「做了什么」，不要堆文件路径列表

## 流程

### 1. 获取变更

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
- 拟用的完整 commit message（含 TBID、type、简述）

**禁止**创建或更新 `.cursor/commit-summary/` 下任何 md 文件。

**发现不合理代码时**：只指出问题与建议，**不得擅自修改**；先询问用户是否需要一并处理，待确认后再动代码。

### 3. 是否提交

| 用户意图 | 动作 |
|----------|------|
| 仅「总结」「看看改了啥」 | 只输出总结，不 `git add` / `git commit` |
| 「并提交」「直接 commit」 | 继续步骤 4 |

### 4. 执行提交

1. **只提交已有 diff**：不得顺带改代码；有问题在提交前说明
2. **不改无关代码**：先向用户说明并询问，**禁止擅自改动**
3. **暂存**：未指定文件时 add 相关变更；用户指定路径则只 add 指定项
4. **排除敏感文件**：`.env`、密钥等勿加入暂存，并提醒用户
5. **提交**（message 必须含 TBID）：

```bash
git commit -m "$(cat <<'EOF'
[TBID:项目ID-任务编号] type: 问题/功能简述
EOF
)"
```

6. **确认**：回复「已提交」+ commit hash + 一句话总结
7. **不 push**：除非用户明确要求

## 错误提交修正（未推送前）

推送被拦截或发现 message 不符合规范时：

### 仅最近 1 次提交写错

```bash
git commit --amend -m "[TBID:XXXX-123] fix: 正确描述"
```

### 最近 N 次提交都写错

```bash
git rebase -i HEAD~N
```

将需修改的提交前的 `pick` 改为 `reword`，保存后依次修改每条 message。

> 交互式 rebase 需用户确认；Agent 仅在用户明确要求修正历史提交信息时执行，且不使用 `-i` 以外的 destructive 操作。

### 查看未推送的提交

```bash
git log --oneline origin/<分支名>..HEAD
```

## 代码改动边界

- 提交、总结、review 过程中发现不合理代码：**先问用户，再改**
- 用户未确认前，不得把「顺手修复」混进本次 commit

## 安全约束

- 不修改 git config
- 不执行 destructive 命令（force push、hard reset 等），除非用户明确要求
- 不 skip hooks（`--no-verify` 等），除非用户明确要求
- **`--amend` / `rebase -i reword`**：仅用于修正 commit message（TBID 规范），且符合用户 amend 规则（HEAD 为自己创建、未 push 等）

## 示例对话

**用户**：`提交 WA-641，赠品缩进改 20px`

**Agent**：

1. 查看 diff → 3 个 trade scss 文件
2. 总结：订单列表/结算/详情赠品 margin-left 改为 20px
3. `git commit -m "[TBID:WA-641] style: 赠品缩进改为固定 20px"`
4. 回复：已提交 `515c73472`

**用户**：`推送被拒，上次 commit 没写 TBID`

**Agent**：

1. 确认未 push → `git commit --amend -m "[TBID:WA-641] style: 赠品缩进改为固定 20px"`
2. 提醒用户再次 push

**用户**：`先总结我改了啥`

**Agent**：只输出 diff 总结，不 commit，并问是否需要提交及 TBID。
