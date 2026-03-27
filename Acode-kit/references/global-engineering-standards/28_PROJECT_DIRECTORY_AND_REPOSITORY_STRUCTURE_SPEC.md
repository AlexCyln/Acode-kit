# 文件名
`28_PROJECT_DIRECTORY_AND_REPOSITORY_STRUCTURE_SPEC.md`

# 文件定位
单项目仓库的目录结构与文件组织标准。

# 适用范围
适用于基于本母规范体系启动的单项目或单仓库工程，覆盖从项目初始化到上线运维的完整目录布局。多项目、多仓协作的目录约定见 `19_MULTI_PROJECT_DIRECTORY_CONVENTION.md`。

# 与其他文件的关系
- 以 `00_GLOBAL_ENGINEERING_PRINCIPLES.md` 的技术栈决策框架和文档驱动原则为总纲。
- 与 `19_MULTI_PROJECT_DIRECTORY_CONVENTION.md` 互补：19 号定义多项目/多仓布局，本文件定义单项目内部结构。
- 与 `27_PROJECT_EXECUTION_FLOW_SPEC.md` 联动：项目启动阶段（阶段五）按本文件初始化目录骨架。
- 与 `30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md` 联动：开发过程文档的存放位置遵循本文件定义的 `docs/` 层级。
- 与 `references/load-rules/DIRECTORY_BLUEPRINT_SYNTHESIS_RULES.md` 联动：具体初始化目录时，必须先整合已激活场景包和技术栈包的目录片段，再按本文件原则补齐。
- 与 `references/project-blueprints/` 联动：当目录片段不足时，可作为 fallback 参考，不得替代已激活技术栈片段。

# 编写目的
让每个新项目在初始化时就拥有稳定、可预期的目录结构，避免 AI 或开发者在项目过程中临时拼凑目录、随意堆放文件，确保项目资产、文档、源码、配置、部署脚本始终有明确归属。

## 1. 总体原则
1. 项目根目录结构在初始化时确定，后续只做增量扩展，不做无序重组。
2. 源码、文档、设计、部署、脚本、测试分目录存放，不得混在同一目录中。
3. 项目级文档与代码级文档分层管理：项目级文档放 `docs/project/`，代码级注释和 README 跟随代码目录。
4. 配置与环境变量独立管理，不散落在源码目录中。
5. `AGENTS.md` 放在项目根目录，作为 AI 接入的持久化续接入口。
6. 目录结构必须优先服从已批准技术选型，不得用与技术栈不匹配的通用树硬套项目。
7. 初始化目录时必须先整合一个“目录计划”，再执行目录创建，不得临时凭经验拼装。

## 2. 标准项目目录结构
```text
project-root/
  AGENTS.md
  README.md
  docs/
    project/
      PROJECT_OVERVIEW.md
      PROJECT_OVERRIDES.md
      PRD.md
      DECISION_LOG.md
      TRACEABILITY_MATRIX.md
      SESSION_HANDOFF.md
      GO_LIVE_RECORD.md
    dev/
      API_DETAIL_CATALOG.md
      DATABASE_DETAIL_CATALOG.md
      FUNCTION_MODULE_RECORD.md
      TEST_EXECUTION_RECORD.md
      DEVELOPMENT_DOCUMENTATION_INDEX.md
    archive/
  design/
    design-files/
    assets/
  frontend/
  backend/
  auxiliary-services/
  deploy/
    docker/
    config/
    env/
  sql/
    migrations/
    seeds/
  scripts/
  tests/
```

> 上述结构是单项目仓库的通用基线，不是所有技术栈的逐项必建清单。实际初始化时必须先根据激活场景包和技术栈包整合 `DIRECTORY_PLAN.md`，再按本节补齐治理目录与跨栈公共目录。`references/project-blueprints/` 仅在目录片段不足时作为 fallback 参考。

## 3. 各目录职责

### 3.1 `AGENTS.md`
- 位于项目根目录。
- 由 Acode-kit 在项目首次初始化时生成。
- 作为 AI 后续进入同一仓库时的持久化续接入口。
- 记录当前项目遵循的规范体系、技术栈、工作流、文档入口。

### 3.2 `docs/project/`
- 存放项目级总控文档：PRD、决策日志、追踪矩阵、会话交接、上线记录等。
- 这些文档由 Acode-kit 工作流自动创建和维护。
- 文件来源于 `assets/project-doc-templates/` 中的模板。

