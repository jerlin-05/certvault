"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck, ArrowRight } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import FormField from "@/components/FormField";

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
    <AuthShell>
      <p className="mb-2 text-xs font-medium tracking-wide text-gold-dark">
        Account recovery
      </p>
      <h1 className="font-display text-[1.85rem] leading-tight text-paper">
        Reset your password
      </h1>
      <p className="mt-2 text-sm text-slate">
        Enter the email on your account and we'll send you a reset link.
      </p>

      {sent ? (
        <div className="mt-8 flex items-start gap-3 rounded-xl bg-forest-light px-4 py-4 text-sm text-forest">
          <MailCheck size={18} className="mt-0.5 shrink-0" />
          <p>{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            autoComplete="email"
          />

          {error && (
            <p className="rounded-xl bg-rust-light px-3 py-2 text-sm text-rust">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-paper transition hover:bg-gold-light disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset link"}
            {!loading && (
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-0.5"
              />
            )}
          </button>
        </form>
      )}

      <p className="mt-7 text-sm text-slate">
        <Link
          href="/login"
          className="text-gold-dark underline underline-offset-2 hover:text-gold"
        >
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
