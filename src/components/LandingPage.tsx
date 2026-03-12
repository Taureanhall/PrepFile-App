import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { landingBaseline, landingVariants, type LandingVariant } from "../marketing/content/landing-variants";
import { trackAbVariant } from "../lib/analytics";

const AB_STORAGE_KEY = "prepfile_ab_landing_v1";
const ALL_VARIANTS: LandingVariant[] = [landingBaseline, ...landingVariants];

function pickVariant(): LandingVariant {
  try {
    const stored = localStorage.getItem(AB_STORAGE_KEY);
    if (stored) {
      const found = ALL_VARIANTS.find((v) => v.id === stored);
      if (found) return found;
    }
    const picked = ALL_VARIANTS[Math.floor(Math.random() * ALL_VARIANTS.length)];
    localStorage.setItem(AB_STORAGE_KEY, picked.id);
    return picked;
  } catch {
    return landingBaseline;
  }
}

interface LandingPageProps {
  onGetStarted: () => void;
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Interview Guides", href: "/interview-prep" },
  { label: "Prep by Role", href: "/interview-prep/roles/pm" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [variant, setVariant] = useState<LandingVariant>(landingBaseline);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const v = pickVariant();
    setVariant(v);
    trackAbVariant(v.id);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans" data-ab-variant={variant.id}>
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">PrepFile</a>
        <div className="flex items-center gap-2">
          <button
            onClick={onGetStarted}
            className="text-sm px-4 py-3 border border-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2.5 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
          </button>
        </div>
      </nav>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex justify-end p-5">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="divide-y divide-zinc-100">
                {NAV_LINKS.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="flex items-center justify-between px-6 py-4 text-base font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
                  >
                    {label}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="m9 18 6-6-6-6"/></svg>
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full text-xs text-zinc-600 mb-8">
          {variant.badge}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
          {variant.headline}
        </h1>
        <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          {variant.subheadline}
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white font-medium text-base rounded-xl hover:bg-zinc-800 transition-colors shadow-sm"
        >
          {variant.cta}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
        <p className="mt-4 text-sm text-zinc-400">Free to try — no credit card required</p>
      </section>

      {/* Footer Nav */}
      <footer className="border-t border-zinc-800 bg-zinc-900 text-zinc-400 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm mb-6">
            <a href="/interview-prep" className="hover:text-white transition-colors">Interview Guides</a>
            <a href="/interview-prep/roles/pm" className="hover:text-white transition-colors">Prep by Role</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="mailto:support@prepfile.app" className="hover:text-white transition-colors">Help</a>
          </div>
          <div className="text-sm">&copy; {new Date().getFullYear()} PrepFile</div>
        </div>
      </footer>
    </div>
  );
}
