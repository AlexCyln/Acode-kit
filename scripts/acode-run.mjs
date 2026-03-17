#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bundleRoot = path.resolve(__dirname, "..");
const configDir = fs.existsSync(path.join(bundleRoot, "extensions", "router", "config"))
  ? path.join(bundleRoot, "extensions", "router", "config")
  : path.join(bundleRoot, "Acode-kit", "extensions", "router", "config");
const routerScript = path.join(__dirname, "router-exec.mjs");

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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function hasCommand(cmd) {
  const probe = spawnSync("which", [cmd], { encoding: "utf8" });
  return probe.status === 0;
}

function detectProvider(fallback) {
  const hasCodex = hasCommand("codex");
  const hasClaude = hasCommand("claude");
  if (hasCodex) return "codex";
  if (hasClaude) return "claude";
  return fallback;
}

function classifyTask(prompt, classifier) {
  const text = (prompt || "").toLowerCase();
  for (const rule of classifier.rules || []) {
    const matched = (rule.keywords || []).some((kw) => text.includes(String(kw).toLowerCase()));
    if (matched) return rule;
  }
  return classifier.defaults;
}

function buildRouterArgs(params) {
  const args = [
    routerScript,
    "--provider", params.provider,
    "--project-id", params.projectId,
    "--phase", params.phase,
    "--task-type", params.taskType,
    "--difficulty", params.difficulty,
    "--prompt", params.prompt,
    "--cwd", params.cwd
  ];
  if (params.contextSummary) args.push("--context-summary", params.contextSummary);
  if (params.logicalSessionId) args.push("--logical-session-id", params.logicalSessionId);
  if (params.nativeSessionId) args.push("--native-session-id", params.nativeSessionId);
  if (params.stateFile) args.push("--state", params.stateFile);
  if (params.logFile) args.push("--log", params.logFile);
  if (params.timeoutMs) args.push("--timeout-ms", String(params.timeoutMs));
  if (params.dryRun) args.push("--dry-run", "true");
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const prompt = args.prompt || "";
  const projectId = args["project-id"] || "";
  if (!prompt || !projectId) {
    console.error("Usage: acode-run --project-id <id> --prompt <text> [--provider codex|claude] [--phase <name>] [--task-type <name>] [--difficulty low|medium|high] [--context-summary <text>] [--dry-run true]");
    process.exit(2);
  }

  const classifierFile = path.resolve(args.classifier || path.join(configDir, "task-classifier.json"));
  const classifier = readJson(classifierFile);
  const guessed = classifyTask(prompt, classifier);

  const phase = args.phase || guessed.phase || classifier.defaults.phase;
  const taskType = args["task-type"] || guessed.task_type || classifier.defaults.task_type;
  const difficulty = args.difficulty || guessed.difficulty || classifier.defaults.difficulty;
  const provider = args.provider || detectProvider(classifier.defaults.provider || "codex");
  const cwd = path.resolve(args.cwd || process.cwd());

  const routerArgs = buildRouterArgs({
    provider,
    projectId,
    phase,
    taskType,
    difficulty,
    prompt,
    contextSummary: args["context-summary"] || "",
    logicalSessionId: args["logical-session-id"] || "",
    nativeSessionId: args["native-session-id"] || "",
    stateFile: args.state || "",
    logFile: args.log || "",
    timeoutMs: args["timeout-ms"] || "",
    dryRun: args["dry-run"] === "true",
    cwd
  });

  const result = spawnSync("node", routerArgs, { cwd, encoding: "utf8" });

  // Extract model routing info from router stdout
  let selectedModel = null;
  let finalModel = null;
  let fallbackTriggeredBy = null;
  try {
    const routerOutput = JSON.parse(result.stdout);
    selectedModel = routerOutput.selectedModel || routerOutput.selected_model || null;
    finalModel = routerOutput.finalModel || routerOutput.final_model || selectedModel;
    fallbackTriggeredBy = routerOutput.fallbackTriggeredBy || routerOutput.fallback_triggered_by || null;
  } catch (_) {
    // Router stdout may not be valid JSON in all cases
  }

  const envelope = {
    success: result.status === 0,
    route: {
      provider,
      phase,
      taskType,
      difficulty,
      selectedModel,
      finalModel,
      fallbackTriggered: fallbackTriggeredBy !== null,
      fallbackTriggeredBy
    },
    routerStatus: result.status,
    routerStdout: result.stdout,
    routerStderr: result.stderr
  };

  process.stdout.write(`${JSON.stringify(envelope, null, 2)}\n`);
  process.exit(result.status === null ? 1 : result.status);
}

main();
