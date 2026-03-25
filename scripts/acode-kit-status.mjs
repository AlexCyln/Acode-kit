#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { ACODE_KIT_VERSION } from "./acode-kit-version.mjs";
import { findInitializedProjects, parseProjectExtensions, read } from "./extension-module-helpers.mjs";

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function resolveGlobalStatusPath(provider) {
  const homeDir = provider === "claude"
    ? (process.env.CLAUDE_HOME || path.join(os.homedir(), ".claude"))
    : (process.env.CODEX_HOME || path.join(os.homedir(), ".codex"));
  return path.join(homeDir, "acode-kit", ".acode-kit-global.json");
}

function inferAgentBundle(repoRoot) {
  const normalized = repoRoot.replace(/\\/g, "/");
  if (normalized.includes("/.codex/")) return "codex";
  if (normalized.includes("/.claude/")) return "claude";
  return "local/dev";
}

function main() {
  const repoRoot = process.cwd();
  const codexGlobal = readJsonIfExists(resolveGlobalStatusPath("codex"));
  const claudeGlobal = readJsonIfExists(resolveGlobalStatusPath("claude"));
  const workspaceStatus = readJsonIfExists(path.join(repoRoot, ".acode-kit-initialized.json"));
  const projectExtensionsPath = path.join(repoRoot, "docs", "project", "PROJECT_EXTENSIONS.md");
  const activeProjectExtensions = parseProjectExtensions(projectExtensionsPath).filter((item) => item.status === "已启用");
  const initializedProjects = findInitializedProjects(repoRoot);

  const scan = spawnSync("node", [path.join("scripts", "mcp-tool-scan.mjs"), "--json"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  const mcpPayload = JSON.parse(scan.stdout || "{\"tools\":[]}");

  console.log("Acode-kit Status");
  console.log(`version: ${ACODE_KIT_VERSION}`);
  console.log(`agent basis: ${inferAgentBundle(repoRoot)}`);
  console.log(`workspace initialized: ${workspaceStatus ? "yes" : "no"}`);
  console.log(`global cache: codex=${codexGlobal ? "yes" : "no"}, claude=${claudeGlobal ? "yes" : "no"}`);
  console.log("");
  console.log("projects using Acode-kit (current workspace scan):");
  if (initializedProjects.length === 0) {
    console.log("  - none discovered");
  } else {
    for (const projectPath of initializedProjects) {
      console.log(`  - ${path.relative(repoRoot, projectPath) || "."}`);
    }
  }
  console.log("");
  console.log("enabled third-party extensions (current project):");
  if (activeProjectExtensions.length === 0) {
    console.log("  - none");
  } else {
    for (const item of activeProjectExtensions) {
      console.log(`  - ${item.id} [${item.type}] ${item.nodes}`);
    }
  }
  console.log("");
  console.log("MCP tool status:");
  for (const tool of mcpPayload.tools || []) {
    console.log(`  - ${tool.id}: ${tool.status}`);
  }
}

main();
