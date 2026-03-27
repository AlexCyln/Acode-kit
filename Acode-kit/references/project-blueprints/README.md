# Project Blueprints

目录蓝图用于在 `Step 4` 初始化项目结构时，作为目录片段不足时的 fallback 专业参考。

## 使用规则

1. 先根据已批准项目类型匹配蓝图类别，例如单页面营销站、常规 Web App、前后端分离项目。
2. 再根据运行时、构建工具、部署入口选择最贴合的技术蓝图。
3. 只有当 active scenario / stack directory fragments 仍不足以给出专业目录结构时，才允许参考蓝图。
4. 目录蓝图是 fallback 参考，不得覆盖已激活技术栈片段；治理目录仍需满足 `docs/project/`、`docs/dev/`、`AGENTS.md` 等母规范要求。

## 当前蓝图清单

1. `react-vite-spa.md`
2. `nextjs-app-router-web.md`
3. `vue-vite-web.md`
4. `astro-landing-page.md`

## 选型优先级

1. active fragments 是否足够
2. 技术选型匹配度
3. 部署入口匹配度
4. 资源组织方式匹配度
5. 测试与构建链路匹配度

## 禁止做法

1. active fragments 已足够，却仍跳过它们直接套用 fallback 蓝图
2. 已选 `Next.js App Router` 却沿用 `Vite SPA` 蓝图
3. 已选 `Astro` 营销站却沿用通用 `frontend/` 目录套壳
4. 只创建源码目录，不同步创建治理目录和文档入口
