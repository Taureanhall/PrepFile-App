#!/usr/bin/env bash
# tweet.sh — Post a tweet via Twitter/X v2 API using OAuth1.0a (HMAC-SHA1)
# Usage: ./scripts/tweet.sh "Your tweet text here"
# Requires: curl, openssl

set -euo pipefail

# --- Validate input ---
if [[ $# -lt 1 || -z "${1:-}" ]]; then
  echo "Usage: $0 \"Tweet text\"" >&2
  exit 1
fi

TWEET_TEXT="$1"

# --- Validate env vars ---
MISSING=()
[[ -z "${TWITTER_API_KEY:-}" ]]              && MISSING+=("TWITTER_API_KEY")
[[ -z "${TWITTER_API_SECRET:-}" ]]           && MISSING+=("TWITTER_API_SECRET")
[[ -z "${TWITTER_ACCESS_TOKEN:-}" ]]         && MISSING+=("TWITTER_ACCESS_TOKEN")
[[ -z "${TWITTER_ACCESS_TOKEN_SECRET:-}" ]]  && MISSING+=("TWITTER_ACCESS_TOKEN_SECRET")

if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo "Error: missing required env vars: ${MISSING[*]}" >&2
  exit 1
fi

# --- OAuth1.0a helpers ---

# Percent-encode a string (RFC 3986)
urlencode() {
  local string="$1"
  printf '%s' "$string" | openssl enc -none 2>/dev/null || true
  # Use python-style encoding via printf + sed
  printf '%s' "$string" | \
    LC_ALL=C sed 's/%/%25/g; s/ /%20/g; s/!/%21/g; s/"/%22/g; s/#/%23/g; s/\$/%24/g; s/&/%26/g; s/'"'"'/%27/g; s/(/%28/g; s/)/%29/g; s/\*/%2A/g; s/+/%2B/g; s/,/%2C/g; s|/|%2F|g; s/:/%3A/g; s/;/%3B/g; s/=/%3D/g; s/?/%3F/g; s/@/%40/g; s/\[/%5B/g; s/\]/%5D/g'
}

# URL-encode using printf (handles unicode via xxd approach)
rawurlencode() {
  local string="$1"
  local strlen=${#string}
  local encoded=""
  local pos c o

  for (( pos=0 ; pos<strlen ; pos++ )); do
    c="${string:$pos:1}"
    case "$c" in
      [-_.~a-zA-Z0-9]) o="$c" ;;
      *) printf -v o '%%%02X' "'$c" ;;
    esac
    encoded+="$o"
  done
  echo "$encoded"
}

# Generate nonce (random alphanumeric, 32 chars)
generate_nonce() {
  openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32
}

# Generate UNIX timestamp
generate_timestamp() {
  date +%s
}

# HMAC-SHA1 and return base64
hmac_sha1_base64() {
  local key="$1"
  local data="$2"
  printf '%s' "$data" | openssl dgst -sha1 -hmac "$key" -binary | openssl base64
}

# --- Build OAuth signature ---
URL="https://api.twitter.com/2/tweets"
METHOD="POST"

OAUTH_CONSUMER_KEY="$TWITTER_API_KEY"
OAUTH_TOKEN="$TWITTER_ACCESS_TOKEN"
OAUTH_NONCE=$(generate_nonce)
OAUTH_TIMESTAMP=$(generate_timestamp)
OAUTH_SIGNATURE_METHOD="HMAC-SHA1"
OAUTH_VERSION="1.0"

# Encode the tweet body for the signature base string
# The body param for JSON POST is NOT included in OAuth signature params
# (only application/x-www-form-urlencoded body params are included)

# Build parameter string (sorted alphabetically by key)
PARAMS=(
  "oauth_consumer_key=$(rawurlencode "$OAUTH_CONSUMER_KEY")"
  "oauth_nonce=$(rawurlencode "$OAUTH_NONCE")"
  "oauth_signature_method=$(rawurlencode "$OAUTH_SIGNATURE_METHOD")"
  "oauth_timestamp=$(rawurlencode "$OAUTH_TIMESTAMP")"
  "oauth_token=$(rawurlencode "$OAUTH_TOKEN")"
  "oauth_version=$(rawurlencode "$OAUTH_VERSION")"
)

# Sort params
IFS=$'\n' SORTED_PARAMS=($(sort <<<"${PARAMS[*]}")); unset IFS

# Join with &
PARAM_STRING=""
for param in "${SORTED_PARAMS[@]}"; do
  if [[ -n "$PARAM_STRING" ]]; then
    PARAM_STRING+="&"
  fi
  PARAM_STRING+="$param"
done

# Build signature base string
ENCODED_URL=$(rawurlencode "$URL")
ENCODED_PARAMS=$(rawurlencode "$PARAM_STRING")
SIGNATURE_BASE="${METHOD}&${ENCODED_URL}&${ENCODED_PARAMS}"

# Build signing key
SIGNING_KEY="$(rawurlencode "$TWITTER_API_SECRET")&$(rawurlencode "$TWITTER_ACCESS_TOKEN_SECRET")"

# Generate signature
OAUTH_SIGNATURE=$(hmac_sha1_base64 "$SIGNING_KEY" "$SIGNATURE_BASE")
OAUTH_SIGNATURE_ENCODED=$(rawurlencode "$OAUTH_SIGNATURE")

# --- Build Authorization header ---
AUTH_HEADER="OAuth oauth_consumer_key=\"$(rawurlencode "$OAUTH_CONSUMER_KEY")\", oauth_nonce=\"$(rawurlencode "$OAUTH_NONCE")\", oauth_signature=\"${OAUTH_SIGNATURE_ENCODED}\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"${OAUTH_TIMESTAMP}\", oauth_token=\"$(rawurlencode "$OAUTH_TOKEN")\", oauth_version=\"1.0\""

# --- Post the tweet ---
TWEET_JSON=$(printf '%s' "$TWEET_TEXT" | python3 -c 'import json,sys; print(json.dumps({"text": sys.stdin.read()}))')

BODY_FILE=$(mktemp)
HTTP_STATUS=$(curl -s -o "$BODY_FILE" -w "%{http_code}" \
  -X POST "$URL" \
  -H "Authorization: $AUTH_HEADER" \
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
