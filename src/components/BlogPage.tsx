import { useEffect, type ReactNode } from "react";
import { blogArticles, type BlogArticle } from "../marketing/content/blog-articles";

// Simple markdown renderer for the limited subset used in blog articles:
// ## heading → h2, **text** → bold, paragraphs separated by double newlines
function renderMarkdown(body: string, inlineCta: BlogArticle["inlineCta"]) {
  const blocks = body.split(/\n\n+/);
  const result: ReactNode[] = [];
  let ctaInserted = false;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;

    if (block.startsWith("## ")) {
      const headingText = block.slice(3);
      result.push(
        <h2 key={i} className="text-xl font-semibold text-zinc-900 mt-8 mb-3">
          {headingText}
        </h2>
      );
      // Insert inline CTA after the specified heading
      if (!ctaInserted && headingText === inlineCta.afterHeading) {
        ctaInserted = true;
        result.push(
          <div key={`cta-${i}`} className="my-6 bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-5">
            <p className="text-sm text-zinc-600 mb-3">{inlineCta.text}</p>
            <a
              href="/"
              className="inline-block text-sm font-semibold px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              {inlineCta.buttonLabel}
            </a>
          </div>
        );
      }
    } else {
      result.push(
        <p key={i} className="text-zinc-600 leading-relaxed mb-4">
          {renderInline(block)}
        </p>
      );
    }
  }
  return result;
}

function renderInline(text: string): ReactNode {
  // Split on **...** patterns
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-zinc-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

interface BlogPageProps {
  slug?: string;
}

export function BlogPage({ slug }: BlogPageProps) {
  if (slug) {
    return <BlogArticlePage slug={slug} />;
  }
  return <BlogIndexPage />;
}

function BlogIndexPage() {
  useEffect(() => {
    const title = "Interview Prep Blog | PrepFile";
    const description = "Interview prep guides, strategy, and tactics from PrepFile. Learn how to prepare smarter, not longer.";
    const canonicalUrl = "https://prepfile.app/blog";

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

    return () => {
      document.title = "PrepFile — AI Interview Prep Briefs";
      document.head.querySelector('link[rel="canonical"]')?.remove();
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans">
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

      <div className="max-w-3xl mx-auto px-6 pt-6 text-sm text-zinc-400">
        <a href="/" className="hover:text-zinc-600 transition-colors">Home</a>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">Blog</span>
      </div>

      <header className="max-w-3xl mx-auto px-6 pt-10 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
          Interview Prep Blog
        </h1>
        <p className="text-lg text-zinc-500 leading-relaxed">
          Strategy, tactics, and frameworks for candidates who want to prepare smarter.
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-16">
        <ul className="divide-y divide-zinc-100">
          {blogArticles.map((article) => (
            <li key={article.slug}>
              <a
                href={`/blog/${article.slug}`}
                className="flex items-center justify-between py-5 group"
              >
                <div>
                  <span className="text-base font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    {article.title}
                  </span>
                  <p className="text-sm text-zinc-400 mt-1 leading-snug max-w-prose">
                    {article.metaDescription}
                  </p>
                </div>
                <span className="ml-6 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 bg-zinc-900 rounded-2xl px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to prep for your interview?
          </h2>
          <p className="text-zinc-400 mb-6 leading-relaxed max-w-xl mx-auto">
            Generate a personalized prep brief for any company — company intel, role expectations,
            and round-specific strategy in under 10 minutes.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-100 transition-colors text-sm"
          >
            Build my prep brief →
          </a>
        </div>

        <div className="pt-8 border-t border-zinc-200 text-sm text-zinc-400">
          <a href="/" className="hover:text-zinc-600 transition-colors">← Back to PrepFile</a>
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
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(isName ? "name" : "property", attr);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    setMeta("description", article.metaDescription, true);
    setMeta("og:title", article.metaTitle);
    setMeta("og:description", article.metaDescription);
    setMeta("og:url", canonicalUrl);
    setMeta("twitter:title", article.metaTitle, true);
    setMeta("twitter:description", article.metaDescription, true);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    const schemaId = "blog-article-schema";
    let schemaEl = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schemaEl) {
      schemaEl = document.createElement("script");
      schemaEl.id = schemaId;
      schemaEl.setAttribute("type", "application/ld+json");
      document.head.appendChild(schemaEl);
    }
    schemaEl.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.metaDescription,
      url: canonicalUrl,
      keywords: article.keywords.join(", "),
      publisher: {
        "@type": "Organization",
        name: "PrepFile",
        url: "https://prepfile.app",
      },
    });

    return () => {
      document.title = "PrepFile — AI Interview Prep Briefs";
      document.getElementById(schemaId)?.remove();
      document.head.querySelector('link[rel="canonical"]')?.remove();
    };
  }, [slug, article]);

  if (!article) return null;

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans">
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

      <div className="max-w-3xl mx-auto px-6 pt-6 text-sm text-zinc-400">
        <a href="/" className="hover:text-zinc-600 transition-colors">Home</a>
        <span className="mx-2">/</span>
        <a href="/blog" className="hover:text-zinc-600 transition-colors">Blog</a>
        <span className="mx-2">/</span>
        <span className="text-zinc-600 truncate">{article.title}</span>
      </div>

      <header className="max-w-3xl mx-auto px-6 pt-10 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-zinc-500 leading-relaxed">{article.metaDescription}</p>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-12">
        <div className="prose-zinc">
          {renderMarkdown(article.body, article.inlineCta)}
        </div>

        {/* End CTA */}
        <section className="mt-10 bg-zinc-900 rounded-2xl px-8 py-10 text-center">
          <p className="text-zinc-300 mb-5 leading-relaxed max-w-xl mx-auto">
            {article.endCta.text}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-100 transition-colors text-sm"
          >
            {article.endCta.buttonLabel}
          </a>
        </section>

        <div className="pt-8 border-t border-zinc-200 text-sm text-zinc-400 flex flex-wrap gap-4">
          <a href="/blog" className="hover:text-zinc-600 transition-colors">← Back to Blog</a>
          <a href="/" className="hover:text-zinc-600 transition-colors">PrepFile Home</a>
        </div>
      </main>
    </div>
  );
}
