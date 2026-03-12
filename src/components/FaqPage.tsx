import { useEffect, useState } from "react";

const FAQ_ITEMS = [
  {
    q: "What is PrepFile and how does it work?",
    a: "PrepFile generates a personalized interview prep brief in under 10 minutes. You enter the company name, job title, job description, and answer 4 quick questions about the interview round, how familiar you are with the company, how much prep time you have, and your biggest skill gap. Gemini AI analyzes this and produces a structured brief covering the company snapshot, what the role actually demands, what the interview round will test, questions to ask your interviewer, and where your profile might get scrutinized.",
  },
  {
    q: "How much does PrepFile cost?",
    a: "PrepFile has three tiers: Free ($0, 3 briefs per week, concise brief format), Pro ($9.99/month, unlimited briefs, full comprehensive brief, brief history, resume match), and Interview Pack ($4.99 one-time, 5 comprehensive briefs + resume match — designed for a single job search). You can try the free tier without a credit card.",
  },
  {
    q: "What do I get with a comprehensive brief vs. a free brief?",
    a: "Free briefs give you a company overview and the two most important signals for your role. Comprehensive briefs (Pro and Interview Pack) add: full round expectations with likely question formats, smart questions to ask your interviewer, a resume match analysis, and an explicit breakdown of your blind spots — the gaps the interviewer is most likely to probe.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes. If you purchase the Interview Pack and aren't satisfied after your first brief, contact us within 7 days for a full refund — no questions asked. For Pro subscriptions, you can cancel anytime and you'll retain access until the end of your billing period.",
  },
  {
    q: "How long does it take to generate a brief?",
    a: "Under 60 seconds in most cases. Occasionally up to 2 minutes for complex roles. You'll see a loading indicator while it generates.",
  },
  {
    q: "Which companies and roles does PrepFile support?",
    a: "Any company, any role. PrepFile draws on publicly available information about the company's culture, hiring approach, and competitive landscape, combined with the specific job description you provide. It works best when you paste the actual job description rather than just the job title.",
  },
  {
    q: "Is my job description and personal data stored?",
    a: "PrepFile stores your generated briefs (so you can access them later in your brief history) and your email for account purposes. We do not sell your data or share it with third parties. Your job description is used only to generate your brief.",
  },
  {
    q: "Can I use PrepFile for multiple interviews in one job search?",
    a: "Yes. The Interview Pack gives you 5 briefs — more than enough for a standard search cycle. Pro is better if you're actively interviewing across multiple companies or ongoing.",
  },
  {
    q: "Does PrepFile work for technical roles?",
    a: "Yes. The brief adapts to the job description you provide. For engineering roles, it will surface the technical signals the company looks for, common assessment formats (system design, coding, take-home, etc.), and relevant stack details the company is known for. The more specific your job description, the more targeted the output.",
  },
  {
    q: "Do I need to create an account?",
    a: "Yes, to generate and save briefs you sign in with Google. This is how we associate your briefs with your account and enforce the free tier limits.",
  },
];

function FaqItem({ q, a }: { q: string; a: string; key?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-200">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-base font-medium text-zinc-900">{q}</span>
        <svg
          className={`shrink-0 h-5 w-5 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-sm text-zinc-600 leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export function FaqPage() {
  useEffect(() => {
    const title = "Frequently Asked Questions | PrepFile";
    const description =
      "Common questions about PrepFile — how it works, pricing tiers, what's included in free vs. Pro, and how to get started.";
    const url = "https://prepfile.app/faq";

    document.title = title;

    const setMeta = (attr: string, val: string, isName = false) => {
      const sel = isName ? `meta[name="${attr}"]` : `meta[property="${attr}"]`;
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        isName ? el.setAttribute("name", attr) : el.setAttribute("property", attr);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    setMeta("description", description, true);
    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:url", url);
    setMeta("twitter:title", title, true);
    setMeta("twitter:description", description, true);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    return () => {
      document.title = "PrepFile";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-zinc-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-base font-semibold text-zinc-900 tracking-tight">
            PrepFile
          </a>
          <a
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Generate a brief →
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Frequently asked questions</h1>
        <p className="text-base text-zinc-500 mb-10">
          Everything you need to know about PrepFile. Can't find your answer?{" "}
          <a href="mailto:support@prepfile.app" className="text-zinc-900 underline underline-offset-2">
            Contact us.
          </a>
        </p>

        <div>
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>

        <div className="mt-16 bg-zinc-50 border border-zinc-200 rounded-2xl px-8 py-8 text-center">
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">
            Ready to try it?
          </h2>
          <p className="text-sm text-zinc-600 mb-6">
            Free tier — 3 briefs per week, no credit card required.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-700 transition-colors"
          >
            Generate your first brief
          </a>
        </div>
      </main>
    </div>
  );
}
