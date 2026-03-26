---
name: acode-kit-workflow-core
description: Provider-agnostic workflow contract for Acode-kit. Defines the invariant gate/stage graph, approval checkpoints, and execution boundaries shared by Claude and Codex.
---

# Acode-kit Workflow Core

This document is the **shared runtime contract** for Acode-kit.

It exists to keep the workflow logic identical across providers. Claude and Codex may differ in execution semantics, tool names, and resume mechanics, but they must follow the same workflow graph and the same approval boundaries.

## Invariant workflow graph

### Startup sequence

1. Step 1: Workspace Status Report
2. Gate 1: user approval required
3. Step 2: Requirements Analysis + Project Skeleton
4. Gate 2: user approval required
5. Step 3: PRD + Progress Plan
6. Gate 3: user approval required
7. Gate 3.5: LMS tier analysis and confirmation
8. Step 4: Project Environment Setup
9. Gate 4: user approval required

If the workspace status file is missing but the user-level global MCP cache exists, the runtime may use the global cache as the environment baseline so MCP tools and NotebookLM auth do not need to be reinstalled or re-authorized in every new session.

### Stage-driven execution

1. Stage 1: Requirements structuring + module decomposition
2. Stage 2: Overall UI architecture
3. Stage 3: Overall data model + API framework
4. Stage 4: Project scaffold initialization
5. Stage 5: Module iteration
6. Stage 6: Integration testing + cross-module review
7. Stage 7: Deployment and go-live

Within Stage 5, the module sequence is fixed:

1. Step 5a: module requirements detail
2. Step 5b: module UI detail design
3. Step 5c: module data/API detail
4. Step 5d: module TDD implementation
5. Step 5e: module test + review

## Non-negotiable boundaries

1. Do not create files or directories before Gate 3 is approved.
2. Do not start design work before Gate 4 is approved.
3. Do not use Pencil or other design tooling outside Stage 2 and Step 5b.
4. Do not confuse Step 4 with Stage 4.
5. Do not skip or merge gates.
6. Do not skip stages when downstream outputs depend on them.
7. Do not continue past any gate or stage review without explicit user approval.
8. Do not invoke `acode-run` during startup Steps 1-4 or Gates 1-4.
9. Do not use `acode-run` as a replacement for the public `Acode-kit` entry.

## Draft artifact contract

1. Step 2 must produce a markdown project skeleton draft in the shape of `PROJECT_SKELETON.md`.
2. Step 3 must produce a markdown PRD draft in the shape of `PRD.md`.
3. The drafts must be review-ready markdown, not loose chat notes.
4. Step 3 must also produce an LMS tier recommendation draft based on the approved PRD skeleton.
5. Persistence into the project directory still happens in Step 4, but the Step 2 / Step 3 artifacts must already be structured as file-ready markdown before the gate decision.
6. Step 4 must materialize the approved Step 2 and Step 3 artifacts into formal project docs instead of replacing them with weaker summaries.
7. Templates may add structure and metadata, but approved startup content remains the source of truth.

## User approval contract

At every gate:

1. Present the full deliverable for that gate.
2. Ask for explicit approval or revisions.
3. Stop advancing until the user replies.
4. If the user requests changes, revise the same gate deliverable and present it again.
5. If the user requests to skip ahead, refuse and restate the mandatory sequence.

The same approval rule applies to stage reviews and every Step 5a-5e review inside module iteration.

## Document update contract

After every approved gate, stage, and Step 5a-5e review:

1. Refresh `PROJECT_OVERVIEW.md` when the current stage, scope, or tool status changes.
2. Refresh `PRD.md` when the requirement boundary changes.
3. Refresh `TRACEABILITY_MATRIX.md` with the current module, slice, and progress state.
4. Refresh `SESSION_HANDOFF.md` with the current position and the next action.
5. Refresh `DECISION_LOG.md` when a decision, change, or assumption changes.
6. Refresh detailed implementation docs when API, database, function, or test facts change.
7. Refresh `PROJECT_ACCESS_INFO.md` when any access address, account, password, token, or external entry changes.
8. Do not leave status, progress, or implementation notes stale across step boundaries.

### NotebookLM authentication exception at Gate 1

If the workspace status report shows NotebookLM installed but unauthenticated:

