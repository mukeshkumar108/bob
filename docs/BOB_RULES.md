# BOB Operating Rules for Smart AI Collaboration

## Core Protocol

### Modes of Operation
* **PLAN MODE (Default):** Propose actions only. No file reads, no code, and no diffs.
* **READ MODE (After Approval):** Access only approved files and line ranges. Summarize; show at most 0–3 lines per file, with an absolute maximum of 10 lines total.
* **ACT MODE (Explicit Only):** Propose changes. Use `diff --unified` format only, with ±3 lines of context. Never output full files. Stop if the change is >150 lines or touches >3 files.

### Initial Confirmation
At the start of every session, the agent must confirm:
> "I have read and will adhere to /docs/BOB_RULES.md and the exclusions in /.bobignore."

---

## Hard Limits & Constraints

### Read-Only Default
The agent is **read-only** unless explicitly told to enter **ACT MODE**.

### No Execution
Never run commands, tests, or builds.

### No Secrets
Never reveal or log API keys, environment variables, or credentials.

### Budgeting
* Provide a rough token estimate and a running meter with every response
* If a step is >15k tokens, stop and ask to narrow the scope

### Scoping
* Respect `/.bobignore`
* Only access files and ranges explicitly approved
* Use BOB's injection points for efficient context sharing

---

## PLAN MODE Rules (Default)

### Purpose
To map out the next steps without consuming excessive tokens.

### Output Restrictions
* No code, snippets, or diffs under any circumstances
* Must return **exactly** the following:
  * A concise plan (≤5 bullets)
  * Requested reads (file paths + ranges + one-line reason each)
  * A token budget estimate
  * The current meter
* If uncertain, ask questions instead of outputting code

---

## READ MODE Rules (After Approval)

### Purpose
To minimally summarize approved files with maximum efficiency.

### Output Restrictions
* Provide 2–3 bullets per file summarizing its purpose
* Evidence is capped at 0–3 lines per file, with a maximum of 10 lines total across the entire task
* Never dump imports, schemas, or boilerplate
* Always reference BOB's injection points for additional context

---

## ACT MODE Rules (Explicit Only)

### Purpose
To propose code changes with surgical precision.

### Output Restrictions
* **Diffs only** (`diff --unified`, ±3 lines of context)
* Each diff must include:
  * A 2–4 bullet rationale
  * A rollback note
* The agent must stop and request approval if:
  * The diff is >150 lines, or
  * The change spans >3 files

### Documentation Requirements
* Every code change must include corresponding BOB documentation updates
* Update `/docs/CHANGELOG.md` with all modifications
* Verify BOB's architecture accuracy after changes

---

## BOB-Specific Protocols

### Smart Learning
* BOB tracks usage patterns to optimize injection points
* Context bridges maintain session continuity
* Token alerts prevent unexpected costs

### Self-Adaptation
* BOB analyzes project structure automatically
* Builds component maps and decision trees
* Learns developer preferences over time

### Communication Standards
* Use token alerts for cost transparency
* Follow BOB's progressive disclosure patterns
* Respect session persistence for continuity

### Token Estimation Guidelines
Provide rough estimates for planning (not hard limits):
* **Simple tasks:** 2-5k tokens (form updates, small fixes, single component changes)
* **Complex features:** 5-15k tokens (new pages, multi-component features, API integration)
* **Architecture changes:** 10-25k tokens (refactoring, new systems, schema changes)

Stop at 15k cumulative and request approval for continuation. These are estimates to aid planning, not restrictive limits.

---

## Violations & Recovery

### Hard Stops
If the agent is about to output >200 characters of code (without an explicit "SHOW LINES" request), it **must stop and apologize**. This is a hard stop.

### Recovery Protocol
1. Immediately cease current operation
2. Apologize for protocol violation
3. Request clarification or approval for corrective action
4. Document the incident in session notes

### Escalation
For complex scenarios exceeding defined limits:
1. Stop and summarize current state
2. Request human guidance on next steps
3. Propose breaking complex task into smaller, approved phases

---

## Success Metrics

### Token Efficiency
- 70%+ reduction in context-gathering tokens
- <5% of sessions exceeding 15k cumulative tokens
- Clear token estimates provided with every plan

### Quality Assurance
- 95%+ accuracy between documentation and codebase
- <1 day lag for documentation updates
- Zero protocol violations per session

### Collaboration Efficiency
- Clear communication using established patterns
- Efficient context sharing via injection points
- Minimal back-and-forth iterations

This protocol ensures efficient, safe, and collaborative agent operation while maintaining code quality and documentation accuracy with BOB's intelligent assistance.
