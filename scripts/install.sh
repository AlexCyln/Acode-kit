#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-AlexCyln/Acode-kit}"
REF="${REF:-main}"
SKILL_PATH="${SKILL_PATH:-Acode-kit}"
AGENT="${AGENT:-auto}"
SCOPE="${SCOPE:-user}"
SKIP_INIT="${SKIP_INIT:-false}"
CODEX_ROOT_DEFAULT="${CODEX_HOME:-$HOME/.codex}/skills"
LOCAL_ROOT_DEFAULT="${PWD}/agent-skills"
DEST_ROOT="${DEST_ROOT:-}"
TOTAL_STEPS=6
PATH_CONFIG_FILE=""
CURRENT_VERSION=""

exists() {
  [[ -e "$1" ]]
}

show_step() {
  local current="$1"
  local title="$2"
  local detail="${3:-}"
  printf "\n[%s/%s] %s\n" "$current" "$TOTAL_STEPS" "$title"
  if [[ -n "$detail" ]]; then
    printf "  %s\n" "$detail"
  fi
}

detect_agent() {
  echo "codex"
}

resolve_dest_root() {
  local agent="$1"
  if [[ -n "$DEST_ROOT" ]]; then
    echo "$DEST_ROOT"
    return
  fi

  case "$agent" in
    codex)
      if [[ "$SCOPE" == "project" ]]; then
        echo "${PWD}/.codex/skills"
      else
        echo "$CODEX_ROOT_DEFAULT"
      fi
      ;;
    local) echo "$LOCAL_ROOT_DEFAULT" ;;
    *)
      echo "Unsupported agent: $agent" >&2
      exit 1
      ;;
  esac
}

resolve_global_state_root() {
  local agent="$1"
  case "$agent" in
    codex) echo "${CODEX_HOME:-$HOME/.codex}/acode-kit" ;;
    *) echo "${LOCAL_ROOT_DEFAULT}/.acode-kit-state" ;;
  esac
}

resolve_command_bin_dir() {
  if [[ "$SCOPE" == "project" ]]; then
    echo "${PWD}/.acode-kit/bin"
  else
    echo "${HOME}/.acode-kit/bin"
  fi
}

resolve_shell_rc_file() {
  local shell_name
  shell_name="$(basename "${SHELL:-}")"
  local candidates=()

  case "$shell_name" in
    zsh) candidates=("${HOME}/.zshrc" "${HOME}/.zprofile" "${HOME}/.profile") ;;
    bash) candidates=("${HOME}/.bashrc" "${HOME}/.bash_profile" "${HOME}/.profile") ;;
    *) candidates=("${HOME}/.profile") ;;
  esac

  local rc_file=""
  for rc_file in "${candidates[@]}"; do
    if [[ -e "$rc_file" ]]; then
      if [[ -w "$rc_file" ]]; then
        echo "$rc_file"
        return 0
      fi
      continue
    fi

    local parent_dir
    parent_dir="$(dirname "$rc_file")"
    if [[ -w "$parent_dir" ]]; then
      echo "$rc_file"
      return 0
    fi
  done

  return 1
}

ensure_path_in_shell_rc() {
  local bin_dir="$1"
  local marker="# >>> acode-kit bin >>>"
  local export_line='export PATH="$HOME/.acode-kit/bin:$PATH"'
  local rc_file=""

  if rc_file="$(resolve_shell_rc_file)"; then
    touch "$rc_file"
    if ! grep -Fq "$marker" "$rc_file"; then
      {
        echo ""
        echo "$marker"
        echo "$export_line"
        echo "# <<< acode-kit bin <<<"
      } >> "$rc_file"
    fi
    PATH_CONFIG_FILE="$rc_file"
  else
    PATH_CONFIG_FILE=""
  fi

  case ":$PATH:" in
    *":$bin_dir:"*) ;;
    *) export PATH="$bin_dir:$PATH" ;;
  esac
}

