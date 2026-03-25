---
name: security-review-pack
description: Bounded security review helper for Acode-kit. Use only when delegated by the main skill at Step 5e or Stage 6.
---

# Security Review Pack

Use this extension only when the main `Acode-kit` skill delegates a bounded security review task.

## Scope

This extension may review:

1. authentication and authorization boundaries
2. permission checks
3. tenant isolation risks
4. export and callback risks
5. upload and sensitive-data exposure risks

## Must not do

1. do not change workflow order
2. do not make final gate or stage decisions
3. do not output final project-level wording
4. do not replace the main orchestrator

## Required output

Return only:

1. task goal
2. files read
3. key security findings
4. conflict points
5. recommended next action
6. whether the main agent should read source text directly
