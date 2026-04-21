#!/usr/bin/env bash
# Installeert de AppSys Claude Code skills + agents in de user-scope.
# Overschrijft bestaande files met dezelfde naam. Back-up lokale
# aanpassingen in ~/.claude/skills/ voor je dit draait.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$HOME/.claude"

mkdir -p "$DEST/skills" "$DEST/agents"
cp -R "$SCRIPT_DIR/skills/." "$DEST/skills/"
cp -R "$SCRIPT_DIR/agents/." "$DEST/agents/"

echo "Skills + agents geinstalleerd in $DEST"
echo "Herstart Claude Code om ze te laden."
