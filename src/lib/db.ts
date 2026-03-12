import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";

const dbPath = process.env.DB_PATH || path.join(process.cwd(), "prepflow.db");
const db = new Database(dbPath);

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

// Migrations — safe to run on every boot
try { db.exec("ALTER TABLE users ADD COLUMN onboarding_email_sent INTEGER NOT NULL DEFAULT 0"); } catch {}
try { db.exec("ALTER TABLE users ADD COLUMN google_id TEXT"); } catch {}
try { db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL"); } catch {}
try { db.exec("ALTER TABLE briefs ADD COLUMN is_public INTEGER NOT NULL DEFAULT 0"); } catch {}
try { db.exec("ALTER TABLE users ADD COLUMN email_unsubscribed INTEGER NOT NULL DEFAULT 0"); } catch {}

// Email nurture tracking (legacy — touch-based for free users with briefs)
db.exec(`
  CREATE TABLE IF NOT EXISTS email_nurture (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    touch INTEGER NOT NULL,
    sent_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, touch)
  );
`);

// Email sequence tracking — welcome + re-engagement sequences by email_id
db.exec(`
  CREATE TABLE IF NOT EXISTS email_sequences (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    email_id TEXT NOT NULL,
    sent_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, email_id)
  );
`);

export function getBriefCountForUser(userId: string): number {
  const row = db.prepare("SELECT COUNT(*) as cnt FROM briefs WHERE user_id = ?").get(userId) as any;
  return row?.cnt ?? 0;
}

export function markOnboardingEmailSent(userId: string): void {
  db.prepare("UPDATE users SET onboarding_email_sent = 1 WHERE id = ?").run(userId);
}

export function hasReceivedOnboardingEmail(userId: string): boolean {
  const row = db.prepare("SELECT onboarding_email_sent FROM users WHERE id = ?").get(userId) as any;
  return row?.onboarding_email_sent === 1;
}

/** Upsert a user by Google ID. Returns a session token. */
export function upsertGoogleUser(googleId: string, email: string): string {
  let user = db.prepare("SELECT * FROM users WHERE google_id = ?").get(googleId) as any;

  if (!user) {
    // Check if email already exists (magic link user upgrading to Google)
    user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as any;
    if (user) {
      db.prepare("UPDATE users SET google_id = ?, last_login_at = datetime('now') WHERE id = ?").run(googleId, user.id);
    } else {
      const userId = crypto.randomUUID();
      db.prepare("INSERT INTO users (id, email, google_id, last_login_at) VALUES (?, ?, ?, datetime('now'))").run(userId, email.toLowerCase(), googleId);
      user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
    }
  } else {
    db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(user.id);
  }

  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare("INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)").run(crypto.randomUUID(), user.id, sessionToken, expiresAt);
  return sessionToken;
}

/** Returns company_name and job_title for a public brief (is_public=1), or null if not found/private. */
export function getPublicBriefMeta(id: string): { company_name: string; job_title: string } | null {
  return db.prepare(
    "SELECT company_name, job_title FROM briefs WHERE id = ? AND is_public = 1"
  ).get(id) as any;
}

/** Get full brief data for a public brief (no auth required). */
export function getPublicBrief(id: string): { id: string; company_name: string; job_title: string; brief_data: string; created_at: string } | null {
  return db.prepare(
    "SELECT id, company_name, job_title, brief_data, created_at FROM briefs WHERE id = ? AND is_public = 1"
  ).get(id) as any;
}

/** Toggle is_public on a brief owned by the given user. Returns the new state. */
export function setBriefPublic(id: string, userId: string, isPublic: boolean): boolean {
  const result = db.prepare(
    "UPDATE briefs SET is_public = ? WHERE id = ? AND user_id = ?"
  ).run(isPublic ? 1 : 0, id, userId);
  return result.changes > 0;
}

export interface AdminMetrics {
  totalUsers: number;
  usersToday: number;
  totalBriefs: number;
  briefsToday: number;
  briefs7d: number;
  payingUsers: number;
  freeUsers: number;
  briefsPerUserDistribution: Array<{ brief_count: number; user_count: number }>;
  recentSignups: Array<{ email: string; plan: string; created_at: string; brief_count: number }>;
}

export function getAdminMetrics(): AdminMetrics {
  const totalUsers = (db.prepare("SELECT COUNT(*) as cnt FROM users").get() as any).cnt as number;
  const usersToday = (db.prepare("SELECT COUNT(*) as cnt FROM users WHERE created_at >= date('now')").get() as any).cnt as number;
  const totalBriefs = (db.prepare("SELECT COUNT(*) as cnt FROM briefs").get() as any).cnt as number;
  const briefsToday = (db.prepare("SELECT COUNT(*) as cnt FROM briefs WHERE created_at >= date('now')").get() as any).cnt as number;
  const briefs7d = (db.prepare("SELECT COUNT(*) as cnt FROM briefs WHERE created_at >= datetime('now', '-7 days')").get() as any).cnt as number;
  const payingUsers = (db.prepare("SELECT COUNT(*) as cnt FROM subscriptions WHERE plan != 'free'").get() as any).cnt as number;
  const freeUsers = totalUsers - payingUsers;

  const briefsPerUserDistribution = db.prepare(`
    SELECT brief_count, COUNT(*) as user_count
    FROM (SELECT user_id, COUNT(*) as brief_count FROM briefs GROUP BY user_id)
    GROUP BY brief_count ORDER BY brief_count ASC
  `).all() as Array<{ brief_count: number; user_count: number }>;

  const recentSignups = db.prepare(`
    SELECT u.email, COALESCE(s.plan, 'free') as plan, u.created_at, COUNT(b.id) as brief_count
    FROM users u
    LEFT JOIN subscriptions s ON s.user_id = u.id
    LEFT JOIN briefs b ON b.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
    LIMIT 25
  `).all() as Array<{ email: string; plan: string; created_at: string; brief_count: number }>;

  return { totalUsers, usersToday, totalBriefs, briefsToday, briefs7d, payingUsers, freeUsers, briefsPerUserDistribution, recentSignups };
}

/** Returns set of touch numbers (1,2,3) already sent to this user. */
export function getNurtureSentTouches(userId: string): Set<number> {
  const rows = db.prepare("SELECT touch FROM email_nurture WHERE user_id = ?").all(userId) as Array<{ touch: number }>;
  return new Set(rows.map(r => r.touch));
}

/** Record that a nurture touch was sent. */
export function markNurtureSent(userId: string, touch: number): void {
  db.prepare(
    "INSERT OR IGNORE INTO email_nurture (id, user_id, touch) VALUES (?, ?, ?)"
  ).run(crypto.randomUUID(), userId, touch);
}

/** Get all free-plan users who have at least one brief, with their first brief date. */
export function getFreeUsersWithBriefs(): Array<{ id: string; email: string; first_brief_at: string }> {
  return db.prepare(`
    SELECT u.id, u.email, MIN(b.created_at) as first_brief_at
    FROM users u
    JOIN briefs b ON b.user_id = u.id
    LEFT JOIN subscriptions s ON s.user_id = u.id
    WHERE COALESCE(s.plan, 'free') = 'free'
    GROUP BY u.id
  `).all() as Array<{ id: string; email: string; first_brief_at: string }>;
}

// --- Email sequence tracking (welcome + re-engagement) ---

/** Returns the set of email_ids already sent to a user. */
export function getEmailSequenceSent(userId: string): Set<string> {
  const rows = db.prepare(
    "SELECT email_id FROM email_sequences WHERE user_id = ?"
  ).all(userId) as Array<{ email_id: string }>;
  return new Set(rows.map(r => r.email_id));
}

/** Record that a sequence email was sent. Idempotent. */
export function markEmailSequenceSent(userId: string, emailId: string): void {
  db.prepare(
    "INSERT OR IGNORE INTO email_sequences (id, user_id, email_id) VALUES (?, ?, ?)"
  ).run(crypto.randomUUID(), userId, emailId);
}

/** Unsubscribe a user from all marketing emails. */
export function setEmailUnsubscribed(userId: string): void {
  db.prepare("UPDATE users SET email_unsubscribed = 1 WHERE id = ?").run(userId);
}

/** Look up a user id from their email for unsubscribe flows. */
export function getUserIdByEmail(email: string): string | null {
  const row = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase()) as any;
  return row?.id ?? null;
}

