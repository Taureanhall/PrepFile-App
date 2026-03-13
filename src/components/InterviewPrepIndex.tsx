import { useEffect, useState, useMemo } from "react";
import { COMPANIES } from "./InterviewPrepPage";
import { Nav } from "./Nav";

const INDUSTRIES = [
  {
    title: "Big Tech",
    emoji: "💻",
    gradient: "linear-gradient(135deg, #2563eb, #4338ca)",
    slugs: ["google", "amazon", "meta", "apple", "microsoft", "netflix"],
  },
  {
    title: "High-Growth Tech",
    emoji: "🚀",
    gradient: "linear-gradient(135deg, #059669, #0f766e)",
    slugs: ["stripe", "airbnb", "spotify", "uber", "linkedin", "tesla"],
  },
  {
    title: "Enterprise & Cloud",
    emoji: "☁️",
    gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    slugs: ["salesforce", "adobe", "ibm"],
  },
  {
    title: "Finance & Consulting",
    emoji: "📊",
    gradient: "linear-gradient(135deg, #d97706, #b45309)",
    slugs: ["mckinsey", "bcg", "goldman-sachs", "jpmorgan", "deloitte"],
  },
];

// 3 featured picks from different industries
const FEATURED_SLUGS = ["google", "stripe", "mckinsey"];
// 3 more guides from a mix
const MORE_SLUGS = ["meta", "airbnb", "goldman-sachs"];

const ROLES = [
  { name: "Product Management", slug: "pm" },
  { name: "Software Engineering", slug: "swe" },
  { name: "Data Science", slug: "data-science" },
  { name: "Consulting", slug: "consulting" },
  { name: "Finance", slug: "finance" },
];

function getGradientForSlug(slug: string): string {
  const ind = INDUSTRIES.find((i) => i.slugs.includes(slug));
  return ind?.gradient ?? "linear-gradient(135deg, #18181b, #3f3f46)";
}

