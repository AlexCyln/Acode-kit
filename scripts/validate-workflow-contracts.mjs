#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? read(filePath) : "";
}

function mustContain(haystack, needle, label) {
  assert.ok(haystack.includes(needle), `${label}: missing "${needle}"`);
}

function extractNumberedSection(text, header) {
  const start = text.indexOf(header);
  assert.ok(start >= 0, `missing section header: ${header}`);
  const tail = text.slice(start + header.length);
  const nextHeaderMatch = tail.match(/\n##\s+/);
  return nextHeaderMatch ? tail.slice(0, nextHeaderMatch.index) : tail;
}

function extractNumberedItems(section) {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s/.test(line))
    .map((line) => {
      const match = line.match(/^(\d+)\.\s/);
      return Number(match[1]);
    });
}

function assertSequential(numbers, expectedStart, expectedEnd, label) {
  const expected = Array.from(
    { length: expectedEnd - expectedStart + 1 },
    (_, index) => expectedStart + index
  );
  assert.deepEqual(numbers, expected, `${label}: expected ${expected.join(", ")}, got ${numbers.join(", ")}`);
}

function validateClaudeRules(claude) {
  const section = extractNumberedSection(claude, "## CRITICAL EXECUTION RULES");
  const numbers = extractNumberedItems(section);
  assertSequential(numbers, 0, 9, "Claude critical execution rules numbering");
}

