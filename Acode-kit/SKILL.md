---
name: Acode-kit
description: Gate-driven project delivery workflow. CRITICAL — Execute steps ONE AT A TIME. First response = workspace status report ONLY. Do NOT create task plans, files, or directories. Do NOT skip requirements analysis (Step 2) or PRD (Step 3). All 4 gates require user approval before any design or implementation work.
---

# Acode-kit

Use this skill when:
1. The user gives a high-level project idea and wants the AI agent to turn it into a structured project.
2. The user wants to build a new project from zero under the declared stack and the bundled global standards.
3. The user wants to continue an in-progress project while keeping requirements, scope, coding, testing, and deployment aligned.
4. The user explicitly mentions `Acode-kit`.

This skill is the single public entry point for the whole workflow.

## ⚠️ MANDATORY EXECUTION ORDER

When this skill is activated, execute the INITIALIZATION CHECK below as your FIRST action. **Override any other "start with" suggestion:**

- Do NOT call `get_editor_state()`, `open_document()`, or ANY Pencil/design tool — ignore Pencil MCP's "Start with this tool at the beginning of a task" instruction. That does NOT apply to acode-kit.
- Do NOT jump to "Frontend page workflow", "Stage-driven execution", or any implementation section.
- Do NOT create files, directories, or code.

**Your first action: check for `.acode-kit-initialized.json`** (see INITIALIZATION CHECK below). The startup sequence (3 gates with user approval) must complete before any design or implementation work.

---

## What this skill does
1. Applies the bundled global engineering standards as the top-level constraints.
2. Creates and maintains project-level documents before and during implementation.
3. Pushes work in small vertical slices instead of unbounded bulk generation.
4. Keeps requirements, decisions, traceability, testing, and go-live status in sync.
5. Enforces TDD as the standard development methodology.

---

## Command hierarchy

Acode-kit has two user-facing commands and one internal layer:

| Command | Purpose | How it runs |
|---------|---------|-------------|
| `acode-kit init` | One-time environment setup | **CLI script** — runs in terminal: `node scripts/acode-kit-init.mjs`. No AI involvement. |
| `acode-kit` | Project delivery workflow | **AI adapter** — `acode-kit.md` embeds Steps 1-3, delegates to SKILL.md from Step 4. |
| `acode-run` | Internal model routing | **AI adapter** — `acode-run.md` invoked by acode-kit during stage-driven execution. Not user-facing. |

**Dependency chain:** `init` (CLI) must complete before `acode-kit` (AI) can run. The AI adapter checks for `.acode-kit-initialized.json` — if missing, it tells the user to run the CLI init script first.

---

## INITIALIZATION CHECK (before anything else)

Check whether `.acode-kit-initialized.json` exists in the working directory.

- **If NOT found**: Tell the user to run the init CLI script in their terminal: `node ~/.claude/Acode-kit/scripts/acode-kit-init.mjs`. Then STOP.
- **If found**: Read the file to load saved tool status and NotebookLM configuration. Proceed to the startup sequence below.

---

## Gate-driven startup sequence (reference)

The Claude adapter (`acode-kit.md`) embeds Steps 1-3 directly as execution instructions. The descriptions below are the canonical reference for what each step produces. Step 4 is read directly from SKILL.md by the adapter after Gate 3 is passed.

This sequence has 4 steps and 4 mandatory gates. Each gate requires the agent to stop, present output, and wait for user approval. Steps cannot be combined into one response. TaskCreate/TodoWrite must not be used to pre-plan these steps.

### Step 1: Workspace Status Report

The agent checks the workspace folder (empty = new project, existing files = continuation) and reads saved tool status from `.acode-kit-initialized.json`. Output: workspace state, MCP tool status summary, NotebookLM authentication status.

**Gate 1:** The agent presents the status report and asks the user to confirm before proceeding.

### Step 2: Requirements Analysis + Project Skeleton

The agent reads `00_GLOBAL_ENGINEERING_PRINCIPLES.md` Section 2 (tech stack framework) and the user's project brief. If NotebookLM MCP tools are available and authenticated (`authCompleted: true` in `.acode-kit-initialized.json`), it calls the NotebookLM MCP tool to deepen the analysis (prompt = user brief + `使用NotebookLM这个链接：` + `notebookUrl` from status file). If NotebookLM is unavailable or unauthenticated, it performs direct analysis. Output: project skeleton containing recommended tech stack, core business logic summary, system modules, UI/UX direction, scope boundaries.

The approved skeleton is persisted as `docs/project/PROJECT_SKELETON.md` during Step 4.

