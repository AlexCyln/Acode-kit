#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

function runEntry(args, cwd) {
  const proc = spawnSync("node", ["scripts/acode-run.mjs", ...args], {
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

function parseRouterPayload(envelope) {
  return JSON.parse(envelope.routerStdout || "{}");
}

function main() {
  const repoRoot = process.cwd();
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "acode-entry-test-"));
  const stateFile = path.join(tempRoot, "state.json");
  const logFile = path.join(tempRoot, "execution.jsonl");

  const common = ["--project-id", "entry-test", "--provider", "codex", "--dry-run", "true", "--state", stateFile, "--log", logFile, "--cwd", repoRoot];

  // Case 1: summary/report prompt should classify to document flow.
  const case1 = runEntry([
    ...common,
    "--prompt", "请输出本轮总结报告并更新handoff"
  ], repoRoot);
  assert.equal(case1.proc.status, 0, case1.proc.stderr);
  assert.ok(case1.output, "case1 envelope parse failed");
  assert.equal(case1.output.route.phase, "文档");
  assert.equal(case1.output.route.taskType, "文档撰写");
  const payload1 = parseRouterPayload(case1.output);
  assert.equal(payload1.selectedModel, "gpt-5.2-codex");

  // Case 2: coding prompt should classify to implementation flow.
  const case2 = runEntry([
    ...common,
    "--prompt", "请开发后端API和前端页面联动"
  ], repoRoot);
  assert.equal(case2.proc.status, 0, case2.proc.stderr);
  assert.ok(case2.output, "case2 envelope parse failed");
  assert.equal(case2.output.route.phase, "实现");
  assert.equal(case2.output.route.taskType, "前后端编码开发");
  const payload2 = parseRouterPayload(case2.output);
  assert.equal(payload2.selectedModel, "gpt-5.4-codex");

  console.log("entry tests passed");
}

main();
