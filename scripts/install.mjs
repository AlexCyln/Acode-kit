#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const DEFAULT_REPO = "AlexCyln/Acode-kit";
const DEFAULT_SKILL_PATH = "Acode-kit";
const DEFAULT_LOCAL_ROOT = path.join(process.cwd(), "agent-skills");
const TOTAL_STEPS = 6;

function logStep(current, title, detail = "") {
  console.log(`\n[${current}/${TOTAL_STEPS}] ${title}`);
  if (detail) {
    console.log(`  ${detail}`);
  }
}

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

function isRetryableCopyError(error) {
  return ["EIO", "EPERM", "EBUSY", "ENOTEMPTY", "EACCES"].includes(error?.code);
}

function ensureSkill(sourceDir) {
  const skillFile = path.join(sourceDir, "SKILL.md");
  if (!exists(skillFile)) {
    throw new Error(`SKILL.md not found in ${sourceDir}`);
  }
}

function copyDirFallback(sourceDir, destDir) {
  const stat = fs.lstatSync(sourceDir);
  if (!stat.isDirectory()) {
    throw new Error(`Expected directory source: ${sourceDir}`);
  }

  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyDirFallback(sourcePath, destPath);
      continue;
    }

    if (entry.isSymbolicLink()) {
      const linkTarget = fs.readlinkSync(sourcePath);
      try {
        fs.symlinkSync(linkTarget, destPath);
      } catch {
        fs.copyFileSync(sourcePath, destPath);
      }
      continue;
    }

    fs.copyFileSync(sourcePath, destPath);
  }
}

