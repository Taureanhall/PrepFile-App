/**
 * Email nurture sequences — welcome and re-engagement.
 *
 * Content sourced from src/marketing/content/emails.ts (Marketing, PRE-69/PRE-77).
 *
 * Welcome sequence:
 *   welcome-1 (day 0) — sent immediately on signup, called directly from auth handlers
 *   welcome-2 (day 2) — sent by runWelcomeSequenceBatch
 *   welcome-3 (day 5) — sent by runWelcomeSequenceBatch
 *
 * Re-engagement sequence:
 *   reengagement-1 (day 3 inactive)  — sent by runReengagementBatch
 *   reengagement-2 (day 14 inactive) — sent by runReengagementBatch
 */

import crypto from "crypto";
import {
  getEmailSequenceSent,
  markEmailSequenceSent,
  getUsersForWelcomeEmail,
  getUsersForReengagement,
} from "./db.js";
import { welcomeSequence, reengagementSequence, upgradeWelcomeEmail, dunningEmail, type Email } from "../marketing/content/emails.js";

// ---------------------------------------------------------------------------
// Unsubscribe token — HMAC-signed so userId is never exposed in plaintext
// ---------------------------------------------------------------------------

const UNSUB_SECRET = process.env.UNSUBSCRIBE_SECRET || "prepfile-unsub-2025";

export function makeUnsubscribeToken(userId: string): string {
  const sig = crypto
    .createHmac("sha256", UNSUB_SECRET)
    .update(userId)
    .digest("hex")
    .slice(0, 16);
  return Buffer.from(`${userId}:${sig}`).toString("base64url");
}

export function parseUnsubscribeToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const colonIdx = decoded.lastIndexOf(":");
    if (colonIdx === -1) return null;
    const userId = decoded.slice(0, colonIdx);
    const sig = decoded.slice(colonIdx + 1);
    const expected = crypto
      .createHmac("sha256", UNSUB_SECRET)
      .update(userId)
      .digest("hex")
      .slice(0, 16);
    if (sig !== expected) return null;
    return userId;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// HTML template — wraps plain-text marketing copy
// ---------------------------------------------------------------------------

function buildEmailHtml(email: Email, appUrl: string, unsubscribeToken: string): string {
  // Replace prod URL with runtime appUrl so local dev / staging work correctly
  const ctaUrl = email.ctaUrl.replace(
    "https://prepfile-production.up.railway.app",
    appUrl
  );
  const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=${unsubscribeToken}`;

  // Plain-text body → HTML paragraphs
  const bodyHtml = email.body
    .trim()
    .split(/\n\n+/)
    .map(para => `<p style="color:#52525b;line-height:1.6;margin-bottom:16px">${para.replace(/\n/g, "<br>")}</p>`)
    .join("");

  return `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px 24px">
  ${bodyHtml}
  <a href="${ctaUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-top:8px">${email.ctaText}</a>
  <p style="color:#a1a1aa;font-size:12px;margin-top:40px">
    PrepFile — AI-powered interview prep<br>
    <a href="${unsubscribeUrl}" style="color:#a1a1aa">Unsubscribe</a>
  </p>
</div>`;
}

// ---------------------------------------------------------------------------
// Core send helper — idempotent, marks sent in DB
// ---------------------------------------------------------------------------

async function sendSequenceEmail(
  userId: string,
  userEmail: string,
  email: Email,
  appUrl: string,
  fromEmail: string
): Promise<void> {
  const unsubToken = makeUnsubscribeToken(userId);
  const html = buildEmailHtml(email, appUrl, unsubToken);

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: fromEmail,
    to: userEmail,
    subject: email.subjectA,
    html,
  });

  markEmailSequenceSent(userId, email.id);
  console.log(`[email-sequences] sent ${email.id} to ${userEmail}`);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Send welcome-1 immediately if not already sent.
 * Call this right after a new user signs up (magic link verify or Google OAuth).
 * Fire-and-forget safe — errors are caught and logged.
 */
export async function sendWelcomeEmailImmediate(
  userId: string,
  userEmail: string,
  appUrl: string,
  fromEmail: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const sent = getEmailSequenceSent(userId);
  if (sent.has("welcome-1")) return;

  const email = welcomeSequence.find(e => e.id === "welcome-1");
  if (!email) return;

  try {
    await sendSequenceEmail(userId, userEmail, email, appUrl, fromEmail);
  } catch (err) {
    console.error(`[email-sequences] failed to send welcome-1 to ${userEmail}:`, err);
  }
}

/**
 * Batch: send welcome-2 (day 2) and welcome-3 (day 5) to eligible users.
 */
export async function runWelcomeSequenceBatch(appUrl: string, fromEmail: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const delayed = welcomeSequence.filter(e => e.delayDays > 0); // welcome-2, welcome-3

  for (const email of delayed) {
    let users: Array<{ id: string; email: string }>;
    try {
      users = getUsersForWelcomeEmail(email.id, email.delayDays);
    } catch (err) {
      console.error(`[email-sequences] DB error fetching users for ${email.id}:`, err);
      continue;
    }

    for (const user of users) {
      try {
        await sendSequenceEmail(user.id, user.email, email, appUrl, fromEmail);
      } catch (err) {
        console.error(`[email-sequences] failed to send ${email.id} to ${user.email}:`, err);
      }
    }
  }
}

/**
 * Send upgrade welcome email immediately after a successful Pro or Pack checkout.
 * Idempotent — will not resend if already sent for this user.
 * Fire-and-forget safe.
 */
export async function sendUpgradeWelcomeEmail(
  userId: string,
  userEmail: string,
  appUrl: string,
  fromEmail: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const sent = getEmailSequenceSent(userId);
  if (sent.has(upgradeWelcomeEmail.id)) return;

  try {
    await sendSequenceEmail(userId, userEmail, upgradeWelcomeEmail, appUrl, fromEmail);
  } catch (err) {
    console.error(`[email-sequences] failed to send upgrade-welcome to ${userEmail}:`, err);
  }
}

/**
 * Send dunning email when invoice.payment_failed fires from Stripe.
 * Not idempotent — each payment failure should trigger a send.
 */
export async function sendDunningEmail(
  userId: string,
  userEmail: string,
  appUrl: string,
  fromEmail: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const unsubToken = makeUnsubscribeToken(userId);
  const html = buildEmailHtml(dunningEmail, appUrl, unsubToken);

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: fromEmail,
      to: userEmail,
      subject: dunningEmail.subjectA,
      html,
    });
    console.log(`[email-sequences] sent dunning-1 to ${userEmail}`);
  } catch (err) {
    console.error(`[email-sequences] failed to send dunning-1 to ${userEmail}:`, err);
  }
}

/**
 * Batch: send reengagement-1 (7d inactive) and reengagement-2 (14d inactive).
 */
export async function runReengagementBatch(appUrl: string, fromEmail: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  for (const email of reengagementSequence) {
    let users: Array<{ id: string; email: string }>;
    try {
      users = getUsersForReengagement(email.id, email.delayDays);
    } catch (err) {
      console.error(`[email-sequences] DB error fetching users for ${email.id}:`, err);
      continue;
    }

    for (const user of users) {
      try {
        await sendSequenceEmail(user.id, user.email, email, appUrl, fromEmail);
      } catch (err) {
        console.error(`[email-sequences] failed to send ${email.id} to ${user.email}:`, err);
      }
    }
  }
}
