#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

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
  console.log("Usage: node scripts/deactivate-extension-module.mjs --id <extension-id> [--project-root <dir>] [--reason <text>]");
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

function backupFileIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = `${filePath}.${stamp}.bak`;
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

function removeFromBacktickList(line, id) {
  const matches = [...line.matchAll(/`([^`]+)`/g)].map((match) => match[1]).filter((item) => item !== id);
  return `${line.split("：")[0]}：${matches.length ? matches.map((item) => `\`${item}\``).join("、") : "无"}`;
}

function extractEnabledExtensions(content) {
  const enabledLine = /^- 当前启用扩展：.*$/m.exec(content)?.[0] || "- 当前启用扩展：";
  return [...enabledLine.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
}

function upsertLine(content, prefix, value) {
  const pattern = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*$`, "m");
  const line = `${prefix}${value}`;
  if (pattern.test(content)) {
    return content.replace(pattern, line);
  }
  return `${content.trim()}\n${line}\n`;
}

function appendDisableRecord(content, id, reason) {
  const stamp = new Date().toISOString().slice(0, 10);
  const block = `- 日期：\`${stamp}\`\n- 变更内容：停用扩展 \`${id}\`\n- 影响范围：该扩展关联节点不再装载\n- 审批状态：自动停用\n- 停用原因：${reason}\n\n`;
  if (!content.includes("## 变更记录")) {
    return `${content.trim()}\n\n## 变更记录\n\n${block}`;
  }
  return content.replace("## 变更记录\n\n", `## 变更记录\n\n${block}`);
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.id) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const projectRoot = path.resolve(process.cwd(), args.projectRoot || ".");
  const projectExtensionsPath = path.join(projectRoot, "docs", "project", "PROJECT_EXTENSIONS.md");
  const activeStandardsPath = path.join(projectRoot, "docs", "project", "ACTIVE_STANDARDS.md");
  const reason = args.reason || `自动停用 ${args.id}`;

  if (!fs.existsSync(projectExtensionsPath) || !fs.existsSync(activeStandardsPath)) {
    console.error("Project extension activation files not found. Expected:");
    console.error(`  - ${projectExtensionsPath}`);
    console.error(`  - ${activeStandardsPath}`);
    process.exit(1);
  }

  let projectExtensions = read(projectExtensionsPath);
  let activeStandards = read(activeStandardsPath);

  const rowPattern = new RegExp(`^\\|\\s*\`${args.id.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\`\\s*\\|.*$`, "m");
  if (!rowPattern.test(projectExtensions)) {
    console.error(`Extension is not registered in project docs: ${args.id}`);
    process.exit(1);
  }

  projectExtensions = projectExtensions.replace(
    new RegExp(`(\\|\\s*\`${args.id.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\`\\s*\\|[^\\n]*\\|\\s*)(已启用|待启用)(\\s*\\|)`),
    "$1已停用$3"
  );
  projectExtensions = appendDisableRecord(projectExtensions, args.id, reason);

  if (projectExtensions.includes("## 卸载记录")) {
    projectExtensions = projectExtensions.replace(
      /## 卸载记录\n\n/,
      `## 卸载记录\n\n- 卸载扩展：\`${args.id}\`\n- 卸载日期：\`${new Date().toISOString().slice(0, 10)}\`\n- 卸载原因：${reason}\n- 影响节点：按扩展 manifest 约定节点失效\n- 回滚方式：重新执行 \`acode-kit -enable ${args.id}\`\n\n`
    );
  }

  const remaining = extractEnabledExtensions(activeStandards).filter((item) => item !== args.id);
  activeStandards = activeStandards.replace(
    /^- 当前启用扩展：.*$/m,
    (line) => removeFromBacktickList(line, args.id)
  );
  activeStandards = upsertLine(
    activeStandards,
    "- 当前启用扩展数量：",
    String(remaining.length)
  );
  activeStandards = upsertLine(
    activeStandards,
    "- 扩展模块清单：",
    "见 `PROJECT_EXTENSIONS.md`"
  );
  activeStandards = upsertLine(
    activeStandards,
    "- 当前扩展装载摘要：",
    remaining.length
      ? "按当前节点命中对应扩展，逐项装载明细见 `PROJECT_EXTENSIONS.md`"
      : "当前无已启用扩展"
  );

  const projectExtensionsBackup = backupFileIfExists(projectExtensionsPath);
  const activeStandardsBackup = backupFileIfExists(activeStandardsPath);
  write(projectExtensionsPath, projectExtensions);
  write(activeStandardsPath, activeStandards);

  console.log(`extension deactivated at project level: ${args.id}`);
  console.log(`project extensions: ${projectExtensionsPath}`);
  console.log(`active standards: ${activeStandardsPath}`);
  if (projectExtensionsBackup) console.log(`project extensions backup: ${projectExtensionsBackup}`);
  if (activeStandardsBackup) console.log(`active standards backup: ${activeStandardsBackup}`);
}

main();
