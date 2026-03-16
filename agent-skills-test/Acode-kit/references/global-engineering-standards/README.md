# 文件名
`README.md`

# 文件定位
全局工程规范文档体系总览与导航入口。

# 适用范围
适用于基于 Vue 3、TypeScript、Vite、Pinia、Vue Router、Element Plus、Java Spring Boot、MyBatis-Plus、MySQL、Redis、Docker、docker compose、Pencil 的中小型 B/S SaaS 项目，以及后续基于该技术基线派生的项目级规范。

# 与其他文件的关系
本文件只负责总览、阅读顺序与引用路径，不替代任何专题规范。所有项目应先阅读本文件，再按阶段引用对应专题文档。

# 编写目的
为团队与 AI 提供统一入口，快速定位在不同阶段必须遵守的专题规范，降低遗漏、误读与上下文漂移。

## 整体文件清单总览

### 核心治理文档
1. `00_GLOBAL_ENGINEERING_PRINCIPLES.md`：定义全局工程哲学、默认技术决策、AI 边界与文档主从关系。
2. `01_PRODUCT_REQUIREMENTS_STANDARD.md`：定义标准需求文档结构、需求分级、验收口径与 AI 需求整理方式。
3. `02_UI_UX_DESIGN_SPEC.md`：定义 Pencil 设计稿、信息架构、设计交付与页面还原规范。
4. `03_FRONTEND_ARCHITECTURE_SPEC.md`：定义 Vue 前端工程结构、职责边界与通用开发范式。
5. `04_BACKEND_ARCHITECTURE_SPEC.md`：定义 Spring Boot 后端工程结构、分层规范与 Java/Python 边界。
6. `05_API_DESIGN_SPEC.md`：定义 RESTful API 设计、统一返回、错误码、版本与幂等规范。
7. `06_DATABASE_DESIGN_SPEC.md`：定义 MySQL 建模、命名、索引、逻辑删除与建表模板。
8. `07_REDIS_CACHE_SPEC.md`：定义 Redis key、TTL、缓存一致性、锁、限流、登录态等规范。

### 工程协作文档
9. `08_CODE_STYLE_AND_NAMING_SPEC.md`：定义 Vue、TypeScript、Java、Python 代码风格与命名规范。
10. `09_GIT_WORKFLOW_AND_COMMIT_SPEC.md`：定义分支模型、Commit、PR、版本号与合并策略。
11. `10_CODE_REVIEW_SPEC.md`：定义 Review 目标、检查项、结论等级与整改标准。
12. `11_TESTING_AND_QA_SPEC.md`：定义测试分层、提测门槛、联调流程、Bug 分级与发布验收。
13. `12_DEBUG_AND_TROUBLESHOOTING_SPEC.md`：定义排障流程、日志定位、修复验证与缺陷闭环。

### 交付与运维文档
14. `13_DEPLOYMENT_AND_DEVOPS_SPEC.md`：定义 Docker、docker compose、环境变量、发布与回滚规范。
15. `14_CICD_SPEC.md`：定义 CI/CD 最低可行流水线、分支与环境联动、审批与回滚策略。
16. `16_SECURITY_SPEC.md`：定义认证鉴权、安全基线、敏感信息保护、审计与常见安全控制。
17. `17_OBSERVABILITY_SPEC.md`：定义日志、指标、链路、告警与运维观测规范。
18. `18_ENVIRONMENT_CONFIG_SPEC.md`：定义多环境配置分层、密钥管理、配置注入与变更治理。

### 复用与 AI 协作文档
19. `15_AI_COLLABORATION_PLAYBOOK.md`：定义 AI 在需求、设计、开发、测试、部署阶段的工作方式。
20. `19_MULTI_PROJECT_DIRECTORY_CONVENTION.md`：定义多项目仓库、单仓多应用与共享模块目录约定。
21. `20_DATA_MODELING_PLAYBOOK.md`：定义从业务对象到表结构、字典、日志、流水的建模方法。
22. `21_PROMPT_USAGE_GUIDE.md`：定义如何让 Codex、VSCode AI、Agent 在长期协作中稳定遵守母规范。
23. `22_SOLO_AI_PROJECT_OPERATING_MANUAL.md`：定义单人 + AI 模式下的最小项目运行方式、阶段门禁、会话交接与完成标准。
24. `23_SCOPE_CONTROL_AND_DECISION_LOG_SPEC.md`：定义范围控制、关键决策记录、假设管理与版本边界。
25. `24_REQUIREMENTS_TRACEABILITY_MATRIX_SPEC.md`：定义项目主任务路线图、总体进度追踪、当前主任务与偏差控制规则。
26. `25_ACCEPTANCE_AND_GO_LIVE_CHECKLIST.md`：定义单人项目上线前验收、冒烟、回滚与观察期检查清单。
27. `26_EXTERNAL_INTEGRATION_SPEC.md`：定义第三方系统、回调、签名、重试、补偿与联调治理规则。
28. `27_PROJECT_EXECUTION_FLOW_SPEC.md`：定义具体项目在单人 + AI 模式下从需求输入到上线交付的统一执行流程范式。
29. `29_DATA_DICTIONARY_AND_REFERENCE_DATA_SPEC.md`：定义数据字典、标准参考字典、识别规则与执行路径。
30. `30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md`：定义开发过程文档的存在性检查、更新要求、最小清单与验收标准。

