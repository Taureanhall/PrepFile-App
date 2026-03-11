import { useEffect } from "react";
import { COMPANIES } from "./InterviewPrepPage";

export function InterviewPrepIndex() {
  const companies = Object.values(COMPANIES);

  useEffect(() => {
    const title = "Company Interview Prep Guides | PrepFile";
    const description =
      "Browse interview prep guides for Google, Amazon, Meta, Microsoft, Apple, and more. Detailed breakdowns of culture, rounds, and what interviewers actually evaluate.";
    const canonicalUrl = "https://prepfile.app/interview-prep";

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

    // Canonical link
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // Schema.org ItemList
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
      itemListElement: companies.map((co, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: co.tagline,
        url: `https://prepfile.app/interview-prep/${co.slug}`,
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
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center border-b border-zinc-100">
        <a href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
          PrepFile
        </a>
        <a
          href="/"
          className="text-sm px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors"
        >
          Get your prep brief
        </a>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 pt-6 text-sm text-zinc-400">
        <a href="/" className="hover:text-zinc-600 transition-colors">Home</a>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">Interview Prep Guides</span>
      </div>

      {/* Header */}
      <header className="max-w-3xl mx-auto px-6 pt-10 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
          Company Interview Prep Guides
        </h1>
        <p className="text-lg text-zinc-500 leading-relaxed">
          Detailed breakdowns of what each company's hiring process actually looks like — culture,
          rounds, what interviewers evaluate, and how to show up strong.
        </p>
      </header>

      {/* Company list */}
      <main className="max-w-3xl mx-auto px-6 pb-16">
        <ul className="divide-y divide-zinc-100">
          {companies.map((co) => (
            <li key={co.slug}>
              <a
                href={`/interview-prep/${co.slug}`}
                className="flex items-center justify-between py-5 group"
              >
                <div>
                  <span className="text-base font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    {co.tagline}
                  </span>
                  <p className="text-sm text-zinc-400 mt-1 leading-snug max-w-prose">
                    {co.metaDescription}
                  </p>
                </div>
                <span className="ml-6 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-10 bg-zinc-900 rounded-2xl px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Don't see your target company?
          </h2>
          <p className="text-zinc-400 mb-6 leading-relaxed max-w-xl mx-auto">
            PrepFile generates a personalized brief for any company — just enter the name, job title,
            and job description.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-100 transition-colors text-sm"
          >
            Generate a custom brief →
          </a>
        </div>

        {/* Prep by Role */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">Prep by Role</h2>
          <div className="grid sm:grid-cols-5 gap-3">
            {[
              { name: "Product Management", slug: "pm" },
              { name: "Software Engineering", slug: "swe" },
              { name: "Data Science", slug: "data-science" },
              { name: "Consulting", slug: "consulting" },
              { name: "Finance", slug: "finance" },
            ].map(({ name, slug }) => (
              <a
                key={slug}
                href={`/interview-prep/roles/${slug}`}
                className="flex items-center justify-center py-3 px-4 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-900 transition-colors text-center"
              >
                {name}
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 mt-8 border-t border-zinc-200 flex justify-between items-center text-sm text-zinc-400">
          <a href="/" className="hover:text-zinc-600 transition-colors">← Back to PrepFile</a>
          <nav className="flex gap-4">
            <a href="/blog" className="hover:text-zinc-600 transition-colors">Blog</a>
            <a href="/faq" className="hover:text-zinc-600 transition-colors">FAQ</a>
          </nav>
        </div>
      </main>
    </div>
  );
}
