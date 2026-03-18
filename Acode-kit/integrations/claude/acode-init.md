---
name: acode-init
description: One-time environment initialization. CRITICAL — This is NOT a project workflow. Do NOT read SKILL.md. Do NOT create project files, directories, or AGENTS.md. Do NOT create task plans. Just scan tools, configure NotebookLM, and write a status file.
---

You are the Claude adapter for `Acode-kit init`.

## CRITICAL RULES — READ BEFORE ANYTHING ELSE

1. **THIS IS INITIALIZATION, NOT PROJECT SETUP.** Do NOT read SKILL.md. Do NOT create project directories, AGENTS.md, PRD, or any project files. Do NOT read global engineering standards. Initialization only scans tools and writes a status file.
2. **NO TASK PLANS.** Do NOT use TaskCreate, TodoWrite, or any task/todo system. Execute the steps below as a single response flow — no task tracking needed.
3. **MATCH USER LANGUAGE.** Respond in the same language the user uses.
4. **IF ALREADY INITIALIZED:** Check if `.acode-kit-initialized.json` exists. If yes, tell the user "Acode-kit is already initialized. Use `--force` to re-initialize." Then STOP.

---

## WHAT TO DO — Execute all steps below in a single response

### Step 1: Check project folder
- Is the current working directory empty (new project) or does it have existing files?
- Report the result.

### Step 2: Scan MCP tools
- Check these 4 tools and report each as installed or missing:
  - Pencil MCP (UI/UX design)
  - NotebookLM MCP (requirements analysis)
  - shadcn MCP (UI components)
  - Chrome DevTools MCP (debugging)

### Step 3: Handle missing tools
- If any tools are missing, list them with their purposes.
- Ask the user: install them now, or skip?
- If user skips, continue — not a blocker.

### Step 4: Configure NotebookLM
- If NotebookLM MCP is installed: inform the user that on first project use, the agent will send "Log me in to NotebookLM" to trigger browser authentication. Ask if they have already authenticated.
- If not installed: note they can install later and re-run init.

### Step 5: Write status file
- Write `.acode-kit-initialized.json` with this structure:
```json
{
  "version": "1.0.0",
  "initializedAt": "ISO timestamp",
  "provider": "detected provider",
  "projectFolder": { "wasEmpty": true/false, "path": "..." },
  "tools": [
    { "id": "pencil", "name": "Pencil MCP", "status": "installed/missing" },
    { "id": "notebooklm", "name": "NotebookLM MCP", "status": "installed/missing" },
    { "id": "shadcn", "name": "shadcn MCP", "status": "installed/missing" },
    { "id": "chrome-devtools", "name": "Chrome DevTools MCP", "status": "installed/missing" }
  ],
  "notebookLM": {
    "configured": true/false,
    "authCompleted": true/false,
    "notebookUrl": "https://notebooklm.google.com/notebook/7ec4ec07-abb3-478e-99aa-f8946e103499"
  }
}
```

### Step 6: Done
- Tell the user: "Initialization complete. You can now use Acode-kit to start a project."

---

## NEVER do these during initialization
1. Read SKILL.md or any global engineering standards.
2. Create project directories, AGENTS.md, PRD, or any project documents.
3. Create task plans or todo lists.
4. Start the project startup sequence (gates, requirements analysis, etc.).
5. Suggest or begin any project workflow actions.
