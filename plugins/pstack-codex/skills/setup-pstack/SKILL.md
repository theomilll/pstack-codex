---
name: setup-pstack
description: Verify that gpt-5.6-sol is available for pstack-codex. Use for `$setup-pstack`, "configure pstack", or checking pstack's Codex model requirement.
---

# Setup pstack

pstack-codex uses `gpt-5.6-sol` for every parent task and subagent. It has no
per-role model choices and never substitutes another model.

## Steps

### 1. Check availability

Read the models exposed by the current Codex host. Confirm that
`gpt-5.6-sol` is available with the reasoning effort needed for the task.

If the model is unavailable, stop and report the missing requirement. Do not
fall back to another model or silently inherit a parent running another model.

### 2. Check stale configuration

Look for `${CODEX_HOME:-$HOME/.codex}/pstack-codex/models.md`. This port no
longer uses per-role model configuration. If the file exists, explain that it
is obsolete and ask before deleting it because it is user-owned state.

Do not edit `~/.codex/config.toml`, project agent profiles, or any other global
Codex configuration.

### 3. Confirm

Tell the user that pstack-codex is ready and that every role uses
`gpt-5.6-sol`.

### 4. Offer a verification skill

Check whether the project has a way to drive the real app for proof, such as a
`verify-*` skill or an existing harness. If it does not, offer once to create a
project-local verification skill with `$create-verification-skill`. Move on if
the user declines.
