"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send the reset link.");
        return;
      }
      setMessage(data.message);
      setSent(true);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-10 flex items-center gap-2 text-sm text-slate"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-seal text-[10px] font-semibold text-ink">
            CV
          </span>
          CertVault
        </Link>

        <h1 className="font-display text-2xl text-ink">Reset your password</h1>
        <p className="mt-2 text-sm text-slate">
          Enter the email on your account and we'll send you a reset link.
        </p>

        {sent ? (
          <p className="mt-8 rounded-sm bg-forest-light px-4 py-3 text-sm text-forest">
            {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-ink/15 bg-paper px-3 py-2.5 text-sm text-ink outline-none transition focus:border-gold"
              />
            </label>

            {error && (
              <p className="rounded-sm bg-rust-light px-3 py-2 text-sm text-rust">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-sm bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-ink-light disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-slate">
          <Link href="/login" className="text-gold-dark underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
