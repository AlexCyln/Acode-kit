#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createScanReadyPack, installPreparedPack, resolveExtensionSource, updateExtensionsIndex } from "./extension-module-helpers.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bundleRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === "--path") {
      args.path = argv[++i];
    } else if (current === "--help" || current === "-h") {
      args.help = true;
    }
  }
  return args;
}

function printUsage() {
  console.log("Usage: node scripts/add-extension-module.mjs --path <file-or-dir>");
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.path) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const sourceInfo = resolveExtensionSource(bundleRoot, args.path);
  const prepared = createScanReadyPack(bundleRoot, sourceInfo);

  const scan = spawnSync("node", [
    path.join(__dirname, "scan-extension-module.mjs"),
    "--path",
    args.path,
    "--json"
  ], {
    cwd: bundleRoot,
    encoding: "utf8"
  });

  if (scan.status !== 0) {
    process.stdout.write(scan.stdout || "");
    process.stderr.write(scan.stderr || "");
    process.exit(scan.status ?? 1);
  }

  const payload = JSON.parse(scan.stdout);
  if (payload.status !== "pass" || payload.security_status !== "pass" || payload.architecture_status !== "pass") {
    console.error("Extension did not pass admission scan. Installation aborted.");
    process.exit(1);
  }

  const installed = installPreparedPack(bundleRoot, sourceInfo, prepared);
  updateExtensionsIndex(bundleRoot, installed.manifest);

  console.log(`extension installed: ${installed.manifest.id}`);
  console.log(`type: ${installed.manifest.type}`);
  console.log(`mode: ${installed.manifest.mode}`);
  console.log(`pack path: ${installed.targetDir}`);
}

main();
