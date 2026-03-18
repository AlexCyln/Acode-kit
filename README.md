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
- **结构化交付**：4 门控启动 + 7 阶段执行（含按模块 MVP 迭代），双层进度追踪，文档驱动、可追踪、可交接。

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

#### 5. 四门控启动 + 模块驱动执行

```
初始化（CLI）   → acode-kit init → MCP 工具扫描/安装 + NotebookLM 认证 → 写入状态文件

Gate 1: 环境报告   → 读取状态文件 + 工作区检查 → 输出报告 → ⛔ 等待用户确认
Gate 2: 需求分析   → NotebookLM 深化分析 → 输出项目骨架 → ⛔ 等待用户确认
Gate 3: PRD 审批   → 技术栈固化 + PRD + 进度计划 + 需求矩阵 → ⛔ 等待用户确认
Gate 4: 项目搭建   → 目录结构 + 项目文档 + 依赖安装 + 环境配置 → ⛔ 等待用户确认

架构阶段（执行一次）
  Stage 1: 需求结构化 + 模块拆分（输出模块优先级 + 依赖关系）
  Stage 2: 整体 UI 架构（页面清单、导航、布局框架）
  Stage 3: 整体数据模型 + API 框架（ER 图级别）
  Stage 4: 项目脚手架搭建

模块迭代（按优先级逐模块执行）
  Stage 5: 对每个模块 →
    5a 模块需求细化 → 用户确认
    5b 模块 UI 设计（Pencil）→ 用户确认
    5c 模块数据/API 详设 → 用户确认
    5d 模块 TDD 实现（含跨模块回归测试）
    5e 模块测试 + review → 用户确认
    → 更新进度追踪 → 下一个模块

集成与部署（执行一次）
  Stage 6: 集成测试 + 跨模块 review
  Stage 7: 部署上线
```

每个 Gate 要求用户明确确认后才能继续，不允许 AI 自行跳过。Pencil 设计工具仅在 Stage 2（整体 UI 架构）和 Step 5b（模块 UI 详设）允许使用。

#### 6. 双层进度追踪 + AI 会话定位

**TRACEABILITY_MATRIX 双层结构：**

```
上层 — 模块总览（看整体进度）
| 模块编号 | 模块名称 | 优先级 | 依赖模块 | 状态         |
|---------|---------|--------|---------|-------------|
| MOD-001 | 用户认证 | P0     | —       | 完成         |
| MOD-002 | 任务管理 | P0     | MOD-001 | 实现中(5d)   |
| MOD-003 | 仪表盘   | P1     | MOD-001 | 未开始       |

下层 — 当前模块明细（看 TDD 切片进度）
| Slice    | 需求描述      | 实现状态     |
|----------|-------------|-------------|
| MOD-002-S01 | 任务 CRUD  | 绿(passing) |
| MOD-002-S02 | 任务筛选    | 红(failing) |
| MOD-002-S03 | 任务排序    | 未开始       |
```

**SESSION_HANDOFF 定位光标：**

AI 恢复会话时第一眼就知道自己在哪：

```markdown
## 📍 Current Position
- Phase: 模块迭代(Stage 5)
- Module: 任务管理
- Step: 5d
- Slice: 2/5
- Next Action: 实现任务筛选 API
```

### 工作流规则

**前端页面**（模块迭代 Step 5b + 5d）：
1. Step 5b: Pencil 设计当前模块页面 → 用户确认 → shadcn 组件构建
2. Step 5d: 按设计稿 1:1 还原实现

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

> **当前仓库为 Private**：`curl | bash` 远程安装方式暂不可用。请使用下方「本地安装」方式。仓库公开后远程安装命令将自动生效。

#### 本地安装（Private 阶段推荐）

先克隆仓库，然后用 `--source-dir` 从本地安装。安装完成后 clone 目录可删除。

**用户级安装（推荐）** — 装一次，任意目录可用：

```bash
git clone https://github.com/AlexCyln/Acode-kit-Plus.git
cd Acode-kit-Plus
node scripts/install.mjs --source-dir ./Acode-kit --agent claude --scope user
cd ..
rm -rf Acode-kit-Plus  # clone 目录已无用，可删除
```

安装后在任意空文件夹启动项目即可：

```bash
mkdir my-project && cd my-project
# 告诉 AI agent: "Use Acode-kit to build ..."
```

**项目级安装** — 仅在指定项目目录生效，**自动执行初始化**（MCP 扫描 + 安装 + NotebookLM 配置 + 写入状态文件）：

```bash
git clone https://github.com/AlexCyln/Acode-kit-Plus.git
cd Acode-kit-Plus
node scripts/install.mjs --source-dir ./Acode-kit --agent claude --scope project --dest-dir /path/to/my-project/.claude
cd ..
rm -rf Acode-kit-Plus
```

