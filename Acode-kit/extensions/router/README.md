# Acode-router Extension

This extension adds model-version routing for Acode-kit.

## Components
1. `SKILL.md`: Router skill contract and boundaries.
2. `config/model-map.json`: task-to-model mapping per phase/provider.
3. `config/task-classifier.json`: keyword-based task classification rules.
4. `config/policy.json`: token/fallback/timeout policy.
5. `scripts/router-exec.mjs`: routing entrypoint.
6. `scripts/agent-execute.mjs`: provider execution adapter.

## Model route display
Task execution output includes model routing information:
- `selectedModel`: the model chosen by the router
- `finalModel`: the model that actually executed the task
- `fallbackTriggered`: whether a fallback was triggered
- `fallbackTriggeredBy`: reason for fallback (if applicable)

## Quick run
```bash
node scripts/router-exec.mjs \
  --provider codex \
  --project-id demo-project \
  --phase 实现 \
  --task-type 前后端编码开发 \
  --difficulty high \
  --context-summary "REQ-12, implement API + page integration" \
  --prompt "Implement the next vertical slice following PRD and traceability matrix." \
  --cwd "$(pwd)"
```

## State and logs
1. Router state: `.acode-router/state.json`
2. Execution logs: `.acode-router/execution.jsonl`

## Session strategy
1. Logical session id: `project_id:phase` (or custom input)
2. Native session id: returned from provider run
3. Router maps logical to native id and reuses native id automatically
