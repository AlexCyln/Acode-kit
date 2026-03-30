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
  const proposal = read(path.join(repoRoot, "docs", "EXISTING_PROJECT_ONBOARDING_PROPOSAL.md"));
  const core = read(path.join(repoRoot, "Acode-kit", "integrations", "shared", "WORKFLOW_CORE.md"));
  const codex = read(path.join(repoRoot, "Acode-kit", "integrations", "codex", "acode-kit.md"));
  const claude = read(path.join(repoRoot, "Acode-kit", "integrations", "claude", "acode-kit.md"));

  const transitions = [
    { from: "step-1", input: "existing-project-confirmed", to: "o1" },
    { from: "o1", input: "gate-o1-approved", to: "o2" },
    { from: "o2", input: "gate-o2-approved", to: "o3" },
    { from: "o3", input: "gate-o3-approved", to: "o4" },
    { from: "o4", input: "gate-o4-approved", to: "stage-1" }
  ];

  const allowedTransitionSet = new Set(
    transitions.map(({ from, to }) => `${from}->${to}`)
  );

  for (const [from, to] of [
    ["step-1", "step-2"],
    ["o1", "stage-1"],
    ["o2", "step-4a"],
    ["o3", "stage-5d"],
    ["o4", "stage-2"]
  ]) {
    assert.ok(!allowedTransitionSet.has(`${from}->${to}`), `forbidden onboarding jump should not be allowed: ${from} -> ${to}`);
  }

  mustContain(workflow, "Gate O4: explicit user approval", "workflow gate o4");
  mustContain(workflow, "only after Gate O4 approval may the project enter Stage 1", "workflow o4 to stage1 boundary");
  mustContain(workflow, "AGENTS.md", "workflow continuity docs");
  mustContain(workflow, "determine the real platform shape early", "workflow platform fit");
  mustContain(core, "After Gate O4 is approved, the project may enter the shared stage-driven execution workflow at Stage 1.", "shared core onboarding handoff");
  mustContain(core, "must not silently promote subpages", "shared core module-boundary");
  mustContain(codex, "Gate O4 -> Stage 1 only", "codex gate o4 mapping");
  mustContain(codex, "do not assume browser/web scope for native or non-web projects", "codex platform-fit");
  mustContain(claude, "only after Gate O4 approval may the project enter Stage 1", "claude gate o4 handoff");
  mustContain(claude, "do not assume browser/web scope for native or non-web projects", "claude platform-fit");
  mustContain(proposal, "O1 Existing Project Inventory", "proposal O1");
  mustContain(proposal, "O4 Framework Onboarding Materialization", "proposal O4");

  console.log("existing-project onboarding simulation passed");
}

main();
