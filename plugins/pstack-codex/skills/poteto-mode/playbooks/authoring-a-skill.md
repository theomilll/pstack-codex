### Authoring or modifying a skill

**You own the skill's voice.** Skill-facing prose has a higher bar than human prose; unhelpful sentences become instructions.

1. Write the `SKILL.md` per the Codex skills reference (https://developers.openai.com/codex/build-skills): `name` matches the directory and `description` says what it does and when to use it. Put optional invocation policy and UI metadata in `agents/openai.yaml`, not unsupported frontmatter. Sibling files (`references/`, `playbooks`) resolve relative to the skill directory. Prose follows the **technical-writing** and **unslop** skills. Use `$skill-creator` for the draft, test, and iterate loop when available.
2. Validate the skill: frontmatter has `name` and `description`, referenced files exist, cross-skill links resolve.
3. Test cases if structural; skip if subjective.
4. Run **Opening a PR**.

When in doubt, delete; prose earns its keep by changing a decision. Tell it to do the thing and skip the reason. Explain only when the rule is confusing without one. Match tone to scope. Point at structural sources (types, READMEs, config); hardcoded details go stale (the **encode-lessons-in-structure** principle skill). Delegate to other skills by path; don't restate. A workflow you keep hitting but isn't captured → propose a new skill.

**Reply:** summary of the skill, key design decisions, validation notes.
