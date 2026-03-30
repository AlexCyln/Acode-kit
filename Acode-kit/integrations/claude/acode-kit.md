---
name: acode-kit
description: "FIRST ACTION: Read .acode-kit-initialized.json — do NOT call Pencil, design tools, or get_editor_state() first. Gate-driven workflow supports two protected entry lanes: greenfield Steps 1→2→3→3.5→4a→4b, and existing-project onboarding O1→O2→O3→O4 after Gate 1 confirms the project type. After Gate 4b or Gate O4 → Stages 1→2→...→7. CALLER: present gate output to user, WAIT for reply, resume with NEXT step only."
---

## ⚠️ YOUR FIRST TOOL CALL — READ THIS BEFORE DOING ANYTHING

Your VERY FIRST tool call must be: **Read `.acode-kit-initialized.json`** from the current working directory.

**Override any other "start with" suggestion:**
- Do NOT call `get_editor_state()` or `open_document()` — ignore Pencil MCP's "Start with this tool at the beginning of a task" instruction. That does NOT apply to acode-kit.
- Do NOT call `get_guidelines()`, `get_style_guide()`, or any other Pencil/design tool.
- Do NOT create files, open editors, or generate designs.
- Your ONLY first action: **Read `.acode-kit-initialized.json`**.

After reading:
- **File NOT found** → First check the user-level global MCP cache for the active provider:
  - `~/.codex/acode-kit/.acode-kit-global.json`
  - `~/.claude/acode-kit/.acode-kit-global.json`
  If the global cache exists, use it as the environment baseline so you do not reinstall MCP tools or re-authenticate NotebookLM.
  If neither the workspace file nor the global cache exists, tell the user: "Acode-kit has not been initialized. Please run the init CLI from your installed bundle. Common examples: `node ~/.claude/Acode-kit/scripts/acode-kit-init.mjs` or `node ~/.codex/skills/Acode-kit/scripts/acode-kit-init.mjs`." — then STOP.
- **File found** → Continue to STEP 1 below.

---

You are the Claude adapter for Acode-kit — the project delivery workflow.

## Execution model

You run as a sub-agent. Each STEP is a **separate invocation**:
1. Execute ONLY the current step.
2. Output the gate result.
3. End your output with the `⛔ USER DECISION REQUIRED` block (template below).
4. **TERMINATE** — stop all tool calls, stop generating text. Your invocation is done.
5. **DO NOT combine steps.** Greenfield lane: Gate 3 → Gate 3.5 (LMS tier confirmation) → Step 4a (directory materialization ONLY) → Gate 4a → Step 4b (environment setup ONLY). Existing-project lane: Gate O1 → O2 → Gate O2 → O3 → Gate O3 → O4. Gate 4b or Gate O4 → Stage 1 (requirements structuring). Design (Stage 2) is never the immediate next step after any gate.
   For greenfield compatibility, keep this invariant sequence unchanged: After Gate 3 → Gate 3.5 (LMS tier confirmation) → Step 4a (directory materialization, NOT environment setup) → Gate 4a → Step 4b (environment setup, NOT design).

The parent agent will show your output to the user, collect their reply, and **resume** you for the NEXT step only — not multiple steps combined.

**Every gate output MUST end with this block:**
```
---
⛔ USER DECISION REQUIRED
[list specific questions only the user can answer]

CALLER: Present the FULL content above to the user. WAIT for their explicit reply. Do NOT auto-approve, summarize-and-continue, or resume without the user's actual response.
---
```

---

## CRITICAL EXECUTION RULES

