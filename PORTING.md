# Porting record

This repository started from `pstack-claude` at commit `61b9c0b`. It now tracks
PStack 0.15.0 at `cursor/plugins@71ed0d1`. Port version 0.3.0 applies the
upstream changes since `efa2a53` while preserving Codex execution contracts.
Delegates inherit the user's settings. Setup remains an optional readiness
check, and the distribution contains no model specifications.

## Upstream 0.15.0

The release changes 96 paths under `pstack/`. All are accounted for:

- 94 skill, reference, guide and asset paths are merged, added or removed in
  the corresponding Codex plugin paths.
- The upstream manifest maps to the Codex manifest with this port's version
  0.3.0. The smaller upstream logo is copied unchanged.
- The upstream README's applicable release information appears in this
  repository's README and guide. `README-UPSTREAM.md` now links to the pinned
  original instead of distributing model and setup instructions.

The port now has 46 skills, 23 playbooks and 23 principles. The new principles
are Attack the Premise and Test Behavior, Not Implementation. `how` loses its
critique mode and both critic references. `how` and `why` use their reference
prompts for output formats. Reflection requires explicit invocation. Writing
guidance removes mannered prose and over-compression, and PR descriptions
become short briefings with links to detailed evidence.

One narrow correction applies to the new testing principle. Several listed
assertions, such as `toBeDefined`, do fail when a function returns `undefined`.
The port preserves the useful behavior-focused guidance without claiming that
every weak assertion survives that substitution.

`make-bot-ui`, Benny automation files and custom agent definitions were already
outside the Codex distribution. They are unchanged in this upstream delta and
remain excluded. The new Advisor plugin is a sibling of `pstack/`, so it is
outside this update. Helper executable code is unchanged upstream.

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
plugins/pstack/
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
| Claude model aliases and role settings | Removed; inherit the model and reasoning effort selected in Codex |
| `/loop` | A heartbeat automation or bounded watcher task |
| `/simplify` | A deliberate diff-simplification pass |
| `.claude/skills` | Project `.agents/skills` |
| Claude transcript paths | Native task inspection, then exact current-thread lookup only |
| Claude global rules | Removed; optional `$pstack:setup-pstack` checks skill discovery and task-relevant tools without writing global configuration |

The full operational table is in
[`plugins/pstack/HARNESS.md`](./plugins/pstack/HARNESS.md).

## Architecture decision

Two independent designs were compared. Candidate C was selected as the base
because it treats this repository as a thin content package and leaves task
lifecycle, reasoning, and tools with Codex. Version 0.2.0 completes that
separation: PStack does not select a model, assign reasoning effort by role, or
gate execution on model availability. Delegates inherit the parent's settings.
Independent verification comes from fresh context, bounded briefs, and evidence
from the real artifact.

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

`README-UPSTREAM.md` preserves attribution and points to the pinned upstream
README. It no longer embeds the upstream model policy.

## Acceptance checks

`scripts/verify-port.sh` checks the package manifest, marketplace entry, hook,
all 46 skill manifests, the 23 playbooks, the 23 principles, guide and helper
counts, forbidden Claude contracts, the shell helper, Bun tests, and TypeScript
types. Regression checks reject fixed model identifiers and known model
availability, routing, and execution-override patterns in operational content.
The plan checker is exercised with a plan that uses independent verification
lanes, including rejection cases for missing live, unit, perf, or review evidence.
These checks catch known regressions; review still assesses instruction meaning.
The provenance README is included in the model checks. The source checkout was
checked separately before and after the original port because its location is
not part of this portable repository.

Local verification does not publish the plugin or update installed copies.
Installation remains an explicit user action.
