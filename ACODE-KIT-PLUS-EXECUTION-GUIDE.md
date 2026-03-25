# Acode-kit Plus 重构执行与验收总指南

## 0. 文档地位
本文件为 `/Users/alex/Documents/AlexFiles/Acode-kit-plus-prompt` 后续整个 skill 重构优化任务的唯一正式执行指南与验收指南。

自本文件落地后：
1. 后续所有与 Acode-kit / Acode-kit Plus 相关的 skill 重构、目录调整、规范包建设、工作流拆解、子代理策略、项目级文档改造，均以本文件为执行基准。
2. 后续阶段性成果验收、里程碑评审、交付确认，均以本文件为验收基准。
3. 若方案、顺序、边界、验收口径发生变化，必须先更新本文件，再允许按新口径继续推进。
4. 若其他文档与本文件冲突，以本文件为准，直到本文件被显式修订。

## 0.1 官方安装路径
当前项目支持三类官方安装方式，均面向 GitHub 分发与自动安装：

1. GitHub + `curl` / `irm` 一键安装
2. `npm install -g github:AlexCyln/Acode-kit-Plus` 后执行 `acode-kit bootstrap`
3. 在本地仓库执行 `node scripts/acode-kit.mjs bootstrap`

平台要求：
1. macOS / Linux 使用 `scripts/install.sh`
2. Windows PowerShell 使用 `scripts/install.ps1`
3. 三平台统一通过 `scripts/install.mjs` / `scripts/acode-kit.mjs` 完成后续自动安装与初始化

---

# 1. 重构总目标
本轮重构有两个主重点，必须联合推进，不可割裂执行。

## 1.1 重点 1
建立“场景规范包 + 技术栈规范包 + 项目激活层”的新规范体系，让 skill 对不同项目类型与具体技术栈输出更稳定、更具体、更可控的标准。

## 1.2 重点 2
重构 `SKILL.md` 与整体装载机制，采用“轻核 Skill + 逐级加载 + 子代理隔离上下文”的模式，解决主入口过长、上下文污染、执行漂移与性能下降问题。

## 1.3 联合目标
最终把 Acode-kit 从“一个很长的入口说明文档”升级为“一个带有路由能力、分层装载能力、规范激活能力和子代理执行能力的技能系统”。

## 1.4 新增主线任务
在当前重构主线上，新增“33 份全局工程约束文档按企业级、前沿规范化高标准持续深化”的长期任务。该任务属于规范内容层核心主线，不是可选优化项。

---

# 2. 总体设计原则
1. 母规范继续存在，但只保留跨项目、跨技术栈、跨阶段稳定约束。
2. 场景规范优先于技术栈规范建设。
3. `SKILL.md` 必须瘦身，不能继续承载大量细节。
4. 详细规则必须外移到专门文档。
5. 主代理只读当前任务最小必要内容。
6. 子代理只处理局部问题，主代理负责最终收敛。
7. 所有新增结构必须支持长期扩展，而不是只服务当前几个项目。

---

# 3. 两大重点的整合关系

## 3.1 重点 1 解决的问题
1. 当前 skill 对具体项目类型约束不够具体。
2. 当前 skill 对具体技术栈落地标准不够明确。
3. 当前规范难以区分不同业务系统的真实交付差异。

## 3.2 重点 2 解决的问题
1. `SKILL.md` 过长，主入口负载过重。
2. 入口文档与细节规范混在一起，导致上下文成本过高。
3. 主线会话容易被大量流程文本和规范文本污染。
4. 多阶段任务中，主代理容易因上下文冗余导致执行效果下降。

## 3.3 整合后的核心逻辑
1. 重点 1 决定“要准备哪些规范内容”。
2. 重点 2 决定“这些规范内容如何被按需装载与消费”。
3. 重点 1 是内容体系重构。
4. 重点 2 是执行体系重构。
5. 没有重点 2，重点 1 会让系统更重。
6. 没有重点 1，重点 2 会变成空壳优化。

---

# 4. 最终架构目标
重构完成后，整体 skill 架构分为五层。

## 4.1 Layer A：核心入口层
文件：
- `Acode-kit/SKILL.md`

职责：
1. skill 触发条件
2. 初始化检查
3. Gate / Stage 总流程
4. 文档装载原则
5. 子代理使用原则
6. 回退与禁止事项

