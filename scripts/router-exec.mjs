#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { executeAgentRequest } from "./agent-execute.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bundleRoot = path.resolve(__dirname, "..");
const configDir = fs.existsSync(path.join(bundleRoot, "extensions", "router", "config"))
  ? path.join(bundleRoot, "extensions", "router", "config")
  : path.join(bundleRoot, "Acode-kit", "extensions", "router", "config");

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

function readJson(targetFile) {
  return JSON.parse(fs.readFileSync(targetFile, "utf8"));
}

function ensureDir(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function safeReadJson(targetFile, fallback) {
  if (!fs.existsSync(targetFile)) return fallback;
  try {
    return readJson(targetFile);
  } catch {
    return fallback;
  }
}

function appendJsonl(targetFile, payload) {
  ensureDir(path.dirname(targetFile));
  fs.appendFileSync(targetFile, `${JSON.stringify(payload)}\n`);
}

function deriveLogicalSessionId(projectId, phase, provided) {
  if (provided) return provided;
  return `${projectId}:${phase}`;
}

function getRouteEntry(modelMap, phase, taskType) {
  const phaseEntries = modelMap.phase_to_task_model?.[phase] || [];
  const exact = phaseEntries.find((entry) => entry.task_type === taskType);
  if (exact) return exact;
  return phaseEntries[0] || null;
}

function phaseTokenCap(policy, phase) {
  const total = policy.token_policy.total_token_cap;
  const ratio = policy.token_policy.phase_ratio[phase] || 0.1;
  return Math.floor(total * ratio);
}

function resolveModel({ routeEntry, provider, difficulty, shouldDowngrade }) {
  const providerRoute = routeEntry.providers?.[provider];
  if (!providerRoute) {
    throw new Error(`No provider route for provider=${provider}`);
  }
  const defaultModel = providerRoute.primary_model;
  const fallbackModel = providerRoute.fallback_model;
  if (shouldDowngrade) return fallbackModel || defaultModel;
  if (difficulty === "high") return defaultModel;
  return defaultModel;
}

function evaluateQuality(score, threshold) {
  if (score === null || score === undefined) return "unknown";
  return score < threshold ? "low" : "ok";
}

function loadState(stateFile) {
  return safeReadJson(stateFile, {
    logicalSessions: {},
    usage: {
      totalTokens: 0,
      phaseTokens: {}
    }
  });
}

function saveState(stateFile, state) {
  ensureDir(path.dirname(stateFile));
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const provider = args.provider;
  const projectId = args["project-id"];
  const phase = args.phase;
  const taskType = args["task-type"];
  const prompt = args.prompt;
  const difficulty = args.difficulty || "medium";
  const qualityScore = args["quality-score"] ? Number(args["quality-score"]) : null;
  const cwd = path.resolve(args.cwd || process.cwd());
  const dryRun = args["dry-run"] === "true";

  if (!provider || !projectId || !phase || !taskType || !prompt) {
    console.error("Usage: acode-router-exec --provider <codex|claude> --project-id <id> --phase <name> --task-type <name> --prompt <text> [--context-summary <text>] [--difficulty low|medium|high] [--logical-session-id <id>] [--native-session-id <id>] [--quality-score <0..1>] [--cwd <dir>] [--dry-run true]");
    process.exit(2);
  }

  const modelMapFile = path.resolve(args["model-map"] || path.join(configDir, "model-map.json"));
  const policyFile = path.resolve(args.policy || path.join(configDir, "policy.json"));
  const stateFile = path.resolve(args.state || ".acode-router/state.json");
  const logFile = path.resolve(args.log || ".acode-router/execution.jsonl");
  const modelMap = readJson(modelMapFile);
  const policy = readJson(policyFile);
  const state = loadState(stateFile);

  const logicalSessionId = deriveLogicalSessionId(projectId, phase, args["logical-session-id"]);
  const sessionRecord = state.logicalSessions[logicalSessionId] || {};
  const nativeSessionId = args["native-session-id"] || sessionRecord[provider]?.nativeSessionId || null;
  const routeEntry = getRouteEntry(modelMap, phase, taskType);
  if (!routeEntry) {
    console.error(`No route entry for phase=${phase} task_type=${taskType}`);
    process.exit(3);
  }

  const phaseCap = phaseTokenCap(policy, phase);
  const phaseUsed = state.usage.phaseTokens[phase] || 0;
  const warningThreshold = policy.token_policy.phase_warning_threshold;
  const phaseSoftLimit = Math.floor(phaseCap * warningThreshold);
  const taskSoftCap = policy.token_policy.soft_task_cap[difficulty] || policy.token_policy.soft_task_cap.medium;
  const shouldDowngrade = phaseUsed >= phaseSoftLimit;
  const budgetExceeded = phaseUsed >= phaseCap;
  const selectedModel = resolveModel({ routeEntry, provider, difficulty, shouldDowngrade: shouldDowngrade || budgetExceeded });
  const fallbackModel = routeEntry.providers?.[provider]?.fallback_model || selectedModel;

  const triggers = policy.fallback_policy.ordered_triggers;
  const maxRetry = Number(policy.fallback_policy.max_retry_per_trigger || 1);
  const quality = evaluateQuality(qualityScore, Number(policy.fallback_policy.quality_threshold));

  let attempt = 0;
  let result = null;
  let modelInUse = selectedModel;
  let triggerReason = null;
  const attempts = [];

  while (!dryRun && attempt <= maxRetry) {
    attempt += 1;
    result = await executeAgentRequest({
      provider,
      model: modelInUse,
      prompt,
      cwd,
      phase,
      taskType,
      contextSummary: args["context-summary"] || "",
      nativeSessionId,
      timeoutMs: Number(args["timeout-ms"] || policy.execution_policy.default_timeout_ms || 180000)
    });
    attempts.push({
      attempt,
      model: modelInUse,
      success: result.success,
      errorType: result.errorType || null,
      usage: result.usage
    });

    if (!result.success) {
      if (result.errorType === "error" && triggers.includes("error")) {
        triggerReason = "error";
      } else if (result.errorType === "timeout" && triggers.includes("timeout")) {
        triggerReason = "timeout";
      }
    } else if (quality === "low" && triggers.includes("quality_low")) {
      triggerReason = "quality_low";
    } else if (budgetExceeded && triggers.includes("budget_exceeded")) {
      triggerReason = "budget_exceeded";
    } else if ((result.usage.inputTokens + result.usage.outputTokens) > taskSoftCap && triggers.includes("budget_exceeded")) {
      triggerReason = "budget_exceeded";
    } else {
      triggerReason = null;
    }

    if (!triggerReason || attempt > maxRetry) break;
    modelInUse = fallbackModel;
  }

  const finalNativeSessionId = result?.nativeSessionId || nativeSessionId || null;
  if (!state.logicalSessions[logicalSessionId]) state.logicalSessions[logicalSessionId] = {};
  state.logicalSessions[logicalSessionId][provider] = {
    nativeSessionId: finalNativeSessionId,
    model: modelInUse,
    updatedAt: new Date().toISOString()
  };
  const usedTokens = dryRun ? 0 : (result?.usage?.inputTokens || 0) + (result?.usage?.outputTokens || 0);
  state.usage.totalTokens += usedTokens;
  state.usage.phaseTokens[phase] = (state.usage.phaseTokens[phase] || 0) + usedTokens;
  saveState(stateFile, state);

  const payload = {
    success: dryRun ? true : Boolean(result?.success),
    provider,
    projectId,
    phase,
    taskType,
    difficulty,
    logicalSessionId,
    nativeSessionId: finalNativeSessionId,
    selectedModel,
    finalModel: modelInUse,
    dryRun,
    fallbackTriggeredBy: triggerReason,
    phaseBudget: {
      cap: phaseCap,
      usedBefore: phaseUsed,
      usedAfter: state.usage.phaseTokens[phase],
      warningThreshold: phaseSoftLimit
    },
    usage: result?.usage || { inputTokens: 0, outputTokens: 0, estimated: true },
    attempts,
    output: dryRun ? "" : (result?.output || ""),
    errorType: dryRun ? null : (result?.errorType || null),
    errorMessage: dryRun ? null : (result?.errorMessage || null),
    timestamp: new Date().toISOString()
  };
  appendJsonl(logFile, payload);
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  process.exit(payload.success ? 0 : 1);
}

main();
