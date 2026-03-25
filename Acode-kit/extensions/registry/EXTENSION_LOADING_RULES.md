# Extension Loading Rules

## Purpose

This file defines how extension modules are matched and loaded without breaking the core `Acode-kit` workflow.

## Decision order

At a workflow node, the main agent should decide extension loading in this order:

1. determine current node (`Gate`, `Stage`, or `Step`)
2. read project-level active extension list
3. verify latest security and workflow-compatibility scan status is `pass`
4. filter registered extensions whose `load_at` includes the current node
5. filter by `requires`
6. sort by `priority`
7. execute by `mode`

## Node examples

### Startup / Gate-side usage

Typical extension usage:

1. domain markdown packs for project skeleton analysis
2. scope helper packs for PRD refinement

### Stage-side usage

Typical extension usage:

1. Stage 2: UI review packs
2. Stage 3: data / integration / migration packs
3. Stage 6: review / observability / security packs
4. Stage 7: go-live governance packs

### Step-side usage

Typical extension usage:

1. Step 5b: UI detail review packs
2. Step 5c: migration / integration / data governance packs
3. Step 5d: implementation helper packs
4. Step 5e: security / review / testing packs

## Unload behavior

If a project has marked an extension as `已停用`:

1. it must not be loaded at any node
2. it may remain registered in the global index
3. the main skill should ignore trigger matches from that extension

## Mode behavior

### `reference-only`
1. main agent reads the extension document directly
2. no sub-agent dispatch is required

### `workflow-helper`
1. main agent may read the extension to help the current node
2. extension does not own the node

### `delegated-capability`
1. main agent may delegate a bounded task to the extension skill
2. the extension returns compressed conclusions only
3. final gate and stage decisions still belong to the main agent

## Hard prohibitions

1. do not load all registered extensions on skill entry
2. do not allow an extension to replace the main orchestrator
3. do not allow an extension to alter gate count or stage order
4. do not activate an extension that is not declared at project level
5. do not activate an extension whose latest security scan is not `pass`
6. do not activate an extension whose workflow compatibility scan is not `pass`