要求：
1. 保持极简
2. 不直接承载大量细节
3. 长度控制在可稳定消费的范围内

## 4.2 Layer B：工作流层
文件建议：
- `integrations/shared/WORKFLOW_CORE.md`
- `workflows/startup.md`
- `workflows/gate-rules.md`
- `workflows/stage-execution.md`
- `workflows/module-iteration.md`
- `workflows/change-management.md`
- `workflows/fallback-and-degrade.md`

职责：
1. 承载具体流程
2. 承载阶段输入输出要求
3. 承载异常回退与继续执行条件

## 4.3 Layer C：装载与路由层
文件建议：
- `references/load-rules/DOCUMENT_LOADING_RULES.md`
- `references/load-rules/TASK_TO_STANDARD_MAP.md`
- `references/load-rules/AGENT_DELEGATION_RULES.md`

职责：
1. 规定当前任务应该加载什么
2. 规定哪些任务适合主代理
3. 规定哪些任务适合子代理
4. 规定上下文预算紧张时如何降级

## 4.4 Layer D：规范内容层
文件：
- `references/global-engineering-standards/*`
- `references/scenario-standards/*`
- `references/stack-standards/*`

职责：
1. 提供真正的规范内容
2. 不直接承载流程控制

## 4.5 Layer E：项目激活层
文件：
- `docs/project/PROJECT_OVERRIDES.md`
- `docs/project/ACTIVE_STANDARDS.md`

职责：
1. 声明项目实际激活的场景和技术栈规范
2. 固化当前项目真正生效的约束
3. 作为项目级会话装载入口

## 4.6 Layer F：扩展模块层
文件：
- `extensions/registry/EXTENSION_MANIFEST_SPEC.md`
- `extensions/registry/EXTENSIONS_INDEX.md`
- `extensions/registry/EXTENSION_LOADING_RULES.md`
- `extensions/registry/EXTENSION_SECURITY_SCAN_RULES.md`
- `extensions/registry/EXTENSION_UNINSTALL_RULES.md`
- `extensions/packs/*`

职责：
1. 为主 skill 提供可控的外部增强能力
2. 允许以 `markdown` 或 `skill` 形式扩展专项能力
3. 通过注册、激活、节点命中三段式机制避免扩展失控

要求：
1. 扩展只能增强节点，不得改写主 workflow
2. 扩展注册不等于激活
3. 扩展只能在命中节点按需加载
4. 主 `Acode-kit` 永远是唯一 orchestrator
5. 自定义扩展启用前必须先通过安全扫描
6. 已启用扩展必须支持项目级可追踪卸载

---

# 5. 重点 1：规范体系重构方案

## 5.1 目标
建立“母规范 + 场景规范包 + 技术栈规范包 + 项目激活层”的四级规范体系。

## 5.1.1 母规范深化目标
除完成场景包和技术栈包建设外，还必须持续提升全局工程规范本身的专业深度。目标是让全部母规范不只是“概念说明”，而是能直接指导真实企业级项目的工程治理、架构判断、编码、测试、数据、发布与运维执行。

## 5.2 规范优先级
1. 母规范
2. 场景规范包
3. 技术栈规范包
4. 项目级覆盖

冲突规则：
1. 上层优先于下层
2. 项目覆盖必须显式记录原因、范围、审批状态

## 5.3 场景规范包建设范围
首批按以下 12 类项目场景建设：
1. `bs-saas-workflow.md`
2. `bs-saas-data-platform.md`
3. `bs-commerce-transaction.md`
4. `bs-platform-ecosystem.md`
5. `bs-admin-console.md`
6. `bs-api-platform.md`
7. `miniapp-business-lite.md`
8. `miniapp-visual-marketing.md`
9. `mobile-business.md`
10. `mobile-experience.md`
11. `multi-end-fusion.md`
12. `official-brand-site.md`

## 5.4 技术栈规范包建设范围
技术栈规范不按“完整项目组合”拆，而按能力面拆。

建议目录：
```text
references/stack-standards/
  backend/
  frontend/
  data-access/
  testing/
  ui/
  deployment/
```

第一批建议优先建设：
1. `backend/spring-boot.md`
2. `data-access/mybatis-plus.md`
3. `frontend/react-shadcn.md`
4. `testing/junit-mockito-testcontainers.md`
5. `testing/vitest-rtl-playwright.md`
6. `ui/b2b-saas-admin.md`

