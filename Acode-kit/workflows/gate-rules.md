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

## Review boundary reminders

1. Gate 3 approval does not authorize design.
2. Gate 3.5 confirmation is mandatory before Step 4.
3. Gate 4 approval is mandatory before Stage 1.
4. Stage 2 and Step 5b outputs need explicit user approval before any downstream step.
5. Approved artifacts become the active frozen version until revised.
