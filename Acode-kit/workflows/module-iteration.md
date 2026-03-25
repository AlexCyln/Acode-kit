# Acode-kit Module Iteration

## Fixed sequence

1. Step 5a: module requirements detail
2. Step 5b: module UI detail design
3. Step 5c: module data/API detail
4. Step 5d: module TDD implementation
5. Step 5e: module test + review

## Design boundary

1. Pencil/design tools are allowed only at Stage 2 and Step 5b.
2. Stage 2 is architecture-level only, not page-detail completion.
3. Step 5b covers detailed page mockups for the current module only.
4. Break Step 5b into explicit page or page-group review batches.
5. Validate every design with `get_screenshot()` and `snapshot_layout(problemsOnly: true)` before user review.

## Implementation boundary

1. Step 5d must match the approved Step 5b design one-to-one.
2. Every slice follows Red-Green-Refactor TDD.
3. If the project declares `shadcn/ui`, use shadcn components instead of custom primitives.
4. If shadcn MCP is missing, continue with the declared shadcn constraint; only the MCP assistance degrades.

## Access info rule

`PROJECT_ACCESS_INFO.md` must exist from project start and be refreshed at Step 4, Stage 4, Step 5d, Stage 6, and Stage 7.
