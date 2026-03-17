---
name: Acode-kit
description: Use this skill when the user wants to start, structure, or continue a concrete software project in a solo + AI vibe coding workflow. It initializes project-level documents, applies the bundled global engineering standards, drives the project stage by stage from requirements to deployment, and keeps scope, traceability, testing, and handoff records updated.
---

# Acode-kit

Use this skill when:
1. The user gives a high-level project idea and wants Codex to turn it into a structured project.
2. The user wants to build a new project from zero under the fixed stack and the bundled global standards.
3. The user wants to continue an in-progress project while keeping requirements, scope, coding, testing, and deployment aligned.
4. The user explicitly mentions `Acode-kit`.

This skill is intended to be the single public entry point for the whole workflow. Do not require the user to remember multiple skills for normal project delivery.

## What this skill does
1. Applies the bundled global engineering standards as the top-level constraints.
2. Creates and maintains project-level documents before and during implementation.
3. Pushes work in small vertical slices instead of unbounded bulk generation.
4. Keeps requirements, decisions, traceability, testing, and go-live status in sync.

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

## Startup workflow
When a project starts or the user provides a fresh project brief:
1. Read `references/global-engineering-standards/README.md`
2. Read `references/global-engineering-standards/00_GLOBAL_ENGINEERING_PRINCIPLES.md`
3. Read `references/global-engineering-standards/15_AI_COLLABORATION_PLAYBOOK.md`
4. Read `references/global-engineering-standards/22_SOLO_AI_PROJECT_OPERATING_MANUAL.md`
5. Read `references/global-engineering-standards/27_PROJECT_EXECUTION_FLOW_SPEC.md`
6. Read `references/global-engineering-standards/28_PROJECT_DIRECTORY_AND_REPOSITORY_STRUCTURE_SPEC.md`
7. Inspect the current workspace and determine whether this is:
   - a new project
   - an existing project to continue
   - a partial module iteration
8. On first project bootstrap, create the project root structure and the project-level `AGENTS.md`.
9. Create or update the minimum project-level documents.
10. Extract pending confirmations instead of silently inventing core business rules.

## Minimum project-level documents
Use the templates in `assets/project-doc-templates/` to create these when missing:
1. `AGENTS.md`
2. `docs/project/PROJECT_OVERVIEW.md`
3. `docs/project/PROJECT_OVERRIDES.md`
4. `docs/project/PRD.md`
5. `docs/project/DECISION_LOG.md`
6. `docs/project/TRACEABILITY_MATRIX.md`
7. `docs/project/SESSION_HANDOFF.md`
8. `docs/project/GO_LIVE_RECORD.md`

The user should only need to provide the project need or project brief. The workflow requirements are already embedded in this skill and the bundled standards.

## Stage-driven execution
Follow the bundled execution flow in `references/global-engineering-standards/27_PROJECT_EXECUTION_FLOW_SPEC.md`.

Minimal stage order:
1. Project initialization
2. Requirements structuring
3. UI / page structuring
4. Data and API design
5. Project scaffold initialization
6. Small-slice implementation
7. Review, testing, debug
8. Deployment and go-live

Never skip a stage if its missing outputs would make the next stage unstable.

## Router integration
Use `extensions/router` as the model-routing execution layer when the task needs model-version selection.

Rules:
1. Acode-kit remains the stage orchestrator and is responsible for phase transitions.
2. Use unified entry `acode-run` for task execution so users only interact with Acode-kit as a single entry point.
3. Router is called at phase entry, phase-exit cross-trigger tasks, and explicit high-difficulty subtasks.
4. Route input must include `project_id`, `phase`, `task_type`, `difficulty`, `provider`, `prompt`, and `context_summary`.
5. Always treat `logical_session_id` and `native_session_id` as different keys:
   - `logical_session_id`: routing state key, default `project_id:phase`
   - `native_session_id`: provider continuation key from runtime execution
6. Fallback order is fixed: `error -> timeout -> quality_low -> budget_exceeded`.
7. Phase token budget is hard cap; task budget is soft cap.
8. For simple low-risk tasks, default to no multi-model routing and ask user confirmation before bypassing router.

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
4. `references/global-engineering-standards/07_REDIS_CACHE_SPEC.md`
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

## Implementation rules
1. Keep the fixed stack unchanged unless the user explicitly overrides it at the project level.
2. Work in small vertical slices mapped to concrete requirement IDs.
3. Update project documents as you go; do not leave documentation until the end.
4. Before implementing a new subtask, check whether detailed development documents already exist for API, database, function/module, and testing. If a required document is missing, create the project-level `md` entry first, then continue implementation.
5. Keep project documents layered as: current control docs, active review drafts, approved reference materials, detailed implementation docs, and archived history. Do not mix current execution docs with long historical records.
6. `SESSION_HANDOFF.md` should stay concise and current-facing. Move long historical progress, superseded handoffs, and closed review drafts into an archive area instead of letting active control docs grow indefinitely.
7. If the user input is fuzzy, structure it into project docs first.
8. If a new request conflicts with the current PRD, explicitly surface the conflict and let the user decide whether to replace, keep, or defer; do not silently merge conflicting scope.
9. Treat `TRACEABILITY_MATRIX.md` as the higher-level project roadmap document. Do not reduce it to a short task log or session checklist.
10. For each main-task next node, default to `main task -> node -> submodule review draft -> user confirmation -> implementation`; do not jump from a broad node description straight into code.
11. If a node needs UI, first gather the user’s design style / interaction / detail requirements, then design the page in Pencil (or the project’s confirmed design tool) strictly from the approved review draft plus real API / database outputs.
12. After the user approves the Pencil page, reconstruct it in the frontend one-to-one; do not silently add or remove modules, fields, buttons, states, tags, headings, or interactions.
13. If a major decision changes scope, write it into the decision log before implementing.
14. After first bootstrap, treat the generated project root `AGENTS.md` as the persistent in-repo continuation entry so future work inside the same repository keeps following the same workflow without the user re-stating it.

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

## Do not
1. Replace the fixed technology stack on your own.
2. Skip project docs and jump straight to large-scale coding.
3. Expand scope silently.
4. Generate a full system in one pass when the project facts are still incomplete.
5. Ask the user to restate workflow rules that are already embedded in this skill and the generated project `AGENTS.md`.
