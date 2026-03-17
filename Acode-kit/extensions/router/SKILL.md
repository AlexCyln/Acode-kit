---
name: Acode-router
description: Model routing layer for Acode-kit. Selects model version by phase, task type, and difficulty; executes through agent execute; maintains logical and native sessions.
---

# Acode-router

Use this skill when:
1. Acode-kit needs to run a concrete subtask in a model-routed way.
2. The user requests model-version routing by phase/task/difficulty.
3. The workflow requires fallback, token budget control, and execution logs.

## Scope
1. Router only handles model selection and execution dispatch.
2. Router does not manage project stage transitions.
3. Acode-kit remains the workflow orchestrator.

## Inputs
1. `project_id`
2. `phase`
3. `task_type`
4. `difficulty`
5. `provider` (`codex` or `claude`)
6. `prompt`
7. `context_summary`
8. optional `logical_session_id`
9. optional `native_session_id`

## Session model
1. `logical_session_id` is routing state key. Default: `project_id + ":" + phase`.
2. `native_session_id` is provider session key returned by `agent execute`.
3. Router must store mapping:
   - `logical_session_id -> provider -> native_session_id`
4. Router must pass `native_session_id` back into later calls to preserve continuity.

## Fallback order
1. `error`
2. `timeout`
3. `quality_low`
4. `budget_exceeded`

Each level retries at most once before returning failure.

## Cost policy
1. Phase budget is the hard cap.
2. Task budget is soft cap.
3. If phase usage reaches warning threshold, route to fallback model first.
4. If phase usage exceeds hard cap, stop high-tier model and force budget-aware fallback.

## Integration contract
1. Acode-kit calls Router with stage context.
2. Router returns:
   - selected model
   - execution result
   - updated session ids
   - token usage and policy decisions
3. Acode-kit continues stage workflow using Router result.
