# PROJECT NAME

## Universal Agents Control manifest

All agents must emulate `.agents/` support even when the runtime does not load those files automatically. Treat this document as the control manifest: it lists the available metadata, where to read it, and how to compose it during a conversation.

## Execution Protocol

1. **Always read this file first** before starting a task so you know which skills or rules to load from `.agents/`.
2. **Skills**:
   - Load a skill only if its trigger condition matches the task. Example: code review tasks must load `skills/code-review/SKILL.md`.
   - Once loaded, obey the process and output format defined inside the skill file so the final response stays consistent.
   - Skills are located in `.agents/skills/[skill-name]/SKILL.md`
3. **Rules**:
   - Rules are long-lived constraints (API guidelines, coding practices, etc.). Whenever a task touches those domains, read the matching file under `.agents/rules/`.
   - Treat these as required context: preload them before drafting any response and ensure every recommendation complies.
   - Rules are located in `.agents/rules/[rule-name].md`
4. **Response contract**:
   - Explicitly mention which skills and rules are in effect.
   - Derive findings, recommendations, or code while enforcing all loaded constraints. If conflicts arise, ask for clarification before diverging.

## About the project

<!-- Add details here -->

## Role and Technical Context

<!-- Add more details here -->

- **Domain**:
- **Tech Stack**:
- **Architecture**:

## Change Management Philosophy

All changes must be:

- **Atomic**: The smallest possible and logically complete unit of change
- **Safe**: Reviewed, tested, and production-ready
- **Tested**: Unit tests required for new features
- **Linted**: Must pass `pnpm run lint` and `pnpm run typecheck` before commit
- **Documented**: Clear commit messages following Conventional Commits pattern
- **Delivered**

## Rules vs. Skills at a Glance

| Aspect           | Rules                                             | Skills                                                                     |
| ---------------- | ------------------------------------------------- | -------------------------------------------------------------------------- |
| Purpose          | Concise written instructions covering a domain.   | Full toolkits: guidance plus reusable templates and verified workflows.    |
| Execution effort | Agent interprets and implements from scratch.     | Drop-in code, docs, and checklists shorten build time.                     |
| Complexity focus | Describes guardrails; depends on agent expertise. | Encodes battle-tested patterns for tricky or specialized scenarios.        |
| Maintenance      | Update the prose rule as policies evolve.         | Refresh the whole package (docs + sample code) when better solutions ship. |

Think of **rules** as a "manual" that keeps behavior aligned, while **skills** are the "manual + toolbox + demo video" bundle you reach for when you need a proven solution.

## Extending the Manifest

- Additional **skills** (architecture review, test planning, etc.) or **rules** (team code style, compliance requirements) can be added under the existing folders.
- Keep this file updated so future agents know when to load each artifact and how to combine them safely.

Remember: You're supporting the VAIT community Discord bot. Focus on clean, maintainable code that serves the community well. When in doubt, follow existing patterns in the codebase and refer to the relevant rules.
