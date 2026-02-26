#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <repo-root>"
  exit 1
fi

ROOT="$1"
CI_FILE="$ROOT/.github/workflows/ci.yml"

if [[ ! -f "$CI_FILE" ]]; then
  echo "Missing CI workflow: $CI_FILE"
  exit 2
fi

required=("a11y" "lint" "typecheck" "test" "docs_lint")
missing=0
for gate in "${required[@]}"; do
  if ! rg -q "$gate" "$CI_FILE"; then
    echo "Missing required gate in CI: $gate"
    missing=$((missing + 1))
  fi
done

if [[ $missing -gt 0 ]]; then
  echo "A11y gate check failed"
  exit 3
fi

echo "A11y gate check passed"