> 项目级安装完成后，init 已自动执行，无需再手动运行。如需跳过自动初始化，加 `--skip-init`。

**其他 Agent：**

```bash
# Codex
node scripts/install.mjs --source-dir ./Acode-kit --agent codex

# 本地便携包
node scripts/install.mjs --source-dir ./Acode-kit --agent local
```

#### 远程安装（仓库公开后可用）

##### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit-Plus/main/scripts/install.sh | bash
```

自动检测已安装的 Agent，未检测到时安装为本地便携包。

指定目标：

```bash
# Codex
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit-Plus/main/scripts/install.sh | AGENT=codex bash

# Claude 用户级
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit-Plus/main/scripts/install.sh | AGENT=claude SCOPE=user bash

# Claude 项目级
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit-Plus/main/scripts/install.sh | AGENT=claude SCOPE=project bash

# 本地便携包
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit-Plus/main/scripts/install.sh | AGENT=local bash
```

> 注意：环境变量必须写在 `bash` 一侧，而非 `curl` 前面。

##### Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit-Plus/main/scripts/install.ps1 | iex
```

```powershell
$env:AGENT = "codex"
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit-Plus/main/scripts/install.ps1 | iex
```

##### Codex 内置安装器

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit-Plus \
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
| `--scope user\|project` | Claude 用户级 / 项目级（项目级自动执行 init） |
| `--dest-dir PATH` | 自定义目标目录 |
| `--yes` | 跳过确认提示（安装和 init 均适用） |
| `--skip-init` | 项目级安装时跳过自动初始化 |

### 初始化

初始化负责扫描 MCP 工具、安装缺失工具、配置 NotebookLM 认证，最终写入 `.acode-kit-initialized.json` 状态文件。**未初始化时 AI 会提示先运行 init，无法进入工作流。**

#### 哪种安装需要手动初始化？

| 安装方式 | 是否需要手动 init |
|----------|------------------|
| `--scope project`（项目级） | **不需要** — 安装时已自动执行 |
| `--scope user`（用户级） | **需要** — 每个新项目目录首次使用前运行一次 |
| 远程安装 (`curl \| bash`) | **需要** — 同用户级 |

#### 手动初始化命令

```bash
# Claude 用户级安装后，在项目目录运行
node ~/.claude/Acode-kit/scripts/acode-kit-init.mjs

# Codex
node ~/.codex/skills/Acode-kit/scripts/acode-kit-init.mjs

# 指定参数
node <安装路径>/scripts/acode-kit-init.mjs --provider claude --yes
```

#### 初始化流程（6 步，CLI 自动执行，无需 AI 参与）

1. 检查项目文件夹状态（空 / 已有项目）
2. 扫描 4 个 MCP 工具的安装状态
3. 询问是否安装缺失工具（可跳过，加 `--yes` 自动安装）
4. 验证安装结果
5. 配置 NotebookLM 认证（提示用户在 AI Agent 中完成浏览器认证）
6. 写入 `.acode-kit-initialized.json` 状态文件

| 参数 | 说明 |
|------|------|
| `--cwd PATH` | 指定工作目录（默认当前目录） |
| `--provider codex\|claude` | 指定 provider（默认自动检测） |
| `--yes` | 跳过确认提示，自动安装缺失工具 |
| `--force` | 强制重新初始化（覆盖已有状态文件） |

### 使用方法

#### 在 AI Agent 中使用（推荐）

安装并初始化后，在项目目录打开 AI Agent，直接告诉它：

```text
使用 Acode-kit，帮我从 0 开始规划并启动一个移动端 App 项目。
```

```text
Use Acode-kit to continue the current project, review PRD and traceability matrix first.
```

AI 会自动执行四门控启动流程：
1. **Gate 1**：读取 `.acode-kit-initialized.json`，输出工作区状态报告 → 等你确认
2. **Gate 2**：调用 NotebookLM 深化需求分析，输出项目骨架 → 等你确认
3. **Gate 3**：生成 PRD + 进度计划 + 需求矩阵 → 等你确认
4. **Gate 4**：创建项目目录结构 + 安装依赖 + 填充 9 份项目文档（含 PROJECT_SKELETON） → 等你确认
5. 全部门控通过后，进入架构阶段（Stage 1-4）建立整体框架
6. 然后进入模块迭代（Stage 5），按优先级逐模块执行：需求细化 → UI 设计 → 数据/API → TDD 实现 → 测试
7. 最后集成测试（Stage 6）+ 部署上线（Stage 7）

#### 模型路由 CLI（高级 / 调试用）

`acode-run` 是内部模型路由层，由 AI 工作流自动调用。也可手动测试路由：