/** Find user by email or create a new account. Returns user id. */
export function getOrCreateUserByEmail(email: string): string {
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase()) as any;
  if (existing) return existing.id;
  const userId = crypto.randomUUID();
  db.prepare("INSERT INTO users (id, email, last_login_at) VALUES (?, ?, datetime('now'))").run(userId, email.toLowerCase());
  return userId;
}

/**
 * Users who signed up >= delayDays ago, haven't received emailId, and are not unsubscribed.
 * Used for welcome-2 (day 2) and welcome-3 (day 5).
 */
export function getUsersForWelcomeEmail(
  emailId: string,
  delayDays: number
): Array<{ id: string; email: string }> {
  return db.prepare(`
    SELECT u.id, u.email
    FROM users u
    WHERE u.email_unsubscribed = 0
      AND CAST((julianday('now') - julianday(u.created_at)) AS INTEGER) >= ?
      AND NOT EXISTS (
        SELECT 1 FROM email_sequences es WHERE es.user_id = u.id AND es.email_id = ?
      )
  `).all(delayDays, emailId) as Array<{ id: string; email: string }>;
}

/**
 * Users whose last brief (or signup, if no briefs) was >= delayDays ago,
 * haven't received emailId, and are not unsubscribed.
 * Used for reengagement-1 (day 7) and reengagement-2 (day 14).
 */
