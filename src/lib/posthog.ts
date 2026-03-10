import { PostHog } from "posthog-node";

let _client: PostHog | null = null;

export function getPostHogClient(): PostHog | null {
  if (_client) return _client;
  const key = process.env.POSTHOG_KEY;
  if (!key) return null;
  _client = new PostHog(key, { host: "https://us.i.posthog.com" });
  return _client;
}

export async function shutdownPostHog() {
  if (_client) await _client.shutdown();
}
