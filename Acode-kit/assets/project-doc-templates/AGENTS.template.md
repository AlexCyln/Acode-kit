# AGENTS.md

本仓库内的所有需求分析、设计、开发、Review、测试、Debug、部署相关任务，默认使用 `Acode-kit` skill 工作流。

## 固定要求
1. 严格遵守项目内 `docs/project/` 文档与全局母规范。
2. 不得擅自更换已声明技术栈（见 `docs/project/PROJECT_OVERRIDES.md`）。
3. 任何任务都先判断当前项目阶段，再读取最小必要规范。
4. 未完成项目级文档初始化前，不得直接大规模编码。
5. 遵循 TDD 方法论：每个实现闭环必须先编写失败测试，再实现，再重构。
6. 每次任务结束必须更新以下文档中受影响的部分：
   - `docs/project/DECISION_LOG.md`
   - `docs/project/TRACEABILITY_MATRIX.md`
   - `docs/project/SESSION_HANDOFF.md`
7. 涉及上线时，必须同步更新：
   - `docs/project/GO_LIVE_RECORD.md`
8. PRD 确认后必须执行 `Gate 3.5`，先完成 LMS 档位分析与用户确认，再进入 Step 4。
9. 模块迭代必须遵循 `5a -> 5b -> 5c -> 5d -> 5e`；其中 Step 5b 的页面设计必须按页面或页面组分批审阅，用户未明确批准前不得进入 5d。
10. 若项目声明 `shadcn/ui`，则前端实现必须优先使用 shadcn 标准组件；shadcn MCP 缺失只代表辅助能力降级，不代表可改用自定义基础组件。
11. 已批准页面、API、数据结构和模块说明一旦修订，旧版本立即失效，必须回到同阶段重新提审并更新回滚点。
12. NotebookLM / Pencil / shadcn / Chrome DevTools 在命中的节点必须作为强制消费型 MCP 使用；缺失时只能按规范降级，不得跳过节点要求。
13. 开工前先确认 `docs/project/PROJECT_OVERRIDES.md`、`docs/dev/DEVELOPMENT_DOCUMENTATION_INDEX.md` 与 `docs/project/PROJECT_ACCESS_INFO.md` 已写入项目级设计、编码、测试、开发文档入口与访问信息要求；若仍为空壳，先补文档再实施。`PROJECT_ACCESS_INFO.md` 必须在项目开始时创建，并随调试、验证、联调和上线持续更新，不得留到最终交付才补。

## 第三方工具管理
参见 `references/global-engineering-standards/31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md` 管理项目所需的 MCP 工具。

## 项目推进顺序
1. 项目初始化
2. 需求结构化
3. 页面与交互结构化
4. 数据与 API 设计
5. 项目框架初始化
6. TDD 驱动按小闭环实现
7. Review / 测试 / Debug
8. 部署 / 上线

## 默认项目文档位置
- `docs/project/PROJECT_OVERVIEW.md`
- `docs/project/PROJECT_OVERRIDES.md`
- `docs/project/PRD.md`
- `docs/project/DECISION_LOG.md`
- `docs/project/TRACEABILITY_MATRIX.md`
- `docs/project/SESSION_HANDOFF.md`
- `docs/project/GO_LIVE_RECORD.md`
- `docs/project/PROJECT_ACCESS_INFO.md`
- `docs/dev/DEVELOPMENT_DOCUMENTATION_INDEX.md`

## 默认行为
如果用户只给出项目需求或某个具体开发任务，仍按上述流程与文档体系执行；除非用户明确要求偏离当前阶段或覆盖当前规范。