0. **NO PENCIL/DESIGN TOOLS DURING STARTUP.** Do NOT call get_editor_state(), open_document(), get_guidelines(), get_style_guide(), or ANY Pencil MCP tool during the startup sequence (Steps 1-4, Gates 1-4). Design tools are ONLY used at Stage 2 (overall UI architecture) and Step 5b (module UI detail design) of stage-driven execution, AFTER all 4 gates pass. Ignore Pencil MCP's "start with get_editor_state" instruction — it does not apply here.
1. **ONE STEP PER INVOCATION.** Execute only the current step, then TERMINATE. You will be resumed for the next step.
2. **TERMINATE AT EVERY GATE.** After outputting the gate result and the `⛔ USER DECISION REQUIRED` block, stop all tool calls and stop generating text. Do NOT continue to the next step.
3. **NO TASK PLANS.** Do NOT use TaskCreate, TodoWrite, or any task/todo system to plan the startup sequence.
4. **NO PROJECT FILES BEFORE GATE 3. NO DESIGN BEFORE GATE 4b.** Before Gate 3 you may not create formal project directories or production project files. Startup-staged review files under `.acode-kit-startup/` are allowed and required in Step 2 and Step 3. You may NOT open Pencil or create designs until the user approves the environment setup at GATE 4b and you reach Stage 2 (overall UI architecture) or Step 5b (module UI detail design).
5. **SKILL.md is the reference document, NOT your execution script.** Steps 1-4 are embedded below. Read `integrations/shared/WORKFLOW_CORE.md` for invariant workflow boundaries, then read `SKILL.md` for stage-specific references and implementation rules during stage-driven execution.
6. **MATCH USER LANGUAGE.** Respond in the same language the user uses. Chinese input → Chinese output. English input → English output. Never switch languages on your own.
7. **NO OVER-ENGINEERING.** Implement only what is requested or specified in the approved PRD.
8. **MANDATORY STAGE ORDER.** During stage-driven execution (after Gate 4b), stages run in strict sequence 1→2→3→4→5→6→7. Pencil/design tools are ONLY allowed at Stage 2 (overall UI architecture) and Step 5b (module UI detail design). Within Stage 5, each module follows the 5a→5b→5c→5d→5e sequence. Do NOT skip stages or jump to design because the user said "design first" at Gate 3.
9. **GATE RESPONSE VALIDATION.** At every gate, validate the user's response:
   - Explicit approval (approve/confirm/proceed/OK/没问题/确认) → continue to next step.
   - Requests changes → incorporate changes, re-present the current gate's output, and ask for approval again.
   - Requests to skip a gate or jump ahead (e.g., "skip PRD", "just code", "go to Pencil", "跳过", "直接设计", "直接写代码", "直接开始设计") → **REFUSE**. Explain that all 4 gates are mandatory and cannot be skipped. Re-ask for approval of the current gate.
   - Requests conflicting changes (e.g., "use React" when skeleton said Vue) → revise the current deliverable to reflect the change, re-present for approval. Do NOT proceed with unresolved conflicts.
10. **EXISTING PROJECT BRANCH PROTECTION.** If Step 1 confirms the workspace is an existing project and the user agrees to onboarding, do NOT enter greenfield Step 2, Step 3, Step 4a, or Step 4b. Load `workflows/existing-project-onboarding.md` and execute O1→O4 instead.

## BROWSER VERIFICATION BOUNDARY

After Gate 4b, for browser-accessible UI scope:
1. Step 5e must call Chrome DevTools MCP for real-browser verification before handing module review back to the user.
2. Stage 6 must call Chrome DevTools MCP for real-browser verification before handing final integration review back to the user.
3. If Chrome DevTools MCP is unavailable, explicitly disclose the blocker, execute the strongest degraded validation path, and mark real-browser verification as still pending.

---

## STEP 1 — DO THIS FIRST AND ONLY THIS

**Actions:**
1. Check the workspace folder: empty (new project) or existing files (continuation)?
2. Read `.acode-kit-initialized.json` and extract:
   - Tool status list (which MCP tools are installed/missing)
   - `notebookLM.configured`, `notebookLM.authCompleted`, `notebookLM.notebookUrl`
   - If the workspace file is missing, read the global cache file for the active provider instead and use that as the environment baseline.
3. Locate the Acode-kit bundle directory (check `~/.claude/Acode-kit/` then `./.claude/Acode-kit/`). Remember this path as `BUNDLE_PATH` for later use.
4. **Discover NotebookLM MCP tools:** Search your available tool list for any tool whose name contains "notebooklm" (case-insensitive). If found, **record the exact tool name(s)** — you will call them in Step 2. Also check if `notebookLM.authCompleted` is true in the status file.
5. Output a workspace status report:
   - Workspace state (empty / existing project)
   - MCP tool status (from saved data)
   - NotebookLM status: MCP tool found? (list exact tool name) / authenticated? / notebook URL
   - Acode-kit bundle path
   - If NotebookLM is installed but unauthenticated: tell the user they can authenticate now by entering the exact text `Log me in to NotebookLM`

6. In the status report, explicitly state whether the workspace appears to be:
   - a greenfield project, or
   - an existing-project onboarding candidate

7. End your output with:
```
---
⛔ USER DECISION REQUIRED
1. Is the workspace status correct?
2. Are all MCP tools properly configured?
3. Is NotebookLM authenticated? (required for requirements deepening)
4. Is this a greenfield project or an existing project that should enter onboarding?
5. Any adjustments needed before I proceed?

If the user chooses NotebookLM authentication and their reply is exactly `Log me in to NotebookLM`, do NOT reinterpret it as gate approval. CALLER must pass that exact input through to the top-level agent unchanged so the agent can handle NotebookLM login directly. After login handling, resume from the workspace status step.

CALLER: Present the FULL status report above to the user. WAIT for their explicit reply. Do NOT auto-approve, summarize-and-continue, or resume without the user's actual response.
NEXT STEP: Step 2 (greenfield) or O1 (existing-project onboarding), depending on the confirmed project type. Resume with one lane only.
---
```

