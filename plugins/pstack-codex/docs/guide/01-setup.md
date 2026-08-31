# Set up pstack

In this page you install the plugin, confirm the required model, and run your
first task.

## Install the plugin

In a Codex session, run:

```text
codex plugin marketplace add theomilll/pstack-codex
codex plugin add pstack-codex@pstack-codex
```

Codex confirms the plugin is installed. Skills invoke explicitly as `$poteto-mode`. The `$` is only needed when you want to force a specific skill instead of letting routing happen implicitly.

## Confirm the model

Run:

```text
$setup-pstack
```

[`$setup-pstack`](../../skills/setup-pstack/SKILL.md) confirms that
`gpt-5.6-sol` is available. Every parent task and subagent uses that model. If
the host does not expose it, setup stops instead of substituting another model.

## Accept the verification offer, or don't

At the end of setup, `$setup-pstack` looks for a way to prove app behavior in your project, either a `verify-*` skill or an existing harness. If it finds neither, it offers once to generate one with [`$create-verification-skill`](../../skills/create-verification-skill/SKILL.md).

Say yes and it writes `.agents/skills/verify-<app>/`, a project-local skill that teaches subagents to drive your app the way a user does. It proves the skill works once before handing it over. Say no and setup moves on. You can run `$create-verification-skill` yourself any time. [Verify and ship](./06-verify-and-ship.md#create-a-project-verification-skill) covers when it earns its place.

After setup, start a new task.

## Run your first task

Pick something real but small, and describe it the way you'd describe it to a colleague:

```text
$poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.
```

Watch the todo list. The first item is always "read the Principles section". The rest are the matched playbook's steps copied in, the Feature playbook for this prompt. If `$poteto-mode` skips a step, the step stays in the list with `skip: <reason>`, so you can see what it chose not to do.

From here you can type normal follow-ups. `$poteto-mode` is sticky. It stays on for the task until you opt out by saying so.

Next: [Route work through `$poteto-mode`](./02-poteto-mode.md).
