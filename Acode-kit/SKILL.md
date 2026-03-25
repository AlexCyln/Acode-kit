---
name: Acode-kit
description: Lightweight workflow entry for Acode-kit. First action: check `.acode-kit-initialized.json` or the provider global cache. Keep the 4 startup gates + Gate 3.5 + 7 execution stages unchanged. Load workflow and standards progressively. Preserve gate control, stage order, and project-document governance.
---
# Acode-kit
Use this skill when:
1. the user wants a project delivered under the Acode-kit workflow
2. the user wants to continue an Acode-kit-managed project
3. the user explicitly mentions `Acode-kit`

## Core role

Acode-kit is the public workflow orchestrator. It owns:
1. startup gate control
2. stage transitions
3. document loading order
4. sub-agent delegation boundary
5. project-document governance

It does not replace:
1. `acode-kit init` for environment initialization
2. `acode-run` for internal routed execution
3. standards packages for detailed rules

## First action
Before anything else:

1. check `.acode-kit-initialized.json` in the workspace
2. if missing, check the provider global cache:
   - `~/.codex/acode-kit/.acode-kit-global.json`
   - `~/.claude/acode-kit/.acode-kit-global.json`
3. if neither exists, tell the user to run:
   - `node ~/.codex/skills/Acode-kit/scripts/acode-kit-init.mjs`
   - `node ~/.claude/Acode-kit/scripts/acode-kit-init.mjs`
4. stop until initialization exists

Never start with Pencil, editor-state tools, or code generation.
## Loading order
Read only the minimum needed, in this order:

1. this file
2. `integrations/shared/WORKFLOW_CORE.md`
3. provider adapter:
   - `integrations/codex/acode-kit.md`
   - `integrations/claude/acode-kit.md`
4. current workflow doc in `workflows/`
5. current load rule in `references/load-rules/`
6. required scenario / stack standards
7. project-level `ACTIVE_STANDARDS.md` and control docs

Do not bulk-read all workflows or all standards on entry.
## Workflow graph
Startup sequence:
1. Step 1: workspace status report
2. Gate 1: user approval
3. Step 2: requirements analysis + project skeleton
4. Gate 2: user approval
5. Step 3: PRD + progress plan
6. Gate 3: user approval
7. Gate 3.5: LMS tier confirmation
8. Step 4: project environment setup
9. Gate 4: user approval

Stage-driven execution:
1. Stage 1: requirements structuring + module decomposition
2. Stage 2: overall UI architecture
3. Stage 3: overall data model + API framework
4. Stage 4: project scaffold initialization
5. Stage 5: module iteration
6. Stage 6: integration testing + cross-module review
7. Stage 7: deployment and go-live

Stage 5 is fixed per module:
1. Step 5a
2. Step 5b
3. Step 5c
4. Step 5d
5. Step 5e

## Non-negotiable boundaries
1. no file or directory creation before Gate 3 approval
2. no design work before Gate 4 approval
3. Pencil/design tools only at Stage 2 and Step 5b
4. `Step 4` is not `Stage 4`
5. do not skip or merge gates
6. do not skip stages when downstream outputs depend on them
7. wait for explicit user approval at every gate, stage review, and Step 5a-5e review

## Workflow references
Use these files instead of expanding the main entry:

1. startup: `workflows/startup.md`
2. approvals and document updates: `workflows/gate-rules.md`
3. stage order and boundaries: `workflows/stage-execution.md`
4. module design / TDD / shadcn / access-info rules: `workflows/module-iteration.md`
5. major changes: `workflows/change-management.md`
6. tool and context degradation: `workflows/fallback-and-degrade.md`

## Standards routing
Use:
1. `references/load-rules/DOCUMENT_LOADING_RULES.md`
2. `references/load-rules/TASK_TO_STANDARD_MAP.md`
3. `references/load-rules/AGENT_DELEGATION_RULES.md`

Detailed standards live in:
1. `references/global-engineering-standards/`
2. `references/scenario-standards/`
3. `references/stack-standards/`

Project-level activation lives in:
1. `docs/project/PROJECT_OVERRIDES.md`
2. `docs/project/ACTIVE_STANDARDS.md`

## Router and delegation
`acode-run` is internal and not user-facing. Invoke it only for routed subtasks. Keep:
1. `project_id`, `phase`, `task_type`, `difficulty`, `provider`, `prompt`
2. optional `context_summary`, `logical_session_id`, `native_session_id`
3. fallback order: `error -> timeout -> quality_low -> budget_exceeded`

Delegate bounded analysis only. Final gate decisions and final user-facing conclusions stay with the main agent.

## Session resume
When resuming an existing project, read first:
1. `TRACEABILITY_MATRIX.md`
2. `SESSION_HANDOFF.md`

Continue from the recorded cursor. Do not re-run completed nodes.
## Language and output
1. use the user's language throughout
2. keep outputs review-ready and stage-specific
3. update project control docs before advancing

## Never do these
1. replace the declared tech stack on your own
2. jump straight to coding when project facts are missing
3. expand scope silently
4. write production code without a failing test first
5. let the user skip mandatory gates or stages
6. interpret Gate 3 as permission to start design
7. treat a missing MCP tool as a reason to abandon the workflow when a documented degradation exists
