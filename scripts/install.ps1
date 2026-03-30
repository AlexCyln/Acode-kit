#!/usr/bin/env pwsh
$ErrorActionPreference = "Stop"

$REPO = if ($env:REPO) { $env:REPO } else { "AlexCyln/Acode-kit" }
$REF = if ($env:REF) { $env:REF } else { "main" }
$SKILL_PATH = if ($env:SKILL_PATH) { $env:SKILL_PATH } else { "Acode-kit" }
$AGENT = if ($env:AGENT) { $env:AGENT } else { "auto" }
$SCOPE = if ($env:SCOPE) { $env:SCOPE } else { "user" }
$SKIP_INIT = if ($env:SKIP_INIT) { $env:SKIP_INIT } else { "false" }
$CODEX_ROOT_DEFAULT = if ($env:CODEX_HOME) { Join-Path $env:CODEX_HOME "skills" } else { Join-Path $HOME ".codex\skills" }
$LOCAL_ROOT_DEFAULT = Join-Path (Get-Location).Path "agent-skills"
$DEST_ROOT = if ($env:DEST_ROOT) { $env:DEST_ROOT } else { "" }
$TOTAL_STEPS = 6
$CURRENT_VERSION = ""

function Test-PathExists {
  param([string]$TargetPath)
  return Test-Path -LiteralPath $TargetPath
}