function validateMandatoryMcpAndVersionLock(core, claude, skill, loadingRules, extensionLoadingRules, overridesTemplate, projectOverviewTemplate, prdTemplate, traceabilityTemplate, decisionLogTemplate, agentsTemplate, stackInputsTemplate, directoryPlanTemplate, directorySynthesisRules, executionFlowSpec) {
  mustContain(core, "Gate 3.5: LMS tier analysis and confirmation", "workflow core gate 3.5");
  mustContain(core, "NotebookLM authentication exception at Gate 1", "workflow core notebook auth exception");
  mustContain(core, "Do not use Pencil or other design tooling outside Stage 2 and Step 5b", "workflow core pencil boundary");
  mustContain(core, "Step 4a / Step 4b / Stage 4 separation", "workflow core step/stage separation");
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

  mustContain(claude, "After Gate 3 → Gate 3.5 (LMS tier confirmation) → Step 4a (directory materialization, NOT environment setup) → Gate 4a → Step 4b (environment setup, NOT design).", "claude gate 3.5 boundary");
  mustContain(claude, "Design tools are ONLY used at Stage 2 (overall UI architecture) and Step 5b (module UI detail design)", "claude pencil boundary");
  mustContain(claude, "Do NOT mention \"Pencil\" or \"design phase\" in Gate 3 questions.", "claude gate 3 pencil ban");
  mustContain(claude, "Do NOT create custom HTML/CSS primitives when shadcn equivalents exist.", "claude shadcn prohibition");
  mustContain(claude, "Do NOT paste the full skeleton into the conversation.", "claude startup skeleton path-only review");
  mustContain(claude, "Do NOT paste the full PRD or progress plan into the conversation.", "claude startup prd path-only review");
  mustContain(claude, "Ask them to review the files directly.", "claude startup file review prompt");
  mustContain(claude, "Step 5e must call Chrome DevTools MCP for real-browser verification", "claude step 5e browser verification");
  mustContain(claude, "Stage 6 must call Chrome DevTools MCP for real-browser verification", "claude stage 6 browser verification");

  mustContain(skill, "`Step 4a` and `Step 4b` are not `Stage 4`", "SKILL step/stage separation");
  mustContain(skill, "Pencil/design tools only at Stage 2 and Step 5b", "SKILL pencil boundary");
  mustContain(skill, "Gate 3.5: LMS tier confirmation", "SKILL gate 3.5");
  mustContain(skill, "must materialize the approved Step 2 / Step 3 outputs into project docs by direct relocation", "SKILL step 4 materialization");
  mustContain(skill, "may not remove startup gates, Stage 1-7, or Step 5a-5e", "SKILL lms rigor");
  mustContain(skill, "tell the user which extension was used, what it did at the current node, and why it was helpful", "SKILL extension disclosure");

  mustContain(loadingRules, "do not let LMS tier downshift remove required document materialization or node review outputs", "loading rules lms floor");
  mustContain(loadingRules, "DIRECTORY_BLUEPRINT_SYNTHESIS_RULES.md", "loading rules directory synthesis hook");
  mustContain(extensionLoadingRules, "tell the user which extension was used, what it contributed, and why it matters at this node", "extension loading disclosure");

  mustContain(overridesTemplate, "MCP 使用约束", "overrides template mcp field");
  mustContain(overridesTemplate, "版本锁要求", "overrides template version lock");

  mustContain(projectOverviewTemplate, "LMS / 版本治理", "project overview lms section");
  mustContain(projectOverviewTemplate, "激活矩阵", "project overview activation matrix");
  mustContain(projectOverviewTemplate, "来源基线", "project overview source baseline");
  mustContain(projectOverviewTemplate, "启动承接说明", "project overview startup carry forward");

  mustContain(prdTemplate, "来源基线", "prd template source baseline");
  mustContain(prdTemplate, "承接校验", "prd template carry forward check");

  mustContain(traceabilityTemplate, "母规范激活矩阵", "traceability activation matrix");
  mustContain(traceabilityTemplate, "版本与回滚", "traceability version rollback");
  mustContain(traceabilityTemplate, "承接来源", "traceability source carry forward");

  mustContain(decisionLogTemplate, "LMS 档位", "decision log lms field");
  mustContain(decisionLogTemplate, "冻结版本", "decision log frozen version");
  mustContain(decisionLogTemplate, "是否导致旧版本失效", "decision log invalidation field");

  mustContain(agentsTemplate, "Gate 4a", "agents template gate 4a");
  mustContain(agentsTemplate, "已批准页面、API、数据结构和模块说明一旦修订，旧版本立即失效", "agents template version lock");
  mustContain(agentsTemplate, "NotebookLM / Pencil / shadcn / Chrome DevTools 在命中的节点必须作为强制消费型 MCP 使用", "agents template mcp enforcement");
  mustContain(stackInputsTemplate, "前端输入", "stack inputs template frontend section");
  mustContain(stackInputsTemplate, "后端输入", "stack inputs template backend section");
  mustContain(directoryPlanTemplate, "目录来源摘要", "directory plan template source section");
  mustContain(directoryPlanTemplate, "最终目录树", "directory plan template tree section");
  mustContain(directoryPlanTemplate, "生成节点：Step 4a", "directory plan template step 4a");
  mustContain(directorySynthesisRules, "Synthesis order", "directory synthesis order section");
  mustContain(directorySynthesisRules, "fallback blueprints", "directory synthesis fallback section");
  mustContain(executionFlowSpec, "实现与目录输入包", "execution flow stack input package");
  mustContain(executionFlowSpec, "`DIRECTORY_PLAN.md`", "execution flow directory plan");
  mustContain(executionFlowSpec, "`Step 4a`", "execution flow step 4a");
  mustContain(executionFlowSpec, "`Step 4b`", "execution flow step 4b");
}

function validateSlimSkill(skill) {
  const lineCount = skill.split("\n").length;
  assert.ok(lineCount >= 120 && lineCount <= 190, `SKILL line count out of range: ${lineCount}`);
  mustContain(skill, "## First action", "SKILL first action section");
  mustContain(skill, "## Loading order", "SKILL loading order section");
  mustContain(skill, "## Workflow graph", "SKILL workflow graph section");
  mustContain(skill, "workflows/startup.md", "SKILL startup workflow reference");
  mustContain(skill, "references/load-rules/DOCUMENT_LOADING_RULES.md", "SKILL loading rules reference");
  mustContain(skill, "docs/project/ACTIVE_STANDARDS.md", "SKILL active standards reference");
}

