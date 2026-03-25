# Acode-router Extension

This extension adds model-version routing for Acode-kit.

## Current position

- This is the internal routing layer used by `acode-run`.
- It is not a user-facing entry point.
- It maps task phase, difficulty, and provider to the most suitable model.
- It preserves logical session continuity and reuses native sessions when possible.

## Components
1. `ROUTER_RUNTIME.md`: Router runtime contract and boundaries.
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

## Operational notes
1. Keep router config aligned with the main Acode-kit workflow docs.
2. Update model mapping when stage or phase semantics change.
3. If a fallback is triggered, record the reason in the execution log so later sessions can reuse the same routing state.
