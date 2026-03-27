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
import { ACODE_KIT_VERSION } from "./acode-kit-version.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const initScript = path.join(__dirname, "acode-kit-init.mjs");
const STATUS_FILE = ".acode-kit-initialized.json";
const GLOBAL_STATUS_FILE = ".acode-kit-global.json";

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

function runInit(cwd, extraArgs = [], env = {}) {
  return spawnSync("node", [initScript, "--cwd", cwd, "--provider", "codex", "--yes", ...extraArgs], {
    encoding: "utf8",
    timeout: 60_000,
    env: { ...process.env, ...env }
  });
}

function getGlobalStatusPath(homeDir) {
  return path.join(homeDir, ".codex", "acode-kit", GLOBAL_STATUS_FILE);
}

// ---------------------------------------------------------------------------
// Test 1: Empty folder init → status file with wasEmpty=true
// ---------------------------------------------------------------------------
{
  const tmpDir = createTempDir("empty");
  const homeDir = createTempDir("home-empty");

  try {
    const result = runInit(tmpDir, [], { HOME: homeDir });
    assert(result.status === 0, "Empty folder init exits with code 0");

    const statusPath = path.join(tmpDir, STATUS_FILE);
    assert(fs.existsSync(statusPath), "Status file created in empty folder");

    const status = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    assert(status.version === ACODE_KIT_VERSION, `Status file has version ${ACODE_KIT_VERSION}`);
    assert(status.scope === "workspace", "Workspace status file is marked as workspace");
    assert(status.projectFolder.wasEmpty === true, "wasEmpty is true for empty folder");
    assert(status.projectFolder.path === tmpDir, "projectFolder.path matches cwd");
    assert(typeof status.initializedAt === "string", "Has initializedAt timestamp");
    assert(typeof status.provider === "string", "Has provider field");

    const globalPath = getGlobalStatusPath(homeDir);
    assert(fs.existsSync(globalPath), "Global MCP cache is created");
    const globalStatus = JSON.parse(fs.readFileSync(globalPath, "utf8"));
    assert(globalStatus.scope === "global", "Global status file is marked as global");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 2: Non-empty folder init → wasEmpty=false
// ---------------------------------------------------------------------------
{
  const tmpDir = createTempDir("nonempty");
  const homeDir = createTempDir("home-nonempty");
  // Create a file to make it non-empty
  fs.writeFileSync(path.join(tmpDir, "existing-file.txt"), "hello");

  try {
    const result = runInit(tmpDir, [], { HOME: homeDir });
    assert(result.status === 0, "Non-empty folder init exits with code 0");

    const statusPath = path.join(tmpDir, STATUS_FILE);
    assert(fs.existsSync(statusPath), "Status file created in non-empty folder");

    const status = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    assert(status.projectFolder.wasEmpty === false, "wasEmpty is false for non-empty folder");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 3: Duplicate init without --force → exits without error
// ---------------------------------------------------------------------------
{
  const tmpDir = createTempDir("duplicate");
  const homeDir = createTempDir("home-duplicate");

  try {
    // First init
    const first = runInit(tmpDir, [], { HOME: homeDir });
    assert(first.status === 0, "First init succeeds");

    const statusPath = path.join(tmpDir, STATUS_FILE);
    assert(fs.existsSync(statusPath), "Status file exists after first init");
    assert(fs.existsSync(getGlobalStatusPath(homeDir)), "Global status file exists after first init");

    // Save original timestamp
    const originalStatus = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    const originalTime = originalStatus.initializedAt;

    // Second init without --force
    const second = runInit(tmpDir, [], { HOME: homeDir });
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
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 4: --force re-initialization → overwrites status file
// ---------------------------------------------------------------------------
{
  const tmpDir = createTempDir("force");
  const homeDir = createTempDir("home-force");

  try {
    // First init
    const first = runInit(tmpDir, [], { HOME: homeDir });
    assert(first.status === 0, "First init for force test succeeds");

    const statusPath = path.join(tmpDir, STATUS_FILE);
    const originalStatus = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    const originalTime = originalStatus.initializedAt;

    // Wait a tiny bit to ensure timestamp differs
    const start = Date.now();
    while (Date.now() - start < 50) { /* busy wait */ }

    // Re-init with --force
    const forced = runInit(tmpDir, ["--force"], { HOME: homeDir });
    assert(forced.status === 0, "--force re-init exits with code 0");

    const newStatus = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    assert(
      newStatus.initializedAt !== originalTime,
      "--force creates new timestamp (file was overwritten)"
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 5: Status file structure validation
// ---------------------------------------------------------------------------
{
  const tmpDir = createTempDir("structure");
  const homeDir = createTempDir("home-structure");

  try {
    runInit(tmpDir, [], { HOME: homeDir });

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
    assert(typeof status.notebookLM.authPrompt === "string", "notebookLM has authPrompt");
    assert(status.notebookLM.authPrompt === "Log me in to NotebookLM", "authPrompt matches expected trigger");
    assert(
      status.notebookLM.notebookUrl.includes("notebooklm.google.com"),
      "notebookUrl contains expected domain"
    );

    const globalStatus = JSON.parse(fs.readFileSync(getGlobalStatusPath(homeDir), "utf8"));
    assert(globalStatus.notebookLM.authCompleted === false, "Global auth state starts as false");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 6: Non-existent cwd is created automatically
// ---------------------------------------------------------------------------
{
  const tmpDir = path.join(os.tmpdir(), `acode-init-test-newdir-${Date.now()}`);
  const homeDir = createTempDir("home-newdir");

  try {
    assert(!fs.existsSync(tmpDir), "Target dir does not exist before init");

    const result = runInit(tmpDir, [], { HOME: homeDir });
    assert(result.status === 0, "Init with non-existent cwd exits with code 0");
    assert(fs.existsSync(tmpDir), "Target dir was created by init");
    assert(
      fs.existsSync(path.join(tmpDir, STATUS_FILE)),
      "Status file created in newly created dir"
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 7: NotebookLM auth state can be persisted globally and reused
// ---------------------------------------------------------------------------
{
  const tmpDir = createTempDir("auth-persist");
  const homeDir = createTempDir("home-auth-persist");

  try {
    const first = runInit(tmpDir, ["--notebooklm-auth-completed"], { HOME: homeDir });
    assert(first.status === 0, "Init with NotebookLM auth flag exits with code 0");

    const statusPath = path.join(tmpDir, STATUS_FILE);
    const status = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    assert(status.notebookLM.authCompleted === true, "Workspace status records NotebookLM auth as completed");

    const globalPath = getGlobalStatusPath(homeDir);
    const globalStatus = JSON.parse(fs.readFileSync(globalPath, "utf8"));
    assert(globalStatus.notebookLM.authCompleted === true, "Global status records NotebookLM auth as completed");

    const second = runInit(tmpDir, ["--force"], { HOME: homeDir });
    assert(second.status === 0, "Force rerun after auth still exits with code 0");

    const rerunStatus = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    assert(rerunStatus.notebookLM.authCompleted === true, "Force rerun preserves NotebookLM auth state from global cache");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\nacode-kit-init tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
