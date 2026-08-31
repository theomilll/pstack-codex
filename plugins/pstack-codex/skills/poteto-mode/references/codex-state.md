# Codex state contract

## Plugin-owned state

Use `${CODEX_HOME:-$HOME/.codex}/pstack-codex/projects/<repo-fingerprint>/` as the durable
store. `docs/` holds plans and notes. `orchestrate/` holds queue state,
receipts, inbox files, and ledgers.

`<repo-fingerprint>` should be stable for one repository checkout family. The
git root plus remote URL is the preferred seed. When the repo is not a git
checkout, fall back to a stable hash of the canonical root path.

## Transcript policy

Prefer native task inspection. Read a local transcript only when the task id is
already known and you need missing context that is not visible in the task UI.

When you do read one:

1. Search only under `${CODEX_HOME:-$HOME/.codex}/sessions/`.
2. Match the exact current or named thread id, usually a filename ending in
   `-${CODEX_THREAD_ID}.jsonl`.
3. Verify the opening user message matches the task you are resuming.
4. Never glob unrelated sessions or infer a repo-wide slug.

## Wake policy

Use a Codex-native wake mechanism. In the app, prefer a heartbeat automation.
In CLI or bounded runs, use a watcher task that rechecks a concrete predicate.
The wake mechanism exists to re-evaluate a state change, not to replace a
finish condition.
