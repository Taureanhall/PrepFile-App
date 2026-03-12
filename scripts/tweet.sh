#!/usr/bin/env bash
# tweet.sh — Post a tweet via Twitter/X v2 API using OAuth 2.0 with PKCE
# Usage: ./scripts/tweet.sh "Your tweet text here"
# Requires: curl, python3
#
# Env vars needed:
#   TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET — OAuth 2.0 app credentials
#   TWITTER_REFRESH_TOKEN — optional if .twitter-refresh-token file exists; auto-rotated on each use
#   TWITTER_TOKEN_FILE — optional override for token file path (default: prepfile-app/.twitter-refresh-token)
#
# The script refreshes the access token on every call (tokens expire after 2h).
# After each refresh, the new refresh token is persisted to the token file automatically.

set -euo pipefail

# --- Validate input ---
if [[ $# -lt 1 || -z "${1:-}" ]]; then
  echo "Usage: $0 \"Tweet text\"" >&2
  exit 1
fi

TWEET_TEXT="$1"

# --- Resolve token file path ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_TOKEN_FILE="${SCRIPT_DIR}/../.twitter-refresh-token"
TOKEN_FILE="${TWITTER_TOKEN_FILE:-$DEFAULT_TOKEN_FILE}"

# --- Load refresh token from file if env var not set ---
if [[ -z "${TWITTER_REFRESH_TOKEN:-}" && -f "$TOKEN_FILE" ]]; then
  TWITTER_REFRESH_TOKEN="$(cat "$TOKEN_FILE")"
  echo "Loaded refresh token from $TOKEN_FILE" >&2
fi

# --- Validate env vars ---
MISSING=()
[[ -z "${TWITTER_CLIENT_ID:-}" ]]       && MISSING+=("TWITTER_CLIENT_ID")
[[ -z "${TWITTER_CLIENT_SECRET:-}" ]]   && MISSING+=("TWITTER_CLIENT_SECRET")
[[ -z "${TWITTER_REFRESH_TOKEN:-}" ]]   && MISSING+=("TWITTER_REFRESH_TOKEN")

if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo "Error: missing required env vars: ${MISSING[*]}" >&2
  exit 1
fi

# --- Refresh the access token ---
CREDENTIALS=$(printf '%s:%s' "$TWITTER_CLIENT_ID" "$TWITTER_CLIENT_SECRET" | base64)

REFRESH_RESPONSE=$(curl -s -X POST "https://api.twitter.com/2/oauth2/token" \
  -H "Authorization: Basic ${CREDENTIALS}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token&refresh_token=${TWITTER_REFRESH_TOKEN}")

ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null || true)
NEW_REFRESH_TOKEN=$(echo "$REFRESH_RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('refresh_token',''))" 2>/dev/null || true)

if [[ -z "$ACCESS_TOKEN" ]]; then
  echo "Error: Failed to refresh access token" >&2
  echo "$REFRESH_RESPONSE" >&2
  exit 1
fi

# --- Persist new refresh token everywhere ---
if [[ -n "$NEW_REFRESH_TOKEN" ]]; then
  # 1. Token file (for future runs that don't set env var)
  echo "$NEW_REFRESH_TOKEN" > "$TOKEN_FILE"
  echo "Refresh token rotated → $TOKEN_FILE" >&2

  # 2. Auto-update TOOLS.md so agents always have the latest token
  TOOLS_FILE="${TWITTER_TOOLS_FILE:-/Users/taureanhall/Developer/Prepflow-Company/agents/marketing/TOOLS.md}"
  if [[ -f "$TOOLS_FILE" ]]; then
    sed -i '' "s|^TWITTER_REFRESH_TOKEN=.*|TWITTER_REFRESH_TOKEN=${NEW_REFRESH_TOKEN}|" "$TOOLS_FILE"
    echo "TOOLS.md updated with new refresh token" >&2
  fi
fi

echo "TWITTER_NEW_REFRESH_TOKEN=${NEW_REFRESH_TOKEN}" >&2
export TWITTER_NEW_REFRESH_TOKEN="$NEW_REFRESH_TOKEN"

# --- Post the tweet ---
TWEET_JSON=$(printf '%s' "$TWEET_TEXT" | python3 -c 'import json,sys; print(json.dumps({"text": sys.stdin.read()}))')

BODY_FILE=$(mktemp)
HTTP_STATUS=$(curl -s -o "$BODY_FILE" -w "%{http_code}" \
  -X POST "https://api.twitter.com/2/tweets" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$TWEET_JSON")

HTTP_BODY=$(cat "$BODY_FILE")
rm -f "$BODY_FILE"

echo "$HTTP_BODY"

if [[ "$HTTP_STATUS" -lt 200 || "$HTTP_STATUS" -ge 300 ]]; then
  echo "Error: HTTP $HTTP_STATUS" >&2
  exit 1
fi

# Extract and display tweet URL if available
TWEET_ID=$(echo "$HTTP_BODY" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('data',{}).get('id',''))" 2>/dev/null || true)
if [[ -n "$TWEET_ID" ]]; then
  echo "Tweet URL: https://twitter.com/i/web/status/$TWEET_ID" >&2
fi
