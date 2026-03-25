#!/usr/bin/env node
/**
 * MCP Tool Scanner & Installer
 *
 * Implements the auto-install flow from 31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md:
 *   1. Scan → 2. Detect missing → 3. Suggest install → 4. User authorize →
 *   5. Execute install → 6. Verify → 7. Record results
 *
 * Usage:
 *   node scripts/mcp-tool-scan.mjs [options]
 *
 * Options:
 *   --provider codex|claude     Target provider (auto-detected if omitted)
 *   --install                   Attempt to install missing tools (interactive)
 *   --json                      Output results as JSON
 *   --output PATH               Write status report to file
 *   --yes                       Skip confirmation prompts (auto-approve installs)
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline";

const VERSION = "1.0.0";
const WORKSPACE_STATUS_FILE = ".acode-kit-initialized.json";
const GLOBAL_STATUS_FILE = ".acode-kit-global.json";
const DEFAULT_NOTEBOOK_URL = "https://notebooklm.google.com/notebook/7ec4ec07-abb3-478e-99aa-f8946e103499";
const DEFAULT_AUTH_PROMPT = "Log me in to NotebookLM";

// ---------------------------------------------------------------------------
// Tool registry (mirrors 31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md)
// ---------------------------------------------------------------------------

const TOOL_REGISTRY = [
  {
    id: "pencil",
    name: "Pencil MCP",
    purpose: "UI/UX design drafts",
    type: "desktop-app",
    detect: detectPencil,
    install: null, // manual desktop install only
    degradation: "AI-generated text layout descriptions"
  },
  {
    id: "notebooklm",
    name: "NotebookLM MCP",
    purpose: "Requirements analysis & project skeleton",
    type: "mcp-service",
    detect: detectNotebookLM,
    installClaude: ["claude", "mcp", "add", "notebooklm", "npx", "notebooklm-mcp@latest"],
    installCodex: ["codex", "mcp", "add", "notebooklm", "--", "npx", "notebooklm-mcp@latest"],
    degradation: "Direct AI analysis (no NotebookLM enhancement)"
  },
  {
    id: "shadcn",
    name: "shadcn MCP",
    purpose: "UI component library integration",
    type: "mcp-service",
    detect: detectShadcn,
    installClaude: ["npx", "shadcn@latest", "mcp", "init", "--client", "claude"],
    installCodex: null, // requires manual config.toml edit
    installCodexManual: `Add to ~/.codex/config.toml:\n[mcp.servers.shadcn]\ncommand = "npx"\nargs = ["-y", "shadcn@latest", "mcp"]`,
    degradation: "Manual component library setup"
  },
  {
    id: "chrome-devtools",
    name: "Chrome DevTools MCP",
    purpose: "Frontend debugging",
    type: "mcp-service",
    detect: detectChromeDevTools,
    installClaude: ["claude", "mcp", "add", "chrome-devtools", "--scope", "user", "npx", "chrome-devtools-mcp@latest"],
    installCodex: ["codex", "mcp", "add", "chrome-devtools", "--", "npx", "chrome-devtools-mcp@latest"],
    degradation: "Traditional browser developer tools"
  }
];

// ---------------------------------------------------------------------------
// Platform helpers
// ---------------------------------------------------------------------------

const IS_WIN = os.platform() === "win32";

function quoteWindowsArg(value) {
  if (value === "") return '""';
  if (!/[\s"]/u.test(value)) return value;
  return `"${String(value).replace(/(\\*)"/g, '$1$1\\"').replace(/(\\+)$/g, '$1$1')}"`;
}

/** Cross-platform check for whether a CLI command exists on PATH. */
function hasCommand(cmd) {
  const probe = IS_WIN
    ? spawnSync(process.env.comspec || "cmd.exe", ["/d", "/s", "/c", `where ${quoteWindowsArg(cmd)}`], {
      encoding: "utf8",
      windowsHide: true
    })
    : spawnSync("which", [cmd], { encoding: "utf8" });
  return probe.status === 0;
}

/** Cross-platform spawnSync — on Windows, routes through cmd.exe without using shell:true. */
function spawnCrossPlatform(cmd, args, opts = {}) {
  if (IS_WIN) {
    const commandLine = [cmd, ...args].map(quoteWindowsArg).join(" ");
    return spawnSync(process.env.comspec || "cmd.exe", ["/d", "/s", "/c", commandLine], {
      ...opts,
      shell: false,
      windowsHide: true
    });
  }

  return spawnSync(cmd, args, opts);
}

function safeRemoveDir(targetDir) {
  const maxAttempts = IS_WIN ? 6 : 1;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      fs.rmSync(targetDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 150 });
      return { success: true, attempts: attempt };
    } catch (error) {
      lastError = error;
      if (!IS_WIN || (error.code !== "EPERM" && error.code !== "EBUSY")) {
        break;
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200 * attempt);
    }
  }

  return { success: false, error: lastError };
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return null;
  }
}

