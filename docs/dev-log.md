# 开发记录（需求 / Bugfix）

每次完成一个需求或修完一个 bug 后，在此**插入**一条记录（**新记录插在「记录区」最上方**，紧跟下面 ## 记录区 标题后）。便于交接、回溯和 Code Review。

---

## 记录格式（复制下面模板追加）

```markdown
### YYYY-MM-DD | 需求 | 简短标题
- **说明**：一两句话描述做了什么。
- **涉及**：主要文件或模块（可选）。
```

或

```markdown
### YYYY-MM-DD | 修复 | 简短标题
- **说明**：问题现象 + 修改要点。
- **涉及**：主要文件或模块（可选）。
```

---

## 记录区

（新记录**插入**在本节最上方，即紧接本行下方，保持时间倒序：最新在上）

### 2026-03-02 | 需求 | 记一笔流程支持对话内一次性 git 提交
- **说明**：记一笔时除写入 dev-log 外，对当前工作区所有改动（代码 + dev-log）执行一次 git commit，在对话里完成提交，减少大家再去终端操作。
- **涉及**：docs/skills/dev-log-write.SKILL.md、docs/ai-usage-guide.md

<!-- 示例：
### 2026-03-02 | 修复 | 种草详情页 content 报错
- **说明**：接口部分 content 块无 data 字段导致 e.data[t] 报错，对 heading/writing/slider/goods 等 wgt 的 data 做空数组兜底。
- **涉及**：subpages/guide/recommend/detail.js、guide/components/wgts/*.js
-->
