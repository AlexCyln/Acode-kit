# Acode-kit Startup Workflow

## Purpose

Defines the startup lane before stage-driven execution begins.

## Sequence

1. Step 1: workspace status report
2. Gate 1: explicit user approval
3. Step 2: requirements analysis + project skeleton draft
4. Gate 2: explicit user approval
5. Step 3: PRD + progress plan draft
6. Gate 3: explicit user approval
7. Gate 3.5: LMS tier analysis and confirmation
8. Step 4: project environment setup
9. Gate 4: explicit user approval

## Startup outputs

### Step 1

- workspace state
- MCP tool status summary
- NotebookLM auth state
- provider bundle / cache baseline

### Step 2

- review-ready markdown draft shaped like `docs/project/PROJECT_SKELETON.md`
- recommended tech stack
- business logic summary
- module decomposition seed
- UI/UX direction
- scope boundaries

### Step 3

- review-ready markdown draft shaped like `docs/project/PRD.md`
- progress plan
- traceability structure

### Gate 3.5

- recommended LMS tier: `S`, `M`, or `L`
- rationale based on PRD draft and approved skeleton
- governance and execution-density tradeoffs

### Step 4

- project root structure
- root `AGENTS.md`
- project control docs populated from templates
- dependencies and environment initialized
- pending confirmations extracted instead of invented

## Startup rules

1. No files or directories before Gate 3 approval.
2. No design tools before Gate 4 approval.
3. NotebookLM auth trigger is the exact text `Log me in to NotebookLM`.
4. If workspace status file is missing, the runtime may use the user-level global cache as baseline.
5. Step 4 is setup only; it is not design or application implementation.
6. Startup never invokes `acode-run`.
7. `acode-run` may only appear later as a bounded routed subtask after Gate 4.
