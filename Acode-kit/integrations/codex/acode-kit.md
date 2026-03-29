---
name: acode-kit-codex-runtime
description: Codex runtime supplement for Acode-kit. Keeps the exact same startup gate graph including Gate 3.5, Gate 4a, and Gate 4b plus the 7-stage execution workflow while adapting stop/resume behavior to Codex's direct user interaction model.
---

# Acode-kit Codex Runtime

Use this file together with:

1. `SKILL.md`
2. `integrations/shared/WORKFLOW_CORE.md`

This file does **not** redefine the workflow. It only adapts the execution semantics to Codex.

## First action

Your first action is still:

1. check whether `.acode-kit-initialized.json` exists in the working directory

If the file is missing:

1. first check the user-level global MCP cache for the active provider:
   - `~/.codex/acode-kit/.acode-kit-global.json`
   - `~/.claude/acode-kit/.acode-kit-global.json`
2. if the global cache exists, use it as the environment baseline so you do not reinstall MCP tools or re-authenticate NotebookLM
3. if neither the workspace file nor the global cache exists, tell the user Acode-kit is not initialized
4. ask them to run the init CLI from their installed bundle
5. provide both common examples:
   - `node ~/.codex/skills/Acode-kit/scripts/acode-kit-init.mjs`
   - `node ~/.claude/Acode-kit/scripts/acode-kit-init.mjs`
6. stop and wait

## Codex execution model

Codex interacts with the user directly. There is no external `CALLER:` layer.

Therefore:

1. after each gate, end your response and wait for the next user message
2. do not auto-advance from one gate to the next
3. do not simulate user approval
4. do not merge multiple gates into one response
5. do not create a startup task list or plan before Step 1 is complete

## Codex-specific guardrails

1. Do not use planning/todo mechanisms to pre-batch Steps 1-4.
2. Do not start with design tools or editor-state tools.
3. Keep the response in the user's language.
4. Keep the shared gate/stage graph identical to `integrations/shared/WORKFLOW_CORE.md`.
5. Do not invoke `acode-run` during startup or on initial entry into `Acode-kit`.
6. `acode-run` is allowed only after Gate 4b and only for a bounded routed subtask inside stage-driven execution.

## NotebookLM authentication behavior

If NotebookLM MCP is installed but `authCompleted` is false:

1. read `notebookLM.authPrompt` from `.acode-kit-initialized.json`
2. if the field is missing, default to `Log me in to NotebookLM`
3. mention this authentication path during the workspace status report
4. if the user reply is exactly `Log me in to NotebookLM`, do not treat it as a workflow command
5. instead, pass that exact input through to the underlying agent unchanged
6. after the agent handles login, resume the workflow from the workspace status step
7. if auth is still unavailable for the current step, fall back to direct analysis instead of blocking the workflow forever
8. if the global cache later records `authCompleted: true`, treat that as the persistent environment-level NotebookLM state on future sessions

If NotebookLM MCP is installed and `authCompleted` is true:

1. Step 2 requirements analysis must call NotebookLM before freezing the project skeleton
2. use NotebookLM as a strengthening source, not as a replacement for gate control
3. if NotebookLM fails during Step 2, disclose the failure and continue with direct analysis

## Gate handoff format in Codex

End every gate response with this block:

```text
---
⛔ USER DECISION REQUIRED
[ask only the questions required for the current gate]

NEXT STEP: [the single next step only]
WAIT: Stop here and wait for the user's explicit reply before continuing.
---
```

## Mandatory next-step mapping

1. Gate 1 -> Step 2 only
2. Gate 2 -> Step 3 only
3. Gate 3 -> Gate 3.5 only
4. Gate 3.5 -> Step 4a only
5. Gate 4a -> Step 4b only
6. Gate 4b -> Stage 1 only

Never map a gate directly to design or implementation unless the shared workflow graph allows it.

## Startup file-first review behavior

For Step 2 and Step 3 in Codex:

1. write or update the required startup-staged files under `.acode-kit-startup/` before asking for user review
2. do not paste the full skeleton, PRD, progress plan, or stack input package into the reply
3. tell the user which files were written and where they are
4. summarize execution status, deltas, unresolved questions, and review focus only
5. ask the user to review those files and reply with approval or revisions

## Refusal behavior

If the user asks to skip a gate, skip a stage, jump straight to design, or jump straight to coding:

1. refuse
2. explain that Acode-kit requires all mandatory gates/stages
3. restate the current gate or stage waiting for approval

## Stage review behavior

After Gate 4b:

1. follow Stage 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 in order
2. present outputs for review at each stage
3. wait for user confirmation before continuing
4. inside Stage 5, follow 5a -> 5b -> 5c -> 5d -> 5e for each module

## Design boundary reminder

Pencil/design tools are allowed only at:

1. Stage 2
2. Step 5b

Every design must be validated with `get_screenshot()` and `snapshot_layout(problemsOnly: true)` before user review.

## LMS tier behavior

After Gate 3 is approved:

1. analyze the approved PRD draft and project skeleton
2. recommend an LMS tier (`S`, `M`, or `L`)
3. base the recommendation on architecture scope, module structure, page breadth, and API density
4. present the recommendation and rationale to the user
5. wait for explicit confirmation or revision before Step 4a
6. do not use a fixed numeric threshold table in the runtime wording

## Gate 3.5 output block

Every Gate 3.5 response must end with this block:

```text
---
⛔ USER DECISION REQUIRED
1. Is the recommended LMS tier acceptable?
2. Any changes to the tier or its rationale?
3. Confirm the final tier before project setup starts.

CALLER: Present the FULL LMS recommendation above to the user. WAIT for their explicit reply. Do NOT auto-approve, summarize-and-continue, or resume without the user's actual response.
NEXT STEP: Step 4a — Directory Materialization + Document Relocation.
---
```

The response body immediately before the block should include the recommended tier, the reasoning, and the governance tradeoffs.

## Startup setup split

The setup lane is split into two reviewable nodes:

1. `Step 4a` synthesizes `DIRECTORY_PLAN.md`, creates the final directory structure, and directly relocates startup-staged approved files into formal project doc paths
2. `Step 4a` must confirm the approved tech stack, load the matching stack directory fragments, analyze the final structure, create the directories, relocate startup files, and create the node-owned governance files
3. `Step 4a` must not regenerate project documents from memory or install engineering dependencies
4. `Step 4b` runs only after Gate 4a approval and is responsible for dependency installation, environment setup, and engineering scaffold creation directly inside the Step 4a directory tree
5. do not collapse `Step 4a` and `Step 4b` into one reply

## Browser verification boundary

For browser-accessible UI scope after Gate 4b:

1. Step 5e must call Chrome DevTools MCP for real-browser verification before returning module review to the user
2. Stage 6 must call Chrome DevTools MCP for real-browser verification before returning final integration review to the user
3. if Chrome DevTools MCP is unavailable, disclose the blocker and mark real-browser verification as still pending
