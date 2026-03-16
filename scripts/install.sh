#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-AlexCyln/Acode-kit}"
REF="${REF:-main}"
SKILL_PATH="${SKILL_PATH:-Acode-kit}"
CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
DEST_ROOT="${DEST_ROOT:-$CODEX_HOME_DIR/skills}"
SKILL_NAME="${SKILL_NAME:-$(basename "$SKILL_PATH")}"

TMP_DIR="$(mktemp -d)"
ARCHIVE_URL="https://codeload.github.com/${REPO}/tar.gz/refs/heads/${REF}"
ARCHIVE_FILE="$TMP_DIR/archive.tar.gz"
EXTRACT_DIR="$TMP_DIR/extract"
TARGET_DIR="$DEST_ROOT/$SKILL_NAME"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

mkdir -p "$DEST_ROOT" "$EXTRACT_DIR"

echo "Downloading $ARCHIVE_URL"
curl -fsSL "$ARCHIVE_URL" -o "$ARCHIVE_FILE"
tar -xzf "$ARCHIVE_FILE" -C "$EXTRACT_DIR"

REPO_DIR="$(find "$EXTRACT_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
SOURCE_DIR="$REPO_DIR/$SKILL_PATH"

if [[ ! -f "$SOURCE_DIR/SKILL.md" ]]; then
  echo "Skill not found at $SKILL_PATH in $REPO@$REF" >&2
  exit 1
fi

rm -rf "$TARGET_DIR"
cp -R "$SOURCE_DIR" "$TARGET_DIR"

echo "Installed to $TARGET_DIR"
echo "Restart Codex to pick up the new skill."