## 5.5 项目激活层改造
必须升级 `PROJECT_OVERRIDES.template.md`，新增以下字段：
1. 项目场景类型
2. 激活场景规范包
3. 激活后端规范包
4. 激活前端规范包
5. 激活数据访问规范包
6. 激活测试规范包
7. 激活 UI 规范包
8. 项目级禁用项
9. 项目级覆盖项

同时新增 `ACTIVE_STANDARDS.md`，用于记录：
1. 当前项目场景
2. 已声明技术栈
3. 已激活规范包
4. 装载顺序
5. 项目覆盖项
6. 当前阶段重点遵循规则

---

# 6. 重点 2：Skill 执行体系重构方案

## 6.1 目标
将 `SKILL.md` 从“长篇说明书”重构为“轻核入口文件”。

## 6.2 重构后的核心原则
1. 主 `SKILL.md` 只保留最核心的工作流节点和控制规则。
2. 所有详细说明、规范、模板、例外情况全部外移。
3. 主代理永远按需读取，不得一次性读取整个体系。
4. 子代理负责局部分析、局部整理和并行处理。
5. 主代理只负责主线推进、结果收敛、门禁控制和用户交互。

## 6.3 主 `SKILL.md` 保留内容
1. skill 触发条件
2. 初始化检查
3. Gate 总览
4. Stage 总览
5. 文档装载原则
6. 子代理使用原则
7. 禁止事项
8. 回退机制

## 6.4 主 `SKILL.md` 移除内容
1. 详细阶段说明
2. 长篇模板内容
3. 规范文档长列表解释
4. 场景细节
5. 技术栈细节
6. UI 工作流细节
7. 大段例外说明

这些内容必须迁出到：
1. `workflows/*.md`
2. `references/load-rules/*.md`
3. `references/scenario-standards/*.md`
4. `references/stack-standards/*.md`

## 6.5 逐级加载规则
主代理永远按如下顺序加载：
1. `SKILL.md`
2. 当前 workflow 文档
3. 当前任务对应的装载规则
4. 当前任务所需的场景包
5. 当前任务所需的技术栈包
6. 当前命中的已激活扩展模块
7. 当前项目级覆盖文档

明确禁止：
1. 一进入 skill 就读取全部母规范
2. 一进入 skill 就读取全部 workflow
3. 一进入 skill 就读取全部场景包
4. 一进入 skill 就读取全部技术栈包
5. 一进入 skill 就读取全部扩展模块

## 6.6 子代理策略
适合交给子代理的任务：
1. 规范检索与摘要
2. 场景包匹配判断
3. 技术栈包匹配判断
4. 模块级约束整理
5. 长文档压缩
6. 并行分析多个独立模块
7. review 风险预整理

不适合交给子代理的任务：
1. 最终门禁判断
2. 用户确认前的主结论输出
3. 关键跨阶段裁决
4. 最终项目级文档口径

---

# 7. 联合执行顺序
重点 1 和重点 2 不能简单并列执行，必须按依赖关系推进。

## 7.1 正确顺序
1. 先完成重点 1 的边界设计
2. 再完成重点 2 的框架重构
3. 再回到重点 1 做具体内容建设
4. 最后完成装载映射和真实任务验证

## 7.2 原因
1. 如果先大量写场景包和技术栈包，再改 `SKILL.md`，会产生大量返工。
2. 先把主 skill 轻核化和装载机制建好，后面新增内容才能稳定接入。
3. 但在重构装载机制前，必须先明确未来有哪些规范包和目录结构，否则无法设计正确的路由与加载规则。

---

# 8. 分阶段实施路线图

## Phase 0：联合方案定稿
目标：
1. 固化本总指南
2. 确认重点 1 与重点 2 的边界
3. 明确后续唯一基准文件

产物：
1. 本文件

验收标准：
1. 本文件已落地
2. 后续团队与 agent 均以本文件为基准

## Phase 1：新架构与目录设计
目标：
1. 完成规范体系和文档体系的目录设计
2. 明确工作流层、装载层、规范层、项目激活层的边界

必须完成：
1. 设计 `scenario-standards/`
2. 设计 `stack-standards/`
3. 设计 `workflows/`
4. 设计 `references/load-rules/`
5. 设计项目级 `ACTIVE_STANDARDS.md`

