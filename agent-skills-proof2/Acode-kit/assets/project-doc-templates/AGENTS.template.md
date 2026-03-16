# AGENTS.md

本仓库内的所有需求分析、设计、开发、Review、测试、Debug、部署相关任务，默认使用 `Acode-kit` skill 工作流。

## 固定要求
1. 严格遵守项目内 `docs/project/` 文档与全局母规范。
2. 不得擅自更换固定技术栈。
3. 任何任务都先判断当前项目阶段，再读取最小必要规范。
4. 未完成项目级文档初始化前，不得直接大规模编码。
5. 每次任务结束必须更新以下文档中受影响的部分：
   - `docs/project/DECISION_LOG.md`
   - `docs/project/TRACEABILITY_MATRIX.md`
   - `docs/project/SESSION_HANDOFF.md`
6. 涉及上线时，必须同步更新：
   - `docs/project/GO_LIVE_RECORD.md`

## 项目推进顺序
1. 项目初始化
2. 需求结构化
3. 页面与交互结构化
4. 数据与 API 设计
5. 项目框架初始化
6. 按小闭环实现
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

## 默认行为
如果用户只给出项目需求或某个具体开发任务，仍按上述流程与文档体系执行；除非用户明确要求偏离当前阶段或覆盖当前规范。
