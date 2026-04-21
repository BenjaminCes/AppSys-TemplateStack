# Installeert de AppSys Claude Code skills + agents in de user-scope.
# Overschrijft bestaande files met dezelfde naam (-Force). Back-up lokale
# aanpassingen in ~/.claude/skills/ voor je dit draait.

$ErrorActionPreference = 'Stop'

$dest = Join-Path $HOME '.claude'
$skillsSrc = Join-Path $PSScriptRoot 'skills'
$agentsSrc = Join-Path $PSScriptRoot 'agents'

New-Item -ItemType Directory -Force -Path (Join-Path $dest 'skills') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $dest 'agents') | Out-Null

Copy-Item -Recurse -Force (Join-Path $skillsSrc '*') (Join-Path $dest 'skills')
Copy-Item -Recurse -Force (Join-Path $agentsSrc '*') (Join-Path $dest 'agents')

Write-Host "Skills + agents geinstalleerd in $dest" -ForegroundColor Green
Write-Host "Herstart Claude Code om ze te laden." -ForegroundColor Yellow