产物：
1. 目录结构方案
2. 各层职责说明

验收标准：
1. 五层架构边界清晰
2. 不存在同一职责跨多个层级混杂

## Phase 2：主 `SKILL.md` 拆解设计
目标：
1. 对现有 `SKILL.md` 做职责拆解
2. 明确哪些内容保留、迁出、删除、重写

必须完成：
1. 列出现有 `SKILL.md` 内容清单
2. 标注归属层级
3. 形成拆解映射表

产物：
1. `SKILL.md` 拆解清单
2. 迁移目标路径清单

验收标准：
1. 所有现有内容都能找到新归属
2. 无无法归类的大块混杂内容

## Phase 3：工作流文档拆分
目标：
1. 将流程控制从 `SKILL.md` 中拆出

必须完成：
1. `workflows/startup.md`
2. `workflows/gate-rules.md`
3. `workflows/stage-execution.md`
4. `workflows/module-iteration.md`
5. `workflows/change-management.md`
6. `workflows/fallback-and-degrade.md`

验收标准：
1. 当前流程能够脱离旧长文档独立表达
2. Gate 和 Stage 规则没有丢失

## Phase 4：装载与子代理规则建设
目标：
1. 建立逐级加载与子代理分工的路由规则

必须完成：
1. `DOCUMENT_LOADING_RULES.md`
2. `TASK_TO_STANDARD_MAP.md`
3. `AGENT_DELEGATION_RULES.md`

验收标准：
1. 任务到文档的映射清晰
2. 子代理使用边界清晰
3. 上下文预算不足时有降级策略

## Phase 5：极简版 `SKILL.md` 重写
目标：
1. 完成核心入口层重写

必须完成：
1. 保留最小必要控制项
2. 去掉大段细节说明
3. 接入 workflow 与 load-rules 路由

验收标准：
1. 主 `SKILL.md` 长度显著下降
2. 主 skill 仍具备控制力
3. 不再依赖在入口中堆大量规则

## Phase 6：场景规范包首版建设
目标：
1. 建立 12 个场景包首版内容

必须完成：
1. 统一模板
2. 首版内容
3. 场景索引说明

验收标准：
1. 12 个场景包可区分
2. 每个场景包有明确交付差异
3. 可用于真实任务装载

## Phase 7：技术栈规范包首版建设
目标：
1. 建立高频技术栈包首版

必须完成：
1. 后端首批包
2. 前端首批包
3. 数据访问首批包
4. 测试首批包
5. UI 首批包

验收标准：
1. 至少 3 个高频包具备落地价值
2. 能被任务映射规则实际装载

## Phase 8：项目激活层改造
目标：
1. 把新规范体系接入项目文档机制

必须完成：
1. 升级 `PROJECT_OVERRIDES.template.md`
2. 新增 `ACTIVE_STANDARDS` 模板

验收标准：
1. 项目可显式声明激活的规范包
2. 主代理能以项目级激活文档为入口

## Phase 8.2：扩展模块系统接入
目标：
1. 让主 skill 支持受控的外部增强模块
2. 让扩展模块遵循统一编写、声明、导入与激活规则

必须完成：
1. `EXTENSION_MANIFEST_SPEC.md`
2. `EXTENSIONS_INDEX.md`
3. `EXTENSION_LOADING_RULES.md`
4. `EXTENSION_SECURITY_SCAN_RULES.md`
5. `EXTENSION_UNINSTALL_RULES.md`
6. `PROJECT_EXTENSIONS.template.md`
7. 至少 2 个可用 MVP 扩展包
8. 自定义扩展安全扫描与项目级卸载机制

验收标准：
1. 扩展必须先注册，再项目级激活，最后在节点命中时装载
2. 扩展不能接管主 workflow
3. 自定义扩展的编写、声明、导入规则清晰可执行
4. 自定义扩展在启用前必须有安全扫描结论
5. 已启用扩展可以通过项目级文档快速卸载

## Phase 8.5：33 份母规范高标准深化
目标：
1. 让全部全局工程约束文档达到企业级、可执行、可审阅、可映射的高标准
2. 消除“只有目录，没有足够执行深度”的母规范薄弱点
3. 让母规范与技术栈包形成“抽象约束 + 技术落地”的稳定双层关系

