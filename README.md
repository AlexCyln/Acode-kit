# Acode-kit

中文 | [English](#english)

## 中文

### 项目简介

`Acode-kit` 是一个面向 AI 编码代理的项目交付插件，支持 `Codex`、`Claude Code`，并兼容“先下载到本地项目目录、后续再手动安装到任意 Agent”的使用方式。它不是单纯的提示词，而是一套从需求、文档、设计、实现、测试到上线的结构化工作流，并提供统一入口自动完成模型版本路由、会话承接和执行闭环。

### 实现功能

- 启动新项目，或接管并继续推进现有项目。
- 自动建立并维护项目级文档，如 `PRD`、`TRACEABILITY_MATRIX`、`SESSION_HANDOFF`、`DECISION_LOG`。
- 按阶段驱动项目：需求结构化、UI/页面设计、数据与 API 设计、脚手架初始化、小闭环实现、测试、部署上线。
- 绑定全局工程规范，控制技术栈、范围、质量、评审与交付节奏。
- 适配多 Agent 分发：Codex、Claude Code，以及本地目录离线安装包。
- 统一入口 `acode-run`：按任务阶段与类型自动路由模型版本，自动承接会话上下文。
- 路由策略内置降级与预算控制，避免无边界 token 消耗。

### 特色亮点

- 强调“先定边界，再做实现”，避免 AI 无边界写代码。
- 内置模板和规范，不要求用户每次重新描述完整流程。
- 要求需求、实现、测试、上线记录可追踪、可回溯、可 handoff。
- 支持自动安装和手动安装两条路径，适合不同用户环境。
- 在未安装 Codex 或 Claude 时，也能先安装到当前打开的文件夹中，之后再人工接入目标 Agent。
- 单入口使用方式，对用户无感完成模型路由与会话连续性维护。
- 支持同一 provider 内多版本自动切换，内置 fallback 规则与 token 预算门禁。

### 支持矩阵

| 目标 | 安装结果 |
| --- | --- |
| `Codex` | 安装到 `~/.codex/skills/Acode-kit` |
| `Claude Code` | 安装 bundle 到 `~/.claude/Acode-kit`，并安装 subagents 到 `~/.claude/agents/acode-kit.md` 与 `~/.claude/agents/acode-run.md` |
| `本地目录 / 未安装 Agent` | 安装到当前目录下的 `./agent-skills/Acode-kit`，并附带 Claude 适配文件 |

### 安装模式

新安装器支持以下模式：

- `--agent auto`：自动检测本机已有 Agent。若同时存在 Codex 和 Claude，则同时安装；若都不存在，则安装到当前目录下的 `agent-skills/`。
- `--agent codex`：只安装到 Codex。
- `--agent claude`：只安装到 Claude。
- `--agent local`：安装到当前目录，作为便携包。
- `--agent both`：同时安装到 Codex 和 Claude。
- `--scope user|project`：针对 Claude，支持用户级安装和项目级安装。`project` 会安装到当前项目的 `.claude/` 目录。
- `--dest-dir PATH`：强制指定安装目标根目录。

### 使用方法

当目标 Agent 需要：

- 从一个项目点子开始搭建结构化项目；
- 在已有项目中继续推进，并保持文档、需求、代码同步；
- 用固定流程完成规划、实现、测试和发布；

就可以调用 `Acode-kit`。

推荐统一入口（自动路由与执行）：

```bash
node ./scripts/acode-run.mjs \
  --project-id demo-project \
  --prompt "继续当前项目，完成订单审核前后端联调并补测试用例" \
  --context-summary "当前阶段:实现; REQ-ORDER-003 未完成" \
  --provider codex
```

安装到 Agent 后可直接从已安装路径调用入口：
- Codex: `~/.codex/skills/Acode-kit/scripts/acode-run.mjs`
- Claude: `~/.claude/Acode-kit/scripts/acode-run.mjs`
- Local: `./agent-skills/Acode-kit/scripts/acode-run.mjs`

在 Claude 中也可直接调用 `acode-run` 子代理（由安装器自动复制到 `~/.claude/agents/acode-run.md`）。

如果只想验证路由不执行模型调用：

```bash
node ./scripts/acode-run.mjs \
  --project-id demo-project \
  --prompt "输出本轮总结报告并更新handoff" \
  --provider codex \
  --dry-run true
```

示例：

```text
使用 Acode-kit skill，帮我从 0 开始规划并启动一个 SaaS 项目。
```

```text
Use Acode-kit to continue the current repository and review PRD, TRACEABILITY_MATRIX, and SESSION_HANDOFF first.
```

### 仓库结构

```text
.
├── Acode-kit/
│   ├── SKILL.md
│   ├── extensions/
│   │   └── router/
│   ├── assets/
│   ├── integrations/
│   │   └── claude/
│   │       ├── acode-kit.md
│   │       └── acode-run.md
│   └── references/
├── scripts/
│   ├── acode-run.mjs
│   ├── agent-execute.mjs
│   ├── install.mjs
│   ├── install.sh
│   ├── install.ps1
│   ├── router-exec.mjs
│   ├── test-acode-run.mjs
│   └── test-router.mjs
├── README.md
├── package.json
└── LICENSE
```

### 安装方式

#### 1. Codex 内置 skill-installer

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit \
  --path Acode-kit
```

#### 2. bash 一键安装

自动检测已有 Agent，没有检测到时安装到当前目录的 `agent-skills/`：

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

注意：如果需要传递 `AGENT`、`SCOPE`、`DEST_ROOT` 等变量，必须把变量写在 `bash` 这一侧，而不是写在 `curl` 前面。

显式安装到 Codex：

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=codex bash
```

显式安装到 Claude 用户目录：

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=claude SCOPE=user bash
```

显式安装到当前项目的 `.claude/`：

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=claude SCOPE=project bash
```

显式安装为本地便携包：

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=local DEST_ROOT="$(pwd)/agent-skills" bash
```

#### 2.1 Windows PowerShell 一键安装

Windows 下可直接使用 PowerShell：

```powershell
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

传参示例（先设置环境变量，再执行）：

```powershell
$env:AGENT = "codex"
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

```powershell
$env:AGENT = "claude"
$env:SCOPE = "project"
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

也可以在仓库本地执行：

```powershell
npm run install:win
```

#### 3. Node 安装器

本地验证或自动化流程中可使用：

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent local --dest-dir /tmp/agent-skills
```

从 GitHub 安装到 Claude：

```bash
node ./scripts/install.mjs --repo AlexCyln/Acode-kit --agent claude --scope user
```

#### 4. Router 执行（实验）

基于 `Acode-kit/extensions/router` 的映射和策略，执行单 provider（Codex 或 Claude）模型版本路由：

```bash
node ./scripts/router-exec.mjs \
  --provider codex \
  --project-id demo-project \
  --phase 实现 \
  --task-type 前后端编码开发 \
  --difficulty high \
  --dry-run true \
  --context-summary "REQ-12, implement API + page integration" \
  --prompt "Implement next slice following PRD and traceability matrix." \
  --cwd "$(pwd)"
```

#### 5. Router 测试脚本

```bash
npm run test:router
```

作用：
- 校验任务类型与阶段到模型版本的映射是否符合预期。
- 校验预算压力下是否触发降级选模。
- 校验 `logical_session_id` 状态写入是否正常。

说明：
- 测试默认使用 `--dry-run true`，不调用真实模型。
- 运行时状态和日志写入系统临时目录，不污染仓库。

#### 6. 统一入口执行（推荐）

用户只需给项目和任务描述，入口会自动完成：
1. 任务分类（阶段/任务类型/难度）
2. 模型路由（按 Router 策略）
3. 会话状态承接（logical/native session）

```bash
node ./scripts/acode-run.mjs \
  --project-id demo-project \
  --prompt "请继续当前项目，完成订单审核前后端联调并补测试用例" \
  --context-summary "当前阶段:实现; REQ-ORDER-003 未完成" \
  --provider codex
```

如果只想验证路由不执行模型调用：

```bash
node ./scripts/acode-run.mjs \
  --project-id demo-project \
  --prompt "输出本轮总结报告并更新handoff" \
  --provider codex \
  --dry-run true
```

入口层测试：

```bash
npm run test:entry
```

### 分发与安装覆盖
-  `scripts/install.mjs` / `scripts/install.sh` / `scripts/install.ps1` 会拷贝 `Acode-kit/` 目录并同步 `scripts/` 到目标 bundle，统一入口与路由执行脚本会随包一并复制到 Codex/Claude/local 目录。
-  `package.json` 的 `files` 字段列出 `scripts`、`Acode-kit`、`README.md`、`LICENSE`，保证 npm / GitHub release 包包含 Router 配置、入口脚本和测试脚本。
-  只要 GitHub 分发/Release 升级使用当前 repo 内容，安装脚本就会抓取最新版；更新后重新运行安装命令即可把 Router、入口、测试等全部同步到目标 Agent。

### 手动安装

如果没有安装 Codex 或 Claude，或者只是想先把插件放到当前项目目录：

1. 先安装到本地目录：

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent local --dest-dir "$(pwd)/agent-skills"
```

2. 后续手动接入：

- Codex：把 `agent-skills/Acode-kit` 复制到 `~/.codex/skills/Acode-kit`
- Claude Code：
  - 把 `agent-skills/Acode-kit` 复制到 `~/.claude/Acode-kit`
  - 把 `agent-skills/claude/acode-kit.md` 与 `agent-skills/claude/acode-run.md` 复制到 `~/.claude/agents/`



---

## English

### Overview

`Acode-kit` is a project-delivery plugin for AI coding agents. It supports `Codex`, `Claude Code`, and a portable local-folder installation flow for users who want to stage the package before manually installing it into their target agent. It provides a unified entry that handles model-version routing, session continuity, and execution closure under a structured workflow.

### Core Capabilities

- Starts new projects or takes over existing ones with a structured workflow.
- Creates and maintains project documents such as `PRD`, `TRACEABILITY_MATRIX`, `SESSION_HANDOFF`, and `DECISION_LOG`.
- Drives work across requirements, UI/page planning, data/API design, scaffolding, implementation, testing, and release.
- Applies bundled engineering standards to keep scope, quality, and delivery aligned.
- Supports multi-agent distribution for Codex, Claude Code, and portable local installs.
- Unified entry `acode-run` that routes to the right model version and keeps session continuity.
- Built-in fallback rules and token budget guards.

### Highlights

- It is a delivery workflow, not just a prompt snippet.
- It favors scope control, traceability, and document-driven implementation.
- It ships with reusable templates, references, and a Claude adapter.
- It supports both automatic installation and manual fallback installation.
- If the user has neither Codex nor Claude installed yet, the package can still be installed into the current folder and connected later.
- Single entry for users; routing and model switching are automatic.
- Multi-version routing within the same provider with fallback and budget policies.

### Unified Entry (Recommended)

```bash
node ./scripts/acode-run.mjs \
  --project-id demo-project \
  --prompt "Continue the project and finish the next integration slice" \
  --context-summary "Phase: Implementation; REQ-ORDER-003 pending" \
  --provider codex
```

After installation, you can call the entry from the installed bundle:
- Codex: `~/.codex/skills/Acode-kit/scripts/acode-run.mjs`
- Claude: `~/.claude/Acode-kit/scripts/acode-run.mjs`
- Local: `./agent-skills/Acode-kit/scripts/acode-run.mjs`

In Claude, you can also call the `acode-run` subagent (installer copies it to `~/.claude/agents/acode-run.md`).

Dry-run (routing only):

```bash
node ./scripts/acode-run.mjs \
  --project-id demo-project \
  --prompt "Write the session handoff summary" \
  --provider codex \
  --dry-run true
```

### Support Matrix

| Target | Installation result |
| --- | --- |
| `Codex` | `~/.codex/skills/Acode-kit` |
| `Claude Code` | `~/.claude/Acode-kit` plus `~/.claude/agents/acode-kit.md` and `~/.claude/agents/acode-run.md` |
| `Local / no agent yet` | `./agent-skills/Acode-kit` plus a portable Claude adapter |

### Install Modes

The installers now support:

- `--agent auto`: detect installed agents; install to both if Codex and Claude are present; otherwise fall back to `./agent-skills/`
- `--agent codex`: install only to Codex
- `--agent claude`: install only to Claude
- `--agent local`: install only to the current folder as a portable package
- `--agent both`: install to both Codex and Claude
- `--scope user|project`: for Claude user-level or project-level install
- `--dest-dir PATH`: force a custom destination root

### Install Options

#### Codex built-in installer

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit \
  --path Acode-kit
```

#### One-line bash installer

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

Important: when passing `AGENT`, `SCOPE`, or `DEST_ROOT`, pass them to `bash`, not to `curl`.

Examples:

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=codex bash
```

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=claude SCOPE=user bash
```

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=claude SCOPE=project bash
```

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=local DEST_ROOT="$(pwd)/agent-skills" bash
```

#### Windows PowerShell installer

For Windows, use PowerShell directly:

```powershell
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

Example with options (set env vars before running):

```powershell
$env:AGENT = "codex"
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

```powershell
$env:AGENT = "claude"
$env:SCOPE = "project"
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

You can also run the local script entry in this repo:

```powershell
npm run install:win
```

#### Node installer

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent local --dest-dir /tmp/agent-skills
```

### Distribution Coverage
- `scripts/install.mjs`, `scripts/install.sh`, and `scripts/install.ps1` copy `Acode-kit/` and sync `scripts/` into the installed bundle, so router configs and unified entry assets are included automatically.
- `package.json` `files` lists `scripts`, `Acode-kit`, `README.md`, `LICENSE`, which ensures npm/GitHub release packages include router configs, `acode-run.mjs`, and tests.
- Re-running the install command after an update will sync router, entry, and test assets to the target agent directory.

### Manual Installation

1. Stage the portable package locally:

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent local --dest-dir "$(pwd)/agent-skills"
```

2. Install it into the target agent later:

- Codex: copy `agent-skills/Acode-kit` into `~/.codex/skills/Acode-kit`
- Claude Code:
  - copy `agent-skills/Acode-kit` into `~/.claude/Acode-kit`
  - copy `agent-skills/claude/acode-kit.md` and `agent-skills/claude/acode-run.md` into `~/.claude/agents/`
