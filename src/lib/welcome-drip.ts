/**
 * Welcome drip — 3-email pre-brief activation sequence for new signups.
 *
 * Email 1 (Day 0): "your first brief takes 60 seconds" — sent in batch, catches all new signups
 * Email 2 (Day 1): "your interview is closer than you think"
 * Email 3 (Day 3): "most people skip this step" — includes Pro nudge
 *
 * Copy sourced from agents/marketing/deliverables/welcome-sequence.md.
 * Uses email_sequences table for dedup (ids: welcome-drip-1/2/3).
 */

import { getUsersForWelcomeEmail, markEmailSequenceSent } from "./db.js";
import { makeUnsubscribeToken } from "./email-sequences.js";

interface DripEmail {
  id: string;
  subject: string;
  delayDays: number;
  buildHtml: (appUrl: string, unsubUrl: string) => string;
}

const drip: DripEmail[] = [
  {
    id: "welcome-drip-1",
    subject: "your first brief takes 60 seconds",
    delayDays: 0,
    buildHtml: (appUrl, unsubUrl) => `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px 24px">
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Hey,</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Welcome to PrepFile. Here's how to get started:</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Go to prepfile.work, enter the company name, job title, and paste in the job description. It takes about a minute.</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">You'll get a company snapshot, what each round looks like, and specific questions to ask your interviewer.</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:24px">If you have an interview coming up, use it now. That's what it's for.</p>
  <a href="${appUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-bottom:16px">Create my first brief →</a>
  <p style="color:#52525b;line-height:1.6;margin-top:24px">— Taurean</p>
  <p style="color:#a1a1aa;font-size:12px;margin-top:40px">PrepFile — AI-powered interview prep<br><a href="${unsubUrl}" style="color:#a1a1aa">Unsubscribe</a></p>
</div>`,
  },
  {
    id: "welcome-drip-2",
    subject: "your interview is closer than you think",
    delayDays: 1,
    buildHtml: (appUrl, unsubUrl) => `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px 24px">
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Hey,</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Most people underestimate how fast an interview date arrives. One week feels like plenty. Then it's 48 hours out and you're still Googling "[Company] interview questions."</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">A PrepFile brief gives you: a company snapshot, what each round looks like, the questions to ask your interviewer, and the blind spots most candidates miss.</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:24px">Job seekers prepping for roles at Google, Stripe, Airbnb, and early-stage startups use it as their first step.</p>
  <a href="${appUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-bottom:16px">prepfile.work — takes a minute →</a>
  <p style="color:#52525b;line-height:1.6;margin-top:24px">— Taurean</p>
  <p style="color:#a1a1aa;font-size:12px;margin-top:40px">PrepFile — AI-powered interview prep<br><a href="${unsubUrl}" style="color:#a1a1aa">Unsubscribe</a></p>
</div>`,
  },
  {
    id: "welcome-drip-3",
    subject: "most people skip this step",
    delayDays: 3,
    buildHtml: (appUrl, unsubUrl) => `<div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px 24px">
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Hey,</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">Most candidates walk in having read the company website and nothing else. They get asked "what do you know about our product direction?" and go blank. It's not a trick question — it's a signal check.</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:16px">PrepFile builds you a brief before you walk in: company strategy, round structure, what the hiring team is actually evaluating, and the questions that show you've done the work.</p>
  <p style="color:#52525b;line-height:1.6;margin-bottom:24px">If you want unlimited briefs and a resume match for the specific role, Pro is $14.99/month.</p>
  <a href="${appUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin-bottom:16px">Open PrepFile →</a>
  <p style="color:#52525b;line-height:1.6;margin-top:24px">— Taurean</p>
  <p style="color:#a1a1aa;font-size:12px;margin-top:40px">PrepFile — AI-powered interview prep<br><a href="${unsubUrl}" style="color:#a1a1aa">Unsubscribe</a></p>
</div>`,
  },
];

/** Batch: send welcome drip emails (Day 0, 1, 3) to eligible new signups. */
export async function runWelcomeDripBatch(appUrl: string, fromEmail: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  for (const email of drip) {
    let users: Array<{ id: string; email: string }>;
    try {
      users = getUsersForWelcomeEmail(email.id, email.delayDays);
    } catch (err) {
      console.error(`[welcome-drip] DB error fetching users for ${email.id}:`, err);
      continue;
    }

    for (const user of users) {
      try {
        const unsubToken = makeUnsubscribeToken(user.id);
        const unsubUrl = `${appUrl}/api/unsubscribe?token=${unsubToken}`;
        const html = email.buildHtml(appUrl, unsubUrl);

        await resend.emails.send({
          from: fromEmail,
          to: user.email,
          subject: email.subject,
          html,
        });

        markEmailSequenceSent(user.id, email.id);
        console.log(`[welcome-drip] sent ${email.id} to ${user.email}`);
      } catch (err) {
        console.error(`[welcome-drip] failed to send ${email.id} to ${user.email}:`, err);
      }
    }
  }
}
