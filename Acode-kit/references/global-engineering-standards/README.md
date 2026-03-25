# 文件名
`README.md`

# 文件定位
全局工程规范文档体系总览与导航入口。

# 适用范围
适用于基于已声明技术栈的各类软件项目（Web 应用、移动应用、小程序、桌面应用等），以及后续基于该技术栈决策框架派生的项目级规范。

# 与其他文件的关系
本文件只负责总览、阅读顺序与引用路径，不替代任何专题规范。所有项目应先阅读本文件，再按阶段引用对应专题文档。

# 编写目的
为团队与 AI 提供统一入口，快速定位在不同阶段必须遵守的专题规范，降低遗漏、误读与上下文漂移。

## 当前使用方式

`Acode-kit` 已将本目录作为母规范基线直接消费。当前仓库中的工作流、安装器、全局缓存、NotebookLM 认证持久化与文档治理规则，都会优先回到这里找依据。

如果你是在维护 Acode-kit skill，本文件的角色不是“介绍性文档”，而是“规范索引页”:
- 先从这里定位阶段需要读哪份规范
- 再回到 `Acode-kit/SKILL.md`、`integrations/shared/WORKFLOW_CORE.md`、provider 适配器
- 最后再看具体脚本和项目文档

## 整体文件清单总览

### 核心治理文档
1. `00_GLOBAL_ENGINEERING_PRINCIPLES.md`：定义全局工程哲学、技术栈决策框架、TDD 方法论、AI 边界与文档主从关系。
2. `01_PRODUCT_REQUIREMENTS_STANDARD.md`：定义标准需求文档结构、需求分级、验收口径与 AI 需求整理方式。
3. `02_UI_UX_DESIGN_SPEC.md`：定义设计稿、信息架构、设计交付与页面还原规范。
4. `03_FRONTEND_ARCHITECTURE_SPEC.md`：定义前端工程结构、职责边界与通用开发范式。
5. `04_BACKEND_ARCHITECTURE_SPEC.md`：定义后端工程结构、分层规范与主服务/辅助服务边界。
6. `05_API_DESIGN_SPEC.md`：定义 RESTful API 设计、统一返回、错误码、版本与幂等规范。
7. `06_DATABASE_DESIGN_SPEC.md`：定义数据库建模、命名、索引、逻辑删除与建表模板。
8. `07_REDIS_CACHE_SPEC.md`：定义缓存与会话存储规范，包含 key 设计、TTL、一致性、锁、限流等。

### 工程协作文档
9. `08_CODE_STYLE_AND_NAMING_SPEC.md`：定义跨语言代码风格与命名规范。
10. `09_GIT_WORKFLOW_AND_COMMIT_SPEC.md`：定义分支模型、Commit、PR、版本号与合并策略。
11. `10_CODE_REVIEW_SPEC.md`：定义 Review 目标、检查项、结论等级与整改标准。
12. `11_TESTING_AND_QA_SPEC.md`：定义测试分层、TDD 方法论、提测门槛、联调流程、Bug 分级与发布验收。
13. `12_DEBUG_AND_TROUBLESHOOTING_SPEC.md`：定义排障流程、日志定位、修复验证与缺陷闭环。

### 交付与运维文档
14. `13_DEPLOYMENT_AND_DEVOPS_SPEC.md`：定义容器化交付、环境变量、发布与回滚规范。
15. `14_CICD_SPEC.md`：定义 CI/CD 最低可行流水线、分支与环境联动、审批与回滚策略。
16. `16_SECURITY_SPEC.md`：定义认证鉴权、安全基线、敏感信息保护、审计与常见安全控制。
17. `17_OBSERVABILITY_SPEC.md`：定义日志、指标、链路、告警与运维观测规范。
18. `18_ENVIRONMENT_CONFIG_SPEC.md`：定义多环境配置分层、密钥管理、配置注入与变更治理。

