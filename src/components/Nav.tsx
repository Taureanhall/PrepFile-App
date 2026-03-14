import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Interview Guides", href: "/interview-prep" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "For Bootcamps", href: "/for/career-services" },
  { label: "For Recruiters", href: "/for/recruiting-agencies" },
];

interface NavProps {
  cta?: { label: string; href: string } | { label: string; onClick: () => void };
  /** Extra elements rendered before the hamburger (e.g. user controls) */
  children?: ReactNode;
  /** Called when logo or Home is clicked — lets parent reset SPA state */
  onLogoClick?: () => void;
}

export function Nav({ cta, children, onLogoClick }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const ctaElement = cta ? (
    "href" in cta ? (
      <a href={cta.href} className="text-sm px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition-colors">
        {cta.label}
      </a>
    ) : (
      <button onClick={cta.onClick} className="text-sm px-4 py-3 border border-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors">
        {cta.label}
      </button>
    )
  ) : (
    <a href="/" className="text-sm px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition-colors">
      Get your prep brief
    </a>
  );

  return (
    <>
      <nav className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center border-b border-zinc-100">
        <a
          href="/"
          onClick={(e) => {
            if (onLogoClick && window.location.pathname === "/") {
              e.preventDefault();
              onLogoClick();
            }
          }}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="" className="h-8 w-8 rounded-full object-cover object-center" />
          <span className="text-2xl font-bold tracking-tight">PrepFile</span>
        </a>
        <div className="flex items-center gap-2">
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 mr-2">
            <a href="/interview-prep" className="text-sm font-medium text-zinc-700 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors">Interview Guides</a>
            <a href="/pricing" className="text-sm font-medium text-zinc-700 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors">Pricing</a>
          </div>
          {children}
          {ctaElement}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2.5 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
          </button>
        </div>
      </nav>

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
                    onClick={(e) => {
                      if (href === "/" && onLogoClick && window.location.pathname === "/") {
                        e.preventDefault();
                        onLogoClick();
                        setMenuOpen(false);
                      }
                    }}
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
    </>
  );
}
