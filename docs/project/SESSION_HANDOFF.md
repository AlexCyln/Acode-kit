# SESSION HANDOFF

## Current Position

- Phase: 架构治理与扩展治理
- Stage: 启动规则、目录整合规则与技术栈片段加固
- Module: 工作流治理
- Step: 非模块迭代
- Slice: N/A
- Next Action: 后续若新增技术栈包，需按“directory fragment + Step 3 输入冻结 + Step 4 DIRECTORY_PLAN 合成”统一接入
- Progress: 100%
- Implementation Info: 已完成 Step 4 文档归位规则、LMS 不降节点规则、扩展调用摘要规则、Step 3 技术栈与目录输入冻结、Step 4 目录计划合成与技术栈目录片段接入，并已推送目录整合规则到 GitHub
- Change Branch: 无
- Rollback Point: 引入 directory fragments 与 Step 3/4 目录整合前的 workflow / reference 基线
- LMS Tier: M
- Frozen Version: v2.1
- Revision State: 已冻结

## 当前对象

- 项目：`Acode-kit`
- 当前目标：稳定 `Acode-kit` 作为 Codex 中唯一公开 skill 入口，并保证安装、扩展、激活链路可用
- 当前版本：`v2.1`

## 本轮已完成

1. 安装器默认改为注册到 Codex skill 目录：`~/.codex/skills/Acode-kit`
2. 移除安装链中的 Claude 安装分支，仅保留 `codex` / `local`
3. 安装过程增加步骤与进度输出
4. Windows / macOS PATH 与安装细节修复
5. `acode-kit -status / -add / -scan / -remove / -enable / -disable` CLI 已接通
6. 扩展安全扫描已支持：
   - 恶意 prompt / 数据外传风险检查
   - workflow / 主架构兼容检查
7. 外部扩展直接扫描 `manifest.json` 的边界判断已修复
8. `-enable / -disable` 改为项目级增量更新，并在写入前自动生成 `.bak` 备份
9. 顶层 `Acode-kit/SKILL.md` 已强化：
   - 明确 Acode-kit 的入口优先级
   - 检测到 Acode-kit 项目痕迹时必须接管
   - 禁止 startup 阶段走 `acode-run`
10. 公开 skill 入口已收敛：
   - 现在只保留 `Acode-kit/SKILL.md`
   - `extensions/router/SKILL.md` 改为 `extensions/router/ROUTER_RUNTIME.md`
   - `extensions/packs/security-review-pack/SKILL.md` 改为 `extensions/packs/security-review-pack/PACK_RUNTIME.md`
11. 顶层 `SKILL.md` YAML frontmatter 已修复，避免 Codex 报 `invalid YAML`
12. 启动期文档固化规则增强：
   - `Step 2` / `Step 3` 产物必须先落到 `.acode-kit-startup/`
   - `Step 4` 只负责归位、建索引、补元信息，不再重写弱化版 `overview/prd`
13. `Step 3` 新增技术栈与目录输入冻结要求：
   - 必须先形成 `.acode-kit-startup/STACK_AND_DIRECTORY_INPUTS.approved.md`
   - 覆盖需求、设计、前端、后端、数据库、数据访问、部署、工具和目录约束
14. `Step 4` 新增目录计划合成要求：
   - 必须先输出 `docs/project/DIRECTORY_PLAN.md`
   - 再创建目录、初始化依赖、归位启动文件
15. 目录来源优先级已明确：
   - 母规范固定治理目录优先
   - active stack package 的目录片段主导技术骨架
   - active scenario package 只做业务形态增强
   - `project-blueprints/` 仅作为 fallback 参考，不再作为主输入
16. 已为首批高频包补充结构化目录片段：
   - `frontend/react-shadcn`
   - `backend/spring-boot`
   - `data-access/mybatis-plus`
   - `deployment/containerized-service-delivery`
   - `scenario/bs-admin-console`
   - `scenario/bs-commerce-transaction`

## 关键提交

- `0ea5e12` `fix: default installer to codex skill registration`
- `37c450a` `fix: expose only one public skill entry`
- `088594a` `fix: quote acode-kit skill description yaml`
- `de7414e` `fix: back up project docs before extension state updates`
- `9614ddc` `feat: add stack-driven directory synthesis workflow`

## 当前本机结论

1. `~/.codex/skills/Acode-kit/SKILL.md` 存在，Acode-kit 主 skill 已安装
2. `~/.codex/skills/Acode-kit/extensions/router/SKILL.md` 已不存在，这是预期结果
3. 如果 VS Code / Codex UI 仍未正确显示 Acode-kit，多半是会话或技能缓存未刷新，不是文件系统缺失

