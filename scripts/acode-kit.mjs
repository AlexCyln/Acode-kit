#!/usr/bin/env node
/**
 * Acode-kit — Unified CLI dispatcher
 *
 * Routes subcommands to their respective scripts:
 *   acode-kit init    → acode-kit-init.mjs
 *   acode-kit scan    → mcp-tool-scan.mjs
 *   acode-kit run     → acode-run.mjs
 *
 * Usage:
 *   acode-kit <command> [options]
 *   acode-kit init --cwd /path --provider claude
 *   acode-kit scan --json
 *   acode-kit run --project-id my-proj --prompt "..."
 */
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IS_WIN = os.platform() === "win32";

const COMMANDS = {
  init: { script: "acode-kit-init.mjs", description: "Initialize Acode-kit (first-time setup)" },
  scan: { script: "mcp-tool-scan.mjs", description: "Scan MCP tool status" },
  run: { script: "acode-run.mjs", description: "Execute task via model router" }
};

function printUsage() {
  console.log("Acode-kit — AI project delivery framework\n");
  console.log("Usage: acode-kit <command> [options]\n");
  console.log("Commands:");
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    console.log(`  ${name.padEnd(10)} ${cmd.description}`);
  }
  console.log("\nExamples:");
  console.log("  acode-kit init                          # First-time setup");
  console.log("  acode-kit init --provider claude --yes   # Auto-approve installs");
  console.log("  acode-kit scan --json                   # Check MCP tool status");
  console.log("  acode-kit run --project-id my-proj      # Route a task");
}

const subcommand = process.argv[2];

if (!subcommand || subcommand === "--help" || subcommand === "-h") {
  printUsage();
  process.exit(0);
}

const cmd = COMMANDS[subcommand];
if (!cmd) {
  console.error(`Unknown command: ${subcommand}\n`);
  printUsage();
  process.exit(1);
}

const scriptPath = path.join(__dirname, cmd.script);
const args = process.argv.slice(3);

const result = spawnSync("node", [scriptPath, ...args], {
  stdio: "inherit",
  shell: IS_WIN,
  windowsHide: true
});

process.exit(result.status ?? 1);