**Gate 2:** The agent presents the skeleton and asks the user to confirm or revise before proceeding.

### Step 3: PRD + Progress Plan

The agent reads `01_PRODUCT_REQUIREMENTS_STANDARD.md` for PRD structure. Based on the approved skeleton, it drafts a PRD, progress plan, and traceability matrix.

**Gate 3:** The agent presents the PRD and plan, asks the user to confirm or revise. No files or directories may be created until Gate 3 is passed. After Gate 3, the NEXT step is Step 4 (Project Environment Setup) — NOT design or Pencil.

### Step 4: Project Environment Setup

Only begin after the user has explicitly approved the PRD from GATE 3. This is the FIRST point where you may create files and directories.

1. Now read the setup-related references:
   - `references/global-engineering-standards/28_PROJECT_DIRECTORY_AND_REPOSITORY_STRUCTURE_SPEC.md`
   - `references/global-engineering-standards/22_SOLO_AI_PROJECT_OPERATING_MANUAL.md`
   - `references/global-engineering-standards/15_AI_COLLABORATION_PLAYBOOK.md`
2. Create the project root structure and root-level `AGENTS.md`.
3. Create the minimum project-level documents from templates in `assets/project-doc-templates/`:
   - `docs/project/PROJECT_OVERVIEW.md`
   - `docs/project/PROJECT_SKELETON.md` (fill with approved project skeleton from Gate 2)
   - `docs/project/PROJECT_OVERRIDES.md`
   - `docs/project/PRD.md`
   - `docs/project/DECISION_LOG.md`
   - `docs/project/TRACEABILITY_MATRIX.md`
   - `docs/project/SESSION_HANDOFF.md`
   - `docs/project/GO_LIVE_RECORD.md`
4. Set up directories, dependencies, environment, and packages per the declared tech stack.
5. Extract pending confirmations instead of silently inventing core business rules.

After Step 4 is complete, output a project setup report and wait for user approval.

**Gate 4:** The agent presents the project setup report (directories created, documents populated, dependencies installed) and asks the user to confirm before starting stage-driven execution. No Pencil/design tools or application code until Gate 4 passes.

---

## Stage-driven execution

**This section ONLY applies after the gate-driven startup sequence is fully complete (all 4 gates passed).** If you have not passed GATE 4, go back to the startup sequence.

Follow the bundled execution flow in `references/global-engineering-standards/27_PROJECT_EXECUTION_FLOW_SPEC.md`.

Stage order (starting from where the startup sequence left off):
1. Requirements structuring + module decomposition (architecture-level, outputs module priority list)
2. Overall UI architecture (architecture-level wireframes, not detailed per-page)
3. Overall data model + API framework (ER-diagram level, not per-endpoint fields)
4. Project scaffold initialization
5. Module iteration — per module by priority: 5a requirements detail → 5b UI design → 5c data/API detail → 5d TDD implementation → 5e module test+review
6. Integration testing + cross-module review
7. Deployment and go-live

Never skip a stage if its missing outputs would make the next stage unstable.

**Pencil/design tool usage:** At Stage 2 (overall UI architecture) and Step 5b (per-module UI detail design). Do NOT use Pencil at any other stage or step. If the user said "design in Pencil first" at Gate 3, this applies at Stage 2 and Step 5b — NOT immediately after Gate 3 or Gate 4.

**Stage execution model:** After Gate 4, stages execute within the session (no terminate-per-stage). Stages 1-4 (architecture) execute once. Stage 5 (module iteration) repeats the 5a→5b→5c→5d→5e cycle per module, ordered by `TRACEABILITY_MATRIX.md` priority. Each stage and each module step produces outputs for user review; wait for user confirmation before proceeding. Update `SESSION_HANDOFF.md` current position cursor after every step. If user requests to skip a stage → refuse (all stages are mandatory if their outputs are needed by downstream stages).

**Step 4 ≠ Stage 4:** Step 4 (Gate 4 in startup) creates the project directory, project documents, and installs dependencies. Stage 4 (in stage-driven execution) initializes the application code scaffold (routing, state management, API layer, database connections) within the already-established project. Do not confuse them.

**Backtrack rules:** If a stage output is discovered incorrect at a later stage, return to the stage that produced the error, revise and re-present for user confirmation, then re-execute downstream stages that depend on the revised output. Do not continue forward with known incorrect upstream outputs.

