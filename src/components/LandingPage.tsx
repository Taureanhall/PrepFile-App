
interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
        <span className="text-lg font-bold tracking-tight">PrepFile</span>
        <button
          onClick={onGetStarted}
          className="text-sm px-4 py-3 border border-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full text-xs text-zinc-600 mb-8">
          AI-powered interview prep
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
          Know exactly what the<br className="hidden sm:block" /> company needs —<br className="hidden sm:block" /> before you walk in.
        </h1>
        <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          PrepFile analyzes the job description and generates a precise prep brief: company signals, role intelligence, round expectations, and questions that show you've done your homework.
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white font-medium text-base rounded-xl hover:bg-zinc-800 transition-colors shadow-sm"
        >
          Get Your Prep Brief
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
        <p className="mt-4 text-sm text-zinc-400">Free to try — no credit card required</p>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-zinc-100 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-zinc-900 mb-3">How it works</h2>
          <p className="text-center text-zinc-500 mb-14">Three steps. One brief. Walk in confident.</p>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Paste the job description",
                desc: "Drop in any job posting. The more detail, the sharper your brief.",
              },
              {
                step: "2",
                title: "Answer 4 quick questions",
                desc: "Interview round, company familiarity, prep time, and your biggest gap.",
              },
              {
                step: "3",
                title: "Get your prep brief",
                desc: "AI analyzes the company using Porter's Five Forces and Deming frameworks. You get a structured brief in under a minute.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {step}
                </div>
                <h3 className="font-semibold text-zinc-900">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center text-zinc-900 mb-3">Pricing</h2>
        <p className="text-center text-zinc-500 mb-14">Start free. Upgrade when you need more.</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-4">
            <div>
              <div className="text-sm font-medium text-zinc-500 mb-1">Free</div>
              <div className="text-3xl font-bold text-zinc-900">$0</div>
              <div className="text-sm text-zinc-400 mt-1">3 briefs / week</div>
            </div>
            <ul className="text-sm text-zinc-600 space-y-2 flex-1">
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> Company snapshot</li>
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> Role intelligence</li>
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> Questions to ask</li>
              <li className="flex gap-2"><span className="text-zinc-300">—</span> <span className="text-zinc-400">Resume match</span></li>
              <li className="flex gap-2"><span className="text-zinc-300">—</span> <span className="text-zinc-400">Brief history</span></li>
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 border border-zinc-200 text-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Get started free
            </button>
          </div>

          {/* Interview Pack */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-4">
            <div>
              <div className="text-sm font-medium text-zinc-500 mb-1">Interview Pack</div>
              <div className="text-3xl font-bold text-zinc-900">$4.99</div>
              <div className="text-sm text-zinc-400 mt-1">5 briefs, one-time</div>
            </div>
            <ul className="text-sm text-zinc-600 space-y-2 flex-1">
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> Full comprehensive brief</li>
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> Resume match & insights</li>
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> Brief history saved</li>
              <li className="flex gap-2"><span className="text-zinc-400">✓</span> No subscription</li>
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 border border-zinc-200 text-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Buy pack
            </button>
          </div>

          {/* Pro */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-900 p-6 flex flex-col gap-4">
            <div>
              <div className="text-sm font-medium text-zinc-400 mb-1">Pro</div>
              <div className="text-3xl font-bold text-white">$9.99</div>
              <div className="text-sm text-zinc-400 mt-1">per month</div>
            </div>
            <ul className="text-sm text-zinc-300 space-y-2 flex-1">
              <li className="flex gap-2"><span className="text-zinc-500">✓</span> Unlimited briefs</li>
              <li className="flex gap-2"><span className="text-zinc-500">✓</span> Full comprehensive brief</li>
              <li className="flex gap-2"><span className="text-zinc-500">✓</span> Resume match & insights</li>
              <li className="flex gap-2"><span className="text-zinc-500">✓</span> Brief history saved</li>
              <li className="flex gap-2"><span className="text-zinc-500">✓</span> Cancel anytime</li>
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 bg-white text-zinc-900 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Get Pro
            </button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-zinc-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to walk in prepared?</h2>
          <p className="text-zinc-400 mb-8">Get a prep brief for your next interview in under a minute.</p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-colors"
          >
            Get Your Prep Brief
          </button>
        </div>
      </section>
    </div>
  );
}
