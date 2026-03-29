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
8. Step 4a: stack-confirmed directory synthesis + startup file relocation
9. Gate 4a: explicit user approval
10. Step 4b: environment + engineering scaffold setup
11. Gate 4b: explicit user approval

## Startup outputs

### Step 1

- workspace state
- MCP tool status summary
- NotebookLM auth state
- provider bundle / cache baseline

### Step 2

- startup-staged file `.acode-kit-startup/PROJECT_SKELETON.approved.md`
- startup-staged file `.acode-kit-startup/PROJECT_OVERVIEW.seed.md`
- recommended tech stack
- business logic summary
- module decomposition seed
- UI/UX direction
- scope boundaries

`Step 2` execution contract:

1. write or update the startup-staged files before asking for Gate 2 review
2. treat the startup-staged files as the authoritative review surface
3. do not paste the full skeleton or overview into the conversation
4. tell the user which files were written, whether NotebookLM strengthening was used, and what needs review inside those files
5. the gate response may summarize execution status, deltas, and review focus only
6. if NotebookLM MCP is installed and authenticated, use it to strengthen requirements analysis before freezing the skeleton
7. if NotebookLM is unavailable or fails, continue with direct analysis but explicitly disclose the degraded path in the gate response

### Step 3

- startup-staged file `.acode-kit-startup/PRD.approved.md`
- startup-staged file `.acode-kit-startup/PROGRESS_PLAN.approved.md`
- startup-staged file `.acode-kit-startup/TRACEABILITY_MATRIX.seed.md`
- startup-staged file `.acode-kit-startup/DECISION_LOG.seed.md`
- startup-staged file `.acode-kit-startup/STACK_AND_DIRECTORY_INPUTS.approved.md`

`Step 3` must freeze implementation-facing inputs as far as the current project truth allows, including:

1. requirement boundary and approved scope
2. UI and interaction direction
3. declared frontend runtime, UI system, styling, and testing stack
4. declared backend runtime, API style, and security boundary
5. declared database, migration, and data-access strategy
6. declared deployment and environment delivery mode
7. design asset, third-party integration, and tool constraints
8. any known module-level directory expectations implied by active scenario and stack packages

`Step 3` execution contract:

1. write or update all startup-staged Step 3 files before asking for Gate 3 review
2. treat the startup-staged files as the authoritative review surface
3. do not paste the full PRD, progress plan, or stack input package into the conversation
4. tell the user which files were written, the current execution status, and the exact file paths for review
5. the gate response may summarize scope changes, unresolved items, and review focus only

### Gate 3.5

- recommended LMS tier: `S`, `M`, or `L`
- rationale based on PRD draft and approved skeleton
- governance and execution-density tradeoffs

### Step 4a

- confirmed tech stack and directory synthesis inputs based on approved startup docs
- synthesized `docs/project/DIRECTORY_PLAN.md` from approved stack inputs plus active stack fragments
- project root structure
- root `AGENTS.md`
- `docs/dev/DEVELOPMENT_DOCUMENTATION_INDEX.md`
- current-file and review-history containers required by the documentation governance spec
- project control docs relocated from startup-staged approved artifacts into formal paths
- pending confirmations extracted instead of invented

Required materialization at `Step 4a`:

1. `Step 2` and `Step 3` outputs must already exist as startup-staged files with stable names under `.acode-kit-startup/`
2. the approved Step 2 and Step 3 files must be directly moved or renamed into formal project docs instead of being re-summarized into weaker placeholders
3. templates may provide metadata fields, destination names, and index hooks, but approved startup content remains the source of truth
4. if any approved section is missing at setup time, stop and reconstruct it from the approved startup artifact before continuing
5. before creating directories, confirm the project tech stack from the approved startup docs and use that confirmed stack as the only legal source for stack-fragment loading
6. directory synthesis must assemble and analyze the final project tree from the approved Step 3 stack inputs plus active stack directory fragments; fallback blueprints are allowed only when those fragments are insufficient for a professional stack-aligned decision
7. `Step 4a` must create the node-owned governance files required at setup time in their formal locations, including `DIRECTORY_PLAN.md`, `AGENTS.md`, and `docs/dev/DEVELOPMENT_DOCUMENTATION_INDEX.md`
8. `Step 4a` may move, rename, wrap, and link startup-staged files, but it must not regenerate document bodies from memory

### Step 4b

- dependencies initialized
- environment configured
- engineering scaffold initialized according to the declared stack
- pending confirmations extracted instead of invented

`Step 4b` execution contract:

1. it begins only after Gate 4a confirms the directory plan, generated directories, and file relocation results
2. it runs directly inside the already created project directory and must treat the Step 4a structure as the fixed base
3. it may initialize package managers, dependencies, runtime configs, build tools, and engineering scaffold files in place
4. it may create code, configuration, and environment files required by the declared stack, but only under the directories already synthesized in `Step 4a`
5. it must not rewrite project control docs that were already relocated in `Step 4a`
6. it must report scaffold status, dependency status, and remaining environment confirmations separately from the directory-materialization report

## Startup rules

1. No files or directories before Gate 3 approval.
2. No design tools before Gate 4b approval.
3. NotebookLM auth trigger is the exact text `Log me in to NotebookLM`.
4. If workspace status file is missing, the runtime may use the user-level global cache as baseline.
5. `Step 4a` is directory materialization only; `Step 4b` is environment and scaffold setup only.
6. Startup never invokes `acode-run`.
7. `acode-run` may only appear later as a bounded routed subtask after Gate 4b.
8. LMS tier changes setup density only; it does not relax `Step 4a` or `Step 4b` deliverable completeness.
9. `Step 4a` must create formal project docs by carrying forward approved startup content, not by inventing new simplified documents.
10. From `Step 2` onward, every approved startup artifact must be persisted as a file under `.acode-kit-startup/` before the workflow may advance to the next gate.
11. Startup-staged files use stable names and are the only authoritative handoff source for `Step 4a` document relocation.
12. `Step 4a` may rename and move startup-staged files into formal destinations, but it must not rewrite their approved substance into a weaker summary.
13. `Step 4a` must confirm the approved tech stack from the startup docs, then synthesize a stack-aligned `DIRECTORY_PLAN.md` before creating directories.
14. If active stack or scenario fragments conflict, resolve the conflict in the directory plan and record the rationale before creating directories.
15. `Step 2` and `Step 3` user-facing gate responses must point the user to the startup-staged files for review instead of inlining the full document bodies in chat.
16. If NotebookLM is available and authenticated at `Step 2`, requirements analysis must use it as a strengthening input before the project skeleton is frozen.
17. `Step 4b` may start only after `Step 4a` finishes file relocation and the user explicitly approves Gate 4a.
