"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, MailCheck } from "lucide-react";
import AuthShell from "@/components/AuthShell";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 45;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  function updateDigit(index, value) {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    if (clean && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted
      .slice(0, OTP_LENGTH)
      .split("")
      .forEach((d, i) => (next[i] = d));
    setDigits(next);
    const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
    inputsRef.current[Math.max(lastIndex, 0)]?.focus();
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    const otp = digits.join("");
    if (otp.length !== OTP_LENGTH) {
      setError(`Enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setError("");
    setMessage("");
    setVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not verify that code.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0 || resending) return;
    setError("");
    setMessage("");
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not resend the code.");
        return;
      }
      setMessage("A fresh code is on its way.");
      setDigits(Array(OTP_LENGTH).fill(""));
      setCooldown(RESEND_COOLDOWN);
      inputsRef.current[0]?.focus();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthShell>
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft text-gold-dark">
        <MailCheck size={19} strokeWidth={1.75} />
      </span>
      <p className="mb-2 text-xs font-medium tracking-wide text-gold-dark">
        Verify your email
      </p>
      <h1 className="font-display text-[1.85rem] leading-tight text-ink">
        Check your inbox
      </h1>
      <p className="mt-2 text-sm text-slate">
        We sent a {OTP_LENGTH}-digit code to{" "}
        <span className="font-medium text-ink">{email || "your email"}</span>.
        Enter it below to finish setting up your vault.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => updateDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="h-14 w-full rounded-xl border border-ink/15 bg-paper-card text-center text-xl font-medium text-ink outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/25"
            />
          ))}
        </div>

        {error && (
          <p className="rounded-xl bg-rust-light px-3 py-2 text-sm text-rust">
            {error}
          </p>
        )}
        {message && !error && (
          <p className="rounded-xl bg-forest-light px-3 py-2 text-sm text-forest-dark">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={verifying}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-ink transition hover:bg-gold-light disabled:opacity-60"
        >
          {verifying ? "Verifying…" : "Verify email"}
          {!verifying && (
            <ArrowRight
              size={15}
              className="transition group-hover:translate-x-0.5"
            />
          )}
        </button>
      </form>

      <p className="mt-7 text-sm text-slate">
        Didn't get a code?{" "}
        <button
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="text-gold-dark underline underline-offset-2 hover:text-gold disabled:cursor-not-allowed disabled:text-slate-light disabled:no-underline"
        >
          {resending
            ? "Sending…"
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend code"}
        </button>
      </p>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