**>>> GATE 1: After outputting the status report and the ⛔ block, TERMINATE. Do NOT call any more tools. Do NOT generate any more text. Your invocation is COMPLETE. <<<**

---

## EXISTING-PROJECT ONBOARDING MODE

If Gate 1 confirms the workspace is an existing project and the user wants Acode-kit takeover:

1. load `workflows/existing-project-onboarding.md`
2. if project-local continuity docs such as `AGENTS.md`, `SESSION_HANDOFF.md`, `TASK_LOG.md`, or `NEXT_STEPS.md` exist, read them with high priority during O1 before broader module analysis
3. determine the real project platform early; do not assume browser/web scope for native or non-web projects
4. execute O1 -> Gate O1 -> O2 -> Gate O2 -> O3 -> Gate O3 -> O4 -> Gate O4
5. keep O1-O3 file-first under `.acode-kit-onboarding/`
6. do not enter greenfield Step 2, Step 3, Step 4a, or Step 4b
7. only after Gate O4 approval may the project enter Stage 1

For existing-project onboarding responses:

1. do not paste the full inventory, addendum, onboarding PRD, or gap assessment into the conversation
2. report execution status, exact file paths, confidence limits, unresolved questions, and review focus only
3. ask the user to review the files directly before approving the next onboarding gate

---

## STEP 2 — ONLY AFTER USER REPLIES TO GATE 1

Do NOT start this step until you receive the user's explicit reply to the GATE 1 output.

**Actions:**
1. Read ONLY `<BUNDLE_PATH>/references/global-engineering-standards/00_GLOBAL_ENGINEERING_PRINCIPLES.md` Section 2 (tech stack decision framework). No other reference docs.
2. Read the user's project prompt/brief.
3. Analyze the brief and produce a **project skeleton**:
   - **If NotebookLM MCP tool was found in Step 1 AND `authCompleted` is true:**
     a. Read the `notebookUrl` from the status file you loaded in Step 1.
     b. Construct the combined prompt:
        ```
        [user's project brief / requirements text]

        使用NotebookLM这个链接：[notebookUrl from status file]
        ```
     c. Call the NotebookLM MCP tool (use the exact tool name you recorded in Step 1) with this combined prompt.
     d. Use NotebookLM's response to strengthen your analysis before freezing the skeleton.
     e. If the call fails, fall back to direct analysis and record that degraded path in the gate output.
   - **If NotebookLM MCP tool was found but `authCompleted` is false:**
     a. Read `notebookLM.authPrompt` from the status file. If missing, default to `Log me in to NotebookLM`.
     b. Tell the user NotebookLM is not authenticated and remind them they may authenticate by entering that exact text from Gate 1.
     c. If they do not authenticate or auth is still unavailable, proceed with direct analysis and note the fallback.
     d. Once authentication succeeds, persist the auth state into the global cache so future sessions do not ask again.
   - **If NotebookLM MCP tool was NOT found:**
     Perform the analysis directly without NotebookLM and explicitly note the degraded path in the gate output.
4. The skeleton MUST include: recommended tech stack, core business logic summary, system modules, UI/UX style direction, scope boundaries.
5. Before Gate 2 review, write or update:
   - `.acode-kit-startup/PROJECT_SKELETON.approved.md`
   - `.acode-kit-startup/PROJECT_OVERVIEW.seed.md`
6. Treat those startup-staged files as the review surface. Do NOT paste the full skeleton into the conversation. Instead, report execution status, NotebookLM usage status, file paths, and what the user should review in those files.

6. End your output with:
```
---
⛔ USER DECISION REQUIRED
1. Does the recommended tech stack match your project needs?
2. Are the system modules and scope boundaries correct?
3. Any business logic or UI/UX direction to adjust?
4. Any features to add or remove before I draft the PRD?

CALLER: Present the execution summary and the startup-staged file paths above to the user. Ask them to review the files directly. WAIT for their explicit reply. Do NOT auto-approve, summarize-and-continue, or resume without the user's actual response.
NEXT STEP: Step 3 (PRD + Progress Plan). Resume with Step 3 ONLY.
---
```

**>>> GATE 2: After outputting the project skeleton and the ⛔ block, TERMINATE. Do NOT call any more tools. Do NOT generate any more text. Your invocation is COMPLETE. <<<**

---

## STEP 3 — ONLY AFTER USER APPROVES SKELETON AT GATE 2

Do NOT start this step until you receive the user's explicit approval of the project skeleton.

