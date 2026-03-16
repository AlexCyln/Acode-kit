#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function copyDir(sourceDir, destDir) {
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(destDir), { recursive: true });
  fs.cpSync(sourceDir, destDir, { recursive: true });
}

function installFromSourceDir(sourceDir, destRoot) {
  const skillName = path.basename(sourceDir);
  const skillFile = path.join(sourceDir, "SKILL.md");
  if (!fs.existsSync(skillFile)) {
    throw new Error(`SKILL.md not found in ${sourceDir}`);
  }
  const targetDir = path.join(destRoot, skillName);
  copyDir(sourceDir, targetDir);
  return targetDir;
}

function installFromGitHub({ repo, ref, skillPath, destRoot }) {
  if (!repo) {
    throw new Error("Missing --repo owner/repo");
  }
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "structcode-skill-"));
  const archiveFile = path.join(tmpDir, "archive.tar.gz");
  const extractDir = path.join(tmpDir, "extract");
  fs.mkdirSync(extractDir, { recursive: true });

  try {
    const archiveUrl = `https://codeload.github.com/${repo}/tar.gz/refs/heads/${ref}`;
    execFileSync("curl", ["-fsSL", archiveUrl, "-o", archiveFile], { stdio: "inherit" });
    execFileSync("tar", ["-xzf", archiveFile, "-C", extractDir], { stdio: "inherit" });

    const [repoDirName] = fs.readdirSync(extractDir);
    const sourceDir = path.join(extractDir, repoDirName, skillPath);
    return installFromSourceDir(sourceDir, destRoot);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const destRoot = args["dest-dir"] || path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "skills");

  let targetDir;

  if (args["source-dir"]) {
    targetDir = installFromSourceDir(path.resolve(args["source-dir"]), path.resolve(destRoot));
  } else {
    const repo = args.repo || "AlexCyln/Acode-kit";
    const ref = args.ref || "main";
    const skillPath = args["skill-path"] || "Acode-kit";
    targetDir = installFromGitHub({
      repo,
      ref,
      skillPath,
      destRoot: path.resolve(destRoot)
    });
  }

  console.log(`Installed to ${targetDir}`);
  console.log("Restart Codex to pick up the new skill.");
}

main();
