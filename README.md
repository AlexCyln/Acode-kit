# Acode-kit

> 🚀 A structured project-delivery framework for AI coding agents  
> 以规范化、可追踪、工程化的方式，让 AI 更稳定地参与真实项目交付

中文 | [English](#english)

---

## 中文

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

### 🏗️ 核心架构

当前 Acode-kit 采用“轻核入口 + 分层装载 + 内部路由”的结构。

| 层级 | 作用 | 代表内容 |
|---|---|---|
| 核心入口层 | 总调度、门禁、阶段推进 | `Acode-kit/SKILL.md` |
| 共享工作流内核 | 提供 provider 无关的核心 workflow 合同 | `Acode-kit/integrations/shared/WORKFLOW_CORE.md` |
| Provider 适配层 | 适配 Codex / Claude 的运行语义 | `Acode-kit/integrations/codex/*.md`、`Acode-kit/integrations/claude/*.md` |
| 工作流层 | Gate / Stage / Step 的执行规则 | `Acode-kit/workflows/*.md` |
| 装载与委派层 | 决定何时读什么、何时委派子代理 | `references/load-rules/*.md` |
| 规范内容层 | 提供真正的工程约束 | `global / scenario / stack standards` |
| 项目激活层 | 声明当前项目真正生效的规则组合 | `PROJECT_OVERRIDES.md`、`ACTIVE_STANDARDS.md` |
| 内部路由层 | 给具体子任务选择模型与 fallback | `acode-run`、router config |

这种架构的重点不是“拆文件”，而是：

- 对内：降低上下文负载
- 对外：提高交付一致性

---

### 🔁 Workflow 逻辑

Acode-kit 的 workflow 分两段：

#### 1. 启动门禁段

```text
Step 1 Workspace Status
→ Gate 1
→ Step 2 Requirements Analysis + Project Skeleton
→ Gate 2
→ Step 3 PRD + Progress Plan
→ Gate 3
→ Gate 3.5 LMS Tier Confirmation
→ Step 4 Project Environment Setup
→ Gate 4
```

#### 2. 阶段执行段

```text
Stage 1 Requirements Structuring + Module Decomposition
→ Stage 2 Overall UI Architecture
→ Stage 3 Overall Data Model + API Framework
→ Stage 4 Project Scaffold Initialization
→ Stage 5 Module Iteration (5a → 5b → 5c → 5d → 5e)
→ Stage 6 Integration Testing + Cross-module Review
→ Stage 7 Deployment and Go-live
```

这个 workflow 的重点不是“步骤多”，而是：

1. 在实现前把需求、边界、规模、环境先冻结
2. 在实现中按模块稳定推进，而不是一次性全量生成
3. 在发布前强制经过测试、review、集成和上线治理

---

### 🧩 核心功能

| 功能 | 说明 |
|---|---|
| Gate-driven workflow | 把需求、PRD、项目环境、阶段推进都纳入门禁控制 |
| Progressive loading | 不再一开始读完整个体系，而是按节点逐级加载 |
| Scenario standards | 用场景包体现系统类型差异 |
| Stack standards | 用技术栈包体现实现方式差异 |
| Extension modules | 支持按规范接入外部 markdown / skill 能力包，并提供接入前安全扫描与项目级卸载 |
| Active standards | 用项目激活层明确当前项目真正生效的约束 |
| Router & fallback | 用内部路由层为不同任务选择模型和 fallback 策略 |
| Regression validation | 用仓库级回归验证 workflow、router、entry、init 的稳定性 |

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
| 稳定性验证 | 回归与验证链往往需要使用者自行补足 | 内置 init、router、workflow、phase9 回归链路 |

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
- 需要明确文档、测试、上线治理的中小型真实项目

---

### 📦 安装方式

#### GitHub + curl 一键安装

适合直接从 GitHub 下载并自动安装。

macOS / Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

安装器会自动创建 `acode-kit` 命令入口：
- Windows：写入 `%USERPROFILE%\\.acode-kit\\bin\\acode-kit.cmd`，并加入用户 `PATH`
- macOS / Linux：写入 `~/.acode-kit/bin/acode-kit`，并加入当前 shell 的 PATH 配置
- 如果当前终端还没有识别到命令，重新打开一个终端窗口后执行 `acode-kit -help`

指定 agent / scope 示例：

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

1. `-status`：查看当前 Acode-kit 状态，包括当前 agent 基础、当前工作区扫描到的已初始化项目、当前项目已启用扩展、四个 MCP 工具状态
2. `-add <path>`：识别指定文件或目录是否为合法第三方扩展；自动执行准入扫描；全部通过后自动安装到 `Acode-kit/extensions/packs/`
3. `-enable <name>`：在当前项目自动创建或更新 `docs/project/PROJECT_EXTENSIONS.md` 与 `ACTIVE_STANDARDS.md`，将已安装扩展标记为启用
4. `-disable <name>`：在当前项目自动将扩展从“已启用”改为“已停用”，并更新当前启用扩展摘要
5. `-scan <path>`：对指定文件或目录执行扩展准入扫描
6. `-remove <name>`：移除指定名字的已安装第三方扩展包
7. `-help`：查看 CLI 帮助

#### 用户级安装

适合“一次安装，多项目复用”：

```bash
node scripts/install.mjs --source-dir ./Acode-kit --agent codex --scope user
```

#### 项目级安装

适合把工作流和项目骨架直接装进指定项目目录：

```bash
node scripts/install.mjs --source-dir ./Acode-kit --agent codex --scope project --dest-dir /path/to/my-project/.codex/skills
```

#### 初始化

初始化会：

1. 先扫描 4 个 MCP 工具
2. 已存在的 MCP 保持不变并跳过重复安装
3. 仅对缺失 MCP 执行安装
4. 同步 NotebookLM 认证状态
5. 写入 `.acode-kit-initialized.json`
6. 同步用户级全局状态缓存

NotebookLM 认证触发口令固定为：

```text
Log me in to NotebookLM
```

#### 自定义扩展模块

Acode-kit 支持以受控方式接入自定义扩展模块，用于增强特定领域知识、专项 review 或局部 workflow 能力。

支持两类扩展：

- `markdown` 扩展：提供额外规范、领域知识、专项检查清单
- `skill` 扩展：提供可委派的局部能力，但不能接管主 workflow

编写与声明要求：

1. 按 `Acode-kit/extensions/registry/EXTENSION_MANIFEST_SPEC.md` 编写 manifest
2. 为扩展声明 `id`、`type`、`entry`、`description`、`load_at`、`priority`、`mode`
3. `mode` 仅允许 `reference-only`、`workflow-helper`、`delegated-capability`
4. 扩展只能增强节点，不能修改 Gate 数量、Stage 顺序或审批边界

导入与使用方式：

1. 将扩展文件放入 `Acode-kit/extensions/packs/<your-pack>/`
2. 在 `Acode-kit/extensions/registry/EXTENSIONS_INDEX.md` 中登记
3. 启用前先执行安全扫描
4. 安装后可直接执行 `acode-kit -enable <extension-id>` 自动完成项目级激活
5. 如需停用，执行 `acode-kit -disable <extension-id>`
6. 主 skill 仅在命中 `load_at` 节点时按 `EXTENSION_LOADING_RULES.md` 受控读取或委派

这意味着：

- 注册不等于激活
- 激活不等于全程加载
- 主 `Acode-kit` 仍然是唯一 orchestrator

安全与卸载要求：

1. 自定义扩展在首次启用前必须先做安全扫描
2. 推荐执行：`acode-kit extension-scan --manifest <manifest-path>`
3. 扫描不仅检查恶意注入和数据风险，也检查是否试图破坏主 workflow 或接管主架构
4. 只要发现扩展自带主流程、试图重定义 Gate / Stage 或替代主 orchestrator，就不能放行
5. 只有安全状态和 workflow 兼容状态都为 `pass` 的扩展才应标记为 `已启用`
6. 已启用扩展应优先通过项目级停用来卸载，而不是直接删除包文件
7. 推荐执行：`acode-kit extension-uninstall --id <extension-id> --project-extensions <path> --active-standards <path>`

推荐顺序：

1. 编写扩展包与 manifest
2. 执行 `acode-kit -scan <path>` 或 `acode-kit extension-scan --manifest <manifest-path>`
3. 扫描通过后再写入 `PROJECT_EXTENSIONS.md` / `ACTIVE_STANDARDS.md`
4. 若需要自动导入扩展包，可直接执行 `acode-kit -add <path>`
5. 如需停用或移除，执行 `acode-kit extension-uninstall ...` 或 `acode-kit -remove <name>`

---

### ▶️ 使用方式

1. 先完成安装与初始化
2. 在项目目录启动 AI Agent，并明确要求使用 `Acode-kit`
3. 按 Gate 顺序推进，不跳步
4. 进入 Stage 1-7 后，按阶段和模块迭代执行
5. 当节点命中对应工具时，按 workflow 使用 NotebookLM、Pencil、shadcn 或 Chrome DevTools
6. 若项目接入自定义扩展，先做安全扫描，再显式激活
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

否则会出现：

- 明明指定了 `Acode-kit`，却被另一个同类 skill 抢占
- 启动路径混乱
- workflow 边界冲突
- 项目状态文档与实际执行链路不一致

更合理的做法是：

- 保留 `Acode-kit` 作为总入口
- 把其他同类 skill 视为参考能力或局部能力，而不是并列主入口

---

### ✅ 当前状态

当前仓库已经完成本轮主线重构，并完成仓库级 `Phase 9` 回归。

建议阅读：
当前 README 已足以对外理解产品定位、方法论和使用方式；仓库内另有更详细的工程文档可供深入查看。

回归命令：

```bash
npm run test:phase9
```

---

### 🧪 测试

```bash
npm run test:router
npm run test:entry
npm run test:mcp
npm run test:init
npm run test:extensions
npm run test:workflow
npm run test:phase9
```

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
- internal routing and fallback
- regression validation

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

1. clarify the project facts before implementation
2. load rules progressively instead of dumping everything into context
3. freeze boundaries before module iteration
4. let AI amplify structure and speed, not replace thinking

It also explicitly emphasizes:

1. **TDD-driven execution**
2. **spec-first delivery**
3. **professional engineering discipline**
4. **controlled AI behavior with room for creative extension**

### 🏗️ Core architecture

| Layer | Role |
|---|---|
| Core entry | workflow orchestration and gate control |
| Shared workflow core | provider-agnostic workflow contract |
| Provider adapters | Codex / Claude runtime adaptation |
| Workflow layer | gate / stage / step execution rules |
| Loading layer | what to load, when to stop loading, when to delegate |
| Extension layer | controlled external markdown / skill enhancement packs |
| Standards layer | global, scenario, and stack-level constraints |
| Project activation layer | project-specific active standards |
| Internal router | model selection, budget control, fallback |

### 🚀 How it differs from common vibe coding / spec coding approaches

The comparison below is intentionally limited to **workflow model, delivery discipline, and governance style**. It is not a claim that every tool in the category works the same way, and it is not meant as a blanket superiority statement.

| Dimension | Typical tools | Acode-kit |
|---|---|---|
| Primary emphasis | fast exploration and generation | controlled progression toward deliverable software |
| Path from idea to code | often allows immediate generation | gated, staged, and review-driven |
| Agent behavior | often steered mostly by live conversation | constrained by workflow, loading rules, and standards |
| Engineering method | varies widely and may depend on the user to impose structure | explicitly TDD-driven, spec-first, and governance-aware |
| State management | often conversation-heavy or memory-heavy | project documents act as persistent workflow state |
| Best-fit output | prototypes, experiments, rapid iteration | product-grade delivery with stronger consistency |
| Validation model | verification is often added manually by the user | includes init, router, workflow, and regression validation paths |

### 🎯 Best-fit scenarios

Acode-kit is designed for:

- real software projects, not one-off snippets
- business-led product building
- solo + AI or small-team + AI workflows
- projects that need specs, traceability, review, testing, and go-live discipline
- teams that want AI to improve engineering consistency, not replace engineering judgment

### ⚠️ Important note

This is an enabling framework, not a substitute for:

- requirement clarity
- engineering thinking
- architecture capability
- good prompting

The better those inputs are, the more value Acode-kit can provide.

Do not use Acode-kit in parallel with another top-level workflow-orchestrator skill for the same project.

- one project should have one main orchestrator
- if the project is Acode-kit-managed, `Acode-kit` should be the only workflow entry
- other similar skills should be treated as reference-only or bounded local capabilities, not parallel owners of the same workflow

### 📦 Install

### GitHub + curl

Install directly from GitHub and let the installer fetch and place the bundle automatically.

macOS / Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

The installer also creates an `acode-kit` launcher automatically:
- Windows: `%USERPROFILE%\\.acode-kit\\bin\\acode-kit.cmd` and adds that directory to the user `PATH`
- macOS / Linux: `~/.acode-kit/bin/acode-kit` and updates the current shell PATH config
- If the command is not recognized in the current shell, open a new terminal and run `acode-kit -help`

With explicit agent / scope:

macOS / Linux:

```bash
AGENT=codex SCOPE=user curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

Windows PowerShell:

```powershell
$env:AGENT="codex"; $env:SCOPE="user"; irm https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.ps1 | iex
```

### npm direct install

```bash
npm install -g github:AlexCyln/Acode-kit
acode-kit bootstrap
```

### Local bootstrap

```bash
node scripts/acode-kit.mjs bootstrap
# or
npm run bootstrap
```

### ⌨️ Quick CLI flags

```bash
acode-kit -status
acode-kit -add <path>
acode-kit -enable <name>
acode-kit -disable <name>
acode-kit -scan <path>
acode-kit -remove <name>
acode-kit -help
```

Meaning:

1. `-status`: show current agent basis, initialized projects discovered in the current workspace tree, enabled third-party extensions, and the four MCP tool states
2. `-add <path>`: detect whether the target is a valid `.md` or skill-style extension, run admission scan automatically, and install it if all checks pass
3. `-enable <name>`: automatically create or update `docs/project/PROJECT_EXTENSIONS.md` and `ACTIVE_STANDARDS.md` in the current project, then mark the installed extension as enabled
4. `-disable <name>`: automatically mark the extension as disabled at project level and update the active extension summary
5. `-scan <path>`: run extension admission scan for a file or directory
6. `-remove <name>`: remove an installed third-party extension pack by name
7. `-help`: show CLI help

### 🔌 Custom extensions

Acode-kit also supports controlled custom extensions for domain knowledge, specialized review, or bounded delegated capabilities.

Supported extension types:

- `markdown`: extra standards, playbooks, or review checklists
- `skill`: bounded capability packs that can be delegated by the main skill

Authoring and declaration rules:

1. follow `Acode-kit/extensions/registry/EXTENSION_MANIFEST_SPEC.md`
2. declare `id`, `type`, `entry`, `description`, `load_at`, `priority`, and `mode`
3. use only `reference-only`, `workflow-helper`, or `delegated-capability`
4. extensions may enhance workflow nodes, but may not alter the gate graph, approval boundaries, or replace the main orchestrator

Import and activation flow:

1. place the pack under `Acode-kit/extensions/packs/<your-pack>/`
2. register it in `Acode-kit/extensions/registry/EXTENSIONS_INDEX.md`
3. run a security scan before activation
4. after install, run `acode-kit -enable <extension-id>` to automate project-level activation
5. when needed, run `acode-kit -disable <extension-id>` for project-level deactivation
6. let the main skill load or delegate it only when the current node matches the manifest `load_at` rules

This keeps extension power high without giving up workflow control.

Security and unload requirements:

1. every custom extension should be security-scanned before first activation
2. recommended command: `acode-kit extension-scan --manifest <manifest-path>`
3. the scan checks both security risk and workflow / architecture compatibility
4. if the extension tries to own the main workflow, redefine Gate / Stage logic, or replace the orchestrator, it must be blocked
5. only extensions with both security and compatibility status set to `pass` should be marked active
6. already activated extensions should be unloaded by project-level deactivation first, not by silently deleting pack files
7. recommended command: `acode-kit extension-uninstall --id <extension-id> --project-extensions <path> --active-standards <path>`

Recommended flow:

1. author the pack and manifest
2. run `acode-kit -scan <path>` or `acode-kit extension-scan --manifest <manifest-path>`
3. activate only after a `pass` result
4. use `acode-kit -add <path>` for detect-scan-install in one step when appropriate
5. unload through `acode-kit extension-uninstall ...` or `acode-kit -remove <name>` when the project no longer needs it

### ▶️ Use

1. Install and initialize first
2. Start your AI agent in the project directory
3. Tell it explicitly to use `Acode-kit`
4. Follow the gate sequence in order
5. Continue stage-by-stage without skipping
6. If the project is already managed by Acode-kit, keep Acode-kit as the only top-level workflow entry
7. Keep your focus on business judgment, architecture, and prompting quality instead of expecting the framework to replace them

### 🧪 Tests

```bash
npm run test:extensions
npm run test:phase9
```
