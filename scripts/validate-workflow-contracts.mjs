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

function validateMandatoryMcpAndVersionLock(core, claude, skill, overridesTemplate, projectOverviewTemplate, traceabilityTemplate, decisionLogTemplate, agentsTemplate) {
  mustContain(core, "Gate 3.5: LMS tier analysis and confirmation", "workflow core gate 3.5");
  mustContain(core, "NotebookLM authentication exception at Gate 1", "workflow core notebook auth exception");
  mustContain(core, "Do not use Pencil or other design tooling outside Stage 2 and Step 5b", "workflow core pencil boundary");
  mustContain(core, "Step 4 / Stage 4 separation", "workflow core step/stage separation");

  mustContain(claude, "After Gate 3 → Gate 3.5 (LMS tier confirmation) → Step 4 (project setup, NOT design).", "claude gate 3.5 boundary");
  mustContain(claude, "Design tools are ONLY used at Stage 2 (overall UI architecture) and Step 5b (module UI detail design)", "claude pencil boundary");
  mustContain(claude, "Do NOT mention \"Pencil\" or \"design phase\" in Gate 3 questions.", "claude gate 3 pencil ban");
  mustContain(claude, "Do NOT create custom HTML/CSS primitives when shadcn equivalents exist.", "claude shadcn prohibition");

  mustContain(skill, "`Step 4` is not `Stage 4`", "SKILL step/stage separation");
  mustContain(skill, "Pencil/design tools only at Stage 2 and Step 5b", "SKILL pencil boundary");
  mustContain(skill, "Gate 3.5: LMS tier confirmation", "SKILL gate 3.5");

  mustContain(overridesTemplate, "MCP 使用约束", "overrides template mcp field");
  mustContain(overridesTemplate, "版本锁要求", "overrides template version lock");

  mustContain(projectOverviewTemplate, "LMS / 版本治理", "project overview lms section");
  mustContain(projectOverviewTemplate, "激活矩阵", "project overview activation matrix");

  mustContain(traceabilityTemplate, "母规范激活矩阵", "traceability activation matrix");
  mustContain(traceabilityTemplate, "版本与回滚", "traceability version rollback");

  mustContain(decisionLogTemplate, "LMS 档位", "decision log lms field");
  mustContain(decisionLogTemplate, "冻结版本", "decision log frozen version");
  mustContain(decisionLogTemplate, "是否导致旧版本失效", "decision log invalidation field");

  mustContain(agentsTemplate, "PRD 确认后必须执行 `Gate 3.5`", "agents template gate 3.5");
  mustContain(agentsTemplate, "已批准页面、API、数据结构和模块说明一旦修订，旧版本立即失效", "agents template version lock");
  mustContain(agentsTemplate, "NotebookLM / Pencil / shadcn / Chrome DevTools 在命中的节点必须作为强制消费型 MCP 使用", "agents template mcp enforcement");
}

function validateSlimSkill(skill) {
  const lineCount = skill.split("\n").length;
  assert.ok(lineCount >= 120 && lineCount <= 150, `SKILL line count out of range: ${lineCount}`);
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
  const overridesTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PROJECT_OVERRIDES.template.md"));
  const projectOverviewTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "PROJECT_OVERVIEW.template.md"));
  const traceabilityTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "TRACEABILITY_MATRIX.template.md"));
  const decisionLogTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "DECISION_LOG.template.md"));
  const agentsTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "AGENTS.template.md"));
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
    overridesTemplate,
    projectOverviewTemplate,
    traceabilityTemplate,
    decisionLogTemplate,
    agentsTemplate
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