必须完成：
1. 补齐缺失的重要专题规范
2. 强化编码、测试、分层架构、数据库 + migration、数据操作、API、权限安全、日志可观测性、多租户等主题
3. 让 load-rules 能在合适节点命中这些增强后的母规范

验收标准：
1. 母规范能直接支撑真实项目阶段执行
2. 技术栈包不再替代母规范，而是对母规范做技术化落地
3. 规范之间职责边界清晰、引用链稳定

## Phase 9：真实任务回归验证
目标：
1. 验证新体系是否真的提升性能与稳定性

验证任务至少包含：
1. 新项目初始化
2. 某模块详细设计
3. 某模块实现 + 测试 + review

验收标准：
1. 主线上下文更稳定
2. 输出质量不下降
3. 规则执行更一致
4. 子代理没有造成主线混乱

---

# 9. 关键目录方案

```text
Acode-kit/
  SKILL.md
  integrations/
    shared/
      WORKFLOW_CORE.md
  workflows/
    startup.md
    gate-rules.md
    stage-execution.md
    module-iteration.md
    change-management.md
    fallback-and-degrade.md
  references/
    global-engineering-standards/
    load-rules/
      DOCUMENT_LOADING_RULES.md
      TASK_TO_STANDARD_MAP.md
      AGENT_DELEGATION_RULES.md
    scenario-standards/
      bs-saas-workflow.md
      bs-saas-data-platform.md
      bs-commerce-transaction.md
      bs-platform-ecosystem.md
      bs-admin-console.md
      bs-api-platform.md
      miniapp-business-lite.md
      miniapp-visual-marketing.md
      mobile-business.md
      mobile-experience.md
      multi-end-fusion.md
      official-brand-site.md
    stack-standards/
      backend/
      frontend/
      data-access/
      testing/
      ui/
      deployment/
```

---

# 10. 关键文件职责定义

## 10.1 `SKILL.md`
只保留：
1. 启动条件
2. 总控制逻辑
3. 装载与委派规则
4. 禁止事项

## 10.6 扩展模块相关文件

### `EXTENSION_MANIFEST_SPEC.md`
定义自定义扩展模块的最小声明契约。必须约束：
1. `id`
2. `type`
3. `entry`
4. `description`
5. `load_at`
6. `priority`
7. `mode`
8. `requires`

### `EXTENSIONS_INDEX.md`
维护当前已注册扩展目录。职责：
1. 列出可用扩展
2. 标明类型、模式、推荐节点、用途
3. 明确“注册不等于激活”

### `EXTENSION_LOADING_RULES.md`
规定主 skill 何时装载扩展。职责：
1. 先看当前节点
2. 再看项目级激活
3. 再看安全扫描状态
4. 再看 `load_at`
5. 再看 `requires`
6. 最后按 `priority` 和 `mode` 执行

### `EXTENSION_SECURITY_SCAN_RULES.md`
定义扩展启用前的准入安全检查。职责：
1. 识别恶意 prompt 注入
2. 识别试图绕过 Gate / Stage / 审批边界的内容
3. 识别潜在 secrets / 数据外泄风险
4. 规定 `pass / warn / fail` 准入标准

### `EXTENSION_WORKFLOW_COMPATIBILITY_RULES.md`
定义扩展对主 workflow 与主架构的兼容检查。职责：
1. 识别试图自带主 workflow 的第三方 skill
2. 识别试图重定义 Gate / Stage / 审批所有权的内容
3. 识别试图替代主 orchestrator 的流程型扩展
4. 将 workflow ownership 冲突直接判定为 `fail`

### `EXTENSION_UNINSTALL_RULES.md`
定义扩展停用路径。职责：
1. 以项目级停用为默认卸载方式
2. 保留可追踪的停用记录
3. 确保卸载后不再命中装载逻辑

### `PROJECT_EXTENSIONS.md`
作为项目级扩展激活入口。职责：
1. 声明当前项目启用哪些扩展
2. 说明启用原因、挂载节点、状态
3. 记录冲突与优先级决策

## 10.7 自定义扩展模块编写、声明与导入规范

### 编写规范
1. 自定义扩展只能是 `markdown` 或 `skill`
2. `markdown` 扩展用于额外规范、清单、领域知识、专项 review 指南
3. `skill` 扩展用于可委派的局部能力，不得直接对外替代主 skill
4. 扩展内容必须聚焦单一专项能力，避免包内职责过宽

