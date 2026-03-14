/**
 * Post-brief conversion email — fires after a free user generates their first brief.
 *
 * Goal: capitalize on the "aha moment" — they just saw what PrepFile does,
 * now show them what they're missing without Pro.
 *
 * Trigger: user.brief_created, count == 1 AND plan == free
 * Delay: 0 (send immediately after first brief is generated)
 */

// ─── Subject lines (A/B) ─────────────────────────────────────────────────────

export const subjectA = "Your brief is ready — here's what you're missing";
export const subjectB = "Good start. Here's what the full brief includes.";
export const previewText = "Free briefs are a snapshot. Pro briefs go deeper.";

// ─── HTML body ───────────────────────────────────────────────────────────────

export function buildPostBriefUpgradeHtml(appUrl: string, unsubscribeUrl: string): string {
  const upgradeUrl = `${appUrl}/upgrade`;

  return `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px 24px">
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">
    You just generated your first PrepFile brief. That took 60 seconds.
  </p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">
    Free briefs give you the essentials — company context, role signals, and
    interviewer questions. But your prep isn't complete yet.
  </p>
  <div style="background:#f4f4f5;border-radius:8px;padding:16px;margin-bottom:20px">
    <p style="color:#3f3f46;font-size:14px;font-weight:600;margin:0 0 8px">
      What Pro adds to your brief:
    </p>
    <ul style="color:#52525b;font-size:14px;padding-left:20px;margin:0">
      <li style="margin-bottom:6px">Full round-by-round expectations — phone screen through final panel</li>
      <li style="margin-bottom:6px">Resume match — see exactly where your background doesn't align with the role</li>
      <li>Unlimited briefs — no weekly cap, prep for every role in your pipeline</li>
    </ul>
  </div>
  <p style="color:#52525b;line-height:1.6;margin-bottom:20px">
    Most interviews aren't lost on answers. They're lost on blind spots the candidate
    didn't know they had. Resume match fixes that.
  </p>
  <a href="${upgradeUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-bottom:12px">
    Upgrade to Pro — $14.99/mo
  </a>
  <p style="margin:4px 0 24px">
    <a href="${upgradeUrl}" style="color:#52525b;font-size:14px;text-decoration:underline">
      Or get the Interview Pack — 5 full briefs for $6.99, no subscription
    </a>
  </p>
  <p style="color:#a1a1aa;font-size:12px;margin-top:32px">
    PrepFile — AI-powered interview prep<br>
    <a href="${unsubscribeUrl}" style="color:#a1a1aa">Unsubscribe</a>
  </p>
</div>`;
}

// ─── Plain text fallback ─────────────────────────────────────────────────────

export function buildPostBriefUpgradeText(appUrl: string): string {
  const upgradeUrl = `${appUrl}/upgrade`;

  return `You just generated your first PrepFile brief. That took 60 seconds.

Free briefs give you the essentials — company context, role signals, and interviewer questions. But your prep isn't complete yet.

What Pro adds to your brief:
- Full round-by-round expectations — phone screen through final panel
- Resume match — see exactly where your background doesn't align with the role
- Unlimited briefs — no weekly cap, prep for every role in your pipeline

Most interviews aren't lost on answers. They're lost on blind spots the candidate didn't know they had. Resume match fixes that.

Upgrade to Pro ($14.99/mo): ${upgradeUrl}
Or get the Interview Pack — 5 full briefs for $6.99, no subscription: ${upgradeUrl}`;
}
