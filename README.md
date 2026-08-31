# pstack for Codex

Codex port of [poteto](https://x.com/poteto)'s
[pstack](https://github.com/cursor/plugins/tree/main/pstack) (upstream
v0.14.5, `cursor/plugins@6fecddb`). The 23 playbooks and 21 principles are
poteto's. This repository ports the harness to Codex's plugin, skill, hook,
and subagent model. The upstream README is preserved at
[README-UPSTREAM.md](./README-UPSTREAM.md). MIT, same as upstream.

> if you want to go fast, go deep first. pstack helps you write less, but
> higher quality code. rigorous agent workflows you can parallelize with
> confidence.

## Install

Local checkout:

```text
codex plugin marketplace add /path/to/pstack-codex
codex plugin add pstack-codex@pstack-codex
```

Published repo:

```text
codex plugin marketplace add theomilll/pstack-codex
codex plugin add pstack-codex@pstack-codex
```

## Get started

1. Run `$setup-pstack` once to confirm that `gpt-5.6-sol` is available.
2. Use `$poteto-mode` whenever the task is non-trivial or the user wants
   rigor.

New here? The
[guide](./plugins/pstack-codex/docs/guide/README.md) walks through a first real
task. Every `$name` in the guide is a Codex skill mention. Codex can also pick
the skills implicitly when your request matches their descriptions.

Every parent task and subagent uses `gpt-5.6-sol`. If the host does not expose
that model, pstack stops instead of substituting another model.

## What changed from the Claude port

- Claude `Agent`, `subagent_type`, `SendMessage`, and plugin-installed agent
  types become native Codex subagent workflows. The plugin does not install
  custom agents.
- `.claude-plugin/` becomes a Codex marketplace repo with one real plugin at
  `plugins/pstack-codex/.codex-plugin/plugin.json`.
- Claude's per-role model configuration becomes one fixed Codex policy:
  `gpt-5.6-sol` for every role.
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

Everything else, including the playbook and principle content, is preserved as
closely as the runtime allows. The exact mapping lives in
[plugins/pstack-codex/HARNESS.md](./plugins/pstack-codex/HARNESS.md). The
[porting record](./PORTING.md) names the source inventory, deliberate changes,
and acceptance checks.

Run the complete local verification with:

```text
./scripts/verify-port.sh
```

## Versioning

The plugin version in `plugins/pstack-codex/.codex-plugin/plugin.json` is this
port's own line. Bump it whenever installed copies should pick up a change.

## Skills

| skill | for |
|---|---|
| `poteto-mode` | The entry point. Picks a playbook and runs the rest. |
| `how`, `why`, `teach`, `recall` | Understand the code before touching it. |
| `architect`, `arena`, `swarm`, `interrogate`, `blast-radius` | Design and stress the change. |
| `tdd`, `no-comments`, `unslop`, `technical-writing`, `typescript-best-practices` | Build and clean it. |
| `create-verification-skill`, `maintain-verification-skill`, `show-me-your-work` | Prove it. |
| `figure-it-out`, `reflect`, `automate-me`, `setup-pstack`, `bro` | The rest. |
| `principle-*` | The 21 principles, one leaf skill each. |