### 声明规范
1. 每个扩展必须带 manifest
2. manifest 必须满足 `EXTENSION_MANIFEST_SPEC.md`
3. `load_at` 必须使用明确的 `Gate / Stage / Step` 节点名
4. `mode` 只能使用 `reference-only`、`workflow-helper`、`delegated-capability`
5. `requires` 必须真实反映场景、技术栈或项目标签依赖

### 导入与使用规范
1. 扩展文件放入 `extensions/packs/<pack-id>/`
2. 注册到 `EXTENSIONS_INDEX.md`
3. 启用前必须执行扩展安全扫描
4. 项目必须在 `PROJECT_EXTENSIONS.md` 或 `ACTIVE_STANDARDS.md` 中显式激活
5. 主 skill 只在当前节点命中 `load_at` 且满足 `requires` 时读取或委派
6. 未激活扩展不得被默认读入
7. 扩展输出只能增强主线判断，不能覆盖 Gate、Stage 和审批边界
8. 推荐启用命令为 `acode-kit extension-scan --manifest <manifest-path>`
9. 推荐停用命令为 `acode-kit extension-uninstall --id <extension-id> --project-extensions <path> --active-standards <path>`
10. 终端快捷入口支持：
   - `acode-kit -status`
   - `acode-kit -add <path>`
   - `acode-kit -scan <path>`
   - `acode-kit -remove <name>`
   - `acode-kit -help`

### 安全扫描规范
1. 自定义扩展首次接入前必须扫描 `manifest.json`、入口文件和包内 markdown / text 文件
2. 若扫描命中恶意 prompt 注入、审批绕过、主 orchestrator 替换企图，则直接判定 `fail`
3. 若扫描命中 secrets 外传、破坏性命令、越界读写提示，则至少判定 `warn`
4. 只有扫描结果为 `pass` 的扩展，才允许写入“已启用”状态
5. 推荐通过 `scan-extension-module.mjs` 或 `acode-kit extension-scan` 执行

### Workflow / 架构兼容扫描规范
1. 扩展扫描不仅检查安全问题，也必须检查是否破坏主 workflow 或主架构
2. 若扩展声明自己是主 skill、主入口、完整默认流程，直接判定 `fail`
3. 若扩展要求忽略 `Acode-kit`、接管 Gate / Stage、替代最终收敛，则直接判定 `fail`
4. 只有安全状态与 workflow 兼容状态同时为 `pass` 时，才允许项目级启用

### 卸载规范
1. 已装载扩展默认通过项目级停用来卸载，不强制删除注册信息
2. 卸载时必须同步更新 `PROJECT_EXTENSIONS.md` 与 `ACTIVE_STANDARDS.md`
3. 卸载后该扩展不得再命中装载链
4. 卸载动作必须保留原因、日期、影响节点和回滚方式
5. 推荐通过 `uninstall-extension-module.mjs` 或 `acode-kit extension-uninstall` 执行

### CLI 行为规范
1. `acode-kit -status` 必须输出当前 agent 基础、当前工作区扫描到的已初始化项目、当前项目启用扩展、四个 MCP 工具状态
2. `acode-kit -add <path>` 必须先识别输入是否为合法 `.md` / `SKILL.md` / 带 manifest 的扩展包
3. `acode-kit -add <path>` 必须自动触发准入扫描；只有安全状态与 workflow 兼容状态均为 `pass` 时才允许安装
4. `acode-kit -scan <path>` 指向扩展扫描能力
5. `acode-kit -remove <name>` 用于移除已安装的第三方扩展包；若只需项目级停用，优先使用项目级卸载路径
6. `acode-kit -help` 必须完整展示上述快捷指令及其用途

## 10.2 `WORKFLOW_CORE.md`
只保留：
1. 通用工作流不变量
2. provider 无关的核心控制逻辑

## 10.3 `workflows/*.md`
按阶段和行为拆分具体工作流

## 10.4 `DOCUMENT_LOADING_RULES.md`
定义：
1. 什么任务读什么文档
2. 谁先读
3. 何时不允许继续读更多

## 10.5 `TASK_TO_STANDARD_MAP.md`
定义：
1. 任务类型 -> 场景包 / 技术栈包
2. 阶段 -> 规范集合
3. 项目类型 -> 默认装载规则

