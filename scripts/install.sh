#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-AlexCyln/Acode-kit}"
REF="${REF:-main}"
SKILL_PATH="${SKILL_PATH:-Acode-kit}"
AGENT="${AGENT:-auto}"
SCOPE="${SCOPE:-user}"
CODEX_ROOT_DEFAULT="${CODEX_HOME:-$HOME/.codex}/skills"
CLAUDE_ROOT_DEFAULT="${CLAUDE_HOME:-$HOME/.claude}"
LOCAL_ROOT_DEFAULT="${PWD}/agent-skills"
DEST_ROOT="${DEST_ROOT:-}"

exists() {
  [[ -e "$1" ]]
}

detect_agent() {
  local has_codex="false"
  local has_claude="false"

  if exists "${CODEX_HOME:-$HOME/.codex}" || exists "${CODEX_HOME:-$HOME/.codex}/skills"; then
    has_codex="true"
  fi
  if exists "${CLAUDE_HOME:-$HOME/.claude}" || exists "${CLAUDE_HOME:-$HOME/.claude}/agents"; then
    has_claude="true"
  fi

  if [[ "$has_codex" == "true" && "$has_claude" == "true" ]]; then
    echo "both"
  elif [[ "$has_codex" == "true" ]]; then
    echo "codex"
  elif [[ "$has_claude" == "true" ]]; then
    echo "claude"
  else
    echo "local"
  fi
}

resolve_dest_root() {
  local agent="$1"
  if [[ -n "$DEST_ROOT" ]]; then
    echo "$DEST_ROOT"
    return
  fi

  case "$agent" in
    codex) echo "$CODEX_ROOT_DEFAULT" ;;
    claude)
      if [[ "$SCOPE" == "project" ]]; then
        echo "${PWD}/.claude"
      else
        echo "$CLAUDE_ROOT_DEFAULT"
      fi
      ;;
    local) echo "$LOCAL_ROOT_DEFAULT" ;;
    *)
      echo "Unsupported agent: $agent" >&2
      exit 1
      ;;
  esac
}

copy_claude_adapter() {
  local source_dir="$1"
  local dest_root="$2"
  local adapter_file="$source_dir/integrations/claude/acode-kit.md"
  local router_adapter_file="$source_dir/integrations/claude/acode-run.md"
  local init_adapter_file="$source_dir/integrations/claude/acode-init.md"

  if [[ ! -f "$adapter_file" ]]; then
    echo "Claude adapter not found at $adapter_file" >&2
    exit 1
  fi

  mkdir -p "$dest_root/agents"
  cp "$adapter_file" "$dest_root/agents/acode-kit.md"
  if [[ -f "$router_adapter_file" ]]; then
    cp "$router_adapter_file" "$dest_root/agents/acode-run.md"
  fi
  if [[ -f "$init_adapter_file" ]]; then
    cp "$init_adapter_file" "$dest_root/agents/acode-init.md"
  fi
}

