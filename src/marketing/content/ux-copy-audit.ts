/**
 * UX Copy Audit — PrepFile
 * Authored by: Marketing Agent
 *
 * Scope: Every user-facing copy surface from landing → auth → form → brief results → upgrade.
 * Format: each finding has location (file:line), issue, and suggested rewrite.
 * Priority: HIGH = blocks or measurably slows conversion. MEDIUM = friction/confusion. LOW = polish.
 *
 * FE implementation: work top-down. HIGH items first.
 */

export const copyAudit = {
  generatedAt: "2026-03-11",
  scope: [
    "LandingPage.tsx",
    "App.tsx (form + header)",
    "PrepBrief.tsx",
    "UpgradePrompt.tsx",
    "AuthPanel.tsx",
    "InterviewPrepIndex.tsx",
  ],

  findings: [

    // ─── HIGH PRIORITY ────────────────────────────────────────────────────────

    {
      id: "H1",
      priority: "HIGH",
      location: "LandingPage.tsx:61",
      surface: "How it works — Step 3 description",
      issue:
        "Leaks implementation jargon ('Porter's Five Forces and Deming frameworks') into user-facing copy. decisions.md ADR-003 explicitly says these frameworks are invisible to users and must be stripped from output. Most job seekers don't know these terms; they signal nothing beneficial and read like academic filler.",
      current:
        "AI analyzes the company using Porter's Five Forces and Deming frameworks. You get a structured brief in under a minute.",
      suggested:
        "PrepFile generates a structured brief covering the company's competitive position, what your interviewer is evaluating, and tailored talking points — in under a minute.",
    },

    {
      id: "H2",
      priority: "HIGH",
      location: "App.tsx:328",
      surface: "App header H1 (post-login)",
      issue:
        "After the landing page and auth flow, the user lands on a page titled 'Interview Intel' with no PrepFile branding visible. The product name disappears. Users who land directly on the app (e.g., from email links) have no brand context. This is a trust and orientation failure.",
      current: "Interview Intel",
      suggested:
        "PrepFile — or rename the section label to 'New Brief' and add the PrepFile logo/wordmark to the header. The H1 should not be a different brand name than the product.",
    },

    {
      id: "H3",
      priority: "HIGH",
      location: "App.tsx:253",
      surface: "Rate limit error alert",
      issue:
        "Error message says '5-brief daily limit' but the product has a 3-brief WEEKLY limit. This is a factual inconsistency that will confuse and distrust users who've been told 3/week throughout the app.",
      current: "You've reached your 5-brief daily limit. Try again tomorrow.",
      suggested:
        "You've used your 3 free briefs this week. Upgrade to Pro for unlimited briefs, or your limit resets next week.",
    },

    {
      id: "H4",
      priority: "HIGH",
      location: "PrepBrief.tsx:338",
      surface: "Resume match CTA — free tier upgrade button",
      issue:
        "A user who just finished reading their brief is at maximum conversion intent. This is the hottest moment in the funnel. The CTA button text 'See plans' is passive and weak — it sends the user away from the decision. It should capture the intent, not defer it.",
      current: "See plans",
      suggested: "Unlock Resume Match",
      note: "Alternatively: 'Upgrade to Pro — $9.99/mo'. Either is more specific and action-oriented than 'See plans'.",
    },

    {
      id: "H5",
      priority: "HIGH",
      location: "PrepBrief.tsx:331",
      surface: "Resume match CTA — free tier heading",
      issue:
        "The heading 'Resume match is available on Pro and Pack' leads with the gate (what the user can't access) rather than the value (what they'd get). This is a missed conversion moment at the most intent-rich part of the brief.",
      current: "Resume match is available on Pro and Pack",
      suggested: "See how your resume stacks up against this role",
      note: "The subtext that follows ('tailored talking points, gap analysis, personalized blind spots') is good — keep it.",
    },

    {
      id: "H6",
      priority: "HIGH",
      location: "LandingPage.tsx:179",
      surface: "Footer CTA section — headline",
      issue:
        "Weak question opener. 'Ready to walk in prepared?' is a pattern used on thousands of SaaS landing pages. A user who hasn't converted from the hero H1 or the pricing section won't convert from an even weaker hook at the footer.",
      current: "Ready to walk in prepared?",
      suggested: "Your next interview is coming. Start prepping now.",
    },

    // ─── MEDIUM PRIORITY ──────────────────────────────────────────────────────

    {
      id: "M1",
      priority: "MEDIUM",
      location: "LandingPage.tsx:29",
      surface: "Hero subheadline",
      issue:
        "Uses internal terminology ('company signals, role intelligence, round expectations') that maps to PrepFile's section headers, not to how job seekers think about interview prep. A new user doesn't know what 'role intelligence' means. The copy should translate to candidate outcomes.",
      current:
        "PrepFile analyzes the job description and generates a precise prep brief: company signals, role intelligence, round expectations, and questions that show you've done your homework.",
      suggested:
        "Drop in the job description. Get a personalized brief covering the company's competitive position, what the interviewer is actually evaluating, and the questions to ask that signal strategic thinking — in under a minute.",
    },

    {
      id: "M2",
      priority: "MEDIUM",
      location: "PrepBrief.tsx:559",
      surface: "Email capture heading",
      issue:
        "Calls the brief a 'guide' instead of a 'brief.' This is terminology drift from the product's own naming convention. The product is called PrepFile, the output is called a 'brief' — everywhere. Inconsistency erodes trust in small but cumulative ways.",
      current: "Save My Guide",
      suggested: "Email Me This Brief",
    },

    {
      id: "M3",
      priority: "MEDIUM",
      location: "PrepBrief.tsx:511",
      surface: "Regenerate button footnote",
      issue:
        "Says 'daily' but the free limit is weekly. Same inconsistency as H3 — creates confusion about the rate limit terms.",
      current: "Uses one of your daily briefs",
      suggested: "Uses one of your weekly briefs",
    },

    {
      id: "M4",
      priority: "MEDIUM",
      location: "UpgradePrompt.tsx:45",
      surface: "Pro card tier label",
      issue:
        "'Best value' appears on every SaaS pricing card on the internet. It signals nothing about what makes Pro actually better. The real differentiator is unlimited usage.",
      current: "Best value",
      suggested: "Most popular",
      note: "Or remove the label entirely — the pricing already differentiates. The 'best value' badge is not credible without social proof.",
    },

    {
      id: "M5",
      priority: "MEDIUM",
      location: "UpgradePrompt.tsx:50-53",
      surface: "Pro card feature list — order",
      issue:
        "The strongest feature ('Unlimited full briefs') is listed second, after 'Resume match & personalized blind spots.' At the upgrade prompt, the user has just been told they ran out of briefs — unlimited should be the first thing they see.",
      current: [
        "✓ Resume match & personalized blind spots",
        "✓ Unlimited full briefs",
        "✓ Brief history saved",
        "✓ Cancel anytime",
      ],
      suggested: [
        "✓ Unlimited full briefs",
        "✓ Resume match & personalized blind spots",
        "✓ Brief history saved",
        "✓ Cancel anytime",
      ],
    },

    {
      id: "M6",
      priority: "MEDIUM",
      location: "LandingPage.tsx:120",
      surface: "Interview Pack CTA button",
      issue:
        "'Buy pack' is transactional and vague. No value framing. The user doesn't know what they're buying until they click. The CTA should reinforce what they receive.",
      current: "Buy pack",
      suggested: "Get 5 briefs",
    },

    {
      id: "M7",
      priority: "MEDIUM",
      location: "PrepBrief.tsx:561-562",
      surface: "Email capture subtext",
      issue:
        "The current copy explains what email does (sends to inbox) rather than why the user would want it. Misses an opportunity to frame use cases that increase the chance of the email being opened.",
      current:
        "Get a copy of this brief sent directly to your inbox so you can review it before the interview.",
      suggested:
        "Save this brief. Review it the night before, share it with a mentor, or reference it during prep.",
    },

    // ─── LOW PRIORITY ─────────────────────────────────────────────────────────

    {
      id: "L1",
      priority: "LOW",
      location: "LandingPage.tsx:23",
      surface: "Hero badge",
      issue:
        "'AI-powered interview prep' describes the category, not the product. It reads as a generic label that every AI tool uses.",
      current: "AI-powered interview prep",
      suggested: "Personalized prep brief in 60 seconds",
    },

    {
      id: "L2",
      priority: "LOW",
      location: "LandingPage.tsx:79",
      surface: "Pricing section subheadline",
      issue:
        "'Start free. Upgrade when you need more.' is flat. Job seekers have a specific emotional state — interview coming, time pressure, want to do well. The copy can connect to that.",
      current: "Start free. Upgrade when you need more.",
      suggested: "Free briefs to get started. Pro when an interview is on the line.",
    },

    {
      id: "L3",
      priority: "LOW",
      location: "AuthPanel.tsx:55",
      surface: "Sign-in prompt headline",
      issue:
        "'Sign in to save your briefs' assumes the user already knows they want briefs. For unauthenticated users who came from the landing page and clicked 'Get Your Prep Brief,' this is fine. But for users who land directly on the app, this framing undersells.",
      current: "Sign in to save your briefs",
      suggested: "Sign in to get started",
      note:
        "Low priority because the current copy is functional and the auth panel shows up after the user has already indicated intent.",
    },
  ],

  summary: {
    totalFindings: 15,
    high: 6,
    medium: 7,
    low: 3,
    topIssues: [
      "H3 (App.tsx:253): Rate limit copy says 'daily' and '5 briefs' — factual mismatch with 3/week policy. Fix first, it's a trust issue.",
      "H1 (LandingPage.tsx:61): Porter/Deming jargon in Step 3. ADR-003 says strip this. Users have no idea what it means.",
      "H4 (PrepBrief.tsx:338): 'See plans' CTA at maximum conversion intent moment. Lowest-effort, highest-return fix.",
      "H2 (App.tsx:328): Brand disappears post-login. 'Interview Intel' H1 replaces PrepFile. Navigation confusion risk.",
    ],
  },
} as const;
