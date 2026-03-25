# Extension Workflow Compatibility Rules

## Purpose

This file defines the architecture-compatibility checks that every custom extension must pass before activation.

The goal is not only to block malicious content, but also to block extensions that would weaken or replace the main `Acode-kit` workflow.

## Core rule

No extension may be activated if it attempts to own, redefine, or bypass the host workflow.

## Hard-fail compatibility cases

Fail the extension if it does any of the following:

1. declares itself as the primary or public orchestrator
2. introduces its own full delivery workflow as the default path
3. asks the agent to ignore, replace, or supersede `Acode-kit`
4. redefines Gate / Stage / approval ownership
5. tries to output final user-facing decisions without main-skill convergence
6. forces global mandatory rules that are meant to override host workflow contracts

## Typical risky signals

These patterns are not automatically safe just because they are not malicious:

1. custom invocation formats such as `/skill-name <request>`
2. large built-in workflows with independent phases
3. phrases like `all rules in this skill are mandatory`
4. phrases like `use this skill as the main workflow`
5. directions that require loading all bundled references or scripts at once

## Allowed extension behavior

An extension is compatible when it is clearly bounded:

1. it runs only when activated at project level
2. it runs only at allowed `Gate / Stage / Step` nodes
3. it enhances a node instead of owning the workflow
4. it returns bounded conclusions to the main skill
5. it does not redefine approval, documentation, or routing ownership

## Result policy

1. workflow ownership conflict = `fail`
2. unclear boundary wording = `warn`
3. clearly bounded enhancement behavior = `pass`

## Recommended enforcement

Run this compatibility check as part of the standard extension admission scan:

```bash
node scripts/scan-extension-module.mjs --manifest /path/to/manifest.json
```
