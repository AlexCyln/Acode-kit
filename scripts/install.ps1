#!/usr/bin/env pwsh
$ErrorActionPreference = "Stop"

$REPO = if ($env:REPO) { $env:REPO } else { "AlexCyln/Acode-kit-Plus" }
$REF = if ($env:REF) { $env:REF } else { "main" }
$SKILL_PATH = if ($env:SKILL_PATH) { $env:SKILL_PATH } else { "Acode-kit" }
$AGENT = if ($env:AGENT) { $env:AGENT } else { "auto" }
$SCOPE = if ($env:SCOPE) { $env:SCOPE } else { "user" }
$CODEX_ROOT_DEFAULT = if ($env:CODEX_HOME) { Join-Path $env:CODEX_HOME "skills" } else { Join-Path $HOME ".codex\skills" }
$CLAUDE_ROOT_DEFAULT = if ($env:CLAUDE_HOME) { $env:CLAUDE_HOME } else { Join-Path $HOME ".claude" }
$LOCAL_ROOT_DEFAULT = Join-Path (Get-Location).Path "agent-skills"
$DEST_ROOT = if ($env:DEST_ROOT) { $env:DEST_ROOT } else { "" }

function Test-PathExists {
  param([string]$TargetPath)
  return Test-Path -LiteralPath $TargetPath
}

function Detect-Agent {
  $codexBase = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
  $claudeBase = if ($env:CLAUDE_HOME) { $env:CLAUDE_HOME } else { Join-Path $HOME ".claude" }

  $hasCodex = (Test-PathExists $codexBase) -or (Test-PathExists (Join-Path $codexBase "skills"))
  $hasClaude = (Test-PathExists $claudeBase) -or (Test-PathExists (Join-Path $claudeBase "agents"))

  if ($hasCodex -and $hasClaude) { return "both" }
  if ($hasCodex) { return "codex" }
  if ($hasClaude) { return "claude" }
  return "local"
}

function Resolve-DestRoot {
  param([string]$AgentName)

  if ($DEST_ROOT -ne "") { return $DEST_ROOT }

  switch ($AgentName) {
    "codex" { return $CODEX_ROOT_DEFAULT }
    "claude" {
      if ($SCOPE -eq "project") {
        return Join-Path (Get-Location).Path ".claude"
      }
      return $CLAUDE_ROOT_DEFAULT
    }
    "local" { return $LOCAL_ROOT_DEFAULT }
    default { throw "Unsupported agent: $AgentName" }
  }
}

function Copy-ClaudeAdapter {
  param(
    [string]$SourceDir,
    [string]$DestRoot
  )
  $adapterFile = Join-Path $SourceDir "integrations\claude\acode-kit.md"
  $routerAdapterFile = Join-Path $SourceDir "integrations\claude\acode-run.md"
  if (-not (Test-PathExists $adapterFile)) {
    throw "Claude adapter not found at $adapterFile"
  }

  $agentsDir = Join-Path $DestRoot "agents"
  New-Item -ItemType Directory -Path $agentsDir -Force | Out-Null
  Copy-Item -LiteralPath $adapterFile -Destination (Join-Path $agentsDir "acode-kit.md") -Force
  if (Test-PathExists $routerAdapterFile) {
    Copy-Item -LiteralPath $routerAdapterFile -Destination (Join-Path $agentsDir "acode-run.md") -Force
  }
}

