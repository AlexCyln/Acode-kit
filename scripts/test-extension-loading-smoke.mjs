#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(read(filePath));
}

function mustContain(haystack, needle, label) {
  assert.ok(haystack.includes(needle), `${label}: missing "${needle}"`);
}

function main() {
  const repoRoot = process.cwd();
  const registryIndex = read(
    path.join(repoRoot, "Acode-kit", "extensions", "registry", "EXTENSIONS_INDEX.md")
  );
  const manifestSpec = read(
    path.join(repoRoot, "Acode-kit", "extensions", "registry", "EXTENSION_MANIFEST_SPEC.md")
  );
  const loadingRules = read(
    path.join(repoRoot, "Acode-kit", "extensions", "registry", "EXTENSION_LOADING_RULES.md")
  );
  const activeStandards = read(
    path.join(repoRoot, "docs", "smoke-samples", "extension-activation", "ACTIVE_STANDARDS.md")
  );
  const projectExtensions = read(
    path.join(repoRoot, "docs", "smoke-samples", "extension-activation", "PROJECT_EXTENSIONS.md")
  );

  const frontendManifest = readJson(
    path.join(
      repoRoot,
      "Acode-kit",
      "extensions",
      "packs",
      "frontend-ux-review-pack",
      "manifest.json"
    )
  );
  const securityManifest = readJson(
    path.join(
      repoRoot,
      "Acode-kit",
      "extensions",
      "packs",
      "security-review-pack",
      "manifest.json"
    )
  );

  mustContain(manifestSpec, "Registration is not activation.", "manifest spec activation rule");
  mustContain(loadingRules, "determine current node", "loading rules decision order");
  mustContain(loadingRules, "delegated-capability", "loading rules delegated mode");
  mustContain(registryIndex, "frontend-ux-review-pack", "registry frontend entry");
  mustContain(registryIndex, "security-review-pack", "registry security entry");

  assert.equal(frontendManifest.type, "markdown", "frontend manifest type");
  assert.equal(frontendManifest.mode, "reference-only", "frontend manifest mode");
  assert.deepEqual(frontendManifest.load_at, ["Stage 2", "Step 5b", "Step 5e"], "frontend load nodes");

  assert.equal(securityManifest.type, "skill", "security manifest type");
  assert.equal(securityManifest.mode, "delegated-capability", "security manifest mode");
  assert.deepEqual(securityManifest.load_at, ["Step 5e", "Stage 6"], "security load nodes");

  mustContain(activeStandards, "frontend-ux-review-pack", "active standards frontend activation");
  mustContain(activeStandards, "security-review-pack", "active standards security activation");
  mustContain(activeStandards, "已激活扩展模块", "active standards extension section");
  mustContain(projectExtensions, "frontend-ux-review-pack", "project extensions frontend activation");
  mustContain(projectExtensions, "security-review-pack", "project extensions security activation");

  const currentNode = "Step 5e";
  const activated = ["frontend-ux-review-pack", "security-review-pack"];
  const matched = [frontendManifest, securityManifest]
    .filter((manifest) => activated.includes(manifest.id))
    .filter((manifest) => manifest.load_at.includes(currentNode))
    .sort((left, right) => right.priority - left.priority)
    .map((manifest) => manifest.id);

  assert.deepEqual(
    matched,
    ["security-review-pack", "frontend-ux-review-pack"],
    "step 5e extension activation order"
  );

  console.log("extension loading smoke passed");
}

main();