install_command_launcher() {
  local bundle_dir="$1"
  local bin_dir
  bin_dir="$(resolve_command_bin_dir)"
  mkdir -p "$bin_dir"

  local cli_script="$bundle_dir/scripts/acode-kit.mjs"
  if [[ ! -f "$cli_script" ]]; then
    echo "CLI script not found at $cli_script" >&2
    exit 1
  fi

  cat > "$bin_dir/acode-kit" <<EOF
#!/usr/bin/env bash
node "$cli_script" "\$@"
EOF
  chmod +x "$bin_dir/acode-kit"

  if [[ "$SCOPE" == "user" ]]; then
    ensure_path_in_shell_rc "$bin_dir"
  fi

  echo "$bin_dir"
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
  LAST_BUNDLE_DIR="$target_dir"
  if [[ -d "$repo_root/scripts" ]]; then
    rm -rf "$target_dir/scripts"
    cp -R "$repo_root/scripts" "$target_dir/scripts"
  fi
  if [[ -f "$repo_root/VERSION" ]]; then
    cp "$repo_root/VERSION" "$target_dir/VERSION"
  fi

  case "$agent" in
    codex)
      echo "Installed Codex skill to $target_dir"
      ;;
    local)
      mkdir -p "$dest_root/codex"
      if [[ -f "$source_dir/integrations/codex/acode-kit.md" ]]; then
        cp "$source_dir/integrations/codex/acode-kit.md" "$dest_root/codex/acode-kit.md"
        echo "Saved portable Codex runtime guide to $dest_root/codex/acode-kit.md"
      fi
      if [[ -f "$source_dir/integrations/codex/acode-run.md" ]]; then
        cp "$source_dir/integrations/codex/acode-run.md" "$dest_root/codex/acode-run.md"
        echo "Saved portable Codex routing guide to $dest_root/codex/acode-run.md"
      fi
      echo "Installed portable bundle to $target_dir"
      echo "Manual next step:"
      echo "- Codex: copy the Acode-kit folder into ~/.codex/skills/ and use codex/*.md as runtime supplements if needed."
      ;;
  esac
}

run_init() {
  local bundle_dir="$1"
  local project_root="$2"
  local agent="$3"
  local init_script="$bundle_dir/scripts/acode-kit-init.mjs"

  if [[ ! -f "$init_script" ]]; then
    echo "Init script not found at expected location. Run manually:" >&2
    echo "  node $init_script --cwd $project_root" >&2
    return 1
  fi

  echo ""
  echo "Running initialization..."
  echo "========================"
  local init_args=(--cwd "$project_root" --force)
  if [[ "$agent" == "codex" ]]; then
    init_args+=(--provider "$agent")
  fi
  if [[ "$SCOPE" == "user" || "$SCOPE" == "project" ]]; then
    init_args+=(--yes)
  fi

  node "$init_script" "${init_args[@]}"
}

LAST_BUNDLE_DIR=""

REQUESTED_AGENT="$AGENT"
if [[ "$AGENT" == "auto" ]]; then
  AGENT="$(detect_agent)"
fi

if [[ ! "$AGENT" =~ ^(codex|local)$ ]]; then
  echo "Unsupported AGENT=$AGENT. Use codex, local, or auto." >&2
  exit 1
fi

if [[ ! "$SCOPE" =~ ^(user|project)$ ]]; then
  echo "Unsupported SCOPE=$SCOPE. Use user or project." >&2
  exit 1
fi

RESOLVED_DEST_INFO="$(resolve_dest_root "$AGENT")"

TMP_DIR="$(mktemp -d)"
ARCHIVE_URL="https://codeload.github.com/${REPO}/tar.gz/refs/heads/${REF}"
ARCHIVE_FILE="$TMP_DIR/archive.tar.gz"
EXTRACT_DIR="$TMP_DIR/extract"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

mkdir -p "$EXTRACT_DIR"