export function InterviewPrepIndex() {
  const allCompanies = Object.values(COMPANIES);
  const [search, setSearch] = useState("");
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return allCompanies.filter(
      (co) =>
        co.tagline.toLowerCase().includes(q) ||
        co.slug.toLowerCase().includes(q) ||
        co.metaDescription.toLowerCase().includes(q)
    );
  }, [search]);

  const industryCompanies = useMemo(() => {
    if (!activeIndustry) return null;
    const ind = INDUSTRIES.find((i) => i.title === activeIndustry);
    if (!ind) return null;
    return ind.slugs
      .map((s) => allCompanies.find((co) => co.slug === s))
      .filter(Boolean) as typeof allCompanies;
  }, [activeIndustry]);

  const featured = FEATURED_SLUGS
    .map((s) => allCompanies.find((co) => co.slug === s))
    .filter(Boolean) as typeof allCompanies;

  const more = MORE_SLUGS
    .map((s) => allCompanies.find((co) => co.slug === s))
    .filter(Boolean) as typeof allCompanies;

  useEffect(() => {
    const title = "Company Interview Prep Guides | PrepFile";
    const description =
      "Browse interview prep guides for Google, Amazon, Meta, Microsoft, Apple, and more. Detailed breakdowns of culture, rounds, and what interviewers actually evaluate.";
    const canonicalUrl = "https://prepfile.work/interview-prep";

    document.title = title;

    const setMeta = (attr: string, val: string, isName = false) => {
      const sel = isName ? `meta[name="${attr}"]` : `meta[property="${attr}"]`;
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(isName ? "name" : "property", attr);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    setMeta("description", description, true);
    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:url", canonicalUrl);
    setMeta("twitter:title", title, true);
    setMeta("twitter:description", description, true);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    const schemaId = "schema-interview-prep-index";
    document.getElementById(schemaId)?.remove();
    const script = document.createElement("script");
    script.id = schemaId;
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Company Interview Prep Guides",
      description,
      url: canonicalUrl,
      itemListElement: allCompanies.map((co, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: co.tagline,
        url: `https://prepfile.work/interview-prep/${co.slug}`,
        description: co.metaDescription,
      })),
    });
    document.head.appendChild(script);

    return () => {
      document.title = "PrepFile — AI Interview Prep Briefs";
      document.getElementById(schemaId)?.remove();
      document.head.querySelector('link[rel="canonical"]')?.remove();
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans">
      <Nav />

      <div className="max-w-5xl mx-auto px-6 pt-6 text-sm text-zinc-400">
        <a href="/" className="hover:text-zinc-600 transition-colors">Home</a>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">Interview Prep Guides</span>
      </div>

      <header className="max-w-5xl mx-auto px-6 pt-10 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-4">Company Interview Prep Guides</h1>
        <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl">
          Detailed breakdowns of what each company's hiring process actually looks like — culture, rounds, what interviewers evaluate, and how to show up strong.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16">
        <div className="mb-10">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveIndustry(null); }}
            placeholder="Search companies..."
            className="w-full max-w-md px-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors text-sm"
          />
        </div>

        {filtered !== null ? (
          <>
            <p className="text-sm text-zinc-400 mb-4">{filtered.length} {filtered.length === 1 ? "result" : "results"} for &ldquo;{search}&rdquo;</p>
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-zinc-500">No companies match &ldquo;{search}&rdquo;</p>
                <p className="text-sm text-zinc-400 mt-1">Try a different search term, or generate a custom brief for any company.</p>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100 mb-10">
                {filtered.map((co) => (
                  <li key={co.slug}>
                    <a href={`/interview-prep/${co.slug}`} className="flex items-center justify-between py-5 group">
                      <div>
                        <span className="text-base font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">{co.tagline}</span>
                        <p className="text-sm text-zinc-400 mt-1 leading-snug max-w-prose">{co.metaDescription}</p>
                      </div>
                      <span className="ml-6 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0">&rarr;</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {activeIndustry && industryCompanies ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{INDUSTRIES.find((i) => i.title === activeIndustry)?.emoji}</span>
                    <h2 className="text-2xl font-bold text-zinc-900">{activeIndustry}</h2>
                  </div>
                  <p className="text-zinc-500 mb-8">{industryCompanies.length} companies in this industry</p>
                  <div className="space-y-8">
                    {industryCompanies.map((co) => (
                      <a key={co.slug} href={`/interview-prep/${co.slug}`} className="group block">
                        <div className="flex gap-5 items-start">
                          <div className="w-40 h-28 rounded-xl shrink-0 flex items-center justify-center" style={{ background: getGradientForSlug(co.slug) }}>
                            <span className="text-white text-lg font-bold opacity-90">{co.name}</span>
                          </div>
                          <div className="pt-1">
                            <h3 className="text-base font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors leading-snug mb-2">{co.tagline}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">{co.metaDescription}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveIndustry(null)}
                    className="mt-8 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    &larr; Back to all guides
                  </button>
                </>
              ) : (
                <>
                  <section>
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-6">Featured guides</h2>
                    <div className="space-y-8">
                      {featured.map((co) => (
                        <a key={co.slug} href={`/interview-prep/${co.slug}`} className="group block">
                          <div className="flex gap-5 items-start">
                            <div className="w-40 h-28 rounded-xl shrink-0 flex items-center justify-center" style={{ background: getGradientForSlug(co.slug) }}>
                              <span className="text-white text-lg font-bold opacity-90">{co.name}</span>
                            </div>
                            <div className="pt-1">
                              <h3 className="text-base font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors leading-snug mb-2">{co.tagline}</h3>
                              <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">{co.metaDescription}</p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>

                  <section className="mt-12 border-t border-zinc-200 pt-8">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-5">More guides</h2>
                    <div className="space-y-4">
                      {more.map((co) => (
                        <a key={co.slug} href={`/interview-prep/${co.slug}`} className="flex items-center justify-between py-2 group">
                          <span className="text-base font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">{co.tagline}</span>
                          <span className="ml-6 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0">&rarr;</span>
                        </a>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* Industry sidebar */}
            <div className="lg:w-64 shrink-0">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-4">Browse by industry</h3>
              <div className="space-y-1">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.title}
                    onClick={() => setActiveIndustry(activeIndustry === ind.title ? null : ind.title)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                      activeIndustry === ind.title
                        ? "bg-brand-600 text-white"
                        : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    <span>{ind.emoji}</span>
                    <span>{ind.title}</span>
                    <span className={`ml-auto text-xs ${activeIndustry === ind.title ? "text-zinc-400" : "text-zinc-400"}`}>{ind.slugs.length}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 border-t border-zinc-200 pt-6">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-4">Prep by role</h3>
                <div className="space-y-1">
                  {ROLES.map(({ name, slug }) => (
                    <a key={slug} href={`/interview-prep/roles/${slug}`} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors">
                      {name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 bg-zinc-900 rounded-2xl px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Don&apos;t see your target company?</h2>
          <p className="text-zinc-400 mb-6 leading-relaxed max-w-xl mx-auto">PrepFile generates a personalized brief for any company — just enter the name, job title, and job description.</p>
          <a href="/" className="inline-block px-6 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-100 transition-colors text-sm">Generate a custom brief &rarr;</a>
        </div>

        <div className="pt-8 mt-8 border-t border-zinc-200 flex justify-between items-center text-sm text-zinc-400">
          <a href="/" className="hover:text-zinc-600 transition-colors">&larr; Back to PrepFile</a>
          <nav className="flex gap-4">
            <a href="/blog" className="hover:text-zinc-600 transition-colors">Blog</a>
            <a href="/faq" className="hover:text-zinc-600 transition-colors">FAQ</a>
          </nav>
        </div>
      </main>
    </div>
  );
}
