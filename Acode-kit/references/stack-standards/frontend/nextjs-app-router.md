# 文件定位
Next.js App Router 前端实现规范包。

## 适用范围
- Web 应用
- 内容展示与运营后台混合型项目
- 需要 SSR、RSC、路由分段与服务端数据获取能力的 Next.js 项目

## 典型技术组合位置
- Next.js App Router 负责页面路由、布局和服务端渲染
- 可与 Tailwind、shadcn/ui、Sentry、Vercel 等协同
- 适用于营销站、会员中心、后台控制台、内容平台

## 推荐目录结构
- `app/` 作为路由、layout、loading、error 和 route handlers 入口
- `components/` 放共享 UI 与页面组合组件
- `features/` 按业务模块拆分页面组合与交互逻辑
- `lib/` 放 schema、api client、鉴权、工具、埋点辅助
- `public/` 放静态资源，避免散落到业务目录

## 分层与职责边界
- 默认优先使用 Server Components 承载读取型页面和布局
- 只有交互、浏览器 API、动画、表单状态等场景才下沉到 Client Components
- route handlers、server actions、前端 API client 的职责边界必须显式
- 不允许把页面编排、数据拉取、复杂交互和样式杂糅在单个超大组件中

## 编码复杂度与可维护性要求
- layout、template、page、loading、error、not-found 职责要清晰
- Client Components 保持叶子化，不把整页都降为 client
- 缓存、重验证、数据抓取策略要项目级一致
- 动态路由、分组路由、平行路由只有在信息架构明确时才使用

## 测试策略与质量门禁
- 关键页面用 Vitest / RTL 做组件与交互测试
- 关键路由和首屏链路要有 Playwright 冒烟
- loading、error、empty、unauthorized 等页面状态必须覆盖
- Server / Client 边界变更后要有回归验证

## 数据与 Migration 协同要求
- 页面依赖的数据 contract、状态字典和 schema 变更要同步进入页面与测试
- 不允许继续依赖旧字段或旧缓存语义“凑合可用”

## API / 安全 / 权限协同要求
- 鉴权、租户上下文、token 刷新和服务端读取边界必须统一
- 敏感数据优先在服务端处理后再下发
- 前端展示限制不能替代服务端最终鉴权

## 日志与可观测性协同要求
- 页面错误、route handler 错误和核心链路失败要可追踪
- 关键页面应能关联版本、用户、租户和路由上下文

## 多租户适配要求
- 多租户项目必须明确租户上下文来源、切换方式和缓存边界
- 不允许在浏览器端伪造租户上下文绕过服务端边界

## 文档要求
- 模块文档说明路由结构、layout 继承关系、数据获取方式和 client 边界
- 测试文档记录关键页面状态和服务端 / 客户端分层约束

## 常见误用
- 整个页面默认 `use client`
- 在组件树深处散落 fetch 和权限逻辑
- 混用 route handlers、server actions、浏览器直连 API 且无统一约束

## 禁止事项
- 在信息架构未稳定时滥用复杂路由能力
- 在未声明缓存与重验证策略前堆叠大量服务端数据读取

## 追加增强：Next.js App Router 细则

### 路由与布局细则
- 公共布局、模块布局、特殊页面布局要显式分层
- loading、error、not-found 页面要作为正式页面资产维护

### 服务端 / 客户端边界细则
- 服务端读取优先，交互态叶子组件化
- 浏览器副作用、动画、拖拽、表单即时交互集中在 client 叶子组件

### Review 附加清单
- 是否存在整页 client 化
- 是否存在 layout 与 page 职责混乱
- 是否存在缓存策略和权限读取策略不一致
