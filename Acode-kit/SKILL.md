---
name: Acode-kit
description: Gate-driven project delivery workflow. CRITICAL — Execute steps ONE AT A TIME. First response = workspace status report ONLY. Do NOT create task plans, files, or directories. Do NOT skip requirements analysis (Step 2) or PRD (Step 3). All 3 gates require user approval before any file creation.
---

# Acode-kit

Use this skill when:
1. The user gives a high-level project idea and wants the AI agent to turn it into a structured project.
2. The user wants to build a new project from zero under the declared stack and the bundled global standards.
3. The user wants to continue an in-progress project while keeping requirements, scope, coding, testing, and deployment aligned.
4. The user explicitly mentions `Acode-kit`.

This skill is the single public entry point for the whole workflow.

## What this skill does
1. Applies the bundled global engineering standards as the top-level constraints.
2. Creates and maintains project-level documents before and during implementation.
3. Pushes work in small vertical slices instead of unbounded bulk generation.
4. Keeps requirements, decisions, traceability, testing, and go-live status in sync.
5. Enforces TDD as the standard development methodology.

---

## Command hierarchy

Acode-kit has three commands with distinct roles. They execute in strict order:

| Command | Purpose | When | Claude adapter |
|---------|---------|------|----------------|
| `acode-kit init` | One-time environment setup | Once after installation | `acode-init.md` — self-contained, does NOT read SKILL.md |
| `acode-kit` | Project delivery workflow | Each project | `acode-kit.md` — embeds Steps 1-3, delegates to SKILL.md from Step 4 |
| `acode-run` | Internal model routing | During stage-driven execution | `acode-run.md` — invoked by acode-kit, NOT by users directly |

**Dependency chain:** `init` must complete before `acode-kit` can run. `acode-run` is called internally by `acode-kit` during implementation stages — users never invoke it directly.

---

## INITIALIZATION CHECK (before anything else)

**Before executing any project workflow, check whether `.acode-kit-initialized.json` exists in the working directory.**

- **If NOT found**: Tell the user: "Acode-kit has not been initialized. Please run `acode-kit init` first to set up MCP tools and NotebookLM authentication." Then STOP. Do NOT proceed with any startup gates or project work.
- **If found**: Read the file to load saved tool status and NotebookLM configuration. Use this data instead of re-scanning tools. Proceed to the startup sequence below.

---

## MANDATORY FIRST ACTION

**When this skill is loaded for a new project or a fresh project brief, you MUST execute the gate-driven startup sequence below. This is NOT optional. Do NOT skip to "Stage-driven execution". Do NOT create any files, directories, or task plans until you have passed GATE 3.**

**Your first response to the user MUST be the output of Step 1 (workspace status report). Nothing else.**

**IMPORTANT: Do NOT use TaskCreate, TodoWrite, or any task/todo planning tool to plan Steps 1-4 upfront. Execute each step individually as a single response, then STOP and wait for the user. The gate system requires human interaction between every step — pre-planning defeats the purpose.**

---

## Gate-driven startup sequence

This sequence has 4 steps and 3 mandatory gates. Each gate requires you to STOP, present output to the user, and WAIT for explicit user approval before continuing. You may NOT combine multiple steps into one response.

### Step 1: Workspace Status Report (YOUR ONLY ACTION RIGHT NOW)

Do this FIRST and ONLY this. Do not read reference docs, do not analyze requirements, do not plan stages, do not create task lists.

1. Scan the current workspace folder:
   - Empty folder → new project
   - Existing project → continuation or iteration
2. Read tool status from `.acode-kit-initialized.json` (already loaded in Initialization Check above). Do NOT re-scan or re-install tools — that was handled during `acode-kit init`.
3. Present to the user:
   - Workspace state (empty / existing project)
   - MCP tool status summary (from saved initialization data)
   - NotebookLM authentication status

**>>> GATE 1: STOP HERE. Output the workspace status report. Explicitly ask: "Please confirm the workspace status, or tell me if anything needs adjustment." Wait for the user's reply. DO NOT continue to Step 2 in this same response. <<<**

### Step 2: Requirements Analysis + Project Skeleton (MANDATORY — DO NOT SKIP)

Only begin after the user has replied to GATE 1. This step is NOT optional — it produces the project skeleton that the user must approve before any PRD or file creation.

1. Read ONLY `references/global-engineering-standards/00_GLOBAL_ENGINEERING_PRINCIPLES.md` Section 2 (tech stack decision framework). Do NOT read other reference documents at this stage — they are loaded later per stage as needed.
2. Read the user's project prompt/brief.
3. Analyze the project brief and produce a **project skeleton**:
   - If NotebookLM MCP is available: invoke NotebookLM to deepen the analysis. When calling NotebookLM, append the notebook URL to the prompt: `"Here's my NotebookLM: [notebookLM.notebookUrl from .acode-kit-initialized.json]"`.
   - If NotebookLM MCP is unavailable: perform the analysis directly.
4. The project skeleton MUST contain:
   - Recommended tech stack (frontend, backend, database, deployment, design tool)
   - Core business logic summary
   - System modules / partitions
   - UI/UX style direction
   - Scope boundaries and constraints
5. Present the project skeleton to the user.

**>>> GATE 2: STOP HERE. Present the project skeleton. Explicitly ask: "Please confirm this project skeleton, or tell me what to revise." Wait for the user's reply. DO NOT draft a PRD, create any files, or plan any stages until the user explicitly approves. If the user requests changes, revise and re-present until approved. <<<**