install_agent() {
  local source_dir="$1"
  local agent="$2"
  local dest_root
  dest_root="$(resolve_dest_root "$agent")"
  local skill_name
  skill_name="$(basename "$source_dir")"
  local target_dir="$dest_root/$skill_name"
  local repo_root
  repo_root="$(cd "$(dirname "$source_dir")" && pwd)"

  mkdir -p "$dest_root"
  rm -rf "$target_dir"
  cp -R "$source_dir" "$target_dir"
  if [[ -d "$repo_root/scripts" ]]; then
    rm -rf "$target_dir/scripts"
    cp -R "$repo_root/scripts" "$target_dir/scripts"
  fi

  case "$agent" in
    codex)
      echo "Installed Codex skill to $target_dir"
      ;;
    claude)
      copy_claude_adapter "$source_dir" "$dest_root"
      echo "Installed Claude bundle to $target_dir"
      echo "Installed Claude subagent to $dest_root/agents/acode-kit.md"
      if [[ -f "$source_dir/integrations/claude/acode-run.md" ]]; then
        echo "Installed Claude unified entry to $dest_root/agents/acode-run.md"
      fi
      if [[ -f "$source_dir/integrations/claude/acode-init.md" ]]; then
        echo "Installed Claude init adapter to $dest_root/agents/acode-init.md"
      fi
      ;;
    local)
      mkdir -p "$dest_root/claude"
      if [[ -f "$source_dir/integrations/claude/acode-kit.md" ]]; then
        cp "$source_dir/integrations/claude/acode-kit.md" "$dest_root/claude/acode-kit.md"
        echo "Saved portable Claude adapter to $dest_root/claude/acode-kit.md"
      fi
      if [[ -f "$source_dir/integrations/claude/acode-run.md" ]]; then
        cp "$source_dir/integrations/claude/acode-run.md" "$dest_root/claude/acode-run.md"
        echo "Saved portable Claude unified entry to $dest_root/claude/acode-run.md"
      fi
      echo "Installed portable bundle to $target_dir"
      echo "Manual next step:"
      echo "- Codex: copy the Acode-kit folder into ~/.codex/skills/"
      echo "- Claude Code: copy the Acode-kit folder into ~/.claude/ and copy claude/acode-kit.md and claude/acode-run.md into ~/.claude/agents/"
      ;;
  esac
}

REQUESTED_AGENT="$AGENT"
if [[ "$AGENT" == "auto" ]]; then
  AGENT="$(detect_agent)"
fi

if [[ ! "$AGENT" =~ ^(codex|claude|local|both)$ ]]; then
  echo "Unsupported AGENT=$AGENT. Use codex, claude, local, both, or auto." >&2
  exit 1
fi

if [[ ! "$SCOPE" =~ ^(user|project)$ ]]; then
  echo "Unsupported SCOPE=$SCOPE. Use user or project." >&2
  exit 1
fi

if [[ "$AGENT" == "both" ]]; then
  RESOLVED_DEST_INFO="codex=$(resolve_dest_root codex) | claude=$(resolve_dest_root claude)"
else
  RESOLVED_DEST_INFO="$(resolve_dest_root "$AGENT")"
fi

echo "Acode-kit installer"
echo "- requested agent: $REQUESTED_AGENT"
echo "- resolved agent: $AGENT"
echo "- scope: $SCOPE"
echo "- destination: $RESOLVED_DEST_INFO"
if [[ "$REQUESTED_AGENT" == "auto" ]]; then
  echo "- note: variables like AGENT=local must be passed to bash, not only to curl"
fi

TMP_DIR="$(mktemp -d)"
ARCHIVE_URL="https://codeload.github.com/${REPO}/tar.gz/refs/heads/${REF}"
ARCHIVE_FILE="$TMP_DIR/archive.tar.gz"
EXTRACT_DIR="$TMP_DIR/extract"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

mkdir -p "$EXTRACT_DIR"

echo "Downloading $ARCHIVE_URL"
curl -fsSL "$ARCHIVE_URL" -o "$ARCHIVE_FILE"
tar -xzf "$ARCHIVE_FILE" -C "$EXTRACT_DIR"

REPO_DIR="$(find "$EXTRACT_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
SOURCE_DIR="$REPO_DIR/$SKILL_PATH"

if [[ ! -f "$SOURCE_DIR/SKILL.md" ]]; then
  echo "Skill not found at $SKILL_PATH in $REPO@$REF" >&2
  exit 1
fi

if [[ "$AGENT" == "both" ]]; then
  install_agent "$SOURCE_DIR" codex
  install_agent "$SOURCE_DIR" claude
else
  install_agent "$SOURCE_DIR" "$AGENT"
fi

echo ""
echo "Restart your target AI agent after installation."
echo ""
echo "To complete first-time setup, open your AI agent and tell it:"
echo '  "acode-kit init"'
