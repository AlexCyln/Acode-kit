#!/usr/bin/env node
/**
 * Acode-kit — Unified CLI dispatcher
 *
 * Routes subcommands to their respective scripts:
 *   acode-kit init    → acode-kit-init.mjs
 *   acode-kit scan    → mcp-tool-scan.mjs
 *   acode-kit bootstrap → install.mjs (user-level install + init)
 *   acode-kit run     → acode-run.mjs
 *   acode-kit extension-scan → scan-extension-module.mjs
 *   acode-kit extension-activate → activate-extension-module.mjs
 *   acode-kit extension-deactivate → deactivate-extension-module.mjs
 *   acode-kit extension-uninstall → uninstall-extension-module.mjs
 *   acode-kit -status → acode-kit-status.mjs
 *   acode-kit -add <path> → add-extension-module.mjs
 *   acode-kit -enable <name> → activate-extension-module.mjs
 *   acode-kit -disable <name> → deactivate-extension-module.mjs
 *   acode-kit -scan <path> → scan-extension-module.mjs
 *   acode-kit -remove <name> → remove-extension-package.mjs
 *
 * Usage:
 *   acode-kit <command> [options]
 *   acode-kit init --cwd /path --provider codex
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
  bootstrap: { script: "install.mjs", description: "Install Acode-kit to the user environment and initialize it" },
  run: { script: "acode-run.mjs", description: "Execute task via model router" },
  "extension-scan": { script: "scan-extension-module.mjs", description: "Security-scan a custom extension before activation" },
  "extension-activate": { script: "activate-extension-module.mjs", description: "Activate an installed extension for the current project" },
  "extension-deactivate": { script: "deactivate-extension-module.mjs", description: "Deactivate an installed extension for the current project" },
  "extension-uninstall": { script: "uninstall-extension-module.mjs", description: "Deactivate an extension at project level" }
};

const FLAG_COMMANDS = {
  "-status": { script: "acode-kit-status.mjs", mapArgs: () => [] },
  "-add": { script: "add-extension-module.mjs", mapArgs: (argv) => ["--path", argv[3]] },
  "-enable": { script: "activate-extension-module.mjs", mapArgs: (argv) => ["--id", argv[3]] },
  "-disable": { script: "deactivate-extension-module.mjs", mapArgs: (argv) => ["--id", argv[3]] },
  "-scan": { script: "scan-extension-module.mjs", mapArgs: (argv) => ["--path", argv[3]] },
  "-remove": { script: "remove-extension-package.mjs", mapArgs: (argv) => ["--id", argv[3]] },
  "-help": { help: true }
};

function printUsage() {
  console.log("Acode-kit — structured project delivery for AI agents\n");
  console.log("Usage: acode-kit <command> [options]\n");
  console.log("Commands:");
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    console.log(`  ${name.padEnd(10)} ${cmd.description}`);
  }
  console.log("\nExamples:");
  console.log("  acode-kit init                          # Initialize the current environment");
  console.log("  acode-kit bootstrap                     # Install and initialize");
  console.log("  acode-kit scan --json                   # Check MCP tool status");
  console.log("  acode-kit run --project-id my-proj      # Route a task");
  console.log("  acode-kit extension-scan --manifest Acode-kit/extensions/packs/foo/manifest.json");
  console.log("  acode-kit extension-activate --id foo");
  console.log("  acode-kit extension-deactivate --id foo");
  console.log("  acode-kit extension-uninstall --id foo --project-extensions docs/project/PROJECT_EXTENSIONS.md --active-standards docs/project/ACTIVE_STANDARDS.md");
  console.log("");
  console.log("Quick flags:");
  console.log("  acode-kit -status                       # Show version, install basis, project scan, extensions, MCP status");
  console.log("  acode-kit -add ./path/to/ext            # Scan and install a third-party extension");
  console.log("  acode-kit -enable ext-name              # Enable an installed extension in the current project");
  console.log("  acode-kit -disable ext-name             # Disable an installed extension in the current project");
  console.log("  acode-kit -scan ./path/to/ext           # Scan a third-party extension");
  console.log("  acode-kit -remove ext-name              # Remove an installed third-party extension");
  console.log("  acode-kit -help                         # Show help");
}

const subcommand = process.argv[2];

if (!subcommand || subcommand === "--help" || subcommand === "-h") {
  printUsage();
  process.exit(0);
}

if (FLAG_COMMANDS[subcommand]) {
  if (FLAG_COMMANDS[subcommand].help) {
    printUsage();
    process.exit(0);
  }
  const flagCommand = FLAG_COMMANDS[subcommand];
  const mappedArgs = flagCommand.mapArgs(process.argv);
  if (mappedArgs.includes(undefined)) {
    console.error(`Missing required argument for ${subcommand}\n`);
    printUsage();
    process.exit(1);
  }
  const result = spawnSync("node", [path.join(__dirname, flagCommand.script), ...mappedArgs], {
    stdio: "inherit",
    shell: IS_WIN,
    windowsHide: true
  });
  process.exit(result.status ?? 1);
}

const cmd = COMMANDS[subcommand];
if (!cmd) {
  console.error(`Unknown command: ${subcommand}\n`);
  printUsage();
  process.exit(1);
}

const scriptPath = path.join(__dirname, cmd.script);
const args = subcommand === "bootstrap"
  ? ["--source-dir", path.join(__dirname, "..", "Acode-kit"), ...process.argv.slice(3)]
  : process.argv.slice(3);

const result = spawnSync("node", [scriptPath, ...args], {
  stdio: "inherit",
  shell: IS_WIN,
  windowsHide: true
});

process.exit(result.status ?? 1);
