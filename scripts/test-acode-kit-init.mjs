#!/usr/bin/env node
/**
 * Tests for acode-kit-init.mjs
 *
 * Validates:
 * 1. Empty folder init → generates status file with wasEmpty=true
 * 2. Non-empty folder init → wasEmpty=false
 * 3. Duplicate init without --force → exits with message
 * 4. --force re-initialization → overwrites status file
 * 5. Exit code is 0
 * 6. Status file has correct structure (tools, notebookLM, etc.)
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const initScript = path.join(__dirname, "acode-kit-init.mjs");
const STATUS_FILE = ".acode-kit-initialized.json";

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed += 1;
  } else {
    failed += 1;
    console.error(`  FAIL: ${label}`);
  }
}

function createTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `acode-init-test-${prefix}-`));
}

function runInit(cwd, extraArgs = []) {
  return spawnSync("node", [initScript, "--cwd", cwd, "--provider", "codex", "--yes", ...extraArgs], {
    encoding: "utf8",
    timeout: 60_000
  });
}

// ---------------------------------------------------------------------------
// Test 1: Empty folder init → status file with wasEmpty=true
// ---------------------------------------------------------------------------
{
  const tmpDir = createTempDir("empty");

  try {
    const result = runInit(tmpDir);
    assert(result.status === 0, "Empty folder init exits with code 0");

    const statusPath = path.join(tmpDir, STATUS_FILE);
    assert(fs.existsSync(statusPath), "Status file created in empty folder");

    const status = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    assert(status.version === "1.0.0", "Status file has version 1.0.0");
    assert(status.projectFolder.wasEmpty === true, "wasEmpty is true for empty folder");
    assert(status.projectFolder.path === tmpDir, "projectFolder.path matches cwd");
    assert(typeof status.initializedAt === "string", "Has initializedAt timestamp");
    assert(typeof status.provider === "string", "Has provider field");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 2: Non-empty folder init → wasEmpty=false
// ---------------------------------------------------------------------------
{
  const tmpDir = createTempDir("nonempty");
  // Create a file to make it non-empty
  fs.writeFileSync(path.join(tmpDir, "existing-file.txt"), "hello");

  try {
    const result = runInit(tmpDir);
    assert(result.status === 0, "Non-empty folder init exits with code 0");

    const statusPath = path.join(tmpDir, STATUS_FILE);
    assert(fs.existsSync(statusPath), "Status file created in non-empty folder");

    const status = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    assert(status.projectFolder.wasEmpty === false, "wasEmpty is false for non-empty folder");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 3: Duplicate init without --force → exits without error
// ---------------------------------------------------------------------------
{
  const tmpDir = createTempDir("duplicate");

  try {
    // First init
    const first = runInit(tmpDir);
    assert(first.status === 0, "First init succeeds");

    const statusPath = path.join(tmpDir, STATUS_FILE);
    assert(fs.existsSync(statusPath), "Status file exists after first init");

    // Save original timestamp
    const originalStatus = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    const originalTime = originalStatus.initializedAt;

    // Second init without --force
    const second = runInit(tmpDir);
    assert(second.status === 0, "Duplicate init exits with code 0");
    assert(
      second.stdout.includes("already initialized"),
      "Duplicate init shows 'already initialized' message"
    );

    // Status file should be unchanged
    const unchangedStatus = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    assert(
      unchangedStatus.initializedAt === originalTime,
      "Status file unchanged by duplicate init"
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 4: --force re-initialization → overwrites status file
// ---------------------------------------------------------------------------
{
  const tmpDir = createTempDir("force");

  try {
    // First init
    const first = runInit(tmpDir);
    assert(first.status === 0, "First init for force test succeeds");

    const statusPath = path.join(tmpDir, STATUS_FILE);
    const originalStatus = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    const originalTime = originalStatus.initializedAt;

    // Wait a tiny bit to ensure timestamp differs
    const start = Date.now();
    while (Date.now() - start < 50) { /* busy wait */ }

    // Re-init with --force
    const forced = runInit(tmpDir, ["--force"]);
    assert(forced.status === 0, "--force re-init exits with code 0");

    const newStatus = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    assert(
      newStatus.initializedAt !== originalTime,
      "--force creates new timestamp (file was overwritten)"
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 5: Status file structure validation
// ---------------------------------------------------------------------------
{
  const tmpDir = createTempDir("structure");

  try {
    runInit(tmpDir);

    const statusPath = path.join(tmpDir, STATUS_FILE);
    const status = JSON.parse(fs.readFileSync(statusPath, "utf8"));

    // Tools array
    assert(Array.isArray(status.tools), "Status has tools array");
    assert(status.tools.length === 4, "Tools array has 4 entries");

    for (const tool of status.tools) {
      assert(typeof tool.id === "string", `Tool has id: ${tool.id}`);
      assert(typeof tool.name === "string", `Tool ${tool.id} has name`);
      assert(
        ["installed", "missing"].includes(tool.status),
        `Tool ${tool.id} has valid status: ${tool.status}`
      );
    }

    const ids = status.tools.map((t) => t.id);
    assert(ids.includes("pencil"), "Tools include pencil");
    assert(ids.includes("notebooklm"), "Tools include notebooklm");
    assert(ids.includes("shadcn"), "Tools include shadcn");
    assert(ids.includes("chrome-devtools"), "Tools include chrome-devtools");

    // NotebookLM config
    assert(typeof status.notebookLM === "object", "Status has notebookLM object");
    assert(typeof status.notebookLM.configured === "boolean", "notebookLM has configured field");
    assert(typeof status.notebookLM.authCompleted === "boolean", "notebookLM has authCompleted field");
    assert(typeof status.notebookLM.notebookUrl === "string", "notebookLM has notebookUrl");
    assert(
      status.notebookLM.notebookUrl.includes("notebooklm.google.com"),
      "notebookUrl contains expected domain"
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 6: Non-existent cwd is created automatically
// ---------------------------------------------------------------------------
{
  const tmpDir = path.join(os.tmpdir(), `acode-init-test-newdir-${Date.now()}`);

  try {
    assert(!fs.existsSync(tmpDir), "Target dir does not exist before init");

    const result = runInit(tmpDir);
    assert(result.status === 0, "Init with non-existent cwd exits with code 0");
    assert(fs.existsSync(tmpDir), "Target dir was created by init");
    assert(
      fs.existsSync(path.join(tmpDir, STATUS_FILE)),
      "Status file created in newly created dir"
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\nacode-kit-init tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