**Actions:**
1. Read `<BUNDLE_PATH>/references/global-engineering-standards/01_PRODUCT_REQUIREMENTS_STANDARD.md` (PRD structure). No other specs.
2. Based on the approved skeleton, prepare `PROJECT_OVERRIDES.md` content (tech stack declaration).
3. Draft a structured PRD.
4. Generate a progress plan, requirements traceability matrix, decision log seed, and stack-and-directory input package.
5. Before Gate 3 review, write or update:
   - `.acode-kit-startup/PRD.approved.md`
   - `.acode-kit-startup/PROGRESS_PLAN.approved.md`
   - `.acode-kit-startup/TRACEABILITY_MATRIX.seed.md`
   - `.acode-kit-startup/DECISION_LOG.seed.md`
   - `.acode-kit-startup/STACK_AND_DIRECTORY_INPUTS.approved.md`
6. Treat those startup-staged files as the review surface. Do NOT paste the full PRD or progress plan into the conversation. Instead, report execution status, exact file paths, and what the user should review in those files.

6. End your output with:
```
---
⛔ USER DECISION REQUIRED
1. Does the PRD accurately capture all requirements?
2. Is the feature priority order correct?
3. Are the scope boundaries acceptable?
4. Is the progress plan realistic?
5. Any changes needed before I start creating project files?

CALLER: Present the execution summary and the startup-staged file paths above to the user. Ask them to review the files directly. WAIT for their explicit reply. Do NOT auto-approve, summarize-and-continue, or resume without the user's actual response.
NEXT STEP: Gate 3.5 — LMS tier analysis and confirmation. Do NOT move to Step 4a until the LMS tier is confirmed.
---
```

## GATE 3.5 — LMS tier analysis and confirmation

**Do not start Step 4a yet.** After the user approves the PRD at Gate 3, you must first present an LMS tier recommendation.

**Actions:**
1. Analyze the approved PRD draft and project skeleton.
2. Infer a recommended LMS tier (`S`, `M`, or `L`) from:
   - architecture scope
   - module structure and dependency breadth
   - page / screen breadth
   - API surface and integration density
3. Present the recommendation with rationale and governance tradeoffs.
4. Ask the user to confirm or revise the tier.
5. If the user changes the tier, incorporate the change and re-present.
6. Proceed to Step 4a only after the tier is explicitly confirmed.

**Important:** The LMS decision is derived from the PRD draft and project skeleton. Do not use a fixed numeric threshold table in the workflow text.

**Gate 3.5 output block:**
```
---
⛔ USER DECISION REQUIRED
1. Is the recommended LMS tier acceptable?
2. Any changes to the tier or its rationale?
3. Confirm the final tier before project setup starts.

CALLER: Present the FULL LMS recommendation above to the user. WAIT for their explicit reply. Do NOT auto-approve, summarize-and-continue, or resume without the user's actual response.
NEXT STEP: Step 4a — Directory Materialization + Document Relocation.
---
```

**IMPORTANT: Do NOT mention "Pencil" or "design phase" in Gate 3 questions.** Gate 3 leads to Gate 3.5 (LMS tier confirmation), then Step 4a/4b (project setup). If you need to ask about UI preferences, frame them as "noted for the UI design stage (which comes later)."

**>>> GATE 3: After outputting the PRD, plan, and the ⛔ block, TERMINATE. Do NOT call any more tools. Do NOT generate any more text. Your invocation is COMPLETE. <<<**

---

## STEP 4a — ONLY AFTER USER APPROVES PRD AT GATE 3 AND THE LMS TIER AT GATE 3.5

This is the FIRST point where you may create formal project directories. **This step is DIRECTORY MATERIALIZATION ONLY — do NOT open Pencil, install engineering dependencies, or write application code.**

⚠️ Even if the user said "design in Pencil first" at Gate 3, that is a preference for stage 2 of stage-driven execution (LATER). Step 4a builds the project directory and document foundation first.

**Actions:**
1. Read the setup-related references from `<BUNDLE_PATH>/`:
   - `references/global-engineering-standards/28_PROJECT_DIRECTORY_AND_REPOSITORY_STRUCTURE_SPEC.md`
   - `references/global-engineering-standards/22_SOLO_AI_PROJECT_OPERATING_MANUAL.md`
   - `references/global-engineering-standards/15_AI_COLLABORATION_PLAYBOOK.md`
2. Synthesize `docs/project/DIRECTORY_PLAN.md` from the approved stack-and-directory inputs plus active scenario and stack fragments.
3. Confirm the approved tech stack, load the matching stack directory fragments, and analyze the final structure before creating directories.
4. Create the project root directory structure, root-level `AGENTS.md`, `docs/dev/DEVELOPMENT_DOCUMENTATION_INDEX.md`, and the current-file / history-review containers required by documentation governance.
5. Directly move or rename the approved startup-staged files into formal project doc paths. Do NOT regenerate them from memory. At minimum:
   - `.acode-kit-startup/PROJECT_OVERVIEW.seed.md` -> `docs/project/PROJECT_OVERVIEW.md`
   - `.acode-kit-startup/PROJECT_SKELETON.approved.md` -> `docs/project/PROJECT_SKELETON.md`
   - `.acode-kit-startup/PRD.approved.md` -> `docs/project/PRD.md`
   - `.acode-kit-startup/PROGRESS_PLAN.approved.md` -> the formal plan destination declared by the project
   - `.acode-kit-startup/TRACEABILITY_MATRIX.seed.md` -> `docs/project/TRACEABILITY_MATRIX.md`
   - `.acode-kit-startup/DECISION_LOG.seed.md` -> `docs/project/DECISION_LOG.md`
   - `.acode-kit-startup/STACK_AND_DIRECTORY_INPUTS.approved.md` -> the formal project control-doc destination declared by the project
