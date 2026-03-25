import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function toKebabCase(input) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

export function readJson(filePath) {
  return JSON.parse(read(filePath));
}

export function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

export function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(source, target, { recursive: true });
}

export function createGeneratedManifest(id, type, entryName) {
  return {
    id,
    type,
    entry: `Acode-kit/extensions/packs/${id}/${entryName}`,
    description: `Imported third-party ${type} extension: ${id}.`,
    triggers: [],
    load_at: ["Step 5e"],
    priority: 50,
    mode: type === "skill" ? "delegated-capability" : "reference-only",
    requires: {}
  };
}

function listMarkdownFiles(dirPath) {
  return fs.readdirSync(dirPath)
    .filter((name) => name.toLowerCase().endsWith(".md"))
    .map((name) => path.join(dirPath, name))
    .filter((filePath) => path.basename(filePath) !== "manifest.json");
}

export function resolveExtensionSource(repoRoot, inputPath) {
  const absoluteInput = path.resolve(repoRoot, inputPath);
  if (!fs.existsSync(absoluteInput)) {
    throw new Error(`Path does not exist: ${inputPath}`);
  }

  const stat = fs.statSync(absoluteInput);
  if (stat.isFile()) {
    if (!absoluteInput.toLowerCase().endsWith(".md")) {
      throw new Error("Single-file extension source must be a .md file.");
    }
    const id = toKebabCase(path.basename(absoluteInput, path.extname(absoluteInput)));
    return {
      kind: "single-markdown",
      absoluteInput,
      id,
      type: "markdown",
      entryName: path.basename(absoluteInput)
    };
  }

  const manifestPath = path.join(absoluteInput, "manifest.json");
  if (fs.existsSync(manifestPath)) {
    const manifest = readJson(manifestPath);
    return {
      kind: "pack-with-manifest",
      absoluteInput,
      id: manifest.id,
      type: manifest.type,
      entryName: path.basename(manifest.entry || ""),
      manifestPath
    };
  }

  const skillPath = path.join(absoluteInput, "SKILL.md");
  if (fs.existsSync(skillPath)) {
    const id = toKebabCase(path.basename(absoluteInput));
    return {
      kind: "pack-with-skill",
      absoluteInput,
      id,
      type: "skill",
      entryName: "SKILL.md"
    };
  }

  const markdownFiles = listMarkdownFiles(absoluteInput);
  if (markdownFiles.length === 1) {
    const id = toKebabCase(path.basename(absoluteInput));
    return {
      kind: "pack-with-markdown",
      absoluteInput,
      id,
      type: "markdown",
      entryName: path.basename(markdownFiles[0])
    };
  }

  throw new Error("Unsupported extension source. Provide a .md file, a folder with SKILL.md, a folder with one .md file, or a folder with manifest.json.");
}

export function createScanReadyPack(repoRoot, sourceInfo) {
  if (sourceInfo.kind === "pack-with-manifest") {
    return {
      manifestPath: sourceInfo.manifestPath,
      tempDir: null,
      id: sourceInfo.id,
      type: sourceInfo.type
    };
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "acode-ext-stage-"));
  const packDir = path.join(tempDir, sourceInfo.id);
  fs.mkdirSync(packDir, { recursive: true });

  if (sourceInfo.kind === "single-markdown") {
    fs.copyFileSync(sourceInfo.absoluteInput, path.join(packDir, sourceInfo.entryName));
  } else {
    copyDir(sourceInfo.absoluteInput, packDir);
  }

  const manifest = createGeneratedManifest(sourceInfo.id, sourceInfo.type, sourceInfo.entryName);
  manifest.entry = sourceInfo.entryName;
  const manifestPath = path.join(packDir, "manifest.json");
  writeJson(manifestPath, manifest);

  return {
    manifestPath,
    tempDir,
    id: sourceInfo.id,
    type: sourceInfo.type
  };
}

export function installPreparedPack(repoRoot, sourceInfo, prepared) {
  const targetDir = path.join(repoRoot, "Acode-kit", "extensions", "packs", sourceInfo.id);
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(targetDir), { recursive: true });

  if (prepared.tempDir) {
    copyDir(path.dirname(prepared.manifestPath), targetDir);
  } else {
    copyDir(sourceInfo.absoluteInput, targetDir);
  }

  const manifestPath = path.join(targetDir, "manifest.json");
  const manifest = readJson(manifestPath);
  manifest.entry = `Acode-kit/extensions/packs/${manifest.id}/${path.basename(manifest.entry)}`;
  writeJson(manifestPath, manifest);

  return { targetDir, manifest };
}

export function updateExtensionsIndex(repoRoot, manifest) {
  const indexPath = path.join(repoRoot, "Acode-kit", "extensions", "registry", "EXTENSIONS_INDEX.md");
  let content = read(indexPath);
  const row = `| \`${manifest.id}\` | ${manifest.type} | \`${manifest.mode}\` | ${manifest.load_at.join(", ")} | pass | ${manifest.description} |`;

  const rowPattern = new RegExp(`^\\|\\s*\`${manifest.id.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\`\\s*\\|.*$`, "m");
  if (rowPattern.test(content)) {
    content = content.replace(rowPattern, row);
  } else {
    content = content.replace("\n## Index rules", `\n${row}\n\n## Index rules`);
  }
  fs.writeFileSync(indexPath, content, "utf8");
}

export function removeFromExtensionsIndex(repoRoot, id) {
  const indexPath = path.join(repoRoot, "Acode-kit", "extensions", "registry", "EXTENSIONS_INDEX.md");
  let content = read(indexPath);
  const rowPattern = new RegExp(`^\\|\\s*\`${id.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\`\\s*\\|.*\\n?`, "m");
  content = content.replace(rowPattern, "");
  fs.writeFileSync(indexPath, content, "utf8");
}

export function parseProjectExtensions(projectExtensionsPath) {
  if (!fs.existsSync(projectExtensionsPath)) return [];
  const lines = read(projectExtensionsPath).split("\n");
  return lines
    .filter((line) => line.trim().startsWith("| `"))
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter((parts) => parts.length >= 8)
    .map((parts) => ({
      id: parts[1].replace(/`/g, ""),
      type: parts[2],
      mode: parts[3],
      nodes: parts[4],
      reason: parts[5],
      security: parts[6],
      status: parts[7]
    }))
    .filter((item) => item.id);
}

export function findInitializedProjects(rootDir, maxDepth = 4) {
  const results = [];
  const ignored = new Set([
    ".git",
    "node_modules",
    ".idea",
    ".vscode",
    "dist",
    "build",
    "AppData",
    "Application Data",
    "Local Settings",
    "Program Files",
    "Program Files (x86)",
    "ProgramData",
    "$Recycle.Bin",
    "System Volume Information"
  ]);

  function shouldIgnoreError(error) {
    return ["EPERM", "EACCES", "EBUSY", "ENOTDIR", "UNKNOWN"].includes(error?.code);
  }

  function walk(current, depth) {
    if (depth > maxDepth) return;
    const statusPath = path.join(current, ".acode-kit-initialized.json");
    if (fs.existsSync(statusPath)) {
      results.push(current);
    }

    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (error) {
      if (shouldIgnoreError(error)) return;
      throw error;
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || ignored.has(entry.name)) continue;
      walk(path.join(current, entry.name), depth + 1);
    }
  }

  walk(rootDir, 0);
  return results;
}
