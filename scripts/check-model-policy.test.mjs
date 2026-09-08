import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { after, test } from "node:test";

const scanner = fileURLToPath(new URL("./check-model-policy.mjs", import.meta.url));
const dir = mkdtempSync(join(tmpdir(), "pstack-model-policy-"));
after(() => rmSync(dir, { recursive: true, force: true }));

function scan(text, path = "plugins/pstack-codex/skills/example/SKILL.md") {
	const root = mkdtempSync(join(dir, "case-"));
	const file = join(root, path);
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, text);
	const result = spawnSync(process.execPath, [scanner, root], { encoding: "utf8" });
	assert.ifError(result.error);
	return { status: result.status, output: result.stdout + result.stderr };
}

test("scanner rejects model pinning, task routing and effort overrides", () => {
	for (const text of [
		'Use gpt-5.6-sol for every task.',
		'Use gpt-5.6-sol with no file edits.',
		'Spawn with model: "fast" without changing files.',
		'Do not require gpt-5.6-sol.',
		'Spawn a reviewer with model: "custom-model".',
		'codex --model custom-model',
		'Assign reasoning_effort: "high".',
		'model: custom-model',
		'reasoning_effort: high',
		'Write pstack-models.md before starting.',
		'| Subagent | Default model |',
		'Spawn multiple models to review independently.',
		'Use Sonnet for searching and Opus for reviews.',
		'Choose Gemini for review tasks.',
		'Use Composer for implementation.',
		'Use a fast, cheap model for recall.',
		'The lead may raise the reasoning effort.',
		'Check model availability before work.',
		'If the model is unavailable, stop.',
		'Do not skip review; set reasoning effort to high.',
	]) {
		const result = scan(text);
		assert.equal(result.status, 1, `Accepted runtime policy ${text}\n${result.output}`);
	}
});

test("scanner permits inherited settings, domain models and negative policy explanations", () => {
	const result = scan(`Use the selected Codex model and reasoning effort.
Do not set model: "custom-model".
Omit model and reasoning_effort overrides.
No role-to-model configuration is needed.
PStack does not
check model availability or select a different model.
Older ports used pstack-models.md.
An independent review needs a fresh context, not a different model.
Model variants as discriminated unions.
Understand the data model and the mental model.
Read the dbt model from the warehouse.
Confirm the exact model name with SHOW TABLES.
Check the data model before changing the parser.
List the database models involved in this migration.
Use Composer for PHP dependencies.
Use Opus for audio encoding.
Model the domain before writing stateful logic.`);
	assert.equal(result.status, 0, result.output);
});

test("scanner ignores upstream history and allows an Astra example only in user guides", () => {
	assert.equal(scan("Use gpt-5.6-sol.", "README-UPSTREAM.md").status, 0);
	assert.equal(scan("Select your model in Codex, such as GPT-6 Astra.", "README.md").status, 0);
	assert.equal(scan("Select your model in Codex, such as GPT-6 Astra.", "plugins/pstack-codex/docs/guide/01-setup.md").status, 0);
	assert.equal(scan("Use GPT-6 Astra for this task.").status, 1);
});
