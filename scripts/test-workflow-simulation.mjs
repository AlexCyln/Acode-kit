#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function mustContain(haystack, needle, label) {
  assert.ok(haystack.includes(needle), `${label}: missing "${needle}"`);
}

function simulateWorkflow() {
  const transitions = [
    { from: "missing-init", input: "status missing", to: "stop-for-init" },
    { from: "step-1", input: "gate-1-approved", to: "step-2" },
    { from: "step-2", input: "gate-2-approved", to: "step-3" },
    { from: "step-3", input: "gate-3-approved", to: "gate-3-5" },
    { from: "gate-3-5", input: "gate-3-5-approved", to: "step-4" },
    { from: "step-4", input: "gate-4-approved", to: "stage-1" },
    { from: "stage-1", input: "approved", to: "stage-2" },
    { from: "stage-2", input: "approved", to: "stage-3" },
    { from: "stage-3", input: "approved", to: "stage-4" },
    { from: "stage-4", input: "approved", to: "stage-5a" },
    { from: "stage-5a", input: "approved", to: "stage-5b" },
    { from: "stage-5b", input: "approved", to: "stage-5c" },
    { from: "stage-5c", input: "approved", to: "stage-5d" },
    { from: "stage-5d", input: "approved", to: "stage-5e" },
    { from: "stage-5e", input: "approved", to: "stage-6" },
    { from: "stage-6", input: "approved", to: "stage-7" }
  ];

  const forbiddenJumps = [
    ["step-3", "stage-2"],
    ["step-3", "stage-5d"],
    ["step-3", "step-4"],
    ["step-3", "stage-1"],
    ["step-4", "stage-2"],
    ["stage-1", "stage-5d"],
    ["stage-5a", "stage-5d"],
    ["stage-5b", "stage-6"]
  ];

  assert.equal(transitions[0].to, "stop-for-init");
  assert.equal(transitions[3].to, "gate-3-5");
  assert.equal(transitions[4].to, "step-4");
  assert.equal(transitions[5].to, "stage-1");
  assert.equal(transitions[10].to, "stage-5b");
  assert.equal(transitions[14].to, "stage-6");

  const allowedTransitionSet = new Set(
    transitions.map(({ from, to }) => `${from}->${to}`)
  );

  for (const [from, to] of forbiddenJumps) {
    assert.ok(
      !allowedTransitionSet.has(`${from}->${to}`),
      `forbidden jump should not be allowed: ${from} -> ${to}`
    );
  }
}