### 复用与 AI 协作文档
19. `15_AI_COLLABORATION_PLAYBOOK.md`：定义 AI 在需求、设计、开发、测试、部署阶段的工作方式。
20. `19_MULTI_PROJECT_DIRECTORY_CONVENTION.md`：定义多项目仓库、单仓多应用与共享模块目录约定。
21. `20_DATA_MODELING_PLAYBOOK.md`：定义从业务对象到表结构、字典、日志、流水的建模方法。
22. `21_PROMPT_USAGE_GUIDE.md`：定义如何让 AI Agent 在长期协作中稳定遵守母规范。
23. `22_SOLO_AI_PROJECT_OPERATING_MANUAL.md`：定义单人 + AI 模式下的最小项目运行方式、阶段门禁、会话交接与完成标准。
24. `23_SCOPE_CONTROL_AND_DECISION_LOG_SPEC.md`：定义范围控制、关键决策记录、假设管理与版本边界。
25. `24_REQUIREMENTS_TRACEABILITY_MATRIX_SPEC.md`：定义项目主任务路线图、总体进度追踪、当前主任务与偏差控制规则。
26. `25_ACCEPTANCE_AND_GO_LIVE_CHECKLIST.md`：定义单人项目上线前验收、冒烟、回滚与观察期检查清单。
27. `26_EXTERNAL_INTEGRATION_SPEC.md`：定义第三方系统、回调、签名、重试、补偿与联调治理规则。
28. `27_PROJECT_EXECUTION_FLOW_SPEC.md`：定义具体项目在单人 + AI 模式下从需求输入到上线交付的统一执行流程范式。
29. `28_PROJECT_DIRECTORY_AND_REPOSITORY_STRUCTURE_SPEC.md`：定义单项目仓库的目录结构与文件组织标准。
30. `29_DATA_DICTIONARY_AND_REFERENCE_DATA_SPEC.md`：定义数据字典、标准参考字典、识别规则与执行路径。
31. `30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md`：定义开发过程文档的存在性检查、更新要求、最小清单与验收标准。
32. `31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md`：定义第三方 MCP 工具的注册、安装、状态追踪与降级管理规范。
33. `32_DATABASE_MIGRATION_SPEC.md`：定义数据库结构变更、回填、版本化、回滚与发布链路治理规范。
34. `33_MULTI_TENANCY_ARCHITECTURE_SPEC.md`：定义多租户模式、租户边界、隔离、权限与日志治理规范。

## 推荐阅读顺序
1. 先读 `00_GLOBAL_ENGINEERING_PRINCIPLES.md`，确认技术栈决策框架、TDD 方法论与治理规则。
2. 做需求前读 `01_PRODUCT_REQUIREMENTS_STANDARD.md`，并将 PRD 作为项目最高级需求边界文档维护。
3. 设计阶段读 `02_UI_UX_DESIGN_SPEC.md`。
4. 前后端实现前分别读 `03_FRONTEND_ARCHITECTURE_SPEC.md`、`04_BACKEND_ARCHITECTURE_SPEC.md`、`05_API_DESIGN_SPEC.md`。
5. 做数据与缓存设计前读 `06_DATABASE_DESIGN_SPEC.md`、`07_REDIS_CACHE_SPEC.md`、`20_DATA_MODELING_PLAYBOOK.md`、`29_DATA_DICTIONARY_AND_REFERENCE_DATA_SPEC.md`。
6. 进入协作、测试、部署阶段时读 `08` 至 `18` 号文档，并在真实开发阶段补读 `30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md`。
7. 若项目进入长周期迭代，需额外确保项目文档按"当前有效 / 当前执行审阅稿 / 已审阅参考资料 / 详细实现文档 / archive 历史归档"分层维护，避免当前文档被长历史淹没。
8. 单人 + AI 项目运行前读 `22_SOLO_AI_PROJECT_OPERATING_MANUAL.md`、`23_SCOPE_CONTROL_AND_DECISION_LOG_SPEC.md`、`24_REQUIREMENTS_TRACEABILITY_MATRIX_SPEC.md`，并明确 `TRACEABILITY_MATRIX.md` 用于项目总体路线追踪而非会话级交接。
9. 上线前读 `25_ACCEPTANCE_AND_GO_LIVE_CHECKLIST.md`。
10. 涉及第三方系统时读 `26_EXTERNAL_INTEGRATION_SPEC.md`。
11. 启动具体项目时读 `27_PROJECT_EXECUTION_FLOW_SPEC.md`，按阶段初始化项目级文档并推进实施。
12. AI 参与任何阶段前必须读 `15_AI_COLLABORATION_PLAYBOOK.md` 与 `21_PROMPT_USAGE_GUIDE.md`。
13. 需要管理第三方 MCP 工具时读 `31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md`。
14. 涉及数据库版本化、结构演进和回填时读 `32_DATABASE_MIGRATION_SPEC.md`。
15. 涉及平台型 SaaS、多租户边界和租户隔离时读 `33_MULTI_TENANCY_ARCHITECTURE_SPEC.md`。

