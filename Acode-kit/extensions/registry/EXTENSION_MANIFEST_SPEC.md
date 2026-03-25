# Extension Manifest Spec

## Purpose

This file defines the minimum manifest contract for external extension modules.

Extensions may be:

1. `markdown` packages
2. `skill` packages

The main `Acode-kit` skill remains the only public orchestrator. Extensions may only:

1. provide additional reference material
2. assist a workflow node
3. handle delegated bounded subtasks

They may not:

1. change gate count
2. change stage count
3. override approval boundaries
4. replace the main orchestrator

## Required fields

```json
{
  "id": "frontend-ux-review-pack",
  "type": "markdown",
  "entry": "Acode-kit/extensions/packs/frontend-ux-review-pack/frontend-ux-review-pack.md",
  "description": "Frontend UX review enhancement pack",
  "triggers": ["ui review", "ux", "table", "form", "admin console"],
  "load_at": ["Stage 2", "Step 5b", "Step 5e"],
  "priority": 80,
  "mode": "reference-only",
  "requires": {
    "scenario": ["bs-admin-console", "bs-platform-ecosystem"],
    "stack": ["react-shadcn", "b2b-saas-admin"]
  }
}
```

## Field rules

### `id`
1. unique across all registered extensions
2. use stable kebab-case

### `type`
Allowed values:

1. `markdown`
2. `skill`

### `entry`
1. path to the primary extension file
2. may be relative to the repository root
3. for `skill`, the target must be a `SKILL.md`

### `description`
1. short human-readable purpose statement
2. must explain what the extension adds

### `triggers`
1. optional keyword hints
2. used to help matching, not as the only activation condition

### `load_at`
1. list of allowed Gate / Stage / Step nodes
2. the main skill may load the extension only at these nodes

### `priority`
1. integer
2. higher number wins when multiple extensions compete for the same narrow purpose

### `mode`
Allowed values:

1. `reference-only`
2. `workflow-helper`
3. `delegated-capability`

Rules:

1. `reference-only`: main agent reads the extension text directly
2. `workflow-helper`: main agent reads or lightly references the extension for node-local help
3. `delegated-capability`: main agent may delegate a bounded subtask to the extension skill

### `requires`
Optional activation constraints. Supported keys:

1. `scenario`
2. `stack`
3. `project_tags`

The extension should not be loaded if the current project activation does not satisfy these requirements.

## Activation rules

Registration is not activation.

An extension becomes active only when it is explicitly declared in project-level activation documents, such as:

1. `ACTIVE_STANDARDS.md`
2. `PROJECT_EXTENSIONS.md`

Before activation, every custom extension must pass the security admission checks defined in:

1. `EXTENSION_SECURITY_SCAN_RULES.md`
2. `EXTENSION_WORKFLOW_COMPATIBILITY_RULES.md`

## Conflict rules

1. the main `Acode-kit` skill always wins over extensions
2. workflow contracts always win over extensions
3. project-level explicit activation wins over generic trigger hints
4. when two extensions of the same purpose conflict, choose the higher `priority`

## Security admission rules

1. custom extensions must be scanned before first activation
2. scan result `fail` blocks activation
3. scan result `warn` requires manual review before activation
4. the main workflow may ignore any extension whose latest scan status is not `pass`
5. workflow ownership or architecture compatibility failure also blocks activation

## Recommended repository layout

```text
Acode-kit/extensions/
  registry/
    EXTENSIONS_INDEX.md
    EXTENSION_MANIFEST_SPEC.md
    EXTENSION_LOADING_RULES.md
  packs/
    frontend-ux-review-pack/
      manifest.json
      frontend-ux-review-pack.md
    security-review-pack/
      manifest.json
      SKILL.md
```
