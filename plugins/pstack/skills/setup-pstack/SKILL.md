---
name: setup-pstack
description: Check PStack skill discovery and the tools needed for a project's workflow. Use for `$setup-pstack`, "configure pstack", or troubleshooting PStack readiness in Codex.
---

# Setup pstack

This is an optional readiness check. PStack works with the selected Codex
model and reasoning effort and has no model setup step. Do not enumerate
models, request role assignments, or change Codex configuration.

## Check readiness

1. Confirm that `poteto-mode` and the skills relevant to the user's task are
   discoverable through the current host. If they are missing, report which
   skills are missing and check the plugin's installation status using the
   available Codex plugin controls. Do not claim the plugin is ready merely
   because this file is readable. After an install or update, a new task may
   be needed to load the changed skills.
2. Inspect the project's instructions and existing verification entry points.
   Identify the command or `verify-*` skill that exercises the real surface.
   If none exists, offer `$create-verification-skill` once. Its absence does
   not block work that can be verified directly.
3. Check only capabilities needed for the requested workflow. Subagent tools
   matter for independent review; browser or computer-use tools matter for
   UI verification; Bun matters for the bundled helpers; a forge CLI matters
   for PR operations. A missing optional tool is a limitation for that
   workflow, not a reason to block all PStack skills. Use a supported
   alternative when available and describe any verification gap.
4. Summarize what is ready, the relevant missing capabilities, and the next
   useful workflow. If no project or task is selected, confirm skill
   discovery and leave project-specific checks until they are relevant.

## Existing installations

Older ports used a PStack model file or required a particular model. Neither
is used now. Do not read, create, migrate, or delete that obsolete state as a
prerequisite to setup. Leave user-owned files and global Codex settings alone.