### Step 3: PRD + Progress Plan (MANDATORY — DO NOT SKIP)

Only begin after the user has explicitly approved the project skeleton from GATE 2. This step is NOT optional — the PRD must be approved before any file or directory creation.

1. Read `references/global-engineering-standards/01_PRODUCT_REQUIREMENTS_STANDARD.md` (PRD structure reference). Do NOT load other specs yet.
2. Based on the approved skeleton, determine the tech stack and prepare `PROJECT_OVERRIDES.md` content.
3. Draft a structured PRD.
4. Generate a progress plan and requirements traceability matrix.
5. Present the PRD and progress plan to the user.

**>>> GATE 3: STOP HERE. Present the PRD and progress plan. Explicitly ask: "Please confirm this PRD and plan, or tell me what to revise." Wait for the user's reply. DO NOT create project directories, files, dependencies, or any code until the user explicitly approves. If the user requests changes, revise and re-present until approved. <<<**

### Step 4: Project Environment Setup

Only begin after the user has explicitly approved the PRD from GATE 3. This is the FIRST point where you may create files and directories.

1. Now read the setup-related references:
   - `references/global-engineering-standards/28_PROJECT_DIRECTORY_AND_REPOSITORY_STRUCTURE_SPEC.md`
   - `references/global-engineering-standards/22_SOLO_AI_PROJECT_OPERATING_MANUAL.md`
   - `references/global-engineering-standards/15_AI_COLLABORATION_PLAYBOOK.md`
2. Create the project root structure and root-level `AGENTS.md`.
3. Create the minimum project-level documents from templates in `assets/project-doc-templates/`:
   - `docs/project/PROJECT_OVERVIEW.md`
   - `docs/project/PROJECT_OVERRIDES.md`
   - `docs/project/PRD.md`
   - `docs/project/DECISION_LOG.md`
   - `docs/project/TRACEABILITY_MATRIX.md`
   - `docs/project/SESSION_HANDOFF.md`
   - `docs/project/GO_LIVE_RECORD.md`
4. Set up directories, dependencies, environment, and packages per the declared tech stack.
5. Extract pending confirmations instead of silently inventing core business rules.

After Step 4 is complete, proceed to the stage-driven execution below.

---

## Stage-driven execution

**This section ONLY applies after the gate-driven startup sequence is fully complete (all 3 gates passed).** If you have not passed GATE 3, go back to the startup sequence.

Follow the bundled execution flow in `references/global-engineering-standards/27_PROJECT_EXECUTION_FLOW_SPEC.md`.

Stage order (starting from where the startup sequence left off):
1. Requirements structuring (deepen PRD into detailed specs)
2. UI / page structuring
3. Data and API design
4. Project scaffold initialization
5. TDD-driven small-slice implementation
6. Review, testing, debug
7. Deployment and go-live

Never skip a stage if its missing outputs would make the next stage unstable.

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

### Frontend page workflow
When implementing frontend pages (if Pencil MCP and shadcn MCP are available):
1. Create design draft in Pencil → user confirms design.
2. Build UI components via shadcn component library (if declared as UI component library).
3. Proceed to frontend implementation matching the approved design one-to-one.

If design tools are unavailable, follow the degradation strategy in `31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md`.

### Large-scale requirement change
When a requirement change affects > 30% of modules:
1. If NotebookLM MCP is available: re-run NotebookLM analysis → output change skeleton → user confirms.
2. If NotebookLM MCP is unavailable: AI agent performs change impact analysis → output change skeleton → user confirms.
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
2. Route input must include `project_id`, `phase`, `task_type`, `difficulty`, `provider`, `prompt`, and `context_summary`.
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

For tool management:
1. `references/global-engineering-standards/31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md`

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
12. For each main-task next node, default to `main task -> node -> submodule review draft -> user confirmation -> implementation`; do not jump from a broad node description straight into code.
13. If a node needs UI, first gather the user's design style / interaction / detail requirements, then design the page in the declared design tool strictly from the approved review draft plus real API / database outputs.
14. After the user approves the design, reconstruct it in the frontend one-to-one; do not silently add or remove modules, fields, buttons, states, tags, headings, or interactions.
15. If a major decision changes scope, write it into the decision log before implementing.
16. After first bootstrap, treat the generated project root `AGENTS.md` as the persistent in-repo continuation entry so future work inside the same repository keeps following the same workflow without the user re-stating it.

## Mandatory end-of-task updates
At the end of substantial work:
1. Update `TRACEABILITY_MATRIX.md` if the project roadmap, current main task, next main tasks, module stage, or scope-control judgment changed in a necessary way.
2. Update `DECISION_LOG.md` if scope, assumptions, or key decisions changed.
3. Update `PRD.md` if system planning, business logic, boundary scope, or version priorities needed necessary clarification or enrichment.
4. Update `SESSION_HANDOFF.md` with:
   - completed work
   - current state
   - next steps
   - risks
   - pending confirmations

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
15. Execute the startup sequence when `.acode-kit-initialized.json` does not exist — tell the user to run `acode-kit init` first.
16. Switch response language without the user asking. Match the user's input language at all times.
17. Over-engineer, add unrequested features, create premature abstractions, or extend scope beyond what the PRD and current task specify. Every addition must trace to a concrete requirement — if it does not, do not add it.