function Get-BaseHome {
  param([string]$AgentName)

  $homeRoot = $null
  switch ($AgentName) {
    "codex" { $homeRoot = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" } }
    default { $homeRoot = $LOCAL_ROOT_DEFAULT }
  }

  return $homeRoot
}

function Write-InstallNote {
  param([string]$Message)
  Write-Host "- $Message"
}

function Show-Step {
  param(
    [int]$Current,
    [string]$Title,
    [string]$Detail = ""
  )

  $percent = [int](($Current / $TOTAL_STEPS) * 100)
  Write-Host ""
  Write-Host ("[{0}/{1}] {2}" -f $Current, $TOTAL_STEPS, $Title)
  if ($Detail -ne "") {
    Write-Host ("  {0}" -f $Detail)
  }
  Write-Progress -Activity "Installing Acode-kit" -Status $Title -PercentComplete $percent
}

function Detect-Agent {
  return "codex"
}

function Resolve-DestRoot {
  param([string]$AgentName)

  if ($DEST_ROOT -ne "") { return $DEST_ROOT }

  switch ($AgentName) {
    "codex" {
      if ($SCOPE -eq "project") {
        return Join-Path (Get-Location).Path ".codex\skills"
      }
      return Join-Path (Get-BaseHome "codex") "skills"
    }
    "local" { return $LOCAL_ROOT_DEFAULT }
    default { throw "Unsupported agent: $AgentName" }
  }
}

function Resolve-GlobalStateRoot {
  param([string]$AgentName)

  switch ($AgentName) {
    "codex" { return Join-Path (Get-BaseHome "codex") "acode-kit" }
    default { return Join-Path $LOCAL_ROOT_DEFAULT ".acode-kit-state" }
  }
}

function Resolve-CommandBinDir {
  if ($SCOPE -eq "project") {
    return Join-Path (Get-Location).Path ".acode-kit\bin"
  }
  return Join-Path $HOME ".acode-kit\bin"
}

function Ensure-UserPathContains {
  param([string]$BinDir)

  $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
  $segments = @()
  if ($userPath) {
    $segments = $userPath.Split(";") | Where-Object { $_ -ne "" }
  }

  if ($segments -contains $BinDir) {
    if (($env:Path.Split(";") | Where-Object { $_ -ne "" }) -notcontains $BinDir) {
      $env:Path = "$BinDir;$env:Path"
    }
    return
  }

  $newUserPath = if ($userPath -and $userPath.Trim() -ne "") {
    "$BinDir;$userPath"
  } else {
    $BinDir
  }

  [Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
  $env:Path = "$BinDir;$env:Path"
}

function Install-CommandLauncher {
  param([string]$BundleDir)

  $binDir = Resolve-CommandBinDir
  New-Item -ItemType Directory -Path $binDir -Force | Out-Null

  $cliScript = Join-Path $BundleDir "scripts\acode-kit.mjs"
  if (-not (Test-PathExists $cliScript)) {
    throw "CLI script not found at $cliScript"
  }

  $cmdLauncher = Join-Path $binDir "acode-kit.cmd"
  $psLauncher = Join-Path $binDir "acode-kit.ps1"

  @(
    "@echo off"
    "setlocal"
    "set `"CLI_SCRIPT=%~dp0..\..\.codex\skills\Acode-kit\scripts\acode-kit.mjs`""
    "if not exist `"%CLI_SCRIPT%`" if defined CODEX_HOME set `"CLI_SCRIPT=%CODEX_HOME%\skills\Acode-kit\scripts\acode-kit.mjs`""
    "if not exist `"%CLI_SCRIPT%`" set `"CLI_SCRIPT=%USERPROFILE%\.codex\skills\Acode-kit\scripts\acode-kit.mjs`""
    "if not exist `"%CLI_SCRIPT%`" ("
    "  echo Acode-kit CLI script not found. Re-run the installer."
    "  exit /b 1"
    ")"
    "node `"%CLI_SCRIPT%`" %*"
  ) | Set-Content -LiteralPath $cmdLauncher -Encoding ascii

  @(
    '$ErrorActionPreference = "Stop"'
    '$candidates = @('
    '  (Join-Path $PSScriptRoot "..\..\.codex\skills\Acode-kit\scripts\acode-kit.mjs"),'
    '  $(if ($env:CODEX_HOME) { Join-Path $env:CODEX_HOME "skills\Acode-kit\scripts\acode-kit.mjs" } else { $null }),'
    '  (Join-Path $HOME ".codex\skills\Acode-kit\scripts\acode-kit.mjs")'
    ') | Where-Object { $_ }'
    '$cliScript = $candidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1'
    'if (-not $cliScript) { throw "Acode-kit CLI script not found. Re-run the installer." }'
    '& node $cliScript @args'
  ) | Set-Content -LiteralPath $psLauncher -Encoding ascii

  if ($SCOPE -eq "user") {
    Ensure-UserPathContains -BinDir $binDir
  }

  return $binDir
}

function Write-InstallSummary {
  param(
    [string]$RequestedAgent,
    [string]$ResolvedAgent,
    [string]$Scope,
    [string]$Destination
  )

  Write-Host "Acode-kit installer"
  if ($CURRENT_VERSION -ne "") {
    Write-Host "- version: $CURRENT_VERSION"
  }
  Write-Host "- requested agent: $RequestedAgent"
  Write-Host "- resolved agent: $ResolvedAgent"
  Write-Host "- scope: $Scope"
  Write-Host "- destination: $Destination"

  if ($Scope -eq "user") {
    Write-InstallNote "user-level installs populate a persistent global MCP cache for future sessions"
  }

  if ($RequestedAgent -eq "auto") {
    Write-InstallNote "auto now defaults to Codex skill registration"
    Write-InstallNote "set AGENT=local only if you explicitly want a portable non-registered bundle"
    Write-InstallNote "set SCOPE or DEST_ROOT before invoking this script to override install paths"
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
  $versionFile = Join-Path $repoRoot "VERSION"
  if (Test-PathExists $versionFile) {
    Copy-Item -LiteralPath $versionFile -Destination (Join-Path $targetDir "VERSION") -Force
  }

  switch ($AgentName) {
    "codex" {
      Write-Host "Installed Codex skill to $targetDir"
    }
    "local" {
      $portableCodexDir = Join-Path $destRoot "codex"
      New-Item -ItemType Directory -Path $portableCodexDir -Force | Out-Null
      $codexAdapterPath = Join-Path $SourceDir "integrations\codex\acode-kit.md"
      $codexRouterAdapterPath = Join-Path $SourceDir "integrations\codex\acode-run.md"
      if (Test-PathExists $codexAdapterPath) {
        Copy-Item -LiteralPath $codexAdapterPath -Destination (Join-Path $portableCodexDir "acode-kit.md") -Force
        Write-Host "Saved portable Codex runtime guide to $(Join-Path $portableCodexDir 'acode-kit.md')"
      }
      if (Test-PathExists $codexRouterAdapterPath) {
        Copy-Item -LiteralPath $codexRouterAdapterPath -Destination (Join-Path $portableCodexDir "acode-run.md") -Force
        Write-Host "Saved portable Codex routing guide to $(Join-Path $portableCodexDir 'acode-run.md')"
      }
      Write-Host "Installed portable bundle to $targetDir"
      Write-Host "Manual next step:"
      Write-Host "- Codex: copy the Acode-kit folder into $(Join-Path (Get-BaseHome 'codex') 'skills') and use codex/*.md as runtime supplements if needed."
    }
  }
}

function Run-Init {
  param(
    [string]$BundleDir,
    [string]$ProjectRoot,
    [string]$AgentName
  )

  $initScript = Join-Path $BundleDir "scripts\acode-kit-init.mjs"
  if (-not (Test-PathExists $initScript)) {
    Write-Host "Init script not found at expected location. Run manually:" -ForegroundColor Red
    Write-Host "  node $initScript --cwd $ProjectRoot" -ForegroundColor Red
    return $false
  }

  Write-Host ""
  Write-Host "Running initialization..."
  Write-Host "========================"
  Write-Host "This refreshes MCP status and NotebookLM auth into the user-level global cache."

  $initArgs = @("--cwd", $ProjectRoot, "--force")
  if ($AgentName -eq "codex") {
    $initArgs += @("--provider", $AgentName)
  }
  if ($SCOPE -in @("user", "project")) {
    $initArgs += "--yes"
  }

  & node $initScript @initArgs
  return $LASTEXITCODE -eq 0
}

$LAST_BUNDLE_DIR = ""

$REQUESTED_AGENT = $AGENT
if ($AGENT -eq "auto") {
  $AGENT = Detect-Agent
}

if ($AGENT -notin @("codex", "local")) {
  throw "Unsupported AGENT=$AGENT. Use codex, local, or auto."
}

if ($SCOPE -notin @("user", "project")) {
  throw "Unsupported SCOPE=$SCOPE. Use user or project."
}

$resolvedDestInfo = Resolve-DestRoot $AGENT

$tmpDir = Join-Path ([System.IO.Path]::GetTempPath()) ("acode-kit-" + [guid]::NewGuid().ToString("N"))
$archiveFile = Join-Path $tmpDir "archive.tar.gz"
$extractDir = Join-Path $tmpDir "extract"

New-Item -ItemType Directory -Path $extractDir -Force | Out-Null

try {
  Show-Step -Current 1 -Title "Preparing install plan" -Detail "Resolving source, target agent, and destination paths."
  $archiveUrl = "https://codeload.github.com/$REPO/tar.gz/refs/heads/$REF"
  Show-Step -Current 2 -Title "Downloading repository bundle" -Detail $archiveUrl
  Write-Host "Downloading $archiveUrl"
  Invoke-WebRequest -Uri $archiveUrl -OutFile $archiveFile
  Show-Step -Current 3 -Title "Extracting bundle" -Detail "Unpacking the downloaded archive into a temporary workspace."
  tar -xzf $archiveFile -C $extractDir

  $repoDir = Get-ChildItem -LiteralPath $extractDir -Directory | Select-Object -First 1
  if (-not $repoDir) {
    throw "Failed to find extracted repository folder in $extractDir"
  }

  $sourceDir = Join-Path $repoDir.FullName $SKILL_PATH
  if (-not (Test-PathExists (Join-Path $sourceDir "SKILL.md"))) {
    throw "Skill not found at $SKILL_PATH in $REPO@$REF"
  }
  $versionFile = Join-Path $repoDir.FullName "VERSION"
  if (Test-PathExists $versionFile) {
    $CURRENT_VERSION = (Get-Content -LiteralPath $versionFile -Raw).Trim()
  }

  Write-InstallSummary -RequestedAgent $REQUESTED_AGENT -ResolvedAgent $AGENT -Scope $SCOPE -Destination $resolvedDestInfo

  Show-Step -Current 4 -Title "Installing bundle files" -Detail "Copying Acode-kit and adapters into the target runtime directories."
  Install-Agent -SourceDir $sourceDir -AgentName $AGENT

  Show-Step -Current 5 -Title "Registering CLI launcher" -Detail "Creating the 'acode-kit' command entry point."
  $commandBinDir = Install-CommandLauncher -BundleDir $LAST_BUNDLE_DIR

  if ($SKIP_INIT -ne "true") {
    Show-Step -Current 6 -Title "Running initialization" -Detail "Refreshing MCP status and NotebookLM auth cache."
    if ($SCOPE -eq "user") {
      [void](Run-Init -BundleDir $LAST_BUNDLE_DIR -ProjectRoot (Resolve-GlobalStateRoot $AGENT) -AgentName $AGENT)
    } elseif ($SCOPE -eq "project") {
      [void](Run-Init -BundleDir $LAST_BUNDLE_DIR -ProjectRoot (Get-Location).Path -AgentName $AGENT)
    }
  } else {
    Show-Step -Current 6 -Title "Skipping initialization" -Detail "SKIP_INIT=true was provided; initialization was intentionally skipped."
  }

  Write-Host ""
  Write-Host "Install complete."
  Write-Host "Restart your AI tool after installation."
  if ($SCOPE -eq "user") {
    Write-Host "A CLI launcher was installed to $commandBinDir and added to your user PATH."
    Write-Host "Open a new CMD or PowerShell window if 'acode-kit' is not recognized immediately."
  } else {
    Write-Host "A project-local CLI launcher was installed to $commandBinDir"
    Write-Host "Run it directly or add that directory to PATH for this project."
  }
  Write-Host ""
  Write-Host "Next commands:"
  Write-Host "  acode-kit -status"
  Write-Host "  acode-kit -help"
  Write-Host "  acode-kit -add <path>"
  Write-Host "  acode-kit -scan <path>"
  Write-Host "  acode-kit -remove <name>"
  Write-Host ""
  Write-Host "Recommended order:"
  Write-Host "  1. Check status"
  Write-Host "  2. Start your AI in the project directory"
  Write-Host "  3. Tell it to use Acode-kit"
  Write-Host ""
  if ($SKIP_INIT -eq "true") {
    Write-Host "Initialization was skipped. Run this to finish setup:"
    Write-Host "  node $LAST_BUNDLE_DIR\scripts\acode-kit-init.mjs"
  } else {
    Write-Host "Initialization finished."
  }
  Write-Progress -Activity "Installing Acode-kit" -Completed
} finally {
  if (Test-PathExists $tmpDir) {
    Remove-Item -LiteralPath $tmpDir -Recurse -Force
  }
}
