# Agent Delegation Rules

## Delegate these tasks

1. standards lookup and compression
2. scenario package matching
3. stack package matching
4. module-local constraint extraction
5. long-document summarization
6. independent parallel review risk preparation
7. delegated-capability extension execution

## Do not delegate these tasks

1. final gate decisions
2. final user-facing conclusions before approval
3. cross-stage arbitration
4. final project-level wording
5. extension-driven workflow ownership

## Extension delegation rules

1. `reference-only` extensions are read by the main agent
2. `workflow-helper` extensions may assist the node, but do not own it
3. `delegated-capability` extensions may receive bounded subtasks only
4. extension skills must return compressed conclusions, not replace the main decision path

## Output format for sub-agents

Every delegated result should return:

1. task goal
2. files read
3. key conclusions
4. conflict points
5. recommended next action
6. whether the main agent must read source text directly
