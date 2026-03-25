#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === "--id") {
      args.id = argv[++i];
    } else if (current === "--project-extensions") {
      args.projectExtensions = argv[++i];
    } else if (current === "--active-standards") {
      args.activeStandards = argv[++i];
    } else if (current === "--reason") {
      args.reason = argv[++i];
    } else if (current === "--help" || current === "-h") {
      args.help = true;
    }
  }
  return args;
}

function printUsage() {
  console.log("Usage: node scripts/uninstall-extension-module.mjs --id <extension-id> --project-extensions <file> --active-standards <file> [--reason text]");
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content);
}

function removeFromBacktickList(line, id) {
  const matches = [...line.matchAll(/`([^`]+)`/g)].map((match) => match[1]).filter((item) => item !== id);
  return `${line.split("：")[0]}：${matches.length ? matches.map((item) => `\`${item}\``).join("、") : "无"}`;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.id || !args.projectExtensions || !args.activeStandards) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const repoRoot = process.cwd();
  const projectExtensionsPath = path.resolve(repoRoot, args.projectExtensions);
  const activeStandardsPath = path.resolve(repoRoot, args.activeStandards);
  const reason = args.reason || "manual uninstall";

  let projectExtensions = read(projectExtensionsPath);
  let activeStandards = read(activeStandardsPath);

  const statusPattern = new RegExp(`(\\|\\s*\`${args.id}\`\\s*\\|[^\\n]*\\|\\s*)(已启用|待启用)(\\s*\\|)`);
  projectExtensions = projectExtensions.replace(statusPattern, `$1已停用$3`);

  if (projectExtensions.includes("## 卸载记录")) {
    projectExtensions = projectExtensions.replace(
      /## 卸载记录\n\n/,
      `## 卸载记录\n\n- 卸载扩展：\`${args.id}\`\n- 卸载日期：\`${new Date().toISOString().slice(0, 10)}\`\n- 卸载原因：${reason}\n- 影响节点：按扩展 manifest 约定节点失效\n- 回滚方式：重新通过安全扫描并恢复项目级启用\n\n`
    );
  }

  activeStandards = activeStandards.replace(
    /^- 当前启用扩展：.*$/m,
    (line) => removeFromBacktickList(line, args.id)
  );
  activeStandards = activeStandards.replace(
    /^- 当前扩展装载摘要：.*$/m,
    `- 当前扩展装载摘要：已卸载 \`${args.id}\`，后续节点不再装载该扩展`
  );

  write(projectExtensionsPath, projectExtensions);
  write(activeStandardsPath, activeStandards);

  console.log(`extension uninstalled at project level: ${args.id}`);
}

main();
