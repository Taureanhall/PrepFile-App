/**
 * Product Hunt behavior-triggered email sequences (PRE-341).
 *
 * 7 triggers, all scoped to users with referral_source = 'producthunt':
 *
 *   Immediate sends (called from auth/brief/webhook handlers):
 *     1. ph-welcome        — signup from PH referrer
 *     5. ph-free-limit     — hit 3-brief free cap
 *
 *   Queue-based (queued in webhook, processed by /api/cron/send-emails):
 *     6. ph-upgrade-welcome — +24h after Pro/Pack purchase
 *
 *   Batch (processed by /api/cron/emails → runPhEmailBatch):
 *     2. ph-nudge-24h       — signup + 24h, no brief
 *     3. ph-nudge-72h       — signup + 72h, no brief
 *     4. ph-brief-followup  — 1 brief + 48h, no return
 *     7. ph-pro-reengage    — Pro user, no brief in 7d
 */

import {
  getEmailSequenceSent,
  markEmailSequenceSent,
  isProductHuntUser,
  getPhUsersNoBrief,
  getPhUsersOneBriefInactive,
  getPhProUsersInactive,
} from "./db.js";
import { makeUnsubscribeToken } from "./email-sequences.js";
import {
  phWelcomeEmail,
  phNudge24hEmail,
  phNudge72hEmail,
  phBriefFollowupEmail,
  phFreeLimitEmail,
  phUpgradeWelcomeEmail,
  phProReengageEmail,
} from "../marketing/content/ph-emails.js";
import type { Email } from "../marketing/content/emails.js";

// ---------------------------------------------------------------------------
// HTML builder — same pattern as email-sequences.ts
// ---------------------------------------------------------------------------

function buildPhEmailHtml(email: Email, appUrl: string, unsubscribeToken: string): string {
  const ctaUrl = email.ctaUrl.replace(
    "https://prepfile-production.up.railway.app",
    appUrl
  );
  const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=${unsubscribeToken}`;

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
// Core send helper — idempotent via email_sequences table
// ---------------------------------------------------------------------------

async function sendPhEmail(
  userId: string,
  userEmail: string,
  email: Email,
  appUrl: string,
  fromEmail: string
): Promise<void> {
  const unsubToken = makeUnsubscribeToken(userId);
  const html = buildPhEmailHtml(email, appUrl, unsubToken);

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: fromEmail,
    to: userEmail,
    subject: email.subjectA,
    html,
  });

  markEmailSequenceSent(userId, email.id);
  console.log(`[ph-emails] sent ${email.id} to ${userEmail}`);
}

// ---------------------------------------------------------------------------
// Immediate sends — called from server.ts handlers
// ---------------------------------------------------------------------------

/**
 * Send PH-specific welcome email instead of generic welcome-1.
 * Call from Google OAuth callback when referral_source = 'producthunt'.
 */
export async function sendPhWelcomeImmediate(
  userId: string,
  userEmail: string,
  appUrl: string,
  fromEmail: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const sent = getEmailSequenceSent(userId);
  if (sent.has(phWelcomeEmail.id)) return;

  try {
    await sendPhEmail(userId, userEmail, phWelcomeEmail, appUrl, fromEmail);
  } catch (err) {
    console.error(`[ph-emails] failed to send ph-welcome to ${userEmail}:`, err);
  }
}

/**
 * Send PH-specific free-limit email when user hits 3-brief cap.
 * Call from /api/generate-brief after saving the 3rd brief.
 */
export async function sendPhFreeLimitImmediate(
  userId: string,
  userEmail: string,
  appUrl: string,
  fromEmail: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const sent = getEmailSequenceSent(userId);
  if (sent.has(phFreeLimitEmail.id)) return;

  try {
    await sendPhEmail(userId, userEmail, phFreeLimitEmail, appUrl, fromEmail);
  } catch (err) {
    console.error(`[ph-emails] failed to send ph-free-limit to ${userEmail}:`, err);
  }
}

// ---------------------------------------------------------------------------
// Batch sends — called from /api/cron/emails
// ---------------------------------------------------------------------------

/**
 * Process all PH behavior-triggered batch emails:
 *   - ph-nudge-24h (signup + 1d, no brief)
 *   - ph-nudge-72h (signup + 3d, no brief)
 *   - ph-brief-followup (1 brief + 2d, no return)
 *   - ph-pro-reengage (Pro, no brief in 7d)
 */
export async function runPhEmailBatch(appUrl: string, fromEmail: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  // 1. PH users who signed up but never created a brief
  const noBriefEmails = [
    { email: phNudge24hEmail, fetcher: () => getPhUsersNoBrief(phNudge24hEmail.id, phNudge24hEmail.delayDays) },
    { email: phNudge72hEmail, fetcher: () => getPhUsersNoBrief(phNudge72hEmail.id, phNudge72hEmail.delayDays) },
  ];

  for (const { email, fetcher } of noBriefEmails) {
    let users: Array<{ id: string; email: string }>;
    try {
      users = fetcher();
    } catch (err) {
      console.error(`[ph-emails] DB error fetching users for ${email.id}:`, err);
      continue;
    }
    for (const user of users) {
      try {
        await sendPhEmail(user.id, user.email, email, appUrl, fromEmail);
      } catch (err) {
        console.error(`[ph-emails] failed to send ${email.id} to ${user.email}:`, err);
      }
    }
  }

  // 2. PH users with 1 brief, inactive for 2+ days
  try {
    const followupUsers = getPhUsersOneBriefInactive(phBriefFollowupEmail.id, phBriefFollowupEmail.delayDays);
    for (const user of followupUsers) {
      try {
        await sendPhEmail(user.id, user.email, phBriefFollowupEmail, appUrl, fromEmail);
      } catch (err) {
        console.error(`[ph-emails] failed to send ph-brief-followup to ${user.email}:`, err);
      }
    }
  } catch (err) {
    console.error(`[ph-emails] DB error fetching users for ph-brief-followup:`, err);
  }

  // 3. PH Pro users inactive for 7+ days
  try {
    const proUsers = getPhProUsersInactive(phProReengageEmail.id, phProReengageEmail.delayDays);
    for (const user of proUsers) {
      try {
        await sendPhEmail(user.id, user.email, phProReengageEmail, appUrl, fromEmail);
      } catch (err) {
        console.error(`[ph-emails] failed to send ph-pro-reengage to ${user.email}:`, err);
      }
    }
  } catch (err) {
    console.error(`[ph-emails] DB error fetching users for ph-pro-reengage:`, err);
  }
}

// ---------------------------------------------------------------------------
// Queue-based: PH upgrade welcome (+24h) — template for email-drip.ts
// ---------------------------------------------------------------------------

/** Email ID for the PH upgrade welcome (queued, not batch). */
export const PH_UPGRADE_WELCOME_TEMPLATE = "ph_upgrade_welcome" as const;

/** Build HTML for the PH upgrade welcome email (called from email-drip.ts). */
export function buildPhUpgradeWelcomeHtml(appUrl: string, unsubscribeToken: string): { subject: string; html: string } {
  return {
    subject: phUpgradeWelcomeEmail.subjectA,
    html: buildPhEmailHtml(phUpgradeWelcomeEmail, appUrl, unsubscribeToken),
  };
}
