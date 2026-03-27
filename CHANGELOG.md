# Changelog

只记录当前核心更新内容，按版本增量追加。

## v2.1

- 统一版本源新增为根目录 `VERSION`，CLI 状态、初始化状态文件和安装器改为读取同一版本口径。
- `Step 3` 新增 `.acode-kit-startup/STACK_AND_DIRECTORY_INPUTS.approved.md`，冻结需求、设计、前后端、数据库、数据访问、部署和目录输入。
- `Step 4` 新增 `docs/project/DIRECTORY_PLAN.md`，要求先整合 active stack/scenario directory fragments 再创建目录。
- `project-blueprints/` 调整为 fallback 参考，不再作为目录创建主输入。
- 为首批高频 stack/scenario 包新增 `*.directory.json` 结构化目录片段。
- `SESSION_HANDOFF.md` 改为本地交接文件，不再作为 GitHub 持续同步文档。
- `Step 2` / `Step 3` 改为启动期文件优先审阅：先写入 `.acode-kit-startup/`，对话仅汇报执行状态、NotebookLM 使用情况与文件路径，不再内联完整文档正文。
- `NotebookLM` 在 `Step 2` 改为“可用即强制强化”的标准输入：已安装且已认证时必须先参与需求分析，失败时才允许显式降级为直接分析。
