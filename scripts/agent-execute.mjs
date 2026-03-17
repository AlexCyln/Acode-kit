#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

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

function readArgValue(args, key, fallback = "") {
  return Object.prototype.hasOwnProperty.call(args, key) ? args[key] : fallback;
}

function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

function uuidCandidate(text) {
  if (!text) return null;
  const match = text.match(/\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i);
  return match ? match[0] : null;
}

function collectNumericFields(node, keys, out) {
  if (!node || typeof node !== "object") return;
  for (const [key, value] of Object.entries(node)) {
    if (keys.includes(key) && typeof value === "number") out.push(value);
    if (value && typeof value === "object") collectNumericFields(value, keys, out);
  }
}

function parseCodexJsonl(stdout) {
  const lines = stdout.split("\n").map((line) => line.trim()).filter(Boolean);
  let nativeSessionId = null;
  const tokenCandidates = [];
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      const id = uuidCandidate(JSON.stringify(parsed));
      if (id) nativeSessionId = nativeSessionId || id;
      collectNumericFields(parsed, ["input_tokens", "output_tokens"], tokenCandidates);
    } catch {
      const id = uuidCandidate(line);
      if (id) nativeSessionId = nativeSessionId || id;
    }
  }
  return {
    nativeSessionId,
    rawInputTokens: tokenCandidates[0] || null,
    rawOutputTokens: tokenCandidates[1] || null
  };
}

function parseClaudeJson(stdout) {
  const result = {
    nativeSessionId: null,
    rawInputTokens: null,
    rawOutputTokens: null
  };
  const id = uuidCandidate(stdout);
  if (id) result.nativeSessionId = id;
  try {
    const parsed = JSON.parse(stdout);
    const tokenCandidates = [];
    collectNumericFields(parsed, ["input_tokens", "output_tokens"], tokenCandidates);
    result.rawInputTokens = tokenCandidates[0] || null;
    result.rawOutputTokens = tokenCandidates[1] || null;
    if (!result.nativeSessionId) {
      result.nativeSessionId = uuidCandidate(JSON.stringify(parsed));
    }
  } catch {
    // Keep best-effort parsing only.
  }
  return result;
}

function runCommand({ cmd, cmdArgs, cwd, timeoutMs }) {
  return new Promise((resolve) => {
    const child = spawn(cmd, cmdArgs, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut });
    });
  });
}

export async function executeAgentRequest(request) {
  const provider = request.provider;
  const model = request.model;
  const cwd = request.cwd || process.cwd();
  const timeoutMs = request.timeoutMs || 180000;
  const prompt = request.prompt || "";
  const contextSummary = request.contextSummary || "";
  const nativeSessionId = request.nativeSessionId || "";

  const mergedPrompt = [
    `[Phase] ${request.phase || "N/A"}`,
    `[TaskType] ${request.taskType || "N/A"}`,
    contextSummary ? `[ContextSummary]\n${contextSummary}` : "",
    `[Task]\n${prompt}`
  ].filter(Boolean).join("\n\n");

  let cmd = "";
  let cmdArgs = [];
  if (provider === "codex") {
    cmd = "codex";
    if (nativeSessionId) {
      cmdArgs = ["exec", "resume", nativeSessionId, mergedPrompt, "--model", model, "--cd", cwd, "--json", "--skip-git-repo-check"];
    } else {
      cmdArgs = ["exec", mergedPrompt, "--model", model, "--cd", cwd, "--json", "--skip-git-repo-check"];
    }
  } else if (provider === "claude") {
    cmd = "claude";
    cmdArgs = ["-p", "--output-format", "json", "--model", model];
    if (nativeSessionId) cmdArgs.push("--session-id", nativeSessionId);
    cmdArgs.push(mergedPrompt);
  } else {
    return {
      success: false,
      provider,
      model,
      errorType: "error",
      errorMessage: `Unsupported provider: ${provider}`,
      usage: { inputTokens: estimateTokens(mergedPrompt), outputTokens: 0, estimated: true }
    };
  }

  const startedAt = new Date().toISOString();
  const executed = await runCommand({ cmd, cmdArgs, cwd, timeoutMs });
  const endedAt = new Date().toISOString();

  const parserResult = provider === "codex"
    ? parseCodexJsonl(executed.stdout)
    : parseClaudeJson(executed.stdout);

  const outputText = executed.stdout.trim() || executed.stderr.trim();
  const estimatedInput = estimateTokens(mergedPrompt);
  const estimatedOutput = estimateTokens(outputText);
  const usage = {
    inputTokens: parserResult.rawInputTokens || estimatedInput,
    outputTokens: parserResult.rawOutputTokens || estimatedOutput,
    estimated: !(parserResult.rawInputTokens && parserResult.rawOutputTokens)
  };

  if (executed.timedOut) {
    return {
      success: false,
      provider,
      model,
      startedAt,
      endedAt,
      nativeSessionId: parserResult.nativeSessionId || nativeSessionId || null,
      errorType: "timeout",
      errorMessage: `Execution timed out after ${timeoutMs}ms`,
      raw: { stdout: executed.stdout, stderr: executed.stderr },
      usage
    };
  }

  if (executed.code !== 0) {
    return {
      success: false,
      provider,
      model,
      startedAt,
      endedAt,
      nativeSessionId: parserResult.nativeSessionId || nativeSessionId || null,
      errorType: "error",
      errorMessage: executed.stderr.trim() || `Provider process exited with code ${executed.code}`,
      raw: { stdout: executed.stdout, stderr: executed.stderr },
      usage
    };
  }

  return {
    success: true,
    provider,
    model,
    startedAt,
    endedAt,
    nativeSessionId: parserResult.nativeSessionId || nativeSessionId || null,
    output: outputText,
    raw: { stdout: executed.stdout, stderr: executed.stderr },
    usage
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const provider = readArgValue(args, "provider");
  const model = readArgValue(args, "model");
  const prompt = readArgValue(args, "prompt");
  if (!provider || !model || !prompt) {
    console.error("Usage: acode-agent-execute --provider <codex|claude> --model <name> --prompt <text> [--cwd <dir>] [--phase <name>] [--task-type <name>] [--context-summary <text>] [--native-session-id <id>] [--timeout-ms <ms>]");
    process.exit(2);
  }

  const result = await executeAgentRequest({
    provider,
    model,
    prompt,
    cwd: path.resolve(readArgValue(args, "cwd", process.cwd())),
    phase: readArgValue(args, "phase"),
    taskType: readArgValue(args, "task-type"),
    contextSummary: readArgValue(args, "context-summary"),
    nativeSessionId: readArgValue(args, "native-session-id"),
    timeoutMs: Number(readArgValue(args, "timeout-ms", "180000"))
  });

  if (args["output-file"]) {
    const outputFile = path.resolve(args["output-file"]);
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.success ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
