#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
plugin="$root/plugins/pstack"
helpers="$plugin/skills/poteto-mode/scripts"
codex_home="${CODEX_HOME:-$HOME/.codex}"

fail() {
	printf 'verify-port: %s\n' "$1" >&2
	exit 1
}

count_files() {
	find "$1" "${@:2}" | wc -l | tr -d ' '
}

expect_count() {
	local label=$1 actual=$2 expected=$3
	[ "$actual" = "$expected" ] || fail "$label: expected $expected, found $actual"
}

python3 -m json.tool "$root/.agents/plugins/marketplace.json" >/dev/null
python3 -m json.tool "$plugin/.codex-plugin/plugin.json" >/dev/null
python3 -m json.tool "$plugin/hooks/hooks.json" >/dev/null

python3 - "$root" <<'PY'
import json
import sys
from pathlib import Path
import yaml

root = Path(sys.argv[1])
marketplace = json.loads((root / ".agents/plugins/marketplace.json").read_text())
manifest = json.loads((root / "plugins/pstack/.codex-plugin/plugin.json").read_text())
assert marketplace["name"] == "pstack-codex", "keep the existing marketplace identity"
assert len(marketplace["plugins"]) == 1, "expected one PStack plugin"
entry = marketplace["plugins"][0]
assert entry["name"] == manifest["name"] == "pstack", "skills must use the pstack: namespace"
assert entry["source"] == {"source": "local", "path": "./plugins/pstack"}
assert manifest["skills"] == "./skills/"
plugin = root / "plugins/pstack"
assert json.loads((plugin / "hooks/hooks.json").read_text()) == {"hooks": {}}, "PStack must not auto-activate through hooks"
for skill in (plugin / "skills").glob("*/SKILL.md"):
    metadata = yaml.safe_load((skill.parent / "agents/openai.yaml").read_text())
    assert metadata.get("policy", {}).get("allow_implicit_invocation") is False, f"{skill.parent.name} must require explicit invocation"
PY

expect_count skills "$(count_files "$plugin/skills" -mindepth 2 -maxdepth 2 -name SKILL.md)" 46
expect_count playbooks "$(count_files "$plugin/skills/poteto-mode/playbooks" -maxdepth 1 -type f -name '*.md')" 23
expect_count principles "$(count_files "$plugin/skills" -mindepth 1 -maxdepth 1 -type d -name 'principle-*')" 23
expect_count guides "$(count_files "$plugin/docs/guide" -type f)" 17
expect_count helpers "$(find "$helpers" -path '*/node_modules' -prune -o -type f -print | wc -l | tr -d ' ')" 20

plugin_validator="${PLUGIN_VALIDATOR:-$codex_home/skills/.system/plugin-creator/scripts/validate_plugin.py}"
skill_validator="${SKILL_VALIDATOR:-$codex_home/skills/.system/skill-creator/scripts/quick_validate.py}"

if [ -f "$plugin_validator" ]; then
	python3 "$plugin_validator" "$plugin"
else
	printf 'verify-port: official plugin validator not found; structural checks only\n' >&2
fi

if [ -f "$skill_validator" ]; then
	while IFS= read -r skill; do
		python3 "$skill_validator" "$(dirname "$skill")" >/dev/null
	done < <(find "$plugin/skills" -mindepth 2 -maxdepth 2 -name SKILL.md | sort)
else
	printf 'verify-port: official skill validator not found; structural checks only\n' >&2
fi

banned='(\.claude|claude code|subagent_type|SendMessage|AskUserQuestion|codex:codex-rescue|`fable`|`butter`|`grok`|claude --resume|claude mcp|/loop|/simplify|isolation:)'
if rg -n -i --glob '!**/node_modules/**' "$banned" "$plugin/skills" "$plugin/docs"; then
	fail 'Claude-only runtime contract remains in a skill or guide'
fi

if rg -n '(\.codex/skills|~/.codex/skills|^user-invocable:)' "$plugin/skills" "$plugin/docs"; then
	fail 'unsupported skill path or frontmatter remains'
fi

node --test "$root/scripts/check-model-policy.test.mjs" "$root/scripts/check-plan.test.mjs"
node "$root/scripts/check-model-policy.mjs" "$root"

bash -n "$helpers/worktree-audit.sh"

(
	cd "$helpers"
	bun install --frozen-lockfile
	bun test orch watch-pr
	bun run typecheck
)

printf 'verify-port: all checks passed\n'
