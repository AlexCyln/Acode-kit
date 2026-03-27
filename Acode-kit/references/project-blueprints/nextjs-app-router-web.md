# Next.js App Router Web Blueprint

## 适用场景

1. Next.js Web 应用
2. 需要 `App Router`、Server Components、局部交互岛
3. SSR / SSG / ISR 混合场景

## 典型技术选型

- Runtime: `Next.js`
- Routing: `app/`
- Styling: `Tailwind CSS`
- Test: `Vitest` / `Jest` + `Playwright`

## 推荐目录结构

```text
project-root/
  AGENTS.md
  README.md
  package.json
  next.config.ts
  tsconfig.json
  public/
    assets/
      images/
      videos/
      audio/
  app/
    layout.tsx
    page.tsx
    (marketing)/
    api/
  src/
    components/
      ui/
      sections/
      motion/
    features/
    lib/
    hooks/
    styles/
    server/
    test/
  docs/
    project/
    dev/
    archive/
  scripts/
  tests/
```

## 目录说明

1. `app/` 保留路由与页面入口，不把大量业务逻辑直接堆进去。
2. `src/server/` 仅放服务端辅助逻辑，不与客户端组件混写。
3. `src/components/motion/` 仅承载已批准的客户端动效叶子组件。
4. `public/assets/` 作为本地静态资源统一入口。

## Step 4 初始化要求

1. 明确 Server / Client 边界后再建目录。
2. `page.tsx`、`layout.tsx` 只保留页面装配职责。
3. `.acode-kit-startup/` 冻结稿先归位，再初始化 `app/` 与 `src/`。

## 不推荐

1. 把所有组件都塞进 `app/`
2. 在 `src/components/` 中混放服务端工具
3. 用 `pages/` 风格目录和 `app/` 混用
