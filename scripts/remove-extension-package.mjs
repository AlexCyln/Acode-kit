#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { removeFromExtensionsIndex } from "./extension-module-helpers.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bundleRoot = path.resolve(__dirname, "..");

function resolveSkillRoot(baseRoot) {
  if (fs.existsSync(path.join(baseRoot, "SKILL.md"))) {
    return baseRoot;
  }
  return path.join(baseRoot, "Acode-kit");
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === "--id") {
      args.id = argv[++i];
    } else if (current === "--help" || current === "-h") {
      args.help = true;
    }
  }
  return args;
}

function printUsage() {
  console.log("Usage: node scripts/remove-extension-package.mjs --id <extension-id>");
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.id) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const packDir = path.join(resolveSkillRoot(bundleRoot), "extensions", "packs", args.id);
  if (!fs.existsSync(packDir)) {
    console.error(`Extension pack not found: ${args.id}`);
    process.exit(1);
  }

  fs.rmSync(packDir, { recursive: true, force: true });
  removeFromExtensionsIndex(bundleRoot, args.id);

  console.log(`extension removed: ${args.id}`);
}

main();