function writeJsonFile(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function resolveGlobalStateDir(provider) {
  const baseHome = provider === "claude"
    ? (process.env.CLAUDE_HOME || path.join(os.homedir(), ".claude"))
    : (process.env.CODEX_HOME || path.join(os.homedir(), ".codex"));
  return path.join(baseHome, "acode-kit");
}

function resolveGlobalStatusPath(provider) {
  return path.join(resolveGlobalStateDir(provider), GLOBAL_STATUS_FILE);
}

// ---------------------------------------------------------------------------
// Detection functions
// ---------------------------------------------------------------------------

function detectPencil() {
  const platform = os.platform();
  if (platform === "darwin") {
    return fs.existsSync("/Applications/Pencil.app");
  }
  if (platform === "win32") {
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
    const programFiles = process.env.ProgramFiles || "C:\\Program Files";
    const programFilesX86 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
    return (
      fs.existsSync(path.join(localAppData, "Programs", "Pencil")) ||
      fs.existsSync(path.join(programFiles, "Pencil")) ||
      fs.existsSync(path.join(programFilesX86, "Pencil"))
    );
  }
  // Linux: check common paths
  const linuxPaths = ["/usr/bin/pencil", "/usr/local/bin/pencil", "/opt/pencil/pencil"];
  return linuxPaths.some((p) => fs.existsSync(p));
}

function readCodexConfig() {
  const configPath = path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "config.toml");
  if (!fs.existsSync(configPath)) return "";
  return fs.readFileSync(configPath, "utf8");
}

function readClaudeMcpConfig() {
  // Claude Code stores MCP config in several possible locations
  const candidates = [
    path.join(process.env.CLAUDE_HOME || path.join(os.homedir(), ".claude"), "claude_mcp_config.json"),
    path.join(process.env.CLAUDE_HOME || path.join(os.homedir(), ".claude"), "mcp.json"),
    path.join(process.env.CLAUDE_HOME || path.join(os.homedir(), ".claude"), "settings.json"),
    path.join(process.cwd(), ".mcp.json")
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        return { path: candidate, content: JSON.parse(fs.readFileSync(candidate, "utf8")) };
      } catch (_) { /* not valid JSON */ }
    }
  }
  return null;
}

function codexHasMcpServer(serverName) {
  const config = readCodexConfig();
  // TOML: look for [mcp_servers.<name>] or [mcp.servers.<name>]
  const patterns = [
    new RegExp(`\\[mcp_servers\\.${serverName}\\]`, "i"),
    new RegExp(`\\[mcp\\.servers\\.${serverName}\\]`, "i")
  ];
  return patterns.some((p) => p.test(config));
}

function claudeHasMcpServer(serverName) {
  const mcpConfig = readClaudeMcpConfig();
  if (!mcpConfig) return false;
  const content = mcpConfig.content;
  // Check common structures: { mcpServers: { name: ... } } or { permissions: { allow: ["mcp__name"] } }
  if (content.mcpServers && content.mcpServers[serverName]) return true;
  if (content.permissions && content.permissions.allow) {
    return content.permissions.allow.some((p) => p === `mcp__${serverName}` || p.startsWith(`mcp__${serverName}__`));
  }
  return false;
}

function detectNotebookLM(provider) {
  if (provider === "codex") return codexHasMcpServer("notebooklm");
  if (provider === "claude") return claudeHasMcpServer("notebooklm");
  return codexHasMcpServer("notebooklm") || claudeHasMcpServer("notebooklm");
}

function detectShadcn(provider) {
  if (provider === "codex") return codexHasMcpServer("shadcn");
  if (provider === "claude") return claudeHasMcpServer("shadcn");
  return codexHasMcpServer("shadcn") || claudeHasMcpServer("shadcn");
}

function detectChromeDevTools(provider) {
  if (provider === "codex") return codexHasMcpServer("chrome-devtools");
  if (provider === "claude") return claudeHasMcpServer("chrome-devtools");
  return codexHasMcpServer("chrome-devtools") || claudeHasMcpServer("chrome-devtools");
}

function loadGlobalCache(provider) {
  if (!provider || provider === "both") return null;
  return readJsonIfExists(resolveGlobalStatusPath(provider));
}

function loadWorkspaceStatus(cwd) {
  return readJsonIfExists(path.join(cwd, WORKSPACE_STATUS_FILE));
}

