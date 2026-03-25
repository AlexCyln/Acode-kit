# Acode-kit Stage Execution

## Stage graph

1. Stage 1: requirements structuring + module decomposition
2. Stage 2: overall UI architecture
3. Stage 3: overall data model + API framework
4. Stage 4: project scaffold initialization
5. Stage 5: module iteration
6. Stage 6: integration testing + cross-module review
7. Stage 7: deployment and go-live

## Core rules

1. Execute stages in order.
2. Do not skip stages whose outputs are required downstream.
3. If an upstream artifact is wrong, backtrack, revise, re-approve, then continue.
4. `Step 4` during startup is different from `Stage 4` during execution.
5. Stage 5 repeats per module using the approved module priority order.

## Stage review outputs

- Stage 1: prioritized module map
- Stage 2: architecture-level wireframes only
- Stage 3: ER/API framework outline
- Stage 4: app scaffold and runtime foundation
- Stage 5: approved per-module outputs for 5a-5e
- Stage 6: integration results and cross-module findings
- Stage 7: go-live status and rollback readiness