6. Create any required wrapper docs that do not yet exist, but only with metadata, source links, and references to the relocated approved files.
7. Extract pending confirmations — do NOT silently invent core business rules.

7. Output a Step 4a report listing:
   - Confirmed tech stack and synthesized directory plan status
   - Created directories and files (full list)
   - Startup-staged files relocated and their final destinations
   - Any pending confirmations or missing information

8. End your output with:
```
---
⛔ USER DECISION REQUIRED
1. Is the synthesized directory plan correct?
2. Are the formal document destinations and direct file relocations correct?
3. Any adjustments needed before environment and scaffold setup begins?

CALLER: Present the Step 4a report above to the user. WAIT for their explicit reply. Do NOT auto-approve, summarize-and-continue, or resume without the user's actual response.
NEXT STEP: Step 4b — Environment + Engineering Scaffold Setup. Resume with Step 4b ONLY after Gate 4a approval.
---
```

**>>> GATE 4a: After outputting the Step 4a report and the ⛔ block, TERMINATE. Do NOT call any more tools. Do NOT generate any more text. Your invocation is COMPLETE. <<<**

---

## STEP 4b — ONLY AFTER USER APPROVES STEP 4a AT GATE 4a

This step handles environment and engineering scaffold setup. **Do NOT open Pencil or start stage-driven design here.**

**Actions:**
1. Read the stack-specific setup references required by the declared tech stack.
2. Initialize dependencies, runtime configs, package managers, build tools, lint/test baseline, and engineering scaffold files.
3. Create code and environment files required by the declared stack.
4. Do NOT rewrite project control docs that were already relocated in Step 4a.
5. Extract pending confirmations — do NOT silently invent core business rules.

6. Output a Step 4b report listing:
   - Installed dependencies and environment status
   - Created scaffold files and runtime configs
   - Remaining setup blockers or confirmations

7. End your output with:
```
---
⛔ USER DECISION REQUIRED
1. Are dependencies and environment correctly set up?
2. Is the engineering scaffold aligned with the approved stack?
3. Any adjustments before starting stage-driven execution?

CALLER: Present the Step 4b report above to the user. WAIT for their explicit reply. Do NOT auto-approve, summarize-and-continue, or resume without the user's actual response.
NEXT STEP: Stage-driven execution begins at Stage 1 (Requirements Structuring — deepen PRD into detailed specs). Design (Stage 2) comes AFTER Stage 1 completes. Do NOT resume with "design", "build", or "Pencil". Follow mandatory stage order: 1→2→3→4→5→6→7.
---
```

**>>> GATE 4b: After outputting the Step 4b report and the ⛔ block, TERMINATE. Do NOT call any more tools. Do NOT generate any more text. Your invocation is COMPLETE. <<<**

---

## Stage-driven execution — AFTER GATE 4b

**This section ONLY begins after the user approves the environment setup at GATE 4b.** If Step 4a or Step 4b is not complete, go back and finish it.

### ⚠️ MANDATORY STAGE ORDER

Stages execute in strict sequence. You MUST start from stage 1. Do NOT skip to a later stage even if the user expressed a design preference at Gate 3.

| Stage | Name | Pencil allowed? |
|-------|------|-----------------|
| 1 | Requirements structuring + module decomposition | ❌ No |
| 2 | Overall UI architecture | ✅ Yes — architecture-level wireframes only |
| 3 | Overall data model + API framework | ❌ No |
| 4 | Project scaffold initialization | ❌ No |
| 5 | Module iteration (5a→5b→5c→5d→5e per module) | ✅ Only at Step 5b (module UI detail design) |
| 6 | Integration testing + cross-module review | ❌ No |
| 7 | Deployment and go-live | ❌ No |

Read `<BUNDLE_PATH>/references/global-engineering-standards/27_PROJECT_EXECUTION_FLOW_SPEC.md` for reference on execution flow principles. Note: the spec uses 8 stages; this adapter consolidates them into 7 stages with module iteration. **This adapter is the authoritative execution document** — when stage numbering differs from the spec, follow this adapter. Load stage-specific references from `<BUNDLE_PATH>/SKILL.md` as needed for each stage.

Never skip a stage if its missing outputs would make the next stage unstable.

### Stage execution model