function buildGlobalCache(provider, scanResults, previousGlobalCache = null, workspaceStatus = null) {
  const notebookTool = scanResults.find((tool) => tool.id === "notebooklm");
  const notebookPreviouslyAuthenticated = Boolean(
    previousGlobalCache?.notebookLM?.authCompleted || workspaceStatus?.notebookLM?.authCompleted
  );

  return {
    version: VERSION,
    updatedAt: new Date().toISOString(),
    provider,
    tools: scanResults.map((tool) => ({
      id: tool.id,
      name: tool.name,
      status: tool.status
    })),
    notebookLM: {
      configured: Boolean(notebookTool && notebookTool.status === "installed"),
      authCompleted: notebookPreviouslyAuthenticated,
      notebookUrl: previousGlobalCache?.notebookLM?.notebookUrl
        || workspaceStatus?.notebookLM?.notebookUrl
        || DEFAULT_NOTEBOOK_URL,
      authPrompt: previousGlobalCache?.notebookLM?.authPrompt
        || workspaceStatus?.notebookLM?.authPrompt
        || DEFAULT_AUTH_PROMPT
    }
  };
}

function syncGlobalCache(provider, scanResults, cwd = process.cwd()) {
  if (!provider || provider === "both") return null;
  const previous = loadGlobalCache(provider);
  const workspaceStatus = loadWorkspaceStatus(cwd);
  const next = buildGlobalCache(provider, scanResults, previous, workspaceStatus);
  writeJsonFile(resolveGlobalStatusPath(provider), next);
  return next;
}

// ---------------------------------------------------------------------------
// Provider detection
// ---------------------------------------------------------------------------

function detectProvider() {
  const hasCodex = hasCommand("codex");
  const hasClaude = hasCommand("claude");
  if (hasCodex && hasClaude) return "both";
  if (hasCodex) return "codex";
  if (hasClaude) return "claude";
  return null;
}

// ---------------------------------------------------------------------------
// Step 1 & 2: Scan and detect missing
// ---------------------------------------------------------------------------

function scanTools(provider) {
  const results = [];
  for (const tool of TOOL_REGISTRY) {
    const detected = tool.detect(provider);
    results.push({
      id: tool.id,
      name: tool.name,
      purpose: tool.purpose,
      type: tool.type,
      status: detected ? "installed" : "missing",
      degradation: tool.degradation
    });
  }
  return results;
}

// ---------------------------------------------------------------------------
// Step 3: Suggest installation
// ---------------------------------------------------------------------------

function getInstallCommand(tool, provider) {
  if (provider === "claude" && tool.installClaude) return tool.installClaude;
  if (provider === "codex" && tool.installCodex) return tool.installCodex;
  return null;
}

function getManualInstructions(tool, provider) {
  if (tool.type === "desktop-app") return `Download from ${tool.id === "pencil" ? "https://www.pencil.dev/" : "the official website"}`;
  if (provider === "codex" && tool.installCodexManual) return tool.installCodexManual;
  return null;
}

function suggestInstalls(scanResults, provider) {
  const missing = scanResults.filter((r) => r.status === "missing");
  if (missing.length === 0) return [];

  const suggestions = [];
  for (const result of missing) {
    const tool = TOOL_REGISTRY.find((t) => t.id === result.id);
    const cmd = getInstallCommand(tool, provider);
    const manual = getManualInstructions(tool, provider);
    suggestions.push({
      id: result.id,
      name: result.name,
      command: cmd,
      manualInstructions: manual,
      canAutoInstall: cmd !== null
    });
  }
  return suggestions;
}

// ---------------------------------------------------------------------------
// Step 4 & 5: User authorization + execute install
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

async function installTool(suggestion, provider, tmpDir) {
  if (!suggestion.canAutoInstall) {
    return { id: suggestion.id, success: false, reason: "manual_only", instructions: suggestion.manualInstructions };
  }

  const cmd = suggestion.command;
  const result = spawnCrossPlatform(cmd[0], cmd.slice(1), {
    encoding: "utf8",
    cwd: tmpDir,
    timeout: 120_000,
    env: { ...process.env, npm_config_cache: path.join(tmpDir, ".npm-cache") }
  });

  return {
    id: suggestion.id,
    success: result.status === 0,
    reason: result.status === 0 ? null : "install_failed",
    stdout: result.stdout,
    stderr: result.stderr
  };
}

// ---------------------------------------------------------------------------
// Step 7: Record results
// ---------------------------------------------------------------------------

function formatReport(scanResults, provider, globalCache = null) {
  const lines = [
    "## MCP Tool Status",
    "",
    "| Tool | Status | Purpose | Notes |",
    "|------|--------|---------|-------|"
  ];
  for (const r of scanResults) {
    const notes = r.status === "missing" ? `Degradation: ${r.degradation}` : "-";
    lines.push(`| ${r.name} | ${r.status} | ${r.purpose} | ${notes} |`);
  }
  lines.push("");
  lines.push(`Provider: ${provider || "unknown"}`);
  if (globalCache) {
    lines.push(`Global cache: ${resolveGlobalStatusPath(provider)}`);
    lines.push(`NotebookLM auth remembered: ${globalCache.notebookLM?.authCompleted ? "yes" : "no"}`);
  }
  lines.push(`Scan time: ${new Date().toISOString()}`);
  return lines.join("\n");
}