export function getUsersForReengagement(
  emailId: string,
  delayDays: number
): Array<{ id: string; email: string }> {
  return db.prepare(`
    SELECT u.id, u.email
    FROM users u
    WHERE u.email_unsubscribed = 0
      AND NOT EXISTS (
        SELECT 1 FROM email_sequences es WHERE es.user_id = u.id AND es.email_id = ?
      )
      AND CAST((julianday('now') - julianday(
        COALESCE(
          (SELECT MAX(b.created_at) FROM briefs b WHERE b.user_id = u.id),
          u.created_at
        )
      )) AS INTEGER) >= ?
  `).all(emailId, delayDays) as Array<{ id: string; email: string }>;
}

// --- Email OTP authentication ---

db.exec(`
  CREATE TABLE IF NOT EXISTS otp_codes (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    attempts INTEGER DEFAULT 0,
    verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);
`);

/** Generate a 6-digit OTP for an email. Invalidates previous unused codes. */
export function createOtpCode(email: string): string {
  // Invalidate any existing unused codes for this email
  db.prepare(
    "UPDATE otp_codes SET verified = 1 WHERE email = ? AND verified = 0"
  ).run(email);

  const code = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min
  db.prepare(
    "INSERT INTO otp_codes (id, email, code, expires_at) VALUES (?, ?, ?, ?)"
  ).run(crypto.randomUUID(), email, code, expiresAt);
  return code;
}

/** Verify an OTP code. Returns session token on success, null on failure. */
export function verifyOtpCode(email: string, code: string): { sessionToken: string | null; error?: string } {
  const row = db.prepare(
    "SELECT * FROM otp_codes WHERE email = ? AND verified = 0 AND expires_at > datetime('now') ORDER BY created_at DESC LIMIT 1"
  ).get(email) as any;

  if (!row) return { sessionToken: null, error: "Code expired or not found. Please request a new one." };

  if (row.attempts >= 5) {
    db.prepare("UPDATE otp_codes SET verified = 1 WHERE id = ?").run(row.id);
    return { sessionToken: null, error: "Too many attempts. Please request a new code." };
  }

  if (row.code !== code) {
    db.prepare("UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?").run(row.id);
    return { sessionToken: null, error: "Incorrect code. Please try again." };
  }

  // Code is correct — mark as verified
  db.prepare("UPDATE otp_codes SET verified = 1 WHERE id = ?").run(row.id);

  // Upsert user
  let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
  if (!user) {
    const userId = crypto.randomUUID();
    db.prepare(
      "INSERT INTO users (id, email, last_login_at) VALUES (?, ?, datetime('now'))"
    ).run(userId, email);
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

  return { sessionToken };
}

export default db;
