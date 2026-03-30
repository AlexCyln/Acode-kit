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

function main() {
  const repoRoot = process.cwd();
  const workflow = read(path.join(repoRoot, "Acode-kit", "workflows", "existing-project-onboarding.md"));
  const rules = read(path.join(repoRoot, "Acode-kit", "references", "load-rules", "EXISTING_PROJECT_ONBOARDING_RULES.md"));
  const inventoryTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "EXISTING_PROJECT_INVENTORY.template.md"));
  const userAddendumTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "USER_INPUT_ADDENDUM.template.md"));
  const onboardingPrdTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "ONBOARDING_PRD.template.md"));
  const gapTemplate = read(path.join(repoRoot, "Acode-kit", "assets", "project-doc-templates", "ONBOARDING_GAP_ASSESSMENT.template.md"));
  const core = read(path.join(repoRoot, "Acode-kit", "integrations", "shared", "WORKFLOW_CORE.md"));
  const codex = read(path.join(repoRoot, "Acode-kit", "integrations", "codex", "acode-kit.md"));
  const claude = read(path.join(repoRoot, "Acode-kit", "integrations", "claude", "acode-kit.md"));
  const loadingRules = read(path.join(repoRoot, "Acode-kit", "references", "load-rules", "DOCUMENT_LOADING_RULES.md"));

  mustContain(workflow, "O1: existing project inventory", "onboarding workflow O1");
  mustContain(workflow, "O2: user-guided business completion", "onboarding workflow O2");
  mustContain(workflow, "O3: onboarding baseline freeze", "onboarding workflow O3");
  mustContain(workflow, "O4: framework onboarding materialization", "onboarding workflow O4");
  mustContain(workflow, ".acode-kit-onboarding/", "onboarding workflow staging");
  mustContain(workflow, "analyze from easy to hard", "onboarding workflow layered analysis");
  mustContain(workflow, "do not proceed to O3 until the user confirms the addendum is sufficient", "onboarding workflow user addendum gate");
  mustContain(workflow, "AGENTS.md", "onboarding workflow continuity docs");
  mustContain(workflow, "determine the real platform shape early", "onboarding workflow platform fit");
  mustContain(workflow, "do not silently promote subpages", "onboarding workflow module boundary");

  mustContain(rules, "user-guided completion step", "onboarding rules user-guided completion");
  mustContain(rules, "do not turn directory names", "onboarding rules low-guessing");
  mustContain(rules, "`confirmed`", "onboarding rules confirmed status");
  mustContain(rules, "`inferred`", "onboarding rules inferred status");
  mustContain(rules, "`pending-user-confirmation`", "onboarding rules pending status");
  mustContain(rules, "do not deep-scan multiple major modules in one pass", "onboarding rules batching");
  mustContain(rules, "Prior continuity-doc priority rule", "onboarding rules continuity-doc section");
  mustContain(rules, "`SESSION_HANDOFF.md`", "onboarding rules continuity-doc examples");
  mustContain(rules, "do not assume an existing project is a web application", "onboarding rules platform-fit");
  mustContain(rules, "do not promote subpages, entry points, dialogs, or route destinations", "onboarding rules module-boundary");

  mustContain(inventoryTemplate, "低置信度项", "inventory template low confidence section");
  mustContain(inventoryTemplate, "待用户确认项", "inventory template pending section");
  mustContain(inventoryTemplate, "过往 agent / session 连续性文档", "inventory template continuity-doc section");
  mustContain(userAddendumTemplate, "项目实际业务目标", "user addendum business goal");
  mustContain(userAddendumTemplate, "核心业务流程", "user addendum business flow");
  mustContain(userAddendumTemplate, "当前核心功能模块", "user addendum modules");
  mustContain(onboardingPrdTemplate, "当前系统事实", "onboarding prd current facts");
  mustContain(onboardingPrdTemplate, "用户补录事实", "onboarding prd user facts");
  mustContain(gapTemplate, "当前缺口", "gap template gap section");

  mustContain(core, "Gate O4", "shared core gate O4");
  mustContain(core, "If prior continuity docs such as `AGENTS.md`, `SESSION_HANDOFF.md`, `TASK_LOG.md`, or `NEXT_STEPS.md` exist", "shared core continuity-doc priority");
  mustContain(core, "identify the real project platform", "shared core platform identification");
  mustContain(core, "must not silently promote subpages", "shared core module-boundary");
  mustContain(codex, "Gate 1 -> O1 only for existing-project onboarding mode", "codex onboarding mapping");
  mustContain(codex, "read them with high priority during O1", "codex continuity-doc priority");
  mustContain(codex, "load `workflows/existing-project-onboarding.md`", "codex onboarding workflow reference");
  mustContain(claude, "EXISTING-PROJECT ONBOARDING MODE", "claude onboarding mode section");
  mustContain(claude, "read them with high priority during O1", "claude continuity-doc priority");
  mustContain(claude, "do not enter greenfield Step 2, Step 3, Step 4a, or Step 4b", "claude onboarding greenfield protection");
  mustContain(loadingRules, ".acode-kit-onboarding/*.md", "document loading onboarding artifacts");
  mustContain(loadingRules, "TASK_LOG.md", "document loading continuity-doc priority");
  mustContain(loadingRules, "do not assume browser/web validation scope", "document loading platform-fit prohibition");
  mustContain(loadingRules, "do not silently promote detail pages", "document loading module-boundary prohibition");

  console.log("existing-project onboarding contract validation passed");
}

main();
