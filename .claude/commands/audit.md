---
description: Run a full multi-agent audit using three specialist agents dispatched in parallel
allowed-tools: Task, Read, Glob, Grep, Write, Bash
---

Run a full multi-agent audit on the current project using three specialist agents dispatched via Task.

## Step 1 — Project Detection

Read the project root. Determine project type:
- `package.json` present → code project (detect framework: React, Next.js, Vite, etc.)
- `.claude/` directory or `CLAUDE.md` with agent definitions → agent system
- `/clients/` folder → marketing agency system
- Multiple signals → hybrid

Record: project name, project type, framework, key config files found.

## Step 2 — Pre-flight Checks

Before dispatching agents, verify:
- Is there a `.gitignore`? Does it include `.env`?
- Is there a `CLAUDE.md`? (flag as warning if missing)
- Are any `.env` files committed to version control? (flag as critical immediately)
- Record the file count and primary source directories.

## Step 3 — Dispatch Parallel Agents (DO THIS NOW via Task tool)

Use the Task tool to launch these two agents simultaneously. Do not read source files yourself — that is the agents' job.

**Task 1: agent=audit-code-quality**
Prompt: "Run a full code quality audit on this $ARGUMENTS project. Project type: [detected type]. Framework: [detected framework]. Source directories: [list]. Return all findings in severity format (Critical/Warning/Suggestion) with rule IDs, file paths, line numbers, and fix instructions."

**Task 2: agent=audit-frontend-design**
Prompt: "Run a full frontend/design consistency audit on this $ARGUMENTS project. Project type: [detected type]. Framework: [detected framework]. Source directories: [list]. Return all findings in severity format (Critical/Warning/Suggestion) with rule IDs, file paths, line numbers, and fix instructions."

Wait for both tasks to complete before proceeding to Step 4.

## Step 4 — Dispatch Sequential Agent (via Task tool)

Use the Task tool to launch:

**Task 3: agent=audit-architecture**
Prompt: "Run a full architecture/reliability/security audit on this project. Project type: [detected type]. Source directories: [list]. Findings from code-quality agent: [paste Task 1 output]. Findings from frontend-design agent: [paste Task 2 output]. Factor their findings into your assessment. Return findings in severity format with rule IDs, file paths, line numbers, and fix instructions."

Wait for Task 3 to complete.

## Step 5 — Auto-fixes

From the combined findings, apply ONLY these without asking:
- Remove unused imports (if ESLint auto-fixable)
- Run Prettier formatting on source files
- Replace `transition: all` with explicit property list (only unambiguous cases)
- Add `alt=""` to images confirmed decorative

Record every auto-fix applied with file path and what changed.

## Step 6 — Assemble Report

Save the final report to `audit-reports/[YYYY-MM-DD]-[project-name].md`. Create the directory if it doesn't exist.

Report structure:
```
# Audit Report — [Project Name]
**Date:** [YYYY-MM-DD]
**Project Type:** [code / agent-system / hybrid]
**Framework:** [detected]
**Agents Run:** Code Quality, Frontend/Design, Architecture/Security

## Executive Summary
- Critical: [count]
- Warning: [count]
- Suggestion: [count]
- Auto-fixes applied: [count]
- Awaiting approval: [count]

---

## Critical Issues

### [Rule ID] — [Rule Name]
- **Agent:** [which specialist]
- **File:** `path:line`
- **Issue:** [description]
- **Fix:** [specific instruction]
- **Auto-fixable:** [yes/no]

---

## Warnings
[same structure]

---

## Suggestions
[same structure]

---

## Auto-Applied Fixes
[file path — what changed — which rule]

---

## Requires Approval
[file path — proposed change — why approval needed]

---

## Agent Errors
[any Task failures — what was skipped]

---

## Learning Loop Additions
[patterns seen 3+ times — proposed rules for lessons.md — do not modify lessons.md directly]
```

## Hard Rules

- Never push to git
- Never modify `.env` files
- Never delete files — flag only
- Never modify agent definition files without explicit user approval
- Everything not in Step 5 requires user approval before acting
