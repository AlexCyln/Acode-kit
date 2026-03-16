# 文件名
`19_MULTI_PROJECT_DIRECTORY_CONVENTION.md`

# 文件定位
多项目、多服务、多仓协作下的目录组织约定。

# 适用范围
适用于单仓多应用、前后端同仓、前后端分仓但共享母规范、带 Python 辅助服务的工程结构设计。

# 与其他文件的关系
本文件补充 `03_FRONTEND_ARCHITECTURE_SPEC.md`、`04_BACKEND_ARCHITECTURE_SPEC.md` 与 `13_DEPLOYMENT_AND_DEVOPS_SPEC.md` 的目录落地方式。

# 编写目的
统一多项目、多服务仓库的目录布局方式，让规范、源码、设计、SQL、部署文件可长期稳定组织与继承。

## 1. 目录治理原则
1. 母规范与项目实现分层。
2. 前端、后端、Python、部署、设计、SQL、脚本分目录。
3. 目录命名稳定，避免多项目各搞一套。

## 2. 推荐目录结构
```text
repo-root/
  global-engineering-standards/
  docs/
    project/
  design/
    pencil/
  frontend/
  backend/
  python-services/
  deploy/
  sql/
    migrations/
    seeds/
  scripts/
  tests/
```

## 3. 单仓多应用建议
1. `frontend/admin-web`
2. `frontend/portal-web`
3. `backend/app-server`
4. `python-services/ai-worker`

要求：
1. 每个应用都有独立 README 与启动说明。
2. 公共脚本放在顶层 `scripts/`。
3. 公共文档放在 `docs/project/`。

## 4. 项目级文档建议
至少包含：
1. `PROJECT_OVERVIEW.md`
2. `PROJECT_OVERRIDES.md`
3. `API_CHANGELOG.md`
4. `RELEASE_NOTES.md`

## 5. SQL 与脚本目录建议
1. 结构变更脚本放 `sql/migrations/`。
2. 初始化数据脚本放 `sql/seeds/`。
3. 临时运维脚本进入 `scripts/ops/`，执行后及时归档或删除。

## 6. 设计资源目录建议
1. Pencil 原始文件放 `design/pencil/`。
2. 设计切图、交付说明放 `design/assets/` 或项目文档目录。
3. 设计版本记录需与发布里程碑关联。

## 7. 目录命名禁令
1. `new_project_final_v2` 这类不可维护目录名。
2. `temp`, `misc`, `other` 这类无语义目录。
3. 把部署脚本、SQL、设计稿混在应用源码目录中无规则堆放。

## 本文件使用建议
新仓库初始化、历史仓库整理、多项目整合时，应先按本文件统一目录结构，再推进具体代码和文档治理。

## AI 调用建议
AI 在初始化仓库、生成目录骨架、放置设计稿与部署文件时，应按本文件输出稳定目录，而不是临时拼接目录名。

## 后续可扩展点
可增加 Monorepo 包管理约定、共享组件库目录约定、基础设施仓库约定。
