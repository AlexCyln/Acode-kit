# React + Vite SPA Blueprint

## 适用场景

1. 单页面 Web 应用
2. 纯前端 Demo / Showcase
3. React + Vite + TypeScript 主栈

## 典型技术选型

- Runtime: `React`
- Build: `Vite`
- Package manager: `npm` / `pnpm`
- Styling: `Tailwind CSS` 或 `CSS Modules`
- Test: `Vitest` + `React Testing Library`

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
      App.tsx
      routes/
    components/
      ui/
      sections/
      motion/
    features/
    lib/
    hooks/
    styles/
    test/
    main.tsx
  docs/
    project/
    dev/
    archive/
  scripts/
  tests/
```

## 目录说明

1. `public/assets/` 放静态可直链资源。
2. `src/components/sections/` 用于页面区块。
3. `src/components/ui/` 用于可复用基础 UI。
4. `src/components/motion/` 用于动效包装器与通用交互组件。
5. `src/features/` 用于按业务域组织状态、逻辑和局部页面组合。
6. `src/test/` 放测试基建和共享 mock。

## Step 4 初始化要求

1. 建立 `docs/project/` 与 `docs/dev/` 治理目录。
2. 将 `.acode-kit-startup/` 中冻结稿归位到 `docs/project/`。
3. 如果项目仅一个前端应用，不再额外包一层 `frontend/`。

## 不推荐

1. 根目录直接堆放 `App.tsx`、`main.tsx`
2. 静态资源散落在 `src/` 各级目录
3. 用 `components/common/`、`components/misc/` 代替明确分层