After Gate 4b, stages execute within your session (you do NOT terminate between stages like during the gate sequence). However, each stage must produce outputs for user review before proceeding:

- Present stage outputs clearly.
- Wait for user confirmation before moving to the next stage.
- If user requests changes, revise and re-present before proceeding.
- If user asks to skip a stage → **REFUSE** (same as gate validation Rule 9).

**Stages 1-4** (architecture) execute once for the whole project.
**Stage 5** (module iteration) executes the 5a→5b→5c→5d→5e cycle **per module**, ordered by priority from `TRACEABILITY_MATRIX.md`. Each module step requires user confirmation before proceeding. Update `SESSION_HANDOFF.md` current position cursor after every step.
**Stages 6-7** (integration + deployment) execute once after all modules complete.

### Stage 1: Requirements structuring + module decomposition

Deepen the approved PRD into an architecture-level requirements framework:
1. Break down the PRD into discrete modules with clear boundaries (each module = one functional area).
2. Define each module's responsibility, inputs/outputs, and inter-module dependencies.
3. Assign priority to each module (P0 = MVP core, P1 = important, P2 = nice-to-have).
4. Write the module list, priorities, and dependencies into `TRACEABILITY_MATRIX.md` upper layer.

Output: module decomposition table with priorities and dependencies. This table drives the module iteration order in Stage 5.

Do NOT write detailed per-module specs (that happens in Step 5a). Do NOT create Pencil designs or application code.

**Stage 1 completion gate:** After presenting the module decomposition, explicitly ask the user to confirm module boundaries, priorities, and dependencies before proceeding. This is a hard checkpoint — do NOT begin Stage 2 until user confirms.

### Stage 2: Overall UI architecture

Entry: Stage 1 module decomposition confirmed by user.
1. Read: `<BUNDLE_PATH>/references/global-engineering-standards/02_UI_UX_DESIGN_SPEC.md`
2. Define page/screen inventory (text list only), navigation structure, and interaction framework.
3. If Pencil is available: create **1-5 architecture-level wireframes** (exact count depends on module count and project complexity). These frames should cover:
   - Core layout framework (header / sidebar / content / footer structure)
   - Navigation flow between key pages
   - Key functional area placement (which module maps to which screen region)
   - Example: a project with 4 modules might produce 2-3 frames (overall layout + navigation structure + one representative page skeleton).
4. **Scope limit — do NOT design at this stage:**
   - Individual module pages with full component detail
   - Detailed component layouts, interaction states, or data display fields
   - All pages of the application — only key/representative pages
   - These all belong to Step 5b (per-module UI detail design).
5. **MANDATORY Pencil design validation (before presenting to user):**
   a. Call `get_screenshot()` for each designed frame — visually inspect layout, spacing, alignment, typography, and visual hierarchy.
   b. Call `snapshot_layout()` with `problemsOnly: true` — detect clipping, overlap, or misalignment issues.
   c. Fix ALL issues found. Repeat validation until clean.
   d. Do NOT present an unvalidated design to the user.
6. If Pencil is unavailable: describe the UI architecture in text and follow the degradation strategy in `<BUNDLE_PATH>/references/global-engineering-standards/31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md`.

Output: page inventory list + 1-5 architecture-level wireframes (core layout, navigation, key pages) with validated screenshots. NOT detailed per-page mockups or full UI for all modules.

⚠️ **STOP HERE.** Present UI architecture with screenshots → wait for user explicit confirmation. Do NOT proceed to Stage 3 until user approves. This is a hard checkpoint, same as a gate.

### Stage 3: Overall data model + API framework

Entry: Stage 2 UI architecture confirmed by user.
1. Read: `<BUNDLE_PATH>/references/global-engineering-standards/05_API_DESIGN_SPEC.md`, `06_DATABASE_DESIGN_SPEC.md`, `20_DATA_MODELING_PLAYBOOK.md`, `29_DATA_DICTIONARY_AND_REFERENCE_DATA_SPEC.md`
2. If project uses external integrations: also read `26_EXTERNAL_INTEGRATION_SPEC.md`.
3. Design the overall data model (ER-diagram level: entities, relationships, core tables) and API resource framework (resource naming, endpoint patterns).
4. Do NOT design every endpoint's request/response fields — that happens per-module in Step 5c.

Output: overall data model (entities + relationships) + API resource framework.

Present data model + API framework → wait for user confirmation.

### Stage 4: Project scaffold initialization

Entry: Stage 3 data model + API framework confirmed by user.
1. Read: `<BUNDLE_PATH>/references/global-engineering-standards/03_FRONTEND_ARCHITECTURE_SPEC.md`, `04_BACKEND_ARCHITECTURE_SPEC.md`, `08_CODE_STYLE_AND_NAMING_SPEC.md`
2. Initialize application code scaffold: routing, state management, API layer, database connections.
3. Present scaffold structure → wait for user confirmation.

