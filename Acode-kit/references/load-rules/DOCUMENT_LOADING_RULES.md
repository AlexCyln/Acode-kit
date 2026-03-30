# Document Loading Rules

## Loading order

Main agent reads in this order only:

1. `Acode-kit/SKILL.md`
2. current `Acode-kit/workflows/*.md`
3. current `Acode-kit/references/load-rules/*.md`
4. required `scenario-standards/*`
5. required `stack-standards/*`
6. required active extensions
7. project-level `ACTIVE_STANDARDS.md`
8. current project control docs
9. startup-staged `.acode-kit-startup/*.md` artifacts when the workflow is still before or inside `Step 4a`
10. `references/load-rules/DIRECTORY_BLUEPRINT_SYNTHESIS_RULES.md` only when entering `Step 4a` directory planning
11. onboarding-staged `.acode-kit-onboarding/*.md` artifacts when the workflow is inside `O1` to `O4`
12. `references/load-rules/EXISTING_PROJECT_ONBOARDING_RULES.md` only when the project has been identified as an existing-project onboarding case

For existing-project onboarding O1 specifically, prioritize these project-local continuity docs before broad module scans when they exist:

1. `AGENTS.md`
2. `SESSION_HANDOFF.md`
3. `TASK_LOG.md`
4. `NEXT_STEPS.md`
5. existing architecture / overview / review summary docs

## Extension loading

Extensions are loaded only when:

1. the current node matches the extension `load_at`
2. the project has explicitly activated the extension
3. extension `requires` constraints match the current project
4. the current task still needs extra constraints after core standards are loaded

When an extension is loaded:

1. keep the extension node-local
2. summarize extension usage to the user in one compact statement
3. state the extension id, the delegated or assisted scope, and the practical effect on the current node
4. do not present the extension as a workflow owner

## Hard prohibitions

1. do not read all global standards on skill entry
2. do not read all workflows on skill entry
3. do not read all scenario packages on skill entry
4. do not read all stack packages on skill entry
5. do not keep reading once the current task has enough constraints to execute
6. Do not bulk-read all workflows or all standards on entry.
7. do not bulk-read all registered extensions on entry
8. do not activate an extension only because it exists in the registry
9. do not let LMS tier downshift remove required document materialization or node review outputs
10. do not regenerate Step 2 or Step 3 content from memory once a startup-staged file already exists
11. do not improvise project directory structure when active stack/scenario fragments already cover the current project
12. do not use fallback project blueprints as the primary source when active stack or scenario fragments are available
13. do not let `Step 4b` start before `Step 4a` directory plan synthesis and file relocation are approved
14. do not let existing-project onboarding enter Stage 1 before Gate O4 is approved
15. do not bulk-read multiple major modules during O1 if the project can still be understood through repository-shell analysis
16. do not skip prior continuity-doc reading in O1 when `AGENTS.md`, `SESSION_HANDOFF.md`, `TASK_LOG.md`, `NEXT_STEPS.md`, or equivalent review-summary docs already exist
17. do not assume browser/web validation scope before the real project platform is identified
18. do not silently promote detail pages, profile entries, or other subpages into top-level core modules without explicit confirmation

## Stability criteria

1. every node must have a single entry condition
2. every node must state its review output
3. every node must state its next action
4. every node must know which docs it updates
5. if a node cannot be explained with those four properties, loading is not yet sufficient
6. startup nodes must know the stable staged filename or formal destination filename for every artifact they create or update
7. `Step 4a` must know which active stack or scenario fragments supplied each major directory branch
8. `Step 4b` must know which approved stack inputs and declared standards govern dependency and scaffold setup
9. onboarding nodes must know which onboarding-staged files are authoritative before they ask for user review
10. onboarding nodes must know whether prior continuity docs were consumed and whether any page-to-module ownership still needs user confirmation