function Install-Agent {
  param(
    [string]$SourceDir,
    [string]$AgentName
  )

  $destRoot = Resolve-DestRoot $AgentName
  $skillName = Split-Path -Leaf $SourceDir
  $targetDir = Join-Path $destRoot $skillName
  $repoRoot = Split-Path -Parent $SourceDir
  $scriptsDir = Join-Path $repoRoot "scripts"
  $targetScriptsDir = Join-Path $targetDir "scripts"

  New-Item -ItemType Directory -Path $destRoot -Force | Out-Null
  if (Test-PathExists $targetDir) {
    Remove-Item -LiteralPath $targetDir -Recurse -Force
  }
  Copy-Item -LiteralPath $SourceDir -Destination $targetDir -Recurse -Force
  $script:LAST_BUNDLE_DIR = $targetDir
  if (Test-PathExists $scriptsDir) {
    if (Test-PathExists $targetScriptsDir) {
      Remove-Item -LiteralPath $targetScriptsDir -Recurse -Force
    }
    Copy-Item -LiteralPath $scriptsDir -Destination $targetScriptsDir -Recurse -Force
  }

  switch ($AgentName) {
    "codex" {
      Write-Host "Installed Codex skill to $targetDir"
    }
    "claude" {
      Copy-ClaudeAdapter -SourceDir $SourceDir -DestRoot $destRoot
      Write-Host "Installed Claude bundle to $targetDir"
      Write-Host "Installed Claude subagent to $(Join-Path $destRoot 'agents\acode-kit.md')"
      if (Test-PathExists (Join-Path $SourceDir "integrations\claude\acode-run.md")) {
        Write-Host "Installed Claude unified entry to $(Join-Path $destRoot 'agents\acode-run.md')"
      }
    }
    "local" {
      $portableClaudeDir = Join-Path $destRoot "claude"
      New-Item -ItemType Directory -Path $portableClaudeDir -Force | Out-Null
      $adapterPath = Join-Path $SourceDir "integrations\claude\acode-kit.md"
      $routerAdapterPath = Join-Path $SourceDir "integrations\claude\acode-run.md"
      if (Test-PathExists $adapterPath) {
        Copy-Item -LiteralPath $adapterPath -Destination (Join-Path $portableClaudeDir "acode-kit.md") -Force
        Write-Host "Saved portable Claude adapter to $(Join-Path $portableClaudeDir 'acode-kit.md')"
      }
      if (Test-PathExists $routerAdapterPath) {
        Copy-Item -LiteralPath $routerAdapterPath -Destination (Join-Path $portableClaudeDir "acode-run.md") -Force
        Write-Host "Saved portable Claude unified entry to $(Join-Path $portableClaudeDir 'acode-run.md')"
      }
      Write-Host "Installed portable bundle to $targetDir"
      Write-Host "Manual next step:"
      Write-Host "- Codex: copy the Acode-kit folder into `$HOME\.codex\skills\"
      Write-Host "- Claude Code: copy the Acode-kit folder into `$HOME\.claude\ and copy claude\acode-kit.md and claude\acode-run.md into `$HOME\.claude\agents\"
    }
  }
}

$LAST_BUNDLE_DIR = ""

$REQUESTED_AGENT = $AGENT
if ($AGENT -eq "auto") {
  $AGENT = Detect-Agent
}

if ($AGENT -notin @("codex", "claude", "local", "both")) {
  throw "Unsupported AGENT=$AGENT. Use codex, claude, local, both, or auto."
}

if ($SCOPE -notin @("user", "project")) {
  throw "Unsupported SCOPE=$SCOPE. Use user or project."
}

if ($AGENT -eq "both") {
  $resolvedDestInfo = "codex=$(Resolve-DestRoot 'codex') | claude=$(Resolve-DestRoot 'claude')"
} else {
  $resolvedDestInfo = Resolve-DestRoot $AGENT
}

Write-Host "Acode-kit installer"
Write-Host "- requested agent: $REQUESTED_AGENT"
Write-Host "- resolved agent: $AGENT"
Write-Host "- scope: $SCOPE"
Write-Host "- destination: $resolvedDestInfo"
if ($REQUESTED_AGENT -eq "auto") {
  Write-Host "- note: for env options set AGENT/SCOPE/DEST_ROOT before invoking this script"
}

$tmpDir = Join-Path ([System.IO.Path]::GetTempPath()) ("acode-kit-" + [guid]::NewGuid().ToString("N"))
$archiveFile = Join-Path $tmpDir "archive.tar.gz"
$extractDir = Join-Path $tmpDir "extract"

New-Item -ItemType Directory -Path $extractDir -Force | Out-Null

try {
  $archiveUrl = "https://codeload.github.com/$REPO/tar.gz/refs/heads/$REF"
  Write-Host "Downloading $archiveUrl"
  Invoke-WebRequest -Uri $archiveUrl -OutFile $archiveFile
  tar -xzf $archiveFile -C $extractDir

  $repoDir = Get-ChildItem -LiteralPath $extractDir -Directory | Select-Object -First 1
  if (-not $repoDir) {
    throw "Failed to find extracted repository folder in $extractDir"
  }

  $sourceDir = Join-Path $repoDir.FullName $SKILL_PATH
  if (-not (Test-PathExists (Join-Path $sourceDir "SKILL.md"))) {
    throw "Skill not found at $SKILL_PATH in $REPO@$REF"
  }

  if ($AGENT -eq "both") {
    Install-Agent -SourceDir $sourceDir -AgentName "codex"
    Install-Agent -SourceDir $sourceDir -AgentName "claude"
  } else {
    Install-Agent -SourceDir $sourceDir -AgentName $AGENT
  }

  Write-Host ""
  Write-Host "Restart your target AI agent after installation."
  Write-Host ""
  Write-Host "To complete first-time setup, run this in your terminal:"
  Write-Host "  node $LAST_BUNDLE_DIR\scripts\acode-kit-init.mjs"
} finally {
  if (Test-PathExists $tmpDir) {
    Remove-Item -LiteralPath $tmpDir -Recurse -Force
  }
}
