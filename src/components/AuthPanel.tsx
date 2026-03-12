import { useEffect, useState } from "react";

interface AuthPanelProps {
  onDismiss: () => void;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

type OtpStep = "idle" | "sending" | "sent" | "verifying" | "error";

export function AuthPanel({ onDismiss }: AuthPanelProps) {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [otpStep, setOtpStep] = useState<OtpStep>("idle");
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function requestOtp() {
    if (!email.trim()) return;
    setOtpStep("sending");
    setOtpError("");
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({ error: "Something went wrong" }));
        throw new Error(d.error || "Failed to send code");
      }
      setOtpStep("sent");
    } catch (err: any) {
      setOtpError(err.message);
      setOtpStep("error");
    }
  }

  async function verifyOtp() {
    if (!code.trim()) return;
    setOtpStep("verifying");
    setOtpError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({ error: "Invalid code" }));
        throw new Error(d.error || "Invalid code");
      }
      window.location.reload();
    } catch (err: any) {
      setOtpError(err.message);
      setOtpStep("sent");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 space-y-6">
        {/* Close */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="font-bold text-zinc-900 text-lg tracking-tight">PrepFile</div>
          <p className="text-zinc-500 text-sm">Ace your next interview</p>
        </div>

        {!showOtp ? (
          <>
            {/* Google */}
            <a
              href="/api/auth/google"
              className="flex items-center justify-center gap-3 w-full px-4 py-3.5 bg-zinc-900 text-white font-medium text-sm rounded-xl hover:bg-zinc-800 transition-colors min-h-[48px]"
            >
              <GoogleIcon />
              Continue with Google
            </a>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-200" />
              <span className="text-xs text-zinc-400">or</span>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>

            {/* Email OTP toggle */}
            <button
              onClick={() => setShowOtp(true)}
              className="w-full px-4 py-3.5 border border-zinc-200 text-zinc-700 font-medium text-sm rounded-xl hover:bg-zinc-50 transition-colors"
            >
              Sign in with email
            </button>
          </>
        ) : otpStep === "sent" ? (
          <>
            <div className="text-center">
              <p className="text-sm text-zinc-600">We sent a 6-digit code to</p>
              <p className="text-sm font-semibold text-zinc-900">{email}</p>
            </div>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              autoFocus
            />
            {otpError && <p className="text-sm text-red-600 text-center">{otpError}</p>}
            <button
              onClick={verifyOtp}
              disabled={code.length !== 6 || otpStep === "verifying"}
              className="w-full px-4 py-3.5 bg-zinc-900 text-white font-medium text-sm rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {otpStep === "verifying" ? "Verifying..." : "Verify code"}
            </button>
            <button
              onClick={() => { setOtpStep("idle"); setCode(""); setOtpError(""); }}
              className="w-full text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Use a different email
            </button>
          </>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              autoFocus
            />
            {otpError && <p className="text-sm text-red-600">{otpError}</p>}
            <button
              onClick={requestOtp}
              disabled={!email.trim() || otpStep === "sending"}
              className="w-full px-4 py-3.5 bg-zinc-900 text-white font-medium text-sm rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {otpStep === "sending" ? "Sending code..." : "Send verification code"}
            </button>
            <button
              onClick={() => { setShowOtp(false); setOtpError(""); }}
              className="w-full text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Back to sign in options
            </button>
          </>
        )}

        {/* Skip */}
        <div className="text-center">
          <button
            onClick={onDismiss}
            className="text-zinc-400 text-xs hover:text-zinc-600 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
