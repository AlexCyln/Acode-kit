# Acode-kit

**Tech-stack-agnostic, TDD-driven project delivery framework for AI coding agents.**

中文 | [English](#english)

---

## 中文

### 项目简介

`Acode-kit` 是一个面向 AI 编码代理（Codex、Claude Code）的**技术栈无关**项目交付框架。它不是一个提示词模板，而是一套完整的工程方法论 + 工作流引擎 + 工具链集成：

- **技术栈无关**：不绑定任何固定框架。iOS、Android、小程序、Web、桌面——项目初始化时声明技术栈，框架自动适配。
- **TDD 驱动**：红-绿-重构循环作为宪法级开发方法论，贯穿每个实现切片。
- **MCP 工具集成**：自动扫描和管理 Pencil（设计稿）、NotebookLM（需求分析）、shadcn（UI 组件）、Chrome DevTools（调试）四大工具。
- **智能模型路由**：按任务阶段、类型、难度自动选择最优模型版本，内置降级策略与 token 预算控制。
- **结构化交付**：从需求到上线的 8 阶段闭环，文档驱动、可追踪、可交接。

### 核心创新

#### 1. 技术栈决策框架

告别硬编码技术栈。Acode-kit 定义了一个分类决策框架：

| 分类 | 说明 | 示例 |
|------|------|------|
| 项目类型 | Web / 移动 / 小程序 / 桌面 | iOS App、SaaS Web |
| 前端框架 | 按项目类型选择 | React、Vue、SwiftUI、Flutter |
| UI 组件库 | 按前端框架生态选择 | shadcn/ui、Element Plus、Ant Design |
| 后端运行时 | 按团队能力和业务需求选择 | Node.js、Spring Boot、Go |
| ORM/数据访问 | 按后端运行时选择 | Prisma、MyBatis、GORM |
| 数据库 | 按数据模型选择 | PostgreSQL、MySQL、MongoDB |
| 缓存 | 按性能需求选择（可选） | Redis、Memcached |
| 认证方案 | 按安全需求选择 | JWT、OAuth 2.0、Session |
| 部署平台 | 按运维能力选择 | Docker、Vercel、AWS |
| 设计工具 | 按团队偏好选择 | Pencil、Figma |

每个项目通过 `PROJECT_OVERRIDES.md` 声明技术栈，全部 31 份工程规范自动适配。

#### 2. TDD 宪法条款

每个垂直切片必须遵循：

```
红（Red）    → 写一个描述预期行为的失败测试
绿（Green）  → 写最小量实现使测试通过
重构（Refactor） → 在测试保护下优化代码结构
```

TDD 不是建议，是门禁——不写失败测试就不允许写生产代码。

#### 3. MCP 工具自动化

项目启动时自动扫描并管理四大 MCP 工具：

| 工具 | 用途 | 缺位降级 |
|------|------|----------|
| **Pencil MCP** | UI/UX 设计稿 | AI 生成文字布局描述 |
| **NotebookLM MCP** | 需求分析与项目骨架 | AI 直接分析 |
| **shadcn MCP** | UI 组件库集成 | 手动组件搭建 |
| **Chrome DevTools MCP** | 前端调试 | 传统日志调试 |

工具状态三态管理：`installed` → `missing` → `degraded`，每个工具都有完整的降级方案。

#### 4. 智能模型路由

```
用户下达任务
    ↓
关键词分类 → 阶段(需求/设计/实现/测试/上线) + 难度(low/medium/high)
    ↓
模型映射 → 按 provider(Codex/Claude) + 难度 选择模型版本
    ↓
预算检查 → 阶段 token 硬上限 + 任务软上限
    ↓
执行 → 成功返回 | 触发降级(error → timeout → quality_low → budget_exceeded)
    ↓
输出 → selectedModel / finalModel / fallbackTriggered / token usage
```

单入口 `acode-run`，用户无感完成模型选择、降级、会话承接。

#### 5. 五步启动工作流

```
Step 1: 环境扫描     → 文件夹状态 + MCP 工具检测 + 自动安装
Step 2: 需求分析     → NotebookLM 分析 → 输出项目骨架 → 用户确认
Step 3: 首期 PRD     → 技术栈固化 → PRD + 进度计划 + 需求矩阵
Step 4: 环境搭建     → 目录 / 依赖 / 包 / 配置
Step 5: 持续实施     → 8 阶段闭环 × TDD × 小垂直切片
```

### 工作流规则

**前端页面**（Pencil + shadcn 可用时）：
1. Pencil 设计稿 → 用户确认
2. shadcn 组件库构建
3. 按设计稿 1:1 还原

**大规模需求变更**（影响 > 30% 模块）：
1. 重走 NotebookLM 分析 → 输出变更骨架 → 用户确认
2. 更新 PRD、需求矩阵、决策日志后再实施

### 支持矩阵

| 目标 | 安装结果 |
|------|----------|
| Codex | `~/.codex/skills/Acode-kit` |
| Claude Code（用户级） | `~/.claude/Acode-kit` + `~/.claude/agents/acode-kit.md` + `acode-run.md` |
| Claude Code（项目级） | `./.claude/Acode-kit` + `./.claude/agents/acode-kit.md` + `acode-run.md` |
| 本地便携包 | `./agent-skills/Acode-kit` + Claude 适配文件 |

### 快速安装

#### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

自动检测已安装的 Agent，未检测到时安装为本地便携包。

指定目标：

```bash
# Codex
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=codex bash

# Claude 用户级
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=claude SCOPE=user bash

# Claude 项目级
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=claude SCOPE=project bash

# 本地便携包
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=local bash
```

> 注意：环境变量必须写在 `bash` 一侧，而非 `curl` 前面。

#### Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

```powershell
$env:AGENT = "codex"
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

#### Node 安装器

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent local --dest-dir /tmp/agent-skills
node ./scripts/install.mjs --repo AlexCyln/Acode-kit --agent claude --scope user
```

#### Codex 内置安装器

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit \
  --path Acode-kit
```

### 安装模式

| 参数 | 说明 |
|------|------|
| `--agent auto` | 自动检测，同时安装到已有 Agent |
| `--agent codex` | 仅 Codex |
| `--agent claude` | 仅 Claude |
| `--agent local` | 本地便携包 |
| `--agent both` | Codex + Claude |
| `--scope user\|project` | Claude 用户级 / 项目级 |
| `--dest-dir PATH` | 自定义目标目录 |

### 初始化（安装后必须执行）

安装完成后，**必须先运行初始化命令**，完成 MCP 工具扫描、安装和 NotebookLM 认证配置：

```bash
# 在项目目录中运行
acode-kit init

# 或指定工作目录和 provider
acode-kit init --cwd /path/to/project --provider claude
```

> 如果 `acode-kit` 命令不可用，可直接使用 `node ./scripts/acode-kit.mjs init`。

初始化流程：
1. 检查项目文件夹状态（空 / 已有项目）
2. 扫描 4 个 MCP 工具的安装状态
3. 询问是否安装缺失工具（可跳过）
4. 验证安装结果
5. 配置 NotebookLM 认证（触发浏览器登录）
6. 写入 `.acode-kit-initialized.json` 状态文件

| 参数 | 说明 |
|------|------|
| `--cwd PATH` | 指定工作目录（默认当前目录） |
| `--provider codex\|claude` | 指定 provider（默认自动检测） |
| `--yes` | 跳过确认提示，自动安装 |
| `--force` | 强制重新初始化 |

> **重要**：初始化完成后才能调用 Acode-kit 执行项目任务。未初始化时 AI 会提示先运行 init。

### 使用方法

#### 统一入口（推荐）

```bash
node ./scripts/acode-run.mjs \
  --project-id my-project \
  --prompt "从零开始构建一个 SaaS 订单管理系统" \
  --provider codex
```

输出包含完整路由信息：

```json
{
  "success": true,
  "route": {
    "provider": "codex",
    "phase": "实现",
    "taskType": "前后端编码开发",
    "difficulty": "high",
    "selectedModel": "gpt-5.4-codex",
    "finalModel": "gpt-5.4-codex",
    "fallbackTriggered": false
  }
}
```

#### 验证路由（不执行模型调用）

```bash
node ./scripts/acode-run.mjs \
  --project-id my-project \
  --prompt "扫描工具并安装缺失的 MCP 工具" \
  --dry-run true
```

#### 在 Agent 中使用

安装后直接告诉 AI：

```text
使用 Acode-kit，帮我从 0 开始规划并启动一个移动端 App 项目。
```

```text
Use Acode-kit to continue the current project, review PRD and traceability matrix first.
```

### 项目结构

```text
.
├── Acode-kit/
│   ├── SKILL.md                          # 核心工作流定义
│   ├── extensions/
│   │   └── router/                       # 模型路由引擎
│   │       ├── config/
│   │       │   ├── model-map.json        # 阶段→模型映射
│   │       │   ├── task-classifier.json   # 关键词分类规则
│   │       │   └── policy.json           # token 预算与降级策略
│   │       ├── SKILL.md
│   │       └── README.md
│   ├── integrations/
│   │   └── claude/                       # Claude 子代理适配
│   │       ├── acode-kit.md
│   │       ├── acode-run.md
│   │       └── acode-init.md
│   ├── assets/
│   │   └── project-doc-templates/        # 8 份项目文档模板
│   └── references/
│       └── global-engineering-standards/  # 31 份全局工程规范
├── scripts/
│   ├── acode-kit.mjs                     # 统一 CLI 分发器 (acode-kit init/scan/run)
│   ├── acode-kit-init.mjs                # 初始化命令
│   ├── acode-run.mjs                     # 模型路由入口
│   ├── router-exec.mjs                   # 路由执行引擎
│   ├── agent-execute.mjs                 # Provider 适配层
│   ├── mcp-tool-scan.mjs                 # MCP 工具扫描与安装
│   ├── install.sh / install.mjs / install.ps1  # 三平台安装器
│   └── test-*.mjs                        # 测试脚本
├── package.json
├── README.md
└── LICENSE
```

### 工程规范体系

31 份全局规范覆盖完整开发生命周期：

| 编号 | 领域 | 说明 |
|------|------|------|
| 00 | 工程宪法 | 技术栈决策框架 + TDD 宪法条款 |
| 01 | 需求 | PRD 结构、需求分级、验收口径 |
| 02 | 设计 | 信息架构、设计交付、页面还原 |
| 03-07 | 架构 | 前端、后端、API、数据库、缓存（全部技术栈无关） |
| 08-12 | 协作 | 代码风格、Git 工作流、Review、测试、排障 |
| 13-14 | 交付 | 部署、CI/CD |
| 15-18 | 运维 | AI 协作、安全、可观测性、环境配置 |
| 19-30 | 复用 | 多项目目录、数据建模、Prompt 指南、单人项目运行等 |
| 31 | 工具 | 第三方 MCP 工具注册、安装、追踪与降级 |

### 测试

```bash
npm run test:router    # 路由映射与降级测试
npm run test:entry     # 统一入口分类与路由测试
npm run test:mcp       # MCP 工具扫描测试
npm run test:init      # 初始化命令测试
```

### 分发说明

- 安装脚本会同步拷贝 `Acode-kit/` + `scripts/` 到目标目录
- `package.json` 的 `files` 字段保证 GitHub Release / npm 包含所有必要文件
- 重新运行安装命令即可升级到最新版本

---

## English

### Overview

`Acode-kit` is a **tech-stack-agnostic, TDD-driven** project delivery framework for AI coding agents (Codex, Claude Code). It is not a prompt template — it is a complete engineering methodology + workflow engine + toolchain integration:

- **Tech-stack agnostic**: No hardcoded frameworks. iOS, Android, mini-programs, Web, desktop — declare your stack at project init, the framework adapts.
- **TDD-driven**: Red-Green-Refactor cycle as a constitutional development methodology, enforced across every implementation slice.
- **MCP tool integration**: Auto-scan and manage Pencil (design), NotebookLM (requirements analysis), shadcn (UI components), Chrome DevTools (debugging).
- **Smart model routing**: Automatic model version selection by task phase, type, and difficulty, with built-in fallback and token budget control.
- **Structured delivery**: 8-stage closed-loop from requirements to go-live, document-driven, traceable, handoff-ready.

### Key Innovations

#### 1. Tech Stack Decision Framework

No more hardcoded tech stacks. Acode-kit defines a category-based decision framework:

| Category | Description | Examples |
|----------|-------------|----------|
| Project type | Web / Mobile / Mini-program / Desktop | iOS App, SaaS Web |
| Frontend framework | Per project type | React, Vue, SwiftUI, Flutter |
| UI component library | Per frontend ecosystem | shadcn/ui, Element Plus, Ant Design |
| Backend runtime | Per team capability | Node.js, Spring Boot, Go |
| ORM / data access | Per backend runtime | Prisma, MyBatis, GORM |
| Database | Per data model | PostgreSQL, MySQL, MongoDB |
| Cache | Per performance needs (optional) | Redis, Memcached |
| Auth scheme | Per security requirements | JWT, OAuth 2.0, Session |
| Deployment | Per ops capability | Docker, Vercel, AWS |
| Design tool | Per team preference | Pencil, Figma |

Each project declares its stack in `PROJECT_OVERRIDES.md`. All 31 engineering specs adapt automatically.

#### 2. TDD Constitutional Clause

Every vertical slice must follow:

```
Red     → Write a failing test describing expected behavior
Green   → Write minimal implementation to make it pass
Refactor → Optimize under test protection
```

TDD is a gate, not a suggestion — no failing test, no production code.

#### 3. MCP Tool Automation

Four MCP tools are auto-scanned and managed at project startup:

| Tool | Purpose | Degradation |
|------|---------|-------------|
| **Pencil MCP** | UI/UX design drafts | AI-generated text layout descriptions |
| **NotebookLM MCP** | Requirements analysis & project skeleton | Direct AI analysis |
| **shadcn MCP** | UI component library integration | Manual component building |
| **Chrome DevTools MCP** | Frontend debugging | Traditional log debugging |

Three-state tracking: `installed` → `missing` → `degraded`. Every tool has a complete fallback strategy.

#### 4. Smart Model Routing

```
User submits task
    ↓
Keyword classification → Phase (requirements/design/implementation/testing/go-live) + Difficulty
    ↓
Model mapping → Select model version by provider (Codex/Claude) + difficulty
    ↓
Budget check → Phase token hard cap + task soft cap
    ↓
Execute → Success | Trigger fallback (error → timeout → quality_low → budget_exceeded)
    ↓
Output → selectedModel / finalModel / fallbackTriggered / token usage
```

Single entry `acode-run` — model selection, fallback, and session continuity are transparent to the user.

#### 5. Five-Step Startup Workflow

```
Step 1: Environment Scan    → Folder state + MCP tool detection + auto-install
Step 2: Requirements Analysis → NotebookLM analysis → project skeleton → user confirms
Step 3: First-iteration PRD  → Lock tech stack → PRD + progress plan + traceability matrix
Step 4: Environment Setup    → Directories / dependencies / packages / config
Step 5: Continuous Delivery   → 8-stage loop × TDD × small vertical slices
```

### Quick Install

#### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

Auto-detects installed agents. Falls back to local portable install if none found.

Specify target:

```bash
# Codex only
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=codex bash

# Claude user-level
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=claude SCOPE=user bash

# Claude project-level
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | AGENT=claude SCOPE=project bash
```

> Note: Environment variables must be passed to `bash`, not before `curl`.

#### Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

#### Node installer

```bash
node ./scripts/install.mjs --repo AlexCyln/Acode-kit --agent claude --scope user
```

#### Codex built-in installer

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit --path Acode-kit
```

### Support Matrix

| Target | Installation result |
|--------|-------------------|
| Codex | `~/.codex/skills/Acode-kit` |
| Claude Code (user) | `~/.claude/Acode-kit` + subagent adapters |
| Claude Code (project) | `./.claude/Acode-kit` + subagent adapters |
| Local / no agent | `./agent-skills/Acode-kit` + portable Claude adapters |

### Initialization (Required After Install)

After installation, **you must run the init command first** to scan/install MCP tools and configure NotebookLM authentication:

```bash
# Run in your project directory
acode-kit init

# Or specify working directory and provider
acode-kit init --cwd /path/to/project --provider claude
```

> If `acode-kit` is not on your PATH, use `node ./scripts/acode-kit.mjs init` instead.

Initialization flow:
1. Check project folder state (empty / existing)
2. Scan 4 MCP tools for installation status
3. Prompt to install missing tools (skippable)
4. Verify installation results
5. Configure NotebookLM authentication (triggers browser login)
6. Write `.acode-kit-initialized.json` status file

| Flag | Description |
|------|-------------|
| `--cwd PATH` | Working directory (defaults to cwd) |
| `--provider codex\|claude` | Target provider (auto-detected if omitted) |
| `--yes` | Skip confirmation prompts, auto-install |
| `--force` | Force re-initialization |

> **Important**: You must complete initialization before using Acode-kit for project tasks. The AI will prompt you to run init if not initialized.

### Usage

#### Unified Entry (Recommended)

```bash
node ./scripts/acode-run.mjs \
  --project-id my-project \
  --prompt "Build a SaaS order management system from scratch" \
  --provider codex
```

Output includes full routing info:

```json
{
  "success": true,
  "route": {
    "provider": "codex",
    "phase": "implementation",
    "taskType": "full-stack development",
    "difficulty": "high",
    "selectedModel": "gpt-5.4-codex",
    "finalModel": "gpt-5.4-codex",
    "fallbackTriggered": false
  }
}
```

#### In your AI agent

After installation, simply tell the AI:

```text
Use Acode-kit to plan and start a mobile app project from scratch.
```

```text
Use Acode-kit to continue the current project. Review PRD and traceability matrix first.
```

### Install Modes

| Flag | Description |
|------|-------------|
| `--agent auto` | Auto-detect, install to all found agents |
| `--agent codex` | Codex only |
| `--agent claude` | Claude only |
| `--agent local` | Local portable package |
| `--agent both` | Both Codex and Claude |
| `--scope user\|project` | Claude user-level or project-level |
| `--dest-dir PATH` | Custom destination directory |

### Testing

```bash
npm run test:router    # Router mapping and fallback tests
npm run test:entry     # Entry point classification and routing tests
npm run test:mcp       # MCP tool scan tests
npm run test:init      # Initialization command tests
```

### License

MIT
