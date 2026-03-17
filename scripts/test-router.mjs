#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

function runRouter(args, cwd) {
  const proc = spawnSync("node", ["scripts/router-exec.mjs", ...args], {
    cwd,
    encoding: "utf8"
  });
  let output = null;
  try {
    output = JSON.parse(proc.stdout || "{}");
  } catch {
    output = null;
  }
  return { proc, output };
}

function main() {
  const repoRoot = process.cwd();
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "acode-router-test-"));
  const stateFile = path.join(tempRoot, "state.json");
  const logFile = path.join(tempRoot, "execution.jsonl");

  const common = ["--dry-run", "true", "--state", stateFile, "--log", logFile, "--cwd", repoRoot];

  // Case 1: codex high-difficulty implementation maps to gpt-5.4-codex
  const case1 = runRouter([
    "--provider", "codex",
    "--project-id", "proj-A",
    "--phase", "实现",
    "--task-type", "前后端编码开发",
    "--difficulty", "high",
    "--context-summary", "REQ-100",
    "--prompt", "Implement vertical slice",
    ...common
  ], repoRoot);
  assert.equal(case1.proc.status, 0, case1.proc.stderr);
  assert.ok(case1.output, "case1 output JSON parse failed");
  assert.equal(case1.output.selectedModel, "gpt-5.4-codex");
  assert.equal(case1.output.logicalSessionId, "proj-A:实现");

  // Case 2: claude low-difficulty documentation maps to claude-haiku-4-5
  const case2 = runRouter([
    "--provider", "claude",
    "--project-id", "proj-B",
    "--phase", "文档",
    "--task-type", "文档撰写",
    "--difficulty", "low",
    "--context-summary", "REQ-200",
    "--prompt", "Write release notes",
    ...common
  ], repoRoot);
  assert.equal(case2.proc.status, 0, case2.proc.stderr);
  assert.ok(case2.output, "case2 output JSON parse failed");
  assert.equal(case2.output.selectedModel, "claude-haiku-4-5");
  assert.equal(case2.output.logicalSessionId, "proj-B:文档");

  // Case 3: budget warning triggers downgrade to fallback in implementation phase
  const seededState = {
    logicalSessions: {},
    usage: {
      totalTokens: 40000,
      phaseTokens: {
        "实现": 39000
      }
    }
  };
  fs.writeFileSync(stateFile, JSON.stringify(seededState, null, 2));
  const case3 = runRouter([
    "--provider", "codex",
    "--project-id", "proj-C",
    "--phase", "实现",
    "--task-type", "前后端编码开发",
    "--difficulty", "high",
    "--context-summary", "REQ-300",
    "--prompt", "Implement with budget pressure",
    ...common
  ], repoRoot);
  assert.equal(case3.proc.status, 0, case3.proc.stderr);
  assert.ok(case3.output, "case3 output JSON parse failed");
  assert.equal(case3.output.selectedModel, "gpt-5.3-codex");
  assert.equal(case3.output.finalModel, "gpt-5.3-codex");

  const finalState = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  assert.ok(finalState.logicalSessions["proj-C:实现"], "state missing logical session mapping");

  console.log("router tests passed");
}

main();
