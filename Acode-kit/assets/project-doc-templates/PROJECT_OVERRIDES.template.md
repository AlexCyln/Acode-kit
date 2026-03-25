# 项目级覆盖说明

## 技术栈声明

> 激活后的规范包清单请同步记录在 `ACTIVE_STANDARDS.md`。本文件记录项目级特殊约束与覆盖，不替代激活矩阵。

在项目初始化时填写以下技术栈声明。一旦确定，全项目生命周期内视为"已声明技术栈"，不得擅自变更。

### Frontend（前端）
- **项目类型**：<!-- Web 应用 / iOS 应用 / Android 应用 / 小程序 / 桌面应用 / 跨平台移动应用 -->
- **前端框架**：<!-- React / Vue / Angular / SwiftUI / Jetpack Compose / Flutter / UniApp 等 -->
- **UI 组件库**：<!-- shadcn/ui / Element Plus / Ant Design / Material UI / 自定义组件库 等 -->
- **构建工具**：<!-- Vite / Webpack / Xcode / Gradle / 等 -->
- **状态管理**：<!-- Pinia / Redux / Zustand / MobX / Provider / 等 -->

### Backend（后端）
- **后端运行时**：<!-- Spring Boot / Express / Koa / Django / FastAPI / Go Gin / .NET / 等 -->
- **辅助服务**：<!-- Python 数据处理 / Node.js 脚本 / 无 / 等 -->
- **API 风格**：<!-- RESTful / GraphQL / gRPC / 等 -->
- **ORM/数据访问**：<!-- MyBatis-Plus / Prisma / SQLAlchemy / GORM / TypeORM / 等 -->

### Data & Middleware（数据与中间件）
- **数据库**：<!-- MySQL / PostgreSQL / MongoDB / SQLite / Supabase / 等 -->
- **缓存**：<!-- Redis / Memcached / 内存缓存 / 无 / 等 -->
- **认证方案**：<!-- JWT / OAuth 2.0 / Session / 第三方认证服务 / 等 -->

### Deployment（部署）
- **部署平台**：<!-- Docker/Compose / Kubernetes / Vercel / 云函数 / App Store / Google Play / 等 -->
- **设计工具**：<!-- Pencil / Figma / Sketch / 等 -->
- **MCP 使用约束**：<!-- NotebookLM / Pencil / shadcn / Chrome DevTools 的强制消费节点 -->

## 激活规范关联

- **项目场景类型**：<!-- 例如：bs-admin-console / bs-saas-workflow / official-brand-site -->
- **已激活场景规范包**：<!-- 见 ACTIVE_STANDARDS.md -->
- **已激活技术栈规范包**：<!-- 见 ACTIVE_STANDARDS.md -->
- **当前主导规范入口**：<!-- ACTIVE_STANDARDS.md -->

## 项目级执行约束

### 设计实现要求
- **页面设计基准**：<!-- Stage 2 结构稿 + Step 5b 页面细稿 / 其他 -->
- **UI 还原要求**：<!-- 例如：前端必须一比一还原经批准的 Pencil 页面；不得私自增删字段/按钮/状态 -->
- **shadcn 使用要求**：<!-- 例如：声明使用 shadcn/ui；优先复用 Button/Card/Dialog/Input/Table 等标准组件 -->

### 编码要求
- **代码风格入口**：<!-- 例如：08_CODE_STYLE_AND_NAMING_SPEC.md + 项目额外约束 -->
- **架构限制**：<!-- 例如：目录分层、状态管理边界、接口层封装要求 -->
- **禁止事项**：<!-- 例如：禁止越权扩 scope、禁止未审阅设计直接实现 -->

### 测试要求
- **测试策略**：<!-- 例如：TDD / 关键路径集成测试 / UI smoke / API contract -->
- **最低验收门槛**：<!-- 例如：模块功能自测通过 + 文档同步 + 关键流程 smoke -->
- **版本锁要求**：<!-- 已批准页面/API/数据结构/模块说明修订后必须回到同阶段重新提审 -->

### 开发文档入口要求
- **API 文档入口**：<!-- docs/dev/apis/... -->
- **数据库文档入口**：<!-- docs/dev/database/... -->
- **功能/模块文档入口**：<!-- docs/dev/modules/... -->
- **测试文档入口**：<!-- docs/dev/testing/... -->
- **项目访问信息入口**：<!-- docs/project/PROJECT_ACCESS_INFO.md -->
- **强制说明**：当项目存在前后端地址、测试账号、管理员账号、默认密码、token 或第三方系统登录信息时，必须创建并维护 `PROJECT_ACCESS_INFO.md`，不得散落记录于其他文档。

---

## 覆盖原则
- 仅允许对母规范做显式补充或覆盖
- 每条覆盖必须说明原因、范围、审批人、影响

## 覆盖项
### OVR-001
- 覆盖文档：
- 覆盖内容：
- 覆盖原因：
- 影响范围：
- 审批状态：
