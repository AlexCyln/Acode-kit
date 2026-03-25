#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createScanReadyPack, resolveExtensionSource } from "./extension-module-helpers.mjs";

const REQUIRED_FIELDS = ["id", "type", "entry", "description", "load_at", "priority", "mode"];
const ALLOWED_TYPES = new Set(["markdown", "skill"]);
const ALLOWED_MODES = new Set(["reference-only", "workflow-helper", "delegated-capability"]);

const HARD_FAIL_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|system)\s+instructions/i,
  /bypass\s+(gate|approval|review|workflow)/i,
  /skip\s+(gate|approval|review)/i,
  /replace\s+the\s+main\s+orchestrator/i,
  /override\s+(gate|stage|approval|workflow)/i
];

const WARN_PATTERNS = [
  /send\s+.*(secret|token|credential|cookie)/i,
  /upload\s+.*(project|repo|code|data)/i,
  /exfiltrat/i,
  /\brm\s+-rf\b/i,
  /\bcurl\s+https?:\/\//i,
  /\bwget\s+https?:\/\//i
];

const ARCHITECTURE_FAIL_PATTERNS = [
  /\/[a-z0-9-]+\s+<request>/i,
  /all rules in this skill are mandatory/i,
  /replace\s+the\s+main\s+orchestrator/i,
  /ignore\s+.*acode-kit/i,
  /use\s+this\s+skill\s+as\s+the\s+main\s+workflow/i,
  /supersede\s+acode-kit/i,
  /bypass\s+.*main\s+skill/i
];

const ARCHITECTURE_WARN_PATTERNS = [
  /##\s+workflow/i,
  /phase\s+1\s*:/i,
  /phase\s+2\s*:/i,
  /skill structure/i,
  /read as needed/i,
  /public orchestrator/i
];

function parseArgs(argv) {
  const args = { json: false };
  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === "--manifest") {
      args.manifest = argv[++i];
    } else if (current === "--path") {
      args.path = argv[++i];
    } else if (current === "--json") {
      args.json = true;
    } else if (current === "--report") {
      args.report = argv[++i];
    } else if (current === "--help" || current === "-h") {
      args.help = true;
    }
  }
  return args;
}

