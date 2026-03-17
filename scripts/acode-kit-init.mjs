#!/usr/bin/env node
/**
 * Acode-kit Init — One-time environment initialization
 *
 * Decouples environment setup from per-project usage:
 *   1. Check project folder → 2. Scan MCP tools → 3. Install missing →
 *   4. Verify → 5. Configure NotebookLM → 6. Write status file
 *
 * Usage:
 *   node scripts/acode-kit-init.mjs [options]
 *
 * Options:
 *   --cwd PATH            Working directory (defaults to cwd)
 *   --provider codex|claude  Target provider (auto-detected if omitted)
 *   --yes                 Skip confirmation prompts (auto-approve installs)
 *   --force               Re-initialize even if already initialized
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATUS_FILE = ".acode-kit-initialized.json";
const VERSION = "1.0.0";
const IS_WIN = os.platform() === "win32";

/** Cross-platform spawnSync — on Windows, uses shell mode so .cmd/.bat wrappers resolve. */
function spawnCrossPlatform(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    ...opts,
    shell: IS_WIN,
    windowsHide: true
  });
}

// ---------------------------------------------------------------------------
// CLI argument parser
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = "true";
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function prompt(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

function isFolderEmpty(dir) {
  if (!fs.existsSync(dir)) return true;
  const entries = fs.readdirSync(dir).filter((e) => !e.startsWith("."));
  return entries.length === 0;
}

// ---------------------------------------------------------------------------
// Step 1: Check project folder
// ---------------------------------------------------------------------------

function checkFolder(cwd) {
  const wasEmpty = isFolderEmpty(cwd);
  console.log(`Project folder: ${cwd}`);
  console.log(`  Status: ${wasEmpty ? "empty (new project)" : "has existing files"}`);
  return { wasEmpty, path: cwd };
}

// ---------------------------------------------------------------------------
// Step 2: Scan MCP tools (delegates to mcp-tool-scan.mjs)
// ---------------------------------------------------------------------------

function scanTools(provider) {
  const scanScript = path.join(__dirname, "mcp-tool-scan.mjs");
  const args = ["--json"];
  if (provider) args.push("--provider", provider);

  const result = spawnCrossPlatform("node", [scanScript, ...args], {
    encoding: "utf8",
    timeout: 60_000
  });

  if (result.status !== 0 && result.status !== 1) {
    console.error("Tool scan failed:", result.stderr || "unknown error");
    return null;
  }

  try {
    return JSON.parse(result.stdout);
  } catch (_) {
    console.error("Failed to parse tool scan output");
    return null;
  }
}

// ---------------------------------------------------------------------------
// Step 3: Install missing tools
// ---------------------------------------------------------------------------

async function installMissingTools(scanResult, provider, autoYes) {
  const missing = scanResult.tools.filter((t) => t.status === "missing");
  if (missing.length === 0) {
    console.log("\nAll MCP tools are installed.");
    return;
  }

  console.log(`\n${missing.length} tool(s) missing:`);
  for (const t of missing) {
    console.log(`  [--] ${t.name} (${t.purpose})`);
    console.log(`       Degradation: ${t.degradation}`);
  }

  let proceed = autoYes;
  if (!proceed) {
    const answer = await prompt("\nInstall missing tools? (y/n, or press Enter to skip): ");
    proceed = answer === "y" || answer === "yes";
  }

  if (!proceed) {
    console.log("Skipping tool installation. Initialization will continue.");
    return;
  }

  // Delegate installation to mcp-tool-scan.mjs --install --yes
  const scanScript = path.join(__dirname, "mcp-tool-scan.mjs");
  const args = ["--install", "--yes"];
  if (provider) args.push("--provider", provider);

  const result = spawnCrossPlatform("node", [scanScript, ...args], {
    encoding: "utf8",
    timeout: 180_000,
    stdio: "inherit"
  });

  if (result.status !== 0 && result.status !== 1) {
    console.error("Installation had errors. Continuing with initialization.");
  }
}

// ---------------------------------------------------------------------------
// Step 4: Re-scan to verify
// ---------------------------------------------------------------------------

function verifyScan(provider) {
  console.log("\nVerifying tool status...");
  const result = scanTools(provider);
  if (!result) return null;

  for (const t of result.tools) {
    const icon = t.status === "installed" ? "[OK]" : "[--]";
    console.log(`  ${icon} ${t.name} (${t.status})`);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Step 5: Configure NotebookLM
// ---------------------------------------------------------------------------

async function configureNotebookLM(scanResult, autoYes) {
  const notebookLM = scanResult.tools.find((t) => t.id === "notebooklm");
  const notebookUrl = "https://notebooklm.google.com/notebook/7ec4ec07-abb3-478e-99aa-f8946e103499";

  if (!notebookLM || notebookLM.status !== "installed") {
    console.log("\nNotebookLM MCP is not installed. Skipping authentication setup.");
    console.log("You can install it later and re-run init with --force.");
    return {
      configured: false,
      authCompleted: false,
      notebookUrl
    };
  }

  console.log("\nNotebookLM MCP is installed.");
  console.log("To complete setup, NotebookLM needs browser authentication.");
  console.log("");
  console.log("When you first use Acode-kit in your AI agent, the agent will");
  console.log('automatically send "Log me in to NotebookLM" to trigger the');
  console.log("authentication page. Complete the sign-in in your browser.");
  console.log("");
  console.log(`NotebookLM URL: ${notebookUrl}`);

  let authCompleted = false;
  if (!autoYes) {
    const answer = await prompt("Have you already authenticated NotebookLM? (y/n): ");
    authCompleted = answer === "y" || answer === "yes";
  }

  return {
    configured: true,
    authCompleted,
    notebookUrl
  };
}

// ---------------------------------------------------------------------------
// Step 6: Write status file
// ---------------------------------------------------------------------------

function writeStatusFile(cwd, data) {
  const statusPath = path.join(cwd, STATUS_FILE);
  const status = {
    version: VERSION,
    initializedAt: new Date().toISOString(),
    provider: data.provider,
    projectFolder: data.projectFolder,
    tools: data.tools,
    notebookLM: data.notebookLM
  };
  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2), "utf8");
  console.log(`\nStatus file written to ${statusPath}`);
  return status;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cwd = path.resolve(args.cwd || process.cwd());
  const provider = args.provider || null;
  const autoYes = args.yes === "true";
  const force = args.force === "true";

  // Check if already initialized
  const statusPath = path.join(cwd, STATUS_FILE);
  if (fs.existsSync(statusPath) && !force) {
    console.log("Acode-kit is already initialized in this directory.");
    console.log(`Status file: ${statusPath}`);
    console.log("Use --force to re-initialize.");
    process.exit(0);
  }

  console.log("Acode-kit Initialization");
  console.log("========================\n");

  // Ensure cwd exists
  if (!fs.existsSync(cwd)) {
    fs.mkdirSync(cwd, { recursive: true });
  }

  // Step 1: Check folder
  const projectFolder = checkFolder(cwd);

  // Step 2: Scan tools
  console.log("\nScanning MCP tools...");
  const initialScan = scanTools(provider);
  if (!initialScan) {
    console.error("Tool scan failed. Please check that mcp-tool-scan.mjs is available.");
    process.exit(1);
  }

  const resolvedProvider = initialScan.provider;
  console.log(`Provider: ${resolvedProvider}`);
  for (const t of initialScan.tools) {
    const icon = t.status === "installed" ? "[OK]" : "[--]";
    console.log(`  ${icon} ${t.name} (${t.status})`);
  }

  // Step 3: Install missing
  await installMissingTools(initialScan, resolvedProvider, autoYes);

  // Step 4: Re-scan
  const finalScan = verifyScan(resolvedProvider) || initialScan;

  // Step 5: Configure NotebookLM
  const notebookLMConfig = await configureNotebookLM(finalScan, autoYes);

  // Step 6: Write status file
  const toolsSummary = finalScan.tools.map((t) => ({
    id: t.id,
    name: t.name,
    status: t.status
  }));

  writeStatusFile(cwd, {
    provider: resolvedProvider,
    projectFolder,
    tools: toolsSummary,
    notebookLM: notebookLMConfig
  });

  console.log("\nInitialization complete!");
  console.log("You can now use Acode-kit to start a project:");
  console.log('  Tell your AI agent: "Use Acode-kit to build [your project idea]"');
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
