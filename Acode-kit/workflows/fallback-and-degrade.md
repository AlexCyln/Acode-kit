# Acode-kit Fallback And Degrade

## Tool degradation

1. Pencil unavailable: use textual wireframes or equivalent manual design artifacts
2. NotebookLM unavailable: perform direct analysis and note reduced external context
3. shadcn MCP unavailable: continue using declared shadcn rules without MCP assistance
4. Chrome DevTools MCP unavailable: use browser-native devtools where possible

## Context degradation

When context budget is tight:

1. read only the current workflow doc
2. read only the task-mapped standards
3. prefer project-level active documents over broad standards
4. delegate bounded analysis to sub-agents
5. summarize, do not re-ingest large raw excerpts