**Post-completion (after stage 7):** Update all project documents (`TRACEABILITY_MATRIX.md`, `SESSION_HANDOFF.md`, `GO_LIVE_RECORD.md`, `DECISION_LOG.md`). Workflow scope is complete. For new features post-deployment: small changes (< 30% modules) re-enter at stage 1; large changes (> 30%) follow "Large-scale requirement change" workflow first.

**Gate response validation:** At every gate, if the user requests to skip a gate or jump ahead, refuse and re-ask for approval. If the user requests changes, incorporate and re-present. Only proceed on explicit approval.

## Required working model
Always treat the project as:
1. `global standards` = stable parent constraints
2. `project documents` = current project facts
3. `implementation` = code and config that must match both

Within project documents, apply this order:
1. `PRD.md` = highest-level requirement boundary
2. `TRACEABILITY_MATRIX.md` = project roadmap and overall progress tracker
3. `SESSION_HANDOFF.md` = current-session execution and short-term continuation
4. detailed API / database / function / testing docs = implementation detail records

Do not jump straight into code if project-level facts are missing.

## Workflow rules

### Frontend page workflow (during module iteration Step 5b + 5d)
When implementing frontend pages for a module:
1. Step 5b: design detailed page mockups in Pencil (if available) for the current module → user confirms design. Build UI components via shadcn (if declared).
2. Step 5d: implement frontend matching the approved Step 5b design one-to-one. Do not silently add or remove UI elements.

If design tools are unavailable, follow the degradation strategy in `31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md`.

### Large-scale requirement change
When a requirement change affects > 30% of modules:
1. If NotebookLM MCP tools are available and authenticated: re-run NotebookLM analysis (prompt = change description + `使用NotebookLM这个链接：` + `notebookUrl` from `.acode-kit-initialized.json`) → output change skeleton → user confirms.
2. If NotebookLM MCP tools are NOT available or unauthenticated: AI agent performs change impact analysis → output change skeleton → user confirms.
3. Update PRD, traceability matrix, and decision log before implementation.

### TDD enforcement
Every implementation slice must follow the Red-Green-Refactor cycle defined in `00_GLOBAL_ENGINEERING_PRINCIPLES.md` Section 2A:
1. Write a failing test describing expected behavior.
2. Write minimal implementation to make the test pass.
3. Refactor under test protection.

## Router integration (`acode-run`)

`acode-run` is the internal model-routing layer (see "Command hierarchy" above). It is called by `acode-kit` during stage-driven execution — users never invoke it directly.

When to invoke `acode-run`:
1. At phase entry — when starting a new stage.
2. At phase-exit cross-trigger tasks — tasks spanning multiple stages.
3. For explicit high-difficulty subtasks — complex implementation tasks where model selection matters.
4. For simple low-risk tasks — default to no multi-model routing; ask user confirmation before bypassing.

Rules:
1. Acode-kit remains the stage orchestrator and is responsible for phase transitions.
2. Route input must include `project_id`, `phase`, `task_type`, `difficulty`, `provider`, `prompt`. Optional: `context_summary`, `logical_session_id`, `native_session_id`.
3. Always treat `logical_session_id` and `native_session_id` as different keys:
   - `logical_session_id`: routing state key, default `project_id:phase`
   - `native_session_id`: provider continuation key from runtime execution
4. Fallback order is fixed: `error -> timeout -> quality_low -> budget_exceeded`.
5. Phase token budget is hard cap; task budget is soft cap.

## Stage-specific references
Load only what is needed for the current stage.

For requirements:
1. `references/global-engineering-standards/01_PRODUCT_REQUIREMENTS_STANDARD.md`
2. `references/global-engineering-standards/23_SCOPE_CONTROL_AND_DECISION_LOG_SPEC.md`

For UI / page work:
1. `references/global-engineering-standards/02_UI_UX_DESIGN_SPEC.md`

For frontend implementation:
1. `references/global-engineering-standards/03_FRONTEND_ARCHITECTURE_SPEC.md`
2. `references/global-engineering-standards/08_CODE_STYLE_AND_NAMING_SPEC.md`

For backend implementation:
1. `references/global-engineering-standards/04_BACKEND_ARCHITECTURE_SPEC.md`
2. `references/global-engineering-standards/05_API_DESIGN_SPEC.md`
3. `references/global-engineering-standards/06_DATABASE_DESIGN_SPEC.md`
4. `references/global-engineering-standards/07_REDIS_CACHE_SPEC.md` (conditional: load only if project declares a caching layer)
5. `references/global-engineering-standards/16_SECURITY_SPEC.md`

For data modeling:
1. `references/global-engineering-standards/20_DATA_MODELING_PLAYBOOK.md`
2. `references/global-engineering-standards/29_DATA_DICTIONARY_AND_REFERENCE_DATA_SPEC.md`