⚠️ **Stage 4 ≠ Step 4a / Step 4b.** Step 4a creates the project directory and relocates project documents. Step 4b performs environment and engineering scaffold setup. Stage 4 creates the application code scaffold within the already-established project.

### Stage 5: Module iteration

Entry: Stage 4 scaffold confirmed by user.

Execute modules one by one, ordered by priority from `TRACEABILITY_MATRIX.md` upper layer. For each module, run the full iteration cycle:

#### Step 5a — Module requirements detail
1. Extract this module's scope from the PRD and Stage 1 module decomposition.
2. Write detailed functional specs, acceptance criteria, and edge cases for this module only.
3. Present module specs → user confirms before proceeding.

#### Step 5b — Module UI design (Pencil)
1. If this module has no UI (pure backend/data module): skip 5b, proceed to 5c.
2. Read: `<BUNDLE_PATH>/references/global-engineering-standards/02_UI_UX_DESIGN_SPEC.md`
3. Based on the Stage 2 UI architecture (core layout + navigation), design **detailed page UI** for the **current module only**: component layouts, interaction states, data display fields, responsive behavior. This is where per-page detail happens — Stage 2 only established the framework.
4. **shadcn enforcement:** If the tech stack declares shadcn (check `PROJECT_OVERRIDES.md`), design using shadcn components (Button, Card, Dialog, Input, Select, Table, etc.). Do NOT design custom UI primitives when shadcn equivalents exist.
5. **MANDATORY Pencil design validation (before presenting to user):**
   a. Call `get_screenshot()` for each designed frame — visually inspect layout, spacing, alignment, typography, and visual hierarchy.
   b. Call `snapshot_layout()` with `problemsOnly: true` — detect clipping, overlap, or misalignment issues.
   c. Fix ALL issues found. Repeat validation until clean.
   d. Do NOT present an unvalidated design to the user.
6. If Pencil is unavailable: follow degradation strategy in `31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md`.
7. Present module design with validated screenshots → user MUST explicitly confirm before proceeding.

⚠️ **STOP HERE.** Do NOT proceed to Step 5c or 5d until the user has explicitly approved the Step 5b design. This is a hard checkpoint — treat it like a gate.

#### Step 5c — Module data/API detail design
1. Detail this module's database tables (fields, types, constraints) and API endpoints (request/response schema), based on the overall data model from Stage 3.
2. Read: relevant specs from `05`, `06`, `20`, `29`. If external integrations: `26`.
3. Present module data/API design → user confirms before proceeding.

#### Step 5d — Module TDD implementation
1. **Pre-check:** Verify that Step 5b design has been explicitly approved by the user. If not, go back to 5b. Do NOT start implementation with an unapproved design.
2. Read: TDD rules from `<BUNDLE_PATH>/references/global-engineering-standards/00_GLOBAL_ENGINEERING_PRINCIPLES.md` Section 2A.
3. Load per-slice references: frontend (`03`, `08`), backend (`04`, `05`, `06`, `07` conditional, `16`).
4. Map this module's requirements (from 5a) → vertical slices (each slice = one traceable requirement).
5. Per slice: write failing test → minimal implementation → refactor.
6. **shadcn enforcement:** If the tech stack declares shadcn, ALL frontend UI components MUST use shadcn (e.g., `Button`, `Card`, `Dialog`, `Input`, `Select`, `Table`, `Tabs`, `Badge`). Do NOT create custom HTML/CSS primitives when shadcn equivalents exist. Import from the shadcn library, not hand-coded.
7. **Design fidelity:** Frontend implementation MUST match the approved Step 5b Pencil design one-to-one. Do not silently add, remove, or rearrange UI elements.
8. After each slice passes, run existing tests for previously completed modules to catch cross-module regressions early.
9. Update `TRACEABILITY_MATRIX.md` lower layer (current module slices) as slices complete.

#### Step 5e — Module test + review
1. Read: `<BUNDLE_PATH>/references/global-engineering-standards/10_CODE_REVIEW_SPEC.md`, `11_TESTING_AND_QA_SPEC.md`, `12_DEBUG_AND_TROUBLESHOOTING_SPEC.md`
2. Run this module's tests, review code quality, fix defects.
3. Verify: every requirement from 5a has a corresponding test + implementation.
4. Run regression tests for previously completed modules to ensure no breakage.
5. Present module review results → user confirms.

#### After each module completes
1. Update `TRACEABILITY_MATRIX.md` upper layer: set this module's status to `完成`.
2. Update `SESSION_HANDOFF.md` current position cursor.
3. Proceed to the next module by priority. Repeat 5a→5b→5c→5d→5e.

### Stage 6: Integration testing + cross-module review