1. the gate output may offer authentication before Step 2
2. the required authentication input is the exact text `Log me in to NotebookLM`
3. if the user chooses that path and sends that exact text, the Acode-kit workflow listener must not reinterpret or wrap it
4. instead, it must pass that input through to the underlying agent unchanged
5. after the agent finishes handling the NotebookLM login flow, the workflow may resume from the workspace status step
6. once auth succeeds, persist the updated auth state into the global MCP cache for future sessions

### Gate 3.5: LMS tier analysis and confirmation

After the PRD is approved at Gate 3 and before Step 4 begins, the agent must:

1. analyze the approved PRD draft and project skeleton for architecture size, module count, page scope, and API surface
2. infer a recommended LMS tier (`S`, `M`, or `L`) from the project complexity
3. explain why that tier was chosen, including the governance and execution tradeoffs
4. present the recommendation to the user for confirmation or revision
5. if the user changes the tier, incorporate that change and re-present before proceeding
6. proceed to Step 4 only after the tier is explicitly confirmed

The tier decision must be derived from the PRD draft and project skeleton, not from a fixed numeric threshold table.
The tier changes execution density only; it must not remove gates, stages, Step 5a-5e, required inputs, required outputs, or standards obligations.

### Gate 3.5 output contract

Every Gate 3.5 response must end with this block:

```text
---
⛔ USER DECISION REQUIRED
1. Is the recommended LMS tier acceptable?
2. Any changes to the tier or its rationale?
3. Confirm the final tier before project setup starts.

CALLER: Present the FULL LMS recommendation above to the user. WAIT for their explicit reply. Do NOT auto-approve, summarize-and-continue, or resume without the user's actual response.
NEXT STEP: Step 4 — Project Environment Setup.
---
```

The response body immediately before the block should include:

1. the recommended tier (`S`, `M`, or `L`)
2. the reasoning behind the recommendation
3. any tradeoffs that matter for governance or execution density
4. a clear statement that the user can revise the tier before Step 4

## Design-tool boundary

Design tooling is allowed only in:

1. Stage 2: architecture-level wireframes only
2. Step 5b: detailed UI design for the current module only

Every design output must be validated before review:

1. `get_screenshot()`
2. `snapshot_layout(problemsOnly: true)`
3. fix all detected layout issues
4. then present to the user

For Step 5b module detail design:

1. break the module into explicit reviewable page units or tightly-coupled page groups
2. each completed page unit must go through validation before review
3. present the reviewed page scope, covered states, and open questions clearly
4. stop after each review batch and wait for explicit user approval
5. do not move to Step 5c or Step 5d until the current Step 5b review batch is approved

## Provider adapter responsibilities

Provider-specific runtime files are responsible only for:

1. First-action wording and initialization path examples
2. Resume semantics
3. Parent/child agent orchestration semantics
4. Provider-specific tool constraints
5. Provider-specific environment paths and installation hints

Provider adapters must **not** change:

1. gate count
2. stage count
3. stage order
4. approval boundaries
5. Step 4 / Stage 4 separation
6. Pencil usage boundary

## Extension usage disclosure

Whenever an extension is loaded at a node:

1. keep the extension node-local and bounded
2. tell the user which extension was used
3. tell the user what it did at the current node
4. tell the user why it was helpful
5. do not present the extension as a workflow owner

## Minimal simulation checklist

A correct provider runtime must pass this path check:

1. `.acode-kit-initialized.json` missing -> tell user to run init -> stop
2. Step 1 output -> Gate 1 approval -> Step 2 only
3. Step 2 output -> Gate 2 approval -> Step 3 only
4. Step 3 output -> Gate 3 approval -> Gate 3.5 only
5. Gate 3.5 output -> confirmation -> Step 4 only
6. Step 4 output -> Gate 4 approval -> Stage 1 only
7. Stage 1 -> Stage 2 -> Stage 3 -> Stage 4 in order
8. Stage 5 must follow 5a -> 5b -> 5c -> 5d -> 5e for each module
9. Stage 6 and Stage 7 happen only after all modules finish Stage 5

## Scale invariants

1. Small projects may collapse to fewer modules, but they still use the same gate/stage graph.
2. Large projects may expand into more modules and more detailed documentation, but they do not change the approval boundaries.
3. The workflow is stable when each node can be executed with the same entry, output, and review contract regardless of project size.
4. If a node cannot state its input, output, review point, and document update target clearly, the workflow is not ready for execution.
5. LMS tier may reduce scope breadth or batching width, but it may not reduce workflow rigor.

Any provider implementation that violates this checklist is incompatible with Acode-kit.
