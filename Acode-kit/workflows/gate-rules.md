# Acode-kit Gate Rules

## Approval contract

At every gate or stage review:

1. present the full deliverable
2. ask only the decisions the user must make
3. wait for explicit approval or revision
4. do not auto-advance
5. if the user requests changes, revise and re-present the same node
6. if the user asks to skip, refuse and restate the mandatory sequence

## Document update cadence

After every approved gate, stage, and module step:

1. update `PROJECT_OVERVIEW.md` when stage, scope, or tool state changes
2. update `PRD.md` when requirement boundaries change
3. update `TRACEABILITY_MATRIX.md` for module, slice, and progress state
4. update `SESSION_HANDOFF.md` with current position and next action
5. update `DECISION_LOG.md` when decisions, assumptions, or changes shift
6. update `PROJECT_ACCESS_INFO.md` when URLs, accounts, passwords, tokens, or external entries change
7. update detailed API / database / module / testing docs when implementation facts change

## Approved artifact carry-forward

Once a startup artifact is approved:

1. that approved artifact becomes the frozen source for the next node
2. later nodes may format, split, or enrich it, but may not replace it with a weaker summary
3. `Step 4` must materialize approved Step 2 and Step 3 outputs into formal project docs
4. if templates are used, they must wrap the approved content rather than overwrite it
5. if a later node needs new facts, update the formal doc and keep the approved sections intact unless the user explicitly revises them

## LMS governance floor

LMS may scale execution density only:

1. `S`, `M`, and `L` may change module granularity, batching, and documentation depth
2. `S`, `M`, and `L` may not remove required workflow nodes
3. `S`, `M`, and `L` may not reduce required inputs, outputs, review checkpoints, or standards coverage for a node
4. if scope must shrink for a smaller tier, shrink breadth first and keep the workflow contract unchanged

## Review boundary reminders

1. Gate 3 approval does not authorize design.
2. Gate 3.5 confirmation is mandatory before Step 4.
3. Gate 4 approval is mandatory before Stage 1.
4. Stage 2 and Step 5b outputs need explicit user approval before any downstream step.
5. Approved artifacts become the active frozen version until revised.