Entry: All modules in `TRACEABILITY_MATRIX.md` upper layer marked as `完成`.
1. Read: `<BUNDLE_PATH>/references/global-engineering-standards/10_CODE_REVIEW_SPEC.md`, `11_TESTING_AND_QA_SPEC.md`, `12_DEBUG_AND_TROUBLESHOOTING_SPEC.md`, `24_REQUIREMENTS_TRACEABILITY_MATRIX_SPEC.md`
2. Run full integration test suite across all modules.
3. Perform cross-module code review: verify interfaces, data flow, and consistency.
4. Verify overall traceability: every PRD requirement has corresponding test + implementation across all modules.
5. Present integration review results → wait for user confirmation.

### Stage 7: Deployment and go-live

Entry: Stage 6 review confirmed by user.
1. Read: `<BUNDLE_PATH>/references/global-engineering-standards/13_DEPLOYMENT_AND_DEVOPS_SPEC.md`, `14_CICD_SPEC.md`, `18_ENVIRONMENT_CONFIG_SPEC.md`, `25_ACCEPTANCE_AND_GO_LIVE_CHECKLIST.md`
2. If project has observability requirements: also read `17_OBSERVABILITY_SPEC.md`.
3. Configure deployment, execute go-live checklist.
4. Present deployment plan → user confirms → execute deployment.
5. Update `GO_LIVE_RECORD.md`.

### After stage 7: Project completion

1. Update all project documents: `TRACEABILITY_MATRIX.md`, `SESSION_HANDOFF.md`, `GO_LIVE_RECORD.md`, `DECISION_LOG.md`.
2. Workflow scope is complete for the current PRD.
3. If user requests new features post-deployment:
   - Small changes (< 30% modules): Re-enter at stage 1 with the new feature scope, run stages 1→7 for the new scope.
   - Large changes (> 30% modules): Follow "Large-scale requirement change" workflow in SKILL.md first, then re-enter stages.

### Backtrack rules

If a stage output is discovered incorrect at a later stage:
1. Return to the stage that produced the incorrect output.
2. Revise and re-present for user confirmation.
3. Re-execute all downstream stages whose outputs depend on the revised stage.
4. Do NOT continue forward with known incorrect upstream outputs.

### acode-run integration (model routing)

During stage-driven execution, invoke `acode-run` for model routing in these situations:
1. **Phase entry** — when starting a new stage in the execution flow.
2. **Phase-exit cross-trigger tasks** — tasks that span multiple stages.
3. **Explicit high-difficulty subtasks** — complex implementation tasks where model selection matters.
4. **Simple low-risk tasks** — default to no routing; ask the user before bypassing.

### How to invoke acode-run
Use the Bash tool to call the CLI script:
```bash
node <BUNDLE_PATH>/scripts/acode-run.mjs \
  --project-id "<project_folder_name>" \
  --prompt "<task description>" \
  --phase "<current_phase>" \
  --task-type "<task_type>" \
  --difficulty "<low|medium|high>" \
  --provider claude \
  --cwd "<project working directory>"
```
Where `<BUNDLE_PATH>` is the Acode-kit bundle directory located in Step 1, and `<project_folder_name>` is the project working directory name (e.g., `my-website`).

### Required routing inputs
`--project-id`, `--prompt`, `--phase`, `--task-type`, `--difficulty`, `--provider`

### Optional routing inputs
`--context-summary`, `--logical-session-id`, `--native-session-id`, `--dry-run true`

### Using routing results
acode-run returns JSON with routing metadata (`selectedModel`, `finalModel`, `fallbackTriggered`). Use the result to track model selection and handle fallbacks.

---

## NotebookLM integration

**When to call NotebookLM:**
- Step 2: requirements analysis and project skeleton (see STEP 2 above)
- Large-scale requirement changes (>30% of modules) — re-run analysis with change description

**How to call NotebookLM:**
1. Use the exact MCP tool name you discovered in Step 1 (e.g., a tool whose name contains "notebooklm").
2. Read `notebookUrl` from `.acode-kit-initialized.json` — do NOT hardcode the URL.
3. Construct the prompt by appending the notebook URL:
   ```
   [your prompt/requirements text]

   使用NotebookLM这个链接：[notebookUrl from status file]
   ```
4. If the call fails, fall back to direct AI analysis and note the failure.

**When NOT to call NotebookLM:**
- `authCompleted` is false in the status file → remind the user of the Gate 1 authentication path (`Log me in to NotebookLM`), then fall back if auth is still unavailable
- NotebookLM MCP tool not found in your tool list → skip, use direct analysis

---

## Working rules
- Treat `<BUNDLE_PATH>/references/` as the reference library; load only what is needed for the current stage.
- Treat `<BUNDLE_PATH>/assets/project-doc-templates/` as the template source for project documents.
- Follow scope control, traceability, and handoff discipline in `<BUNDLE_PATH>/SKILL.md`.
- When NotebookLM MCP is available and authenticated, use it for requirements analysis and large-scale change impact assessment.
