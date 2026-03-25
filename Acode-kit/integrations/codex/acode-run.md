---
name: acode-run-codex-runtime
description: Codex runtime supplement for the internal Acode-run router. Mirrors the shared routing contract without changing routing inputs, budgets, or fallback order.
---

# Acode-run Codex Runtime

Use this file together with:

1. `SKILL.md`
2. `integrations/shared/WORKFLOW_CORE.md`
3. `extensions/router/SKILL.md`

This file does not change router behavior. It documents how Codex should treat `acode-run`.

## Contract

1. `acode-run` is internal and not user-facing.
2. It is invoked only from the Acode-kit workflow.
3. It must not run startup gates.
4. It must not create project docs or directories.
5. It must preserve the same routing payload:
   - `project_id`
   - `phase`
   - `task_type`
   - `difficulty`
   - `provider`
   - `prompt`
   - optional `context_summary`, `logical_session_id`, `native_session_id`

## Routing invariants

1. `logical_session_id` and `native_session_id` are different keys.
2. Fallback order stays `error -> timeout -> quality_low -> budget_exceeded`.
3. Phase token budget is a hard cap.
4. Task token budget is a soft cap.

## Codex-specific note

When Codex is the execution environment:

1. keep `provider=codex`
2. expose routing metadata in the final output
3. do not turn `acode-run` into a second project workflow entry
