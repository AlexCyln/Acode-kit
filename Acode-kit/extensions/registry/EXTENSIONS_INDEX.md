# Extensions Index

This file lists the currently registered external enhancement modules for `Acode-kit`.

## Current MVP extensions

| ID | Type | Mode | Recommended nodes | Security scan | Purpose |
|---|---|---|---|---|---|
| `frontend-ux-review-pack` | markdown | `reference-only` | `Stage 2`, `Step 5b`, `Step 5e` | required | Strengthen admin-console UI/UX review |
| `security-review-pack` | skill | `delegated-capability` | `Step 5e`, `Stage 6` | required | Strengthen security review for auth, permission, tenant, export, callback risks |

## Index rules

1. registration here does not automatically activate an extension
2. the project must explicitly activate the extension
3. the main `Acode-kit` skill remains the orchestrator
4. extensions may enhance a node, but may not change the workflow graph
5. every custom extension must pass security scan before project activation
6. unloading an extension should be done at project level first