```bash
node ./scripts/acode-run.mjs \
  --project-id my-project \
  --prompt "从零开始构建一个 SaaS 订单管理系统" \
  --provider codex

# 验证路由（不执行模型调用）
node ./scripts/acode-run.mjs \
  --project-id my-project \
  --prompt "扫描工具并安装缺失的 MCP 工具" \
  --dry-run true
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
│   │       └── (init handled by CLI script, no adapter needed)
│   ├── assets/
│   │   └── project-doc-templates/        # 9 份项目文档模板（含 PROJECT_SKELETON）
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
- **Structured delivery**: 4-gate startup + 7-stage execution (with per-module MVP iteration), dual-layer progress tracking, document-driven, traceable, handoff-ready.

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

#### 5. Four-Gate Startup + Module-Driven Execution

```
Init (CLI)     → acode-kit init → MCP tool scan/install + NotebookLM auth → write status file

Gate 1: Status Report  → Read status file + workspace check → output report → ⛔ wait for user
Gate 2: Requirements   → NotebookLM deep analysis → project skeleton → ⛔ wait for user
Gate 3: PRD Approval   → Lock tech stack + PRD + progress plan + traceability → ⛔ wait for user
Gate 4: Project Setup  → Directory structure + project docs + dependencies + env → ⛔ wait for user

Architecture Stages (execute once)
  Stage 1: Requirements structuring + module decomposition (output priorities + dependencies)
  Stage 2: Overall UI architecture (page inventory, navigation, layout framework)
  Stage 3: Overall data model + API framework (ER-diagram level)
  Stage 4: Project scaffold initialization

Module Iteration (per module by priority)
  Stage 5: For each module →
    5a Module requirements detail → user confirms
    5b Module UI design (Pencil) → user confirms
    5c Module data/API detail design → user confirms
    5d Module TDD implementation (with cross-module regression tests)
    5e Module test + review → user confirms
    → Update progress tracking → next module

Integration & Deployment (execute once)
  Stage 6: Integration testing + cross-module review
  Stage 7: Deployment and go-live
```

Each gate requires explicit user confirmation. The AI cannot skip gates. Pencil design tools are only allowed at Stage 2 (overall UI architecture) and Step 5b (module UI detail design).

#### 6. Dual-Layer Progress Tracking + AI Session Orientation

**TRACEABILITY_MATRIX dual-layer structure:**

```
Upper layer — Module overview (see overall progress)
| Module   | Priority | Dependencies | Status       |
|----------|----------|-------------|-------------|
| MOD-001  | P0       | —           | Complete     |
| MOD-002  | P0       | MOD-001     | Impl (5d)   |
| MOD-003  | P1       | MOD-001     | Not started  |

Lower layer — Current module detail (see TDD slice progress)
| Slice       | Requirement     | Status         |
|-------------|----------------|----------------|
| MOD-002-S01 | Task CRUD      | Green (passing)|
| MOD-002-S02 | Task filtering | Red (failing)  |
| MOD-002-S03 | Task sorting   | Not started    |
```

**SESSION_HANDOFF position cursor:**

AI instantly knows where it is when resuming a session:

```markdown
## 📍 Current Position
- Phase: Module Iteration (Stage 5)
- Module: Task Management
- Step: 5d
- Slice: 2/5
- Next Action: Implement task filtering API
```

### Quick Install

> **This repo is currently Private.** The `curl | bash` remote install method is unavailable. Use the "Local Install" method below. Remote install commands will work automatically once the repo is made public.

#### Local Install (Recommended while Private)

Clone the repo first, then install from the local copy using `--source-dir`. The clone directory can be deleted after installation.

**User-level install (Recommended)** — install once, use from any directory:

```bash
git clone https://github.com/AlexCyln/Acode-kit-Plus.git
cd Acode-kit-Plus
node scripts/install.mjs --source-dir ./Acode-kit --agent claude --scope user
cd ..
rm -rf Acode-kit-Plus  # clone directory no longer needed
```

Then start a project from any empty folder:

```bash
mkdir my-project && cd my-project
# Tell your AI agent: "Use Acode-kit to build ..."
```

**Project-level install** — scoped to a specific project directory, **auto-runs initialization** (MCP scan + install + NotebookLM config + status file):

```bash
git clone https://github.com/AlexCyln/Acode-kit-Plus.git
cd Acode-kit-Plus
node scripts/install.mjs --source-dir ./Acode-kit --agent claude --scope project --dest-dir /path/to/my-project/.claude
cd ..
rm -rf Acode-kit-Plus
```

> Project-level install auto-runs init after copying files. No need to run init manually. Use `--skip-init` to skip auto-initialization.

**Other agents:**

```bash
# Codex
node scripts/install.mjs --source-dir ./Acode-kit --agent codex

# Local portable
node scripts/install.mjs --source-dir ./Acode-kit --agent local
```

#### Remote Install (Available after repo is public)

##### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit-Plus/main/scripts/install.sh | bash
```

Auto-detects installed agents. Falls back to local portable install if none found.

