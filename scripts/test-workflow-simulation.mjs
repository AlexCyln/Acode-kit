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
    { from: "gate-3-5", input: "gate-3-5-approved", to: "step-4a" },
    { from: "step-4a", input: "gate-4a-approved", to: "step-4b" },
    { from: "step-4b", input: "gate-4b-approved", to: "stage-1" },
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
    ["step-3", "step-4a"],
    ["step-3", "stage-1"],
    ["step-4a", "stage-2"],
    ["step-4a", "stage-1"],
    ["step-4b", "stage-2"],
    ["stage-1", "stage-5d"],
    ["stage-5a", "stage-5d"],
    ["stage-5b", "stage-6"]
  ];

  assert.equal(transitions[0].to, "stop-for-init");
  assert.equal(transitions[3].to, "gate-3-5");
  assert.equal(transitions[4].to, "step-4a");
  assert.equal(transitions[5].to, "step-4b");
  assert.equal(transitions[6].to, "stage-1");
  assert.equal(transitions[11].to, "stage-5b");
  assert.equal(transitions[15].to, "stage-6");

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
  const stackDirectoryInputsTemplate = read(
    path.join(
      repoRoot,
      "Acode-kit",
      "assets",
      "project-doc-templates",
      "STACK_AND_DIRECTORY_INPUTS.template.md"
    )
  );
  const directoryPlanTemplate = read(
    path.join(
      repoRoot,
      "Acode-kit",
      "assets",
      "project-doc-templates",
      "DIRECTORY_PLAN.template.md"
    )
  );
  const directorySynthesisRules = read(
    path.join(
      repoRoot,
      "Acode-kit",
      "references",
      "load-rules",
      "DIRECTORY_BLUEPRINT_SYNTHESIS_RULES.md"
    )
  );
  const blueprintReadme = read(
    path.join(repoRoot, "Acode-kit", "references", "project-blueprints", "README.md")
  );

  mustContain(skill, "integrations/shared/WORKFLOW_CORE.md", "SKILL shared core reference");
  mustContain(skill, "workflows/startup.md", "SKILL startup workflow reference");
  mustContain(skill, "workflows/stage-execution.md", "SKILL stage workflow reference");
  mustContain(skill, "references/load-rules/DOCUMENT_LOADING_RULES.md", "SKILL loading rules reference");
  mustContain(skill, "references/load-rules/TASK_TO_STANDARD_MAP.md", "SKILL task map reference");
  mustContain(skill, "references/load-rules/AGENT_DELEGATION_RULES.md", "SKILL delegation rules reference");

  mustContain(core, "Step 1: Workspace Status Report", "workflow core startup");
  mustContain(core, "Gate 4a: user approval required", "workflow core gate 4a");
  mustContain(core, "Gate 4b: user approval required", "workflow core gate 4b");
  mustContain(core, "Stage 1: Requirements structuring + module decomposition", "workflow core stage 1");
  mustContain(core, "Stage 7: Deployment and go-live", "workflow core stage 7");
  mustContain(core, "global MCP cache exists", "workflow core global cache fallback");
  mustContain(core, "Step 5b: module UI detail design", "workflow core step 5b");
  mustContain(core, "the exact text `Log me in to NotebookLM`", "workflow core notebook auth trigger");
  mustContain(core, "break the module into explicit reviewable page units", "workflow core page batch review");
  mustContain(core, "Gate 3.5: LMS tier analysis and confirmation", "workflow core gate 3.5");
  mustContain(core, "Gate 3.5 output contract", "workflow core gate 3.5 output contract");
  mustContain(core, "Step 4a must materialize the approved Step 2 and Step 3 artifacts into formal project docs", "workflow core step 4a materialization");
  mustContain(core, "Step 4a must confirm the approved tech stack", "workflow core step 4a stack confirmation");
  mustContain(core, "Step 4b is responsible for environment setup and engineering scaffold creation only after Gate 4a is approved", "workflow core step 4b setup");
  mustContain(core, "The tier changes execution density only", "workflow core lms density");
  mustContain(core, "tell the user which extension was used", "workflow core extension disclosure");
  mustContain(core, "Step 2 and Step 3 must write or update their startup-staged files under `.acode-kit-startup/` before asking for gate approval.", "workflow core startup file-first");
  mustContain(core, "For Step 2 and Step 3, the review surface is the startup-staged files written under `.acode-kit-startup/`.", "workflow core startup review surface");
  mustContain(core, "Step 2 requirements analysis must use it as a strengthening input", "workflow core notebooklm strengthening");
  mustContain(core, "project core, current working files, or history-review artifacts", "workflow core doc classification");
  mustContain(core, "Step 5e review includes browser-accessible pages or interactions", "workflow core step 5e browser verification");
  mustContain(core, "Stage 6 review includes browser-accessible integrated scope", "workflow core stage 6 browser verification");

  mustContain(startup, "Gate 3.5: LMS tier analysis and confirmation", "startup gate 3.5");
  mustContain(startup, ".acode-kit-startup/PROJECT_SKELETON.approved.md", "startup staged skeleton");
  mustContain(startup, ".acode-kit-startup/STACK_AND_DIRECTORY_INPUTS.approved.md", "startup staged stack inputs");
  mustContain(startup, "docs/project/DIRECTORY_PLAN.md", "startup directory plan");
  mustContain(startup, "### Step 4a", "startup step 4a");
  mustContain(startup, "### Step 4b", "startup step 4b");
  mustContain(startup, "confirm the project tech stack from the approved startup docs", "startup step 4a stack confirm");
  mustContain(startup, "docs/dev/DEVELOPMENT_DOCUMENTATION_INDEX.md", "startup step 4a dev index");
  mustContain(startup, "it runs directly inside the already created project directory", "startup step 4b in-place setup");
  mustContain(startup, "Gate 4a: explicit user approval", "startup gate 4a");
  mustContain(startup, "Gate 4b: explicit user approval", "startup gate 4b");
  mustContain(startup, "do not paste the full skeleton or overview into the conversation", "startup step 2 path-only review");
  mustContain(startup, "do not paste the full PRD, progress plan, or stack input package into the conversation", "startup step 3 path-only review");
  mustContain(startup, "if NotebookLM MCP is installed and authenticated, use it to strengthen requirements analysis before freezing the skeleton", "startup notebooklm strengthening");
  mustContain(gates, "Document update cadence", "gate rules update cadence");
  mustContain(stageExecution, "Stage 5: module iteration", "stage execution stage 5");
  mustContain(stageExecution, "Stage 6 must execute Chrome DevTools MCP real-browser verification", "stage execution stage 6 browser verification");
  mustContain(moduleIteration, "Red-Green-Refactor TDD", "module iteration tdd");
  mustContain(moduleIteration, "`PROJECT_ACCESS_INFO.md`", "module iteration access info rule");
  mustContain(moduleIteration, "Step 5e must call Chrome DevTools MCP for real-browser verification", "module iteration step 5e browser verification");
  mustContain(loadingRules, "Do not bulk-read all workflows or all standards on entry.", "loading rules no bulk read");
  mustContain(taskMap, "startup / project skeleton", "task map startup mapping");
  mustContain(delegation, "final gate decisions", "delegation final gate restriction");

  mustContain(claude, "## STEP 4a — ONLY AFTER USER APPROVES PRD AT GATE 3", "claude gate 3 to step 4a boundary");
  mustContain(claude, "## STEP 4b — ONLY AFTER USER APPROVES STEP 4a AT GATE 4a", "claude gate 4a to step 4b boundary");
  mustContain(claude, "NEXT STEP: Step 4b — Environment + Engineering Scaffold Setup.", "claude gate 4a next step");
  mustContain(claude, "NEXT STEP: Stage-driven execution begins at Stage 1", "claude gate 4b next step");
  mustContain(claude, "integrations/shared/WORKFLOW_CORE.md", "claude shared core reference");
  mustContain(claude, "If the user chooses NotebookLM authentication and their reply is exactly `Log me in to NotebookLM`", "claude notebook auth passthrough");
  mustContain(claude, ".acode-kit-startup/PROJECT_SKELETON.approved.md", "claude step 2 startup skeleton file");
  mustContain(claude, ".acode-kit-startup/PRD.approved.md", "claude step 3 startup prd file");
  mustContain(claude, "Use NotebookLM's response to strengthen your analysis before freezing the skeleton.", "claude notebook strengthening");
  mustContain(claude, "Do NOT paste the full skeleton into the conversation.", "claude step 2 path-only review");
  mustContain(claude, "Do NOT paste the full PRD or progress plan into the conversation.", "claude step 3 path-only review");
  mustContain(claude, "Ask them to review the files directly.", "claude file review prompt");
  mustContain(claude, "Step 5e must call Chrome DevTools MCP for real-browser verification", "claude step 5e browser verification");
  mustContain(claude, "Stage 6 must call Chrome DevTools MCP for real-browser verification", "claude stage 6 browser verification");

  mustContain(codex, "Gate 1 -> Step 2 only", "codex gate 1 mapping");
  mustContain(codex, "Gate 3 -> Gate 3.5 only", "codex gate 3 mapping");
  mustContain(codex, "Gate 3.5 -> Step 4a only", "codex gate 3.5 mapping");
  mustContain(codex, "Gate 4a -> Step 4b only", "codex gate 4a mapping");
  mustContain(codex, "Gate 4b -> Stage 1 only", "codex gate 4b mapping");
  mustContain(codex, "There is no external `CALLER:` layer.", "codex direct interaction");
  mustContain(codex, "wait for the next user message", "codex wait behavior");
  mustContain(codex, "global MCP cache", "codex global cache fallback");
  mustContain(codex, "if the user reply is exactly `Log me in to NotebookLM`", "codex notebook auth passthrough");
  mustContain(codex, "Gate 3.5 output block", "codex gate 3.5 output block");
  mustContain(codex, "Step 2 requirements analysis must call NotebookLM before freezing the project skeleton", "codex notebook strengthening");
  mustContain(codex, "do not paste the full skeleton, PRD, progress plan, or stack input package into the reply", "codex startup path-only review");
  mustContain(codex, "Step 5e must call Chrome DevTools MCP for real-browser verification", "codex step 5e browser verification");
  mustContain(codex, "Stage 6 must call Chrome DevTools MCP for real-browser verification", "codex stage 6 browser verification");

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
  mustContain(skill, "Gate 4a: user approval", "SKILL gate 4a");
  mustContain(skill, "Gate 4b: user approval", "SKILL gate 4b");
  mustContain(skill, "docs/project/ACTIVE_STANDARDS.md", "SKILL active standards");
  mustContain(skill, "fallback order: `error -> timeout -> quality_low -> budget_exceeded`", "SKILL router fallback");

  mustContain(toolSpec, "shadcn MCP 仅在项目已声明使用 `shadcn/ui` 时才有意义", "tool spec shadcn usage scope");
  mustContain(toolSpec, "MCP 辅助能力降级，不阻塞主流程", "tool spec shadcn degradation");
  mustContain(toolSpec, "NotebookLM 的 `authCompleted` 一旦被确认成功，应同步到同一份全局缓存", "tool spec auth persistence");
  mustContain(toolSpec, "`Step 5e` 在模块级交付前必须调用 Chrome DevTools MCP", "tool spec step 5e chrome devtools");
  mustContain(toolSpec, "`Stage 6` 在最终联调/交付前必须调用 Chrome DevTools MCP", "tool spec stage 6 chrome devtools");
  mustContain(testingSpec, "总线与分线 TDD", "testing spec total line and branch TDD");
  mustContain(testingSpec, "阶段级产物必须可验证", "testing spec stage verifiability");
  mustContain(testingSpec, "## 10.6 节点级浏览器验证硬门禁", "testing spec browser verification section");
  mustContain(testingSpec, "`Step 5e` 在交付用户复核前必须调用 Chrome DevTools MCP", "testing spec step 5e browser verification");
  mustContain(testingSpec, "`Stage 6` 在交付用户做最终联调或集成核查前", "testing spec stage 6 browser verification");
  mustContain(executionFlowSpec, "变更与回滚通道", "execution flow change rollback lane");
  mustContain(executionFlowSpec, "TDD 总线与分线执行模型", "execution flow TDD model");
  mustContain(executionFlowSpec, "实现与目录输入包", "execution flow stack directory inputs");
  mustContain(executionFlowSpec, "`DIRECTORY_PLAN.md`", "execution flow directory plan");
  mustContain(executionFlowSpec, "fallback", "execution flow fallback blueprints");

  mustContain(overridesTemplate, "项目级执行约束", "overrides template execution constraints");
  mustContain(overridesTemplate, "设计实现要求", "overrides template design rules");
  mustContain(overridesTemplate, "编码要求", "overrides template coding rules");
  mustContain(projectOverviewTemplate, "当前进度", "project overview progress field");
  mustContain(projectOverviewTemplate, "最近一次更新", "project overview update field");
  mustContain(projectOverviewTemplate, "实施信息", "project overview implementation field");
  mustContain(projectSkeletonTemplate, "文档信息", "project skeleton metadata");
  mustContain(projectSkeletonTemplate, "审阅阶段：Gate 2", "project skeleton review gate");
  mustContain(projectSkeletonTemplate, "技术选型目录蓝图", "project skeleton blueprint field");
  mustContain(projectOverviewTemplate, "LMS / 版本治理", "project overview lms section");
  mustContain(projectOverviewTemplate, "激活矩阵", "project overview activation matrix");
  mustContain(projectOverviewTemplate, "启动来源文件", "project overview startup source");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PRD.template.md")), "LMS 档位", "prd template lms tier");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PRD.template.md")), "修订与回滚", "prd template revision rollback");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PRD.template.md")), "启动冻结稿", "prd template startup source");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "SESSION_HANDOFF.template.md")), "LMS Tier", "session handoff lms tier");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "SESSION_HANDOFF.template.md")), "Frozen Version", "session handoff frozen version");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "DECISION_LOG.template.md")), "LMS 档位", "decision log lms tier");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PROJECT_OVERRIDES.template.md")), "MCP 使用约束", "project overrides mcp policy");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PROJECT_OVERRIDES.template.md")), "版本锁要求", "project overrides version lock");
  mustContain(agentsTemplate, "Step 5b 的页面设计必须按页面或页面组分批审阅", "agents template page review rule");
  mustContain(agentsTemplate, "docs/dev/DEVELOPMENT_DOCUMENTATION_INDEX.md", "agents template dev doc index");
  mustContain(agentsTemplate, "Gate 4a", "agents template gate 4a");
  mustContain(agentsTemplate, "已批准页面、API、数据结构和模块说明一旦修订，旧版本立即失效", "agents template version lock");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "ACTIVE_STANDARDS.template.md")), "已激活规范包", "active standards template");
  mustContain(devIndexTemplate, "# 开发文档索引", "dev doc index template header");
  mustContain(devIndexTemplate, "## 项目核心", "dev doc index project core section");
  mustContain(devIndexTemplate, "## 当前文件", "dev doc index current section");
  mustContain(devIndexTemplate, "## 历史审阅", "dev doc index history review section");
  mustContain(stackDirectoryInputsTemplate, "前端输入", "stack and directory inputs frontend section");
  mustContain(stackDirectoryInputsTemplate, "数据库与数据访问输入", "stack and directory inputs data section");
  mustContain(directoryPlanTemplate, "目录来源摘要", "directory plan source summary");
  mustContain(directoryPlanTemplate, "最终目录树", "directory plan tree section");
  mustContain(directoryPlanTemplate, "生成节点：Step 4a", "directory plan step 4a");
  mustContain(directorySynthesisRules, "Synthesis order", "directory synthesis rules order");
  mustContain(directorySynthesisRules, "fallback blueprints", "directory synthesis fallback");
  mustContain(blueprintReadme, "fallback", "blueprint readme fallback role");
  mustContain(devIndexTemplate, "当前优先补齐项", "dev doc index priority section");
  mustContain(devIndexTemplate, "母规范激活矩阵入口", "dev doc index activation entry");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "DECISION_LOG.template.md")), "回滚点", "decision log rollback point");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "DECISION_LOG.template.md")), "最晚确认时间", "decision log assumption timing");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "TRACEABILITY_MATRIX.template.md")), "变更状态", "traceability change state");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "TRACEABILITY_MATRIX.template.md")), "母规范激活矩阵", "traceability activation matrix");
  mustContain(read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "SESSION_HANDOFF.template.md")), "Rollback Point", "session handoff rollback point");
  mustContain(read(path.join(repoRoot, "Acode-kit", "references", "global-engineering-standards", "30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md")), "每次 gate、stage、模块 step", "doc governance update cadence");
  mustContain(read(path.join(repoRoot, "Acode-kit", "references", "global-engineering-standards", "30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md")), "项目核心", "doc governance project core");
  mustContain(read(path.join(repoRoot, "Acode-kit", "references", "global-engineering-standards", "30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md")), "历史审阅", "doc governance review history");

  simulateWorkflow();
  console.log("workflow simulation passed");
}

main();
