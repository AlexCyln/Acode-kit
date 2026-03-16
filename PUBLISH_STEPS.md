# Publish Steps

This document describes the public release workflow for the Acode-kit GitHub repository, including validation, GitHub publishing, distribution verification, and common operational concerns for a mature multi-agent skill package.

## 1. Release Targets

Current public release targets:

- GitHub repository: `AlexCyln/Acode-kit`
- GitHub HTTPS: `https://github.com/AlexCyln/Acode-kit.git`
- Supported environments: `Codex`, `Claude Code`, and `local portable install`

## 2. Installation Scenarios Covered

A public skill package should support all of these scenarios:

1. Users who already have Codex installed
2. Users who already have Claude Code installed
3. Users who have no agent installed yet and want to stage the package locally first

This repository now supports:

- Codex installation
- Claude installation
- Local portable installation
- Manual post-install integration into a target agent

## 3. Local Validation

### 3.1 Validate portable installation

```bash
cd /Users/alex/Documents/AlexFiles/Acode-kit_skill
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent local --dest-dir /tmp/agent-skills-test
```

Expected output:

```text
/tmp/agent-skills-test/Acode-kit
/tmp/agent-skills-test/claude/acode-kit.md
```

### 3.2 Validate Codex installation

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent codex --dest-dir /tmp/codex-skills
```

Expected output:

```text
/tmp/codex-skills/Acode-kit
```

### 3.3 Validate Claude installation

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent claude --dest-dir /tmp/claude-home
```

Expected output:

```text
/tmp/claude-home/Acode-kit
/tmp/claude-home/agents/acode-kit.md
```

## 4. Git Initialization and Commit

If the local repository is not initialized yet:

```bash
cd /Users/alex/Documents/AlexFiles/Acode-kit_skill
git init
```

Stage and commit the files:

```bash
git add .
git commit -m "feat: publish Acode-kit skill package"
```

## 5. Connect the GitHub Remote

```bash
git remote add origin https://github.com/AlexCyln/Acode-kit.git
```

If a remote already exists and needs updating:

```bash
git remote set-url origin https://github.com/AlexCyln/Acode-kit.git
```

Verify:

```bash
git remote -v
```

## 6. Push to GitHub

```bash
git branch -M main
git push -u origin main
```

If authentication is requested:

- complete the browser sign-in flow if prompted
- if terminal password auth fails, use a GitHub Personal Access Token instead of a standard password

## 7. Verify the GitHub Repository

Open:

- `https://github.com/AlexCyln/Acode-kit`

Confirm the repository contains:

- `Acode-kit/`
- `scripts/`
- `README.md`
- `PUBLISH_STEPS.md`
- `package.json`

Open `README.md` and confirm:

- both Chinese and English sections render correctly
- installation instructions include Codex, Claude, and local portable install
- repository URLs are correct

## 8. Verify Distribution Flows

### 8.1 Codex built-in skill installer

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit \
  --path Acode-kit
```

### 8.2 Bash auto installer

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

### 8.3 Claude install

```bash
AGENT=claude SCOPE=user curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

### 8.4 Local portable install

```bash
AGENT=local DEST_ROOT="$(pwd)/agent-skills" curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

## 9. Public Installation Instructions

### 9.1 Codex users

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit \
  --path Acode-kit
```

### 9.2 Claude Code users

```bash
AGENT=claude SCOPE=user curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

### 9.3 Users without an installed agent yet

```bash
AGENT=local DEST_ROOT="$(pwd)/agent-skills" curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

Manual follow-up:

- Codex: copy `agent-skills/Acode-kit` into `~/.codex/skills/Acode-kit`
- Claude:
  - copy `agent-skills/Acode-kit` into `~/.claude/Acode-kit`
  - copy `agent-skills/claude/acode-kit.md` into `~/.claude/agents/acode-kit.md`

## 10. Common Issues

### 1. Destination directory is not writable

Use `--dest-dir` or `DEST_ROOT` to install into a writable location.

### 2. No Codex or Claude installation exists yet

Use `AGENT=local` to stage the package in the current project directory.

### 3. An older version already exists

The installers overwrite the existing target directory. Stable naming and predictable paths are therefore important for each release.

### 4. The skill does not appear after install

Many agents require a restart or reload after installation.

### 5. GitHub download fails

Use a local source install instead:

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent local --dest-dir "$(pwd)/agent-skills"
```