Specify target:

```bash
# Codex only
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit-Plus/main/scripts/install.sh | AGENT=codex bash

# Claude user-level
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit-Plus/main/scripts/install.sh | AGENT=claude SCOPE=user bash

# Claude project-level
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit-Plus/main/scripts/install.sh | AGENT=claude SCOPE=project bash
```

> Note: Environment variables must be passed to `bash`, not before `curl`.

##### Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit-Plus/main/scripts/install.ps1 | iex
```

##### Codex built-in installer

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit-Plus --path Acode-kit
```

### Support Matrix

| Target | Installation result |
|--------|-------------------|
| Codex | `~/.codex/skills/Acode-kit` |
| Claude Code (user) | `~/.claude/Acode-kit` + subagent adapters |
| Claude Code (project) | `./.claude/Acode-kit` + subagent adapters |
| Local / no agent | `./agent-skills/Acode-kit` + portable Claude adapters |

### Initialization

Initialization scans MCP tools, installs missing ones, configures NotebookLM authentication, and writes the `.acode-kit-initialized.json` status file. **The AI will refuse to proceed without this file.**

#### Which install method needs manual init?

| Install method | Manual init needed? |
|----------------|-------------------|
| `--scope project` (project-level) | **No** — auto-runs during install |
| `--scope user` (user-level) | **Yes** — run once per new project directory |
| Remote install (`curl \| bash`) | **Yes** — same as user-level |

#### Manual init command

```bash
# Claude user-level: run in your project directory
node ~/.claude/Acode-kit/scripts/acode-kit-init.mjs

# Codex
node ~/.codex/skills/Acode-kit/scripts/acode-kit-init.mjs

# With options
node <install-path>/scripts/acode-kit-init.mjs --provider claude --yes
```

#### Init flow (6 steps, CLI-driven, no AI involvement)

1. Check project folder state (empty / existing)
2. Scan 4 MCP tools for installation status
3. Prompt to install missing tools (skippable, use `--yes` to auto-install)
4. Verify installation results
5. Configure NotebookLM authentication (prompts user to complete browser auth in AI Agent)
6. Write `.acode-kit-initialized.json` status file

| Flag | Description |
|------|-------------|
| `--cwd PATH` | Working directory (defaults to cwd) |
| `--provider codex\|claude` | Target provider (auto-detected if omitted) |
| `--yes` | Skip confirmation prompts, auto-install missing tools |
| `--force` | Force re-initialization (overwrite existing status file) |

### Usage

#### In your AI Agent (Recommended)

After installation and initialization, open your AI Agent in the project directory and tell it:

```text
Use Acode-kit to plan and start a mobile app project from scratch.
```

```text
Use Acode-kit to continue the current project. Review PRD and traceability matrix first.
```

The AI will automatically execute the four-gate startup workflow:
1. **Gate 1**: Read `.acode-kit-initialized.json`, output workspace status report → waits for your confirmation
2. **Gate 2**: Call NotebookLM for requirements analysis, output project skeleton → waits for your confirmation
3. **Gate 3**: Generate PRD + progress plan + traceability matrix → waits for your confirmation
4. **Gate 4**: Create project directory, install dependencies, populate 9 project docs (incl. PROJECT_SKELETON) → waits for your confirmation
5. After all gates pass, enters architecture stages (Stage 1-4) to establish the overall framework
6. Then enters module iteration (Stage 5) — executes each module by priority: requirements → UI design → data/API → TDD implementation → test
7. Finally integration testing (Stage 6) + deployment (Stage 7)

#### Model Routing CLI (Advanced / Debugging)

`acode-run` is the internal model routing layer, called automatically by the AI workflow. You can also test routing manually:

```bash
node ./scripts/acode-run.mjs \
  --project-id my-project \
  --prompt "Build a SaaS order management system from scratch" \
  --provider codex

# Verify routing without executing model calls
node ./scripts/acode-run.mjs \
  --project-id my-project \
  --prompt "Scan tools and install missing MCP tools" \
  --dry-run true
```

### Install Modes

| Flag | Description |
|------|-------------|
| `--agent auto` | Auto-detect, install to all found agents |
| `--agent codex` | Codex only |
| `--agent claude` | Claude only |
| `--agent local` | Local portable package |
| `--agent both` | Both Codex and Claude |
| `--scope user\|project` | Claude user-level or project-level (project auto-runs init) |
| `--dest-dir PATH` | Custom destination directory |
| `--yes` | Skip confirmation prompts (applies to both install and init) |
| `--skip-init` | Skip auto-initialization for project-level install |

### Testing

```bash
npm run test:router    # Router mapping and fallback tests
npm run test:entry     # Entry point classification and routing tests
npm run test:mcp       # MCP tool scan tests
npm run test:init      # Initialization command tests
```

### License

MIT
