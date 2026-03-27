# Astro Landing Page Blueprint

## 适用场景

1. 高视觉要求的营销站、品牌站、落地页
2. `Astro` 为主，局部使用 React/Vue/Svelte 交互岛
3. 以内容分发和性能为优先

## 典型技术选型

- Runtime: `Astro`
- Styling: `Tailwind CSS` / scoped CSS
- Islands: React / Vue / Svelte 按需
- Test: `Playwright` + 轻量单元测试

## 推荐目录结构

```text
project-root/
  AGENTS.md
  README.md
  package.json
  astro.config.mjs
  tsconfig.json
  public/
    assets/
      images/
      videos/
      audio/
  src/
    pages/
    layouts/
    components/
      ui/
      sections/
      motion/
    islands/
    content/
    styles/
    lib/
  docs/
    project/
    dev/
    archive/
  scripts/
  tests/
```

## 目录说明

1. `src/pages/` 放页面入口。
2. `src/layouts/` 放布局壳。
3. `src/islands/` 专门承载客户端交互岛。
4. `src/components/sections/` 用于 Hero、Feature、CTA 等页面区块。
5. `public/assets/` 为所有真实媒体资源统一出口。

## Step 4 初始化要求

1. 若已批准为营销站，不应创建与后端应用同规格的无关目录。
2. 根据内容驱动特征决定是否启用 `src/content/`。
3. 启动冻结稿归位后，再按页面区块拆分 `sections/` 与 `islands/`。

## 不推荐

1. 把所有交互组件直接塞进 `pages/`
2. 用 React SPA 目录结构生搬到 Astro 项目
3. 未经批准即创建冗余 `backend/`、`sql/` 目录
