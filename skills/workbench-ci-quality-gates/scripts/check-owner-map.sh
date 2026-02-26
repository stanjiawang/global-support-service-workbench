#!/usr/bin/env bash
set -euo pipefail

repo_root="${1:-$(pwd)}"
codeowners_file="${repo_root}/CODEOWNERS"
owner_map_file="${repo_root}/docs/runbooks/owner-map.md"

if [[ ! -f "${codeowners_file}" ]]; then
  echo "Missing CODEOWNERS: ${codeowners_file}"
  exit 1
fi

if [[ ! -f "${owner_map_file}" ]]; then
  echo "Missing owner map runbook: ${owner_map_file}"
  exit 1
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "${tmp_dir}"' EXIT

normalize_owners() {
  tr ' ' '\n' | grep -E '^@[A-Za-z0-9_-]+$' | LC_ALL=C sort -u | tr '\n' ' ' | sed 's/ $//'
}

extract_codeowners() {
  awk '
    /^[[:space:]]*#/ { next }
    /^[[:space:]]*$/ { next }
    $1 == "*" { next }
    $1 !~ /^\// { next }
    {
      path = $1
      owners = ""
      for (i = 2; i <= NF; i++) {
        if ($i ~ /^@/) {
          owners = owners $i " "
        }
      }
      gsub(/[[:space:]]+$/, "", owners)
      if (owners != "") {
        print path "|" owners
      }
    }
  ' "${codeowners_file}" | while IFS='|' read -r path owners; do
    normalized_owners="$(printf '%s\n' "${owners}" | normalize_owners)"
    if [[ -n "${normalized_owners}" ]]; then
      printf '%s|%s\n' "${path}" "${normalized_owners}"
    fi
  done | LC_ALL=C sort -u > "${tmp_dir}/codeowners-map.txt"
}

extract_owner_map() {
  grep -E '^- `[^`]+` -> ' "${owner_map_file}" | while IFS= read -r line; do
    path="$(printf '%s\n' "${line}" | sed -E 's/^- `([^`]+)` -> .*/\1/')"
    owner_text="$(printf '%s\n' "${line}" | sed -E 's/^- `[^`]+` -> (.*)$/\1/')"

    if [[ "${path}" != /* ]]; then
      path="/${path}"
    fi

    normalized_owners="$(printf '%s\n' "${owner_text}" | grep -oE '@[A-Za-z0-9_-]+' | normalize_owners)"
    if [[ -n "${normalized_owners}" ]]; then
      printf '%s|%s\n' "${path}" "${normalized_owners}"
    fi
  done | LC_ALL=C sort -u > "${tmp_dir}/owner-map.txt"
}

extract_codeowners
extract_owner_map

cut -d'|' -f1 "${tmp_dir}/codeowners-map.txt" > "${tmp_dir}/codeowners-paths.txt"
cut -d'|' -f1 "${tmp_dir}/owner-map.txt" > "${tmp_dir}/owner-map-paths.txt"

missing_in_owner_map="$(comm -23 "${tmp_dir}/codeowners-paths.txt" "${tmp_dir}/owner-map-paths.txt" || true)"
missing_in_codeowners="$(comm -13 "${tmp_dir}/codeowners-paths.txt" "${tmp_dir}/owner-map-paths.txt" || true)"
owner_mismatches="$(
  join -t'|' -j1 "${tmp_dir}/codeowners-map.txt" "${tmp_dir}/owner-map.txt" \
    | awk -F'|' '$2 != $3 { print $1 "|" $2 "|" $3 }'
)"

has_failure=0

if [[ -n "${missing_in_owner_map}" ]]; then
  has_failure=1
  echo "Owner map missing paths from CODEOWNERS:"
  printf '%s\n' "${missing_in_owner_map}"
fi

if [[ -n "${missing_in_codeowners}" ]]; then
  has_failure=1
  echo "Owner map contains paths not in CODEOWNERS:"
  printf '%s\n' "${missing_in_codeowners}"
fi

if [[ -n "${owner_mismatches}" ]]; then
  has_failure=1
  echo "Owner mismatches (path|CODEOWNERS|owner-map):"
  printf '%s\n' "${owner_mismatches}"
fi

if [[ "${has_failure}" -ne 0 ]]; then
  exit 1
fi

echo "Owner map check passed"
