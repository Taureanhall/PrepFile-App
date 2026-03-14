import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

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

type Step = "choose" | "email" | "code";

export function AuthPanel({ onDismiss }: AuthPanelProps) {
  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (step === "code") codeInputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSendCode = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      setStep("code");
      setResendCooldown(30);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      // Reload to pick up session
      window.location.href = "/?auth_method=email";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend");
      setResendCooldown(30);
      setCode("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 md:p-12"
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

        <AnimatePresence mode="wait">
          {step === "choose" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                  Ready to prep smarter?
                </h2>
                <p className="text-zinc-500 text-base">
                  Create an account or sign in.
                </p>
              </div>

              {/* Google */}
              <a
                href="/api/auth/google"
                className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-white text-zinc-900 font-semibold text-base rounded-xl border-2 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-colors min-h-[56px]"
              >
                <GoogleIcon />
                Continue with Google
              </a>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-zinc-200" />
                <span className="text-sm text-zinc-400">or</span>
                <div className="flex-1 h-px bg-zinc-200" />
              </div>

              {/* Email input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-zinc-900">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 bg-white border-2 border-zinc-200 rounded-xl focus:outline-none focus:border-brand-600 transition-colors text-base"
                  autoComplete="email"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* Continue button */}
              <button
                onClick={handleSendCode}
                disabled={loading || !isValidEmail(email)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-600 text-white font-semibold text-base rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[56px]"
              >
                {loading ? "Sending..." : "Continue"}
                {!loading && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                )}
              </button>

              {/* Skip — capture email first */}
              <div className="text-center space-y-2">
                {!email.trim() ? (
                  <button
                    onClick={onDismiss}
                    className="text-zinc-400 text-sm hover:text-zinc-600 transition-colors"
                  >
                    Skip for now
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (isValidEmail(email)) {
                        fetch("/api/auth/capture-email", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email }),
                        }).catch(() => {});
                      }
                      onDismiss();
                    }}
                    className="text-zinc-400 text-sm hover:text-zinc-600 transition-colors"
                  >
                    Skip for now
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === "email" && null}

          {step === "code" && (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {/* Back */}
              <button
                onClick={() => { setStep("choose"); setCode(""); setError(null); }}
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Back
              </button>

              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                  Check your email for a code
                </h2>
                <p className="text-zinc-500 text-base">
                  We sent a code to <strong className="text-zinc-900">{email}</strong>. It expires in 10 minutes.
                </p>
              </div>

              {/* Code input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-zinc-900">
                  Enter code
                </label>
                <input
                  ref={codeInputRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                  placeholder="000000"
                  className="w-full px-4 py-3.5 bg-white border-2 border-zinc-200 rounded-xl focus:outline-none focus:border-brand-600 transition-colors text-xl tracking-widest text-center font-mono"
                  autoComplete="one-time-code"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* Resend */}
              <div className="text-sm text-zinc-500">
                Didn't receive your code?{" "}
                {resendCooldown > 0 ? (
                  <span className="text-zinc-400">Resend in {resendCooldown}s</span>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="font-semibold text-zinc-900 hover:underline disabled:opacity-50"
                  >
                    Send new code
                  </button>
                )}
              </div>

              {/* Sign in button */}
              <button
                onClick={handleVerifyCode}
                disabled={loading || code.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-600 text-white font-semibold text-base rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[56px]"
              >
                {loading ? "Verifying..." : "Sign in"}
                {!loading && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
