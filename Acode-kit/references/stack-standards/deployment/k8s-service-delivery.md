# 文件定位
Kubernetes 服务交付规范包。

## 适用范围
- Kubernetes 为主的服务交付项目
- 多服务、多环境、需要配置分层和发布批次治理的企业级系统

## 典型技术组合位置
- 应用服务、任务服务、网关或后台任务通过 Kubernetes 交付
- 配合镜像仓库、CI/CD、Secret 管理、监控告警协同

## 推荐目录结构
- `deploy/k8s/base/` 放基础 manifests
- `deploy/k8s/overlays/` 放环境级差异
- `deploy/k8s/job/` 放 migration、回填、后台任务等一次性或周期性作业
- 发布说明、回滚说明和环境参数边界要有固定落点

## 分层与职责边界
- 应用负责业务逻辑
- K8s 编排负责实例、副本、配置、服务发现、滚动发布和回滚
- 环境差异通过 overlay 或等价机制管理，不混入业务代码

## 编码复杂度与可维护性要求
- base 与 overlay 边界清晰
- deployment、service、ingress、job、config、secret 职责清楚
- 不把多环境差异全部写死在单个大文件中

## 测试策略与质量门禁
- 发布前至少完成 manifests 校验、镜像可用性验证、配置校验和最小 smoke
- 高风险变更应先经过测试或预发环境
- 回滚前后要有健康检查和关键链路验证

## 数据与 Migration 协同要求
- migration、job、应用发布顺序必须显式
- schema 变更、回填和回滚路径必须可审计、可说明

## API / 安全 / 权限协同要求
- Secret、Token、密钥通过正式 Secret 管理，不入仓库
- 发布权限、命名空间权限和回滚权限要清晰

## 日志与可观测性协同要求
- 发布后要能看见版本、pod、namespace、错误率和关键业务指标
- job 执行、回滚和失败重试要可定位

## 多租户适配要求
- 多租户服务发布时要核对租户相关配置、隔离参数和连接边界
- 不允许因 overlay 错误导致跨租户配置污染

## 文档要求
- 记录 base / overlay 策略、环境配置来源、发布顺序、回滚路径和验证清单

## 常见误用
- base 与环境差异混在一起
- migration 依赖人工补执行
- 回滚只回 deployment 不回配置或 job 状态

## 禁止事项
- 在无回滚方案、无配置追踪、无观测确认的情况下发布高风险变更
- 直接修改线上集群配置而不回写仓库与文档

## 追加增强：K8s 交付细则

### 环境分层细则
- base 保持可复用，overlay 只承载环境差异
- Secret、ConfigMap、Ingress、Autoscaling 策略要显式归类

### 发布与回滚细则
- 发布批次、观察期、回滚负责人和验证点要明确
- Job / Migration 回滚条件需要单独说明

### Review 附加清单
- 是否明确 base 与 overlay 边界
- 是否记录 job / migration / deployment 顺序
- 是否能从观测中快速定位版本和失败实例
