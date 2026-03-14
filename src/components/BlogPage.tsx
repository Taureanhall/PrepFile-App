import { useEffect, type ReactNode } from "react";
import { blogArticles, type BlogArticle } from "../marketing/content/blog-articles";
import { getChart } from "../data/charts/chart-registry";
import { Nav } from "./Nav";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const GRADIENT_MAP: Record<string, string> = {
  "from-blue-600 to-indigo-700": "linear-gradient(135deg, #2563eb, #4338ca)",
  "from-emerald-600 to-teal-700": "linear-gradient(135deg, #059669, #0f766e)",
  "from-orange-500 to-red-600": "linear-gradient(135deg, #f97316, #dc2626)",
};

function renderMarkdown(body: string, inlineCta: BlogArticle["inlineCta"]) {
  const blocks = body.split(/\n\n+/);
  const result: ReactNode[] = [];
  let ctaInserted = false;
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;
    if (block.startsWith("## ")) {
      const headingText = block.slice(3);
      result.push(<h2 key={i} className="text-xl font-semibold text-zinc-900 mt-8 mb-3">{headingText}</h2>);
      if (!ctaInserted && headingText === inlineCta.afterHeading) {
        ctaInserted = true;
        result.push(
          <div key={`cta-${i}`} className="my-6 bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-5">
            <p className="text-sm text-zinc-600 mb-3">{inlineCta.text}</p>
            <a href="/" className="inline-block text-sm font-semibold px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition-colors">{inlineCta.buttonLabel}</a>
          </div>
        );
      }
    } else if (block.startsWith("{{chart:") && block.endsWith("}}")) {
      const chartId = block.slice(8, -2);
      const chart = getChart(chartId);
      if (chart) result.push(<div key={`chart-${i}`}>{chart}</div>);
    } else {
      result.push(<p key={i} className="text-zinc-600 leading-relaxed mb-4">{renderInline(block)}</p>);
    }
  }
  return result;
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-zinc-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

interface BlogPageProps { slug?: string; }

export function BlogPage({ slug }: BlogPageProps) {
  if (slug) return <BlogArticlePage slug={slug} />;
  return <BlogIndexPage />;
}