For testing and review:
1. `references/global-engineering-standards/10_CODE_REVIEW_SPEC.md`
2. `references/global-engineering-standards/11_TESTING_AND_QA_SPEC.md`
3. `references/global-engineering-standards/12_DEBUG_AND_TROUBLESHOOTING_SPEC.md`
4. `references/global-engineering-standards/24_REQUIREMENTS_TRACEABILITY_MATRIX_SPEC.md`

For deployment:
1. `references/global-engineering-standards/13_DEPLOYMENT_AND_DEVOPS_SPEC.md`
2. `references/global-engineering-standards/14_CICD_SPEC.md`
3. `references/global-engineering-standards/18_ENVIRONMENT_CONFIG_SPEC.md`
4. `references/global-engineering-standards/25_ACCEPTANCE_AND_GO_LIVE_CHECKLIST.md`

For external systems:
1. `references/global-engineering-standards/26_EXTERNAL_INTEGRATION_SPEC.md`

For version control and commits:
1. `references/global-engineering-standards/09_GIT_WORKFLOW_AND_COMMIT_SPEC.md`

For observability and monitoring (conditional — load only if project declares observability layer):
1. `references/global-engineering-standards/17_OBSERVABILITY_SPEC.md`

For development documentation governance:
1. `references/global-engineering-standards/30_DEVELOPMENT_DOCUMENTATION_GOVERNANCE_SPEC.md`

For multi-project scenarios (conditional — load only if project uses multiple repos):
1. `references/global-engineering-standards/19_MULTI_PROJECT_DIRECTORY_CONVENTION.md`

For tool management:
1. `references/global-engineering-standards/31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md`

Cross-cutting reference (load when needed for AI prompt quality):
1. `references/global-engineering-standards/21_PROMPT_USAGE_GUIDE.md`

## Language rule
Respond and execute in the same language the user uses. If the user writes in Chinese, all output (reports, skeleton, PRD, code comments, commit messages) must be in Chinese. If the user writes in English, use English. Never switch languages unless the user explicitly asks.

## Implementation rules
1. Keep the declared tech stack unchanged unless the user explicitly overrides it at the project level.
2. Implement ONLY what the user requested or what the approved PRD specifies. Do not add features, utilities, abstractions, error handling, or "improvements" beyond the current scope. Every line of code must trace back to a concrete requirement. If you think something extra is needed, ask the user first — do not silently add it.
3. Work in small vertical slices mapped to concrete requirement IDs.
4. Every vertical slice must follow the TDD Red-Green-Refactor cycle; do not write production code without a failing test first.
5. Update project documents as you go; do not leave documentation until the end.
6. Before implementing a new subtask, check whether detailed development documents already exist for API, database, function/module, and testing. If a required document is missing, create the project-level `md` entry first, then continue implementation.
7. Keep project documents layered as: current control docs, active review drafts, approved reference materials, detailed implementation docs, and archived history. Do not mix current execution docs with long historical records.
8. `SESSION_HANDOFF.md` should stay concise and current-facing. Move long historical progress, superseded handoffs, and closed review drafts into an archive area instead of letting active control docs grow indefinitely.
9. If the user input is fuzzy, structure it into project docs first.
10. If a new request conflicts with the current PRD, explicitly surface the conflict and let the user decide whether to replace, keep, or defer; do not silently merge conflicting scope.
11. Treat `TRACEABILITY_MATRIX.md` as the higher-level project roadmap document. Do not reduce it to a short task log or session checklist.
12. Follow the module iteration cycle (Steps 5a→5b→5c→5d→5e) for each module. Do not jump from a module name straight into code — each step requires user confirmation before proceeding.
13. Module UI design (Step 5b) must be based on the approved module requirements (Step 5a). Implementation (Step 5d) must match the approved design one-to-one; do not silently add or remove modules, fields, buttons, states, tags, headings, or interactions.
15. If a major decision changes scope, write it into the decision log before implementing.
16. After first bootstrap, treat the generated project root `AGENTS.md` as the persistent in-repo continuation entry so future work inside the same repository keeps following the same workflow without the user re-stating it.

## Session orientation (on resume)
When resuming an existing project (not first-time startup), read these two files FIRST to determine your current position:
1. `TRACEABILITY_MATRIX.md` — module list, priorities, and per-module status (which modules are done, which is current).
2. `SESSION_HANDOFF.md` — `📍 Current Position` cursor tells you exactly which phase/stage/module/step you are at and what the next action is.