function printUsage() {
  console.log("Usage: node scripts/scan-extension-module.mjs (--manifest <manifest.json> | --path <file-or-dir>) [--json] [--report report.json]");
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walkPackFiles(dirPath, results = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkPackFiles(fullPath, results);
      continue;
    }
    if (/\.(md|json|txt)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || (!args.manifest && !args.path)) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const repoRoot = process.cwd();
  let manifestPath = null;
  let manifestDir = null;
  let tempDir = null;
  const findings = [];
  const securityFindings = [];
  const architectureFindings = [];

  function pushFinding(target, finding) {
    target.push(finding);
    findings.push(finding);
  }

  try {
    if (args.path) {
      const sourceInfo = resolveExtensionSource(repoRoot, args.path);
      const prepared = createScanReadyPack(repoRoot, sourceInfo);
      manifestPath = prepared.manifestPath;
      manifestDir = path.dirname(manifestPath);
      tempDir = prepared.tempDir;
    } else {
      manifestPath = path.resolve(repoRoot, args.manifest);
      manifestDir = path.dirname(manifestPath);
    }
  } catch (error) {
    pushFinding(securityFindings, {
      level: "fail",
      file: args.path || args.manifest || "unknown",
      rule: "source-resolution",
      message: error.message
    });
  }

  if (manifestPath && !fs.existsSync(manifestPath)) {
    pushFinding(securityFindings, { level: "fail", file: manifestPath, rule: "manifest-exists", message: "Manifest file does not exist." });
  }

  let manifest = null;
  if (findings.length === 0) {
    try {
      manifest = JSON.parse(read(manifestPath));
    } catch (error) {
      pushFinding(securityFindings, { level: "fail", file: manifestPath, rule: "manifest-json", message: `Manifest JSON parse failed: ${error.message}` });
    }
  }

  if (manifest) {
    for (const field of REQUIRED_FIELDS) {
      if (!(field in manifest)) {
        pushFinding(securityFindings, { level: "fail", file: manifestPath, rule: "required-field", message: `Missing required field: ${field}` });
      }
    }
    if (!ALLOWED_TYPES.has(manifest.type)) {
      pushFinding(securityFindings, { level: "fail", file: manifestPath, rule: "allowed-type", message: `Unsupported type: ${manifest.type}` });
    }
    if (!ALLOWED_MODES.has(manifest.mode)) {
      pushFinding(securityFindings, { level: "fail", file: manifestPath, rule: "allowed-mode", message: `Unsupported mode: ${manifest.mode}` });
    }
    if (!Array.isArray(manifest.load_at) || manifest.load_at.length === 0) {
      pushFinding(securityFindings, { level: "fail", file: manifestPath, rule: "load-at", message: "load_at must be a non-empty array." });
    }

    const entryRaw = manifest.entry || "";
    const allowedRoot = tempDir ? manifestDir : repoRoot;
    const entryPath = path.isAbsolute(entryRaw)
      ? entryRaw
      : tempDir
        ? path.resolve(manifestDir, entryRaw)
        : fs.existsSync(path.resolve(manifestDir, entryRaw))
          ? path.resolve(manifestDir, entryRaw)
          : path.resolve(repoRoot, entryRaw);
    if (!entryPath.startsWith(allowedRoot)) {
      pushFinding(securityFindings, { level: "fail", file: manifestPath, rule: "entry-boundary", message: "Entry path escapes repository boundary." });
    } else if (!fs.existsSync(entryPath)) {
      pushFinding(securityFindings, { level: "fail", file: manifestPath, rule: "entry-exists", message: "Entry file does not exist." });
    }

    const packFiles = walkPackFiles(manifestDir);
    for (const filePath of packFiles) {
      const content = read(filePath);
      for (const pattern of HARD_FAIL_PATTERNS) {
        if (pattern.test(content)) {
          pushFinding(securityFindings, {
            level: "fail",
            file: path.relative(repoRoot, filePath),
            rule: "prompt-injection-hard-fail",
            message: `Matched hard-fail pattern: ${pattern}`
          });
        }
      }
      for (const pattern of WARN_PATTERNS) {
        if (pattern.test(content)) {
          pushFinding(securityFindings, {
            level: "warn",
            file: path.relative(repoRoot, filePath),
            rule: "suspicious-action-warning",
            message: `Matched warning pattern: ${pattern}`
          });
        }
      }
      for (const pattern of ARCHITECTURE_FAIL_PATTERNS) {
        if (pattern.test(content)) {
          pushFinding(architectureFindings, {
            level: "fail",
            file: path.relative(repoRoot, filePath),
            rule: "workflow-ownership-conflict",
            message: `Matched architecture fail pattern: ${pattern}`
          });
        }
      }
      for (const pattern of ARCHITECTURE_WARN_PATTERNS) {
        if (pattern.test(content)) {
          pushFinding(architectureFindings, {
            level: "warn",
            file: path.relative(repoRoot, filePath),
            rule: "workflow-compatibility-warning",
            message: `Matched architecture warning pattern: ${pattern}`
          });
        }
      }
    }
  }

  const hasFail = findings.some((item) => item.level === "fail");
  const hasWarn = findings.some((item) => item.level === "warn");
  const result = {
    status: hasFail ? "fail" : hasWarn ? "warn" : "pass",
    manifest: manifestPath ? path.relative(repoRoot, manifestPath) : null,
    security_status: securityFindings.some((item) => item.level === "fail")
      ? "fail"
      : securityFindings.some((item) => item.level === "warn")
        ? "warn"
        : "pass",
    architecture_status: architectureFindings.some((item) => item.level === "fail")
      ? "fail"
      : architectureFindings.some((item) => item.level === "warn")
        ? "warn"
        : "pass",
    security_findings: securityFindings,
    architecture_findings: architectureFindings,
    findings
  };

  if (args.report) {
    fs.writeFileSync(path.resolve(repoRoot, args.report), JSON.stringify(result, null, 2));
  }

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Extension admission scan: ${result.status}`);
    console.log(`Security status: ${result.security_status}`);
    console.log(`Architecture status: ${result.architecture_status}`);
    if (findings.length === 0) {
      console.log("No blocking issue found.");
    } else {
      for (const finding of findings) {
        console.log(`[${finding.level}] ${finding.file} :: ${finding.message}`);
      }
    }
  }

  if (tempDir) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  process.exit(hasFail ? 1 : 0);
}

main();