## 本轮核心判断

1. 之前“被别的 skill 抢入口”主要有两类原因：
   - 同类总控 skill 冲突，例如 `vibe-project-builder`
   - 安装包中内部 `SKILL.md` 暴露过多
2. 第一类已通过强化顶层 `SKILL.md` 和 README 进行约束
3. 第二类已通过“只保留一个公开 `SKILL.md`”处理
4. 项目目录初始化不能继续依赖单一通用目录树或临场发挥，必须由已激活技术栈包和场景包共同整合
5. `project-blueprints/` 资产仍然有价值，但角色应固定为 fallback，不得覆盖 active fragments
6. 后续新增技术栈包时，若只提供自然语言规范、不提供结构化目录片段，则 Step 4 仍会出现目录漂移风险

## 当前遗留风险

1. VS Code / Codex 可能仍缓存旧 skill 列表，需要重开会话或重载窗口
2. 如果本机仍看到旧的 installed skills 结果，需要再次确认：
   - 是否使用最新安装包重装
   - 是否读取的确实是 `~/.codex/skills`
3. `vibe-project-builder` 仍安装在本机；若它继续抢入口，需在其自身 skill 中加入“遇到 Acode-kit 必须退让”的规则
4. 当前仅补了首批高频 stack/scenario 的 directory fragments；后续新增技术栈包若未同步补 fragment，`DIRECTORY_PLAN` 会退回 fallback 参考，专业性可能下降
5. `DIRECTORY_PLAN.md` / `STACK_AND_DIRECTORY_INPUTS.approved.md` 目前是规则与模板层完成，后续真实项目启动时仍需观察运行时是否严格按该链路执行

## 推荐下一步

1. 选一组真实技术选型做启动模拟，验证：
   - `STACK_AND_DIRECTORY_INPUTS.approved.md`
   - `DIRECTORY_PLAN.md`
   - 目录创建与启动文档归位
2. 后续新增任意 stack/scenario 包时，必须同步新增对应 `*.directory.json`
3. 若仍被 `vibe-project-builder` 抢入口：
   - 修改 `vibe-project-builder/SKILL.md`
   - 加入“如果用户显式提到 Acode-kit，不要接管，必须退出并让 Acode-kit 接管”
4. 如需进一步增强扩展治理，可考虑：
   - `-enable` 增加 preview/diff 模式
   - `-disable` 增加更细的回滚提示

## 技术栈与目录统一落地要求

后续新增技术栈包时，统一按以下要求落地：

1. 技术栈包正文仍保留自然语言规范，但必须同时补一个结构化目录片段文件，命名为同目录下的 `*.directory.json`
2. `*.directory.json` 至少包含：
   - `id`
   - `source`
   - `domain`
   - `priority`
   - `applies_when`
   - `paths`
3. `paths` 中每条目录定义至少包含：
   - `path`
   - `required`
   - `reason`
4. 同一技术域的目录骨架由对应 stack package 主导：
   - frontend 由前端栈包主导
   - backend 由后端栈包主导
   - data-access / migration 由数据访问与数据库栈包主导
   - deployment 由部署栈包主导
5. scenario package 只能补业务模块或页面形态目录，不能推翻 stack package 已定义的技术骨架
6. `project-blueprints/` 只在 active fragments 不足时作为 fallback 参考，不能作为主输入
7. `Step 3` 必须先把技术栈、设计、DB、部署、目录约束冻结到 `.acode-kit-startup/STACK_AND_DIRECTORY_INPUTS.approved.md`
8. `Step 4` 必须先根据 active fragments 合成 `docs/project/DIRECTORY_PLAN.md`，说明目录来源、冲突处理、fallback 使用情况，再允许创建目录
9. 若 active fragments 冲突未解，必须先在 `DIRECTORY_PLAN.md` 记录并阻断目录创建，不能边建边改
10. 不要继续把目录规则塞回主 `Acode-kit/SKILL.md`；优先落在：
   - `27_PROJECT_EXECUTION_FLOW_SPEC.md`
   - `28_PROJECT_DIRECTORY_AND_REPOSITORY_STRUCTURE_SPEC.md`
   - `30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md`
   - `DIRECTORY_BLUEPRINT_SYNTHESIS_RULES.md`
   - 相关 stack/scenario 片段文件

## 重要路径

- 主 skill：`Acode-kit/SKILL.md`
- 目录整合规则：
  - `Acode-kit/references/load-rules/DIRECTORY_BLUEPRINT_SYNTHESIS_RULES.md`
- 目录 fallback 参考：
  - `Acode-kit/references/project-blueprints/README.md`