function copyDir(sourceDir, destDir) {
  fs.rmSync(destDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  fs.mkdirSync(path.dirname(destDir), { recursive: true });
  try {
    fs.cpSync(sourceDir, destDir, {
      recursive: true,
      force: true,
      dereference: false,
      preserveTimestamps: true,
      verbatimSymlinks: false
    });
  } catch (error) {
    if (!isRetryableCopyError(error)) throw error;
    fs.rmSync(destDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    fs.mkdirSync(destDir, { recursive: true });
    copyDirFallback(sourceDir, destDir);
  }
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

function resolveGlobalStateRoot(agent) {
  if (agent === "codex") {
    return path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "acode-kit");
  }
  return path.join(DEFAULT_LOCAL_ROOT, ".acode-kit-state");
}

function detectAgentMode() {
  return "codex";
}

function createJobs(args) {
  const requestedAgent = args.agent || "auto";
  const scope = args.scope || "user";
  const resolvedAgent = requestedAgent === "auto" ? detectAgentMode() : requestedAgent;

  if (!["auto", "codex", "local"].includes(requestedAgent)) {
    throw new Error(`Unsupported --agent value: ${requestedAgent}`);
  }
  if (!["user", "project"].includes(scope)) {
    throw new Error(`Unsupported --scope value: ${scope}`);
  }

  const codexRoot = path.resolve(args["dest-dir"] || (scope === "project"
    ? path.join(process.cwd(), ".codex", "skills")
    : path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "skills")));
  const localRoot = path.resolve(args["dest-dir"] || DEFAULT_LOCAL_ROOT);

  if (resolvedAgent === "codex") return [{ agent: "codex", destRoot: codexRoot }];
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
  logStep(2, "Downloading repository bundle", archiveUrl);
  execFileSync("curl", ["-fsSL", archiveUrl, "-o", archiveFile], { stdio: "inherit" });
  logStep(3, "Extracting bundle", "Unpacking the downloaded archive into a temporary workspace.");
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
  return { lines: [`Installed Codex skill to ${bundleDir}`], bundleDir };
}

function installLocal(sourceDir, destRoot) {
  ensureSkill(sourceDir);
  const bundleDir = path.join(destRoot, path.basename(sourceDir));
  const codexAdapterTemplate = path.join(sourceDir, "integrations", "codex", "acode-kit.md");
  const codexRouterAdapterTemplate = path.join(sourceDir, "integrations", "codex", "acode-run.md");
  const portableCodexFile = path.join(destRoot, "codex", "acode-kit.md");
  const portableCodexRouterFile = path.join(destRoot, "codex", "acode-run.md");

  copyDir(sourceDir, bundleDir);
  copyBundleScripts(sourceDir, bundleDir);
  const lines = [`Installed portable bundle to ${bundleDir}`];
  const result = { lines, bundleDir };

  if (exists(codexAdapterTemplate)) {
    copyFile(codexAdapterTemplate, portableCodexFile);
    lines.push(`Saved portable Codex runtime guide to ${portableCodexFile}`);
  }
  if (exists(codexRouterAdapterTemplate)) {
    copyFile(codexRouterAdapterTemplate, portableCodexRouterFile);
    lines.push(`Saved portable Codex routing guide to ${portableCodexRouterFile}`);
  }

  lines.push("Manual next step:");
  lines.push("- Codex: copy the Acode-kit folder into ~/.codex/skills/ and use codex/*.md as runtime supplements if you need standalone references.");
  return result;
}

function runInit(bundleDir, projectRoot, args) {
  const initScript = path.join(bundleDir, "scripts", "acode-kit-init.mjs");
  if (!exists(initScript)) {
    console.log("\nInit script not found at expected location. Run manually:");
    console.log(`  node ${initScript} --cwd ${projectRoot}`);
    return false;
  }

  console.log("");
  console.log("Running initialization...");
  console.log("========================");

  const initArgs = ["--cwd", projectRoot];

  // Map install --agent to init --provider
  const agent = args.agent || "auto";
  if (agent === "codex") {
    initArgs.push("--provider", agent);
  }

  // Forward --yes flag for non-interactive mode
  if (args.yes === "true") {
    initArgs.push("--yes");
  }

  // Always --force since this is a fresh install
  initArgs.push("--force");

  const result = spawnSync("node", [initScript, ...initArgs], {
    stdio: "inherit",
    encoding: "utf8"
  });

  if (result.status !== 0) {
    console.error("\nInit completed with errors. You can re-run manually:");
    console.error(`  node ${initScript} --cwd ${projectRoot}`);
    return false;
  }
  return true;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  logStep(1, "Preparing install plan", "Resolving source, target agent, and destination paths.");
  const jobs = createJobs(args);
  const prepared = prepareSource(args);
  const scope = args.scope || "user";
  const skipInit = args["skip-init"] === "true";

  let lastBundleDir = "";
  try {
    logStep(4, "Installing bundle files", "Copying Acode-kit and adapters into the target runtime directories.");
    for (const job of jobs) {
      const result = job.agent === "codex"
        ? installCodex(prepared.sourceDir, job.destRoot)
        : installLocal(prepared.sourceDir, job.destRoot);
      for (const line of result.lines) console.log(line);
      lastBundleDir = result.bundleDir;

      if (!skipInit && lastBundleDir) {
        logStep(6, "Running initialization", "Refreshing MCP status and NotebookLM auth cache.");
        if (scope === "user") {
          runInit(lastBundleDir, resolveGlobalStateRoot(job.agent), args);
        } else if (scope === "project") {
          runInit(lastBundleDir, process.cwd(), args);
        }
      }
    }

    logStep(5, "Finalizing installation", "Writing the final install summary and next-step guidance.");
    if (skipInit) {
      logStep(6, "Skipping initialization", "skip-init=true was provided; initialization was intentionally skipped.");
    }
  } finally {
    if (prepared.cleanup) prepared.cleanup();
  }

  console.log("");
  console.log("Restart your target AI agent after installation.");
  console.log("");
  console.log("Quick CLI flags after install:");
  console.log("  acode-kit -status");
  console.log("  acode-kit -add <path>");
  console.log("  acode-kit -scan <path>");
  console.log("  acode-kit -remove <name>");
  console.log("  acode-kit -help");

  if (skipInit || !lastBundleDir || scope === "project" || scope === "user") {
    if (skipInit || !lastBundleDir) {
      console.log("");
      console.log("To complete first-time setup, run this in your terminal:");
      console.log(`  node ${lastBundleDir}/scripts/acode-kit-init.mjs`);
    }
  } else {
    console.log("");
    console.log("To complete first-time setup, run this in your terminal:");
    console.log(`  node ${lastBundleDir}/scripts/acode-kit-init.mjs`);
  }
}

main();
