# Porting record

This repository ports `pstack-claude` at commit `61b9c0b` to Codex. It keeps
the pstack workflow corpus and helper behavior while replacing Claude-specific
execution contracts with Codex-native ones.

## Source inventory

The source checkout was clean before the port. Its tracked distribution
contained:

- 44 skills
- 23 `poteto-mode` playbook files
- 21 principle skills
- 17 guide files, including six images
- 20 Bun helper and test files
- three Claude agent definitions and one startup hook

The Codex distribution preserves the skills, playbooks, principles, guide,
hook intent, and helpers. It does not ship the Claude agent definitions.

## Package shape

The repository is a Codex marketplace with one plugin:

```text
.agents/plugins/marketplace.json
plugins/pstack-codex/
  .codex-plugin/plugin.json
  hooks/hooks.json
  skills/
  docs/guide/
```

Codex discovers the plugin's skills from its declared `skills` directory. The
hook stays at the conventional `hooks/hooks.json` path. The installed Codex
plugin schema currently rejects a `hooks` key in `plugin.json`, so the manifest
does not declare that path separately.

## Runtime mapping

| Claude contract | Codex port |
|---|---|
| `Agent` and `subagent_type` | Native subagent creation with a bounded brief |
| `SendMessage` | Native follow-up or message controls |
| Plugin-defined agent types | Skill-owned role and report contracts |
| `isolation: "worktree"` | A coordinator-created Git worktree for each concurrent writer |
| Claude model aliases | `gpt-5.6-sol` for every role, with no fallback |
| `/loop` | A heartbeat automation or bounded watcher task |
| `/simplify` | A deliberate diff-simplification pass |
| `.claude/skills` | Project `.agents/skills` |
| Claude transcript paths | Native task inspection, then exact current-thread lookup only |
| Claude global rules | Removed; `$setup-pstack` verifies the single-model requirement |

The full operational table is in
[`plugins/pstack-codex/HARNESS.md`](./plugins/pstack-codex/HARNESS.md).

## Architecture decision

Two independent designs were compared. Candidate C was selected as the base
because it treats this repository as a thin content package and leaves task
lifecycle, reasoning, and tools with Codex. The repository fixes every role to
`gpt-5.6-sol`.

The port grafts Candidate A's strongest constraints:

- one shared Codex delegation reference
- coordinator-only ownership of shared orchestration state
- no broad transcript or session crawling
- explicit worktrees for concurrent writers
- deterministic corpus and forbidden-contract checks

It rejects a compatibility daemon, plugin-installed custom agents, and writes
to Codex's global configuration or agent profiles. Durable state uses a
plugin-owned directory under `CODEX_HOME`.

## Deliberate compatibility

The GitHub PR watcher still recognizes Cursor Bugbot comments. Those comments
are remote PR data, not a local Cursor runtime dependency. Removing the parser
would regress an existing watcher input without making the Codex harness
simpler.

`README-UPSTREAM.md` is preserved verbatim for attribution and provenance. Its
Claude and Cursor references are not operational instructions for this plugin.

## Acceptance checks

`scripts/verify-port.sh` checks the package manifest, marketplace entry, hook,
all 44 skill manifests, the 23 playbooks, the 21 principles, guide and helper
counts, forbidden Claude contracts, the shell helper, Bun tests, and TypeScript
types. It also rejects any explicit GPT identifier other than `gpt-5.6-sol`
and any operational multi-model workflow. The source checkout was checked
separately before and after the port because its location is not part of this
portable repository.

The port does not create a remote or publish the plugin. Installation remains
an explicit user action.