- 安装器：
  - `scripts/install.sh`
  - `scripts/install.ps1`
  - `scripts/install.mjs`
- 扩展启停：
  - `scripts/activate-extension-module.mjs`
  - `scripts/deactivate-extension-module.mjs`
- 扩展扫描：
  - `scripts/scan-extension-module.mjs`
- 唯一公开 skill 入口后的内部文档：
  - `Acode-kit/extensions/router/ROUTER_RUNTIME.md`
  - `Acode-kit/extensions/packs/security-review-pack/PACK_RUNTIME.md`
- 启动期目录相关模板：
  - `Acode-kit/assets/project-doc-templates/STACK_AND_DIRECTORY_INPUTS.template.md`
  - `Acode-kit/assets/project-doc-templates/DIRECTORY_PLAN.template.md`
- 首批结构化目录片段：
  - `Acode-kit/references/stack-standards/frontend/react-shadcn.directory.json`
  - `Acode-kit/references/stack-standards/backend/spring-boot.directory.json`
  - `Acode-kit/references/stack-standards/data-access/mybatis-plus.directory.json`
  - `Acode-kit/references/stack-standards/deployment/containerized-service-delivery.directory.json`
  - `Acode-kit/references/scenario-standards/bs-admin-console.directory.json`
  - `Acode-kit/references/scenario-standards/bs-commerce-transaction.directory.json`

## 下次会话建议开场

直接先读：

1. `docs/project/SESSION_HANDOFF.md`
2. `Acode-kit/workflows/startup.md`
3. `Acode-kit/references/load-rules/DIRECTORY_BLUEPRINT_SYNTHESIS_RULES.md`

然后优先检查：

1. 本机 `~/.codex/skills/Acode-kit/` 是否为最新安装版本
2. `Step 3` 是否已生成 `.acode-kit-startup/STACK_AND_DIRECTORY_INPUTS.approved.md`
3. `Step 4` 是否先生成 `docs/project/DIRECTORY_PLAN.md`
4. VS Code / Codex 是否刷新了 skills 缓存

## LMS 与版本

- 当前档位：`M`
- 档位约束：仅控制规模密度，不降低节点、输入输出、审批和标准要求
- Frozen Version：`v2.1`
- Rollback Point：引入 directory fragments 与 Step 3/4 目录整合前的 workflow / reference 基线

## 已更新文档

- `Acode-kit/SKILL.md`
- `Acode-kit/workflows/startup.md`
- `Acode-kit/workflows/gate-rules.md`
- `Acode-kit/integrations/shared/WORKFLOW_CORE.md`
- `Acode-kit/extensions/registry/EXTENSION_LOADING_RULES.md`
- `Acode-kit/references/load-rules/DOCUMENT_LOADING_RULES.md`
- `Acode-kit/assets/project-doc-templates/PROJECT_OVERVIEW.template.md`
- `Acode-kit/assets/project-doc-templates/PRD.template.md`
- `Acode-kit/assets/project-doc-templates/TRACEABILITY_MATRIX.template.md`
- `Acode-kit/assets/project-doc-templates/SESSION_HANDOFF.template.md`
- `Acode-kit/assets/project-doc-templates/STACK_AND_DIRECTORY_INPUTS.template.md`
- `Acode-kit/assets/project-doc-templates/DIRECTORY_PLAN.template.md`
- `Acode-kit/references/load-rules/DIRECTORY_BLUEPRINT_SYNTHESIS_RULES.md`
- `Acode-kit/references/load-rules/TASK_TO_STANDARD_MAP.md`
- `Acode-kit/references/global-engineering-standards/27_PROJECT_EXECUTION_FLOW_SPEC.md`
- `Acode-kit/references/global-engineering-standards/28_PROJECT_DIRECTORY_AND_REPOSITORY_STRUCTURE_SPEC.md`
- `Acode-kit/references/global-engineering-standards/30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md`
- `Acode-kit/references/project-blueprints/README.md`
- `Acode-kit/references/stack-standards/frontend/react-shadcn.directory.json`
- `Acode-kit/references/stack-standards/backend/spring-boot.directory.json`
- `Acode-kit/references/stack-standards/data-access/mybatis-plus.directory.json`
- `Acode-kit/references/stack-standards/deployment/containerized-service-delivery.directory.json`
- `Acode-kit/references/scenario-standards/bs-admin-console.directory.json`
- `Acode-kit/references/scenario-standards/bs-commerce-transaction.directory.json`
- `docs/WORKFLOW-LOGIC-OVERVIEW.md`
- `scripts/test-workflow-simulation.mjs`
- `scripts/validate-workflow-contracts.mjs`
