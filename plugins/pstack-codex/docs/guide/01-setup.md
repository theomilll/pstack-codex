# Set up pstack

In this page you install the plugin, optionally check readiness, and run your
first task.

## Install the plugin

In a Codex session, run:

```text
codex plugin marketplace add theomilll/pstack-codex
codex plugin add pstack-codex@pstack-codex
```

Codex confirms the plugin is installed. Skills invoke explicitly as `$poteto-mode`. The `$` is only needed when you want to force a specific skill instead of letting routing happen implicitly.

## Optionally check readiness

You can start using the skills immediately after installation. For a readiness
check, run:

```text
$setup-pstack
```

[`$setup-pstack`](../../skills/setup-pstack/SKILL.md) checks that Codex can
discover the skills and that tools relevant to your task are available. It does
not select a model, check model availability, or write global configuration.

Choose your model and reasoning effort in Codex. PStack uses inherited settings
without adding role configuration; existing Codex agent defaults remain under
your control.

## Accept the verification offer, or don't

At the end of setup, `$setup-pstack` looks for a way to prove app behavior in your project, either a `verify-*` skill or an existing harness. If it finds neither, it offers once to generate one with [`$create-verification-skill`](../../skills/create-verification-skill/SKILL.md).

Say yes and it writes `.agents/skills/verify-<app>/`, a project-local skill that teaches subagents to drive your app the way a user does. It proves the skill works once before handing it over. Say no and setup moves on. You can run `$create-verification-skill` yourself any time. [Verify and ship](./06-verify-and-ship.md#create-a-project-verification-skill) covers when it earns its place.

After installation or an update, a new task may be needed for Codex to load the
changed skills. Setup itself is not a prerequisite for your first task.

## Run your first task

Pick something real but small, and describe it the way you'd describe it to a colleague:

```text
$poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.
```

Watch the todo list. Its first items are the matched playbook's steps copied in, the Feature playbook for this prompt. If `$poteto-mode` skips a step, the step stays in the list with `skip: <reason>`, so you can see what it chose not to do.

From here you can type normal follow-ups. `$poteto-mode` is sticky. It stays on for the task until you opt out by saying so.

Next: [Route work through `$poteto-mode`](./02-poteto-mode.md).