## 与 Acode-kit 的关系

1. Acode-kit 的 workflow、init、scan、install、bootstrap 行为必须与本目录的规范保持一致。
2. 如果脚本或 README 描述和规范冲突，以这里的专题规范为准。
3. 当你修改第三方工具、TDD、文档治理、会话接力、阶段执行时，要优先回查相关编号文档，而不是只改工作流入口。

## 项目落地方式
1. 每个新项目必须复制本目录作为母规范基线，或以 Git Submodule、Git Subtree、模板仓库方式继承。
2. 项目级文档只能在不违背母规范的前提下做"增量补充"和"明确覆盖"，禁止隐式偏离。
3. 当项目级规范与母规范冲突时，必须在项目级文档中明确写出"覆盖原因、覆盖范围、覆盖期限、审批人"。
4. AI 生成代码、SQL、API、页面、测试脚本、部署脚本时，必须优先引用本目录，再读取项目级文档。

## 文档更新规则
1. 母规范更新必须通过 Review，不得直接口头变更。
2. 涉及跨文档术语、命名、接口约定调整时，必须同步更新关联文档。
3. 任一文档新增规则时，必须说明是"新增约束""默认约束"还是"建议做法"。

## 本文件使用建议
将本文件作为团队入场文档与 AI 导航文档，放在仓库根目录或组织级知识库首页。

## AI 调用建议
AI 在开始任何任务前先读取本文件，按"任务阶段 -> 对应文档"定位规范来源，避免遗漏强约束。

## 后续可扩展点
可按组织需要补充领域规范，如报表规范、低代码接入规范、第三方集成规范、数据治理规范。

## 任务路由补充建议
1. 若任务涉及需求澄清、范围边界、路线图和变更判断，优先读取 `01`、`23`、`24`、`27`。
2. 若任务涉及前端页面、交互、组件复用和状态管理，优先读取 `02`、`03`、`05`、`08`。
3. 若任务涉及后端分层、接口、数据库、缓存、migration、多租户，优先读取 `04`、`05`、`06`、`07`、`20`、`32`、`33`。
4. 若任务涉及测试、发布、运维、观测、安全，优先读取 `11`、`13`、`14`、`16`、`17`、`18`、`25`。
5. 若任务涉及 AI 协同、Prompt、文档治理、第三方工具，优先读取 `15`、`21`、`30`、`31`。

## 使用治理补充清单
1. 进入实现前，是否已经定位到当前任务必须遵守的母规范集合。
2. 项目级覆盖是否已写入 `PROJECT_OVERRIDES.md` 或 `ACTIVE_STANDARDS.md`。
3. 文档增强是否遵守“保留原文 + 追加增强内容”的维护方式。
4. 高风险任务是否已经进入审阅草稿或人工确认流程，而不是直接执行。
