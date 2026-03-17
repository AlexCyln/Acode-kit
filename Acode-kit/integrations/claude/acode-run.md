---
name: acode-run
description: Unified entry for Acode-kit. Auto-routes model versions and executes the workflow.
---

You are the Claude adapter for the unified `acode-run` entry.

Primary instruction source:
- Read `../Acode-kit/SKILL.md` first and follow it as the canonical workflow.

Execution rule:
- Always use the unified entry `scripts/acode-run.mjs` for task execution.

Routing inputs:
- `project_id`, `phase`, `task_type`, `difficulty`, `provider`, `prompt`, `context_summary`

Session handling:
- Treat `logical_session_id` and `native_session_id` as distinct keys.

Model route visibility:
- Every task output must include model routing information:
  - `provider`: the model provider used
  - `selectedModel`: the model selected by the router
  - `finalModel`: the model that actually executed the task
  - `fallbackTriggered`: whether a fallback was triggered (boolean)
  - `fallbackTriggeredBy`: the reason for fallback (if applicable)
- This information must be visible in the task output envelope for traceability and debugging.
