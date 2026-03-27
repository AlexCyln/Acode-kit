# 文件定位
Prisma 数据访问规范包。

## 适用范围
- Node.js / TypeScript 数据访问项目
- 以 PostgreSQL / MySQL 为主的关系型数据库系统
- 需要 schema 驱动、类型化查询和 migration 治理的业务系统

## 典型技术组合位置
- Prisma schema 负责数据模型定义
- Prisma Client 负责查询与写入
- 与 NestJS、Next.js server runtime、后台任务和审计日志协同

## 推荐目录结构
- `prisma/` 放 schema、migration、seed
- `src/infrastructure/persistence/prisma/` 放 client 封装、repository、query helper
- 复杂查询和事务用例有统一落点，不散落在 service 内部

## 分层与职责边界
- Prisma schema 定义模型与关系
- Repository / Data Access 层负责查询、写入和事务组合
- Service 负责业务编排，不直接拼接复杂查询
- DTO / View Model / Domain Model 不与 Prisma model 直接混用

## 编码复杂度与可维护性要求
- 查询条件、include、select、排序、分页要显式建模
- 大查询优先提炼为可复用 query helper 或 repository 方法
- 事务边界和副作用顺序必须明确
- 不允许在多个 service 中复制粘贴同类 Prisma 查询

## 测试策略与质量门禁
- 复杂查询、事务和权限边界必须有集成测试
- migration 前后要有验证点
- 排序、分页、筛选和旧数据兼容必须覆盖

## 数据与 Migration 协同要求
- schema、migration、repository 和文档必须同版本评审
- 在 migration 未确认前，不得依赖新字段或新关系写业务逻辑
- seed、回填、历史兼容策略必须显式说明

## API / 安全 / 权限协同要求
- 查询条件与 API 字段语义一致
- 敏感字段查询、导出和跨租户读取必须显式受控
- 列表、详情、导出权限要统一而不是各写一套

## 日志与可观测性协同要求
- 慢查询、失败事务、重试链路要可定位
- 关键查询要能关联 traceId、模块和操作语义
- 不输出敏感数据全文

## 多租户适配要求
- 多租户项目必须统一 tenant 字段注入和过滤策略
- 平台级查询与租户级查询要显式区分 repository 或 query helper

## 文档要求
- 记录 schema、关键 relation、索引、事务边界和复杂查询
- 测试文档记录 transaction、pagination、权限和兼容性覆盖

## 常见误用
- 把 Prisma model 当成领域模型直接全链路透传
- 在 service 中复制复杂查询和 include 逻辑
- schema 变更后只改 migration 不改 client 和文档

## 禁止事项
- 在 schema 与权限边界未冻结时堆叠复杂 repository 逻辑
- 在未声明 migration 策略时直接依赖新模型上线

## 追加增强：Prisma 企业级细则

### 查询细则
- 列表查询必须显式区分筛选、排序、分页和权限范围
- 报表型查询与事务型 CRUD 查询应分开组织

### 事务细则
- 事务内只保留必须原子化步骤
- 外部调用、长耗时任务和审计外推优先解耦

### Review 附加清单
- 是否存在 schema 与 repository 不一致
- 是否存在事务边界和权限边界混乱
- 是否存在复杂查询散落在多个 service 中
