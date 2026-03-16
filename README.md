# Acode-kit

中文 | [English](#english)

## 中文

### 项目简介

`Acode-kit` 是一个面向 Codex 的项目启动与推进 skill，适合个人开发者或小团队在 solo + AI 的协作模式下，从一个想法快速进入规范化执行。它把“需求、文档、实现、测试、交付”串成一条固定工作流，避免一上来就无边界写代码。

### 实现功能

- 用统一 workflow 启动新项目，或接管继续推进中的项目。
- 自动要求并维护项目级文档，如 `PRD`、`TRACEABILITY_MATRIX`、`SESSION_HANDOFF`、`DECISION_LOG`。
- 按阶段推进：需求结构化、页面设计、数据/API 设计、脚手架初始化、小闭环实现、测试、部署。
- 绑定一套全局工程规范，控制技术栈、范围、代码质量和交付节奏。
- 支持把每次任务沉淀回文档，保证上下文可持续。

### 特色亮点

- 不是“只会生成代码”的 skill，而是“先定边界，再做实现”的项目执行器。
- 内置大量工程规范和项目模板，能把模糊想法收敛成可执行项目。
- 强调 traceability，需求、实现、测试、上线记录可以互相对齐。
- 强调小步快跑和持续 handoff，适合长期连续开发，不容易失控。
- 打包后可直接通过 GitHub、bash 一键脚本、npm `npx` 分发。

### 使用方法

当你希望 Codex：

- 从一个项目点子开始搭建完整项目框架；
- 在已有项目中继续工作，并保持文档、需求、实现同步；
- 用固定流程推进需求、设计、开发、测试、上线；

就可以调用 `Acode-kit`。

典型触发方式：

```text
使用 Acode-kit skill，帮我从 0 开始规划并启动一个 SaaS 项目。
```

```text
使用 Acode-kit skill，继续推进当前项目，并先检查 PRD、TRACEABILITY_MATRIX、SESSION_HANDOFF。
```

### 仓库结构

```text
.
├── Acode-kit/
│   ├── SKILL.md
│   ├── assets/
│   └── references/
├── scripts/
│   ├── install.mjs
│   └── install.sh
├── README.md
├── PUBLISH_STEPS.md
├── package.json
└── LICENSE
```

### 安装方式

#### 1. 用 Codex 内置 skill-installer 从 GitHub 安装

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit \
  --path Acode-kit
```

#### 2. 用 bash 一键安装

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

如需显式传参：

```bash
REPO=AlexCyln/Acode-kit REF=main SKILL_PATH=Acode-kit \
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

#### 3. 用 `npx` 安装

发布到 npm 后可使用：

```bash
npx @your-npm-scope/structcode-skill-installer
```

指定参数版本：

```bash
npx @your-npm-scope/structcode-skill-installer \
  --repo AlexCyln/Acode-kit \
  --ref main \
  --skill-path Acode-kit
```

### 本地验证

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --dest-dir /tmp/structcode-skills
```

预期生成：

```text
/tmp/structcode-skills/Acode-kit
```

### GitHub 发布说明

首次发布 GitHub，建议直接按 [PUBLISH_STEPS.md](./PUBLISH_STEPS.md) 操作。该文件已经补充了从注册准备、网页创建仓库、上传代码、验证安装，到可选 npm 发布的详细步骤。

---

## English

### Project Overview

`Acode-kit` is a Codex skill for starting, structuring, and continuing software projects in a solo + AI workflow. It turns a rough idea into a controlled execution flow across requirements, documentation, implementation, testing, and delivery instead of jumping straight into code generation.

### Core Capabilities

- Starts new projects or takes over existing ones with a consistent workflow.
- Creates and maintains project-level documents such as `PRD`, `TRACEABILITY_MATRIX`, `SESSION_HANDOFF`, and `DECISION_LOG`.
- Drives work stage by stage: requirements, UI/page structure, data/API design, scaffolding, vertical-slice implementation, testing, and deployment.
- Applies bundled engineering standards to keep stack, scope, quality, and delivery aligned.
- Writes progress back into project documents so work remains traceable and resumable.

### Highlights

- It is a project execution skill, not just a code generation prompt.
- It ships with reusable templates and engineering standards that reduce project chaos.
- It emphasizes traceability between requirements, implementation, testing, and go-live records.
- It favors small, controlled slices and persistent handoff notes for long-running projects.
- It can be distributed through GitHub, a one-line bash installer, or npm `npx`.

### How To Use

Use `Acode-kit` when you want Codex to:

- bootstrap a project from a high-level idea;
- continue an in-progress project while keeping docs and implementation aligned;
- follow a fixed stage-based workflow from planning to release.

Example prompts:

```text
Use the Acode-kit skill to bootstrap a SaaS project from scratch.
```

```text
Use the Acode-kit skill to continue the current repository and review PRD, TRACEABILITY_MATRIX, and SESSION_HANDOFF first.
```

### Repository Layout

```text
.
├── Acode-kit/
│   ├── SKILL.md
│   ├── assets/
│   └── references/
├── scripts/
│   ├── install.mjs
│   └── install.sh
├── README.md
├── PUBLISH_STEPS.md
├── package.json
└── LICENSE
```

### Install Options

#### 1. Install from GitHub with Codex's built-in skill installer

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit \
  --path Acode-kit
```

#### 2. Install with one bash command

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

With explicit variables:

```bash
REPO=AlexCyln/Acode-kit REF=main SKILL_PATH=Acode-kit \
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

#### 3. Install with `npx`

After publishing to npm:

```bash
npx @your-npm-scope/structcode-skill-installer
```

With explicit flags:

```bash
npx @your-npm-scope/structcode-skill-installer \
  --repo AlexCyln/Acode-kit \
  --ref main \
  --skill-path Acode-kit
```

### Local Verification

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --dest-dir /tmp/structcode-skills
```

Expected output:

```text
/tmp/structcode-skills/Acode-kit
```

### Publishing

For a first-time GitHub release, follow the detailed step-by-step guide in [PUBLISH_STEPS.md](./PUBLISH_STEPS.md). It now covers account preparation, repository creation in the GitHub web UI, code upload, installer verification, and optional npm publishing.
