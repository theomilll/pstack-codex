#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Scan shipped instructions and configuration, not historical upstream prose or
// these regression fixtures. These checks catch known regressions, not every
// possible natural-language directive. Domain/data/mental models are valid.
const root = resolve(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), ".."));
const sources = [join(root, "README.md"), join(root, "plugins/pstack-codex")];
const extensions = /\.(?:md|json|mjs|js|ts|sh|toml|ya?ml)$/;
const identifiers = /\bgpt[- ]?\d+(?:\.\d+)*(?:[- ][a-z][a-z0-9]*(?:[.-][a-z0-9]+)*)?/gi;
const runtimeRules = [
	[/\b(?:use|choose|select|assign|run|switch to)\s+(?:Claude\s+)?(?:Sonnet|Opus|Haiku|Gemini|Composer)\b[^.\n]{0,80}\b(?:model|agent|worker|review|reviews|reviewer|searching|search|coding|implementation|task|tasks)\b/i, "alternate-model routing"],
	[/\b(?:model|reasoning_effort|reasoningEffort|thinking)\s*["'`]?\s*[:=]\s*(?:["'`][^"'`]+["'`]|[a-z0-9_.-]+)/i, "explicit execution override"],
	[/--(?:model|reasoning-effort)\b/i, "explicit execution override"],
	[/\b(?:pstack-models?\.(?:md|json|toml|ya?ml)|model-to-task|role-to-model)\b/i, "role model configuration"],
	[/\|\s*`?(?:default model|model|model role|reasoning effort)`?\s*\|/i, "role execution settings table"],
	[/\b(?:fast,? cheap|cheap,? fast|different|multiple|diverse) models?\b|\b(?:cross-model|multi-model|model diversity)\b/i, "model routing"],
	[/\b(?:raise|increase|lower|set|adjust|override|change)\b[^.\n]{0,55}\b(?:reasoning effort|reasoning_effort)\b/i, "reasoning effort override"],
	[/\b(?:confirm|check|probe)\b[^.\n]{0,40}\bmodel availability\b|\b(?:enumerate|list)\s+(?:available\s+)?(?:Codex\s+)?models\b/i, "model availability gate"],
	[/\bmodel\b[^.\n]{0,40}\b(?:unavailable|not available)\b[^.\n]{0,30}\bstop\b/i, "model availability gate"],
];

function* files(path) {
	if (!existsSync(path)) return;
	if (path.endsWith("README.md")) { yield path; return; }
	for (const entry of readdirSync(path, { withFileTypes: true })) {
		if (entry.name === "node_modules" || entry.name === ".git") continue;
		const child = join(path, entry.name);
		if (entry.isDirectory()) yield* files(child);
		else if (extensions.test(entry.name)) yield child;
	}
}

function paragraphs(text) {
	const blocks = [];
	for (const [index, line] of text.split(/\r?\n/).entries()) {
		const previous = blocks.at(-1);
		if (previous && line.trim() && previous.text.trim() &&
			!/[.!?]$/.test(previous.text) && !/^\s*(?:#|[-*] |```|\|)/.test(line)) {
			previous.text += " " + line.trim();
		} else blocks.push({ line: index + 1, text: line });
	}
	return blocks;
}

let failures = 0;
for (const source of sources) for (const file of files(source)) {
	const name = relative(root, file);
	const contextDoc = name === "README.md" || name.startsWith("plugins/pstack-codex/docs/guide/");
	for (const { line, text } of paragraphs(readFileSync(file, "utf8"))) {
		// Explicit denials and migration history explain the policy rather than
		// configure it. Keep this exemption clause-local, so a later directive
		// on the same line is still inspected.
		for (const clause of text.split(/;|\.\s+/)) {
			const models = [...clause.matchAll(identifiers)].map(match => match[0]);
			const pinned = models.some(model => !(contextDoc && /^gpt-6 astra$/i.test(model)));
			const rule = runtimeRules.find(([pattern]) => {
				const match = pattern.exec(clause);
				if (!match) return false;
				const prefix = clause.slice(0, match.index).trim();
				return !/^(?:[-*] )?(?:do not|don't|never|omit|older ports used|(?:pstack|it|this port) does not)\b/i.test(prefix)
					&& !/^(?:no|not)$|\bnot a$/i.test(prefix);
			});
			if (!pinned && !rule) continue;
			console.error(`${name}:${line}: ${pinned ? "pinned model identifier" : rule[1]}: ${clause.trim()}`);
			failures++;
		}
	}
}
if (failures) process.exit(1);
console.log("check-model-policy: no known model-policy regressions found");
