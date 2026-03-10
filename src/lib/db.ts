import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";

const db = new Database(path.join(process.cwd(), "prepflow.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    last_login_at TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS magic_links (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS briefs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    brief_data TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS rate_limits (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    window_start TEXT NOT NULL,
    window_end TEXT NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limits_identifier_window
    ON rate_limits(identifier, window_start);

  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id),
    plan TEXT NOT NULL DEFAULT 'free',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    pack_briefs_remaining INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

export function createMagicLink(email: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  db.prepare(
    "INSERT INTO magic_links (id, email, token, expires_at) VALUES (?, ?, ?, ?)"
  ).run(crypto.randomUUID(), email, token, expiresAt);
  return token;
}

export function verifyMagicLink(token: string): string | null {
  const link = db
    .prepare(
      "SELECT * FROM magic_links WHERE token = ? AND used = 0 AND expires_at > datetime('now')"
    )
    .get(token) as any;
  if (!link) return null;

  db.prepare("UPDATE magic_links SET used = 1 WHERE id = ?").run(link.id);

  // Upsert user
  let user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(link.email) as any;
  if (!user) {
    const userId = crypto.randomUUID();
    db.prepare(
      "INSERT INTO users (id, email, last_login_at) VALUES (?, ?, datetime('now'))"
    ).run(userId, link.email);
    user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
  } else {
    db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(user.id);
  }

  // Create session (30 days)
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(
    "INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)"
  ).run(crypto.randomUUID(), user.id, sessionToken, expiresAt);

  return sessionToken;
}

export function getUserBySession(token: string): { id: string; email: string } | null {
  const session = db
    .prepare(
      "SELECT * FROM sessions WHERE token = ? AND expires_at > datetime('now')"
    )
    .get(token) as any;
  if (!session) return null;
  return db.prepare("SELECT id, email FROM users WHERE id = ?").get(session.user_id) as any;
}

export function deleteSession(token: string): void {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function saveBrief(userId: string, companyName: string, jobTitle: string, briefData: object): string {
  const id = crypto.randomUUID();
  db.prepare(
    "INSERT INTO briefs (id, user_id, company_name, job_title, brief_data) VALUES (?, ?, ?, ?, ?)"
  ).run(id, userId, companyName, jobTitle, JSON.stringify(briefData));
  return id;
}

export function getBriefsByUser(userId: string): Array<{ id: string; company_name: string; job_title: string; created_at: string }> {
  return db.prepare(
    "SELECT id, company_name, job_title, created_at FROM briefs WHERE user_id = ? ORDER BY created_at DESC"
  ).all(userId) as any;
}

export function getBriefById(id: string, userId: string): { id: string; company_name: string; job_title: string; brief_data: string; created_at: string } | null {
  return db.prepare(
    "SELECT * FROM briefs WHERE id = ? AND user_id = ?"
  ).get(id, userId) as any;
}

/**
 * Check and increment rate limit for an identifier within a rolling window.
 * Returns true if the request is allowed, false if the limit is exceeded.
 * Cleans up expired windows on each call for the given identifier.
 */
export function checkAndIncrementRateLimit(
  identifier: string,
  limitPerWindow: number,
  windowMs: number
): boolean {
  const now = new Date();
  const windowStart = now.toISOString();
  const windowEnd = new Date(now.getTime() + windowMs).toISOString();

  // Remove expired windows for this identifier
  db.prepare(
    "DELETE FROM rate_limits WHERE identifier = ? AND window_end <= ?"
  ).run(identifier, now.toISOString());

  // Find active window
  const existing = db.prepare(
    "SELECT * FROM rate_limits WHERE identifier = ? AND window_end > ? ORDER BY window_start ASC LIMIT 1"
  ).get(identifier, now.toISOString()) as any;

  if (!existing) {
    // No active window — create one
    db.prepare(
      "INSERT INTO rate_limits (id, identifier, count, window_start, window_end) VALUES (?, ?, 1, ?, ?)"
    ).run(crypto.randomUUID(), identifier, windowStart, windowEnd);
    return true;
  }

  if (existing.count >= limitPerWindow) {
    return false;
  }

  db.prepare("UPDATE rate_limits SET count = count + 1 WHERE id = ?").run(existing.id);
  return true;
}

// Plan: 'free' | 'pro' | 'pack'
export interface UserSubscription {
  plan: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  pack_briefs_remaining: number;
}

export function getUserSubscription(userId: string): UserSubscription {
  const row = db.prepare("SELECT * FROM subscriptions WHERE user_id = ?").get(userId) as any;
  if (!row) return { plan: "free", stripe_customer_id: null, stripe_subscription_id: null, pack_briefs_remaining: 0 };
  return row;
}

export function upsertSubscription(
  userId: string,
  plan: string,
  stripeCustomerId: string | null,
  stripeSubscriptionId: string | null,
  packBriefsRemaining?: number
): void {
  const existing = db.prepare("SELECT id FROM subscriptions WHERE user_id = ?").get(userId) as any;
  if (existing) {
    db.prepare(`
      UPDATE subscriptions
      SET plan = ?, stripe_customer_id = ?, stripe_subscription_id = ?,
          pack_briefs_remaining = COALESCE(?, pack_briefs_remaining),
          updated_at = datetime('now')
      WHERE user_id = ?
    `).run(plan, stripeCustomerId, stripeSubscriptionId, packBriefsRemaining ?? null, userId);
  } else {
    db.prepare(`
      INSERT INTO subscriptions (id, user_id, plan, stripe_customer_id, stripe_subscription_id, pack_briefs_remaining)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), userId, plan, stripeCustomerId, stripeSubscriptionId, packBriefsRemaining ?? 0);
  }
}

/** Decrement pack briefs. Returns false if none remaining. */
export function usePackBrief(userId: string): boolean {
  const row = db.prepare("SELECT pack_briefs_remaining FROM subscriptions WHERE user_id = ?").get(userId) as any;
  if (!row || row.pack_briefs_remaining <= 0) return false;
  db.prepare("UPDATE subscriptions SET pack_briefs_remaining = pack_briefs_remaining - 1, updated_at = datetime('now') WHERE user_id = ?").run(userId);
  return true;
}

export default db;
