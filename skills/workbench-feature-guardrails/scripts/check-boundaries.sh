#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <repo-root>"
  exit 1
fi

ROOT="$1"
SRC="$ROOT/apps/support-workbench-web/src/features"

if [[ ! -d "$SRC" ]]; then
  echo "features directory not found: $SRC"
  exit 1
fi

violations=0
while IFS= read -r file; do
  rel="${file#$SRC/}"
  from_feature="${rel%%/*}"

  while IFS= read -r line; do
    target="$(echo "$line" | sed -E "s/.*from ['\"](.*)['\"].*/\1/")"
    if [[ "$target" =~ ^@features/ ]]; then
      target_feature="${target#@features/}"
      target_feature="${target_feature%%/*}"
      if [[ "$target_feature" != "$from_feature" ]]; then
        echo "BLOCKED: $file imports $target"
        violations=$((violations + 1))
      fi
    fi
  done < <(rg -n "from ['\"]@features/" "$file" || true)
done < <(find "$SRC" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \))

if [[ $violations -gt 0 ]]; then
  echo "Boundary check failed: $violations violations"
  exit 2
fi

echo "Boundary check passed"
