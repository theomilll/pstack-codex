# pstack for Codex

Codex port of [poteto](https://x.com/poteto)'s
[pstack](https://github.com/cursor/plugins/tree/main/pstack) (upstream
v0.15.0, `cursor/plugins@71ed0d1`). The 23 playbooks and 23 principles are
poteto's. This repository ports the harness to Codex's plugin, skill, hook,
and subagent tools. [Upstream provenance](./README-UPSTREAM.md) links to the
original distribution. MIT, same as upstream.

> if you want to go fast, go deep first. pstack helps you write less, but
> higher quality code. rigorous agent workflows you can parallelize with
> confidence.

## Install

Local checkout:

```text
codex plugin marketplace add /path/to/pstack-codex
codex plugin add pstack@pstack-codex
```

Published repo:

```text
codex plugin marketplace add theomilll/pstack-codex
codex plugin add pstack@pstack-codex
```

The plugin is named `pstack`; the repository and marketplace are named
`pstack-codex`. Codex uses the plugin name to expose skills such as
`$pstack:bro`, `$pstack:tdd`, and `$pstack:poteto-mode`. Install the plugin
through the marketplace so Codex retains that namespace.

If you previously installed `pstack-codex@pstack-codex`, refresh the marketplace,
install `pstack@pstack-codex`, then remove the old plugin. If you copied PStack
skills into your user skills directory, move those copies outside skill
discovery after confirming the plugin loads. Keep unrelated skills in place.
Start a new Codex task after migrating.

## Get started

1. Use your preferred Codex settings.
2. Use `$pstack:poteto-mode` for tasks that need its coding and verification workflow.

`$pstack:setup-pstack` is optional. It checks skill discovery and the tools needed for
your task, and can help you find or create a project verification skill.

New here? The
[guide](./plugins/pstack/docs/guide/README.md) walks through a first real
task. Every `$pstack:name` in the guide is a Codex skill mention. Codex can also pick
the skills implicitly when your request matches their descriptions.

PStack inherits the model and reasoning effort selected in Codex. It does not
choose models, assign execution settings by role, check model availability, or
write global Codex configuration. Independent reviewers use fresh context and
different review focuses. Existing Codex agent defaults remain host-owned;
PStack does not override them or select custom agent presets.

## What changed from the Claude port

- Claude `Agent`, `subagent_type`, `SendMessage`, and plugin-installed agent
  types become native Codex subagent workflows. The plugin does not install
  custom agents.
- `.claude-plugin/` becomes a Codex marketplace repo with one real plugin at
  `plugins/pstack/.codex-plugin/plugin.json`.
- Per-role model configuration and model availability gates are removed.
  Codex owns model and reasoning settings; delegates inherit the parent.
- `.claude/skills/verify-<app>/` becomes `.agents/skills/verify-<app>/`.
- Claude `/loop` becomes Codex's native wake mechanism: a heartbeat automation
  in the app or a bounded watcher task in CLI flows.
- Claude transcript scraping becomes native task inspection first, with exact
  current-thread transcript lookup only when the task id is already known.
- `poteto-agent`, `read-only`, and `comment-sicko` live as prompt contracts and
  skill references, not plugin-installed runtime objects.
- There is no Codex equivalent of Claude's built-in `/simplify`. The port keeps
  the cleanup rule, but the simplification pass is done deliberately by the
  agent before commit.

## Compatibility

- Cursor `disable-model-invocation` is not shipped. Codex skills stay matchable
  from `description`.
- Cursor skill `paths` frontmatter is not shipped. Codex skill frontmatter is
  `name` and `description` only.
- The upstream plugin logo maps to Codex `interface.logo`.

Everything else, including the playbook and principle content, is preserved as
closely as the runtime allows. The exact mapping lives in
[plugins/pstack/HARNESS.md](./plugins/pstack/HARNESS.md). The
[porting record](./PORTING.md) names the source inventory, deliberate changes,
and acceptance checks.

Run the complete local verification with:

```text
./scripts/verify-port.sh
```

## Versioning

Version 0.3.0 syncs upstream 0.15.0 with 46 skills, 23 playbooks, and 23
principles. It adds Attack the Premise and Test Behavior, Not Implementation,
simplifies investigation workflows, makes reflection explicit, and updates
the writing guidance. Model specifications remain excluded. The plugin version in
`plugins/pstack/.codex-plugin/plugin.json` is this port's own line. Bump it
whenever installed copies should pick up a change.

## Skills

| skill | for |
|---|---|
| `poteto-mode` | The entry point. Picks a playbook and runs the rest. |
| `how`, `why`, `teach`, `recall` | Understand the code before touching it. |
| `architect`, `arena`, `swarm`, `interrogate`, `blast-radius` | Design and stress the change. |
| `tdd`, `no-comments`, `unslop`, `technical-writing`, `typescript-best-practices` | Build and clean it. |
| `create-verification-skill`, `maintain-verification-skill`, `show-me-your-work` | Prove it. |
| `figure-it-out`, `reflect`, `automate-me`, `setup-pstack`, `bro` | The rest. |
| `principle-*` | The 23 principles, one leaf skill each. |
