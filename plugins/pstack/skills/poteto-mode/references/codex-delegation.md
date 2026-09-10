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

## Inherit Codex settings

Use the model and reasoning effort selected for the parent task. Omit model
and reasoning overrides when spawning children. Use ordinary subagents with
role-specific briefs, not custom agent presets that change those settings.
PStack does not choose models, probe availability, or maintain a role-to-model
configuration. Existing host-level agent defaults remain controlled by Codex
and the user; this plugin does not edit them.

An independent review needs a fresh context and a self-contained brief, not
a different model. Keep the implementer's conclusions out of a verifier's
brief so it can check the artifact against the acceptance criteria itself.
When concurrency capacity is exhausted, schedule additional waves as slots
become available. If subagents are unavailable, run the bounded passes locally
and disclose the loss of independent review. Never claim
a separate verifier ran when it did not.

## Steering and synthesis

- Continue or steer a running child through Codex's native task controls.
- Do not trust a child's summary alone. Read its artifact, diff, or evidence.
- A second opinion is the same bounded brief in a fresh context.
- If a lane stalls or drifts, replace it with a fresh bounded lane instead of
  stacking vague follow-ups.
