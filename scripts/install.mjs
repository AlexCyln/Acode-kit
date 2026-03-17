#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DEFAULT_REPO = "AlexCyln/Acode-kit";
const DEFAULT_SKILL_PATH = "Acode-kit";
const DEFAULT_LOCAL_ROOT = path.join(process.cwd(), "agent-skills");

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

function exists(targetPath) {
  return fs.existsSync(targetPath);
}

function ensureSkill(sourceDir) {
  const skillFile = path.join(sourceDir, "SKILL.md");
  if (!exists(skillFile)) {
    throw new Error(`SKILL.md not found in ${sourceDir}`);
  }
}

function copyDir(sourceDir, destDir) {
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(destDir), { recursive: true });
  fs.cpSync(sourceDir, destDir, { recursive: true });
}

function copyFile(sourceFile, destFile) {
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  fs.copyFileSync(sourceFile, destFile);
}

function copyBundleScripts(sourceDir, bundleDir) {
  const repoRoot = path.dirname(sourceDir);
  const scriptsDir = path.join(repoRoot, "scripts");
  if (!exists(scriptsDir)) return;
  const targetScriptsDir = path.join(bundleDir, "scripts");
  copyDir(scriptsDir, targetScriptsDir);
}

function detectAgentMode() {
  const codexBase = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
  const claudeBase = process.env.CLAUDE_HOME || path.join(os.homedir(), ".claude");
  const hasCodex = exists(codexBase) || exists(path.join(codexBase, "skills"));
  const hasClaude = exists(claudeBase) || exists(path.join(claudeBase, "agents"));

  if (hasCodex && hasClaude) return "both";
  if (hasCodex) return "codex";
  if (hasClaude) return "claude";
  return "local";
}

function createJobs(args) {
  const requestedAgent = args.agent || "auto";
  const scope = args.scope || "user";
  const resolvedAgent = requestedAgent === "auto" ? detectAgentMode() : requestedAgent;

  if (!["auto", "codex", "claude", "local", "both"].includes(requestedAgent)) {
    throw new Error(`Unsupported --agent value: ${requestedAgent}`);
  }
  if (!["user", "project"].includes(scope)) {
    throw new Error(`Unsupported --scope value: ${scope}`);
  }

  const codexRoot = path.resolve(args["dest-dir"] || path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "skills"));
  const claudeRoot = path.resolve(args["dest-dir"] || path.join(scope === "project" ? process.cwd() : (process.env.CLAUDE_HOME || path.join(os.homedir(), ".claude"))));
  const localRoot = path.resolve(args["dest-dir"] || DEFAULT_LOCAL_ROOT);

  if (resolvedAgent === "both") {
    return [
      { agent: "codex", destRoot: codexRoot },
      { agent: "claude", destRoot: claudeRoot }
    ];
  }
  if (resolvedAgent === "codex") return [{ agent: "codex", destRoot: codexRoot }];
  if (resolvedAgent === "claude") return [{ agent: "claude", destRoot: claudeRoot }];
  return [{ agent: "local", destRoot: localRoot }];
}

function prepareSource(args) {
  if (args["source-dir"]) {
    return {
      sourceDir: path.resolve(args["source-dir"]),
      cleanup: null
    };
  }

  const repo = args.repo || DEFAULT_REPO;
  const ref = args.ref || "main";
  const skillPath = args["skill-path"] || DEFAULT_SKILL_PATH;
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acode-kit-"));
  const archiveFile = path.join(tmpDir, "archive.tar.gz");
  const extractDir = path.join(tmpDir, "extract");
  fs.mkdirSync(extractDir, { recursive: true });

  const archiveUrl = `https://codeload.github.com/${repo}/tar.gz/refs/heads/${ref}`;
  execFileSync("curl", ["-fsSL", archiveUrl, "-o", archiveFile], { stdio: "inherit" });
  execFileSync("tar", ["-xzf", archiveFile, "-C", extractDir], { stdio: "inherit" });

  const [repoDirName] = fs.readdirSync(extractDir);
  return {
    sourceDir: path.join(extractDir, repoDirName, skillPath),
    cleanup: () => fs.rmSync(tmpDir, { recursive: true, force: true })
  };
}

