# Acode-kit

> 🚀 A structured project-delivery framework for AI coding agents  
> 以规范化、可追踪、工程化的方式，让 AI 更稳定地参与真实项目交付

中文 | [English](#english)

---

## 中文

### 版本

- 当前版本：`v3.0`
- 单一版本源：`VERSION`
- `acode-kit -status`、初始化状态文件与安装器展示版本统一读取该文件

### ✨ Acode-kit 是什么

`Acode-kit` 不是“再多一套 prompt”，也不是“自动生成一切”的魔法工具。  
它是一个面向 AI 编码代理的 **项目交付框架**，核心目标是把：

- 需求梳理
- PRD 与项目骨架
- 架构与设计
- 模块迭代
- 测试与 review
- 部署与上线

串成一条 **有门禁、有规范、有文档状态、有回归验证** 的可控 workflow。

它帮助个人或团队把 AI 从“零散帮写代码”提升到“参与真实产品交付”，但仍然坚持：  
**需求判断、工程思维、架构设计能力、prompt 质量，始终比工具本身更重要。**

---

### 🌟 为什么它重要

#### 1. 让不会编程的人也能真正使用 AI 做产品

过去很多 AI coding 工具，本质上仍然默认使用者会编程、会调试、会搭架构。  
Acode-kit 想解决的是另一类更大的真实问题：

- 很懂业务的人，往往不会写代码
- 会写代码的人，未必真正理解业务
- 产品想法与真正落地之间，总是隔着一层“实现门槛”

Acode-kit 的目标，就是让**业务第一人**更有机会直接推动产品落地。

#### 2. 让“懂业务的人”第一次真正拥有软件构建能力

你不一定需要先成为资深工程师，才有资格构建产品。  
如果你已经具备这些能力：

- 基本的需求判断
- 基本的工程思维
- 基本的架构设计意识
- 持续学习能力
- 合格的 prompt 质量

再借助 Acode-kit，你就有机会打造出一款真正意义上的软件产品，而不是停留在 demo、原型或一次性脚本。

#### 3. 它强调的是“规范化放大”，不是“无脑代替”

Acode-kit 不是在告诉你“AI 会替你想清楚一切”。  
它强调的是：

- 用严谨框架约束 agent 发散
- 用规范化 workflow 提高稳定性
- 用工程方法把创意变成可交付物

这意味着它既有足够的约束力，又保留了足够的泛化性，支持你的业务创意继续延伸。

---

### 🧭 核心思路与方法论

Acode-kit 的基本思想很简单：

1. 先把项目事实讲清楚，再进入实现
2. 先把规则分层管理，再让 AI 按需读取
3. 先冻结边界和文档状态，再让模块迭代展开
4. 让 AI 帮你标准化、结构化、提效，而不是替你思考业务本身

同时它明确采用：

1. **TDD 驱动思想**：先验证行为，再实现，再重构
2. **Spec coding 思想**：先规范和边界，再进入生成与实现
3. **工程化交付思想**：需求、设计、数据、测试、发布一体化推进
4. **前沿但克制的 AI 协作思想**：让 agent 发挥能力，但不允许脱离约束自由漂移

它的价值不在“写更多代码”，而在：

- 减少上下文污染
- 降低 workflow 漂移
- 提高需求到交付的一致性
- 让使用者更专注于真实业务问题

---

### 🔁 Workflow 逻辑

Acode-kit 当前支持两类项目入口：

#### 1. 新项目路径

```text
Step 1 Workspace Status
→ Gate 1
→ Step 2 Requirements Analysis + Project Skeleton
→ Gate 2
→ Step 3 PRD + Progress Plan
→ Gate 3
→ Gate 3.5 LMS Tier Confirmation
→ Step 4a Directory Materialization + Document Relocation
→ Gate 4a
→ Step 4b Environment + Engineering Scaffold Setup
→ Gate 4b
→ Stage 1
→ Stage 2
→ Stage 3
→ Stage 4
→ Stage 5 (5a → 5b → 5c → 5d → 5e)
→ Stage 6
→ Stage 7
```

#### 2. 存量项目接入路径

```text
Step 1 Workspace Status + Project Type Identification
→ Gate 1
→ O1 Existing Project Inventory
→ Gate O1
→ O2 User-Guided Business Completion
→ Gate O2
→ O3 Onboarding Baseline Freeze
→ Gate O3
→ O4 Framework Onboarding Materialization
→ Gate O4
→ Stage 1
→ Stage 2
→ Stage 3
→ Stage 4
→ Stage 5
→ Stage 6
→ Stage 7
```

这个 workflow 的重点不是“步骤多”，而是：

1. 在实现前把需求、边界、规模、环境先冻结
2. 在实现中按模块稳定推进，而不是一次性全量生成
3. 对存量项目，先完成盘点、补录和接管，再进入正式规范执行
4. 在发布前强制经过测试、review、集成和上线治理

---

### 🧩 核心功能

| 功能 | 说明 |
|---|---|
| Gate-driven workflow | 把需求、PRD、项目环境、阶段推进都纳入门禁控制 |
| Progressive loading | 不再一开始读完整个体系，而是按节点逐级加载 |
| Scenario standards | 用场景包体现系统类型差异 |
| Stack standards | 用技术栈包体现实现方式差异 |
| Existing-project onboarding | 为已有项目提供独立接管路径，完成接管后再进入正式执行 |
| Extension modules | 支持按规范接入外部 markdown / skill 能力包 |
| Active standards | 用项目激活层明确当前项目真正生效的约束 |

---

### 🚀 与常见 vibe coding / spec coding 方式相比的差异

下面的对比是**方法论、交付模型与治理方式**层面的对比，不针对任何单一产品做绝对优劣判断，也不声称“所有同类工具都如此”。

更准确地说，这里对比的是一类常见使用方式：

1. 以快速生成和即时对话为主的 vibe coding 工作流
2. 以规格驱动为主、但项目状态与阶段治理较弱的 spec coding 工作流

| 对比项 | 常见 vibe coding / spec coding 工具 | Acode-kit |
|---|---|---|
| 目标重心 | 更偏向快速探索、快速生成、快速试错 | 更偏向把探索收敛为可持续交付流程 |
| 需求入口 | 往往可以直接进入生成 | 强调先骨架、PRD、门禁，再推进实现 |
| Agent 行为控制 | 更依赖即时对话和使用者临场控制 | 用 workflow、load-rules 和标准体系约束行为边界 |
| 规范承载方式 | 常集中在 prompt、对话约定或少量规则文件 | 采用母规范、场景包、技术栈包、激活层的分层结构 |
| 工程方法 | 有些工作流强调结果优先，工程治理依赖使用者补足 | 明确强调 TDD、spec-first、review、回归和 go-live 治理 |
| 项目状态管理 | 常依赖会话上下文、临时文件或人工记忆 | 强调文档即状态，持续回写和冻结版本 |
| 适合产出 | 更适合快速原型、局部功能或早期探索 | 更适合逐步逼近真实软件产品交付 |

---

### 🎯 面向的场景

Acode-kit 适合这些场景：

- 希望让 AI 参与真实项目交付，而不是只写几个文件
- 业务负责人、产品负责人、创业者希望更直接地推动产品落地
- 需要规范化 spec coding、PRD、traceability、review、go-live 流程
- 需要同时兼顾业务推进和工程治理
- 需要把不同项目类型、不同技术栈纳入统一框架
- 单人 + AI 或小团队 + AI 的工程化协作

典型项目类型包括：

- B/S 后台管理系统
- SaaS 平台类项目
- API 平台
- 商业 Web 应用
- 多端融合项目
- 原生移动端项目
- 需要明确文档、测试、上线治理的中小型真实项目

---

### 📦 安装方式

#### GitHub + curl 一键安装

macOS / Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

如需显式指定 agent / scope：

macOS / Linux:

```bash
AGENT=codex SCOPE=user curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

Windows PowerShell:

```powershell
$env:AGENT="codex"; $env:SCOPE="user"; irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

#### npm 直接安装

```bash
npm install -g github:AlexCyln/Acode-kit
acode-kit bootstrap
```

#### 本地仓库一键 bootstrap

```bash
node scripts/acode-kit.mjs bootstrap
# or
npm run bootstrap
```

#### 安装后第一步

```bash
acode-kit -status
```

如果当前终端没有识别到命令，重新打开终端窗口后再执行。

#### 终端快捷命令

```bash
acode-kit -status
acode-kit -add <path>
acode-kit -enable <name>
acode-kit -disable <name>
acode-kit -scan <path>
acode-kit -remove <name>
acode-kit -help
```

说明：

1. `-status`：查看当前版本、安装状态、项目扫描结果、扩展状态、MCP 状态
2. `-add <path>`：识别指定文件或目录是否为合法第三方扩展；扫描通过后完成安装
3. `-enable <name>`：在当前项目启用已安装扩展
4. `-disable <name>`：在当前项目停用扩展
5. `-scan <path>`：对指定文件或目录执行扩展扫描
6. `-remove <name>`：移除指定名字的已安装第三方扩展包
7. `-help`：查看 CLI 帮助

---

### ▶️ 使用方式

1. 先完成安装与初始化
2. 在项目目录启动 AI Agent，并明确要求使用 `Acode-kit`
3. 按 Gate 顺序推进，不跳步
4. 进入 Stage 1-7 后，按阶段和模块迭代执行
5. 若是已有项目，则先完成 existing-project onboarding，再进入正式执行
6. 若项目接入自定义扩展，先扫描，再显式激活
7. 把更多注意力放在需求判断、业务建模、边界定义和 prompt 质量上，而不是期待工具替你做所有决定

---

### ⚠️ 注意事项

#### 1. 它是辅助工具，不是替代品

Acode-kit 能做的是：

- 规范化
- 结构化
- 标准化
- 提效
- 降低 AI 漂移

它不能替代：

- 你对业务的理解
- 你对需求边界的判断
- 你的工程化思维
- 你的架构设计能力
- 你的 prompt 设计能力

#### 2. 使用者能力仍然是上限

如果需求本身混乱、架构思路模糊、prompt 含糊，工具不会神奇地把项目变好。  
相反，Acode-kit 的价值更体现在：

- 帮你把已有思考沉淀成稳定流程
- 帮你把项目约束显式化
- 帮你把 AI 输出拉回到工程轨道

#### 3. 不要把它当成“自动生成器”

它更适合被理解为：

> 一个让 AI 更像“受控项目成员”而不是“随机代码生成器”的框架

#### 4. 不要与同类总 workflow skill 并列作为入口

如果你的 AI 环境里已经安装了其他“项目总控型 / workflow 总入口型” skill：

- 不要把它们和 `Acode-kit` 并列当作同一个项目的入口
- 一个项目只应有一个总 orchestrator
- 对于 Acode-kit 管理的项目，应明确让 `Acode-kit` 成为唯一入口

#### 5. 扩展激活必须在项目目录落地后执行

`acode-kit -enable <extension-id>` 是项目级激活动作，不是全局安装动作。

推荐顺序：

1. 先完成项目初始化
2. 再安装扩展：`acode-kit -add <path>`
3. 最后在项目根目录执行：`acode-kit -enable <extension-id>`

---

## English

### ✨ What Acode-kit is

`Acode-kit` is a structured project-delivery framework for AI coding agents.  
It is not just another prompt pack, and it is not a magic auto-builder.

It helps turn AI from “ad-hoc code assistance” into a more controlled participant in real project delivery through:

- gated workflow
- structured specs and project documents
- progressive loading
- scenario and stack standards
- existing-project onboarding
- controlled extensions

More importantly, it is designed to help people who understand the business, but are not necessarily strong programmers yet, get much closer to shipping real software products.

### 🌟 Why it matters

Many AI coding tools still assume the user already knows how to code, debug, and structure a system well.

Acode-kit is built around a different reality:

- the people who understand the business often do not code deeply
- the people who code deeply do not always understand the business best
- there is often a real gap between product intent and software delivery

Acode-kit is meant to narrow that gap.

If you are the person closest to the business and you can combine:

- sound requirement judgment
- basic engineering thinking
- architectural awareness
- solid prompting
- willingness to learn

then Acode-kit is designed to help you turn that into a real product workflow, not just scattered AI output.

### 🧭 Core methodology

Acode-kit is built on a few principles:

1. clarify project facts before implementation
2. load rules progressively instead of dumping everything into context
3. freeze boundaries before module iteration
4. let AI amplify structure and speed, not replace thinking

It explicitly emphasizes:

1. **TDD-driven execution**
2. **spec-first delivery**
3. **professional engineering discipline**
4. **controlled AI behavior**

### 🚀 How it differs from common vibe coding / spec coding approaches

The comparison below is intentionally limited to **workflow model, delivery discipline, and governance style**.

| Dimension | Typical tools | Acode-kit |
|---|---|---|
| Primary emphasis | fast exploration and generation | controlled progression toward deliverable software |
| Path from idea to code | often allows immediate generation | gated, staged, and review-driven |
| Agent behavior | often steered mostly by live conversation | constrained by workflow, loading rules, and standards |
| Engineering method | varies widely and may depend on the user to impose structure | explicitly TDD-driven, spec-first, and governance-aware |
| State management | often conversation-heavy or memory-heavy | project documents act as persistent workflow state |
| Best-fit output | prototypes, experiments, rapid iteration | product-grade delivery with stronger consistency |

### 🎯 Best-fit scenarios

Acode-kit is designed for:

- real software projects, not one-off snippets
- business-led product building
- solo + AI or small-team + AI workflows
- new projects and existing project takeovers
- projects that need specs, traceability, review, testing, and go-live discipline

### 📦 Install

macOS / Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

Or:

```bash
npm install -g github:AlexCyln/Acode-kit
acode-kit bootstrap
```

### First check

```bash
acode-kit -status
```

### Quick commands

```bash
acode-kit -status
acode-kit -add <path>
acode-kit -enable <name>
acode-kit -disable <name>
acode-kit -scan <path>
acode-kit -remove <name>
acode-kit -help
```

### Important note

This is an enabling framework, not a substitute for:

- requirement clarity
- engineering thinking
- architecture capability
- good prompting

One project should have one top-level workflow owner. If the project is Acode-kit-managed, `Acode-kit` should be that entry.
