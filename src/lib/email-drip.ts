/**
 * Email drip processor — queue-based scheduled sends via Resend.
 * Templates: welcome, nudge_24h, nudge_72h, upgrade_prompt
 * Queue populated at event time; processed by POST /api/cron/send-emails.
 */

import { getPendingEmailQueue, markQueuedEmailSent, markQueuedEmailFailed } from "./db.js";

const BATCH_SIZE = 10;

function buildHtml(template: string, appUrl: string): { subject: string; html: string } {
  switch (template) {
    case "welcome":
      return {
        subject: "Welcome to PrepFile",
        html: `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px 24px">
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Hey,</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Welcome to PrepFile. Enter a company name, job title, and paste the job description — you'll have a full interview prep brief in about a minute.</p>
  <a href="${appUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-bottom:16px">Create my first brief →</a>
  <p style="color:#52525b;line-height:1.6;margin-top:24px">— Reese, CEO @ PrepFile</p>
</div>`,
      };
    case "nudge_24h":
      return {
        subject: "Your brief is saved",
        html: `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px 24px">
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Hey,</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Your prep brief is saved in your dashboard whenever you need it. How's the prep going?</p>
  <a href="${appUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-bottom:16px">View my briefs →</a>
  <p style="color:#52525b;line-height:1.6;margin-top:24px">— Reese, CEO @ PrepFile</p>
</div>`,
      };
    case "nudge_72h":
      return {
        subject: "Another interview coming up?",
        html: `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px 24px">
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Hey,</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">If you have more interviews lined up, PrepFile builds a brief for each one. Company snapshot, round structure, questions to ask — all in under a minute.</p>
  <a href="${appUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-bottom:16px">Generate another brief →</a>
  <p style="color:#52525b;line-height:1.6;margin-top:24px">— Reese, CEO @ PrepFile</p>
</div>`,
      };
    case "upgrade_prompt":
      return {
        subject: "You've hit the free tier limit",
        html: `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px 24px">
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Hey,</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">You've used 3 PrepFile briefs. If you're still interviewing, Pro gives you unlimited briefs plus resume match analysis for $14.99/month.</p>
  <a href="${appUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-bottom:16px">Upgrade to Pro →</a>
  <p style="color:#52525b;line-height:1.6;margin-top:24px">— Reese, CEO @ PrepFile</p>
</div>`,
      };
    default:
      return { subject: "PrepFile", html: "" };
  }
}

/** Process up to 10 pending emails from the queue. */
export async function processDripQueue(appUrl: string, fromEmail: string): Promise<{ sent: number; failed: number }> {
  if (!process.env.RESEND_API_KEY) return { sent: 0, failed: 0 };

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const pending = getPendingEmailQueue(BATCH_SIZE);
  let sent = 0;
  let failed = 0;

  for (const item of pending) {
    const { subject, html } = buildHtml(item.template, appUrl);
    if (!html) {
      markQueuedEmailFailed(item.id);
      failed++;
      continue;
    }
    try {
      await resend.emails.send({ from: fromEmail, to: item.email, subject, html });
      markQueuedEmailSent(item.id);
      sent++;
      console.log(`[email-drip] sent ${item.template} to ${item.email}`);
    } catch (err) {
      console.error(`[email-drip] failed to send ${item.template} to ${item.email}:`, err);
      markQueuedEmailFailed(item.id);
      failed++;
    }
  }

  return { sent, failed };
}
