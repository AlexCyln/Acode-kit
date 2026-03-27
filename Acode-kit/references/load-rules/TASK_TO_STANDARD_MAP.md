# Task To Standard Map

## Workflow to standards

1. startup / project skeleton: `00`, `01`, `22`, `27`, `31`
2. PRD / scope control: `01`, `23`, `24`, `30`
3. overall UI architecture: `02`, `03`, `08`
4. backend / API / data: `04`, `05`, `06`, `07`, `16`, `20`, `26`, `29`, `32`, `33`
5. testing / review / traceability: `10`, `11`, `12`, `17`, `24`
6. deployment / go-live: `13`, `14`, `17`, `18`, `25`, `32`
7. tool management / degradation: `21`, `31`
8. Step 4a directory planning and file relocation: `28`, `30`, active `scenario-standards/*`, active `stack-standards/*`, and `DIRECTORY_BLUEPRINT_SYNTHESIS_RULES.md`
9. Step 4b environment and scaffold setup: stack-specific architecture, testing, deployment, and environment standards required by the declared stack

## Stage-sensitive loading

1. Stage 3: load `05`, `06`, `20`, `29`, and when applicable `32`, `33`
2. Step 4a: load directory synthesis rules, active scenario packages, and active stack packages before creating project structure and relocating approved startup files
3. Step 4b: load the stack-specific setup standards needed for dependency installation, runtime configuration, and engineering scaffold creation
4. Step 5c: load API, database, data-access, security, migration, and tenant-boundary rules
5. Step 5d: load code style, architecture, testing, security, observability, and active stack packages
6. Stage 6: load testing, debug, observability, deployment-readiness, and rollback rules

## Task to workflow docs

1. startup gates: `workflows/startup.md`, `workflows/gate-rules.md`
2. stage review: `workflows/stage-execution.md`, `workflows/gate-rules.md`
3. module design and implementation: `workflows/module-iteration.md`, `workflows/gate-rules.md`
4. large change handling: `workflows/change-management.md`
5. fallback handling: `workflows/fallback-and-degrade.md`

## Scenario and stack activation

1. system type differences come from `scenario-standards/*`
2. implementation method differences come from `stack-standards/*`
3. project-specific overrides come from `ACTIVE_STANDARDS.md` and `PROJECT_OVERRIDES.md`

## Extension activation

1. external enhancement modules are registered under `Acode-kit/extensions/registry/`
2. only project-activated extensions may be loaded
3. `frontend-ux-review-pack` is recommended at `Stage 2`, `Step 5b`, and `Step 5e`
4. `security-review-pack` is recommended at `Step 5e` and `Stage 6`
5. extension modules may enhance a node, but may not replace workflow ownership