function BlogIndexPage() {
  const featured = blogArticles.filter((a) => a.featured);
  const rest = blogArticles.filter((a) => !a.featured);
  const cardArticles = rest.slice(0, 2);
  const sidebarArticles = rest.slice(2);

  useEffect(() => {
    const title = "Interview Prep Blog | PrepFile";
    const description = "Interview prep guides, strategy, and tactics from PrepFile. Learn how to prepare smarter, not longer.";
    const canonicalUrl = "https://prepfile.app/blog";
    document.title = title;
    const setMeta = (attr: string, val: string, isName = false) => {
      const sel = isName ? `meta[name="${attr}"]` : `meta[property="${attr}"]`;
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(isName ? "name" : "property", attr); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };
    setMeta("description", description, true);
    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:url", canonicalUrl);
    setMeta("twitter:title", title, true);
    setMeta("twitter:description", description, true);
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", canonicalUrl);
    return () => { document.title = "PrepFile — AI Interview Prep Briefs"; document.head.querySelector('link[rel="canonical"]')?.remove(); };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans">
      <Nav />

      <div className="max-w-5xl mx-auto px-6 pt-6 text-sm text-zinc-400">
        <a href="/" className="hover:text-zinc-600 transition-colors">Home</a>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">Blog</span>
      </div>

      <header className="max-w-5xl mx-auto px-6 pt-10 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-4">Interview Prep Blog</h1>
        <p className="text-lg text-zinc-500 leading-relaxed">Strategy, tactics, and frameworks for candidates who want to prepare smarter.</p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16">
        {featured.length > 0 && (
          <section className="mb-14">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-5">Editor&apos;s picks</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {featured.map((article) => (
                <a key={article.slug} href={`/blog/${article.slug}`} className="group block rounded-xl overflow-hidden bg-white border border-zinc-200 hover:border-zinc-400 transition-colors">
                  {article.heroImage ? (
                    <img src={article.heroImage} alt={article.title} className="h-36 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-36 flex items-center justify-center text-5xl" style={{ background: GRADIENT_MAP[article.heroGradient || ""] || "linear-gradient(135deg, #18181b, #3f3f46)" }}>
                      {article.heroEmoji || "📝"}
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs text-zinc-400 mb-1.5">{formatDate(article.publishedDate)}</p>
                    <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors leading-snug">{article.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {rest.length > 0 && (
          <section className="border-t border-zinc-200 pt-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📚</span>
              <h2 className="text-2xl font-bold text-zinc-900">More articles</h2>
            </div>
            <p className="text-zinc-500 mb-8">Guides, checklists, and deep dives for your next interview.</p>
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 space-y-8">
                {cardArticles.map((article) => (
                  <a key={article.slug} href={`/blog/${article.slug}`} className="group block">
                    <div className="flex gap-5 items-start">
                      {article.heroImage ? (
                        <img src={article.heroImage} alt={article.title} className="w-40 h-28 rounded-xl shrink-0 object-cover" loading="lazy" />
                      ) : (
                        <div className="w-40 h-28 rounded-xl shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #18181b, #3f3f46)" }}>
                          <span className="text-4xl">📝</span>
                        </div>
                      )}
                      <div className="pt-1">
                        <h3 className="text-base font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors leading-snug mb-2">{article.title}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">{article.metaDescription}</p>
                        <p className="text-xs text-zinc-400 mt-2">{formatDate(article.publishedDate)}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              {sidebarArticles.length > 0 && (
                <div className="lg:w-64 shrink-0">
                  <h3 className="text-base font-bold text-zinc-900 mb-4">Featured articles</h3>
                  <div className="space-y-4">
                    {sidebarArticles.map((article) => (
                      <a key={article.slug} href={`/blog/${article.slug}`} className="block text-sm text-zinc-700 hover:text-zinc-900 transition-colors leading-snug">{article.title}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <div className="mt-12 bg-zinc-900 rounded-2xl px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to prep for your interview?</h2>
          <p className="text-zinc-400 mb-6 leading-relaxed max-w-xl mx-auto">Generate a personalized prep brief for any company — company intel, role expectations, and round-specific strategy in under 10 minutes.</p>
          <a href="/" className="inline-block px-6 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-100 transition-colors text-sm">Build my prep brief &rarr;</a>
        </div>

        <div className="pt-8 border-t border-zinc-200 text-sm text-zinc-400">
          <a href="/" className="hover:text-zinc-600 transition-colors">&larr; Back to PrepFile</a>
        </div>
      </main>
    </div>
  );
}

function BlogArticlePage({ slug }: { slug: string }) {
  const article = blogArticles.find((a) => a.slug === slug);

  useEffect(() => {
    if (!article) return;
    const canonicalUrl = `https://prepfile.app/blog/${article.slug}`;
    document.title = article.metaTitle;
    const setMeta = (attr: string, val: string, isName = false) => {
      const sel = isName ? `meta[name="${attr}"]` : `meta[property="${attr}"]`;
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(isName ? "name" : "property", attr); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };
    setMeta("description", article.metaDescription, true);
    setMeta("og:title", article.metaTitle);
    setMeta("og:description", article.metaDescription);
    setMeta("og:url", canonicalUrl);
    setMeta("twitter:title", article.metaTitle, true);
    setMeta("twitter:description", article.metaDescription, true);
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", canonicalUrl);
    const schemaId = "blog-article-schema";
    let schemaEl = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schemaEl) { schemaEl = document.createElement("script"); schemaEl.id = schemaId; schemaEl.setAttribute("type", "application/ld+json"); document.head.appendChild(schemaEl); }
    schemaEl.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.metaDescription, url: canonicalUrl,
      author: { "@type": "Organization", name: "PrepFile" }, datePublished: article.publishedDate, keywords: article.keywords.join(", "),
      publisher: { "@type": "Organization", name: "PrepFile", url: "https://prepfile.app" },
    });
    return () => { document.title = "PrepFile — AI Interview Prep Briefs"; document.getElementById(schemaId)?.remove(); document.head.querySelector('link[rel="canonical"]')?.remove(); };
  }, [slug, article]);

  if (!article) return null;

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans">
      <Nav />

      <div className="max-w-3xl mx-auto px-6 pt-6 text-sm text-zinc-400">
        <a href="/" className="hover:text-zinc-600 transition-colors">Home</a>
        <span className="mx-2">/</span>
        <a href="/blog" className="hover:text-zinc-600 transition-colors">Blog</a>
        <span className="mx-2">/</span>
        <span className="text-zinc-600 truncate">{article.title}</span>
      </div>

      <header className="max-w-3xl mx-auto px-6 pt-10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-4">{article.title}</h1>
        <p className="text-lg text-zinc-500 leading-relaxed mb-5">{article.metaDescription}</p>
        <div className="flex flex-col gap-1 text-sm text-zinc-500 pb-6 border-b border-zinc-200">
          <p className="text-zinc-400">Updated {formatDate(article.publishedDate)}</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-12">
        <div className="prose-zinc">{renderMarkdown(article.body, article.inlineCta)}</div>

        <section className="mt-10 bg-zinc-900 rounded-2xl px-8 py-10 text-center">
          <p className="text-zinc-300 mb-5 leading-relaxed max-w-xl mx-auto">{article.endCta.text}</p>
          <a href="/" className="inline-block px-6 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-100 transition-colors text-sm">{article.endCta.buttonLabel}</a>
        </section>

        <div className="pt-8 border-t border-zinc-200 text-sm text-zinc-400 flex flex-wrap gap-4">
          <a href="/blog" className="hover:text-zinc-600 transition-colors">&larr; Back to Blog</a>
          <a href="/" className="hover:text-zinc-600 transition-colors">PrepFile Home</a>
        </div>
      </main>
    </div>
  );
}