function formatJson(scanResults, provider) {
  return JSON.stringify({
    provider,
    timestamp: new Date().toISOString(),
    tools: scanResults
  }, null, 2);
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
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outputJson = args.json === "true";
  const doInstall = args.install === "true";
  const autoYes = args.yes === "true";
  const outputPath = args.output || null;

  // Detect provider
  let provider = args.provider || null;
  if (!provider) {
    provider = detectProvider();
  }

  if (!provider) {
    console.error("No provider detected. Install Codex or Claude Code first, or pass --provider.");
    process.exit(1);
  }

  if (doInstall && provider === "both") {
    console.error("Auto-install is ambiguous when both Codex and Claude are detected. Re-run with --provider codex or --provider claude.");
    process.exit(1);
  }

  // Step 1 & 2: Scan
  let scanResults = scanTools(provider);
  const globalCache = provider && provider !== "both"
    ? syncGlobalCache(provider, scanResults, process.cwd())
    : null;

  const missing = scanResults.filter((r) => r.status === "missing");

  if (!outputJson) {
    console.log("Acode-kit MCP Tool Scanner");
    console.log(`Provider: ${provider}`);
    console.log("");
    for (const r of scanResults) {
      const icon = r.status === "installed" ? "[OK]" : "[--]";
      console.log(`  ${icon} ${r.name} (${r.status})`);
    }
    console.log("");
  }

  // Step 3-6: Install flow
  if (doInstall && missing.length > 0) {
    const suggestions = suggestInstalls(scanResults, provider);
    const installable = suggestions.filter((s) => s.canAutoInstall);
    const manualOnly = suggestions.filter((s) => !s.canAutoInstall);

    if (manualOnly.length > 0 && !outputJson) {
      console.log("Manual installation required:");
      for (const s of manualOnly) {
        console.log(`  - ${s.name}: ${s.manualInstructions}`);
      }
      console.log("");
    }

    if (installable.length > 0) {
      if (!outputJson) {
        console.log("Auto-installable tools:");
        for (const s of installable) {
          console.log(`  - ${s.name}: ${s.command.join(" ")}`);
        }
        console.log("");
      }

      let proceed = autoYes;
      if (!proceed) {
        const answer = await prompt("Install missing tools? (y/n): ");
        proceed = answer === "y" || answer === "yes";
      }

      if (proceed) {
        // Create temp directory for install operations
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acode-mcp-install-"));

        try {
          for (const s of installable) {
            if (!outputJson) process.stdout.write(`  Installing ${s.name}...`);
            const result = await installTool(s, provider, tmpDir);
            if (!outputJson) {
              console.log(result.success ? " OK" : ` FAILED (${result.stderr || result.reason})`);
            }
          }
        } finally {
          // Cleanup temp directory. Windows can keep transient handles briefly after npx/npm exits.
          const cleanup = safeRemoveDir(tmpDir);
          if (!outputJson) {
            if (cleanup.success) {
              console.log(`  Temp directory cleaned up.`);
            } else {
              console.log(`  Temp directory cleanup skipped (${cleanup.error?.code || "unknown"}).`);
            }
          }
        }

        // Step 6: Re-scan to verify
        scanResults = scanTools(provider);
        if (!outputJson) {
          console.log("");
          console.log("Post-install scan:");
          for (const r of scanResults) {
            const icon = r.status === "installed" ? "[OK]" : "[--]";
            console.log(`  ${icon} ${r.name} (${r.status})`);
          }
          console.log("");
        }
      }
    }
  } else if (missing.length === 0 && !outputJson) {
    console.log("All registered MCP tools are installed.");
  } else if (missing.length > 0 && !doInstall && !outputJson) {
    console.log(`${missing.length} tool(s) missing. Run with --install to install.`);
  }

  // Step 7: Output
  if (outputJson) {
    const payload = JSON.parse(formatJson(scanResults, provider));
    if (globalCache) {
      payload.globalCache = {
        path: resolveGlobalStatusPath(provider),
        notebookLM: globalCache.notebookLM
      };
    }
    console.log(JSON.stringify(payload, null, 2));
  }

  if (outputPath) {
    const report = formatReport(scanResults, provider, globalCache);
    fs.writeFileSync(outputPath, report, "utf8");
    if (!outputJson) console.log(`Report written to ${outputPath}`);
  }

  // Exit code: 0 if all installed, 1 if any missing
  const finalMissing = scanResults.filter((r) => r.status === "missing").length;
  process.exit(finalMissing > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