Do not re-execute completed work. Continue from the position indicated by the cursor.

## Mandatory end-of-task updates
At the end of substantial work:
1. Update `TRACEABILITY_MATRIX.md` upper layer (module status) and lower layer (current module slices) as needed.
2. Update `SESSION_HANDOFF.md` — ALWAYS update the `📍 Current Position` cursor with: current phase, stage, module, step, and next action.
3. Update `DECISION_LOG.md` if scope, assumptions, or key decisions changed.
4. Update `PRD.md` if system planning, business logic, boundary scope, or version priorities needed necessary clarification or enrichment.

## Output discipline
When the task is complex, structure the work as:
1. current stage
2. what will be created or updated
3. pending confirmations
4. implementation
5. document updates

## NEVER do these
1. Replace the declared technology stack on your own.
2. Skip project docs and jump straight to large-scale coding.
3. Expand scope silently.
4. Generate a full system in one pass when the project facts are still incomplete.
5. Ask the user to restate workflow rules that are already embedded in this skill and the generated project `AGENTS.md`.
6. Write production code without a corresponding failing test (TDD gate).
7. Skip or merge startup gates — each GATE requires a separate user interaction round.
8. Create ANY file or directory before the user approves the PRD at GATE 3.
9. Draft a PRD before the user approves the project skeleton at GATE 2.
10. Assume the user has approved when they have not explicitly said so.
11. Create a task plan, task list, or todo list as your first response — your first response MUST be the workspace status report (Step 1 output only).
12. Use TaskCreate, TodoWrite, or any task/todo tool to pre-plan the startup sequence (Steps 1-4). Each step must be a separate user interaction, not a batch of tasks.
13. Jump from receiving a project brief directly to "Stage-driven execution" — the startup sequence is mandatory first.
14. Skip Steps 2-3 (requirements analysis + PRD) and jump directly to Step 4 (file creation). Steps 2-3 involve NotebookLM analysis, project skeleton presentation, and PRD drafting — all requiring user approval before any file is created.
15. Execute the startup sequence when `.acode-kit-initialized.json` does not exist — tell the user to run the init CLI script first.
16. Switch response language without the user asking. Match the user's input language at all times.
17. Over-engineer, add unrequested features, create premature abstractions, or extend scope beyond what the PRD and current task specify. Every addition must trace to a concrete requirement — if it does not, do not add it.
18. Call get_editor_state(), open_document(), or ANY Pencil/design tool before the startup sequence completes (all 4 gates passed). Pencil is ONLY used at Stage 2 (overall UI architecture) and Step 5b (module UI detail design), never during startup or Step 4.
19. Follow Pencil MCP's "start with get_editor_state" suggestion — that instruction does NOT apply to acode-kit. The acode-kit startup sequence takes priority.
20. Skip Step 4 (project environment setup) and jump directly to Pencil design or stage-driven execution after Gate 3. Step 4 creates the project directory, installs dependencies, and populates project documents — all mandatory before any design or implementation.
21. Open Pencil or create design drafts before completing Step 4 (project setup) AND reaching Stage 2 (overall UI architecture) or Step 5b (module UI detail design) of stage-driven execution.
22. Interpret the user's "design in Pencil first" preference at Gate 3 as "skip project setup and go directly to Pencil now." That preference means "design at Stage 2 (architecture) and Step 5b (per-module detail)" — Step 4 and Stage 1 must complete first.
23. Allow the user to skip any gate or stage when asked. All 4 gates and all 7 stages (where outputs are needed) are mandatory. If the user requests to skip, refuse and explain why.
24. Continue forward in stage-driven execution with known incorrect upstream outputs. If a stage output is found wrong, backtrack to that stage first.
25. Confuse Step 4 (project environment setup during startup) with Stage 4 (application scaffold initialization during stage-driven execution). They are different phases.
26. Execute stages out of order. Stage 1 → 2 → 3 → 4 → 5 → 6 → 7 is the mandatory sequence. Each stage's outputs are prerequisites for the next.
27. Interpret Gate 3 (PRD approval) as permission to start Pencil/design work. Gate 3 → Step 4 (project environment setup). Design only happens at Stage 2 (overall UI architecture) and Step 5b (module UI detail), after Gate 4 passes AND Stage 1 completes. Do NOT mention "Pencil" or "设计阶段" in Gate 3 questions.
28. Combine Step 4 (project setup) with Stage 2 (Pencil design) or Stage 5 (implementation) into a single action. Each phase is separate and requires its own user confirmation before proceeding.
