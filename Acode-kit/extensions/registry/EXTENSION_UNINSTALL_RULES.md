# Extension Uninstall Rules

## Purpose

This file defines how an already activated extension is unloaded from a project without breaking the main workflow.

## Core rule

Uninstalling an extension means:

1. removing it from the project active set
2. preventing future node loading
3. preserving traceability of who disabled it and why

It does not require deleting the extension pack from the repository.

## Uninstall path

### Project-level uninstall

The default uninstall action is project-level deactivation:

1. mark the extension as `已停用` in `PROJECT_EXTENSIONS.md`
2. remove it from `ACTIVE_STANDARDS.md` current enabled list
3. append an uninstall record

### Registry-level removal

Registry-level deletion is not the default path. Only use it when:

1. the extension is deprecated globally
2. the extension has confirmed security issues
3. repository owners explicitly decide to remove it

## Safety rules

1. do not silently delete extension packs on uninstall
2. do not leave project activation docs inconsistent
3. do not keep a disabled extension in the active load summary
4. if uninstall affects active review or implementation work, record the impact

## Recommended execution path

Use:

```bash
node scripts/uninstall-extension-module.mjs --id frontend-ux-review-pack --project-extensions docs/project/PROJECT_EXTENSIONS.md --active-standards docs/project/ACTIVE_STANDARDS.md
```

## Expected result

After uninstall:

1. the extension remains registered unless explicitly removed
2. the project will not load it at future matching nodes
3. the uninstall action remains traceable in project docs
