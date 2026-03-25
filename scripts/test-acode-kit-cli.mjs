#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cliScript = path.join(__dirname, "acode-kit.mjs");

function runCli(args, cwd) {
  return spawnSync("node", [cliScript, ...args], {
    cwd,
    encoding: "utf8",
    timeout: 60_000
  });
}

function main() {
  const repoRoot = process.cwd();

  const help = runCli(["-help"], repoRoot);
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /acode-kit -status/, "help should list -status");
  assert.match(help.stdout, /acode-kit -add/, "help should list -add");
  assert.match(help.stdout, /acode-kit -scan/, "help should list -scan");
  assert.match(help.stdout, /acode-kit -remove/, "help should list -remove");

  const status = runCli(["-status"], repoRoot);
  assert.equal(status.status, 0, status.stderr);
  assert.match(status.stdout, /Acode-kit Status/, "status header");
  assert.match(status.stdout, /MCP tool status:/, "status mcp section");

  const scan = runCli(["-scan", "Acode-kit/extensions/packs/frontend-ux-review-pack"], repoRoot);
  assert.equal(scan.status, 0, scan.stderr);
  assert.match(scan.stdout, /Extension admission scan: pass/, "scan should pass");
  assert.match(scan.stdout, /Architecture status: pass/, "scan should show architecture status");

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "acode-cli-test-"));
  const sandboxWorkspace = path.join(tempRoot, "workspace");
  fs.mkdirSync(sandboxWorkspace, { recursive: true });

  const extensionMd = path.join(tempRoot, "demo-third-party-extension.md");
  fs.writeFileSync(
    extensionMd,
    "# Demo Extension\n\nThis extension provides bounded checklist guidance.\n",
    "utf8"
  );

  const add = runCli(["-add", extensionMd], sandboxWorkspace);
  assert.equal(add.status, 0, add.stderr || add.stdout);
  assert.match(add.stdout, /extension installed: demo-third-party-extension/, "add should install extension");
  assert.ok(
    fs.existsSync(path.join(repoRoot, "Acode-kit", "extensions", "packs", "demo-third-party-extension")),
    "installed extension pack should exist"
  );

  const remove = runCli(["-remove", "demo-third-party-extension"], sandboxWorkspace);
  assert.equal(remove.status, 0, remove.stderr || remove.stdout);
  assert.match(remove.stdout, /extension removed: demo-third-party-extension/, "remove should remove extension");
  assert.ok(
    !fs.existsSync(path.join(repoRoot, "Acode-kit", "extensions", "packs", "demo-third-party-extension")),
    "removed extension pack should not exist"
  );

  fs.rmSync(tempRoot, { recursive: true, force: true });
  console.log("acode-kit cli tests passed");
}

main();
