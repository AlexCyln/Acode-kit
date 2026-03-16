# 文件名
`13_DEPLOYMENT_AND_DEVOPS_SPEC.md`

# 文件定位
Docker 化交付、环境部署、发布回滚与运维交接规范。

# 适用范围
适用于前端、Java 后端、Python 辅助服务、MySQL、Redis 的容器化部署与运维协作场景。

# 与其他文件的关系
本文件依赖 `18_ENVIRONMENT_CONFIG_SPEC.md` 与 `14_CICD_SPEC.md`，并为 `17_OBSERVABILITY_SPEC.md` 提供部署基础。

# 编写目的
统一 Docker 化交付、环境部署、发布回滚与运维交接方式，确保不同项目都能按同一工程标准稳定上线。

## 1. 部署总原则
1. 所有服务默认容器化。
2. 环境隔离必须通过配置与编排实现，不通过改代码实现。
3. 发布必须可回滚、可观测、可审计。
4. 镜像应稳定、可复现、最小化。

## 2. Dockerfile 编写规范
1. 优先使用明确版本的基础镜像。
2. 尽量采用多阶段构建减小镜像体积。
3. 将依赖安装与源码复制分层，提升缓存命中。
4. 不将密钥、证书、生产配置打入镜像。
5. 容器启动命令应单一、可观测、可健康检查。

前端示例骨架：
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK CMD wget -qO- http://127.0.0.1/health || exit 1
```

Java 示例骨架：
```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/app.jar app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

## 3. docker compose 组织规范
1. 使用单一 `docker-compose.yml` 或按环境拆分 `docker-compose.dev.yml`、`docker-compose.prod.yml`。
2. 服务命名统一、网络清晰、卷挂载明确。
3. 将环境变量从 `.env` 或外部配置注入。

示例骨架：
```yaml
services:
  web:
    image: registry.example.com/saas-web:${APP_VERSION}
    ports:
      - "8080:80"
    env_file:
      - .env
    depends_on:
      - backend

  backend:
    image: registry.example.com/saas-backend:${APP_VERSION}
    env_file:
      - .env
    depends_on:
      - mysql
      - redis

  python-worker:
    image: registry.example.com/saas-python:${APP_VERSION}
    env_file:
      - .env

  mysql:
    image: mysql:8.4
    volumes:
      - ./volumes/mysql:/var/lib/mysql

  redis:
    image: redis:7-alpine
    volumes:
      - ./volumes/redis:/data
```

## 4. 环境变量规范
1. 变量名使用 `UPPER_SNAKE_CASE`。
2. 前端暴露变量必须有统一前缀，如 `VITE_`。
3. Java、Python、容器编排统一引用同名环境变量，减少漂移。
4. 所有环境变量需有说明、默认值策略、敏感级别。

## 5. 密钥与敏感配置规范
1. 密钥只通过环境变量、Secret 管理系统或部署平台注入。
2. 数据库密码、JWT 密钥、第三方 Access Key 严禁入库。
3. 敏感配置变更需记录审批与生效时间。

## 6. 日志目录与挂载规范
1. 应用日志与访问日志分目录。
2. 容器日志优先输出到标准输出，必要时结合文件挂载。
3. 日志目录需具备滚动策略与容量控制。

## 7. 健康检查规范
1. 前端提供静态服务健康探针。
2. 后端提供 `/health` 或兼容 Actuator 的健康检查接口。
3. 健康检查应覆盖应用进程、数据库连通、Redis 连通等核心依赖。

## 8. 发布策略
1. 发布前确认镜像版本、配置版本、数据库变更版本一致。
2. 先执行数据库变更，再发布应用或按项目级顺序定义。
3. 发布窗口、发布负责人、回滚负责人需明确。
4. 发布后执行健康检查与关键链路验收。

## 8.1 单人发布 Runbook
推荐最小发布顺序：
1. 确认当前 Tag、镜像版本、数据库脚本版本。
2. 备份关键配置与数据库。
3. 执行数据库迁移。
4. 发布后端服务。
5. 发布 Python 辅助服务。
6. 发布前端静态资源。
7. 执行健康检查。
8. 执行最小冒烟路径。
9. 记录发布时间、版本号、异常情况。

## 9. 回滚策略
1. 镜像回滚需支持切换到上一个稳定 Tag。
2. 配置回滚需保留前一版本快照。
3. 数据库变更必须提前评估是否可逆，不可逆变更需有备份与灰度策略。

## 9.1 回滚触发条件
出现以下情况应立即准备回滚：
1. 核心主路径不可用。
2. 登录、权限、核心接口大面积异常。
3. 数据写入错误且风险持续扩大。
4. 第三方回调或支付类关键流程异常。
5. 发布后 15 分钟内错误率明显异常上升。

## 10. 重启策略
1. 非紧急问题优先定位根因，不以重启代替修复。
2. 容器重启策略按服务属性配置，如 `unless-stopped`。
3. 重启后需验证缓存、连接池、任务状态是否恢复。

## 10.1 发布后 30 分钟观察项
1. 应用健康检查是否持续通过。
2. 核心接口错误率是否上升。
3. 数据库连接、慢查询是否异常。
4. Redis 命中率、会话、锁是否异常。
5. 日志中是否出现连续异常堆栈。
6. 第三方回调、异步任务是否正常消费。

## 11. 环境区分
1. `dev`：本地开发，允许便捷配置。
2. `test`：联调测试，数据可重置。
3. `staging`：预发布，尽量贴近生产。
4. `prod`：生产环境，严格控制变更。

## 12. 备份建议
1. MySQL 定期备份并验证可恢复性。
2. Redis 若承载重要会话或任务状态，应根据场景配置持久化或外部恢复策略。
3. 发布前对关键数据做快照或逻辑备份。

## 13. 运维交接要求
1. 系统拓扑图。
2. 环境变量清单。
3. 服务依赖清单。
4. 发布与回滚 SOP。
5. 监控告警面板入口。
6. 联系人和值班机制。

## 本文件使用建议
部署脚本编写、容器镜像制作、发布流程设计时应以本文件为基础，形成统一的运维交接资料。

## AI 调用建议
AI 在生成 Dockerfile、compose 文件、部署说明、回滚清单时，必须遵循本文件的镜像、配置、日志、健康检查与环境隔离规则。

## 后续可扩展点
可增加 Kubernetes 规范、蓝绿发布规范、灰度发布规范、备份恢复演练模板。
