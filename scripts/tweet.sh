#!/usr/bin/env bash
# tweet.sh — Post a tweet via Twitter/X v2 API using OAuth 1.0a
# Usage: ./scripts/tweet.sh "Your tweet text here"
# Requires: python3
#
# Env vars needed:
#   TWITTER_API_KEY, TWITTER_API_KEY_SECRET — Consumer Keys
#   TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET — Access Token (permanent, never expires)

set -euo pipefail

if [[ $# -lt 1 || -z "${1:-}" ]]; then
  echo "Usage: $0 \"Tweet text\"" >&2
  exit 1
fi

TWEET_TEXT="$1"

# --- Load from TOOLS.md if env vars not set ---
TOOLS_FILE="${TWITTER_TOOLS_FILE:-/Users/taureanhall/Developer/Prepflow-Company/agents/marketing/TOOLS.md}"
if [[ -f "$TOOLS_FILE" ]]; then
  [[ -z "${TWITTER_API_KEY:-}" ]] && TWITTER_API_KEY=$(grep '^TWITTER_API_KEY=' "$TOOLS_FILE" | head -1 | cut -d= -f2-)
  [[ -z "${TWITTER_API_KEY_SECRET:-}" ]] && TWITTER_API_KEY_SECRET=$(grep '^TWITTER_API_KEY_SECRET=' "$TOOLS_FILE" | head -1 | cut -d= -f2-)
  [[ -z "${TWITTER_ACCESS_TOKEN:-}" ]] && TWITTER_ACCESS_TOKEN=$(grep '^TWITTER_ACCESS_TOKEN=' "$TOOLS_FILE" | head -1 | cut -d= -f2-)
  [[ -z "${TWITTER_ACCESS_TOKEN_SECRET:-}" ]] && TWITTER_ACCESS_TOKEN_SECRET=$(grep '^TWITTER_ACCESS_TOKEN_SECRET=' "$TOOLS_FILE" | head -1 | cut -d= -f2-)
fi

MISSING=()
[[ -z "${TWITTER_API_KEY:-}" ]] && MISSING+=("TWITTER_API_KEY")
[[ -z "${TWITTER_API_KEY_SECRET:-}" ]] && MISSING+=("TWITTER_API_KEY_SECRET")
[[ -z "${TWITTER_ACCESS_TOKEN:-}" ]] && MISSING+=("TWITTER_ACCESS_TOKEN")
[[ -z "${TWITTER_ACCESS_TOKEN_SECRET:-}" ]] && MISSING+=("TWITTER_ACCESS_TOKEN_SECRET")

if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo "Error: missing required env vars: ${MISSING[*]}" >&2
  exit 1
fi

# --- Post tweet using OAuth 1.0a via python3 ---
RESULT=$(python3 - "$TWEET_TEXT" "$TWITTER_API_KEY" "$TWITTER_API_KEY_SECRET" "$TWITTER_ACCESS_TOKEN" "$TWITTER_ACCESS_TOKEN_SECRET" << 'PYEOF'
import sys, json, time, hashlib, hmac, urllib.parse, secrets, http.client

tweet_text = sys.argv[1]
api_key = sys.argv[2]
api_key_secret = sys.argv[3]
access_token = sys.argv[4]
access_token_secret = sys.argv[5]

method = "POST"
url = "https://api.twitter.com/2/tweets"
parsed = urllib.parse.urlparse(url)

# OAuth 1.0a signature
oauth_params = {
    "oauth_consumer_key": api_key,
    "oauth_nonce": secrets.token_hex(16),
    "oauth_signature_method": "HMAC-SHA1",
    "oauth_timestamp": str(int(time.time())),
    "oauth_token": access_token,
    "oauth_version": "1.0",
}

# Build signature base string (no body params for JSON content type)
param_string = "&".join(f"{urllib.parse.quote(k, safe='')}={urllib.parse.quote(v, safe='')}"
                        for k, v in sorted(oauth_params.items()))
base_string = f"{method}&{urllib.parse.quote(url, safe='')}&{urllib.parse.quote(param_string, safe='')}"
signing_key = f"{urllib.parse.quote(api_key_secret, safe='')}&{urllib.parse.quote(access_token_secret, safe='')}"

signature = hmac.new(signing_key.encode(), base_string.encode(), hashlib.sha1).digest()
import base64
oauth_params["oauth_signature"] = base64.b64encode(signature).decode()

auth_header = "OAuth " + ", ".join(
    f'{urllib.parse.quote(k, safe="")}="{urllib.parse.quote(v, safe="")}"'
    for k, v in sorted(oauth_params.items())
)

body = json.dumps({"text": tweet_text})

conn = http.client.HTTPSConnection("api.twitter.com")
conn.request(method, "/2/tweets", body=body, headers={
    "Authorization": auth_header,
    "Content-Type": "application/json",
})
resp = conn.getresponse()
data = resp.read().decode()
conn.close()

result = {"status": resp.status, "body": json.loads(data) if data else {}}
print(json.dumps(result))
PYEOF
)

HTTP_STATUS=$(echo "$RESULT" | python3 -c "import json,sys; print(json.load(sys.stdin)['status'])")
HTTP_BODY=$(echo "$RESULT" | python3 -c "import json,sys; print(json.dumps(json.load(sys.stdin)['body'], indent=2))")

echo "$HTTP_BODY"

if [[ "$HTTP_STATUS" -lt 200 || "$HTTP_STATUS" -ge 300 ]]; then
  echo "Error: HTTP $HTTP_STATUS" >&2
  exit 1
fi

TWEET_ID=$(echo "$HTTP_BODY" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('data',{}).get('id',''))" 2>/dev/null || true)
if [[ -n "$TWEET_ID" ]]; then
  echo "Tweet URL: https://twitter.com/i/web/status/$TWEET_ID" >&2
fi
