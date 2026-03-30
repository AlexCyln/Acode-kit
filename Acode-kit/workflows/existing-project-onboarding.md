# Acode-kit Existing Project Onboarding

## Purpose

Defines the independent onboarding lane for existing software projects before they are allowed to enter the normal stage-driven execution workflow.

This lane is separate from the greenfield startup workflow. It exists to avoid polluting the existing new-project path while still bringing an existing project under full Acode-kit governance.

## Sequence

1. O1: existing project inventory
2. Gate O1: explicit user approval
3. O2: user-guided business completion
4. Gate O2: explicit user approval
5. O3: onboarding baseline freeze
6. Gate O3: explicit user approval
7. O4: framework onboarding materialization
8. Gate O4: explicit user approval
9. Stage 1: requirements structuring + module decomposition

## Onboarding outputs

### O1

- onboarding-staged file `.acode-kit-onboarding/EXISTING_PROJECT_INVENTORY.md`
- onboarding-staged file `.acode-kit-onboarding/PROJECT_STRUCTURE_SNAPSHOT.md`
- initial technology stack recognition
- initial application/service/module map
- low-confidence findings list
- user-confirmation questions list

`O1` execution contract:

1. analyze from easy to hard, and from stable structure to complex semantics
2. inspect only repo shell, build entry, runtime entry, deploy/sql/tests/docs entry, and existing high-level docs first
3. if prior continuity docs such as `AGENTS.md`, `SESSION_HANDOFF.md`, `TASK_LOG.md`, or `NEXT_STEPS.md` exist, read them with high priority before broader module analysis
4. determine the real platform shape early; do not assume web/browser scope if the project is actually native, mobile, desktop, or service-first
5. do not perform a deep full-repo semantic sweep in O1
6. do not present inferred business logic as confirmed project truth
7. write the onboarding-staged files before asking for Gate O1 review
8. do not paste the full inventory into the conversation
9. summarize only execution status, analyzed scope, confidence limits, and exact file paths for review

### O2

- onboarding-staged file `.acode-kit-onboarding/USER_INPUT_ADDENDUM.md`
- user-completed business facts
- clarified scope, module importance, actual business goals, current pain points, and exclusions

`O2` execution contract:

1. this node is mandatory; user-guided completion is a formal input source, not an optional supplement
2. the document must contain explicit fill-in sections so the user can directly add business truth into the file
3. ask more, guide more, and avoid guessing whenever business goal, process logic, module role, permission boundary, or current-state truth is missing
4. unresolved facts must be marked as pending user confirmation
5. do not proceed to O3 until the user confirms the addendum is sufficient

### O3

- onboarding-staged file `.acode-kit-onboarding/ONBOARDING_PRD.md`
- onboarding-staged file `.acode-kit-onboarding/STACK_AND_DIRECTORY_INPUTS.md`
- onboarding-staged file `.acode-kit-onboarding/ONBOARDING_TRACEABILITY_MATRIX.md`
- onboarding-staged file `.acode-kit-onboarding/ONBOARDING_DECISION_LOG.md`
- onboarding-staged file `.acode-kit-onboarding/ONBOARDING_GAP_ASSESSMENT.md`

`O3` execution contract:

1. freeze an onboarding baseline from repo facts plus user-provided facts
2. mark every important conclusion as `confirmed`, `inferred`, or `pending-user-confirmation`
3. do not turn inferred conclusions into formal project truth without user approval
4. do not silently promote subpages, entry points, dialogs, or route destinations into independent core modules without explicit user confirmation
5. preserve confirmed parent-child ownership when a page is part of an existing core flow
6. do not enter directory or environment takeover until the onboarding baseline is approved
7. treat the onboarding-staged files as the review surface
8. do not paste the full onboarding PRD or gap assessment into the conversation

### O4

- `docs/project/PROJECT_OVERVIEW.md`
- `docs/project/PROJECT_SKELETON.md`
- `docs/project/PRD.md`
- `docs/project/TRACEABILITY_MATRIX.md`
- `docs/project/DECISION_LOG.md`
- `docs/project/PROJECT_ACCESS_INFO.md`
- `docs/dev/DEVELOPMENT_DOCUMENTATION_INDEX.md`
- `docs/dev/current/`
- `docs/archive/reviews/`
- root `AGENTS.md`

`O4` execution contract:

1. create governance structure and formal project docs from the approved onboarding-staged files
2. supplement governance directories and indexes, but do not default to restructuring application source trees
3. default policy is: take over, normalize, and document; do not default to large-scale source refactors
4. direct relocation and formalization are allowed; rewriting approved onboarding content from memory is not allowed
5. verify environment takeover entrypoints and project access facts, but do not expand into stage-driven implementation
6. after Gate O4 approval, the project may enter Stage 1 and be treated as a normal Acode-kit-managed project
7. only after Gate O4 approval may the project enter Stage 1

## Onboarding rules

1. The onboarding lane is independent from greenfield startup and must not redefine greenfield Step 2, Step 3, Step 4a, or Step 4b.
2. O1-O4 must happen before any stage-driven execution for existing projects.
3. Existing-project onboarding must favor precision over speed.
4. For complex projects, analysis must be layered and batched; avoid context explosion and full-repo deep analysis in one round.
5. User communication is mandatory in onboarding; do not guess business facts silently.
6. If onboarding cannot produce a trustworthy baseline, stop and ask for clarification instead of forcing formalization.
