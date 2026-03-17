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
