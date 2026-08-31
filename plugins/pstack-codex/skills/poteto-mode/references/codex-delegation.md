# Codex delegation contract

Use this reference whenever a pstack skill fans work out to Codex subagents.

## Core rules

1. Codex owns subagent execution. The plugin does not install custom agents or
   depend on `.codex/agents`.
2. The parent owns the result. Children explore, implement, or verify one
   bounded slice. The parent reads their work and writes the final summary.
3. Read-only is a behavior contract unless the user already has a stronger
   read-only subagent preset. State the no-edit rule explicitly in the brief.
4. No two concurrent writers share one checkout. If two writers could touch the
   same tree, put each in its own git worktree.

## Brief shape

Every delegated brief should name:

- the exact goal
- the writable and forbidden paths
- the acceptance checks
- the artifacts to return
- whether the lane is read-only, writing, or verifying

Prefer file pointers over pasted dumps.

## Model policy

Use `gpt-5.6-sol` for every parent task and subagent. Select it explicitly when
the host permits model overrides. If it is unavailable, stop and report the
missing requirement. Do not substitute another model.

## Steering and synthesis

- Continue or steer a running child through Codex's native task controls.
- Do not trust a child's summary alone. Read its artifact, diff, or evidence.
- A second opinion is the same bounded brief in a fresh `gpt-5.6-sol` context.
- If a lane stalls or drifts, replace it with a fresh bounded lane instead of
  stacking vague follow-ups.