### 3.3 `docs/dev/`
- 存放开发过程文档：接口详细文档、数据库详细文档、功能函数记录、测试执行记录。
- 参照 `30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md` 的治理要求。

### 3.4 `docs/archive/`
- 存放已结束的审阅稿、旧版交接记录、被替换的长历史文档。
- 当 `SESSION_HANDOFF.md`、`DECISION_LOG.md` 或审阅稿累积过长时，历史内容迁入此处。

### 3.5 `design/`
- `design-files/`：使用已声明设计工具的原始设计文件。
- `assets/`：设计切图、交付说明、标注图。
- 设计版本应与发布里程碑关联。

### 3.6 `frontend/`
- 前端源码目录。
- 遵循 `03_FRONTEND_ARCHITECTURE_SPEC.md` 的分层与命名约定。
- 若有多个前端应用，按 `frontend/admin-web/`、`frontend/portal-web/` 拆分。
- 对于单前端应用项目，若所选蓝图明确采用根目录应用结构（如 `src/`、`app/`、`public/`），则不应机械再套一层 `frontend/`。

### 3.7 `backend/`
- 已声明后端运行时的后端源码目录。
- 遵循 `04_BACKEND_ARCHITECTURE_SPEC.md` 的分层与命名约定。

### 3.8 `auxiliary-services/`
- 辅助服务源码目录。
- 仅用于 AI、数据处理、异步任务、脚本任务、算法能力等辅助场景。

### 3.9 `deploy/`
- `docker/`：Dockerfile、容器编排文件。
- `config/`：服务配置文件（如反向代理配置等）。
- `env/`：环境变量模板（`.env.example`），不存放真实密钥。
- 遵循 `13_DEPLOYMENT_AND_DEVOPS_SPEC.md` 和 `18_ENVIRONMENT_CONFIG_SPEC.md`。

### 3.10 `sql/`
- `migrations/`：结构变更脚本，按顺序编号。
- `seeds/`：初始化数据脚本。
- 遵循 `06_DATABASE_DESIGN_SPEC.md`。

### 3.11 `scripts/`
- 项目级工具脚本：构建、部署、数据迁移、一次性运维脚本。
- 临时运维脚本执行后应及时归档或删除。

### 3.12 `tests/`
- 集成测试、端到端测试、测试数据。
- 单元测试跟随各源码目录内部。
- 遵循 `11_TESTING_AND_QA_SPEC.md`。

## 4. 根目录必须有的文件
1. `AGENTS.md`：AI 续接入口。
2. `README.md`：项目说明与启动指南。
3. `.gitignore`：版本控制忽略规则。
4. 构建配置文件（`package.json`、`pom.xml` 等，视技术栈而定）。

## 5. 禁止的目录做法
1. 在项目根目录直接堆放源码文件，不做子目录分类。
2. `temp`、`misc`、`other`、`new_version_v2` 等无语义目录名。
3. 把部署脚本、SQL、设计稿混在应用源码目录中。
4. 把环境变量真实值（`.env`）提交到版本控制。
5. 把项目级文档散落在各个源码子目录而非统一的 `docs/` 下。
6. 在没有 `AGENTS.md` 的情况下期望 AI 跨会话续接项目上下文。

## 6. AI 初始化项目目录的标准流程
1. 检查项目根目录是否已有目录骨架。
2. 若为新项目，先根据已批准项目类型、运行时、构建工具、部署模式和已激活场景/栈包整合 `DIRECTORY_PLAN.md`。
3. 只有目录片段不足时，才允许参考 `references/project-blueprints/`；若仍不足，再回退到第 2 节标准结构，并在文档中说明原因。
4. 生成 `AGENTS.md`，写入项目基本信息与规范引用。
5. 先输出并审阅 `docs/project/DIRECTORY_PLAN.md`，说明目录来源、目录职责和冲突处理。
6. 将 `.acode-kit-startup/` 中已冻结的启动产物移动到 `docs/project/` 正式位置，不得重新编写简化版文档。
7. 创建 `docs/dev/DEVELOPMENT_DOCUMENTATION_INDEX.md` 作为开发文档索引入口。
8. 若已有部分目录，仅补齐缺失部分，不破坏已有结构。

