# Codex harness

pstack's 23 playbooks and 23 principles stay. Only the harness call sites
change.

Sources: upstream pstack (`cursor/plugins` `pstack/`, v0.15.0,
`cursor/plugins@71ed0d1`), the Claude port this repo started from, and the
Codex docs for skills, plugins, hooks, and subagents.

## Verdict

The discipline ports. The Claude plugin runtime does not. Install this repo as
a Codex plugin. `.claude-plugin`, `.claude/rules`, Claude agent definitions,
Claude transcript paths, and Claude `/loop` instructions are gone.

## Mapping: pstack need -> Codex primitive

| pstack need | Claude port | Codex |
|---|---|---|
| Skill router | `/pstack:<name>` | `$<name>` for explicit invocation, or implicit skill matching from `description`. |
| Plugin install | `/plugin marketplace add ...` | `codex plugin marketplace add <source>` then `codex plugin add pstack-codex@pstack-codex`. |
| Plugin manifest | `.claude-plugin/plugin.json` | `.codex-plugin/plugin.json`. This repo is a marketplace root; the installed plugin lives at `plugins/pstack-codex/`. |
| Startup reminder | `hooks/hooks.json` `SessionStart` | Same file name. Match `startup`, `resume`, `clear`, and `compact`. |
| Spawn a child | `Agent` + `subagent_type` | Use Codex's native subagent tools, such as `spawn_agent`. The plugin does not install agent types. |
| Read-only child | `pstack:read-only` | Use a no-edit brief and available permission restrictions without selecting a custom agent preset that changes execution settings. |
| Writing child | `pstack:poteto-agent` or `general-purpose` | Spawn a normal Codex subagent and tell it to use `$poteto-mode` or the relevant routed skill. |
| Resume or steer a child | `SendMessage` | Use the host's native follow-up or message tool, such as `followup_task` or `send_message`. Inspect with `list_agents`, stop with `interrupt_agent`, and await with `wait_agent` when exposed. |
| Execution settings | Model aliases and role-specific reasoning | Inherit the model and reasoning effort selected in Codex. Omit per-spawn overrides. |
| Setup | Per-role configuration in global rules | Optional `$setup-pstack` checks skill discovery and task-relevant tools. It never edits global Codex configuration. |
| Worktree isolation | `isolation: "worktree"` | Codex subagents share the workspace. The coordinator creates one Git worktree per concurrent writer before spawning and includes the exact path in its brief. |
| Ask the human | `AskUserQuestion` | Use the host's structured user-input tool when available; otherwise ask one concise question for a real product, preference, or irreversible choice. |
| Wake / recurring | Claude `/loop` | Use Codex's native wake mechanism: heartbeat automation in the app, or a bounded watcher task that rechecks a concrete predicate. |
| Skill authoring | Claude skills reference | Codex skills reference. A skill is a directory with `SKILL.md` and optional `scripts/`, `references/`, and `assets/`. |
| Code cleanup | Claude `/simplify` | Do the simplification pass yourself before commit. Keep `$no-comments` before review and `$unslop` for prose. |
| Drive the real surface | verification skill or Claude Chrome | verification skill first. Without one, use the shell for CLI surfaces and the available browser or computer-use tools for UI surfaces. |
| Skill directories | `.claude/skills/`, `~/.claude/skills/` | Project `.agents/skills/`, user `$HOME/.agents/skills/`, and plugin `skills/`. |
| Transcripts | `~/.claude/projects/<slug>/...` | Native task inspection first. If you must read a local transcript, search only for the exact current thread id under `${CODEX_HOME:-$HOME/.codex}/sessions/` and verify the opening user prompt matches. Never glob unrelated sessions. |
| Session pickup | `claude --resume <id>` | Continue the known Codex task or inspect a known task id, then rebuild the trail from its messages and artifacts. |
| MCP discovery | `claude mcp list` | Use the host's tool search to enumerate MCP tools, usually by querying `mcp__`. |
| Agent store | `~/.claude/pstack/<project-slug>/` | `${CODEX_HOME:-$HOME/.codex}/pstack-codex/projects/<repo-fingerprint>/`. Plans live under `docs/`, orchestration state under `orchestrate/`. |
| Plugin files at runtime | installed Claude cache path | `<pstack root>` means the installed Codex plugin root. Read files relative to it. Do not assume a hard-coded cache directory. |
| Plugin logo | `.cursor-plugin/plugin.json` `logo` | `.codex-plugin/plugin.json` `interface.logo`. Path is plugin-root-relative and starts with `./`. |
| Skill path filter | Cursor `paths` frontmatter | Not shipped. Codex skill frontmatter is `name` and `description` only. |
| Disable model invocation | Cursor `disable-model-invocation` frontmatter | Not shipped. Codex skills stay matchable from `description`. |

## Default delegation shape

Use these contracts unless a playbook says otherwise.

- Code-writing delegates. Spawn a Codex subagent. Point it at `$poteto-mode` or
  the relevant routed skill. Give it a bounded brief, explicit acceptance
  checks, and its own worktree if another writer could touch the same tree.
- Read-only explorers, judges, critics, and verifiers. Spawn a subagent with an
  explicit no-edit brief and available permission restrictions. Do not select
  custom agent presets that change execution settings. These lanes may still
  read code, run read-only shell commands, and use MCP tools.
- Independent verify. Spawn a fresh subagent with a self-contained
  brief. The verifier inspects and reports. It does not land code changes.

## Execution settings

Codex owns the model and reasoning effort. PStack delegates inherit the parent
settings, with no per-role overrides or model availability gate. Setup is not a
prerequisite for using a skill. Existing Codex agent defaults remain host-owned;
PStack does not override them.

Use a self-contained or short-history fork for independent review. Independence
comes from fresh context and a separate review brief; a model switch is not
part of the workflow.

## State and transcript safety

Native task ids and status are authoritative for live work. The durable TSV and JSON store is bookkeeping, not a second scheduler. Each concurrent actor owns separate records or publishes an immutable completion pointer; readers aggregate.

Transcript-aware skills use the native task reader first. They inspect a local transcript only when the exact thread id is known and the matching file under `${CODEX_HOME:-$HOME/.codex}/sessions/` supplies missing evidence. They stop rather than broadening the search. The worktree audit intentionally omits transcript scanning because Codex sessions are not partitioned by repository.

The GitHub PR watcher retains support for Cursor Bugbot automation markers because those comments can exist on a PR regardless of the local agent harness. This is source compatibility, not a runtime dependency.

## Pending upstream mappings

- `73f8be4` `pstack/skills/{how,make-bot-ui,typescript-best-practices,unslop,why}/SKILL.md`: Cursor `disable-model-invocation`. Codex has no equivalent skill switch. Retained: existing `name` and `description` frontmatter only. `make-bot-ui` is not in this port.
- `23a56e2` `pstack/skills/typescript-best-practices/SKILL.md`: Cursor `paths: ["**/*.ts", "**/*.tsx"]`. Codex skill frontmatter has no path-scoped invocation. Retained: the TypeScript rule prose, including schemas-before-guards.