function main() {
  const repoRoot = process.cwd();
  const skill = read(path.join(repoRoot, "Acode-kit", "SKILL.md"));
  const core = read(path.join(repoRoot, "Acode-kit", "integrations", "shared", "WORKFLOW_CORE.md"));
  const claude = read(path.join(repoRoot, "Acode-kit", "integrations", "claude", "acode-kit.md"));
  const codex = read(path.join(repoRoot, "Acode-kit", "integrations", "codex", "acode-kit.md"));
  const codexRun = read(path.join(repoRoot, "Acode-kit", "integrations", "codex", "acode-run.md"));
  const startup = read(path.join(repoRoot, "Acode-kit", "workflows", "startup.md"));
  const gates = read(path.join(repoRoot, "Acode-kit", "workflows", "gate-rules.md"));
  const stageExecution = read(path.join(repoRoot, "Acode-kit", "workflows", "stage-execution.md"));
  const moduleIteration = read(path.join(repoRoot, "Acode-kit", "workflows", "module-iteration.md"));
  const loadingRules = read(path.join(repoRoot, "Acode-kit", "references", "load-rules", "DOCUMENT_LOADING_RULES.md"));
  const taskMap = read(path.join(repoRoot, "Acode-kit", "references", "load-rules", "TASK_TO_STANDARD_MAP.md"));
  const delegation = read(path.join(repoRoot, "Acode-kit", "references", "load-rules", "AGENT_DELEGATION_RULES.md"));
  const readme = read(path.join(repoRoot, "README.md"));
  const toolSpec = read(
    path.join(
      repoRoot,
      "Acode-kit",
      "references",
      "global-engineering-standards",
      "31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md"
    )
  );
  const testingSpec = read(
    path.join(
      repoRoot,
      "Acode-kit",
      "references",
      "global-engineering-standards",
      "11_TESTING_AND_QA_SPEC.md"
    )
  );
  const executionFlowSpec = read(
    path.join(
      repoRoot,
      "Acode-kit",
      "references",
      "global-engineering-standards",
      "27_PROJECT_EXECUTION_FLOW_SPEC.md"
    )
  );
  const overridesTemplate = read(
    path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PROJECT_OVERRIDES.template.md")
  );
  const projectOverviewTemplate = read(
    path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PROJECT_OVERVIEW.template.md")
  );
  const projectSkeletonTemplate = read(
    path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PROJECT_SKELETON.template.md")
  );
  const agentsTemplate = read(
    path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "AGENTS.template.md")
  );
  const devIndexTemplate = read(
    path.join(
      repoRoot,
      "Acode-kit",
      "assets",
      "project-doc-templates",
      "DEVELOPMENT_DOCUMENTATION_INDEX.template.md"
    )
  );

  mustContain(skill, "integrations/shared/WORKFLOW_CORE.md", "SKILL shared core reference");
  mustContain(skill, "workflows/startup.md", "SKILL startup workflow reference");
  mustContain(skill, "workflows/stage-execution.md", "SKILL stage workflow reference");
  mustContain(skill, "references/load-rules/DOCUMENT_LOADING_RULES.md", "SKILL loading rules reference");
  mustContain(skill, "references/load-rules/TASK_TO_STANDARD_MAP.md", "SKILL task map reference");
  mustContain(skill, "references/load-rules/AGENT_DELEGATION_RULES.md", "SKILL delegation rules reference");

  mustContain(core, "Step 1: Workspace Status Report", "workflow core startup");
  mustContain(core, "Gate 4: user approval required", "workflow core gate 4");
  mustContain(core, "Stage 1: Requirements structuring + module decomposition", "workflow core stage 1");
  mustContain(core, "Stage 7: Deployment and go-live", "workflow core stage 7");
  mustContain(core, "global MCP cache exists", "workflow core global cache fallback");
  mustContain(core, "Step 5b: module UI detail design", "workflow core step 5b");
  mustContain(core, "the exact text `Log me in to NotebookLM`", "workflow core notebook auth trigger");
  mustContain(core, "break the module into explicit reviewable page units", "workflow core page batch review");
  mustContain(core, "Gate 3.5: LMS tier analysis and confirmation", "workflow core gate 3.5");
  mustContain(core, "Gate 3.5 output contract", "workflow core gate 3.5 output contract");

  mustContain(startup, "Gate 3.5: LMS tier analysis and confirmation", "startup gate 3.5");
  mustContain(startup, "review-ready markdown draft shaped like `docs/project/PROJECT_SKELETON.md`", "startup skeleton draft");
  mustContain(gates, "Document update cadence", "gate rules update cadence");
  mustContain(stageExecution, "Stage 5: module iteration", "stage execution stage 5");
  mustContain(moduleIteration, "Red-Green-Refactor TDD", "module iteration tdd");
  mustContain(moduleIteration, "`PROJECT_ACCESS_INFO.md`", "module iteration access info rule");
  mustContain(loadingRules, "Do not bulk-read all workflows or all standards on entry.", "loading rules no bulk read");
  mustContain(taskMap, "startup / project skeleton", "task map startup mapping");
  mustContain(delegation, "final gate decisions", "delegation final gate restriction");

  mustContain(claude, "STEP 4 — ONLY AFTER USER APPROVES PRD AT GATE 3", "claude gate 3 to step 4 boundary");
  mustContain(claude, "NEXT STEP: Stage-driven execution begins at Stage 1", "claude gate 4 next step");
  mustContain(claude, "integrations/shared/WORKFLOW_CORE.md", "claude shared core reference");
  mustContain(claude, "If the user chooses NotebookLM authentication and their reply is exactly `Log me in to NotebookLM`", "claude notebook auth passthrough");

  mustContain(codex, "Gate 1 -> Step 2 only", "codex gate 1 mapping");
  mustContain(codex, "Gate 3 -> Gate 3.5 only", "codex gate 3 mapping");
  mustContain(codex, "Gate 3.5 -> Step 4 only", "codex gate 3.5 mapping");
  mustContain(codex, "Gate 4 -> Stage 1 only", "codex gate 4 mapping");
  mustContain(codex, "There is no external `CALLER:` layer.", "codex direct interaction");
  mustContain(codex, "wait for the next user message", "codex wait behavior");
  mustContain(codex, "global MCP cache", "codex global cache fallback");
  mustContain(codex, "if the user reply is exactly `Log me in to NotebookLM`", "codex notebook auth passthrough");
  mustContain(codex, "Gate 3.5 output block", "codex gate 3.5 output block");

  mustContain(codexRun, "`acode-run` is internal and not user-facing.", "codex run contract");
  mustContain(codexRun, "Fallback order stays `error -> timeout -> quality_low -> budget_exceeded`.", "codex run fallback");

  mustContain(readme, "integrations/shared/WORKFLOW_CORE.md", "README shared core reference");
  mustContain(readme, "integrations/codex/*.md", "README codex runtime reference");
  mustContain(readme, "workflows/*.md", "README workflows reference");
  mustContain(readme, "references/load-rules/*.md", "README load-rules reference");
  mustContain(readme, "acode-kit.mjs bootstrap", "README bootstrap install path");

  mustContain(read(path.join(repoRoot, "package.json")), "\"bootstrap\": \"node ./scripts/acode-kit.mjs bootstrap\"", "package bootstrap script");
  mustContain(read(path.join(repoRoot, "scripts", "acode-kit.mjs")), "acode-kit bootstrap", "CLI bootstrap command");

  mustContain(skill, "Gate 3.5: LMS tier confirmation", "SKILL gate 3.5");
  mustContain(skill, "docs/project/ACTIVE_STANDARDS.md", "SKILL active standards");
  mustContain(skill, "fallback order: `error -> timeout -> quality_low -> budget_exceeded`", "SKILL router fallback");

  mustContain(toolSpec, "shadcn MCP 仅在项目已声明使用 `shadcn/ui` 时才有意义", "tool spec shadcn usage scope");
  mustContain(toolSpec, "MCP 辅助能力降级，不阻塞主流程", "tool spec shadcn degradation");
  mustContain(toolSpec, "NotebookLM 的 `authCompleted` 一旦被确认成功，应同步到同一份全局缓存", "tool spec auth persistence");
  mustContain(testingSpec, "总线与分线 TDD", "testing spec total line and branch TDD");
  mustContain(testingSpec, "阶段级产物必须可验证", "testing spec stage verifiability");
  mustContain(executionFlowSpec, "变更与回滚通道", "execution flow change rollback lane");
  mustContain(executionFlowSpec, "TDD 总线与分线执行模型", "execution flow TDD model");

  mustContain(overridesTemplate, "项目级执行约束", "overrides template execution constraints");
  mustContain(overridesTemplate, "设计实现要求", "overrides template design rules");
  mustContain(overridesTemplate, "编码要求", "overrides template coding rules");
  mustContain(projectOverviewTemplate, "当前进度", "project overview progress field");
  mustContain(projectOverviewTemplate, "最近一次更新", "project overview update field");
  mustContain(projectOverviewTemplate, "实施信息", "project overview implementation field");
  mustContain(projectSkeletonTemplate, "文档信息", "project skeleton metadata");
  mustContain(projectSkeletonTemplate, "审阅阶段：Gate 2", "project skeleton review gate");
  mustContain(projectOverviewTemplate, "LMS / 版本治理", "project overview lms section");
  mustContain(projectOverviewTemplate, "激活矩阵", "project overview activation matrix");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PRD.template.md")), "LMS 档位", "prd template lms tier");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PRD.template.md")), "修订与回滚", "prd template revision rollback");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "SESSION_HANDOFF.template.md")), "LMS Tier", "session handoff lms tier");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "SESSION_HANDOFF.template.md")), "Frozen Version", "session handoff frozen version");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "DECISION_LOG.template.md")), "LMS 档位", "decision log lms tier");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PROJECT_OVERRIDES.template.md")), "MCP 使用约束", "project overrides mcp policy");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PROJECT_OVERRIDES.template.md")), "版本锁要求", "project overrides version lock");
  mustContain(agentsTemplate, "Step 5b 的页面设计必须按页面或页面组分批审阅", "agents template page review rule");
  mustContain(agentsTemplate, "docs/dev/DEVELOPMENT_DOCUMENTATION_INDEX.md", "agents template dev doc index");
  mustContain(agentsTemplate, "PRD 确认后必须执行 `Gate 3.5`", "agents template gate 3.5");
  mustContain(agentsTemplate, "已批准页面、API、数据结构和模块说明一旦修订，旧版本立即失效", "agents template version lock");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "ACTIVE_STANDARDS.template.md")), "已激活规范包", "active standards template");
  mustContain(devIndexTemplate, "# 开发文档索引", "dev doc index template header");
  mustContain(devIndexTemplate, "当前优先补齐项", "dev doc index priority section");
  mustContain(devIndexTemplate, "母规范激活矩阵入口", "dev doc index activation entry");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "DECISION_LOG.template.md")), "回滚点", "decision log rollback point");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "DECISION_LOG.template.md")), "最晚确认时间", "decision log assumption timing");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "TRACEABILITY_MATRIX.template.md")), "变更状态", "traceability change state");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "TRACEABILITY_MATRIX.template.md")), "母规范激活矩阵", "traceability activation matrix");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "SESSION_HANDOFF.template.md")), "Rollback Point", "session handoff rollback point");
  mustContain(read(path.join(repoRoot, "Acode-kit", "references", "global-engineering-standards", "30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md")), "每次 gate、stage、模块 step", "doc governance update cadence");

  simulateWorkflow();
  console.log("workflow simulation passed");
}

main();