function installCodex(sourceDir, destRoot) {
  ensureSkill(sourceDir);
  const bundleDir = path.join(destRoot, path.basename(sourceDir));
  copyDir(sourceDir, bundleDir);
  copyBundleScripts(sourceDir, bundleDir);
  return [`Installed Codex skill to ${bundleDir}`];
}

function installClaude(sourceDir, destRoot) {
  ensureSkill(sourceDir);
  const bundleDir = path.join(destRoot, path.basename(sourceDir));
  const adapterTemplate = path.join(sourceDir, "integrations", "claude", "acode-kit.md");
  const routerAdapterTemplate = path.join(sourceDir, "integrations", "claude", "acode-run.md");
  const initAdapterTemplate = path.join(sourceDir, "integrations", "claude", "acode-init.md");
  const agentFile = path.join(destRoot, "agents", "acode-kit.md");
  const routerAgentFile = path.join(destRoot, "agents", "acode-run.md");
  const initAgentFile = path.join(destRoot, "agents", "acode-init.md");

  if (!exists(adapterTemplate)) {
    throw new Error(`Claude adapter not found in ${adapterTemplate}`);
  }

  copyDir(sourceDir, bundleDir);
  copyBundleScripts(sourceDir, bundleDir);
  copyFile(adapterTemplate, agentFile);
  if (exists(routerAdapterTemplate)) {
    copyFile(routerAdapterTemplate, routerAgentFile);
  }
  if (exists(initAdapterTemplate)) {
    copyFile(initAdapterTemplate, initAgentFile);
  }

  const lines = [
    `Installed Claude bundle to ${bundleDir}`,
    `Installed Claude subagent to ${agentFile}`,
    exists(routerAdapterTemplate)
      ? `Installed Claude unified entry to ${routerAgentFile}`
      : "Claude unified entry adapter not found; skipping acode-run adapter."
  ];
  if (exists(initAdapterTemplate)) {
    lines.push(`Installed Claude init adapter to ${initAgentFile}`);
  }
  return lines;
}

function installLocal(sourceDir, destRoot) {
  ensureSkill(sourceDir);
  const bundleDir = path.join(destRoot, path.basename(sourceDir));
  const adapterTemplate = path.join(sourceDir, "integrations", "claude", "acode-kit.md");
  const routerAdapterTemplate = path.join(sourceDir, "integrations", "claude", "acode-run.md");
  const initAdapterTemplate = path.join(sourceDir, "integrations", "claude", "acode-init.md");
  const portableClaudeFile = path.join(destRoot, "claude", "acode-kit.md");
  const portableRouterFile = path.join(destRoot, "claude", "acode-run.md");
  const portableInitFile = path.join(destRoot, "claude", "acode-init.md");

  copyDir(sourceDir, bundleDir);
  copyBundleScripts(sourceDir, bundleDir);
  const lines = [`Installed portable bundle to ${bundleDir}`];

  if (exists(adapterTemplate)) {
    copyFile(adapterTemplate, portableClaudeFile);
    lines.push(`Saved portable Claude adapter to ${portableClaudeFile}`);
  }
  if (exists(routerAdapterTemplate)) {
    copyFile(routerAdapterTemplate, portableRouterFile);
    lines.push(`Saved portable Claude unified entry to ${portableRouterFile}`);
  }
  if (exists(initAdapterTemplate)) {
    copyFile(initAdapterTemplate, portableInitFile);
    lines.push(`Saved portable Claude init adapter to ${portableInitFile}`);
  }

  lines.push("Manual next step:");
  lines.push("- Codex: copy the Acode-kit folder into ~/.codex/skills/");
  lines.push("- Claude Code: copy the Acode-kit folder into ~/.claude/ and copy claude/*.md into ~/.claude/agents/");
  return lines;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const jobs = createJobs(args);
  const prepared = prepareSource(args);

  try {
    for (const job of jobs) {
      const lines = job.agent === "codex"
        ? installCodex(prepared.sourceDir, job.destRoot)
        : job.agent === "claude"
          ? installClaude(prepared.sourceDir, job.destRoot)
          : installLocal(prepared.sourceDir, job.destRoot);
      for (const line of lines) console.log(line);
    }
  } finally {
    if (prepared.cleanup) prepared.cleanup();
  }

  console.log("");
  console.log("Restart your target AI agent after installation.");
  console.log("");
  console.log('To complete first-time setup, open your AI agent and tell it:');
  console.log('  "acode-kit init"');
}

main();
