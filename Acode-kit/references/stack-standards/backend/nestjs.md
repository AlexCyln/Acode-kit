# 文件定位
NestJS 后端实现规范包。

## 适用范围
- Node.js 后端服务
- API 平台、后台服务、工作流编排类系统
- 需要模块化、依赖注入、守卫和中间件体系的 TypeScript 后端项目

## 典型技术组合位置
- NestJS 负责模块化后端骨架、控制器、服务和依赖注入
- 可与 Prisma、TypeORM、Redis、消息队列和 OpenAPI 协同
- 适用于 B/S 后台、内容平台、SaaS 平台和 API 服务

## 推荐目录结构
- `modules/` 按业务模块拆分 controller、service、dto、entities
- `common/` 放公共装饰器、守卫、过滤器、拦截器和工具
- `config/` 放环境与框架配置
- `infrastructure/` 放数据库、缓存、消息和第三方集成适配
- `test/` 放 e2e 和模块级测试

## 分层与职责边界
- Controller 负责协议入口与响应转换
- Service 负责用例编排与事务边界
- Repository / Data Access 负责持久化协作
- Guard、Interceptor、Pipe、Filter 各司其职，不互相偷塞业务
- 不允许把核心业务规则散落到 Controller 和 Middleware 中

## 编码复杂度与可维护性要求
- 模块边界与 provider 依赖要显式
- dto、view model、entity、domain object 要分层
- 大型 service 应拆为可测试的 use case 组合
- 定时任务、事件处理和同步接口要分清入口与重试策略

## 测试策略与质量门禁
- 模块核心 service 做单元测试
- 关键 controller / auth / permission 路径做 e2e
- 状态机、权限、幂等、回调和失败路径必须覆盖

## 数据与 Migration 协同要求
- ORM / query schema 与 migration 必须同版本评审
- 新字段、新索引、新状态值上线前需验证 service、dto、guard 与文档同步

## API / 安全 / 权限协同要求
- 路由、角色、资源权限与审计要求必须统一声明
- 高风险接口要明确幂等、审计、限流和失败回执
- 前端可见性不能替代服务端最终鉴权

## 日志与可观测性协同要求
- 关键请求必须带 traceId、userId、tenantId、module 语义
- 健康检查、核心指标和错误日志要可观测
- 后台任务、回调、重试链路要能定位

## 多租户适配要求
- 多租户项目必须统一租户上下文解析和注入方式
- 缓存键、日志字段、权限判断和数据读取都要体现租户边界

## 文档要求
- 记录模块边界、provider 依赖、权限守卫和任务入口
- API 文档、测试文档和数据访问文档要同步维护

## 常见误用
- Controller 承担业务编排
- Common 层不断膨胀为杂物间
- Guard、Interceptor、Pipe 各自做半套权限逻辑

## 禁止事项
- 在模块边界未冻结时先堆大量 provider 与交叉依赖
- 在权限、审计和异常策略未声明前展开高风险接口实现

## 追加增强：NestJS 企业级细则

### 模块细则
- 业务模块优先围绕交付单元拆分，不围绕个人开发阶段拆分
- 公共能力只在确有多模块复用时进入 `common/`

### 异步与任务细则
- 后台任务、事件和回调必须有重试、幂等和监控策略
- 长耗时任务不要与同步接口共享同一执行语义

### Review 附加清单
- 是否存在 provider 循环依赖
- 是否存在权限、日志和异常语义分散
- 是否存在 controller 与 service 边界混乱
