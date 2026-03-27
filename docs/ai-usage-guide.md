# 和 AI（Cursor）协作说明

用 Cursor 写需求、修 bug 时，按下面方式可以让 AI 按项目约定来，并且换一个对话也能接着用。

---

## 一、新开一个对话时

AI 不会自动记住上一个对话的内容，所以**新对话要先给一点上下文**：

- 可以说：**「按项目接手文档来」** 或 **「先看 .cursor/skills/project-handover/SKILL.md」**，再说你的需求。
- 或者直接 **@ 文件**：在输入框里输入 `@`，选 `.cursor/skills/project-handover/SKILL.md`，再写你要做的事。

这样 AI 会先读项目结构、目录约定、检查清单，再按这些来改代码。

---

## 二、做哪类事就 @ 哪个文档

| 你在做啥 | 怎么说 / 怎么 @ |
|----------|------------------|
| 改页面、加页面、不知道代码放哪 | @ `.cursor/skills/project-handover/SKILL.md` 或说「按项目接手来」 |
| 改进店、导购、店铺码、分享落地页、gu/dtid | @ `.cursor/skills/entry-store-rules/SKILL.md` |
| 需求做完了 / bug 修完了，要留一笔记录 | 说 **「记一笔」** 或 **「写进 dev log」**，或 @ `.cursor/skills/dev-log-write/SKILL.md` |

---

## 三、需求 / bugfix 做完后记一笔

每次完成一个需求或修完一个 bug，可以说：

- **「记一笔」**
- **「把这次改动写进 dev log」**

AI 会总结并写入 `docs/dev-log.md`，并把**当前工作区所有改动**（本次改的代码 + dev-log）**一次性 git commit**，在对话里就完成提交，不用再去终端。

---

## 四、文档都在哪

- 项目约定、目录、检查清单：`.cursor/skills/project-handover/SKILL.md`
- 进店规则、导购参数：`.cursor/skills/entry-store-rules/SKILL.md`
- 开发记录（需求/bugfix）：`docs/dev-log.md`
- 记一笔的规则：`.cursor/skills/dev-log-write/SKILL.md`

新人接手或换新对话时，先看 **README** + **本说明** + 需要时 @ 上面这些文档即可。