## 7. 与 Acode-kit 工作流的集成
1. SKILL.md 启动流程第 8 步要求创建项目根结构和 `AGENTS.md`，执行时参照本文件。
2. `27_PROJECT_EXECUTION_FLOW_SPEC.md` 阶段五（项目框架初始化）要求建立目录结构，按本文件输出。
3. 追踪矩阵、决策日志、会话交接等文档的存放位置固定在 `docs/project/`，不随项目推进而漂移。
4. `Step 2` 和 `Step 3` 形成的启动期文件必须先固化在 `.acode-kit-startup/`，`Step 4a` 再按 `DIRECTORY_PLAN.md` 归位到正式路径，`Step 4b` 之后再进入环境与工程骨架搭建。

## 本文件使用建议
在项目初始化、仓库重组、新模块入驻时，先按本文件确认目录结构，再进入具体实现。

## AI 调用建议
AI 在收到"初始化项目目录"或"创建项目骨架"的请求时，应先整合已激活场景包和技术栈包中的目录片段，必要时再参考 fallback 蓝图，然后补齐本文件要求的治理目录，不得临时自创目录布局。

## 后续可扩展点
可增加 Monorepo 子包目录约定、微前端目录约定、多环境配置目录约定。

## 8. 企业级目录治理深化要求
1. 目录结构必须服务于协作、排障、发布和交接，不得只追求“看起来整齐”。
2. 新增目录前应先判断是否属于既有职责域；只有现有结构无法承载时才新增新的一级或二级目录。
3. 目录命名必须稳定、可预测、可被脚本和文档引用，避免阶段性命名、个人命名或临时性命名长期保留。
4. 代码目录、文档目录、部署目录、数据目录、设计目录必须保持职责单一，禁止逐步演变成“杂物间目录”。

## 9. 根目录卫生规则
1. 根目录只允许放置项目入口、构建入口、全局配置和高频说明文件，不得逐步堆积一次性脚本、临时 SQL、调试日志、截图或会议纪要。
2. 一次性排障产物、临时导出文件、手工比对文件必须进入 `docs/archive/`、`tmp/` 或明确的临时目录，并在任务结束后清理。
3. 新增根目录文件前必须回答两个问题：是否为项目入口级文件；是否需要被所有协作者和自动化工具稳定发现。

## 10. 模块目录扩展规则
1. 前后端模块内部目录扩展必须延续母规范定义的分层边界，不得按个人习惯随意横向复制。
2. 相同职责的目录在不同模块中应尽量同名，例如 `application/`、`domain/`、`infrastructure/`、`components/`、`services/`。
3. 若项目存在多个应用或服务，应用级目录应围绕交付单元拆分，不应围绕个人开发阶段拆分。
4. 当目录层级超过 4 层仍难以理解时，应回到架构评审，判断是否是边界划分错误而不是继续加层级。

## 11. Review 附加清单
1. 当前目录是否支持新人和 AI 在 5 分钟内定位核心入口、文档入口、部署入口、测试入口。
2. 是否存在同类文件分散在多个无关目录中的情况。
3. 是否存在以 `temp`、`backup`、`final2`、`new`、`misc` 等名称长期存活的目录。
4. 文档索引、部署脚本、SQL 脚本、测试记录是否都放在了规定位置。
5. 目录调整是否同步更新了 README、AGENTS、文档索引和自动化脚本引用。
6. 当前目录是否与已批准技术选型、构建工具和运行时入口一致，而不是沿用了不匹配的通用模板。
7. `DIRECTORY_PLAN.md` 是否说明了母规范固定目录、场景增强目录、技术栈目录片段和 fallback 来源。
8. `Step 4a` 是否只是移动和归位启动期已冻结文件，而不是重新发明 `overview`、`prd` 等弱化文档。

## 12. 目录蓝图治理要求
1. 目录整合必须优先消费已激活技术栈包和场景包中的目录片段。
2. fallback 蓝图必须高度契合技术选型，至少区分项目类型、主要运行时、构建工具和部署入口。
3. fallback 蓝图的专业性要求高于“通用适配性”；宁可提供多份专业蓝图，也不要用一份模糊结构覆盖所有项目。
4. 目录计划必须明确源码入口、静态资源目录、测试目录、文档目录、部署目录和环境配置目录的最终落点。
5. 技术栈发生正式变更时，必须同步评估目录片段和 fallback 蓝图是否仍然适用；不适用时应记录迁移方案，而不是局部打补丁。
