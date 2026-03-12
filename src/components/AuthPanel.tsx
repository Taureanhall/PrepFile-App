import { useEffect } from "react";
import { motion } from "motion/react";

interface AuthPanelProps {
  onDismiss: () => void;
}

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export function AuthPanel({ onDismiss }: AuthPanelProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 md:p-12 space-y-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        {/* Close */}
        <button
          onClick={onDismiss}
          className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Ready to prep smarter?
          </h2>
          <p className="text-zinc-500 text-base">
            Create an account or sign in to generate your first brief.
          </p>
        </div>

        {/* Primary CTA — outlined style like Indeed */}
        <a
          href="/api/auth/google"
          className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-white text-zinc-900 font-semibold text-base rounded-xl border-2 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-colors min-h-[56px]"
        >
          <GoogleIcon />
          Continue with Google
        </a>

        {/* Skip */}
        <div className="text-center">
          <button
            onClick={onDismiss}
            className="text-zinc-400 text-sm hover:text-zinc-600 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
