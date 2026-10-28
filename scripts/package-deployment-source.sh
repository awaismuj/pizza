#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
archive_path="${1:-$repo_root/deployment-source.tar.gz}"

case "$archive_path" in
  /*) ;;
  *) archive_path="$repo_root/$archive_path" ;;
esac

case "$archive_path" in
  "$repo_root/pos-backend/"*|"$repo_root/pos-frontend/"*|"$repo_root/online-store/"*)
    echo "Archive output must be outside the application source directories." >&2
    exit 1
    ;;
esac

mkdir -p "$(dirname "$archive_path")"
temporary_archive="$(mktemp "${archive_path}.tmp.XXXXXX")"
trap 'rm -f "$temporary_archive"' EXIT

tar -czf "$temporary_archive" \
  --exclude-vcs \
  --exclude='*/node_modules' \
  --exclude='*/node_modules/**' \
  --exclude='*/dist' \
  --exclude='*/dist/**' \
  --exclude='*/build' \
  --exclude='*/build/**' \
  --exclude='*/coverage' \
  --exclude='*/coverage/**' \
  --exclude='*/.env' \
  --exclude='*/.env.*' \
  -C "$repo_root" \
  pos-backend pos-frontend online-store

archive_contents="$(tar -tzf "$temporary_archive")"
for manifest in \
  pos-backend/package.json \
  pos-frontend/package.json \
  online-store/package.json; do
  if ! grep -Fxq "$manifest" <<< "$archive_contents"; then
    echo "Deployment archive is missing required manifest: $manifest" >&2
    exit 1
  fi
done

if grep -Eq '(^|/)(node_modules|dist|build|coverage|\.git)(/|$)|(^|/)\.env([^/]*)(/|$)' \
  <<< "$archive_contents"; then
  echo "Deployment archive contains a dependency, build output, Git metadata, or env file." >&2
  exit 1
fi

mv -f "$temporary_archive" "$archive_path"
trap - EXIT
printf 'Validated deployment source archive: %s\n' "$archive_path"