## 10.6 `AGENT_DELEGATION_RULES.md`
定义：
1. 何时派子代理
2. 子代理类型
3. 子代理输出格式
4. 主代理收敛要求

---

# 11. 子代理执行模型

## 11.1 子代理角色建议
1. `workflow-explorer`
2. `standards-explorer`
3. `module-worker`
4. `review-worker`

## 11.2 子代理输出格式
必须统一返回：
1. 任务目标
2. 已读取文件
3. 关键结论
4. 冲突点
5. 建议动作
6. 是否需要主代理补读原文

## 11.3 主代理原则
1. 不重复做已委派任务
2. 不把子代理的大量原始文本回灌主线
3. 只吸收压缩后的结构化结论

---

# 12. 当前推荐的先后顺序
本轮重构必须按以下顺序执行：
1. 固化本总指南
2. 设计新架构与目录
3. 完成 `SKILL.md` 拆解清单
4. 拆 workflow
5. 建 load-rules
6. 重写极简版 `SKILL.md`
7. 建场景规范包
8. 建技术栈规范包
9. 改项目激活层
10. 深化 33 份全局工程约束文档
11. 做真实任务验证

这条顺序属于强执行顺序，不建议跳步。

---

# 13. 可验证的完成标准
满足以下条件，视为本轮重构整体完成：
1. 主 `SKILL.md` 已轻核化
2. 详细流程已拆到 workflow 文档
3. 已建立装载规则与子代理规则
4. 已建立 12 个场景包首版
5. 已建立首批高频技术栈包
6. 已升级项目激活文档
7. 任务执行可按需逐级加载
8. 子代理可用于规范检索与局部分析
9. 至少完成 2 到 3 个真实任务回归验证
10. 新体系相比旧体系在上下文稳定性和输出一致性上有明显改善

---

# 14. 每阶段验收检查清单

## Phase 1 验收
1. 新目录结构是否明确
2. 层级职责是否清晰
3. 是否避免职责重叠

## Phase 2 验收
1. 现有 `SKILL.md` 内容是否全部可迁移
2. 是否形成明确拆解映射

## Phase 3 验收
1. workflow 文件是否能独立表达原有流程
2. Gate / Stage 是否无丢失

## Phase 4 验收
1. 是否定义了文档装载规则
2. 是否定义了任务映射规则
3. 是否定义了子代理规则

## Phase 5 验收
1. 主 `SKILL.md` 是否明显瘦身
2. 是否仍保留关键控制力

## Phase 6 验收
1. 12 个场景包是否完成
2. 是否真实体现项目类型差异

## Phase 7 验收
1. 首批技术栈包是否具备落地细则
2. 是否能服务代码与测试生成

## Phase 8 验收
1. 项目是否可显式激活规范
2. 是否能生成项目级有效标准清单

## Phase 9 验收
1. 真实任务中是否减少上下文污染
2. 子代理是否提升而非破坏主线稳定性

---

# 15. 风险与控制措施

## 15.1 风险：文档拆散后不知读什么
控制：
1. 强制建设 `TASK_TO_STANDARD_MAP.md`

## 15.2 风险：子代理过多导致主线混乱
控制：
1. 固定子代理角色
2. 主代理必须收敛

## 15.3 风险：规范越拆越多，依然太重
控制：
1. 主 skill 严格控制长度
2. 只按需加载
3. 不允许默认全量读取

## 15.4 风险：场景包和技术栈包互相重复
控制：
1. 场景包只写“系统类型差异”
2. 技术栈包只写“实现方式差异”

## 15.5 风险：项目覆盖滥用
控制：
1. 所有覆盖必须记录原因、范围、审批状态

---

# 16. 当前任务后的默认执行约定
从本文件落地开始，后续整个 skill 重构优化任务默认按以下方式推进：
1. 优先围绕本文件中的阶段顺序执行
2. 后续新任务若与本文件直接相关，默认继续推进本文件定义的下一阶段
3. 阶段完成后，以本文件对应阶段的验收标准检查结果
4. 未通过当前阶段验收前，不进入后续阶段

---

# 17. 当前阶段起点
本文件落地后，默认起点为：

`Phase 1：新架构与目录设计`

即后续重构工作的第一步，不是直接写全部场景包，也不是立即重写 `SKILL.md` 全文，而是先把新架构与目录边界设计清楚，再继续推进。
