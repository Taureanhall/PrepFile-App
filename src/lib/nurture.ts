/**
 * Email nurture sequence for free users who have generated a brief but not upgraded.
 *
 * Touch 1 — Day 3:  "How did the interview go?"
 * Touch 2 — Day 7:  "Another interview coming up?"
 * Touch 3 — Day 14: "Still job searching? PrepFile Pro has you covered"
 *
 * Skips users on Pro or Pack plans.
 */

import { getFreeUsersWithBriefs, getNurtureSentTouches, markNurtureSent } from "./db.js";

const TOUCH_DELAY_DAYS = [3, 7, 14];

function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function isStripeLive(): boolean {
  const key = process.env.STRIPE_SECRET_KEY || "";
  return key.startsWith("sk_live_");
}

function buildTouch1Html(appUrl: string): string {
  const upgradeSection = isStripeLive()
    ? `<div style="background:#f4f4f5;border-radius:8px;padding:16px;margin-top:16px">
        <p style="color:#3f3f46;font-size:14px;margin:0 0 8px">
          <strong>Ready for your next interview?</strong> PrepFile Pro gives you unlimited briefs at $9.99/month,
          or grab an Interview Pack (5 briefs) for $4.99.
        </p>
        <a href="${appUrl}" style="color:#18181b;font-size:14px;font-weight:500">Upgrade to Pro →</a>
      </div>`
    : `<div style="background:#f4f4f5;border-radius:8px;padding:16px;margin-top:16px">
        <p style="color:#3f3f46;font-size:14px;margin:0">
          <strong>More interviews ahead?</strong> PrepFile Pro with unlimited briefs is coming soon.
          <a href="${appUrl}" style="color:#18181b;font-weight:500">Check back →</a>
        </p>
      </div>`;

  return `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px">
    <h2 style="font-size:20px;font-weight:700;color:#18181b;margin-bottom:8px">How did the interview go?</h2>
    <p style="color:#52525b;margin-bottom:16px">
      A few days ago you used PrepFile to prep for an interview. We hope it went well!
    </p>
    <p style="color:#52525b;margin-bottom:24px">
      Your prep briefs are saved — you can review them anytime from your dashboard.
    </p>
    <a href="${appUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-bottom:16px">View my briefs →</a>
    ${upgradeSection}
    <p style="color:#a1a1aa;font-size:12px;margin-top:32px">PrepFile — AI-powered interview prep</p>
  </div>`;
}

function buildTouch2Html(appUrl: string): string {
  const ctaSection = isStripeLive()
    ? `<a href="${appUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-top:8px">Upgrade to Pro →</a>`
    : `<p style="color:#52525b;font-size:14px;margin-top:8px">
        Pro with unlimited briefs is coming soon. <a href="${appUrl}" style="color:#18181b;font-weight:500">Check back →</a>
      </p>`;

  return `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px">
    <h2 style="font-size:20px;font-weight:700;color:#18181b;margin-bottom:8px">Another interview coming up?</h2>
    <p style="color:#52525b;margin-bottom:16px">
      PrepFile Pro gives you unlimited prep briefs — no weekly cap — plus resume match analysis
      that maps your background directly to the role's core mandate.
    </p>
    <div style="background:#f4f4f5;border-radius:8px;padding:16px;margin-bottom:20px">
      <p style="color:#3f3f46;font-size:14px;font-weight:600;margin:0 0 8px">What you're missing on the free plan:</p>
      <ul style="color:#52525b;font-size:14px;padding-left:20px;margin:0">
        <li style="margin-bottom:4px">Only 3 briefs per week (vs. unlimited on Pro)</li>
        <li style="margin-bottom:4px">No resume match — see exactly how your experience maps to the role</li>
        <li>Condensed briefs without full round expectations</li>
      </ul>
    </div>
    ${ctaSection}
    <p style="color:#a1a1aa;font-size:12px;margin-top:32px">PrepFile — AI-powered interview prep</p>
  </div>`;
}

function buildTouch3Html(appUrl: string, unsubscribeUrl: string): string {
  const ctaSection = isStripeLive()
    ? `<a href="${appUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500">Get PrepFile Pro →</a>`
    : `<p style="color:#52525b;font-size:14px">
        Pro with unlimited briefs is coming soon. <a href="${appUrl}" style="color:#18181b;font-weight:500">Join the waitlist →</a>
      </p>`;

  return `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px">
    <h2 style="font-size:20px;font-weight:700;color:#18181b;margin-bottom:8px">Still job searching? PrepFile Pro has you covered.</h2>
    <p style="color:#52525b;margin-bottom:16px">
      Job searching takes time. PrepFile Pro gives you unlimited interview prep briefs so you're never caught underprepared —
      no matter how many interviews you have lined up.
    </p>
    <ul style="color:#52525b;padding-left:20px;margin-bottom:20px">
      <li style="margin-bottom:8px">Unlimited prep briefs — no weekly cap</li>
      <li style="margin-bottom:8px">Full briefs with round expectations and risk analysis</li>
      <li style="margin-bottom:8px">Resume match — map your background to the role's core mandate</li>
    </ul>
    ${ctaSection}
    <p style="color:#a1a1aa;font-size:12px;margin-top:40px">
      PrepFile — AI-powered interview prep<br>
      <a href="${unsubscribeUrl}" style="color:#a1a1aa">Unsubscribe</a>
    </p>
  </div>`;
}

/** Check and send any due nurture touches for a single user. */
export async function checkNurtureForUser(
  userId: string,
  email: string,
  firstBriefAt: string,
  appUrl: string,
  fromEmail: string
): Promise<void> {
  const days = daysSince(firstBriefAt);
  if (days < TOUCH_DELAY_DAYS[0]) return; // too early for even touch 1

  const sent = getNurtureSentTouches(userId);

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  for (let i = 0; i < TOUCH_DELAY_DAYS.length; i++) {
    const touch = i + 1;
    if (sent.has(touch)) continue;
    if (days < TOUCH_DELAY_DAYS[i]) continue;

    const unsubscribeUrl = `${appUrl}/unsubscribe`; // placeholder — no unsubscribe handler needed yet for touch 1/2

    let subject: string;
    let html: string;

    if (touch === 1) {
      subject = "How did the interview go?";
      html = buildTouch1Html(appUrl);
    } else if (touch === 2) {
      subject = "Another interview coming up?";
      html = buildTouch2Html(appUrl);
    } else {
      subject = "Still job searching? PrepFile Pro has you covered";
      html = buildTouch3Html(appUrl, unsubscribeUrl);
    }

    try {
      await resend.emails.send({ from: fromEmail, to: email, subject, html });
      markNurtureSent(userId, touch);
      console.log(`[nurture] sent touch ${touch} to ${email}`);
    } catch (err) {
      console.error(`[nurture] failed to send touch ${touch} to ${email}:`, err);
      // Don't mark sent — will retry on next batch run
    }

    // Only send one touch per run — avoid burst sending
    break;
  }
}

/** Batch: check all eligible free users and send any due nurture touches. */
export async function runNurtureEmailBatch(appUrl: string, fromEmail: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  let users: Array<{ id: string; email: string; first_brief_at: string }>;
  try {
    users = getFreeUsersWithBriefs();
  } catch (err) {
    console.error("[nurture] failed to query users:", err);
    return;
  }

  for (const user of users) {
    try {
      await checkNurtureForUser(user.id, user.email, user.first_brief_at, appUrl, fromEmail);
    } catch (err) {
      console.error(`[nurture] error processing user ${user.id}:`, err);
    }
  }
}
