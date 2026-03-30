# Existing Project Onboarding Rules

## Purpose

Defines how Acode-kit should recognize, analyze, and formalize existing software projects before they enter the normal execution workflow.

## Entry rule

When Step 1 identifies the workspace as an existing project candidate, the runtime may route to the existing-project onboarding lane instead of the greenfield startup lane.

Recognition signals include:

1. existing application or service source directories
2. existing build or package files
3. deploy, sql, tests, or docs assets already present
4. user explicitly states that the project already exists and should be taken over under Acode-kit

## Core principle

For existing projects:

1. separate onboarding from greenfield startup
2. communicate more with the user before freezing business truth
3. analyze from easy to hard
4. analyze from macro structure to micro detail
5. prioritize precision over breadth
6. avoid full-context explosion and unnecessary token burn

## Layered analysis rule

The onboarding lane must analyze in this order:

1. repository shell layer
2. prior agent / session continuity-doc layer
2. system structure layer
3. user-guided business truth layer
4. focused implementation-detail layer

Do not jump directly to deep code interpretation unless the earlier layers are already stable.

## Prior continuity-doc priority rule

If the existing project contains prior continuity documents, read them at high priority before broad code analysis and before asking the user to restate project history.

Priority examples include:

1. `AGENTS.md`
2. `SESSION_HANDOFF.md`
3. `TASK_LOG.md`
4. `NEXT_STEPS.md`
5. existing project overview / architecture summary docs
6. prior decision or review summary docs

These files do not replace user confirmation, but they must be used to establish the first-pass project state before broader repository interpretation.

## Batching rule

For medium and large existing projects:

1. inventory by batch
2. confirm each batch before moving deeper
3. keep each analysis slice bounded by a clear scope
4. do not deep-scan multiple major modules in one pass unless explicitly necessary

## User-guided completion rule

Existing-project onboarding must include a user-guided completion step.

The user-guided addendum must explicitly capture:

1. actual business goal
2. main business flow
3. role and permission reality
4. current operational state
5. active feature modules
6. deprecated or semi-deprecated modules
7. current pain points
8. current priority scope
9. exclusions for this onboarding round

## Low-guessing rule

1. do not turn directory names, class names, route names, or API names into assumed business truth without confirmation
2. if a conclusion is not explicitly grounded, mark it instead of presenting it as fact
3. use the following status values for key conclusions:
   - `confirmed`
   - `inferred`
   - `pending-user-confirmation`
4. business goals, process logic, module responsibilities, permission boundaries, and current-state truth require explicit user confirmation when they cannot be derived safely

## Platform-fit rule

1. determine the real project platform before choosing downstream validation and execution expectations
2. do not assume an existing project is a web application only because it has docs, services, or management tooling
3. native or mobile projects must keep their platform-specific runtime and validation boundaries unless the user confirms otherwise

## Module-boundary rule

1. do not promote subpages, entry points, dialogs, or route destinations into independent core modules without explicit user confirmation
2. if a page belongs to a confirmed parent flow, record that ownership explicitly instead of silently splitting it into a new module
3. if a toolbar entry, profile entry, or detail page is actually subordinate to an existing core module, preserve that relationship in onboarding artifacts

## Formalization boundary

1. onboarding-staged files live under `.acode-kit-onboarding/`
2. do not create formal project governance docs until O3 is approved
3. O4 may materialize approved onboarding artifacts into `docs/project/` and `docs/dev/`
4. O4 may supplement governance directories and indexes
5. O4 must not default to large-scale source-tree restructuring

## Handoff rule

A project may enter the shared stage-driven execution workflow only after:

1. O4 is completed
2. Gate O4 is explicitly approved
3. the formal project governance docs are in place
4. the environment takeover entrypoints are confirmed enough for continued execution
