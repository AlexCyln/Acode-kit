# 文件名
`04_BACKEND_ARCHITECTURE_SPEC.md`

# 文件定位
Spring Boot 主后端与 Python 辅助服务的工程架构规范。

# 适用范围
适用于基于 Java Spring Boot、Maven、MyBatis-Plus、MySQL、Redis 的业务后端，以及配套 Python 辅助服务。

# 与其他文件的关系
本文件依赖 `05_API_DESIGN_SPEC.md`、`06_DATABASE_DESIGN_SPEC.md`、`16_SECURITY_SPEC.md`，并为 `13_DEPLOYMENT_AND_DEVOPS_SPEC.md` 提供服务结构基础。

# 编写目的
统一 Spring Boot 主后端与 Python 辅助服务的职责边界、分层方式和工程治理规则，避免实现失控与角色错位。

## 1. 架构立场
1. 单体优先，模块清晰。
2. 在单体内先解决分层与边界，再决定是否拆服务。
3. 业务主链路放在 Java Spring Boot。
4. Python 只承载辅助能力，不替代默认主业务后端。

## 2. 推荐目录结构
```text
src/main/java/com/company/project/
  common/
    config/
    constant/
    exception/
    result/
    util/
    security/
    audit/
  module/
    user/
      controller/
      service/
      service/impl/
      mapper/
      entity/
      dto/
      vo/
      convert/
      enums/
    order/
    system/
```

## 3. 分层职责边界
1. `controller`：接收请求、参数绑定、调用 service、返回统一响应，不写核心业务。
2. `service`：定义业务用例接口。
3. `service/impl`：实现业务编排、事务、权限前置检查、调用 mapper 与外部服务。
4. `mapper`：数据库访问层，负责 SQL 语义，不承载复杂业务规则。
5. `entity`：数据库实体映射。
6. `dto`：入参对象，强调校验与接口边界。
7. `vo`：出参对象，强调前端展示语义。
8. `convert`：对象转换层，统一 Entity、DTO、VO、BO 之间映射。
9. `config`：框架配置、跨模块基础设施配置。
10. `security`：认证鉴权、上下文、权限扩展点。
11. `exception`：异常体系与统一处理。

## 4. 统一响应结构
推荐结构：
```json
{
  "code": "0",
  "message": "success",
  "data": {},
  "traceId": "9f3f2c...",
  "timestamp": "2026-03-12T10:00:00Z"
}
```

规则：
1. `code` 由统一错误码体系管理。
2. `message` 面向调用方可读。
3. `data` 为业务载荷。
4. `traceId` 用于排障追踪。
5. `timestamp` 用于日志与客户端校时。

## 5. 统一异常处理
1. 业务异常、参数异常、权限异常、系统异常分层处理。
2. Controller 不得直接返回裸异常堆栈。
3. 全局异常处理器统一转换错误码与日志。
4. 对用户可见错误只返回必要信息，不暴露内部实现细节。

## 6. 参数校验规范
1. DTO 必须使用 `javax.validation` 或 Jakarta Validation 注解。
2. Controller 层必须开启校验。
3. 复杂跨字段校验可在 service 层补充。
4. 禁止使用 `Map<String, Object>` 作为复杂业务入参。

## 7. 日志与审计规范
1. 使用统一日志框架，区分业务日志、错误日志、审计日志。
2. 核心操作记录操作人、时间、对象、动作、结果。
3. 禁止输出密码、完整 Token、身份证号、银行卡号等敏感信息。
4. 每次请求需带 `traceId`，跨服务调用需传递。

## 8. 配置管理规范
1. 配置按环境分离。
2. 敏感配置通过环境变量或密钥管理注入。
3. 禁止将生产密钥写入仓库。
4. 配置项命名与用途要稳定，禁止随意漂移。

## 9. 枚举与常量规范
1. 状态、类型、开关、来源等字段优先使用枚举。
2. 常量只保存稳定、跨模块复用的值。
3. 禁止滥用常量类存放业务规则。

## 10. 事务规范
1. 事务边界放在 service 层。
2. 一个事务只覆盖一个明确业务用例。
3. 查询方法默认只读。
4. 外部调用与长耗时任务尽量移出主事务。

## 11. 批处理与异步任务规范
1. 大批量导入导出、报表生成、通知分发优先异步化。
2. 任务需记录状态、开始时间、结束时间、执行结果、失败原因。
3. 重试策略必须显式配置，禁止无上限重试。

## 12. Python 辅助服务边界
适用场景：
1. AI 推理或模型调用。
2. 数据清洗、脚本任务、ETL、异步分析。
3. 文件解析、OCR、算法计算。

不适用场景：
1. 默认主业务 CRUD。
2. 权限主链路。
3. 需要与组织级 Java 基础设施深度一致的核心领域模块。

## 13. Java 与 Python 协作边界
1. Java 负责业务编排、鉴权、审计、主数据落库。
2. Python 负责辅助计算与结果返回。
3. 交互方式优先 HTTP REST 或消息队列，避免共享数据库强耦合。
4. Python 输出必须定义稳定 DTO 契约。

## 14. 明确禁止事项
1. Controller 直接操作 Mapper。
2. Entity 直接作为对外 API 出参。
3. 跨模块随意互调内部实现。
4. 在 ServiceImpl 中堆叠超长方法且无拆分。
5. 用 Python 偷换主后端职责。

## 15. 后端模块示例
```text
module/order/
  controller/OrderController.java
  service/OrderService.java
  service/impl/OrderServiceImpl.java
  mapper/OrderMapper.java
  entity/OrderEntity.java
  dto/OrderCreateDTO.java
  dto/OrderQueryDTO.java
  vo/OrderDetailVO.java
  convert/OrderConvert.java
  enums/OrderStatusEnum.java
```

## 本文件使用建议
后端新建项目、拆分模块、重构分层、引入 Python 服务时应以本文件作为架构判断基准。

## AI 调用建议
AI 在生成 Controller、Service、Mapper、DTO、VO、配置类、异常类前，必须先按本文件划定分层职责与 Java/Python 边界。

## 后续可扩展点
可增加消息队列规范、定时任务规范、租户隔离规范、领域事件规范。
