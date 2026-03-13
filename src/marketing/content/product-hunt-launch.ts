/**
 * Product Hunt Launch Kit — PrepFile
 * PRE-81
 *
 * All copy for the PrepFile Product Hunt launch.
 * Target: job seekers, career changers, bootcamp grads, tech workers interviewing at FAANG.
 */

export const productHuntLaunch = {
  /**
   * TAGLINE
   * 60 chars max. Shows under the product name on PH.
   * Current: 51 chars.
   */
  tagline: "Your personalized interview brief in under a minute",

  /**
   * DESCRIPTION
   * 260 chars max. The "about" copy on the PH listing.
   * Current: 244 chars.
   */
  description:
    "PrepFile generates a personalized interview brief from your company, role, and job description — in under 60 seconds. Get a company snapshot, round-by-round expectations, smart questions to ask, and your blind spots. Free tier available.",

  /**
   * MAKER COMMENT
   * Posted by the founder on launch day. Authentic, personal, invites engagement.
   */
  makerComment: `Hey PH! 👋 I'm Reese, CEO of PrepFile. We built PrepFile because I kept watching smart people bomb interviews not from lack of skill — but from lack of context.

Generic interview prep is everywhere. What's missing is a brief that actually knows the specific company you're interviewing at, the role you applied for, and where *your* gaps are.

So we built PrepFile: paste in a company name, job title, and job description → get a structured interview brief in under a minute. You get:
- A company snapshot (culture, recent moves, what they care about)
- Round-by-round expectations based on the role
- Smart questions to ask your interviewers
- A blind spot analysis so you're not caught off guard

We use a proprietary framework combining competitive analysis and skill gap detection. It's not a chatbot — it's a structured brief.

Free tier lets you run 3 briefs/week. Pro is $9.99/mo for unlimited + brief history + resume match.

Try it right now at prepfile-production.up.railway.app — takes 60 seconds, no credit card.

Would love your feedback. What prep info do you wish you'd had going into your last interview? 👇`,

  /**
   * HUNTER SEED COMMENTS (5)
   * Posted early on launch day to seed different feature angles and drive engagement.
   */
  hunterComments: [
    {
      angle: "Brief quality — specificity vs. generic advice",
      comment: `What I love about PrepFile is what it *doesn't* do: generic tips.

"Research the company" is useless advice. PrepFile actually does that research — company snapshot, how they evaluate candidates, what the role signals about team priorities. The brief reads like something a well-connected friend on the inside wrote you.`,
    },
    {
      angle: "Speed — 60-second value prop",
      comment: `Got a call scheduled in an hour? PrepFile is built for exactly that.

Paste your JD, hit generate — 60 seconds later you have a structured brief covering the company, what to expect in the interview, and where your blind spots are. I've seen people use it in the Uber on the way to the office. No joke.`,
    },
    {
      angle: "Company-specific prep for FAANG/top-tier roles",
      comment: `If you're preparing for Google, Meta, Stripe, or any competitive tech company — the bar for "knowing the company" is high. Interviewers expect you to have opinions, not just surface-level facts.

PrepFile generates briefs that go deep: how the company thinks, what signals matter for your specific role, and what questions will make you stand out. FAANG prep just got a lot faster.`,
    },
    {
      angle: "Free tier — low barrier to try",
      comment: `Quick note for anyone on the fence: PrepFile has a free tier — 3 briefs/week, no credit card required.

Use it for your next interview. If it helps (it will), Pro is $9.99/month for unlimited briefs + history + resume match. But start free and see for yourself.`,
    },
    {
      angle: "Resume match — hidden gem feature",
      comment: `The feature I didn't expect to love: resume match.

Once you have your brief, PrepFile can analyze your resume against it — flagging gaps, suggesting what to emphasize in your answers, and identifying what the interviewer is most likely to probe. Pro/pack feature, but it's genuinely the thing that ties it all together.`,
    },
  ],

  /**
   * GALLERY IMAGE COPY
   * Text overlays for 3-5 screenshot slides in the PH gallery.
   * Keep short — these are read in 2 seconds at thumbnail size.
   */
  gallerySlides: [
    {
      slide: 1,
      headline: "Your interview brief in 60 seconds",
      subhead: "Not generic tips — a brief built for your exact role.",
    },
    {
      slide: 2,
      headline: "Tell us the role. We do the research.",
      subhead: "Company + job title + JD → structured brief, instantly.",
    },
    {
      slide: 3,
      headline: "Know what's coming before you walk in.",
      subhead: "Round-by-round expectations. Smart questions to ask. Blind spots flagged.",
    },
    {
      slide: 4,
      headline: "Resume match — close the gap.",
      subhead: "See exactly how your experience reads against the role.",
    },
    {
      slide: 5,
      headline: "Free to start. No credit card.",
      subhead: "3 briefs/week free. Pro at $9.99/mo for unlimited.",
    },
  ],

  /**
   * LAUNCH DAY SOCIAL POSTS
   */
  socialPosts: {
    twitter: [
      // Primary launch tweet
      `We're live on Product Hunt today 🚀

PrepFile: your personalized interview brief in 60 seconds.

Paste a company + role + JD → get a structured brief covering company snapshot, round expectations, smart questions to ask, and your blind spots.

Free tier available. Would mean the world if you checked it out 👇

[PH LINK]`,

      // Follow-up tweet (thread or standalone)
      `Why PrepFile exists:

"Research the company" is the worst interview advice.

Everyone knows to Google the company. No one tells you:
- How they actually evaluate candidates for your role
- What the interview rounds look like
- What questions will make you sound sharp vs. clueless

That's what PrepFile gives you. In 60 seconds.

[PH LINK]`,
    ],

    linkedin: `We shipped PrepFile — and it's live on Product Hunt today.

The problem we set out to solve: generic interview prep is everywhere, but contextual prep is hard to find. "Research the company" tells you nothing about what actually matters for your specific role at that specific company.

PrepFile fixes that. You input:
→ Company name
→ Job title
→ Job description

You get back a structured brief in under 60 seconds:
✓ Company snapshot (culture, priorities, recent context)
✓ Round-by-round expectations for your role
✓ Smart questions to ask interviewers
✓ Blind spot analysis — what gaps might come up

Free tier: 3 briefs/week, no credit card.
Pro ($9.99/mo): unlimited briefs + history + resume match.

If you or someone you know has an interview coming up, I'd love for you to try it.

[PH LINK]

And if you're on PH today — an upvote goes a long way 🙏`,
  },
};