## 推荐阅读顺序
1. 先读 `00_GLOBAL_ENGINEERING_PRINCIPLES.md`，确认默认技术决策与治理规则。
2. 做需求前读 `01_PRODUCT_REQUIREMENTS_STANDARD.md`，并将 PRD 作为项目最高级需求边界文档维护。
3. 设计阶段读 `02_UI_UX_DESIGN_SPEC.md`。
4. 前后端实现前分别读 `03_FRONTEND_ARCHITECTURE_SPEC.md`、`04_BACKEND_ARCHITECTURE_SPEC.md`、`05_API_DESIGN_SPEC.md`。
5. 做数据与缓存设计前读 `06_DATABASE_DESIGN_SPEC.md`、`07_REDIS_CACHE_SPEC.md`、`20_DATA_MODELING_PLAYBOOK.md`、`29_DATA_DICTIONARY_AND_REFERENCE_DATA_SPEC.md`。
6. 进入协作、测试、部署阶段时读 `08` 至 `18` 号文档，并在真实开发阶段补读 `30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md`。
7. 若项目进入长周期迭代，需额外确保项目文档按“当前有效 / 当前执行审阅稿 / 已审阅参考资料 / 详细实现文档 / archive 历史归档”分层维护，避免当前文档被长历史淹没。
8. 单人 + AI 项目运行前读 `22_SOLO_AI_PROJECT_OPERATING_MANUAL.md`、`23_SCOPE_CONTROL_AND_DECISION_LOG_SPEC.md`、`24_REQUIREMENTS_TRACEABILITY_MATRIX_SPEC.md`，并明确 `TRACEABILITY_MATRIX.md` 用于项目总体路线追踪而非会话级交接。
9. 上线前读 `25_ACCEPTANCE_AND_GO_LIVE_CHECKLIST.md`。
10. 涉及第三方系统时读 `26_EXTERNAL_INTEGRATION_SPEC.md`。
11. 启动具体项目时读 `27_PROJECT_EXECUTION_FLOW_SPEC.md`，按阶段初始化项目级文档并推进实施。
12. AI 参与任何阶段前必须读 `15_AI_COLLABORATION_PLAYBOOK.md` 与 `21_PROMPT_USAGE_GUIDE.md`。

## 项目落地方式
1. 每个新项目必须复制本目录作为母规范基线，或以 Git Submodule、Git Subtree、模板仓库方式继承。
2. 项目级文档只能在不违背母规范的前提下做“增量补充”和“明确覆盖”，禁止隐式偏离。
3. 当项目级规范与母规范冲突时，必须在项目级文档中明确写出“覆盖原因、覆盖范围、覆盖期限、审批人”。
4. AI 生成代码、SQL、API、页面、测试脚本、部署脚本时，必须优先引用本目录，再读取项目级文档。

## 文档更新规则
1. 母规范更新必须通过 Review，不得直接口头变更。
2. 涉及跨文档术语、命名、接口约定调整时，必须同步更新关联文档。
3. 任一文档新增规则时，必须说明是“新增约束”“默认约束”还是“建议做法”。

## 本文件使用建议
将本文件作为团队入场文档与 AI 导航文档，放在仓库根目录或组织级知识库首页。

## AI 调用建议
AI 在开始任何任务前先读取本文件，按“任务阶段 -> 对应文档”定位规范来源，避免遗漏强约束。

## 后续可扩展点
可按组织需要补充领域规范，如报表规范、低代码接入规范、第三方集成规范、数据治理规范。
