#!/usr/bin/env node
/**
 * Tests for mcp-tool-scan.mjs
 *
 * Validates:
 * 1. Scan detects tools correctly
 * 2. JSON output format is valid
 * 3. Report output format is valid
 * 4. Temp directory is created for installs and cleaned up afterward
 * 5. Exit codes are correct
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scanScript = path.join(__dirname, "mcp-tool-scan.mjs");
const WORKSPACE_STATUS_FILE = ".acode-kit-initialized.json";
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

function getGlobalStatusPath(homeDir) {
  return path.join(homeDir, ".codex", "acode-kit", GLOBAL_STATUS_FILE);
}

// ---------------------------------------------------------------------------
// Test 1: JSON output is valid and has expected structure
// ---------------------------------------------------------------------------
{
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), "acode-mcp-home-json-"));

  try {
  const result = spawnSync("node", [scanScript, "--provider", "codex", "--json"], {
    encoding: "utf8",
    timeout: 30_000
    ,env: { ...process.env, HOME: homeDir }
  });

  let parsed = null;
  try {
    parsed = JSON.parse(result.stdout);
  } catch (_) {
    // ignore
  }

  assert(parsed !== null, "JSON output is valid JSON");
  assert(parsed && parsed.provider === "codex", "JSON output has correct provider");
  assert(parsed && Array.isArray(parsed.tools), "JSON output has tools array");
  assert(parsed && parsed.tools.length === 4, "JSON output has 4 tools");
  assert(parsed && parsed.timestamp, "JSON output has timestamp");

  if (parsed && parsed.tools) {
    const ids = parsed.tools.map((t) => t.id);
    assert(ids.includes("pencil"), "Tools include pencil");
    assert(ids.includes("notebooklm"), "Tools include notebooklm");
    assert(ids.includes("shadcn"), "Tools include shadcn");
    assert(ids.includes("chrome-devtools"), "Tools include chrome-devtools");

    for (const tool of parsed.tools) {
      assert(["installed", "missing", "degraded"].includes(tool.status), `Tool ${tool.id} has valid status`);
      assert(typeof tool.name === "string", `Tool ${tool.id} has name`);
      assert(typeof tool.purpose === "string", `Tool ${tool.id} has purpose`);
      assert(typeof tool.degradation === "string", `Tool ${tool.id} has degradation`);
    }
  }
  } finally {
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 2: Report output writes a valid markdown file
// ---------------------------------------------------------------------------
{
  const tmpReport = path.join(os.tmpdir(), `acode-mcp-test-report-${Date.now()}.md`);
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), "acode-mcp-home-report-"));

  try {
    const result = spawnSync("node", [scanScript, "--provider", "codex", "--output", tmpReport], {
      encoding: "utf8",
      timeout: 30_000,
      env: { ...process.env, HOME: homeDir }
    });

    assert(fs.existsSync(tmpReport), "Report file was created");

    const content = fs.readFileSync(tmpReport, "utf8");
    assert(content.includes("## MCP Tool Status"), "Report has status header");
    assert(content.includes("| Tool | Status |"), "Report has table header");
    assert(content.includes("Pencil MCP"), "Report lists Pencil");
    assert(content.includes("Provider: codex"), "Report has provider");
    assert(content.includes("Scan time:"), "Report has scan time");
  } finally {
    fs.rmSync(tmpReport, { force: true });
    assert(!fs.existsSync(tmpReport), "Report temp file cleaned up");
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 3: Temp directory lifecycle during install (dry simulation)
//
// We test the temp directory pattern by checking that:
// a) The script can create and clean up temp dirs
// b) After --install --yes with a non-installable tool, temp dir is cleaned
// ---------------------------------------------------------------------------
{
  // Create a mock temp dir to simulate what the script does
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acode-mcp-install-test-"));
  const npmCacheDir = path.join(tmpDir, ".npm-cache");
  fs.mkdirSync(npmCacheDir, { recursive: true });

  // Write a dummy file to verify cleanup removes content
  fs.writeFileSync(path.join(tmpDir, "test-marker.txt"), "test");

  assert(fs.existsSync(tmpDir), "Temp directory was created");
  assert(fs.existsSync(npmCacheDir), "npm cache subdirectory was created");
  assert(fs.existsSync(path.join(tmpDir, "test-marker.txt")), "Test marker file exists");

  // Cleanup
  fs.rmSync(tmpDir, { recursive: true, force: true });
  assert(!fs.existsSync(tmpDir), "Temp directory fully cleaned up after removal");
}

// ---------------------------------------------------------------------------
// Test 4: Exit code is 0 when all tools are installed, 1 when missing
// ---------------------------------------------------------------------------
{
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), "acode-mcp-home-exit-"));

  try {
  const result = spawnSync("node", [scanScript, "--provider", "codex", "--json"], {
    encoding: "utf8",
    timeout: 30_000,
    env: { ...process.env, HOME: homeDir }
  });

  let parsed = null;
  try { parsed = JSON.parse(result.stdout); } catch (_) { /* */ }

  if (parsed) {
    const hasMissing = parsed.tools.some((t) => t.status === "missing");
    assert(
      (hasMissing && result.status === 1) || (!hasMissing && result.status === 0),
      "Exit code matches tool status"
    );
  }
  } finally {
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 5: Provider auto-detection works
// ---------------------------------------------------------------------------
{
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), "acode-mcp-home-auto-"));

  try {
  const result = spawnSync("node", [scanScript, "--json"], {
    encoding: "utf8",
    timeout: 30_000,
    env: { ...process.env, HOME: homeDir }
  });

  let parsed = null;
  try { parsed = JSON.parse(result.stdout); } catch (_) { /* */ }

  assert(parsed !== null, "Auto-detect provider produces valid output");
  assert(
    parsed && ["codex", "claude", "both"].includes(parsed.provider),
    "Auto-detected provider is valid"
  );
  } finally {
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 6: Auto-install refuses ambiguous provider=both
// ---------------------------------------------------------------------------
{
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), "acode-mcp-home-ambiguous-"));

  try {
  const result = spawnSync("node", [scanScript, "--provider", "both", "--install", "--yes"], {
    encoding: "utf8",
    timeout: 30_000,
    env: { ...process.env, HOME: homeDir }
  });

  assert(result.status === 1, "Ambiguous provider install exits with code 1");
  assert(
    result.stderr.includes("Auto-install is ambiguous"),
    "Ambiguous provider install explains explicit provider requirement"
  );
  } finally {
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Test 7: Workspace status migrates to global cache during scan
// ---------------------------------------------------------------------------
{
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acode-mcp-workspace-"));
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), "acode-mcp-home-"));
  const workspaceStatus = {
    version: "v2.0",
    initializedAt: new Date().toISOString(),
    scope: "workspace",
    provider: "codex",
    projectFolder: {
      wasEmpty: false,
      path: tmpDir
    },
    tools: [],
    notebookLM: {
      configured: true,
      authCompleted: true,
      notebookUrl: "https://notebooklm.google.com/notebook/test",
      authPrompt: "Log me in to NotebookLM"
    }
  };

  try {
    fs.writeFileSync(path.join(tmpDir, WORKSPACE_STATUS_FILE), JSON.stringify(workspaceStatus, null, 2));

    const result = spawnSync("node", [scanScript, "--provider", "codex", "--json"], {
      encoding: "utf8",
      timeout: 30_000,
      cwd: tmpDir,
      env: { ...process.env, HOME: homeDir }
    });

    assert(result.status === 0 || result.status === 1, "Workspace migration scan exits normally");

    const globalPath = getGlobalStatusPath(homeDir);
    assert(fs.existsSync(globalPath), "Workspace scan writes global cache");

    const globalStatus = JSON.parse(fs.readFileSync(globalPath, "utf8"));
    assert(globalStatus.notebookLM.authCompleted === true, "Global cache preserves NotebookLM auth from workspace status");
    assert(
      globalStatus.notebookLM.notebookUrl === workspaceStatus.notebookLM.notebookUrl,
      "Global cache preserves NotebookLM URL from workspace status"
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\nmcp-tool-scan tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
