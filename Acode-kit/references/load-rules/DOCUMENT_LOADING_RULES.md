# Document Loading Rules

## Loading order

Main agent reads in this order only:

1. `Acode-kit/SKILL.md`
2. current `Acode-kit/workflows/*.md`
3. current `Acode-kit/references/load-rules/*.md`
4. required `scenario-standards/*`
5. required `stack-standards/*`
6. required active extensions
7. project-level `ACTIVE_STANDARDS.md`
8. current project control docs

## Extension loading

Extensions are loaded only when:

1. the current node matches the extension `load_at`
2. the project has explicitly activated the extension
3. extension `requires` constraints match the current project
4. the current task still needs extra constraints after core standards are loaded

When an extension is loaded:

1. keep the extension node-local
2. summarize extension usage to the user in one compact statement
3. state the extension id, the delegated or assisted scope, and the practical effect on the current node
4. do not present the extension as a workflow owner

## Hard prohibitions

1. do not read all global standards on skill entry
2. do not read all workflows on skill entry
3. do not read all scenario packages on skill entry
4. do not read all stack packages on skill entry
5. do not keep reading once the current task has enough constraints to execute
6. Do not bulk-read all workflows or all standards on entry.
7. do not bulk-read all registered extensions on entry
8. do not activate an extension only because it exists in the registry
9. do not let LMS tier downshift remove required document materialization or node review outputs

## Stability criteria

1. every node must have a single entry condition
2. every node must state its review output
3. every node must state its next action
4. every node must know which docs it updates
5. if a node cannot be explained with those four properties, loading is not yet sufficient