show_step 1 "Preparing install plan" "Resolving source, target agent, and destination paths."
show_step 2 "Downloading repository bundle" "$ARCHIVE_URL"
echo "Downloading $ARCHIVE_URL"
curl -fsSL "$ARCHIVE_URL" -o "$ARCHIVE_FILE"
show_step 3 "Extracting bundle" "Unpacking the downloaded archive into a temporary workspace."
tar -xzf "$ARCHIVE_FILE" -C "$EXTRACT_DIR"

REPO_DIR="$(find "$EXTRACT_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
SOURCE_DIR="$REPO_DIR/$SKILL_PATH"

if [[ ! -f "$SOURCE_DIR/SKILL.md" ]]; then
  echo "Skill not found at $SKILL_PATH in $REPO@$REF" >&2
  exit 1
fi

VERSION_FILE="$REPO_DIR/VERSION"
if [[ -f "$VERSION_FILE" ]]; then
  CURRENT_VERSION="$(tr -d '\r\n' < "$VERSION_FILE")"
fi

echo "Acode-kit installer"
if [[ -n "$CURRENT_VERSION" ]]; then
  echo "- version: $CURRENT_VERSION"
fi
echo "- requested agent: $REQUESTED_AGENT"
echo "- resolved agent: $AGENT"
echo "- scope: $SCOPE"
echo "- destination: $RESOLVED_DEST_INFO"
if [[ "$SCOPE" == "user" ]]; then
  echo "- note: user-level installs are intended to populate a persistent global MCP cache for future sessions"
fi
if [[ "$REQUESTED_AGENT" == "auto" ]]; then
  echo "- note: auto now defaults to Codex skill registration"
  echo "- note: use AGENT=local only if you explicitly want a portable non-registered bundle"
fi

show_step 4 "Installing bundle files" "Copying Acode-kit and adapters into the target runtime directories."
install_agent "$SOURCE_DIR" "$AGENT"

show_step 5 "Registering CLI launcher" "Creating the 'acode-kit' command entry point."
COMMAND_BIN_DIR="$(install_command_launcher "$LAST_BUNDLE_DIR")"

if [[ "$SKIP_INIT" != "true" ]]; then
  show_step 6 "Running initialization" "Refreshing MCP status and NotebookLM auth cache."
  case "$SCOPE" in
    user)
      run_init "$LAST_BUNDLE_DIR" "$(resolve_global_state_root "$AGENT")" "$AGENT" || true
      ;;
    project)
      run_init "$LAST_BUNDLE_DIR" "$PWD" "$AGENT" || true
      ;;
  esac
else
  show_step 6 "Skipping initialization" "SKIP_INIT=true was provided; initialization was intentionally skipped."
fi

echo ""
echo "Restart your target AI agent after installation."
if [[ "$SCOPE" == "user" ]]; then
  echo "A CLI launcher was installed to $COMMAND_BIN_DIR."
  if [[ -n "$PATH_CONFIG_FILE" ]]; then
    echo "Your PATH was updated in $PATH_CONFIG_FILE."
    echo "Open a new terminal if 'acode-kit' is not recognized immediately."
  else
    echo "The installer could not persist PATH automatically because no writable shell startup file was available."
    echo "Add this line to your shell config manually:"
    echo "  export PATH=\"\$HOME/.acode-kit/bin:\$PATH\""
  fi
else
  echo "A project-local CLI launcher was installed to $COMMAND_BIN_DIR"
  echo "Run it directly or add that directory to PATH for this project."
fi
echo ""
echo "Quick CLI flags after install:"
echo "  acode-kit -status"
echo "  acode-kit -add <path>"
echo "  acode-kit -scan <path>"
echo "  acode-kit -remove <name>"
echo "  acode-kit -help"
echo ""
if [[ "$SKIP_INIT" == "true" ]]; then
  echo "To complete first-time setup and populate the global cache, run this in your terminal:"
  echo "  node $LAST_BUNDLE_DIR/scripts/acode-kit-init.mjs"
else
  echo "Initialization finished and the global cache was synced for the user environment."
fi
