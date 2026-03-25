#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveSkillRoot, readJson } from "./extension-module-helpers.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bundleRoot = path.resolve(__dirname, "..");
const skillRoot = resolveSkillRoot(bundleRoot);

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === "--id") {
      args.id = argv[++i];
    } else if (current === "--project-root") {
      args.projectRoot = argv[++i];
    } else if (current === "--reason") {
      args.reason = argv[++i];
    } else if (current === "--help" || current === "-h") {
      args.help = true;
    }
  }
  return args;
}

function printUsage() {
  console.log("Usage: node scripts/activate-extension-module.mjs --id <extension-id> [--project-root <dir>] [--reason <text>]");
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function backupFileIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = `${filePath}.${stamp}.bak`;
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

function ensureProjectDocFromTemplate(projectRoot, fileName) {
  const targetPath = path.join(projectRoot, "docs", "project", fileName);
  if (fs.existsSync(targetPath)) {
    return targetPath;
  }

  const templateName = fileName === "PROJECT_EXTENSIONS.md"
    ? "PROJECT_EXTENSIONS.template.md"
    : "ACTIVE_STANDARDS.template.md";
  const templatePath = path.join(skillRoot, "assets", "project-doc-templates", templateName);
  write(targetPath, read(templatePath));
  return targetPath;
}

function upsertProjectExtensions(content, manifest, reason) {
  const row = `| \`${manifest.id}\` | \`${manifest.type}\` | \`${manifest.mode}\` | ${manifest.load_at.map((item) => `\`${item}\``).join("、")} | ${reason} | 通过 | 已启用 |`;
  const rowPattern = new RegExp(`^\\|\\s*\`${manifest.id.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\`\\s*\\|.*$`, "m");
  if (rowPattern.test(content)) {
    return content.replace(rowPattern, row);
  }

  if (content.includes("## 冲突与优先级")) {
    return content.replace("## 冲突与优先级", `${row}\n\n## 冲突与优先级`);
  }
  return `${content.trim()}\n\n${row}\n`;
}

function appendChangeRecord(content, manifest, reason) {
  const stamp = new Date().toISOString().slice(0, 10);
  const block = `- 日期：\`${stamp}\`\n- 变更内容：启用扩展 \`${manifest.id}\`\n- 影响范围：${manifest.load_at.map((item) => `\`${item}\``).join("、")}\n- 审批状态：自动激活\n- 启用原因：${reason}\n\n`;
  if (!content.includes("## 变更记录")) {
    return `${content.trim()}\n\n## 变更记录\n\n${block}`;
  }
  return content.replace("## 变更记录\n\n", `## 变更记录\n\n${block}`);
}

function upsertBacktickListLine(content, prefix, value) {
  const pattern = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*$`, "m");
  const line = `${prefix}${value}`;
  if (pattern.test(content)) {
    return content.replace(pattern, line);
  }
  return `${content.trim()}\n${line}\n`;
}

function activateInActiveStandards(content, manifest) {
  const enabledLine = /^- 当前启用扩展：.*$/m.exec(content)?.[0] || "- 当前启用扩展：";
  const existing = [...enabledLine.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
  const merged = [...new Set([...existing, manifest.id])];
  let next = upsertBacktickListLine(
    content,
    "- 当前启用扩展：",
    merged.length ? merged.map((item) => `\`${item}\``).join("、") : "无"
  );
  next = upsertBacktickListLine(
    next,
    "- 当前启用扩展数量：",
    String(merged.length)
  );
  next = upsertBacktickListLine(
    next,
    "- 扩展模块清单：",
    "见 `PROJECT_EXTENSIONS.md`"
  );
  next = upsertBacktickListLine(
    next,
    "- 当前扩展装载摘要：",
    merged.length
      ? "按当前节点命中对应扩展，逐项装载明细见 `PROJECT_EXTENSIONS.md`"
      : "当前无已启用扩展"
  );
  return next;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.id) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const projectRoot = path.resolve(process.cwd(), args.projectRoot || ".");
  const manifestPath = path.join(skillRoot, "extensions", "packs", args.id, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.error(`Installed extension pack not found: ${args.id}`);
    process.exit(1);
  }

  const manifest = readJson(manifestPath);
  const reason = args.reason || `自动激活 ${manifest.id}`;
  const projectExtensionsPath = ensureProjectDocFromTemplate(projectRoot, "PROJECT_EXTENSIONS.md");
  const activeStandardsPath = ensureProjectDocFromTemplate(projectRoot, "ACTIVE_STANDARDS.md");

  let projectExtensions = read(projectExtensionsPath);
  projectExtensions = upsertProjectExtensions(projectExtensions, manifest, reason);
  projectExtensions = appendChangeRecord(projectExtensions, manifest, reason);
  const projectExtensionsBackup = backupFileIfExists(projectExtensionsPath);
  write(projectExtensionsPath, projectExtensions);

  let activeStandards = read(activeStandardsPath);
  activeStandards = activateInActiveStandards(activeStandards, manifest);
  const activeStandardsBackup = backupFileIfExists(activeStandardsPath);
  write(activeStandardsPath, activeStandards);

  console.log(`extension activated at project level: ${manifest.id}`);
  console.log(`project extensions: ${projectExtensionsPath}`);
  console.log(`active standards: ${activeStandardsPath}`);
  if (projectExtensionsBackup) console.log(`project extensions backup: ${projectExtensionsBackup}`);
  if (activeStandardsBackup) console.log(`active standards backup: ${activeStandardsBackup}`);
}

main();