function main() {
  const repoRoot = process.cwd();
  const skill = read(path.join(repoRoot, "Acode-kit", "SKILL.md"));
  const core = read(path.join(repoRoot, "Acode-kit", "integrations", "shared", "WORKFLOW_CORE.md"));
  const claude = read(path.join(repoRoot, "Acode-kit", "integrations", "claude", "acode-kit.md"));
  const loadingRules = read(path.join(repoRoot, "Acode-kit", "references", "load-rules", "DOCUMENT_LOADING_RULES.md"));
  const extensionLoadingRules = read(path.join(repoRoot, "Acode-kit", "extensions", "registry", "EXTENSION_LOADING_RULES.md"));
  const overridesTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PROJECT_OVERRIDES.template.md"));
  const projectOverviewTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PROJECT_OVERVIEW.template.md"));
  const prdTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PRD.template.md"));
  const traceabilityTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "TRACEABILITY_MATRIX.template.md"));
  const decisionLogTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "DECISION_LOG.template.md"));
  const agentsTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "AGENTS.template.md"));
  const stackInputsTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "STACK_AND_DIRECTORY_INPUTS.template.md"));
  const directoryPlanTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "DIRECTORY_PLAN.template.md"));
  const directorySynthesisRules = read(path.join(repoRoot, "Acode-kit", "references", "load-rules", "DIRECTORY_BLUEPRINT_SYNTHESIS_RULES.md"));
  const executionFlowSpec = read(path.join(repoRoot, "Acode-kit", "references", "global-engineering-standards", "27_PROJECT_EXECUTION_FLOW_SPEC.md"));
  const docsProjectOverview = readIfExists(path.join(repoRoot, "docs", "project", "PROJECT_OVERVIEW.md"));
  const docsPrd = readIfExists(path.join(repoRoot, "docs", "project", "PRD.md"));
  const docsTraceability = readIfExists(path.join(repoRoot, "docs", "project", "TRACEABILITY_MATRIX.md"));
  const docsHandoff = readIfExists(path.join(repoRoot, "docs", "project", "SESSION_HANDOFF.md"));
  const docsDecision = readIfExists(path.join(repoRoot, "docs", "project", "DECISION_LOG.md"));
  const docsOverrides = readIfExists(path.join(repoRoot, "docs", "project", "PROJECT_OVERRIDES.md"));

  validateClaudeRules(claude);
  validateSlimSkill(skill);
  validateMandatoryMcpAndVersionLock(
    core,
    claude,
    skill,
    loadingRules,
    extensionLoadingRules,
    overridesTemplate,
    projectOverviewTemplate,
    prdTemplate,
    traceabilityTemplate,
    decisionLogTemplate,
    agentsTemplate,
    stackInputsTemplate,
    directoryPlanTemplate,
    directorySynthesisRules,
    executionFlowSpec
  );

  if (docsProjectOverview) {
    mustContain(docsProjectOverview, "LMS", "project overview doc lms field");
    mustContain(docsProjectOverview, "回滚", "project overview doc rollback field");
  }
  if (docsPrd) {
    mustContain(docsPrd, "LMS", "prd doc lms field");
    mustContain(docsPrd, "修订", "prd doc revision field");
  }
  if (docsTraceability) {
    mustContain(docsTraceability, "版本", "traceability doc version field");
    mustContain(docsTraceability, "回滚", "traceability doc rollback field");
  }
  if (docsHandoff) {
    mustContain(docsHandoff, "Frozen Version", "session handoff frozen version field");
    mustContain(docsHandoff, "Rollback Point", "session handoff rollback point field");
  }
  if (docsDecision) {
    mustContain(docsDecision, "LMS", "decision log doc lms field");
    mustContain(docsDecision, "回滚", "decision log doc rollback field");
  }
  if (docsOverrides) {
    mustContain(docsOverrides, "MCP", "project overrides doc mcp field");
    mustContain(docsOverrides, "版本锁", "project overrides doc version lock field");
  }

  console.log("workflow contract validation passed");
}

main();
