# 文件名
`28_PROJECT_DIRECTORY_AND_REPOSITORY_STRUCTURE_SPEC.md`

# 文件定位
单项目仓库的目录结构与文件组织标准。

# 适用范围
适用于基于本母规范体系启动的单项目或单仓库工程，覆盖从项目初始化到上线运维的完整目录布局。多项目、多仓协作的目录约定见 `19_MULTI_PROJECT_DIRECTORY_CONVENTION.md`。

# 与其他文件的关系
- 以 `00_GLOBAL_ENGINEERING_PRINCIPLES.md` 的默认技术栈和文档驱动原则为总纲。
- 与 `19_MULTI_PROJECT_DIRECTORY_CONVENTION.md` 互补：19 号定义多项目/多仓布局，本文件定义单项目内部结构。
- 与 `27_PROJECT_EXECUTION_FLOW_SPEC.md` 联动：项目启动阶段（阶段五）按本文件初始化目录骨架。
- 与 `30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md` 联动：开发过程文档的存放位置遵循本文件定义的 `docs/` 层级。

# 编写目的
让每个新项目在初始化时就拥有稳定、可预期的目录结构，避免 AI 或开发者在项目过程中临时拼凑目录、随意堆放文件，确保项目资产、文档、源码、配置、部署脚本始终有明确归属。

## 1. 总体原则
1. 项目根目录结构在初始化时确定，后续只做增量扩展，不做无序重组。
2. 源码、文档、设计、部署、脚本、测试分目录存放，不得混在同一目录中。
3. 项目级文档与代码级文档分层管理：项目级文档放 `docs/project/`，代码级注释和 README 跟随代码目录。
4. 配置与环境变量独立管理，不散落在源码目录中。
5. `AGENTS.md` 放在项目根目录，作为 AI 接入的持久化续接入口。

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
    pencil/
    assets/
  frontend/
  backend/
  python-services/
  deploy/
    docker/
    nginx/
    env/
  sql/
    migrations/
    seeds/
  scripts/
  tests/
```

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
- `pencil/`：Pencil 原始设计文件。
- `assets/`：设计切图、交付说明、标注图。
- 设计版本应与发布里程碑关联。

### 3.6 `frontend/`
- 前端源码目录。
- 遵循 `03_FRONTEND_ARCHITECTURE_SPEC.md` 的分层与命名约定。
- 若有多个前端应用，按 `frontend/admin-web/`、`frontend/portal-web/` 拆分。

### 3.7 `backend/`
- Java Spring Boot 后端源码目录。
- 遵循 `04_BACKEND_ARCHITECTURE_SPEC.md` 的分层与命名约定。

### 3.8 `python-services/`
- Python 辅助服务源码目录。
- 仅用于 AI、数据处理、异步任务、脚本任务、算法能力。

### 3.9 `deploy/`
- `docker/`：Dockerfile、docker compose 文件。
- `nginx/`：Nginx 配置。
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
2. 若为新项目，按第 2 节标准结构创建目录骨架。
3. 生成 `AGENTS.md`，写入项目基本信息与规范引用。
4. 使用 `assets/project-doc-templates/` 初始化 `docs/project/` 下的项目级文档。
5. 创建 `docs/dev/DEVELOPMENT_DOCUMENTATION_INDEX.md` 作为开发文档索引入口。
6. 若已有部分目录，仅补齐缺失部分，不破坏已有结构。

## 7. 与 Acode-kit 工作流的集成
1. SKILL.md 启动流程第 8 步要求创建项目根结构和 `AGENTS.md`，执行时参照本文件。
2. `27_PROJECT_EXECUTION_FLOW_SPEC.md` 阶段五（项目框架初始化）要求建立目录结构，按本文件输出。
3. 追踪矩阵、决策日志、会话交接等文档的存放位置固定在 `docs/project/`，不随项目推进而漂移。

## 本文件使用建议
在项目初始化、仓库重组、新模块入驻时，先按本文件确认目录结构，再进入具体实现。

## AI 调用建议
AI 在收到"初始化项目目录"或"创建项目骨架"的请求时，应严格按照本文件的标准结构输出，不得临时自创目录布局。

## 后续可扩展点
可增加 Monorepo 子包目录约定、微前端目录约定、多环境配置目录约定。
