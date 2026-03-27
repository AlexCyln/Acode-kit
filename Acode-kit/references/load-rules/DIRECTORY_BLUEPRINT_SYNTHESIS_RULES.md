# Directory Blueprint Synthesis Rules

## Purpose

Define how `Step 4` synthesizes the final project directory plan from approved startup inputs, active scenario packages, active stack packages, and fallback blueprints.

## Inputs

`Step 4` may synthesize a directory plan only after these inputs exist:

1. approved `.acode-kit-startup/STACK_AND_DIRECTORY_INPUTS.approved.md`
2. approved project skeleton and PRD startup files
3. active scenario package list
4. active stack package list
5. project-level overrides affecting repository structure

## Output

Produce `docs/project/DIRECTORY_PLAN.md` before creating directories.

That plan must state:

1. final directory tree
2. which directories are required vs optional
3. source of each major branch
4. conflict decisions
5. fallback usage, if any

## Synthesis order

1. apply mother-spec fixed governance directories first
2. apply active stack package directory fragments by technical domain
3. apply active scenario package directory fragments as business-shape enhancements
4. fill remaining gaps from `references/project-blueprints/` only when active fragments are insufficient
5. run de-duplication and conflict resolution
6. freeze the final structure in `DIRECTORY_PLAN.md`

## Priority model

1. mother-spec governance directories are highest priority
2. more specific stack fragments beat generic stack fragments in the same domain
3. stack package fragments beat scenario package fragments when defining technical skeleton
4. scenario package fragments may add business modules, page groups, or domain folders
5. fallback blueprints never override an already-approved active fragment

## Domain ownership

1. frontend directory ownership comes from active frontend stack packages
2. backend directory ownership comes from active backend stack packages
3. database and migration directory ownership comes from active database, migration, and data-access packages
4. deployment directory ownership comes from active deployment packages
5. design and documentation directory ownership comes from mother specs unless explicitly enhanced

## Conflict handling

When fragments disagree:

1. prefer the more specific package
2. if still unresolved, prefer the package explicitly declared in project overrides
3. if still unresolved, record the blocker in `DIRECTORY_PLAN.md` and stop directory creation until resolved

## Hard prohibitions

1. do not improvise directories not justified by mother specs, active fragments, or approved overrides
2. do not let fallback blueprints replace an active technical fragment
3. do not create broad catch-all directories such as `misc`, `common2`, `temp-final`
4. do not create project directories before `DIRECTORY_PLAN.md` exists
