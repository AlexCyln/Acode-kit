# Vue + Vite Web Blueprint

## 适用场景

1. Vue 3 Web 应用
2. Vite 构建链路
3. Composition API 主导的单页或中型前端项目

## 典型技术选型

- Runtime: `Vue 3`
- Build: `Vite`
- State: `Pinia` 按需
- Styling: `Tailwind CSS` / `SCSS`
- Test: `Vitest` + `Vue Test Utils`

## 推荐目录结构

```text
project-root/
  AGENTS.md
  README.md
  package.json
  vite.config.ts
  tsconfig.json
  public/
    assets/
      images/
      videos/
      audio/
  src/
    app/
      App.vue
      router/
    components/
      ui/
      sections/
      motion/
    features/
    composables/
    stores/
    services/
    styles/
    test/
    main.ts
  docs/
    project/
    dev/
    archive/
  scripts/
  tests/
```

## 目录说明

1. `src/composables/` 承载可复用组合逻辑。
2. `src/stores/` 仅在确定需要状态管理时启用。
3. `src/services/` 放 API 与外部调用封装。
4. `src/components/motion/` 保留动效组件，不与业务 section 混放。

## Step 4 初始化要求

1. 若项目为单页演示，保留 `src/app/` 作为入口装配层。
2. 资产统一进入 `public/assets/`。
3. 启动冻结稿归位后，再建立 `router/`、`composables/`、`stores/` 等按需目录。

## 不推荐

1. `views/`、`components/`、`utils/` 无边界混放
2. 未声明状态管理却预建复杂 `store` 树
3. 资源文件直接塞进组件目录
