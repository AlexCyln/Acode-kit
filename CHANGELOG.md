# Changelog

只记录当前核心更新内容，按版本增量追加。

## v3.0

- 新增独立的 existing-project onboarding 路径：`O1 -> O2 -> O3 -> O4`，与 greenfield startup 分离，完成接管后再汇入 `Stage 1 -> 7`。
- existing-project onboarding 强化了三项关键规则：优先读取已有 `AGENTS.md` / `SESSION_HANDOFF.md` / `TASK_LOG.md` / `NEXT_STEPS.md` 等连续性文档；先识别真实项目平台；未经确认不得把子页面、入口或详情页升格为独立核心模块。
- README 重写为面向用户的精简版，对外统一说明双路径能力、安装方式、初始化流程、常用命令与扩展使用方式，删除历史内部调试和冗长实现说明。
- 安装说明重新梳理，统一为“安装 -> 初始化 -> 状态检查 -> 常用命令”顺序；安装器与 CLI 帮助文案同步压缩并对齐。

## v2.3

- 启动期文档治理进一步收紧：明确区分 `docs/project/` 项目核心、`docs/dev/current/` 当前文件、`docs/archive/reviews/` 历史审阅，并要求审阅完成后及时归档。
- `Step 4a` 明确为“先确认技术栈，再加载技术栈目录片段、完成目录分析/生成、移动启动冻结稿并创建治理文件”；`Step 4b` 明确为“在当前目录内直接完成环境与工程骨架搭建”。
- `Step 5e` 与 `Stage 6` 对浏览器可访问 UI 范围新增 Chrome DevTools MCP 真实浏览器验证硬门禁，工具缺失时必须显式记录阻塞与降级路径。

## v2.1

- 统一版本源新增为根目录 `VERSION`，CLI 状态、初始化状态文件和安装器改为读取同一版本口径。
- `Step 3` 新增 `.acode-kit-startup/STACK_AND_DIRECTORY_INPUTS.approved.md`，冻结需求、设计、前后端、数据库、数据访问、部署和目录输入。
- `Step 4` 新增 `docs/project/DIRECTORY_PLAN.md`，要求先整合 active stack/scenario directory fragments 再创建目录。
- `project-blueprints/` 调整为 fallback 参考，不再作为目录创建主输入。
- 为首批高频 stack/scenario 包新增 `*.directory.json` 结构化目录片段。
- `SESSION_HANDOFF.md` 改为本地交接文件，不再作为 GitHub 持续同步文档。
- `Step 2` / `Step 3` 改为启动期文件优先审阅：先写入 `.acode-kit-startup/`，对话仅汇报执行状态、NotebookLM 使用情况与文件路径，不再内联完整文档正文。
- `NotebookLM` 在 `Step 2` 改为“可用即强制强化”的标准输入：已安装且已认证时必须先参与需求分析，失败时才允许显式降级为直接分析。

## v2.2

- 启动期 `Step 4` 拆分为 `Step 4a` 与 `Step 4b`：先按 `DIRECTORY_PLAN` 完成目录创建和启动冻结稿直接归位，再进入环境与工程骨架搭建。
- `PRD.template.md` 升级为项目级指南模板，补齐目标、范围、主流程、模块总览、技术 / UI / 测试 / 部署等正式章节。
- 继续扩充 stack package 覆盖面，新增 `nextjs-app-router`、`vue3-vite`、`nestjs`、`prisma`、`vercel-web-delivery`、`k8s-service-delivery` 等技术栈包。
- `ui/` 子域从占位状态扩展为可用包集合，新增品牌展示、数据看板、创作者工作台等 UI 栈包，并补齐对应 `.directory.json` 目录片段。
